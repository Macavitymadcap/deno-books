import { BookInfo } from "../data-source/model.ts";

export const getBookFormHTML = (bookInfo: BookInfo): string => {
  return `
    <article class="card">
      <h2>Add Book</h2>
      <search class="centred">
        <form
          id="add-isbn-form"
          class="flex-row centred"
          hx-post="/addisbn"
          hx-target="#content"
        >
          <div class="flex-column">
            <label for="addisbn">Add ISBN</label>
            <input type="text" name="addisbn" id="addisbn" required>
          </div>
          <span class="chip">
            <button type="submit" hx-indicator="#addisbn-indicator" title="Search ISBN">&#128269;</button>
            <img
              id="addisbn-indicator"
              class="htmx-indicator"
              src="static/spinner.gif"
            />
            <button
              class="destructive"
              type="reset"
              hx-indicator="#addisbn-indicator"
              onclick="htmx.trigger('#add-isbn-form', 'htmx:abort')"
              _="on click set @value of <input/> in #add-book-form to ''"
              title="Clear"
            >
              &#10006;
            </button>
          </span>
        </form>
      </search>

      <form 
        id="add-book-form" 
        hx-post="/addbook" 
        hx-target="#content" 
        class="flex-column"
      >    
        <div class="flex-row">
          <div class="flex-column">
            <label for="isbn">ISBN</label>
            <input type="text" name="isbn" id="isbn" required value="${bookInfo.isbn}">
          </div>

          <div class="flex-column">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" required value="${bookInfo.title}">
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

        <div class="flex-row">
          <button
            id="add-book-button"
            type="submit"
            hx-indicator="#addbook-indicator"
            title="Add Book"
          >
          &#43;
          </button>
          <img
            id="addbook-indicator"
            class="htmx-indicator"
            src="static/spinner.gif"
            />
        </div>
      </form>
    </article>
  `;
};
