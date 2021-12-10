import fetch from "node-fetch";
const API_KEY = "81fd56bfaac84f9c985e6c7474c02d60";
//sample test
test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });


//add more tests here:

function filter(recipe,tagList){
  if(recipe.tags == undefined){
      return false;
  }
  for(const t in tagList){
      if(recipe.tags.some(x => x == tagList[t])){
          continue;
      }
      else{
          return false;
      }
  }
  return true;
}

function filterRecipes(recipes,tagList){
  if(tagList.length == 0){
      return recipes;
  }
  let res = [];
  for(const r in recipes){
      if(filter(recipes[r],tagList)){
          res.push(recipes[r]);
      }
  }
  return res;
}

function sortAll(recipes, method) {
  console.log(method)
  switch (method) {
      //least made
      case 'least-made':
          return recipes.sort(function compareFn(firstEl, secondEl){
              return firstEl.makeCount - secondEl.makeCount;
          });
      // most made
      case 'most-made':
          return recipes.sort(function compareFn(firstEl, secondEl){
              return secondEl.makeCount - firstEl.makeCount;
          });
      //alphabetical
      case 'alphabetical':
          return recipes.sort(function compareFn(firstEl, secondEl) {
              let nameA = firstEl.name;
              let nameB = secondEl.name;
              if (nameA < nameB) {
                  return -1;
              }
              if (nameA > nameB) {
                  return 1;
              }
              return 0;
          });

      // date of creation
      case 'newest':
          return recipes.sort(function compareFn(firstEl, secondEl) {
              let createdA = firstEl.created;
              let createdB = secondEl.created;
              if (createdA > createdB) {
                  return -1;
              }
              if (createdA < createdB) {
                  return 1;
              }
              return 0;
          });

      case 'oldest':
          return recipes.sort(function compareFn(firstEl, secondEl) {
              let createdA = firstEl.created;
              let createdB = secondEl.created;
              if (createdA < createdB) {
                  return -1;
              }
              if (createdA > createdB) {
                  return 1;
              }
              return 0;
          });
      default:
          console.log('sort not working');
  }
}

/**
 * 
 * @param {string} recipe_name
 * @returns {Object} JSON Object
 * Call Spoonacular API for recipe basic information.
 * Information included:
 * id, title, image
 */
 async function getRecipeData(recipe_name) {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${recipe_name}&number=5`).then((response1) => {return response1});
    return response.json();
}
/**
 * 
 * @param {string} recipe_id 
 * @returns {Object} JSON Object
 * Call Spoonacular API for recipe ingredients.
 * Information included:
 * name, amount, units
 */
async function getIngredients(recipe_id) {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipe_id}/ingredientWidget.json?apiKey=${API_KEY}`);
    return response.json();
}

/**
 * 
 * @param {string} recipe_id 
 * @returns {Object} JSON Object
 * Call Spoonacular API for recipe instructions
 * Information included:
 * step, step number
 */
