import { maxOf, minOf } from '../helpers';
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
    // Pages Values
    const currPage = this._data.page;
    const numPages = 10; /*Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );//*/
    const path = this._icons;

    // Button markup
    const btnMarkup = function (
      type = 'next',
      goto = currPage + 1,
      img = `${path}#icon-arrow-right`
    ) {
      return `
        <button class="btn--inline pagination__btn--${type}${
        goto === currPage && type === 'number' ? '--on-page' : ''
      }" data-goto="${goto}">
          ${
            type !== 'number'
              ? `
          <svg class="search__icon">
            <use href="${img}"></use>
          </svg>`
              : goto
          }
        </button>
      `;
    };

    // rendering logic
    let markup = '';

    // Prev Page Btn - Page 2, 3, ...
    if (currPage > 1)
      markup += btnMarkup('prev', currPage - 1, `${path}#icon-arrow-left`);

    // Page Numbers - more than one page
    if (numPages > 1) {
      // MAx page number buttons is 7
      const pageStart =
        numPages > 7 && currPage > 3 ? minOf(currPage - 3, numPages - 6) : 1;
      const pageEnd =
        numPages > 7 && currPage < numPages - 3
          ? maxOf(currPage + 3, 7)
          : numPages;

      for (let page = pageStart; page <= pageEnd; page++) {
        markup += btnMarkup('number', page);
      }
    }

    // Next Page Btn - Page 1 if there are other pages, 2, ..., numPages-1
    if (currPage < numPages && numPages > 1)
      markup += btnMarkup('next', currPage + 1, `${path}#icon-arrow-right`);

    return markup;
  }
}

export default new PaginationView();
