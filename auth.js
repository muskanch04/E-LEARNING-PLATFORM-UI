// Authentication functionality

// Declare showNotification and storage variables
const showNotification = (message, type) => {
  console.log(`Notification (${type}): ${message}`)
}

const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get: (key) => JSON.parse(localStorage.getItem(key)),
  remove: (key) => {
    localStorage.removeItem(key)
  },
}

document.addEventListener("DOMContentLoaded", () => {
  setupAuthForms()
  setupPasswordToggle()
  setupSocialAuth()
  setupPasswordStrength()
  checkAutoLogin()
  setupForgotPasswordLink()
})

function setupAuthForms() {
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }
}

function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const rememberMe = document.getElementById("rememberMe").checked

  // Basic validation
  if (!email || !password) {
    showNotification("Please fill in all fields", "error")
    return
  }

  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...'
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Mock authentication - in real app, this would validate against a server
    if (email === "demo@edulearn.com" && password === "demo123") {
      // Successful login
      const userData = {
        id: 1,
        name: "John Doe",
        email: email,
        avatar: "/placeholder.svg?height=120&width=120",
      }

      storage.set("currentUser", userData)
      storage.set("isLoggedIn", true)

      if (rememberMe) {
        storage.set("rememberUser", true)
      }

      showNotification("Login successful!", "success")

      // Redirect to dashboard or previous page
      const urlParams = new URLSearchParams(window.location.search)
      const redirect = urlParams.get("redirect") || "dashboard.html"

      setTimeout(() => {
        window.location.href = redirect
      }, 1000)
    } else {
      showNotification("Invalid email or password", "error")
    }
  }, 2000)
}

function handleSignup(e) {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const agreeTerms = document.getElementById("agreeTerms").checked

  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showNotification("Please fill in all fields", "error")
    return
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error")
    return
  }

  if (!agreeTerms) {
    showNotification("Please agree to the terms and conditions", "error")
    return
  }

  if (!isPasswordStrong(password)) {
    showNotification("Password is too weak. Please choose a stronger password.", "error")
    return
  }

  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...'
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Create user account
    const userData = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      email: email,
      avatar: "/placeholder.svg?height=120&width=120",
      createdAt: new Date().toISOString(),
    }

    storage.set("currentUser", userData)
    storage.set("isLoggedIn", true)

    showNotification("Account created successfully!", "success")

    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1000)
  }, 2000)
}

function setupPasswordToggle() {
  const passwordToggles = document.querySelectorAll(".password-toggle")

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling
      const icon = this.querySelector("i")

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        passwordInput.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })
}

function setupSocialAuth() {
  const googleBtn = document.querySelector(".google-btn")
  const facebookBtn = document.querySelector(".facebook-btn")

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      handleSocialAuth("google")
    })
  }

  if (facebookBtn) {
    facebookBtn.addEventListener("click", () => {
      handleSocialAuth("facebook")
    })
  }
}

function handleSocialAuth(provider) {
  const btn = document.querySelector(`.${provider}-btn`)
  const originalText = btn.innerHTML

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...'
  btn.disabled = true

  // Simulate social auth
  setTimeout(() => {
    btn.innerHTML = originalText
    btn.disabled = false

    // Mock successful social auth
    const userData = {
      id: Date.now(),
      name: "John Doe",
      email: `user@${provider}.com`,
      avatar: "/placeholder.svg?height=120&width=120",
      provider: provider,
    }

    storage.set("currentUser", userData)
    storage.set("isLoggedIn", true)

    showNotification(`Successfully signed in with ${provider}!`, "success")

    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1000)
  }, 2000)
}

function setupPasswordStrength() {
  const passwordInput = document.getElementById("password")
  if (!passwordInput) return

  const strengthBar = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")

  if (!strengthBar || !strengthText) return

  passwordInput.addEventListener("input", function () {
    const password = this.value
    const strength = calculatePasswordStrength(password)

    updatePasswordStrengthUI(strength, strengthBar, strengthText)
  })
}

function calculatePasswordStrength(password) {
  let score = 0
  const feedback = []

  // Length check
  if (password.length >= 8) {
    score += 25
  } else {
    feedback.push("At least 8 characters")
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 25
  } else {
    feedback.push("One uppercase letter")
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 25
  } else {
    feedback.push("One lowercase letter")
  }

  // Number or special character check
  if (/[\d\W]/.test(password)) {
    score += 25
  } else {
    feedback.push("One number or special character")
  }

  return { score, feedback }
}

function updatePasswordStrengthUI(strength, strengthBar, strengthText) {
  const { score, feedback } = strength

  // Update progress bar
  strengthBar.style.width = `${score}%`

  // Update colors and text based on strength
  if (score < 50) {
    strengthBar.style.backgroundColor = "#dc2626"
    strengthText.textContent = "Weak"
    strengthText.style.color = "#dc2626"
  } else if (score < 75) {
    strengthBar.style.backgroundColor = "#f59e0b"
    strengthText.textContent = "Fair"
    strengthText.style.color = "#f59e0b"
  } else if (score < 100) {
    strengthBar.style.backgroundColor = "#10b981"
    strengthText.textContent = "Good"
    strengthText.style.color = "#10b981"
  } else {
    strengthBar.style.backgroundColor = "#059669"
    strengthText.textContent = "Strong"
    strengthText.style.color = "#059669"
  }
}

function isPasswordStrong(password) {
  const { score } = calculatePasswordStrength(password)
  return score >= 75
}

// Forgot password functionality
function handleForgotPassword() {
  const email = prompt("Please enter your email address:")

  if (!email) return

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  // Simulate sending reset email
  showNotification("Password reset link sent to your email!", "success")
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Auto-login check
function checkAutoLogin() {
  const isLoggedIn = storage.get("isLoggedIn")
  const rememberUser = storage.get("rememberUser")

  if (isLoggedIn && rememberUser) {
    // Redirect to dashboard if already logged in
    if (window.location.pathname.includes("login.html") || window.location.pathname.includes("signup.html")) {
      window.location.href = "dashboard.html"
    }
  }
}

// Logout functionality
function logout() {
  storage.remove("currentUser")
  storage.remove("isLoggedIn")
  storage.remove("rememberUser")

  showNotification("Logged out successfully", "success")

  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

// Add forgot password link functionality
function setupForgotPasswordLink() {
  const forgotPasswordLink = document.querySelector(".forgot-password")
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault()
      handleForgotPassword()
    })
  }
}
