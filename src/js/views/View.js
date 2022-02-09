// Import icons - the url to use to acess it because of using parcel to compress transpilling and polyfiling our code
import icons from 'url:../../img/icons.svg';

/**
 * Defines the functions and paths common to all the Views
 * @abstract
 */
export default class View {
  _data;
  /**
   * Path to icons - because of parcel
   * @protected
   */
  _icons = icons;
  // Default messages - to be overwrite in the children classes
  _errorMessage = 'Something went wrong :(';
  _message = 'It worked :)';

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];

      // Update changed text
      if (
        newEl.firstChild?.nodeValue.trim() !== '' &&
        !newEl.isEqualNode(currEl)
      )
        currEl.textContent = newEl.textContent;

      // Update changed attributes
      if (!newEl.isEqualNode(currEl))
        Array.from(newEl.attributes).forEach(attr => {
          currEl.setAttribute(attr.name, attr.value);
        });
    });
  }

  /**
   * Render the received object to the View
   * or the View's error message.
   * @param { Object | Object[] } [data] - The data to be rendered (e.g. Recipe)
   * @this {Object} View instance
   */
  render(data = 'No data') {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner(position = 'afterbegin', clearParent = true) {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${this._icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    if (clearParent) this._clear();
    this._parentElement.insertAdjacentHTML(position, markup);
  }

  renderError(
    message = this._errorMessage,
    position = 'afterbegin',
    clearParent = true
  ) {
    const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${this._icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
      `;

    if (clearParent) this._clear();
    this._parentElement.insertAdjacentHTML(position, markup);
  }

  renderMessage(
    message = this._message,
    position = 'afterbegin',
    clearParent = true
  ) {
    const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${this._icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
      `;

    if (clearParent) this._clear();
    this._parentElement.insertAdjacentHTML(position, markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
