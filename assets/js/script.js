//Copyright 2024 Nexnova IT Solutions
let products = [
  { id: 1, name: "Cookies", price: 1.5, stock: 10, img: "assets/images/cookie.jpg" },
  { id: 2, name: "Milk Powder", price: 1.2, stock: 5, img: "assets/images/milkpowder.jpg" },
  { id: 3, name: "Bread", price: 1.0, stock: 8, img: "assets/images/bread.jpg" },
  { id: 4, name: "Eggs", price: 2.5, stock: 12, img: "assets/images/eggs.jpg" },
  { id: 5, name: "Butter", price: 2.5, stock: 20, img: "assets/images/butter.jpg" },
  { id: 6, name: "Jam", price: 0.5, stock: 10, img: "assets/images/jam.jpg" },
  { id: 7, name: "Blueberry Juice", price: 2.0, stock: 8, img: "assets/images/blueberryjuice.jpg" },
  { id: 8, name: "Watermelon Juice", price: 3.5, stock: 12, img: "assets/images/watermelonsmoothie.jpg" },
  { id: 9, name: "Dark Chocolate", price: 2.5, stock: 20, img: "assets/images/chocolate.jpg" },
  { id: 10, name: "Ice Cream", price: 4.0, stock: 40, img: "assets/images/icecream.jpg" }

];

let cart = [];
let totalSales = 0;

// Login
document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (username && phone) {
    // Set user name
    document.getElementById("user-name").textContent = username;

    // Hide login screen and show POS system
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("pos-system").classList.remove("hidden");

    // Render products
    renderProducts();
  } else {
    alert("Please enter all details!");
  }
});


// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  document.getElementById("pos-system").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
  document.getElementById("username").value = "";
  document.getElementById("phone").value = "";
});

// Render Products
function renderProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";
  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h1>${product.name}</h1>
      <h2>Price: $${product.price.toFixed(2)}</h2>
      <h3>Stock: ${product.stock}</h3>
      <button onclick="addToCart(${product.id})" ${product.stock === 0 ? "disabled" : ""}>Add to Cart</button>
    `;
    productsContainer.appendChild(productDiv);
  });
}

// Add to Cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (product.stock > 0) {
    cart.push(product);
    product.stock--;
    renderProducts();
    renderCart();
  }
}

// Render Cart
function renderCart() {
  const cartContainer = document.getElementById("cart");
  cartContainer.innerHTML = "";
  if (cart.length === 0) {
    cartContainer.innerHTML = "<h4>Your cart is empty.</h4>";
    updateTotal();
    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <h1>${item.name}</h1>
        <h2>$${item.price.toFixed(2)}</h2></div>
        <button id="remove-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });
  updateTotal();
}

// Remove from Cart
function removeFromCart(index) {
  const item = cart[index];
  products.find(p => p.id === item.id).stock++;
  cart.splice(index, 1);
  renderProducts();
  renderCart();
}

// Update Total
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const discount = total > 10 ? 2 : 0;
  document.getElementById("discount").textContent = discount.toFixed(2);
  document.getElementById("total").textContent = (total - discount).toFixed(2);
}

function generateReceiptPDF() {
	 const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFont("Helvetica", "bold");
  pdf.text("NEXOVA SUPER MART", 20, 20);
  pdf.text("Receipt", 20, 30);
  pdf.setFont("Helvetica", "normal");
  pdf.text(`Customer Name: ${document.getElementById("user-name").textContent}`, 20, 40);
  pdf.text(`Date: ${new Date().toLocaleString()}`, 20, 50);

  pdf.text("Items Purchased:", 20, 70);
  let y = 80;
  cart.forEach((item, index) => {
    pdf.text(`${index + 1}. ${item.name} - $${item.price.toFixed(2)}`, 30, y);
    y += 10;
  });

  pdf.setFont("Helvetica", "bold");
  pdf.text(`Discount: $${document.getElementById("discount").textContent}`, 20, y + 10);
  pdf.text(`Total: $${document.getElementById("total").textContent}`, 20, y + 20);

  pdf.text("Thank you for shopping with us!", 20, y + 40);
  
  pdf.setFont("Helvetica", "normal");
  pdf.text("Powered by NEXOVA. 2024", 20, y + 60);
  pdf.save(`Receipt_${timestamp}.pdf`);
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  totalSales += parseFloat(document.getElementById("total").textContent);

  // Generate PDF receipt
  generateReceiptPDF();

  alert("Checkout successful! Receipt downloaded.");
  cart = [];
  renderProducts();
  renderCart();
});

// View Analytics
document.getElementById("view-analytics-btn").addEventListener("click", () => {
  const analyticsSection = document.getElementById("analytics");
  document.getElementById("total-sales").textContent = totalSales.toFixed(2);
  analyticsSection.classList.toggle("hidden");
});
