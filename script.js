document.addEventListener('DOMContentLoaded', function () {

  var mascot = document.getElementById('mascot');
  var mascotX = window.innerWidth - 120;
  var mascotY = window.innerHeight - 140;
  var targetX = mascotX;
  var targetY = mascotY;
  var isVisible = true;
  var mascotVisible = true;
  var speed = 0.28;

  function updateMascot() {
    var dx = targetX - mascotX;
    var dy = targetY - mascotY;
    mascotX += dx * speed;
    mascotY += dy * speed;

    var clampedX = Math.max(5, Math.min(window.innerWidth - 110, mascotX));
    var clampedY = Math.max(5, Math.min(window.innerHeight - 135, mascotY));

    mascot.style.left = clampedX + 'px';
    mascot.style.top = clampedY + 'px';

    var tilt = dx * 0.025;
    mascot.style.transform = 'rotate(' + tilt + 'deg)';

    requestAnimationFrame(updateMascot);
  }

  updateMascot();

  document.addEventListener('mousemove', function (e) {
    targetX = e.clientX;
    targetY = e.clientY;
    isVisible = true;

    if (!mascotVisible) {
      mascotVisible = true;
      mascot.style.opacity = '1';
    }
  });

  document.addEventListener('mouseleave', function () {
    isVisible = false;
  });

  document.addEventListener('mouseenter', function () {
    isVisible = true;
  });

  setInterval(function () {
    if (!isVisible) {
      targetX = window.innerWidth - 120;
      targetY = window.innerHeight - 140;
    }
  }, 100);

  mascot.addEventListener('mouseenter', function () {
    mascot.classList.add('wave');
  });

  mascot.addEventListener('animationend', function () {
    mascot.classList.remove('wave');
  });

  var beansImg = document.querySelector('.hero-bg-img');
  var heroSection = document.getElementById('home');

  if (beansImg && heroSection) {
    document.addEventListener('mousemove', function (e) {
      if (window.innerWidth > 768) {
        var heroRect = heroSection.getBoundingClientRect();
        if (e.clientY > heroRect.top && e.clientY < heroRect.bottom) {
          var xOffset = (e.clientX - window.innerWidth / 2) * 0.015;
          var yOffset = (e.clientY - window.innerHeight / 2) * 0.01;
          beansImg.style.transform = 'translateX(-50%) translate(' + xOffset + 'px,' + yOffset + 'px)';
        }
      }
    });

    var beanDanceOffset = 0;
    setInterval(function () {
      beanDanceOffset = Math.random() * 2 - 1;
      beansImg.style.animationDuration = (5 + beanDanceOffset) + 's';
    }, 4000);
  }

  /* ===== Navbar Scroll Shadow ===== */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ===== Mobile Nav Toggle ===== */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ===== Scroll Animations ===== */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    observer.observe(el);
  });

  /* ===== Testimonial Carousel ===== */
  var track = document.getElementById('testimonialTrack');
  var slides = track.querySelectorAll('.testimonial-slide');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var dotsContainer = document.getElementById('carouselDots');
  var currentIndex = 0;
  var isTransitioning = false;

  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    updateDots();
    setTimeout(function () { isTransitioning = false; }, 500);
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  function prevSlide() {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', (function (idx) {
        return function () { goToSlide(idx); };
      })(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    var dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  createDots();
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  var autoSlider = setInterval(nextSlide, 5000);
  var carousel = document.getElementById('testimonialCarousel');
  carousel.addEventListener('mouseenter', function () { clearInterval(autoSlider); });
  carousel.addEventListener('mouseleave', function () { autoSlider = setInterval(nextSlide, 5000); });

  var touchStartX = 0;
  var touchEndX = 0;
  track.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) { if (diff > 0) nextSlide(); else prevSlide(); }
  }, { passive: true });

  /* ===== Cart Drawer ===== */
