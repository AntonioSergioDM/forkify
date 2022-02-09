import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    let markup = '';

    // Prev Page Btn - Page 2, 3, ...
    if (currPage > 1)
      markup += `
		<button class="btn--inline pagination__btn--prev" data-goto="${currPage - 1}">
				<svg class="search__icon">
					<use href="${this._icons}#icon-arrow-left"></use>
				</svg>
				<span>Page ${currPage - 1}</span>
			</button>`;

    // Next Page Btn - Page 1 if there are other pages, 2, ..., numPages-1
    if (currPage < numPages && numPages > 1)
      markup += `
			<button class="btn--inline pagination__btn--next" data-goto="${currPage + 1}">
				<span>Page ${currPage + 1}</span>
				<svg class="search__icon">
					<use href="${this._icons}#icon-arrow-right"></use>
				</svg>
			</button>
      `;

    return markup;
  }
}

export default new PaginationView();
