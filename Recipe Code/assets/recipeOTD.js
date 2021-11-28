function randomRecipe(data){
    //populate OTD card at home
    
    let recs = data.recommended;
    let recipe = recs[Math.floor(Math.random() * recs.length)];
    console.log(recipe);
    const otdImg = document.querySelector('#home-recipe-card img');
    const otdTitle = document.getElementById('home-recipe-title');
    const otdIngredients = document.getElementById('home-ingredients');
    
    //once JSON is made for recommended recipes, would pull values from here
    otdImg.setAttribute('src', recipe.img);
    otdImg.setAttribute('alt', 'Recipe Image');
    otdTitle.innerHTML = recipe.name;

    
    let ingList = recipe.ingredients;
    let ingListStr = '';
    let i = 0;
    for (i = 0; i < ingList.length - 1; i++) {
        //https://dzone.com/articles/capitalize-first-letter-string-javascript
        let name = `${ingList[i]['name']}, `.charAt(0).toUpperCase() + `${ingList[i]['name']}, `.slice(1);
        ingListStr = ingListStr + name;
    }
    let lastRecipe = `${ingList[i]['name']}`.charAt(0).toUpperCase() + `${ingList[i]['name']}`.slice(1);
    ingListStr = ingListStr + lastRecipe;
    otdIngredients.innerHTML = ingListStr;
        
    //populate pop up of OTD card
    const otdCard = document.getElementById('home-recipe-card');
    otdCard.addEventListener('click', function() {
        const recipeName = document.querySelector('#recipe-name');
        const recipeImg = document.getElementById('recipe-image');
        const recipeIng = document.getElementById('ingredients');
        const recipeSteps = document.getElementById('instructions');

        console.log(recipeName);
        recipeName.innerHtml = recipe.name;
        recipeImg.setAttribute('src', recipe.img);
        for (let i = 0; i < ingList.length; i++) {
            let newIng = document.createElement('li');
            newIng.innerHTML = `${ingList[i]['amount']} ${ingList[i]['unit']} of ${ingList[i]['name']}`;
            recipeIng.appendChild(newIng);
        }

        let steps = recipe.steps
        for(let i = 0; i < steps.length; i++){
            let newStep = document.createElement('li');
            newStep.innerHTML = steps[i];
            recipeSteps.append(newStep)
        }
    });

    
}

// Once page loads, render recommended recipe cards.
export function makeRecipeOTD() {
    console.log("loaded");
    fetch("assets/recommended.json")
    .then(response => {
    return response.json();
    })
    .then(data => {
        randomRecipe(data);
    });
}