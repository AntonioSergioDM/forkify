import { ANIM_DUR_SEC, MODAL_CLOSE_SEC } from '../config';
import { isUrl } from '../helpers';
import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _errorMessage = "Sorry! You can't add a recipe right now :(";

  _windowElement = document.querySelector('.add-recipe-window');
  _overlayElement = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerAddIng();
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    [this._btnClose, this._overlayElement].forEach(el =>
      el.addEventListener('click', this._toggleWindow.bind(this))
    );
  }

  _addHandlerAddIng() {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.upload__ing--btn');

        if (!btn) return;

        this._getData();

        const ingList = e.target.closest('.upload__column');

        ingList.innerHTML = '';
        ingList.insertAdjacentHTML(
          'afterbegin',
          `
      ${
        this._data.err
          ? this._generateMarkupIngs('Incorrect Format')
          : this._generateMarkupIngs()
      } 
      ${this._generateMarkupAddIngBtn()}
      `
        );

        if (this._data.err) {
          this._getData();
          setTimeout(
            function () {
              this.update(this._data);
            }.bind(this),
            MODAL_CLOSE_SEC * 1000
          );
        }
      }.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        // Get Data
        this._getData();

        // Data validation
        if (!this._isDataValid()) {
          this.renderError(this._data.err);
          // Regenerate Form
          setTimeout(
            function () {
              this.render(this._data);
            }.bind(this),
            MODAL_CLOSE_SEC * 1000
          );
          return;
        }

        // Pass Data to the handler function
        handler(this._data);
      }.bind(this)
    );
  }

  _isDataValid() {
    if (this._data.err) return false;

    if (this._data.title.length <= 5)
      this._data.err =
        'The title is too short! <br> Give the recipe a decent name ;)';
    else if (!isUrl(this._data.sourceUrl))
      this._data.err = 'Invalid URL! <br> Try copying it from the browser ;)';
    else if (!isUrl(this._data.image))
      this._data.err = 'Invalid Image URL! <br> Make sure is an image ;)';
    else if (this._data.publisher.length < 2)
      this._data.err = 'A publisher with less than 3 letters? Really?';
    else if (this._data.cookingTime < 1)
      this._data.err =
        "Cooking time must be positive!<br>You can't cook into the past!";
    else if (this._data.servings < 1)
      this._data.err =
        "Servings must be positive!<br>You can't serve negative people!";
    else if (this._data.ingredients.length === 0)
      this._data.err = "You can't cook without ingredients!";
    else return true;

    return false;
  }

  _getData() {
    const dataArr = [...new FormData(this._parentElement)];
    const data = Object.fromEntries(dataArr);

    // Numeric fields as numbers
    data.cookingTime = +data.cookingTime;
    data.servings = +data.servings;

    data.ingredients = [];
    dataArr
      .filter(entry => entry[0].startsWith('ingredient') && entry[1])
      .forEach(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) {
          data.err =
            'Wrong ingredient format! <br> Format: <br> Quantity, Unit, Description';
          return;
        }

        const [quantity = null, unit, description] = ingArr;
        data.ingredients.push({
          quantity: +quantity ? +quantity : null,
          unit,
          description,
        });
      });

    this._data = data;
    return this;
  }

  closeWindow() {
    if (this.isWindowOpen()) this._toggleWindow();
  }

  isWindowOpen() {
    return !this._windowElement.classList.contains('hidden');
  }

  _toggleWindow() {
    this._overlayElement.classList.toggle('hidden');
    this._windowElement.classList.toggle('hidden');

    setTimeout(
      function () {
        this._parentElement.querySelector('[name="title"]').focus();
      }.bind(this),
      ANIM_DUR_SEC * 1000
    );
  }

  _generateMarkup() {
    let markup = `
    
    <h3 class="upload__heading">Recipe data</h3>
    <h3 class="upload__heading">Ingredients</h3>
    <div class="upload__column">
        <label>Title</label>
        <input 
          required 
          value="${this._data.title || ''}" 
          name="title" 
          type="text" 
          placeholder="My Recipe"
        />
        <label>URL</label>
        <input 
          required 
          value="${this._data.sourceUrl || ''}" 
          name="sourceUrl" 
          type="text" 
          placeholder="https://forkify-antoniosergio.netlify.app/"
        />
        <label>Image URL</label>
        <input 
          required 
          value="${this._data.image || ''}" 
          name="image" 
          type="text" 
          placeholder="https://forkify-antoniosergio.netlify.app/logo.8a7af738.png" 
        />
        <label>Publisher</label>
        <input 
          required 
          value="${this._data.publisher || ''}" 
          name="publisher" 
          type="text" 
          placeholder="Myself and I"
        />
        <label>Prep time</label>
        <input 
          required 
          value="${this._data.cookingTime || ''}" 
          name="cookingTime" 
          type="number" 
          placeholder="in minutes"
        />
        <label>Servings</label>
        <input 
          required 
          value="${this._data.servings || ''}" 
          name="servings" 
          type="number"
          placeholder="in people"
        />
      </div>

      <div class="upload__column">
        ${this._generateMarkupIngs()}
        ${this._generateMarkupAddIngBtn()}
      </div>

      <button class="btn upload__btn">
        <svg>
          <use href="${this._icons}#icon-upload-cloud"></use>
        </svg>
        <span>Upload</span>
      </button>
    `;
    return markup;
  }
  /**Generates input fields for all the ingredients and an empty one */
  _generateMarkupIngs(placeholder = 'Format: Quantity,Unit,Description') {
    const ingredients = this._data.ingredients?.length
      ? this._data.ingredients
      : [];
    ingredients.push({}); // Always an empty one

    let markup = '';

    ingredients.forEach(function (ing, i) {
      markup += `
        <label>Ingredient ${i + 1}</label>
        <input 
          ${i === 0 ? /*'required'*/ '' : ''} 
          value="${
            typeof ing.unit !== 'string'
              ? ''
              : `${ing.quantity || ''}, ${ing.unit}, ${ing.description}`
          }"
          type="text"
          name="ingredient-${i + 1}"
          placeholder="${placeholder}"
        />
    `;
    });
    return markup;
  }

  _generateMarkupAddIngBtn() {
    return `
      <button type="button" class="btn upload__ing--btn">
        <svg>
          <use href="${this._icons}#icon-plus-circle"></use>
        </svg>
        <span>Add Ingredient</span>
      </button>
    `;
  }
}

export default new AddRecipeView();
