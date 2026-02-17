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

    // ===============================
    // DOM Elements
    // ===============================

    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const sortButtons = document.querySelectorAll('[data-sort]');

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
    // Filter & Sort
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
                return [...recipes].sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
            case 'time':
                return [...recipes].sort((a, b) =>
                    a.time - b.time
                );
            default:
                return recipes;
        }
    };

    const updateDisplay = () => {
        let result = recipes;
        result = applyFilter(result, currentFilter);
        result = applySort(result, currentSort);
        renderRecipes(result);
    };

    // ===============================
    // Toggle Handler (Event Delegation)
    // ===============================

    const handleToggle = (e) => {

        if (!e.target.classList.contains('toggle-btn')) return;

        const id = e.target.dataset.id;
        const type = e.target.dataset.type;

        const container = document.querySelector(
            `.${type}-container[data-id="${id}"]`
        );

        container.classList.toggle('hidden');

        e.target.textContent =
            container.classList.contains('hidden')
                ? `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`
                : `Hide ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    };

    // ===============================
    // Active Buttons
    // ===============================

    const updateActiveButtons = () => {
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === currentFilter) {
                btn.classList.add('active');
            }
        });

        sortButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.sort === currentSort) {
                btn.classList.add('active');
            }
        });
    };

    // ===============================
    // Event Listeners
    // ===============================

    const setupEventListeners = () => {

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                currentFilter = e.target.dataset.filter;
                updateActiveButtons();
                updateDisplay();
            });
        });

        sortButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                currentSort = e.target.dataset.sort;
                updateActiveButtons();
                updateDisplay();
            });
        });

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
