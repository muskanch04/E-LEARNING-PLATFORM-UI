// Global JavaScript functionality

// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const email = this.querySelector('input[type="email"]').value

      // Simulate API call
      showNotification("Thank you for subscribing!", "success")
      this.reset()
    })
  }

  // Course card hover effects
  document.querySelectorAll(".course-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Animated counters for stats
  animateCounters()

  // Initialize AOS (Animate On Scroll) if available
  const AOS = window.AOS // Declare the AOS variable
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }
})

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.remove()
  }, 5000)

  // Manual close
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.remove()
  })
}

// Animate counters
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number")

  counters.forEach((counter) => {
    const target = Number.parseInt(counter.textContent.replace(/[^\d]/g, ""))
    const duration = 2000
    const step = target / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(timer)
      }

      const suffix = counter.textContent.replace(/[\d,]/g, "")
      counter.textContent = Math.floor(current).toLocaleString() + suffix
    }, 16)
  })
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Loading animation
function showLoading() {
  const loader = document.createElement("div")
  loader.className = "loader"
  loader.innerHTML = '<div class="spinner"></div>'
  document.body.appendChild(loader)
  return loader
}

function hideLoading(loader) {
  if (loader) {
    loader.remove()
  }
}

// Local storage helpers
const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error("Error saving to localStorage:", e)
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error("Error reading from localStorage:", e)
      return null
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error("Error removing from localStorage:", e)
    }
  },
}
