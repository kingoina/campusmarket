
function filterProducts() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let selectedCategory = document.getElementById("categorySelect").value;
    let products = document.getElementsByClassName("product-card");

    // Loop through all product cards
    for (let i = 0; i < products.length; i++) {
        let card = products[i];
        let title = card.getElementsByTagName("h3")[0].innerText.toLowerCase();
        let category = card.getAttribute("data-category");

        // Decisions using if / else
        let matchesSearch = title.includes(searchValue);
        let matchesCategory = (selectedCategory === "all" || category === selectedCategory);

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}


function calculateTotal(inputElement) {
    let quantity = parseInt(inputElement.value);

    //  prevent invalid quantities
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        inputElement.value = 1;
    }

    let card = inputElement.closest(".product-card");
    let unitPrice = parseFloat(card.querySelector(".unit-price").innerText);
    let total = unitPrice * quantity;

    card.querySelector(".total-price").innerText = "Total: KSh " + total;
}