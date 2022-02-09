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
    const btnMarkup = function (
      type = 'next',
      goto = this._data.page + 1,
      direction = 'right'
    ) {
      return `
        <button class="btn--inline pagination__btn--${type}" data-goto="${goto}">
          <svg class="search__icon">
            <use href="${this._icons}#icon-arrow-${direction}"></use>
          </svg>
          <span>Page ${goto}</span>
        </button>
      `;
    };

    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    let markup = '';

    // Prev Page Btn - Page 2, 3, ...
    if (currPage > 1) markup += btnMarkup('prev', currPage - 1, 'left');

    // Next Page Btn - Page 1 if there are other pages, 2, ..., numPages-1
    if (currPage < numPages && numPages > 1)
      markup += btnMarkup('next', currPage + 1, 'right');

    return markup;
  }
}

export default new PaginationView();
