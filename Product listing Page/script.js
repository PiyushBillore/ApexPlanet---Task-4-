const API_URL = "https://fakestoreapi.com/products";

const productListEl = document.getElementById("product-list");
const categoryFiltersEl = document.getElementById("category-filters");
const priceRangeEl = document.getElementById("price-range");
const maxPriceDisplayEl = document.getElementById("max-price-display");
const sortSelectEl = document.getElementById("sort-select");
const loadingMessageEl = document.getElementById("loading-message");
const searchInputEl = document.getElementById("search-input");
const themeToggleEl = document.getElementById("theme-toggle");
const productCountEl = document.getElementById("product-count");

let allProducts = [];
let currentFilters = {
  category: "all",
  maxPrice: 1000,
  sortBy: sortSelectEl.value,
  searchText: "",
};

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allProducts = await response.json();

    allProducts = allProducts.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      rating: p.rating ? parseFloat(p.rating.rate) : 0,
    }));

    loadingMessageEl.style.display = "none";

    setupInitialState();
    updateProductDisplay();
  } catch (error) {
    console.error("Could not fetch products:", error);
    loadingMessageEl.textContent = "Error loading products. Please try again.";
  }
}

function setupInitialState() {
  const prices = allProducts.map((p) => p.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  priceRangeEl.min = Math.floor(minPrice);
  priceRangeEl.max = Math.ceil(maxPrice) + 1;
  priceRangeEl.value = Math.ceil(maxPrice) + 1;
  priceRangeEl.disabled = false;

  currentFilters.maxPrice = parseFloat(priceRangeEl.value);
  maxPriceDisplayEl.textContent = currentFilters.maxPrice.toFixed(2);

  setupCategories();
}

function setupCategories() {
  const categories = ["all", ...new Set(allProducts.map((p) => p.category))];
  categoryFiltersEl.innerHTML = "";

  categories.forEach((category) => {
    const displayCategory = category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="category" value="${category}" ${
      category === "all" ? "checked" : ""
    }> ${displayCategory}`;
    categoryFiltersEl.appendChild(label);
  });
}

function getFilteredProducts(productsToFilter) {
  let filtered = productsToFilter.filter((product) => {
    const categoryMatch =
      currentFilters.category === "all" ||
      product.category === currentFilters.category;
    const priceMatch = product.price <= currentFilters.maxPrice;
    const searchMatch = product.title
      .toLowerCase()
      .includes(currentFilters.searchText.toLowerCase());

    return categoryMatch && priceMatch && searchMatch;
  });
  return filtered;
}

function getSortedProducts(productsToSort) {
  const sortBy = currentFilters.sortBy;
  return productsToSort.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
}

function displayProducts(productsToDisplay) {
  productListEl.innerHTML = "";

  if (productsToDisplay.length === 0) {
    productListEl.innerHTML =
      '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">No products match your current filters and search term.</p>';
    productCountEl.textContent = `Displaying 0 products`;
    return;
  }

  productsToDisplay.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const roundedRating = Math.round(product.rating);
    const stars = "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);

    card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h4>${product.title}</h4>
            <p class="rating">${stars} (${product.rating.toFixed(2)})</p>
            <p class="price">$${product.price.toFixed(2)}</p>
        `;
    productListEl.appendChild(card);
  });

  productCountEl.textContent = `Displaying ${productsToDisplay.length} products`;
}

function updateProductDisplay() {
  const filteredProducts = getFilteredProducts(allProducts);
  const sortedAndFilteredProducts = getSortedProducts(filteredProducts);
  displayProducts(sortedAndFilteredProducts);
}

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
  }
}

categoryFiltersEl.addEventListener("change", (e) => {
  if (e.target.name === "category") {
    currentFilters.category = e.target.value;
    updateProductDisplay();
  }
});

priceRangeEl.addEventListener("input", (e) => {
  currentFilters.maxPrice = parseFloat(e.target.value);
  maxPriceDisplayEl.textContent = currentFilters.maxPrice.toFixed(2);
  updateProductDisplay();
});

sortSelectEl.addEventListener("change", (e) => {
  currentFilters.sortBy = e.target.value;
  updateProductDisplay();
});

searchInputEl.addEventListener("input", (e) => {
  currentFilters.searchText = e.target.value.trim();
  updateProductDisplay();
});

themeToggleEl.addEventListener("click", toggleTheme);

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  fetchProducts();
});
