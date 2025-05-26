/*************************                       Objects Constructors          *********************************/

function Meal(name, icon, ingredients) {
    this.name = name;
    this.icon = icon;
    this.ingredients = ingredients
}

function Grocery(name, icon) {
    this.name = name;
    this.icon = icon
}

function Allergies(name, icon) {
    this.name = name;
    this.icon = icon
}

const categoryIcons = {
    dairy: 'dairyIcon.png',
    frozen: 'frozenIcon.png',
    vegetables: 'vegetablesIcon.png',
    fruits: 'fruitsIcon.png',
    meats: 'meatsIcon.png',
    snacks: 'snacksIcon.png'
};

const chefIcons = {
    beginner: 'begChef.png',
    intermediate: 'intChef.png',
    advanced: 'advChef.png'
};

const allergyIcons = {
    peanuts: 'scroll_icons/peanuts.png',
    lactose: 'scroll_icons/milk.png',
    gluten: 'gluten.png',
    fish: 'scroll_icons/shrimp.png'
};
/*************************                       Starting Page Items          *********************************/
const favMeals = [];
const favGrocery = [];
const favAllergies = [];

/*************************                       Sets with all items for objects          *********************************/
const allMealsSet = new Set([]);
const allGrocerySet = new Set([]);
const allAllergies = new Set([]);


/*************************                       Render through lists to print on page          *********************************/
function renderGroceries(favGrocery) {
    const scrollMenu = document.querySelector('.scrollmenu-gro');
    scrollMenu.innerHTML = '';

    favGrocery.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('scroll-item');
        
        mealDiv.innerHTML = `
            <img src="${meal.icon}" class="scroll-recipes"/>
            <span>${meal.name}</span>
            <span>
                <img src="remove.png" id="remove" onclick="openRemModelRec(favGrocery, '${meal.name}', 'grocery')"/>
            </span>
        `;

        scrollMenu.appendChild(mealDiv);
    });
}

function renderRecipes() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const scrollMenu = document.querySelector('.scrollmenu-fav');
    scrollMenu.innerHTML = '';

    favorites.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('scroll-item');
        
        mealDiv.innerHTML = `
            <img src="${meal.icon}" class="scroll-recipes" onclick="showMealDetails(${meal})"/>
            <span>${meal.name}</span>
            <span>
                <img src="remove.png" id="remove" onclick="removeFavorite('${meal.name}')"/>
            </span>
        `;
        
        mealDiv.querySelector('.scroll-recipes').onclick = () => showMealDetails(meal);
        scrollMenu.appendChild(mealDiv);
    });
}

function renderAllergies(favMeals) {
    const scrollMenu = document.querySelector('.scrollmenu');
    scrollMenu.innerHTML = '';

    favMeals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('scroll-item');
        
        mealDiv.innerHTML = `
            <img src="${meal.icon}" class="scroll-recipes"/>
            <span>${meal.name}</span>
            <span>
                <img src="remove.png" id="remove" onclick="openRemModelRec(favAllergies, '${meal.name}', 'allergy')"/>
            </span>
        `;
        
        scrollMenu.appendChild(mealDiv);
    });
}

/*************************                       Show Details when Clicked          *********************************/
function showMealDetails(meal) {
    const modal = document.getElementById('mealModal');
    modal.querySelector('.modal-name').innerText = meal.name;
    const ingredientsList = modal.querySelector('.modal-ingredients');
    ingredientsList.innerHTML = '';

    console.log(meal.name);
    meal.ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.innerText = ingredient;
        ingredientsList.appendChild(listItem);
    });

    modal.style.display = 'block';
}


function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

/*************************                       Add New Object to the Page          *********************************/
function openAddModel(foodArr, foodSet, type) {
    const addModal = document.getElementById('addModalAllergy');
    const mealPicsContainer = addModal.querySelector('.meal-pics');
    const select = addModal.querySelector('select');
    const newItemInput = addModal.querySelector('#new');
    const addToFavButton = document.getElementById('addToFavButton2');
    
    mealPicsContainer.innerHTML = ''; 
    select.innerHTML = '';

    Object.keys(allergyIcons).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        
        option.setAttribute('data-icon', categoryIcons[category]);

        select.appendChild(option);
    });

    foodArr.forEach(meal => {
        mealPicsContainer.innerHTML += `
            <div class="meal-item">
                <img src="${meal.icon}" class="scroll-recipes"/>
                <span>${meal.name}</span>
            </div>
        `;
    });

    addToFavButton.onclick = () => {
        const selectedCategory = select.value;
        addAllergyToFav(selectedCategory, foodArr, foodSet);
    };

    addModal.style.display = 'block';
}

