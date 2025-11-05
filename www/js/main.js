/**
 * Main JavaScript for Pick Quote Landing Page
 * Handles auto theme switching, smooth scrolling, and interactive features
 */

(function() {
  'use strict';

  // ===== Theme Management =====
  const ThemeManager = {
    init() {
      this.root = document.documentElement;
      this.storageKey = 'pickquote-theme';

      // Load saved theme or use system preference
      this.loadTheme();

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem(this.storageKey)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    },

    getPreferredTheme() {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme) {
        return savedTheme;
      }

      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    },

    setTheme(theme, saveToStorage = false) {
      this.root.setAttribute('data-theme', theme);
      if (saveToStorage) {
        localStorage.setItem(this.storageKey, theme);
      }
    },

    // Note: toggleTheme is kept for backward compatibility but not used in UI
    toggleTheme() {
      const currentTheme = this.root.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme, true);
    },

    loadTheme() {
      const theme = this.getPreferredTheme();
      // Only save to storage if user had previously set a preference
      const hasUserPreference = localStorage.getItem(this.storageKey);
      this.setTheme(theme, hasUserPreference);
    }
  };

  // ===== Dynamic Year =====
  const DynamicYear = {
    init() {
      const yearElement = document.getElementById('currentYear');
      if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
      }
    }
  };

  // ===== Smooth Scrolling =====
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // ===== Navbar Scroll Effect =====
  const NavbarEffect = {
    init() {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      let lastScroll = 0;
      const scrollThreshold = 100;

      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 10) {
          navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
          navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
      });
    }
  };

  // ===== Intersection Observer for Animations =====
  const ScrollAnimations = {
    init() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      // Observe feature cards and other animated elements
      document.querySelectorAll('.feature-card, .step-item, .download-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    }
  };

  // ===== Mobile Menu (if needed in future) =====
  const MobileMenu = {
    init() {
      // Placeholder for future mobile menu implementation
      // Currently navigation is simple enough for responsive CSS
    }
  };

  // ===== Statistics Counter Animation =====
  const CounterAnimation = {
    init() {
      const counters = document.querySelectorAll('.stat-number');

      const observerOptions = {
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
      const text = element.textContent;

      // Only animate numeric values
      if (text.includes('%') || /^\d+(\.\d+)?$/.test(text)) {
        const isPercentage = text.includes('%');
        const targetValue = parseFloat(text);

        let currentValue = 0;
        const increment = targetValue / 50; // Animation duration
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            element.textContent = text; // Keep original format
            clearInterval(timer);
          } else {
            element.textContent = Math.ceil(currentValue) + (isPercentage ? '%' : '');
          }
        }, 30);
      }
    }
  };

  // ===== Parallax Effect for Hero Section =====
  const ParallaxEffect = {
    init() {
      const heroBg = document.querySelector('.hero-bg');

      if (!heroBg) return;

      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      });
    }
  };

  // ===== Copy to Clipboard Helper (for future use) =====
  const ClipboardHelper = {
    copy(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((resolve, reject) => {
          if (document.execCommand('copy')) {
            resolve();
          } else {
            reject(new Error('Copy failed'));
          }
          textArea.remove();
        });
      }
    }
  };

  // ===== Toast Notification (for user feedback) =====
  const Toast = {
    show(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;

      // Styles for toast
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-2xl)',
        zIndex: '10000',
        border: '1px solid var(--border-color)',
        transform: 'translateY(200px)',
        opacity: '0',
        transition: 'all 0.3s ease'
      });

      document.body.appendChild(toast);

      // Animate in
      setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      }, 10);

      // Auto remove
      setTimeout(() => {
        toast.style.transform = 'translateY(200px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  };

  // ===== Keyboard Shortcuts =====
  const KeyboardShortcuts = {
    init() {
      document.addEventListener('keydown', (e) => {
        // Only trigger if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }

        // Arrow keys for smooth navigation
        if (e.key === 'ArrowDown' && e.altKey) {
          e.preventDefault();
          window.scrollBy({
            top: window.innerHeight * 0.8,
            behavior: 'smooth'
          });
        }

        if (e.key === 'ArrowUp' && e.altKey) {
          e.preventDefault();
          window.scrollBy({
            top: -window.innerHeight * 0.8,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  // ===== Performance Monitoring =====
  const PerformanceMonitor = {
    init() {
      // Log page load performance
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        console.log(`Page load time: ${loadTime}ms`);
      });
    }
  };

  // ===== Error Handling =====
  const ErrorHandler = {
    init() {
      window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // Optionally send to analytics
      });

      window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        // Optionally send to analytics
      });
    }
  };

  // ===== Initialize All Modules =====
  const init = () => {
    try {
      DynamicYear.init();
      ThemeManager.init();
      SmoothScroll.init();
      NavbarEffect.init();
      ScrollAnimations.init();
      MobileMenu.init();
      CounterAnimation.init();
      ParallaxEffect.init();
      KeyboardShortcuts.init();
      PerformanceMonitor.init();
      ErrorHandler.init();

      console.log('Pick Quote landing page initialized successfully');
    } catch (error) {
      console.error('Error initializing page:', error);
    }
  };

  // DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for testing purposes (if needed)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      ThemeManager,
      SmoothScroll,
      NavbarEffect,
      ScrollAnimations,
      ClipboardHelper,
      Toast
    };
  }
})();
