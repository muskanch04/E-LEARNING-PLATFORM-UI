// Profile page functionality

// Declare storage variable
const storage = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

document.addEventListener("DOMContentLoaded", () => {
  initializeProfile()
  setupProfileTabs()
  setupProfileForm()
  setupCourseFilters()
  setupNotificationSettings()
  loadRecentActivity()
  updateLearningProgress()
})

function initializeProfile() {
  loadUserProfile()
  loadUserCourses()
  loadUserCertificates()
}

function loadUserProfile() {
  const user = storage.get("currentUser") || {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Passionate full-stack developer with a love for learning new technologies.",
    avatar: "/placeholder.svg?height=120&width=120",
    title: "Full Stack Developer",
    skills: ["JavaScript", "React", "Node.js", "Python", "UI/UX Design"],
    stats: {
      courses: 5,
      certificates: 3,
      learningTime: 45,
    },
  }

  updateProfileDisplay(user)
}

function updateProfileDisplay(user) {
  // Update profile header
  document.querySelector(".profile-header h1").textContent = `${user.firstName} ${user.lastName}`
  document.querySelector(".profile-title").textContent = user.title
  document.getElementById("profileImage").src = user.avatar

  // Update stats
  const stats = document.querySelectorAll(".profile-stats .stat")
  if (stats.length >= 3) {
    stats[0].querySelector(".stat-number").textContent = user.stats.courses
    stats[1].querySelector(".stat-number").textContent = user.stats.certificates
    stats[2].querySelector(".stat-number").textContent = `${user.stats.learningTime}h`
  }

  // Update about section
  document.querySelector(".about-content p").textContent = user.bio

  // Update skills
  const skillsContainer = document.querySelector(".skill-tags")
  if (skillsContainer) {
    skillsContainer.innerHTML = user.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")
  }

  // Update form fields
  document.getElementById("firstName").value = user.firstName
  document.getElementById("lastName").value = user.lastName
  document.getElementById("email").value = user.email
  document.getElementById("bio").value = user.bio
}

function setupProfileTabs() {
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

function setupProfileForm() {
  const profileForm = document.querySelector(".settings-form")
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveProfileChanges()
    })
  }

  // Profile image upload
  const avatarEditBtn = document.querySelector(".avatar-edit-btn")
  if (avatarEditBtn) {
    avatarEditBtn.addEventListener("click", () => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.onchange = handleAvatarUpload
      input.click()
    })
  }
}

function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      document.getElementById("profileImage").src = e.target.result
      showNotification("Profile picture updated!", "success")
    }
    reader.readAsDataURL(file)
  }
}

function saveProfileChanges() {
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    bio: document.getElementById("bio").value,
  }

  // Simulate API call
  const loader = showLoading()

  setTimeout(() => {
    hideLoading(loader)

    // Update stored user data
    const currentUser = storage.get("currentUser") || {}
    const updatedUser = { ...currentUser, ...formData }
    storage.set("currentUser", updatedUser)

    // Update display
    updateProfileDisplay(updatedUser)

    showNotification("Profile updated successfully!", "success")
  }, 1000)
}

function loadUserCourses() {
  const userCourses = [
    {
      id: 1,
      title: "Complete JavaScript Mastery",
      progress: 65,
      totalLessons: 18,
      completedLessons: 12,
      status: "in-progress",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      progress: 30,
      totalLessons: 16,
      completedLessons: 5,
      status: "in-progress",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 3,
      title: "React Fundamentals",
      progress: 100,
      totalLessons: 20,
      completedLessons: 20,
      status: "completed",
      completedDate: "Jan 15, 2024",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  renderUserCourses(userCourses)
}

function renderUserCourses(courses) {
  const container = document.querySelector(".my-courses-grid")
  if (!container) return

  container.innerHTML = courses
    .map(
      (course) => `
        <div class="my-course-card" data-status="${course.status}">
            <div class="course-thumbnail">
                <img src="${course.thumbnail}" alt="${course.title}">
                ${
                  course.status === "completed"
                    ? '<div class="course-completion-badge"><i class="fas fa-check-circle"></i></div>'
                    : `<div class="course-progress-overlay">
                        <div class="circular-progress" data-progress="${course.progress}">
                            <span>${course.progress}%</span>
                        </div>
                    </div>`
                }
            </div>
            <div class="course-details">
                <h4>${course.title}</h4>
                <p>${
                  course.status === "completed"
                    ? `Completed on ${course.completedDate}`
                    : `${course.completedLessons} of ${course.totalLessons} lessons completed`
                }</p>
                <div class="course-actions">
                    ${
                      course.status === "completed"
                        ? `<button class="btn btn-outline btn-small">View Certificate</button>
                         <button class="btn btn-outline btn-small">Review</button>`
                        : `<button class="btn btn-primary btn-small">Continue</button>
                         <button class="btn btn-outline btn-small">View Details</button>`
                    }
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  // Initialize circular progress bars
  initializeCircularProgress()
}

function initializeCircularProgress() {
  document.querySelectorAll(".circular-progress").forEach((element) => {
    const progress = element.dataset.progress
    // Add CSS animation for circular progress
    element.style.background = `conic-gradient(#2563eb ${progress * 3.6}deg, #e2e8f0 0deg)`
  })
}

function setupCourseFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.dataset.filter

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Filter courses
      filterCourses(filter)
    })
  })
}

