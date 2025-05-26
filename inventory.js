document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const itemsList = document.getElementById('items-list');
    const fridgeList = document.getElementById('refrigerator-items-list');
    const addItemButton = document.getElementById('add-item-button');
    const locationSelect = document.getElementById('location-select');
    const categorySelect = document.getElementById('category-select');
    const itemInput = document.getElementById('item-input');
    const unitInput = document.getElementById('unit-input');
    const quantityInput = document.getElementById('quantity-input');
    const allergenSelect = document.getElementById('allergen-select');

    const categoryIcons = {
        meats: 'meatsIcon.png',
        vegetables: 'vegetablesIcon.png',
        dairy: 'dairyIcon.png',
        fruits: 'fruitsIcon.png',
        frozen: 'frozenIcon.png'
    };

    // Load items from localStorage
    function loadItemsFromLocalStorage() {
        const savedItems = JSON.parse(localStorage.getItem('yourStock')) || [];
        savedItems.forEach(item => addItemToDOM(item, itemsList));
    }

    function saveItemsToLocalStorage() {
        const rows = itemsList.querySelectorAll('tr.item-row');
        const items = Array.from(rows).map(row => ({
            location: 'yourStock',
            category: row.getAttribute('data-category'),
            itemName: row.querySelector('.item-name').textContent,
            quantity: parseInt(row.querySelector('.item-count').textContent),
            unit: row.querySelector('.item-unit').textContent,
            allergen: row.querySelector('.item-allergen').textContent === '-' ? '' : row.querySelector('.item-allergen').textContent
        }));
        localStorage.setItem('yourStock', JSON.stringify(items));
    }

    function addItemToDOM({ location, category, itemName, quantity, unit, allergen }, targetTableBody) {
        const newRow = document.createElement('tr');
        newRow.classList.add('item-row');
        newRow.setAttribute('data-category', category);

        const allergenText = allergen ? allergen : '-';
        const iconSrc = categoryIcons[category] || 'defaultIcon.png';

        newRow.innerHTML = `
            <td><img src="${iconSrc}" alt="${category}"> ${capitalize(category)}</td>
            <td class="item-name">${itemName}</td>
            <td class="item-allergen">${allergenText}</td>
            <td><span class="item-count">${quantity}</span> <span class="item-unit">${unit || ''}</span></td>
            <td>
                <button class="reduce-button">-</button>
                <button class="add-button">+</button>
            </td>
        `;

        targetTableBody.appendChild(newRow);

        const addButton = newRow.querySelector('.add-button');
        const reduceButton = newRow.querySelector('.reduce-button');
        const itemCountEl = newRow.querySelector('.item-count');

        addButton.addEventListener('click', () => {
            let count = parseInt(itemCountEl.textContent);
            itemCountEl.textContent = ++count;
            if (location === 'yourStock') saveItemsToLocalStorage();
        });

        reduceButton.addEventListener('click', () => {
            let count = parseInt(itemCountEl.textContent);
            if (count > 1) {
                itemCountEl.textContent = --count;
            } else {
                newRow.remove();
            }
            if (location === 'yourStock') saveItemsToLocalStorage();
        });
        if (location === 'yourStock') saveItemsToLocalStorage();
    }

    addItemButton.addEventListener('click', () => {
        const location = locationSelect.value; 
        const category = categorySelect.value;
        const nameVal = itemInput.value.trim();
        const quantityVal = parseInt(quantityInput.value, 10);
        const allergenVal = allergenSelect.value;
        const unitVal = unitInput.value.trim() || '';

        if (nameVal && quantityVal > 0) {
            if (allergenVal === 'peanuts') {
                const proceed = confirm("You or someone you're sharing space with has a peanut allergy. Add anyway?");
                if (!proceed) return;
            }

            const itemData = { location, category, itemName: nameVal, quantity: quantityVal, unit: unitVal, allergen: allergenVal };
            if (location === 'yourStock') {
                addItemToDOM(itemData, itemsList);
            } else {
                addItemToDOM(itemData, fridgeList);
            }

            itemInput.value = '';
            unitInput.value = '';
            quantityInput.value = '1';
            allergenSelect.value = '';
        } else {
            alert('Please enter a valid item name and quantity.');
        }
    });

    function filterItems(filter) {
        const allItems = document.querySelectorAll('.item-row');
        allItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'table-row';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterItems(filter);
        });
    });

    const toggleButtons = document.querySelectorAll('.toggle-section');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const table = document.getElementById(targetId);
            if (table.style.display === 'none') {
                table.style.display = '';
                btn.textContent = 'Hide';
            } else {
                table.style.display = 'none';
                btn.textContent = 'Show';
            }
        });
    });

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    loadItemsFromLocalStorage();

    fridgeList.querySelectorAll('.item-row').forEach(row => {
        const addButton = row.querySelector('.add-button');
        const reduceButton = row.querySelector('.reduce-button');
        const itemCountEl = row.querySelector('.item-count');

        addButton.addEventListener('click', () => {
            let count = parseInt(itemCountEl.textContent);
            itemCountEl.textContent = ++count;
        });

        reduceButton.addEventListener('click', () => {
            let count = parseInt(itemCountEl.textContent);
            if (count > 1) {
                itemCountEl.textContent = --count;
            } else {
                row.remove();
            }
        });
    });
});
