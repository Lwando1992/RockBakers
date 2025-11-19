// Shopping Cart functionality
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.init();
  }

  init() {
    this.updateCartCount();
    this.bindEvents();
    this.initNavigation();
    this.initProductFiltering();
    this.initContactForm();
    this.initScrollEffects();
  }

  bindEvents() {
    // Cart modal events
    document.getElementById('cart-toggle').addEventListener('click', (e) => {
      e.preventDefault();
      this.showCart();
    });

    document.getElementById('close-cart').addEventListener('click', () => {
      this.hideCart();
    });

    document.getElementById('clear-cart').addEventListener('click', () => {
      this.clearCart();
    });

    document.getElementById('checkout').addEventListener('click', () => {
      this.checkout();
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const product = e.target.dataset.product;
        const price = parseFloat(e.target.dataset.price);
        this.addItem(product, price);
        this.showAddedToCartFeedback(e.target);
      });
    });

    // Close modal when clicking outside
    document.getElementById('cart-modal').addEventListener('click', (e) => {
      if (e.target.id === 'cart-modal') {
        this.hideCart();
      }
    });
  }

  addItem(name, price) {
    const existingItem = this.items.find(item => item.name === name);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        name: name,
        price: price,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartCount();
  }

  removeItem(name) {
    this.items = this.items.filter(item => item.name !== name);
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
  }

  updateQuantity(name, quantity) {
    const item = this.items.find(item => item.name === name);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(name);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
      }
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  updateCartCount() {
    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  showCart() {
    this.renderCart();
    document.getElementById('cart-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  hideCart() {
    document.getElementById('cart-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (this.items.length === 0) {
      cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">Your cart is empty</p>';
      cartTotal.textContent = '0.00';
      return;
    }

    cartItems.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <button onclick="cart.updateQuantity('${item.name}', ${item.quantity - 1})" 
                    style="background: var(--border-color); border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">-</button>
            <span>Qty: ${item.quantity}</span>
            <button onclick="cart.updateQuantity('${item.name}', ${item.quantity + 1})" 
                    style="background: var(--secondary-color); color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">+</button>
          </div>
        </div>
        <div style="text-align: right;">
          <div class="cart-item-price">R${(item.price * item.quantity).toFixed(2)}</div>
          <button onclick="cart.removeItem('${item.name}')" 
                  style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-top: 0.5rem;">Remove</button>
        </div>
      </div>
    `).join('');

    cartTotal.textContent = this.getTotal().toFixed(2);
  }

  showAddedToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.background = '#28a745';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.disabled = false;
    }, 1500);
  }

  checkout() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Simulate checkout process
    const total = this.getTotal();
    const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
    
    if (confirm(`Proceed to checkout?\n\nItems: ${itemCount}\nTotal: R${total.toFixed(2)}\n\nThis is a school project - no actual payment will be processed.`)) {
      alert('Thank you for your order! This is a school project, so no actual payment was processed. In a real implementation, this would redirect to a secure payment gateway.');
      this.clearCart();
      this.hideCart();
    }
  }

  initNavigation() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  initProductFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card[data-category]');

    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;

        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter products
        productCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      setTimeout(() => {
        alert('Thank you for your message! We\'ll get back to you soon. (This is a demo - no actual email was sent)');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2000);
    });
  }

  initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .blog-post, .testimonial, .team-member').forEach(el => {
      observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });
  }
}

// Initialize the shopping cart when the page loads
let cart;

document.addEventListener('DOMContentLoaded', () => {
  cart = new ShoppingCart();
  
  // Add some loading animations
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Add some utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-RSA', {
    style: 'currency',
    currency: 'RSA'
  }).format(amount);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Close modal with Escape key
  if (e.key === 'Escape') {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'block') {
      cart.hideCart();
    }
  }
});

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe up - could trigger some action
    } else {
      // Swipe down - could trigger some action
    }
  }
}

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Add error handling for failed image loads
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
    this.alt = 'Image not available';
  });
});

// Analytics simulation (in real implementation, this would be Google Analytics)
function trackEvent(category, action, label) {
  console.log(`Analytics Event: ${category} - ${action} - ${label}`);
  // In real implementation:
  // gtag('event', action, {
  //   event_category: category,
  //   event_label: label
  // });
}

// Track important user interactions
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-to-cart')) {
    trackEvent('E-commerce', 'Add to Cart', e.target.dataset.product);
  }
  
  if (e.target.id === 'checkout') {
    trackEvent('E-commerce', 'Checkout Initiated', 'Cart');
  }
  
  if (e.target.classList.contains('nav-link')) {
    trackEvent('Navigation', 'Menu Click', e.target.textContent);
  }
});