function filterCourses(filter) {
  const courseCards = document.querySelectorAll(".my-course-card")

  courseCards.forEach((card) => {
    const status = card.dataset.status

    if (filter === "all" || filter === status) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

function loadUserCertificates() {
  const certificates = [
    {
      id: 1,
      courseName: "React Fundamentals",
      completedDate: "January 15, 2024",
      studentName: "John Doe",
    },
    {
      id: 2,
      courseName: "HTML & CSS Basics",
      completedDate: "December 20, 2023",
      studentName: "John Doe",
    },
  ]

  renderCertificates(certificates)
}

function renderCertificates(certificates) {
  const container = document.querySelector(".certificates-grid")
  if (!container) return

  container.innerHTML = certificates
    .map(
      (cert) => `
        <div class="certificate-card">
            <div class="certificate-preview">
                <div class="certificate-content">
                    <div class="certificate-header">
                        <i class="fas fa-certificate"></i>
                        <h3>Certificate of Completion</h3>
                    </div>
                    <div class="certificate-body">
                        <p>This is to certify that</p>
                        <h4>${cert.studentName}</h4>
                        <p>has successfully completed</p>
                        <h5>${cert.courseName}</h5>
                        <p class="certificate-date">${cert.completedDate}</p>
                    </div>
                </div>
            </div>
            <div class="certificate-actions">
                <button class="btn btn-primary btn-small" onclick="downloadCertificate(${cert.id})">
                    <i class="fas fa-download"></i>
                    Download
                </button>
                <button class="btn btn-outline btn-small" onclick="shareCertificate(${cert.id})">
                    <i class="fas fa-share"></i>
                    Share
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function downloadCertificate(certId) {
  showNotification("Certificate download started!", "success")
  // In a real app, this would generate and download a PDF certificate
}

function shareCertificate(certId) {
  if (navigator.share) {
    navigator.share({
      title: "My Certificate",
      text: "Check out my certificate from EduLearn!",
      url: window.location.href,
    })
  } else {
    // Fallback for browsers that don't support Web Share API
    const url = window.location.href
    navigator.clipboard.writeText(url)
    showNotification("Certificate link copied to clipboard!", "success")
  }
}

function setupNotificationSettings() {
  const toggleSwitches = document.querySelectorAll(".toggle-switch input")

  toggleSwitches.forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const setting = this.closest(".setting-item").querySelector("h4").textContent
      const enabled = this.checked

      // Save notification preference
      const notifications = storage.get("notificationSettings") || {}
      notifications[setting] = enabled
      storage.set("notificationSettings", notifications)

      showNotification(`${setting} ${enabled ? "enabled" : "disabled"}`, "info")
    })
  })

  // Load saved notification settings
  const savedSettings = storage.get("notificationSettings") || {}
  toggleSwitches.forEach((toggle) => {
    const setting = toggle.closest(".setting-item").querySelector("h4").textContent
    if (savedSettings.hasOwnProperty(setting)) {
      toggle.checked = savedSettings[setting]
    }
  })
}

// Activity feed functionality
function loadRecentActivity() {
  const activities = [
    {
      icon: "fas fa-play-circle",
      text: 'Completed lesson "Advanced Functions" in JavaScript Mastery',
      time: "2 hours ago",
    },
    {
      icon: "fas fa-trophy",
      text: 'Earned certificate for "React Fundamentals"',
      time: "1 day ago",
    },
    {
      icon: "fas fa-star",
      text: "Achieved 5-day learning streak",
      time: "2 days ago",
    },
  ]

  const container = document.querySelector(".activity-feed")
  if (container) {
    container.innerHTML = activities
      .map(
        (activity) => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

// Progress tracking functionality
function updateLearningProgress() {
  const progressItems = [
    { course: "JavaScript Mastery", progress: 65 },
    { course: "UI/UX Design", progress: 30 },
    { course: "Digital Marketing", progress: 85 },
  ]

  const container = document.querySelector(".progress-overview")
  if (container) {
    container.innerHTML = progressItems
      .map(
        (item) => `
            <div class="progress-item">
                <div class="progress-header">
                    <span>${item.course}</span>
                    <span>${item.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${item.progress}%"></div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

// Declare showNotification and showLoading variables
function showNotification(message, type) {
  console.log(`Notification: ${message} (Type: ${type})`)
}

function showLoading() {
  console.log("Loading started...")
  return "loader" // Placeholder for loader
}

function hideLoading(loader) {
  console.log("Loading finished...")
}
