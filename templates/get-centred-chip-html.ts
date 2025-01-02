export const getCenteredChipHTML = (chipText: string): string => {
  return `
    <div class="centred">
        <span class="chip">
            <span class="chip-label">${chipText}</span>
            <button class="destructive" _="on click remove closest <span.chip/>">&#10006;</button>
        </span>
    </div>
    `;
};
