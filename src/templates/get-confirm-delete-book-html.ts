import { BookInfo } from "../data-source/model.ts";

export const getConfirmDeleteBookHTML = (bookInfo: BookInfo): string => {
    return `
        <form 
            hx-delete="/deletebook/${bookInfo.isbn}" 
            hx-target="#book-info-${bookInfo.isbn}" 
            hx-swap="outerHTML"
            class="flex-column"
        >
            <h2>Delete ${bookInfo.title}</h2>
            <p>Are you sure you want to delete ${bookInfo.title}?</p>
            <div class="flex-row">
                <button
                    type="submit" 
                    hx-delete="/deletebook/${bookInfo.isbn}"
                    title="Delete Book"
                >
                    &#128465;
                </button>
                <button 
                    class="destructive"
                    type="reset" 
                    hx-get="/getbook/${bookInfo.isbn}" 
                    hx-swap="outerHTML"
                    title="Cancel Delete"
                >
                    &#10006;
                </button>
            </div>
        </form>
    `;
}