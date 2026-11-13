

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

let products = JSON.parse(
    localStorage.getItem("agricultureProducts")
) || [];

function saveProducts() {
    localStorage.setItem(
        "agricultureProducts",
        JSON.stringify(products)
    );
}

function displayProducts() {
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML =
            '<p id="emptyMessage">No products added yet!</p>';
        return;
    }

    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const heading = document.createElement("h2");
        heading.textContent = product.name;

        const visit = document.createElement("a");
        visit.textContent = "Visit";
        visit.href = product.url;
        visit.target = "_blank";
        visit.rel = "noopener noreferrer";

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";

        removeBtn.addEventListener("click", function() {
            products.splice(index, 1);
            saveProducts();
            displayProducts();
        });

        card.appendChild(heading);
        card.appendChild(visit);
        card.appendChild(removeBtn);

        productList.appendChild(card);
    });
}

productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const url = document.getElementById("productUrl").value.trim();

    try {
        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            alert("Please enter a valid HTTP or HTTPS URL.");
            return;
        }

        products.push({
            name: name,
            url: parsedUrl.href
        });

        saveProducts();
        displayProducts();

        productForm.reset();

        alert("Agriculture product added successfully!");

    } catch (error) {
        alert("Please enter a valid website URL!");
    }
});

displayProducts();
