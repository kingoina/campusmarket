document.addEventListener("DOMContentLoaded", function () {

    // Helper functions for displaying user feedback
    function showMessage(element, text, type = "error") {
        if (!element) return;
        element.innerText = text;
        element.className = `message-box ${type}`;
        element.style.display = "block";
    }

    function hideMessage(element) {
        if (!element) return;
        element.innerText = "";
        element.style.display = "none";
    }

    // Global application state
    const state = {
        products: [
            {
                id: "1",
                title: "Academic Textbooks",
                category: "books",
                price: 1500,
                imgSrc: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.7MLIg-2xpAjHhwY89UXQ2AHaHa%3Fr%3D0%26pid%3DApi&f=1&ipt=5cc27ace4c6b2819ea2940d992801ea6bbbbe883b23dba084efbad4f48830037&ipo=images",
                alt: "Stack of academic course textbooks for university study"
            },
            {
                id: "2",
                title: "Laptop Stand",
                category: "electronics",
                price: 2000,
                imgSrc: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.-D6z9Fg5Pam9-WqFjldYrgHaI7%3Fr%3D0%26pid%3DApi&f=1&ipt=24299268a8d2520759481fb4b700fb04263ba95733dbd4d4cced150765b9c4f3&ipo=images",
                alt: "Foldable aluminum desk laptop stand"
            },
            {
                id: "3",
                title: "Wireless Headphones",
                category: "electronics",
                price: 2500,
                imgSrc: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.KInMuXAO_w7yhzTHsbnhCwHaHa%3Fr%3D0%26pid%3DApi&f=1&ipt=594729e55f9a1203c3c040a1bbcd0e5855add4f918af4efaf7944a7484ce3a93&ipo=images",
                alt: "Black over-ear wireless audio headphones"
            },
            {
                id: "4",
                title: "Campus Backpack",
                category: "books",
                price: 1800,
                imgSrc: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.explicit.bing.net%2Fth%2Fid%2FOIP.xh8sabSU6hOkNQbO8zGN6wHaJN%3Fr%3D0%26pid%3DApi&f=1&ipt=595f093e6e5f7dea107c3721170282805e132404b4226a993d69b949edb36b71&ipo=images",
                alt: "Durable navy blue student campus backpack"
            }
        ],
        filteredProducts: [],
        currentSlideIndex: 0
    };

    state.filteredProducts = [...state.products];

    const searchInput = document.getElementById("searchInput");
    const categorySelect = document.getElementById("categorySelect");
    const calcErrorMessage = document.getElementById("calcErrorMessage");

    const galleryModal = document.getElementById("galleryModal");
    const openGalleryBtn = document.getElementById("openGalleryBtn");
    const closeGalleryBtn = document.getElementById("closeGalleryBtn");
    const prevSlideBtn = document.getElementById("prevSlideBtn");
    const nextSlideBtn = document.getElementById("nextSlideBtn");
    const activeSlideImage = document.getElementById("activeSlideImage");
    const activeSlideCaption = document.getElementById("activeSlideCaption");
    const slideCounter = document.getElementById("slideCounter");

    // 1. FILTER & GALLERY DATA INTEGRATION
    function filterProducts() {
        if (!searchInput || !categorySelect) return;

        const searchValue = searchInput.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value;
        const productCards = document.querySelectorAll(".product-card");

        state.filteredProducts = state.products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchValue);
            const matchesCategory = (selectedCategory === "all" || product.category === selectedCategory);
            return matchesSearch && matchesCategory;
        });

        productCards.forEach(card => {
            const cardId = card.getAttribute("data-id");
            const isVisible = state.filteredProducts.some(p => p.id === cardId);
            card.style.display = isVisible ? "block" : "none";
        });

        state.currentSlideIndex = 0;
    }

    if (searchInput) searchInput.addEventListener("keyup", filterProducts);
    if (categorySelect) categorySelect.addEventListener("change", filterProducts);

    // 2. LIVE CALCULATIONS & INPUT VALIDATION
    const qtyInputs = document.querySelectorAll(".calc-box input");

    qtyInputs.forEach(input => {
        ["input", "change"].forEach(eventType => {
            input.addEventListener(eventType, function () {
                calculateTotal(this);
            });
        });
    });

    function calculateTotal(inputElement) {
        const rawValue = inputElement.value.trim();
        const quantity = Number(rawValue);
        const card = inputElement.closest(".product-card");
        if (!card) return;

        const unitPriceElement = card.querySelector(".unit-price");
        const calculatedValDisplay = card.querySelector(".calculated-val");

        if (!unitPriceElement || !calculatedValDisplay) return;

        const unitPrice = parseFloat(unitPriceElement.innerText.replace(/[^0-9.]/g, ""));

        if (rawValue === "" || isNaN(quantity) || !Number.isInteger(quantity) || quantity <= 0) {
            inputElement.classList.add("invalid-input");
            calculatedValDisplay.innerText = "0 (Invalid)";
            
            if (calcErrorMessage) {
                showMessage(
                    calcErrorMessage,
                    "Quantity must be a positive whole number greater than 0.",
                    "error"
                );
            }
        } else {
            inputElement.classList.remove("invalid-input");
            const total = unitPrice * quantity;
            calculatedValDisplay.innerText = total.toLocaleString();
            
            if (calcErrorMessage) {
                hideMessage(calcErrorMessage);
            }
        }
    }

    // 3. SLIDESHOW GALLERY 
    function updateSlideshow() {
        if (!activeSlideImage || !activeSlideCaption || !slideCounter) return;

        if (state.filteredProducts.length === 0) {
            activeSlideImage.src = "";
            activeSlideImage.alt = "No matching products";
            activeSlideCaption.innerText = "No products match the active filter.";
            slideCounter.innerText = "0 of 0";
            return;
        }

        const currentItem = state.filteredProducts[state.currentSlideIndex];
        activeSlideImage.src = currentItem.imgSrc;
        activeSlideImage.alt = currentItem.alt;
        activeSlideCaption.innerText = `${currentItem.title} — KSh ${currentItem.price}`;
        slideCounter.innerText = `Image ${state.currentSlideIndex + 1} of ${state.filteredProducts.length}`;
    }

    if (openGalleryBtn) {
        openGalleryBtn.addEventListener("click", () => {
            updateSlideshow();
            if (galleryModal) galleryModal.classList.remove("hidden");
        });
    }

    if (closeGalleryBtn) {
        closeGalleryBtn.addEventListener("click", () => {
            if (galleryModal) galleryModal.classList.add("hidden");
        });
    }

    if (nextSlideBtn) {
        nextSlideBtn.addEventListener("click", () => {
            if (state.filteredProducts.length === 0) return;
            state.currentSlideIndex = (state.currentSlideIndex + 1) % state.filteredProducts.length;
            updateSlideshow();
        });
    }

    if (prevSlideBtn) {
        prevSlideBtn.addEventListener("click", () => {
            if (state.filteredProducts.length === 0) return;
            state.currentSlideIndex = (state.currentSlideIndex - 1 + state.filteredProducts.length) % state.filteredProducts.length;
            updateSlideshow();
        });
    }

    // 4. FORM VALIDATION & UI ANIMATIONS
    const registerForm = document.getElementById("registerForm");
    const showPasswordToggle = document.getElementById("showPasswordToggle");
    const formMessage = document.getElementById("formMessage");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fullNameEl = document.getElementById("fullName");
            const emailEl = document.getElementById("email");
            const passwordEl = document.getElementById("password");
            const confirmPasswordEl = document.getElementById("confirmPassword");

            if (!fullNameEl || !emailEl || !passwordEl || !confirmPasswordEl) return;

            const fullName = fullNameEl.value.trim();
            const email = emailEl.value.trim();
            const password = passwordEl.value;
            const confirmPassword = confirmPasswordEl.value;

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
                showMessage(formMessage, "All required fields must be filled out.", "error");
                return;
            }

            if (!emailPattern.test(email)) {
                showMessage(formMessage, "Please enter a valid email address.", "error");
                return;
            }

            if (password.length < 6) {
                showMessage(formMessage, "Password must be at least 6 characters long.", "error");
                return;
            }

            if (password !== confirmPassword) {
                showMessage(formMessage, "Passwords do not match.", "error");
                return;
            }

            showMessage(formMessage, "Registration successful! Welcome to CampusMarket.", "success");

            const container = document.querySelector(".register-section");
            if (container) {
                container.classList.remove("animated-success");
                void container.offsetWidth;
                container.classList.add("animated-success");
            }

            registerForm.reset();
        });
    }

    if (showPasswordToggle) {
        showPasswordToggle.addEventListener("change", function () {
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput = document.getElementById("confirmPassword");
            const typeMode = this.checked ? "text" : "password";

            if (passwordInput) passwordInput.type = typeMode;
            if (confirmPasswordInput) confirmPasswordInput.type = typeMode;
        });
    }
});