var cart = [];
var cartDrawer = document.getElementById('cartDrawer');
var cartOverlay = document.getElementById('cartOverlay');
var cartBody = document.getElementById('cartBody');
var cartFooter = document.getElementById('cartFooter');
var cartTotal = document.getElementById('cartTotal');
var cartCount = document.getElementById('cartCount');
var cartToggle = document.getElementById('cartToggle');
var cartClose = document.getElementById('cartClose');
var checkoutBtn = document.getElementById('checkoutBtn');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (cartToggle) cartToggle.addEventListener('click', function (e) {
  e.preventDefault();
  openCart();
});

if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeCart();
});

function updateCart() {
  var totalItems = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  if (cartCount) cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Your cart is empty. Start exploring our beans.</p>';
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  if (cartFooter) cartFooter.style.display = 'block';

  var html = '';
  var total = 0;
  cart.forEach(function (item, index) {
    var subtotal = item.price * item.qty;
    total += subtotal;
    html += '<div class="cart-item">';
    html += '<div class="cart-item-image">' + item.name.split(' ').map(function(w){return w[0]}).join('') + '</div>';
    html += '<div class="cart-item-info">';
    html += '<div class="cart-item-name">' + item.name + '</div>';
    html += '<div class="cart-item-roast">' + item.roast + '</div>';
    html += '<div class="cart-item-price">$' + item.price.toFixed(2) + '</div>';
    html += '<div class="cart-item-actions">';
    html += '<button class="cart-qty-btn" data-action="decrease" data-index="' + index + '">-</button>';
    html += '<span class="cart-qty">' + item.qty + '</span>';
    html += '<button class="cart-qty-btn" data-action="increase" data-index="' + index + '">+</button>';
    html += '<button class="cart-item-remove" data-index="' + index + '">Remove</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  });

  cartBody.innerHTML = html;
  if (cartTotal) cartTotal.textContent = '$' + total.toFixed(2);

  cartBody.querySelectorAll('.cart-qty-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.getAttribute('data-index'));
      var action = btn.getAttribute('data-action');
      if (action === 'increase') cart[idx].qty++;
      if (action === 'decrease' && cart[idx].qty > 1) cart[idx].qty--;
      if (cart[idx].qty < 1) cart.splice(idx, 1);
      updateCart();
    });
  });

  cartBody.querySelectorAll('.cart-item-remove').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.getAttribute('data-index'));
      cart.splice(idx, 1);
      updateCart();
    });
  });
}

document.querySelectorAll('.btn-add-cart').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var productName = btn.getAttribute('data-product');
    var productPrice = parseFloat(btn.getAttribute('data-price'));
    var productRoast = btn.closest('.product-card').querySelector('.product-roast').textContent;

    var existing = cart.find(function (item) { return item.name === productName; });
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name: productName, price: productPrice, roast: productRoast, qty: 1 });
    }

    btn.textContent = 'Added';
    btn.classList.add('added');
    showToast('Added ' + productName + ' to cart');
    updateCart();

    setTimeout(function () { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 1500);
  });
});

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function () {
    if (cart.length === 0) return;
    var total = cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
    cart = [];
    updateCart();
    closeCart();
    showToast('Order placed! Total: $' + total.toFixed(2) + ' — Thank you!');
  });
}

function showToast(message) {
  var cartToast = document.getElementById('cartToast');
  if (!cartToast) return;
  cartToast.innerHTML = '<span class="toast-icon"></span>' + message;
  cartToast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(function () { cartToast.classList.remove('show'); }, 2500);
}

/* ===== Newsletter Form ===== */
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterMsg = document.getElementById('newsletterMsg');

  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var emailInput = document.getElementById('emailInput');
    var email = emailInput.value.trim();
    if (email) {
      newsletterMsg.textContent = 'Welcome aboard! Check your inbox for a confirmation.';
      newsletterMsg.style.color = '#F5EDE3';
      emailInput.value = '';
    }
  });

});