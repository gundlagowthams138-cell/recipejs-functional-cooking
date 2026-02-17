document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // Recipe Data
    // ===============================

    const recipes = [
        { id: 1, title: "Classic Spaghetti Carbonara", time: 25, difficulty: "easy", description: "Creamy Italian pasta dish." },
        { id: 2, title: "Chicken Tikka Masala", time: 45, difficulty: "medium", description: "Spiced tomato chicken curry." },
        { id: 3, title: "Homemade Croissants", time: 180, difficulty: "hard", description: "Buttery flaky pastries." },
        { id: 4, title: "Greek Salad", time: 15, difficulty: "easy", description: "Fresh vegetables and feta cheese." },
        { id: 5, title: "Beef Wellington", time: 120, difficulty: "hard", description: "Beef wrapped in puff pastry." },
        { id: 6, title: "Vegetable Stir Fry", time: 20, difficulty: "easy", description: "Quick mixed vegetable dish." },
        { id: 7, title: "Pad Thai", time: 30, difficulty: "medium", description: "Thai rice noodles with shrimp." },
        { id: 8, title: "Margherita Pizza", time: 60, difficulty: "medium", description: "Classic mozzarella basil pizza." }
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
    // Render Functions
    // ===============================

    const createRecipeCard = (recipe) => `
        <div class="recipe-card">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">
                    ${recipe.difficulty}
                </span>
            </div>
            <p>${recipe.description}</p>
        </div>
    `;

    const renderRecipes = (recipesToRender) => {
        recipeContainer.innerHTML =
            recipesToRender.map(createRecipeCard).join('');
    };

    // ===============================
    // Filter Functions (Pure)
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

    // ===============================
    // Sort Functions (Pure)
    // ===============================

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

    // ===============================
    // Update Display
    // ===============================

    const updateDisplay = () => {

        let result = recipes;

        result = applyFilter(result, currentFilter);
        result = applySort(result, currentSort);

        renderRecipes(result);
    };

    // ===============================
    // Active Button UI
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

    // ===============================
    // Initialize
    // ===============================

    updateDisplay();

});
