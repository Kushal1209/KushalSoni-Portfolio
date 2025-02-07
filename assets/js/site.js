// Preloader Animation
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 3000);
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Section Transitions
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('visible');
      }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('section').forEach(section => {
  sectionObserver.observe(section);
});

// Page Transitions for Navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      
      // Trigger transition
      const transition = document.querySelector('.page-transition');
      transition.classList.add('active');
      
      setTimeout(() => {
          window.location.href = target;
      }, 600);
      
      setTimeout(() => {
          transition.classList.remove('active');
      }, 1200);
  });
});

// Update image tags to use data-src for lazy loading
document.querySelectorAll('img').forEach(img => {
  if (!img.dataset.src) {
      img.setAttribute('data-src', img.src);
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Tiny placeholder
  }
});

// Feature Detection and Fallbacks
const FeatureDetection = {
  init() {
      this.checkIntersectionObserver();
      this.checkSmoothScroll();
      this.checkWebpSupport();
      this.addTouchSupport();
  },

  checkIntersectionObserver() {
      if (!('IntersectionObserver' in window)) {
          // Fallback for older browsers
          document.querySelectorAll('[data-src]').forEach(img => {
              img.src = img.dataset.src;
          });
          document.querySelectorAll('section').forEach(section => {
              section.style.opacity = 1;
              section.style.transform = 'none';
          });
      }
  },

  checkSmoothScroll() {
      if (!('scrollBehavior' in document.documentElement.style)) {
          // Smooth scroll polyfill
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
              anchor.addEventListener('click', function(e) {
                  e.preventDefault();
                  const target = document.querySelector(this.getAttribute('href'));
                  if (target) {
                      target.scrollIntoView({
                          behavior: 'smooth'
                      });
                  }
              });
          });
      }
  },

  checkWebpSupport() {
      const webpTest = new Image();
      webpTest.onload = function() {
          const isWebpSupported = (webpTest.width > 0) && (webpTest.height > 0);
          document.documentElement.classList.add(isWebpSupported ? 'webp' : 'no-webp');
      };
      webpTest.onerror = function() {
          document.documentElement.classList.add('no-webp');
      };
      webpTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  },

  addTouchSupport() {
      if ('ontouchstart' in window) {
          document.documentElement.classList.add('touch-device');
      }
  }
};

// Browser Detection
const BrowserDetection = {
  init() {
      this.addBrowserClasses();
      this.addDeviceClasses();
  },

  addBrowserClasses() {
      const ua = navigator.userAgent;
      let browserClass = '';

      if (ua.includes('Chrome')) browserClass = 'chrome';
      else if (ua.includes('Firefox')) browserClass = 'firefox';
      else if (ua.includes('Safari')) browserClass = 'safari';
      else if (ua.includes('Edge')) browserClass = 'edge';
      else if (ua.includes('MSIE') || ua.includes('Trident/')) browserClass = 'ie';

      document.documentElement.classList.add(browserClass);
  },

  addDeviceClasses() {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      document.documentElement.classList.add(isMobile ? 'mobile' : 'desktop');
  }
};

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  FeatureDetection.init();
  BrowserDetection.init();

  // Fallback for CSS variables
  if (!window.CSS || !window.CSS.supports || !window.CSS.supports('--fake-var', 0)) {
      const mainColor = 'rgb(191, 33, 33)';
      const style = document.createElement('style');
      style.innerHTML = `
          .primary-color { color: ${mainColor} !important; }
          .primary-bg { background-color: ${mainColor} !important; }
      `;
      document.head.appendChild(style);
  }
});

// Handle older browser animations
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
      return setTimeout(callback, 1000 / 60);
  };
}

// Scroll Top Functionality
const scrollTop = document.querySelector('#scroll-top');

// Show/Hide scroll-top button
function toggleScrollTop() {
    if (window.scrollY > 500) {
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
}

// Smooth scroll to top
scrollTop.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Check scroll position on scroll and page load
window.addEventListener('scroll', toggleScrollTop);
window.addEventListener('load', toggleScrollTop);

// Throttle scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
        toggleScrollTop();
    });
});

// Navigation Active State Management
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header .navbar ul li a');

// Function to update active state
function updateActiveState() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// Update active state on scroll
window.addEventListener('scroll', updateActiveState);

// Update active state on page load
window.addEventListener('load', updateActiveState);

// Update active state on click and smooth scroll to section
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Smooth scroll to section
        const targetId = this.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        // Get header height for offset
        const headerHeight = document.querySelector('header').offsetHeight;
        
        window.scrollTo({
            top: targetSection.offsetTop - headerHeight,
            behavior: 'smooth'
        });
    });
});

// For mobile menu - close menu when link is clicked
const menuBtn = document.querySelector('#menu');
const navbar = document.querySelector('.navbar');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('nav-toggle');
        menuBtn.classList.remove('fa-times');
    });
});