function openAddModelGroc(foodArr, foodSet, type) {
    const addModal = document.getElementById('addModal');
    const mealPicsContainer = addModal.querySelector('.meal-pics');
    const select = addModal.querySelector('select');
    const newItemInput = addModal.querySelector('#new');
    const addToFavButton = document.getElementById('addToFavButton');
    let activeInput = null;
    
    mealPicsContainer.innerHTML = ''; 
    select.innerHTML = '';

    newItemInput.addEventListener('focus', () => {
        activeInput = newItemInput;
        toggleKeyboard(true);
    });

    function toggleKeyboard(show) {
        const keyboard = document.getElementById("virtualKeyboard");
        keyboard.style.display = show ? "flex" : "none";
    }

    window.handleKeyClick = function(key) {
        if (activeInput) {
            if (key === 'Backspace') {
                activeInput.value = activeInput.value.slice(0, -1);
            } else if (key === 'Space') {
                activeInput.value += ' ';
            } else {
                activeInput.value += key;
            }
        }
    };

    Object.keys(categoryIcons).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        
        option.setAttribute('data-icon', categoryIcons[category]);

        select.appendChild(option);
    });

    foodArr.forEach(meal => {
        mealPicsContainer.innerHTML += `
            <div class="meal-item">
                <img src="${meal.icon}" class="scroll-recipes"/>
                <span>${meal.name}</span>
            </div>
        `;
    });

    addToFavButton.onclick = () => {
        const newItem = newItemInput.value.trim(); 
        const selectedCategory = select.value;
        newItemInput.value = '';

        if (newItem) {
            addGrocToFav(newItem, selectedCategory, foodArr, foodSet);
        } else {
            alert("Please enter an item to add.");
        }
    };

    addModal.style.display = 'block';
}

function openAddModelRec(foodArr, foodSet, type) {
    const addModal = document.getElementById('addModalRec');
    const mealPicsContainer = addModal.querySelector('.meal-pics');
    const ingredientsTextArea = document.getElementById('ingredients-list');
    const select = addModal.querySelector('select');
    const newItemInput = addModal.querySelector('#new');
    const addToFavButton = document.getElementById('addToFavButton3');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const ingredientInput = document.getElementById('ingredient-input');
    const addIngredientButton = document.getElementById('add-ingredient-button');
    const ingredientsList = document.getElementById('ingredients-list');
    
    let activeInput = null;
    let ingredientsArray = [];

    mealPicsContainer.innerHTML = ''; 
    select.innerHTML = '';
    ingredientsList.innerHTML = '';
    ingredientsArray = [];

    newItemInput.addEventListener('focus', () => {
        activeInput = newItemInput;
        toggleKeyboard(true);
    });

    addIngredientButton.onclick = () => {
        const ingredient = ingredientInput.value.trim();
        if (ingredient) {
            ingredientsArray.push(ingredient);
            updateIngredientsList();
            ingredientInput.value = '';
        }
    };

    function removeIngredient(index) {
        ingredientsArray.splice(index, 1);
        updateIngredientsList();
    }

    function updateIngredientsList() {
        ingredientsList.innerHTML = '';
        ingredientsArray.forEach((ingredient, index) => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            const removeButton = document.createElement('button');
            removeButton.textContent = "Remove";
            removeButton.id = 'add-ingredient-button';
            removeButton.onclick = () => removeIngredient(index);
            li.appendChild(removeButton);
            ingredientsList.appendChild(li);
        });
    }

    ingredientsTextArea.addEventListener('focus', () => {
        activeInput = ingredientsTextArea;
        toggleKeyboard(true);
    });

    function toggleKeyboard(show) {
        const keyboard = document.getElementById("virtualKeyboard");
        keyboard.style.display = show ? "flex" : "none";
    }

    window.handleKeyClick = function(key) {
        if (activeInput) {
            if (key === 'Backspace') {
                activeInput.value = activeInput.value.slice(0, -1);
            } else if (key === 'Space') {
                activeInput.value += ' ';
            } else {
                activeInput.value += key;
            }
        }
    };

    Object.keys(chefIcons).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        
        option.setAttribute('data-icon', chefIcons[category]);

        select.appendChild(option);
    });

    favorites.forEach(meal => {
        mealPicsContainer.innerHTML += `
            <div class="meal-item">
                <img src="${meal.icon}" class="scroll-recipes"/>
                <span>${meal.name}</span>
            </div>
        `;
    });

    addToFavButton.onclick = () => {
        const newItem = newItemInput.value.trim(); 
        const selectedCategory = select.value;
        const ingredientsText = ingredientsTextArea.value;
        ingredientsTextArea.value = '';
        newItemInput.value = '';
        
        if (newItem) {
            addMealToFav(newItem, selectedCategory, foodArr, ingredientsArray, foodSet);
        } else {
            alert("Please enter an item to add.");
        }
    };

    addModal.style.display = 'block';
}


