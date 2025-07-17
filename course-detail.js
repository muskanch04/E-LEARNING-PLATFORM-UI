// Course detail page functionality

document.addEventListener("DOMContentLoaded", () => {
  initializeCourseDetail()
  setupTabNavigation()
  setupVideoPlayer()
  setupCurriculumAccordion()
  setupEnrollmentButton()
})

function initializeCourseDetail() {
  // Get course ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const courseId = urlParams.get("id")

  if (courseId) {
    loadCourseData(courseId)
  }
}

function loadCourseData(courseId) {
  // In a real application, this would fetch data from an API
  // For now, we'll use mock data
  const courseData = {
    id: courseId,
    title: "Complete JavaScript Mastery",
    subtitle: "Learn JavaScript from basics to advanced concepts with hands-on projects and real-world applications",
    rating: 4.8,
    reviews: 2450,
    students: 12450,
    duration: "40 hours",
    language: "English",
    instructor: {
      name: "Vineet Pandey",
      title: "Senior JavaScript Developer",
      avatar: "1.jpeg",
      rating: 4.9,
      students: 50000,
      courses: 15,
    },
    price: 490,
    originalPrice: 990,
    includes: [
      "40 hours on-demand video",
      "15 articles",
      "25 downloadable resources",
      "Full lifetime access",
      "Access on mobile and TV",
      "Certificate of completion",
    ],
  }

  updateCourseInfo(courseData)
}

function updateCourseInfo(course) {
  // Update page title
  document.title = `${course.title} - EduLearn`

  // Update course information in the DOM
  // This would involve updating various elements with the course data
}

function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabPanels = document.querySelectorAll(".tab-panel")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.dataset.tab

      // Remove active class from all buttons and panels
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabPanels.forEach((panel) => panel.classList.remove("active"))

      // Add active class to clicked button and corresponding panel
      this.classList.add("active")
      document.getElementById(targetTab).classList.add("active")
    })
  })
}

function setupVideoPlayer() {
  const video = document.querySelector(".video-container video")
  const playBtn = document.querySelector(".play-btn")
  const videoOverlay = document.querySelector(".video-overlay")

  if (playBtn && video) {
    playBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play()
        videoOverlay.style.display = "none"
      } else {
        video.pause()
        videoOverlay.style.display = "flex"
      }
    })

    video.addEventListener("click", function () {
      if (this.paused) {
        this.play()
        videoOverlay.style.display = "none"
      } else {
        this.pause()
        videoOverlay.style.display = "flex"
      }
    })

    video.addEventListener("ended", () => {
      videoOverlay.style.display = "flex"
    })
  }
}

function setupCurriculumAccordion() {
  const sectionHeaders = document.querySelectorAll(".curriculum-section .section-header")

  sectionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const section = this.parentElement
      const content = section.querySelector(".section-content")
      const icon = this.querySelector("i")

      // Toggle the section
      if (content.style.display === "block") {
        content.style.display = "none"
        icon.style.transform = "rotate(0deg)"
        section.classList.remove("expanded")
      } else {
        content.style.display = "block"
        icon.style.transform = "rotate(180deg)"
        section.classList.add("expanded")
      }
    })
  })
}

function setupEnrollmentButton() {
  const enrollBtn = document.querySelector(".enroll-btn")

  if (enrollBtn) {
    enrollBtn.addEventListener("click", () => {
      // Check if user is logged in
      const isLoggedIn = storage.get("isLoggedIn")

      if (!isLoggedIn) {
        // Redirect to login page
        window.location.href = "login.html?redirect=course-detail.html"
        return
      }

      // Show enrollment modal or process enrollment
      showEnrollmentModal()
    })
  }
}

function showEnrollmentModal() {
  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Enroll in Course</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="enrollment-summary">
                    <h4>Complete JavaScript Mastery</h4>
                    <div class="price-summary">
                        <span class="total-price">₹490</span>
                        <span class="original-price">₹990</span>
                        <span class="savings">You save ₹500!</span>
                    </div>
                </div>
                <div class="payment-options">
                    <h4>Payment Method</h4>
                    <div class="payment-methods">
                        <label class="payment-method">
                            <input type="radio" name="payment" value="card" checked>
                            <span>Credit/Debit Card</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="paypal">
                            <span>PayPal</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">Enroll Now</button>
            </div>
        </div>
    `

  document.body.appendChild(modal)

  // Setup modal event listeners
  modal.querySelector(".modal-close").addEventListener("click", () => modal.remove())
  modal.querySelector(".modal-cancel").addEventListener("click", () => modal.remove())
  modal.querySelector(".modal-confirm").addEventListener("click", () => {
    processEnrollment()
    modal.remove()
  })

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
}

function processEnrollment() {
  // Simulate enrollment process
  const loader = document.createElement("div") // showLoading();
  loader.className = "loader"
  document.body.appendChild(loader)

  setTimeout(() => {
    document.body.removeChild(loader) // hideLoading(loader);
    showNotification("Successfully enrolled in the course!", "success")

    // Update button text
    const enrollBtn = document.querySelector(".enroll-btn")
    if (enrollBtn) {
      enrollBtn.innerHTML = '<i class="fas fa-check"></i> Enrolled'
      enrollBtn.disabled = true
      enrollBtn.classList.add("enrolled")
    }

    // Save enrollment to local storage
    const enrolledCourses = storage.get("enrolledCourses") || []
    enrolledCourses.push({
      id: 1,
      title: "Complete JavaScript Mastery",
      enrolledAt: new Date().toISOString(),
      progress: 0,
    })
    storage.set("enrolledCourses", enrolledCourses)
  }, 2000)
}

// Review submission
function submitReview(rating, comment) {
  const reviewData = {
    rating: rating,
    comment: comment,
    date: new Date().toISOString(),
    user: storage.get("currentUser") || { name: "Anonymous User" },
  }

  // In a real app, this would send data to the server
  console.log("Review submitted:", reviewData)
  showNotification("Thank you for your review!", "success")
}

// Add to wishlist functionality
function toggleWishlist(courseId) {
  const wishlist = storage.get("wishlist") || []
  const index = wishlist.indexOf(courseId)

  if (index > -1) {
    wishlist.splice(index, 1)
    showNotification("Removed from wishlist", "info")
  } else {
    wishlist.push(courseId)
    showNotification("Added to wishlist", "success")
  }

  storage.set("wishlist", wishlist)
  updateWishlistButton(courseId, index === -1)
}

function updateWishlistButton(courseId, isInWishlist) {
  const wishlistBtn = document.querySelector(".wishlist-btn")
  if (wishlistBtn) {
    wishlistBtn.innerHTML = isInWishlist
      ? '<i class="fas fa-heart"></i> In Wishlist'
      : '<i class="far fa-heart"></i> Add to Wishlist'
    wishlistBtn.classList.toggle("active", isInWishlist)
  }
}

// Mock storage object
const storage = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

// Mock showNotification function
function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = message
  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

// Mock showLoading function
function showLoading() {
  const loader = document.createElement("div")
  loader.className = "loader"
  document.body.appendChild(loader)
  return loader
}

// Mock hideLoading function
function hideLoading(loader) {
  document.body.removeChild(loader)
}
