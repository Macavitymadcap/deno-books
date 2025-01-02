import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { BookInfo } from "../data-source/model.ts";
import { Book, BookRow, CreatorRow, DatabaseID } from "./model.ts";

export class BookDatabase {
  private db: DB;

  constructor(dbPath: string) {
    this.db = new DB(dbPath);
    this.initializeDatabase();
  }

  addBook(bookInfo: BookInfo) {
    try {
      this.db.execute("BEGIN TRANSACTION");
      this.db.query(
        "INSERT OR REPLACE INTO books (isbn, title, publisher, publish_date, page_count, source) VALUES (?, ?, ?, ?, ?, ?)",
        [
          bookInfo.isbn,
          bookInfo.title,
          bookInfo.publisher,
          bookInfo.publishDate,
          bookInfo.pageCount,
          bookInfo.source,
        ],
      );

      this.updateBookAuthors(bookInfo.isbn, bookInfo.authors);

      if (bookInfo.illustrators && bookInfo.illustrators.length > 0) {
        this.updateBookIllustrators(bookInfo.isbn, bookInfo.illustrators);
      }

      this.db.execute("COMMIT");
    } catch (error) {
      this.db.execute("ROLLBACK");
      throw error;
    }
  }

  editBook(bookInfo: BookInfo) {
    try {
      this.db.execute("BEGIN TRANSACTION");
      this.db.query(
        `UPDATE books 
         SET title = ?, publisher = ?, publish_date = ?, page_count = ?, source = ?
         WHERE isbn = ?`,
        [
          bookInfo.title,
          bookInfo.publisher,
          bookInfo.publishDate,
          bookInfo.pageCount,
          bookInfo.source,
          bookInfo.isbn,
        ],
      );

      this.updateBookAuthors(bookInfo.isbn, bookInfo.authors);

      if (bookInfo.illustrators && bookInfo.illustrators.length > 0) {
        this.updateBookIllustrators(bookInfo.isbn, bookInfo.illustrators);
      }

      this.db.execute("COMMIT");
    } catch (error) {
      this.db.execute("ROLLBACK");
      throw error;
    }
  }

  getBook(isbn: string): BookInfo | null {
    const book = this.db.queryEntries<BookRow>(
      "SELECT * FROM books WHERE isbn = ?",
      [isbn],
    )[0];

    if (!book) return null;

    const authors = this.getCreatorByISBN(isbn, "author");
    const illustrators = this.getCreatorByISBN(isbn, "illustrator");

    return this.combineBookInfo(book, authors, illustrators);
  }

  searchBooks(query: string): BookInfo[] {
    const books = this.db.queryEntries<BookRow>(
      `SELECT DISTINCT books.* 
       FROM books 
       LEFT JOIN book_authors ON books.isbn = book_authors.book_isbn 
       LEFT JOIN authors ON book_authors.author_id = authors.id
       LEFT JOIN book_illustrators ON books.isbn = book_illustrators.book_isbn 
       LEFT JOIN illustrators ON book_illustrators.illustrator_id = illustrators.id 
       WHERE books.title LIKE ? 
       OR authors.name LIKE ?
       OR illustrators.name LIKE ?`,
      [`%${query}%`, `%${query}%`],
    );

    return books.map((book: Book) => {
      const authors = this.getCreatorByISBN(book.isbn, "author");
      const illustrators = this.getCreatorByISBN(book.isbn, "illustrator");

      return this.combineBookInfo(book, authors, illustrators);
    });
  }

  deleteBook(isbn: string) {
    const book = this.getBook(isbn);
    if (!book) {
      throw { message: `Book with ISBN: ${isbn} not found.` };
    }
    this.db.query("DELETE FROM books WHERE isbn = ?", [isbn]);
  }

  closeDB() {
    this.db.close();
  }

  private initializeDatabase() {
    this.createBooksTable();
    this.createAuthorsTable();
    this.createIllustratorsTable();
    this.createBookAuthorsTable();
    this.createBookIllustratorsTable();
    this.createUpdateBooksTimestampTrigger();
  }

  private createBooksTable() {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS books (
        isbn TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        publisher TEXT,
        publish_date TEXT,
        page_count INTEGER,
        source TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private createAuthorsTable() {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `);
  }

  private createIllustratorsTable() {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS illustrators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `);
  }

  private createBookAuthorsTable() {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS book_authors (
        book_isbn TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        PRIMARY KEY (book_isbn, author_id),
        FOREIGN KEY (book_isbn) REFERENCES books(isbn) ON DELETE CASCADE,
        FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
      )
    `);
  }

  private createBookIllustratorsTable() {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS book_illustrators (
        book_isbn TEXT NOT NULL,
        illustrator_id INTEGER NOT NULL,
        PRIMARY KEY (book_isbn, illustrator_id),
        FOREIGN KEY (book_isbn) REFERENCES books(isbn) ON DELETE CASCADE,
        FOREIGN KEY (illustrator_id) REFERENCES illustrators(id) ON DELETE CASCADE
      )
    `);
  }

  private createUpdateBooksTimestampTrigger() {
    this.db.execute(`
      CREATE TRIGGER IF NOT EXISTS update_books_timestamp 
      AFTER UPDATE ON books
      BEGIN
        UPDATE books SET updated_at = CURRENT_TIMESTAMP WHERE isbn = NEW.isbn;
      END;
    `);
  }

  private getCreatorByISBN(isbn: string, creatorType: string): string[] {
    return this.db.queryEntries<CreatorRow>(
      `SELECT ${creatorType}s.name 
       FROM ${creatorType}s 
       JOIN book_${creatorType}s ON ${creatorType}s.id = book_${creatorType}s.${creatorType}_id 
       WHERE book_${creatorType}s.book_isbn = ?`,
      [isbn],
    ).map((creator) => creator.name);
  }

  private updateBookCreators(
    isbn: string,
    creators: string[],
    creatorType: string,
  ) {
    const creatorID = creatorType.replace(/s$/, "_id");
    const tableName = "book_" + creatorType;

    for (const creatorName of creators) {
      this.db.query(
        `INSERT OR IGNORE INTO ${creatorType} (name) VALUES (?)`,
        [creatorName],
      );

      const authorId = this.db.queryEntries<DatabaseID>(
        `SELECT id FROM ${creatorType} WHERE name = ?`,
        [creatorName],
      )[0].id;

      this.db.query(
        `INSERT INTO ${tableName} (book_isbn, ${creatorID}) VALUES (?, ?)`,
        [isbn, authorId],
      );
    }
  }

  private updateBookAuthors(isbn: string, authors: string[]) {
    this.db.query("DELETE FROM book_authors WHERE book_isbn = ?", [isbn]);
    this.updateBookCreators(isbn, authors, "authors");
  }

  private updateBookIllustrators(isbn: string, illustrators: string[]) {
    this.db.query("DELETE FROM book_illustrators WHERE book_isbn = ?", [isbn]);
    this.updateBookCreators(isbn, illustrators, "illustrators");
  }

  private combineBookInfo(
    book: Book,
    authors: string[],
    illustrators?: string[],
  ): BookInfo {
    return {
      isbn: book.isbn,
      title: book.title,
      authors,
      ...(illustrators && illustrators.length > 0 && { illustrators }),
      publisher: book.publisher ?? undefined,
      publishDate: book.publish_date ?? undefined,
      pageCount: book.page_count ?? undefined,
      source: book.source,
    };
  }
}