function closeAddModal(foodArr) {
    const addModal = document.getElementById('addModal');
    addModal.style.display = 'none';
}

function closeAddModalRec() {
    const addModal = document.getElementById('addModalRec');
    addModal.style.display = 'none';
}

function closeAddModalAllergy() {
    const addModal = document.getElementById('addModalAllergy');
    addModal.style.display = 'none';
}


function addMealToFav(newItem, selectedCategory, foodArr, ingredientsArray, foodSet) {
    const select = document.querySelector('#addModal select');
    console.log(selectedCategory)
    const itemIcon = chefIcons[selectedCategory];
    const item = new Meal(newItem, itemIcon, ingredientsArray);
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    //const selectedMeal = Array.from(foodSet).find(meal => meal.name === selectedMealName);

    if (item && !foodArr.some(meal => meal.name === newItem)) {
        favorites.push(item);

        localStorage.setItem('favorites', JSON.stringify(favorites));

        openAddModelRec(foodArr, foodSet, 'meal');
        renderRecipes()
    }
}

function addGrocToFav(newItem, selectedCategory, foodArr, foodSet) {
    const select = document.querySelector('#addModal select');
    const itemIcon = categoryIcons[selectedCategory];
    const item = new Grocery(newItem, itemIcon);

    //const selectedGroc = Array.from(foodSet).find(meal => meal.name === selectedMealName);

    if (item && !foodArr.includes(item)) {
        foodArr.push(item);

        localStorage.setItem('favGrocery', JSON.stringify(foodArr));

        openAddModelGroc(foodArr, foodSet, 'grocery');
        renderGroceries(foodArr)
    }
}

function addAllergyToFav(selectedCategory, foodArr, foodSet) {
    const itemIcon = allergyIcons[selectedCategory];
    selectedCategory = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    const item = new Allergies(selectedCategory, itemIcon);

    if (item && !foodArr.some(allergy => allergy.name === selectedCategory)) {
        foodArr.push(item);

        localStorage.setItem('favAllergies', JSON.stringify(foodArr));

        openAddModel(foodArr, foodSet, 'allergy');
        renderAllergies(foodArr);
    }
}

/*************************                       Loading the Page          *********************************/
function toggleKeyboard(show) {
    const keyboard = document.getElementById("virtualKeyboard");
    keyboard.style.display = show ? "flex" : "none";
}

function handleKeyClick(key, inputId = "searchBar") {
    const inputField = document.getElementById(inputId);

    if (key === 'Backspace') {
        inputField.value = inputField.value.slice(0, -1);
    } else if (key === 'Space') {
        inputField.value += ' ';
    } else {
        inputField.value += key;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderRecipes()
    //renderGroceries(favGrocery)
    renderAllergies(favAllergies)
});

document.addEventListener('DOMContentLoaded', () => {
    const savedAllergies = JSON.parse(localStorage.getItem('favAllergies'));
    if (savedAllergies) {
        savedAllergies.forEach(allergy => {
            favAllergies.push(new Allergies(allergy.name, allergy.icon));
        });
    }

    const savedGroc = JSON.parse(localStorage.getItem('favGrocery'));
    if (savedGroc) {
        savedGroc.forEach(meal => {
            favGrocery.push(new Grocery(meal.name, meal.icon));
        });
    }

    const savedRec = JSON.parse(localStorage.getItem('favMeals'));
    if (savedRec) {
        savedRec.forEach(meal => {
            favMeals.push(new Meal(meal.name, meal.icon, meal.ingredients));
        });
    }

    renderRecipes();
    //renderGroceries(favGrocery);
    renderAllergies(favAllergies);
});

function openRemModelRec(foodArr, name, type) {
    const index = foodArr.findIndex(item => item.name === name);

    if (index !== -1) {
        foodArr.splice(index, 1);

        if (type === 'allergy') {
            localStorage.setItem('favAllergies', JSON.stringify(foodArr));
            renderAllergies(foodArr);
        } else if (type === 'meal') {
            localStorage.setItem('favMeals', JSON.stringify(foodArr));
            renderRecipes(foodArr);
        } else {
            localStorage.setItem('favGrocery', JSON.stringify(foodArr));
            renderGroceries(foodArr);
        }
    }
}

function removeFavorite(recipeName) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.name !== recipeName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderRecipes();
}