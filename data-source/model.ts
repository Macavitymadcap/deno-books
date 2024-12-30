export interface BookInfo {
  isbn: string;
  title: string;
  authors: string[];
  illustrators?: string[];
  publisher?: string;
  publishDate?: string;
  pageCount?: number;
  source: string;
}

export interface BookDataSource {
  name: string;
  getBookByISBN(isbn: string): Promise<BookInfo | null>;
}
