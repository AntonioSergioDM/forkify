import { MAX_PAGE_BUTTONS } from '../config';
import { maxOf, minOf } from '../helpers';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.btn--inline');
        if (!btn) return;

        const goToPage = +btn.dataset.goto;
        console.log(goToPage);
        if (goToPage === this._data.page) return;

        handler(goToPage);
      }.bind(this)
    );
  }

  _generateMarkup() {
    // Pages Values
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    ///// Rendering logic /////
    let markup = '';

    // Prev Page Btn - Page 2, 3, ...
    markup += this._generateMarkupBtn(
      'prev',
      currPage - 1,
      `icon-arrow-left`,
      !(currPage > 1)
    );

    // Page Numbers - more than one page
    if (numPages > 1) {
      // Max page number buttons is MAX_PAGE_BUTTONS
      const maxBtns = MAX_PAGE_BUTTONS;
      const nearBtns = Math.trunc(maxBtns / 2);

      const pageStart =
        numPages > maxBtns && currPage > nearBtns
          ? minOf(currPage - nearBtns, numPages - (maxBtns - 1))
          : 1;
      const pageEnd =
        numPages > maxBtns && currPage < numPages - nearBtns
          ? maxOf(currPage + nearBtns, maxBtns)
          : numPages;

      for (let page = pageStart; page <= pageEnd; page++) {
        markup += this._generateMarkupBtn('number', page);
      }
    }

    // Next Page Btn - Page 1 (if there are other pages), 2, ..., numPages-1
    markup += this._generateMarkupBtn(
      'next',
      currPage + 1,
      `icon-arrow-right`,
      !(currPage < numPages && numPages > 1)
    );

    return markup;
  }

  _generateMarkupBtn(
    type = 'next',
    goto = this._data.page + 1,
    img = `icon-arrow-right`,
    hidden = false
  ) {
    return `
      <button class="btn--inline pagination__btn--${type}${
      goto === this._data.page && type === 'number' ? '--on-page' : ''
    } ${hidden ? 'hidden' : ''}" data-goto="${goto}">
        ${
          type !== 'number'
            ? `
        <svg class="search__icon">
          <use href="${this._icons}#${img}"></use>
        </svg>`
            : goto
        }
      </button>
    `;
  }
}

export default new PaginationView();
