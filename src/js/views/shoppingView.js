import PreviewView from './previewView';

class ShoppingView extends PreviewView {
  _parentElement = document.querySelector('.shopping__list');
  _errorMessage =
    'No ingredients yet. Find a nice recipe and add its ingredients ;)';

  addHandlersIng(handlerSearch, handlerRemoveBtn) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.btn_remove_ing');

      if (btn) {
        handlerRemoveBtn(btn.dataset.id);
        return;
      }

      const link = e.target.closest('.preview__link');

      if (link) {
        handlerSearch(link.dataset.ingredient);
        return;
      }
    });
  }

  _generateMarkupPreview(ing) {
    const id = window.location.hash.slice(1);
    return `
	<li class="preview">
		<a class="preview__link" href="#" data-ingredient="${ing.description}">
			<figure class="preview__fig">
				<img src="${ing.image}" alt="${ing.description}" />
			</figure>
			<div class="preview__data">
				<h4 class="preview__title">${ing.description}</h4>
				<p class="preview__publisher">
				${ing.quantity || ''} ${ing.unit} to make<br> ${ing.title}
				</p>
				
        <button class="btn--tiny btn_remove_ing" data-id="${ing.id}">
          <svg>
            <use href="${this._icons}#icon-minus-circle"></use>
          </svg>
        </button>
			</div>
		</a>
	</li> 
        `;
  }
}

export default new ShoppingView();
