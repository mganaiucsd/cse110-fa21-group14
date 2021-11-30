
class RecipeCard extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
    }
    set data(data) {
        let shadow = this.shadowRoot;
        const styleElem = document.createElement('style');
        const styles = `
            article{
                display: inline-block;
                margin: 1vh 1vw;
                width: 20vw;
                height: 45vh;
                overflow: auto;

                border: 2px solid gray;
                border-radius: 5px;
            }
            article:hover{
                cursor: pointer;
            }
            article img{
                object-fit: fill;
                height: 26vh;
                width: 100%;
            }
            .recipe-text{
                margin: 10px;
            }
            .recipe-title{
                font-size: 3vh;
                font-weight: 600;
            }
        `;
        styleElem.innerHTML = styles;

        //creating elements for recipe card
        const card = document.createElement('article');
        var img = document.createElement('img');
        var recipeText = document.createElement('div');
        var recipeTitle = document.createElement('p');

        //adding popup to card
        //card.setAttribute('onclick', 'recipePopUp()');
        img.setAttribute('src', data.img);
        img.setAttribute('alt', 'Recipe Image');
        card.appendChild(img);

        //attaching title and ingredients to div recipe text
        recipeText.classList.add('recipe-text');
        recipeTitle.classList.add('recipe-title');
        recipeTitle.innerHTML = data.name;

        recipeText.appendChild(recipeTitle);
        card.appendChild(recipeText);
        shadow.appendChild(card);
        shadow.appendChild(styleElem);
    }
}

customElements.define('recipe-card', RecipeCard);