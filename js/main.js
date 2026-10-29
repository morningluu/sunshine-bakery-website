(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHeaderScroll();
    initProductFilter();
    initContactForm();
    initScrollAnimation();
    setActiveNav();
    initCarousel();
    initCardExpand();
    initCart();
  });

  // 移动端菜单切换

  function initMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var navList = document.getElementById('navList');

    if (!toggle || !navList) return;

    toggle.addEventListener('click', function () {
      var isOpen = navList.classList.contains('open');
      if (isOpen) {
        navList.classList.remove('open');
      } else {
        navList.classList.add('open');
      }
    });

    // 点击导航链接后关闭菜单
    var links = navList.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('open');
      });
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('open');
      }
    });
  }

  // 导航栏滚动效果

  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    var scrollThreshold = 60;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // 初始检查
    onScroll();
  }

  // 产品筛选功能

  function initProductFilter() {
    var filterTabs = document.getElementById('filterTabs');
    var productGrid = document.getElementById('productGrid');

    if (!filterTabs || !productGrid) return;

    var tabs = filterTabs.querySelectorAll('.filter-tab');
    var cards = productGrid.querySelectorAll('.product-card');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        // 更新激活状态
        tabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');

        // 筛选产品
        cards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            // 添加淡入动画
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            // 延迟触发动画
            requestAnimationFrame(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 留言表单处理

  function initContactForm() {
    var form = document.getElementById('messageForm');
    var successMsg = document.getElementById('formSuccess');

    if (!form || !successMsg) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // 简单验证
      var name = document.getElementById('name');
      var phone = document.getElementById('phone');
      var email = document.getElementById('email');
      var type = document.getElementById('type');
      var message = document.getElementById('message');

      // 清除之前的错误样式
      clearErrors();

      var isValid = true;

      if (!name.value.trim()) {
        showError(name);
        isValid = false;
      }

      if (!phone.value.trim()) {
        showError(phone);
        isValid = false;
      } else if (!/^[\d\-+() ]{7,20}$/.test(phone.value.trim())) {
        showError(phone);
        isValid = false;
      }

      if (!email.value.trim()) {
        showError(email);
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email);
        isValid = false;
      }

      if (!type.value) {
        showError(type);
        isValid = false;
      }

      if (!message.value.trim()) {
        showError(message);
        isValid = false;
      }

      if (!isValid) return;

      // 模拟发送
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> 发送中...';

      setTimeout(function () {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // 3秒后可重新留言
        setTimeout(function () {
          var resetLink = document.createElement('div');
          resetLink.style.textAlign = 'center';
          resetLink.style.marginTop = '16px';
          var btn = document.createElement('button');
          btn.className = 'btn btn-outline btn-sm';
          btn.textContent = '继续留言';
          btn.addEventListener('click', function () {
            form.style.display = 'block';
            successMsg.style.display = 'none';
            resetLink.remove();
          });
          btn.style.cursor = 'pointer';
          resetLink.appendChild(btn);
          successMsg.appendChild(resetLink);
        }, 1500);
      }, 1200);
    });

    function showError(el) {
      el.style.borderColor = '#E53935';
      el.style.backgroundColor = '#FFF5F5';
    }

    function clearErrors() {
      var inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function (input) {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
      });
    }
  }

  // 滚动动画 (fade-up)

  function initScrollAnimation() {
    var animatedElements = document.querySelectorAll(
      '.product-card, .team-card, .philosophy-card, .timeline-item, .contact-card, .hours-card, .about-brief .about-text, .about-brief .about-img'
    );

    if (animatedElements.length === 0) return;

    // 给需要动画的元素添加初始类
    animatedElements.forEach(function (el) {
      if (!el.classList.contains('fade-up')) {
        el.classList.add('fade-up');
      }
    });

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  // 当前页导航高亮

  function setActiveNav() {
    var navLinks = document.querySelectorAll('.nav-list a');
    var currentPath = window.location.pathname;

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      // 提取文件名进行比较
      var linkFile = href.split('/').pop();
      var currentFile = currentPath.split('/').pop() || 'index.html';

      if (linkFile === currentFile) {
        link.classList.add('active');
      } else if (currentFile === '' && linkFile === 'index.html') {
        link.classList.add('active');
      }
    });
  }

  // Banner轮播

  function initCarousel() {
    var track = document.getElementById('carouselTrack');
    var dots = document.querySelectorAll('#carouselDots .dot');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');

    if (!track || dots.length === 0) return;

    var currentIndex = 0;
    var totalSlides = dots.length;
    var autoplayTimer = null;
    var AUTOPLAY_INTERVAL = 4000;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // 箭头点击
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoplay();
      });
    }

    // 指示点点击
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(this.getAttribute('data-index'), 10);
        goToSlide(index);
        startAutoplay();
      });
    });

    // 触摸滑动
    var touchStartX = 0;
    var touchEndX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    });

    // 启动自动轮播
    startAutoplay();
  }

  // 首页特色产品卡片展开

  function initCardExpand() {
    var expandBtns = document.querySelectorAll('.btn-expand');
    if (expandBtns.length === 0) return;

    expandBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var card = this.closest('.product-card');
        if (!card) return;

        // 关闭其他已展开的卡片
        document.querySelectorAll('.product-card.expanded').forEach(function (c) {
          if (c !== card) c.classList.remove('expanded');
        });

        // 切换当前卡片
        card.classList.toggle('expanded');
      });
    });

    // 关闭按钮
    document.querySelectorAll('.expand-close').forEach(function (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var card = this.closest('.product-card');
        if (card) card.classList.remove('expanded');
      });
    });

    // 点击展开层外部关闭（点击"去产品页选购"按钮不关闭）
    document.querySelectorAll('.card-expand').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          var card = overlay.closest('.product-card');
          if (card) card.classList.remove('expanded');
        }
      });
    });
  }

  /* ============================================
     购物车功能 (Cart)
     LocalStorage CRUD, 面板交互, Toast提示
     ============================================ */

  var CartManager = {
    STORAGE_KEY: 'sunbakery_cart',

    getCart: function() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      } catch (e) {
        return {};
      }
    },

    saveCart: function(cart) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    },

    addItem: function(product) {
      var cart = this.getCart();
      var key = product.name;

      if (cart[key]) {
        cart[key].quantity += 1;
      } else {
        cart[key] = {
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        };
      }

      this.saveCart(cart);
      return cart;
    },

    removeItem: function(productName) {
      var cart = this.getCart();
      delete cart[productName];
      this.saveCart(cart);
      return cart;
    },

    updateQuantity: function(productName, delta) {
      var cart = this.getCart();

      if (!cart[productName]) return cart;

      cart[productName].quantity += delta;

      if (cart[productName].quantity <= 0) {
        delete cart[productName];
      }

      this.saveCart(cart);
      return cart;
    },

    clearCart: function() {
      localStorage.removeItem(this.STORAGE_KEY);
    },

    getTotal: function() {
      var cart = this.getCart();
      var total = 0;
      Object.values(cart).forEach(function(item) {
        total += item.price * item.quantity;
      });
      return total;
    },

    getCount: function() {
      var cart = this.getCart();
      var count = 0;
      Object.values(cart).forEach(function(item) {
        count += item.quantity;
      });
      return count;
    }
  };

  /* 从产品卡片提取商品信息 */
  function getProductFromCard(card) {
    var nameEl = card.querySelector('.card-body h3');
    var priceEl = card.querySelector('.card-body .price');
    var imgEl = card.querySelector('.card-img img');

    var name = nameEl ? nameEl.textContent.trim() : '';
    var priceText = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '0';
    var price = parseFloat(priceText) || 0;
    var image = imgEl ? imgEl.getAttribute('src') : '';

    return { name: name, price: price, image: image };
  }

  /* 刷新浮动按钮角标 + 合计金额（轻量，不重建DOM） */
  function refreshCartTotals() {
    var cartFloatCount = document.getElementById('cartFloatCount');
    var cartTotalEl = document.getElementById('cartTotal');
    var count = CartManager.getCount();

    if (cartFloatCount) {
      cartFloatCount.textContent = count > 0 ? count : '';
    }
    if (cartTotalEl) {
      cartTotalEl.textContent = '¥' + CartManager.getTotal();
    }
  }

  /* 完整渲染购物车列表（增删商品时调用） */
  function renderCart() {
    var cart = CartManager.getCart();
    var items = Object.values(cart);
    var cartItemsEl = document.getElementById('cartItems');

    refreshCartTotals();

    if (!cartItemsEl) return;

    if (items.length === 0) {
      cartItemsEl.innerHTML = '<div class="cart-panel__empty">购物车是空的<br>快去挑选心仪的面包吧 🥐</div>';
      return;
    }

    cartItemsEl.innerHTML = items.map(function(item) {
      return '<div class="cart-item">' +
        '<div class="cart-item__info">' +
          '<div class="cart-item__name">' + escapeHTML(item.name) + '</div>' +
          '<div class="cart-item__price">¥' + item.price + '</div>' +
        '</div>' +
        '<div class="cart-item__qty">' +
          '<button class="cart-item__qty-btn" data-action="decrease" data-product-name="' + escapeHTML(item.name) + '">−</button>' +
          '<span class="cart-item__qty-num">' + item.quantity + '</span>' +
          '<button class="cart-item__qty-btn" data-action="increase" data-product-name="' + escapeHTML(item.name) + '">+</button>' +
        '</div>' +
        '<button class="cart-item__remove" data-action="remove" data-product-name="' + escapeHTML(item.name) + '" aria-label="删除">&times;</button>' +
      '</div>';
    }).join('');
  }

  /* HTML转义 */
  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* Toast提示 */
  function showToast(message) {
    var existingToast = document.querySelector('.cart-toast');
    if (existingToast) existingToast.remove();

    var toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function() {
      toast.classList.add('cart-toast--show');
    });

    setTimeout(function() {
      toast.classList.remove('cart-toast--show');
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 1800);
  }

  /* 初始化购物车 */
  function initCart() {
    var cartPanel = document.getElementById('cartPanel');
    var cartFloatBtn = document.getElementById('cartFloatBtn');
    var cartClose = document.getElementById('cartClose');
    var cartClear = document.getElementById('cartClear');
    var cartOrder = document.getElementById('cartOrder');
    var cartOverlay = document.getElementById('cartOverlay');
    var productGrid = document.getElementById('productGrid');
    var cartItemsEl = document.getElementById('cartItems');

    /* 只在产品页初始化购物车交互 */
    if (!cartPanel || !cartFloatBtn) return;

    /* 初始渲染 */
    renderCart();

    /* 打开购物车 */
    function openCart() {
      cartPanel.classList.add('cart-panel--open');
      if (cartOverlay) cartOverlay.classList.add('cart-overlay--visible');
      document.body.style.overflow = 'hidden';
    }

    /* 关闭购物车 */
    function closeCart() {
      cartPanel.classList.remove('cart-panel--open');
      if (cartOverlay) cartOverlay.classList.remove('cart-overlay--visible');
      document.body.style.overflow = '';
    }

    if (cartFloatBtn) {
      cartFloatBtn.addEventListener('click', openCart);
    }

    if (cartClose) {
      cartClose.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
      cartOverlay.addEventListener('click', closeCart);
    }

    /* 清空购物车 */
    if (cartClear) {
      cartClear.addEventListener('click', function() {
        if (CartManager.getCount() === 0) return;
        CartManager.clearCart();
        renderCart();
        showToast('购物车已清空');
      });
    }

    /* 下单 */
    if (cartOrder) {
      cartOrder.addEventListener('click', function() {
        if (CartManager.getCount() === 0) return;

        var total = CartManager.getTotal();
        var count = CartManager.getCount();

        showToast('下单成功！共 ' + count + ' 件商品，合计 ¥' + total);

        CartManager.clearCart();
        renderCart();
        closeCart();
      });
    }

    /* 购物车列表项操作（事件委托） */
    if (cartItemsEl) {
      cartItemsEl.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;

        var productName = btn.getAttribute('data-product-name');
        var action = btn.getAttribute('data-action');

        if (action === 'increase' || action === 'decrease') {
          var delta = action === 'increase' ? 1 : -1;
          CartManager.updateQuantity(productName, delta);
          var cart = CartManager.getCart();

          if (cart[productName]) {
            /* 商品还在 → 原地更新数量，不重建DOM避免弹动 */
            var cartItem = btn.closest('.cart-item');
            var qtyEl = cartItem ? cartItem.querySelector('.cart-item__qty-num') : null;
            if (qtyEl) qtyEl.textContent = cart[productName].quantity;
            refreshCartTotals();
          } else {
            /* 数量归零被删除 → 完整重建 */
            renderCart();
          }
        } else if (action === 'remove') {
          CartManager.removeItem(productName);
          renderCart();
        }
      });
    }

    /* 产品网格 - "加入购物车"按钮（事件委托） */
    if (productGrid) {
      productGrid.addEventListener('click', function(e) {
        var btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;

        var card = btn.closest('.product-card');
        if (!card) return;

        var product = getProductFromCard(card);
        if (!product.name) return;

        /* 加入购物车 */
        CartManager.addItem(product);

        /* 卡片反馈动画 */
        card.classList.add('product-card--added');
        setTimeout(function() {
          card.classList.remove('product-card--added');
        }, 600);

        /* 浮动按钮弹跳 */
        if (cartFloatBtn) {
          cartFloatBtn.classList.add('cart-float-btn--bounce');
          setTimeout(function() {
            cartFloatBtn.classList.remove('cart-float-btn--bounce');
          }, 400);
        }

        /* 更新购物车UI */
        renderCart();

        /* 提示 */
        showToast('已加入购物车：' + product.name);
      });
    }

    /* ESC 关闭购物车面板 */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && cartPanel.classList.contains('cart-panel--open')) {
        closeCart();
      }
    });
  }

  // 键盘导航支持 (Escape 关闭菜单和展开卡片)

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var navList = document.getElementById('navList');
      if (navList && navList.classList.contains('open')) {
        navList.classList.remove('open');
      }
      // 关闭展开的卡片
      document.querySelectorAll('.product-card.expanded').forEach(function (card) {
        card.classList.remove('expanded');
      });
    }
  });

})();

// 添加 spin 动画样式
(function () {
  var style = document.createElement('style');
  style.textContent =
    '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
})();
