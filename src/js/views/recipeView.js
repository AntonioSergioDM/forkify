import View from './View';

import { Fraction } from 'fractional';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try again!';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;

      handler();
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${this._icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${this._icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${this._icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${this._icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${this._icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${this._icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._data.ingredients
          .map(this._generateMArkupIngredient.bind(this))
          .join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
`;
  }
  _generateMArkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${this._icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? this._fractionString(ing.quantity) : ''
        }</div>
        <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
        </div>
      </li>
    `;
  }

  _fractionString(qt) {
    const getFactor = function (num) {
      if (num <= 0.06) return new Fraction(0);
      if (0.06 <= num && num <= 0.14) return new Fraction(1, 8);
      if (0.14 <= num && num <= 0.21) return new Fraction(1, 6);
      if (0.21 <= num && num <= 0.29) return new Fraction(1, 4);
      if (0.29 <= num && num <= 0.36) return new Fraction(1, 3);
      if (0.36 <= num && num <= 0.44) return new Fraction(3, 8);
      if (0.44 <= num && num <= 0.56) return new Fraction(1, 2);
      if (0.56 <= num && num <= 0.64) return new Fraction(5, 8);
      if (0.64 <= num && num <= 0.7) return new Fraction(2, 3);
      if (0.7 <= num && num <= 0.8) return new Fraction(3, 4);
      if (0.8 <= num && num <= 0.85) return new Fraction(5, 6);
      if (0.85 <= num && num <= 0.94) return new Fraction(7, 8);
      if (0.94 <= num) return new Fraction(1);
    };

    const fraction = getFactor(qt % 1);
    const qtTrunc = Math.trunc(qt);

    return fraction.add(qtTrunc).toString();
  }
}

export default new RecipeView();
