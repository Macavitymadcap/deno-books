import { BookInfo } from "../data-source/model.ts";

export const getEditBookFormHTML = (bookInfo: BookInfo): string => {
  return `
    <form 
      id="#edit-book-form" 
      class="flex-column"
      hx-patch="/editbook/${bookInfo.isbn}"
      hx-target="#book-info-${bookInfo.isbn}"
      hx-swap="outerHTML"
    >    
      <div class="flex-row">
        <div class="flex-column">
          <label for="isbn">ISBN</label>
          <input type="text" name="isbn" id="isbn" required value = "${bookInfo.isbn}">
        </div>

        <div class="flex-column">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" required value = "${bookInfo.title}">
        </div>
      </div>

      <div class="flex-row">
        <div class="flex-column">
          <label for="authors">Authors</label>
          <input type="text" name="authors" id="authors" value="${bookInfo.authors}">
        </div>

        <div class="flex-column">
          <label for="illustrators">Illustrators</label>
          <input type="text" name="illustrators" id="illustrators" ${bookInfo.illustrators || ""}>
        </div>
      </div>

      <div class="flex-row">
        <div class="flex-column">
          <label for="publisher">Publisher</label>
          <input type="text" name="publisher" id="publisher" value="${bookInfo.publisher || ""}">
        </div>

        <div class="flex-column">
          <label for="publish-date">Publish Date</label>
          <input type="text" name="publish-date" id="publish-date" value="${bookInfo.publishDate || ""}">
        </div>
      </div>

      <div class="flex-row">
        <div class="flex-column">
          <label for="page-count">Page Count</label>
          <input type="number" name="page-count" id="page-count" value="${bookInfo.pageCount || ""}">
        </div>

        <div class="flex-column">
          <label for="source">Source</label>
          <input type="text" name="source" id="source" list="sources" value="${bookInfo.source}">
          <datalist id="sources">
            <option value="OpenLibrary">
            <option value="GoogleBooks">
            <option value="ManualEntry">
          </datalist>
        </div>
      </div>
      <div class="centred">
        <menu class="flex-row">
          <button type="submit" title="Save Changes">
            &#9998;
          </button>
          <button
            class="destructive"
            type="reset"
            hx-get="/getbook/${bookInfo.isbn}"
            hx-target="#book-info-${bookInfo.isbn}"
            hx-swap="outerHTML"
            title="Cancel Changes"
          >
            &#10006;
          </button>
        </menu>
      </div>
    </form>
  `;
};