document.addEventListener("DOMContentLoaded", () => {
  const cartCountElement = document.querySelector(".cart-count"); 
  const checkoutLink = document.querySelector("#checkout-link"); 
  const checkoutButton = document.querySelector("#checkout"); 

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCountElement) {
      cartCountElement.textContent = totalItems > 0 ? totalItems : "";
      cartCountElement.classList.toggle("hidden", totalItems === 0);
    }


    if (checkoutButton) {
      if (cart.length === 0) {
        checkoutButton.disabled = true;
        checkoutButton.classList.add("opacity-50", "cursor-not-allowed");
      } else {
        checkoutButton.disabled = false;
        checkoutButton.classList.remove("opacity-50", "cursor-not-allowed");
      }
    }
  }

  updateCartCount();

 
  if (checkoutLink) {
    checkoutLink.addEventListener("click", (event) => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        event.preventDefault();
        alert("Your cart is empty! Add items before proceeding to checkout.");
      }
    });
  }

  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const image = button.getAttribute("data-image");
      const price = parseInt(button.getAttribute("data-price"), 10);

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProduct = cart.find((item) => item.name === name);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ name, image, price, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert(`${name} has been added to your cart!`);
    });
  });

  // Cart function
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.querySelector("#cart-container");

  if (cartContainer) {
    if (cart.length === 0) {
      cartContainer.innerHTML = `<p class="text-center text-gray-500 text-lg">Your cart is empty.</p>`;
    } else {
      cart.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.classList.add(
          "flex",
          "items-center",
          "justify-between",
          "bg-white",
          "p-4",
          "rounded-lg",
          "shadow-md",
          "space-x-4"
        );
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg">
          <p class="flex-grow text-gray-800 font-medium">${product.name}</p>
          <p class="text-gray-600 font-semibold">₹<span class="price-display">${product.price * product.quantity}</span></p>
          <div class="flex items-center space-x-2">
            <button class="bg-gray-300 text-gray-700 px-3 py-1 rounded decrement-btn">-</button>
            <span class="quantity-display">${product.quantity}</span>
            <button class="bg-gray-300 text-gray-700 px-3 py-1 rounded increment-btn">+</button>
          </div>
          <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none remove-btn" data-index="${index}">
            Remove
          </button>
        `;
        cartContainer.appendChild(productCard);

        const incrementBtn = productCard.querySelector(".increment-btn");
        const decrementBtn = productCard.querySelector(".decrement-btn");
        const quantityDisplay = productCard.querySelector(".quantity-display");
        const priceDisplay = productCard.querySelector(".price-display");

        incrementBtn.addEventListener("click", () => {
          product.quantity += 1;
          quantityDisplay.textContent = product.quantity;
          priceDisplay.textContent = product.price * product.quantity;
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
        });

        decrementBtn.addEventListener("click", () => {
          if (product.quantity > 1) {
            product.quantity -= 1;
            quantityDisplay.textContent = product.quantity;
            priceDisplay.textContent = product.price * product.quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
          }
        });

        const removeBtn = productCard.querySelector(".remove-btn");
        removeBtn.addEventListener("click", () => {
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          location.reload();
          updateCartCount();
        });
      });
    }
  }
});

  