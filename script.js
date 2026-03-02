/**
 * Zona Cero Studio - Web Core Logic
 */

const products = [
    {
        id: 1,
        name: 'ZC Matte Clay 100g',
        price: 18.50,
        image: 'assets/images/zc_product_1.png'
    },
    {
        id: 2,
        name: 'Aceite de Barba Premium Base',
        price: 22.00,
        image: 'assets/images/zc_product_2.png'
    },
    {
        id: 3,
        name: 'Champú Revitalizante',
        price: 15.00,
        image: 'assets/images/zc_product_1.png' // Using placeholder for demo
    },
    {
        id: 4,
        name: 'Kit Cuidado Barba ZC',
        price: 45.00,
        image: 'assets/images/zc_product_2.png' // Using placeholder for demo
    }
];

let cart = [];
const phone_number = '34600000000'; // Replace with actual number

// DOM Elements
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-links a');

const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const productStore = document.getElementById('productStore');
const cartItemsContainer = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
const cartTotalValue = document.getElementById('cartTotalValue');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Inject products
    renderProducts();
    // Marquee clone for seamless scroll
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        marqueeContent.innerHTML += marqueeContent.innerHTML;
    }
});

// Navigation scroll effect and Scrollspy
window.addEventListener('scroll', () => {
    // Header styling
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scrollspy logic
    const sections = document.querySelectorAll('section[id], header[id="inicio"]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        // Check if link points to current section (either #id or index.html#id)
        if (href === '#' + current || href === 'index.html#' + current) {
            link.classList.add('active');
        }
    });
});

// Mobile Menu toggles
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Cart Toggles
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCart.addEventListener('click', closeCartPanel);
cartOverlay.addEventListener('click', closeCartPanel);

function closeCartPanel() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

// Render Products Shop
function renderProducts() {
    productStore.innerHTML = '';

    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <div class="product-img">
                <img src="${p.image}" alt="${p.name}" onerror="this.src=''; this.alt='Imagen no disp.'">
            </div>
            <h3 class="product-title">${p.name}</h3>
            <span class="product-price">${p.price.toFixed(2)}€</span>
            <button class="btn btn-outline btn-add-cart" onclick="addToCart(${p.id})">Añadir al Carrito</button>
        `;
        productStore.appendChild(div);
    });
}

// Cart Logic
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();

    // Auto-open cart on add
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

window.updateQuantity = function (productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Render Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío</div>';
        cartTotalValue.textContent = '0.00€';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}" onerror="this.src=''">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${item.price.toFixed(2)}€</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotalValue.textContent = total.toFixed(2) + '€';
}

// Checkout via WhatsApp
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    let total = 0;
    let message = "Hola! Me gustaría realizar el siguiente pedido:%0A%0A";

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `- ${item.quantity}x ${item.name} (${item.price.toFixed(2)}€)%0A`;
    });

    message += `%0A*Total: ${total.toFixed(2)}€*`;

    // Open WhatsApp
    window.open(`https://wa.me/${phone_number}?text=${message}`, '_blank');
});