// Typing Animation
var typed = new Typed(".typing-text", {
  strings: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack .NET Developer",
  ],
  loop: true,
  typeSpeed: 60,
  backSpeed: 40,
  backDelay: 2000
});

// Smooth scroll for home buttons
document.querySelectorAll('.home-buttons .btn').forEach(button => {
  button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      const headerHeight = document.querySelector('header').offsetHeight;
      
      window.scrollTo({
          top: targetSection.offsetTop - headerHeight,
          behavior: 'smooth'
      });
      
      // Update active state in navigation
      const navLinks = document.querySelectorAll('header .navbar ul li a');
      navLinks.forEach(link => {
          link.classList.remove('active');
          if(link.getAttribute('href').slice(1) === targetId) {
              link.classList.add('active');
          }
      });
  });
});

// Parallax effect for shapes
document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.shape');
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  shapes.forEach((shape, index) => {
      const speed = (index + 1) * 2;
      const moveX = (x * speed) - (speed / 2);
      const moveY = (y * speed) - (speed / 2);
      shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});

// Animate skill bars when they come into view
const skillsSection = document.querySelector('.skills');
const skillBars = document.querySelectorAll('.skill-per');

function showProgress() {
    skillBars.forEach(skillBar => {
        const value = skillBar.getAttribute('per');
        skillBar.style.width = `${value}%`;
    });
}

function hideProgress() {
    skillBars.forEach(skillBar => {
        skillBar.style.width = 0;
    });
}

window.addEventListener('scroll', () => {
    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 2;

    if(sectionPos < screenPos) {
        showProgress();
    } else {
        hideProgress();
    }
});

// Contact Form Handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Add your form submission logic here
  // You can use fetch API or any other method to send the form data
  
  // Example animation for successful submission
  const btn = this.querySelector('.submit-btn');
  const originalContent = btn.innerHTML;
  
  btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
  btn.style.background = 'rgb(191, 33, 33)';
  
  setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.background = 'transparent';
      this.reset();
  }, 3000);
});

// Input highlight animation
const inputs = document.querySelectorAll('.input-group input, .input-group textarea');

inputs.forEach(input => {
  input.addEventListener('focus', function() {
      this.parentElement.querySelector('.input-highlight').style.width = '100%';
  });

  input.addEventListener('blur', function() {
      if (!this.value) {
          this.parentElement.querySelector('.input-highlight').style.width = '0';
      }
  });
});

// Smooth scroll function for About section contact button
document.querySelector('.contact-btn').addEventListener('click', function(e) {
  e.preventDefault();
  
  const targetId = this.getAttribute('href').slice(1);
  const targetSection = document.getElementById(targetId);
  const headerHeight = document.querySelector('header').offsetHeight;
  
  window.scrollTo({
      top: targetSection.offsetTop - headerHeight,
      behavior: 'smooth'
  });
  
  // Update active state in navigation
  const navLinks = document.querySelectorAll('header .navbar ul li a');
  navLinks.forEach(link => {
      link.classList.remove('active');
      if(link.getAttribute('href').slice(1) === targetId) {
          link.classList.add('active');
      }
  });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.querySelector('#menu');
  const navbar = document.querySelector('.navbar');

  // Toggle menu
  menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('fa-times');
      navbar.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !navbar.contains(e.target)) {
          menuBtn.classList.remove('fa-times');
          navbar.classList.remove('active');
      }
  });

  // Close menu when clicking a nav link
  document.querySelectorAll('.navbar a').forEach(link => {
      link.addEventListener('click', () => {
          menuBtn.classList.remove('fa-times');
          navbar.classList.remove('active');
      });
  });

  // Close menu when scrolling
  window.addEventListener('scroll', () => {
      menuBtn.classList.remove('fa-times');
      navbar.classList.remove('active');
  });
});

// Create floating code elements
function createFloatingElements() {
  const floatingContainer = document.querySelector('.floating-elements');
  const elements = ['</', '>', '{', '}', '(', ')', '[', ']', '//', '$'];
  
  elements.forEach((el, index) => {
      const span = document.createElement('span');
      span.textContent = el;
      span.style.left = `${Math.random() * 100}%`;
      span.style.animationDelay = `${Math.random() * 10}s`;
      floatingContainer.appendChild(span);
  });
}

// Initialize Vanilla Tilt for work cards
function initTilt() {
  VanillaTilt.init(document.querySelectorAll(".work-card"), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
      scale: 1.05
  });
}

// Call functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createFloatingElements();
  initTilt();
});

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Prevent direct access to 404.html
    if (window.location.pathname === '/404.html') {
        window.location.href = 'index.html';
    }
});

// Handle 404 errors for dynamic content
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
        console.error('Resource not found:', e.target.src || e.target.href);
    }
});