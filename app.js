// PART 2 FUNCTIONS

// Function 1: Filter products based on search input and selected category
function filterProducts() {
    let searchInput = document.getElementById("searchInput");
    let categorySelect = document.getElementById("categorySelect");

    if (!searchInput || !categorySelect) return;

    let searchValue = searchInput.value.toLowerCase();
    let selectedCategory = categorySelect.value;
    let products = document.getElementsByClassName("product-card");

    for (let i = 0; i < products.length; i++) {
        let card = products[i];
        let title = card.getElementsByTagName("h3")[0].innerText.toLowerCase();
        let category = card.getAttribute("data-category");

        let matchesSearch = title.includes(searchValue);
        let matchesCategory = (selectedCategory === "all" || category === selectedCategory);

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}

// Function 2: Calculate running total live as quantity changes
function calculateTotal(inputElement) {
    let quantity = parseInt(inputElement.value);

    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        inputElement.value = 1;
    }

    let card = inputElement.closest(".product-card");
    let unitPrice = parseFloat(card.querySelector(".unit-price").innerText);
    let total = unitPrice * quantity;

    card.querySelector(".total-price").innerText = "Total: KSh " + total;
}


// PART 3: EVENT LISTENERS & FORM VALIDATION

document.addEventListener("DOMContentLoaded", function () {

    // Attach event listeners for catalog filtering if on catalog page
    let searchInput = document.getElementById("searchInput");
    let categorySelect = document.getElementById("categorySelect");

    if (searchInput) {
        searchInput.addEventListener("keyup", filterProducts);
    }
    if (categorySelect) {
        categorySelect.addEventListener("change", filterProducts);
    }

    // Attach event listeners for product quantity inputs if present
    let qtyInputs = document.querySelectorAll(".calc-box input[type='number']");
    qtyInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            calculateTotal(this);
        });
    });

    // Registration Form logic
    let registerForm = document.getElementById("registerForm");
    let showPasswordToggle = document.getElementById("showPasswordToggle");

    if (registerForm) {
        // Form submission event listener
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Stop form reload

            let fullName = document.getElementById("fullName").value.trim();
            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value;
            let confirmPassword = document.getElementById("confirmPassword").value;
            let formMessage = document.getElementById("formMessage");

            // Simple Email Regex check
            let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validation Rule 1: Required field check
            if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
                showMessage("All required fields must be filled out.", "error");
                return;
            }

            // Validation Rule 2: Format check (email format)
            if (!emailPattern.test(email)) {
                showMessage("Please enter a valid email address.", "error");
                return;
            }

            // Validation Rule 3: Custom rule (passwords must match)
            if (password !== confirmPassword) {
                showMessage("Passwords do not match.", "error");
                return;
            }

            // If all checks pass
            showMessage("Registration successful! Welcome to CampusMarket.", "success");
            registerForm.reset();
        });
    }

    // Interactive UI Element: Show / Hide password toggle
    if (showPasswordToggle) {
        showPasswordToggle.addEventListener("change", function () {
            let passwordInput = document.getElementById("password");
            let confirmPasswordInput = document.getElementById("confirmPassword");

            if (this.checked) {
                passwordInput.type = "text";
                confirmPasswordInput.type = "text";
            } else {
                passwordInput.type = "password";
                confirmPasswordInput.type = "password";
            }
        });
    }

    
    function showMessage(text, type) {
        let formMessage = document.getElementById("formMessage");
        formMessage.innerText = text;
        formMessage.className = "message-box " + type;
        formMessage.style.display = "block";
    }

});