/**
 * 麻阳苗乡暖心家园 - 通用脚本
 * 轻量化、零依赖、纯原生 JS
 */

document.addEventListener('DOMContentLoaded', function () {

  // ========== 移动端菜单切换 ==========
  const menuToggle = document.querySelector('.menu-toggle');
  const headerNav = document.querySelector('.header-nav');

  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function () {
      headerNav.classList.toggle('open');
    });

    // 点击菜单项后自动关闭
    headerNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        headerNav.classList.remove('open');
      });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function (e) {
      if (!menuToggle.contains(e.target) && !headerNav.contains(e.target)) {
        headerNav.classList.remove('open');
      }
    });
  }

  // ========== 退出登录 ==========
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('确定要退出登录吗？')) {
        fetch('/api/auth/logout')
          .then(function () { window.location.href = '/'; })
          .catch(function () { window.location.href = '/'; });
      }
    });
  }

  // ========== 字体大小切换（无障碍） ==========
  const fontSizeToggle = document.querySelector('.font-size-toggle');
  if (fontSizeToggle) {
    if (localStorage.getItem('largeFont') === 'true') {
      document.body.classList.add('large-font');
      fontSizeToggle.textContent = 'A-';
    }

    fontSizeToggle.addEventListener('click', function () {
      document.body.classList.toggle('large-font');
      var isLarge = document.body.classList.contains('large-font');
      localStorage.setItem('largeFont', isLarge);
      fontSizeToggle.textContent = isLarge ? 'A-' : 'A+';
    });
  }

  // ========== 滚动到顶部按钮 ==========
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== 标签页切换 ==========
  var tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabGroup = this.closest('.tabs');
      var container = tabGroup ? tabGroup.parentElement : document;

      var allBtns = (tabGroup || container).querySelectorAll('.tab-btn');
      var allContents = container.querySelectorAll('.tab-content');

      allBtns.forEach(function (b) { b.classList.remove('active'); });
      allContents.forEach(function (c) { c.classList.remove('active'); });

      this.classList.add('active');
      var targetId = this.getAttribute('data-tab');
      var target = document.getElementById(targetId);
      if (target) {
        target.classList.add('active');
      }
    });
  });

  // ========== 留言表单提交（模拟 - 作为无JS API时的后备） ==========
  var messageForm = document.getElementById('messageForm');
  if (messageForm) {
    // Only use fallback if the form doesn't already have a real handler
    messageForm.addEventListener('submit', function (e) {
      // Check if we're on a page with the real API handler (messages.html handles this in extra_scripts)
      // If the form has ID 'helpForm', 'voiceForm', or 'feedbackForm', the page-level handler takes over
      if (this.id === 'messageForm') {
        e.preventDefault();
        var submitBtn = this.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;
        setTimeout(function () {
          var successMsg = document.getElementById('submitSuccess');
          if (successMsg) { successMsg.style.display = 'block'; }
          messageForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          setTimeout(function () { successMsg.style.display = 'none'; }, 3000);
        }, 800);
      }
    });
  }

  // ========== 心愿墙交互（静态备用 - 使用 API 的页面由 page-level script 处理） ==========
  var wishButtons = document.querySelectorAll('.wish-adopt-btn');
  wishButtons.forEach(function (btn) {
    // Skip if the button already has a data-wish-id (handled by page script)
    if (btn.hasAttribute('data-wish-id')) return;
    btn.addEventListener('click', function () {
      var wishTitle = this.getAttribute('data-wish');
      if (confirm('您确定要认领心愿：「' + wishTitle + '」吗？\n\n认领后志愿者将与您联系确认帮扶细节。')) {
        this.textContent = '已认领';
        this.classList.remove('btn-primary');
        this.classList.add('btn-outline');
        this.disabled = true;
        this.style.opacity = '0.7';
      }
    });
  });

  // ========== 当前页面导航高亮 ==========
  var currentPath = window.location.pathname;
  var navLinks = document.querySelectorAll('.header-nav a');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    // Match Flask routes
    if (currentPath === '/' && (href === '/' || href === '/index.html' || href === 'index.html' || href === '../index.html')) {
      link.classList.add('active');
    } else if (href !== '/' && href !== '#' && currentPath.startsWith(href)) {
      link.classList.add('active');
    }
  });
});
