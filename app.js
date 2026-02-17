const RecipeApp = (function () {

    // ===============================
    // Recipe Data (Enhanced)
    // ===============================
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Creamy Italian pasta dish.",
            ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Pepper"],
            steps: [
                "Boil pasta",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Whisk eggs",
                        "Add cheese",
                        "Cook pancetta"
                    ]
                },
                "Combine everything",
                "Serve hot"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Spiced tomato chicken curry.",
            ingredients: ["Chicken", "Tomatoes", "Cream", "Spices", "Onion"],
            steps: [
                "Marinate chicken",
                {
                    text: "Cook curry base",
                    substeps: [
                        "Fry onions",
                        "Add spices",
                        {
                            text: "Prepare masala mix",
                            substeps: ["Grind spices", "Add tomato puree"]
                        }
                    ]
                },
                "Add chicken and simmer",
                "Serve with rice"
            ]
        },
        {
            id: 3,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetables and feta cheese.",
            ingredients: ["Tomato", "Cucumber", "Olives", "Feta", "Olive oil"],
            steps: [
                "Chop vegetables",
                "Mix in bowl",
                "Add feta",
                "Drizzle olive oil"
            ]
        }
    ];

    // ===============================
    // State
    // ===============================
    let currentFilter = 'all';
    let currentSort = 'none';
    let searchQuery = '';
    const favorites = new Set();

    // ===============================
    // DOM Elements
    // ===============================
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const sortButtons = document.querySelectorAll('[data-sort]');
    const searchInput = document.querySelector('#search-input');

    // ===============================
    // Recursive Step Renderer
    // ===============================
    const renderSteps = (steps, level = 0) => {
        return `
            <ul class="step-level-${level}">
                ${steps.map(step => {
                    if (typeof step === "string") {
                        return `<li>${step}</li>`;
                    } else {
                        return `
                            <li>
                                ${step.text}
                                ${renderSteps(step.substeps, level + 1)}
                            </li>
                        `;
                    }
                }).join('')}
            </ul>
        `;
    };

    // ===============================
    // Card Template
    // ===============================
    const createRecipeCard = (recipe) => `
        <div class="recipe-card" data-id="${recipe.id}">
            <button class="favorite-btn ${favorites.has(recipe.id) ? 'favorited' : ''}" data-id="${recipe.id}">
                ♥
            </button>
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">
                    ${recipe.difficulty}
                </span>
            </div>
            <p>${recipe.description}</p>

            <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">
                Show Steps
            </button>

            <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">
                Show Ingredients
            </button>

            <div class="steps-container hidden" data-id="${recipe.id}">
                ${renderSteps(recipe.steps)}
            </div>

            <div class="ingredients-container hidden" data-id="${recipe.id}">
                <ul>
                    ${recipe.ingredients.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    const renderRecipes = (recipesToRender) => {
        recipeContainer.innerHTML =
            recipesToRender.map(createRecipeCard).join('');
    };

    // ===============================
    // Filter, Sort & Search
    // ===============================
    const applyFilter = (recipes, filterType) => {
        switch (filterType) {
            case 'easy':
            case 'medium':
            case 'hard':
                return recipes.filter(r => r.difficulty === filterType);
            case 'quick':
                return recipes.filter(r => r.time < 30);
            default:
                return recipes;
        }
    };

    const applySort = (recipes, sortType) => {
        switch (sortType) {
            case 'name':
                return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
            case 'time':
                return [...recipes].sort((a, b) => a.time - b.time);
            default:
                return recipes;
        }
    };

    const applySearch = (recipes, query) => {
        if (!query) return recipes;
        query = query.toLowerCase();
        return recipes.filter(r =>
            r.title.toLowerCase().includes(query) ||
            r.ingredients.some(i => i.toLowerCase().includes(query))
        );
    };

    const updateDisplay = () => {
        let result = recipes;
        result = applyFilter(result, currentFilter);
        result = applySort(result, currentSort);
        result = applySearch(result, searchQuery);
        renderRecipes(result);
    };

    // ===============================
    // Toggle Handler (Event Delegation)
    // ===============================
    const handleToggle = (e) => {
        const target = e.target;

        // Toggle Steps / Ingredients
        if (target.classList.contains('toggle-btn')) {
            const id = target.dataset.id;
            const type = target.dataset.type;
            const container = document.querySelector(`.${type}-container[data-id="${id}"]`);
            container.classList.toggle('hidden');
            target.textContent = container.classList.contains('hidden')
                ? `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`
                : `Hide ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }

        // Toggle Favorite
        if (target.classList.contains('favorite-btn')) {
            const id = parseInt(target.dataset.id);
            if (favorites.has(id)) favorites.delete(id);
            else favorites.add(id);
            target.classList.toggle('favorited');
        }
    };

    // ===============================
    // Active Buttons
    // ===============================
    const updateActiveButtons = () => {
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === currentFilter) btn.classList.add('active');
        });
        sortButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.sort === currentSort) btn.classList.add('active');
        });
    };

    // ===============================
    // Event Listeners
    // ===============================
    const setupEventListeners = () => {
        filterButtons.forEach(button => {
            button.addEventListener('click', e => {
                currentFilter = e.target.dataset.filter;
                updateActiveButtons();
                updateDisplay();
            });
        });

        sortButtons.forEach(button => {
            button.addEventListener('click', e => {
                currentSort = e.target.dataset.sort;
                updateActiveButtons();
                updateDisplay();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', e => {
                searchQuery = e.target.value;
                updateDisplay();
            });
        }

        recipeContainer.addEventListener('click', handleToggle);
    };

    // ===============================
    // Init
    // ===============================
    const init = () => {
        updateDisplay();
        setupEventListeners();
    };

    return { init };

})();

document.addEventListener('DOMContentLoaded', RecipeApp.init);
