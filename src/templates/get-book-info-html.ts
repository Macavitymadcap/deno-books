import { BookInfo } from "../data-source/model.ts";

export const getBookInfoHTML = (bookInfo: BookInfo): string => {
  return `
    <article id="book-info-${bookInfo.isbn}" class="card book">
      <h2>${bookInfo.title}</h2>
      <div class="flex-row centred">
        <span class="chip">
          <button 
            hx-get="/editbookform/${bookInfo.isbn}" 
            hx-target="#book-info-${bookInfo.isbn}" 
            title="Edit Book"
          >
            &#9998;
          </button>
          <button 
            class="destructive" 
            hx-get="/confirmdelete/${bookInfo.isbn}" 
            hx-target="#book-info-${bookInfo.isbn}"
            title="Delete Book"
          >
            &#10006;
          </button>
        </span>
      </div>
      <dl class="book-info">
        <dt>ISBN</dt><dd>${bookInfo.isbn}</dd>
        <dt>Authors</dt><dd>${bookInfo.authors.join(", ")}</dd>
        ${bookInfo.illustrators ? `<dt>Illustrators</dt><dd>${bookInfo.illustrators!.join(", ")}</dd>` : ""}
        ${bookInfo.publisher ? `<dt>Publisher</dt><dd>${bookInfo.publisher}</dd>` : ""}
        ${bookInfo.publishDate ? `<dt>Publish Date</dt><dd>${bookInfo.publishDate}</dd>`: ""}
        ${bookInfo.pageCount ? `<dt>Page Count</dt><dd>${bookInfo.pageCount}</dd>` : ""}
        <dt>Source</dt><dd>${bookInfo.source}</dd>
      </dl>
    </article>
  `;
};