async function getInstructions(recipe_id) {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipe_id}/analyzedInstructions?apiKey=${API_KEY}`);
    return response.json();
}

async function getRecipeInfo(recipe_name) {
    // Search for 10 recipes.
    let recipe_call = await getRecipeData(recipe_name);
    // Actual array of recipe JSON elements.
    let recipes = recipe_call.results;
    // List of search results to be populated.
    let SEARCH_OBJ = {"search": []};
    // Iterate and parse information.
    if (recipes.length == 0) return;
    for (let i = 0; i < recipes.length; i++) {
       SEARCH_OBJ.search.push({"id": recipes[i].id, "name": recipes[i].title, "img": recipes[i].image, "ingList": [], instList: []});
    }
    return SEARCH_OBJ;
 }

test('get recipe data test 1', () => {
    expect(getRecipeInfo('strawberry')).not.toBeNull();
})

test('get recipe data test 2', () => {
    expect(getRecipeInfo('apple')).toBeDefined();
})

test('get recipe data test 1', () => {
    expect(getRecipeData('pasta')).not.toBeNull();
})

test('get recipe data test 2', () => {
    expect(getRecipeData('chocolate')).toBeDefined();
})

test('get recipe ingredients test 1', () => {
    expect(getIngredients('654959')).not.toBeNull();
})

test('get recipe ingredients test 2', () => {
    expect(getIngredients('511728')).toBeDefined();
})

test('get recipe ingredients test 1', () => {
    expect(getInstructions('654959')).not.toBeNull();
})

test('get recipe ingredients test 2', () => {
    expect(getInstructions('511728')).toBeDefined();
})

test('filter test 1', () =>{
  expect(filter({'tags':['test']},['test'])).toBe(true);
})

test('filter test 2', () =>{
  expect(filter({'tags':['test1']},['test'])).toBe(false);
})

test('filter test 3', () =>{
  expect(filter({'tags':['test','test1']},['test','test1'])).toBe(true);
})

test('filter test 4', () =>{
  expect(filter({'tags':['test','test1']},[])).toBe(true);
})

let testArray = [{'name':1,'tags':['test']},{'name':2,'tags':['test1']},{'name':3,'tags':['test','test1']}]

test('filterRecipes test 1', () =>{
  expect(filterRecipes(testArray,['test'])).toStrictEqual([{'name':1,'tags':['test']},{'name':3,'tags':['test','test1']}]);
})

test('filterRecipes test 2', () =>{
  expect(filterRecipes(testArray,['test','test1'])).toStrictEqual([{'name':3,'tags':['test','test1']}]);
})

let sortAlltestArray2 = [{'makeCount':3,'name':'b','created':new Date('1995-12-17T03:24:00')},
                  {'makeCount':1,'name':'a','created':new Date('1996-12-17T03:24:00')},
                  {'makeCount':2,'name':'c','created':new Date('1995-11-17T03:24:00')}]

let sortAlltarget1 = [{'makeCount':1,'name':'a','created':new Date('1996-12-17T03:24:00')},
                  {'makeCount':2,'name':'c','created':new Date('1995-11-17T03:24:00')},
                  {'makeCount':3,'name':'b','created':new Date('1995-12-17T03:24:00')}]

let sortAlltarget2 = [{'makeCount':1,'name':'a','created':new Date('1996-12-17T03:24:00')},
                  {'makeCount':3,'name':'b','created':new Date('1995-12-17T03:24:00')},
                  {'makeCount':2,'name':'c','created':new Date('1995-11-17T03:24:00')}]

test('sortAll test 1', () =>{
  expect(sortAll(sortAlltestArray2,'least-made')).toStrictEqual(sortAlltarget1);
})

test('sortAll test 2', () =>{
  expect(sortAll(sortAlltestArray2,'newest')).toStrictEqual(sortAlltarget2);
})

// import { 
//   get,
//   getAll,
//   deleteRecipe,
//   saveToLocalStorage,
//   save,
//   addToGroceryList,
//   imgToURL
// } from '../../RecipeChamber/scripts/backend.js'
/*
 * This function returns recipe object given recipe name or id
 * 
 * @param {string} name or id of recipe to retreive
 * @returns {Object}  recipe object
 */
function get(key) {
    const data = JSON.parse(localStorage.getItem('recipeData'))
    var result = data.filter(function (item) {
        return (key == item.name || key == item.id)
    })[0];
    //console.log(result);
    return result;
}

/*
 * This function returns array of all recipe objects
 * 
 * @returns {Array} An array of recipe objects
 */
function getAll() {
    //console.log(JSON.parse(localStorage.getItem('recipeData')));
    return (JSON.parse(localStorage.getItem('recipeData')));
}
/*
 * This function adds unique ingredients of a recipe to the grocery list
 * 
 * @param {Object} A recipe object
 */
function addToGroceryList(recipe) {
    if (!localStorage.getItem('grocery')) {
        localStorage.setItem('grocery', JSON.stringify([]));
    }
    var groceryData = JSON.parse(localStorage.getItem('grocery'));
    for (var ing of recipe.ingredients['ingredients']) {
        let exist = false;
        for (var curr of groceryData) {
            if (ing.ingName.toLowerCase() == curr.name.toLowerCase()) {
                exist = true
                console.log(exist)
                break;
            }
        }
        if (!exist) {
            groceryData.push({ name: ing.ingName, done: false });
            localStorage.setItem('grocery', JSON.stringify(groceryData));
            console.log(localStorage.getItem('grocery'));
        }
    }
}
/*
 * This function accepts converts an image (base64) to a (imgur) url link.
 * 
 * @param {string} image in base64 format
 * @returns {string} imgur image url
 */
async function imgToURL(imgBase64) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'https://api.imgur.com/3/image',
            headers: {
                Authorization: 'Client-ID 883b97261443d3c'
            },
            type: 'POST',
            data: {
                image: imgBase64,
                type: 'base64'
            },
            success: function (result) {
                resolve(result.data.link);
            },
            error: function (err) {
                reject(err)
            }
        });
    });

}

/*
 * This function stores/updates the recipe object in localstorage
 * 
 * @param {Object} an array object
 */
function save(recipe) {
    if (!localStorage.getItem('recipeData')) {
        localStorage.setItem('recipeData', JSON.stringify([]))
    }
    if (get(recipe.id)) {
        deleteRecipe(recipe.id)
    }
    var data = JSON.parse(localStorage.getItem('recipeData'))
    data.push(recipe)
    saveToLocalStorage(data)
    let imgURL = ''
    console.log(localStorage.getItem('recipeData'))
}

/*
 * A helper function to stringify and save/update recipes 
 * data into local storage
 * 
 * @param {Array} Array of recipes object
 */
function saveToLocalStorage(data) {
    localStorage.setItem('recipeData', JSON.stringify(data))
}
/*
 * This function deletes a recipe given its id from localstorage
 * 
 * @param {string} id of the recipe
 */
function deleteRecipe(id) {
    saveToLocalStorage(getAll().filter(recipe => id != recipe.id));
}
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
global.$ = $
jest.useFakeTimers()
const mockedRecipies = [
  {
    id: 1,                                                
    name: 'Recipie1',                                           
    img: 'https://placehold.it/200/300',                                            
    ingredients: {                                          
      proportion: 2,
      ingredients: [
        {
          ingName: 'ingredient1',
          amount: 100,
          unit: '10'
        }
      ],
    },
    steps: 2,                                     
    serving: 2,                                           
    tags: ['tag1', 'tag2'],                                         
    made: `${new Date()}`,
    makeCount: 2,                     
    created: `${new Date()}`
  },
  {
    id: 2,                                                
    name: 'Recipie2',                                           
    img: 'https://placehold.it/200/300',                                            
    ingredients: {                                          
      proportion: 2,
      ingredients: [
        {
          ingName: 'ingredient2',
          amount: 200,
          unit: '20'
        }
      ],
    },
    steps: 2,                                     
    serving: 2,                                           
    tags: ['tag1', 'tag2'],                                         
    made: `${new Date()}`,
    makeCount: 2,                     
    created: `${new Date()}`
  }
]
/** mock local storage */
const fakeLocalStorage = (function() {
  let store = {
    'recipeData': JSON.stringify(mockedRecipies)
  };
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    },
    ...store
  };
})();
Object.defineProperty(global, 'localStorage', {
  value: fakeLocalStorage
});
// const fakeAjax = (resolve, reject) => ({
//   url: 'https://api.imgur.com/3/image',
//   headers: {
//     Authorization: 'Client-ID ABC'
//   },
//   type: 'POST',
//   data: {
//     image: imgBase64,
//     type: 'base64'
//   },
//   success: function (result) {
//     resolve(result.data.link);
//   },
//   error: function (err) {
//     reject(err)
//   }
// })
// /** mock ajax */
// const $ = {}
// $.ajax = jest.fn().mockImplementation(() => {
//   return new Promise(fakeAjax);
// });
describe('backend', () => {
  it('should returns recipe object given recipe name or id', () => {
    const data = mockedRecipies[0]
    const result = get(data.name)
    expect(result).toBeTruthy()
    expect(result.name).toEqual(data.name)
  })
  it('should return JSON of all recipe objects', () => {
    const data = getAll()
    expect(data).toEqual(mockedRecipies)
    expect(data).toHaveLength(mockedRecipies.length)
  })
  it('should delete recipe given id in localstorage', () => {
    const data = mockedRecipies[0]
    deleteRecipe(data.id)
    const updatedData = JSON.parse(
      fakeLocalStorage.getItem('recipeData')
    )
    expect(updatedData).toHaveLength(mockedRecipies.length - 1)
  })
  it('should save the data to local storage', () => {
    fakeLocalStorage.clear()
    const clearedData = JSON.parse(
      fakeLocalStorage.getItem('recipeData')
    )
    expect(clearedData).toEqual(null)
    saveToLocalStorage(mockedRecipies)
    const updatedData = JSON.parse(
      fakeLocalStorage.getItem('recipeData')
    )
    expect(updatedData).toHaveLength(mockedRecipies.length)
  })
  it('should add the data to local storage', () => {
    const newItem = JSON.parse(
      JSON.stringify({}, {
        id: 3,
        ...mockedRecipies[0]
      })
    )
    save(newItem)
    const updatedData = JSON.parse(
      fakeLocalStorage.getItem('recipeData')
    )
    expect(updatedData).toHaveLength(mockedRecipies.length + 1)
  })
  it('should add the ingredients of a recipe to the grocery list', () => {
    const data = {
      ...mockedRecipies[0]
    }
    addToGroceryList(data)
    const updatedData = JSON.parse(
      fakeLocalStorage.getItem('grocery')
    )
    expect(updatedData).toHaveLength(1)
  })
  it('should get data from ajax call (resolved)', () => {
    let options
    const ajaxSpy = jest.spyOn($, 'ajax')
      .mockImplementation((obj) => {
        options = obj
      });
    const base64Image = 'abc'
    const response = imgToURL(base64Image)
    expect(response).toBeInstanceOf(Promise)
    const mockedResult = {
      data: {
        link: 'abc'
      }
    }
    options.success(mockedResult)
    expect(response).resolves.toBeDefined()
    expect(ajaxSpy).toHaveBeenCalledWith({
      url: 'https://api.imgur.com/3/image',
      headers: {
        Authorization: 'Client-ID 883b97261443d3c'
      },
      type: 'POST',
      data: {
        image: base64Image,
        type: 'base64'
      },
      success: expect.any(Function),
      error: expect.any(Function)
    })
  })
  it('should get data from ajax call (rejected)', () => {
    let options
    const ajaxSpy = jest.spyOn($, 'ajax')
      .mockImplementation((obj) => {
        options = obj
      });
    const base64Image = 'abc'
    const response = imgToURL(base64Image)
    expect(response).toBeInstanceOf(Promise)
    const mockedError = {
      status: 404
    }
    options.error(mockedError)
    expect(response).resolves.not.toBeDefined()
    expect(ajaxSpy).toHaveBeenCalledWith({
      url: 'https://api.imgur.com/3/image',
      headers: {
        Authorization: 'Client-ID 883b97261443d3c'
      },
      type: 'POST',
      data: {
        image: base64Image,
        type: 'base64'
      },
      success: expect.any(Function),
      error: expect.any(Function)
    })
  })
})
