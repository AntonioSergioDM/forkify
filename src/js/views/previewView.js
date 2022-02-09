import View from './View';

export default class PreviewView extends View {
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview.bind(this)).join('');
  }

  _generateMarkupPreview(recipe) {
    const id = window.location.hash.slice(1);
    return `
	<li class="preview">
		<a class="preview__link ${
      recipe.id === id ? 'preview__link--active' : ''
    }" href="#${recipe.id}">
			<figure class="preview__fig">
				<img src="${recipe.image}" alt="${recipe.title}" />
			</figure>
			<div class="preview__data">
				<h4 class="preview__title">${recipe.title}</h4>
				<p class="preview__publisher">${recipe.publisher}</p>
        
        <div class="preview__bookmark ${recipe.bookmarked ? '' : 'hidden'}">
          <svg>
            <use href="${this._icons}#icon-bookmark-fill"></use>
          </svg>
        </div>
				${
          recipe.key
            ? `
				<div class="preview__user-generated">
					<svg>
						<use href="${this._icons}#icon-user"></use>
					</svg>
				</div>`
            : ''
        }
			</div>
		</a>
	</li> 
        `;
  }
}
