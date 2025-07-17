// Dashboard functionality

const storage = {
  get: (key) => {
    // Mock implementation for demonstration purposes
    return JSON.parse(localStorage.getItem(key))
  },
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard()
  setupProgressChart()
  setupCalendar()
  loadUserData()
})

function initializeDashboard() {
  // Load user's enrolled courses and progress
  loadEnrolledCourses()
  loadLearningProgress()
  loadAchievements()
  loadRecommendedCourses()
}

function loadUserData() {
  const user = storage.get("currentUser") || {
    name: "John Doe",
    enrolledCourses: 5,
    completedCourses: 3,
    learningTime: 45,
    certificates: 3,
  }

  // Update welcome message
  const welcomeElement = document.querySelector(".dashboard-welcome h1")
  if (welcomeElement) {
    welcomeElement.textContent = `Welcome back, ${user.name.split(" ")[0]}!`
  }

  // Update stats
  updateDashboardStats(user)
}

function updateDashboardStats(user) {
  const stats = [
    { selector: ".stat-card:nth-child(1) .stat-number", value: user.enrolledCourses },
    { selector: ".stat-card:nth-child(2) .stat-number", value: user.completedCourses },
    { selector: ".stat-card:nth-child(3) .stat-number", value: `${user.learningTime}h` },
    { selector: ".stat-card:nth-child(4) .stat-number", value: user.certificates },
  ]

  stats.forEach((stat) => {
    const element = document.querySelector(stat.selector)
    if (element) {
      element.textContent = stat.value
    }
  })
}

function loadEnrolledCourses() {
  const enrolledCourses = storage.get("enrolledCourses") || [
    {
      id: 1,
      title: "Complete JavaScript Mastery",
      section: "Section 4: Advanced Functions",
      progress: 65,
      totalLessons: 18,
      completedLessons: 12,
      thumbnail: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      section: "Section 2: Design Principles",
      progress: 30,
      totalLessons: 16,
      completedLessons: 5,
      thumbnail: "/placeholder.svg?height=100&width=150",
    },
  ]

  renderContinueLearning(enrolledCourses)
}

function renderContinueLearning(courses) {
  const container = document.querySelector(".continue-learning")
  if (!container) return

  container.innerHTML = courses
    .map(
      (course) => `
        <div class="learning-card" data-course-id="${course.id}">
            <div class="course-thumbnail">
                <img src="${course.thumbnail}" alt="${course.title}">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.section}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>
                <div class="progress-info">
                    <span>${course.progress}% Complete</span>
                    <span>${course.completedLessons} of ${course.totalLessons} lessons</span>
                </div>
            </div>
            <button class="continue-btn" onclick="continueCourse(${course.id})">Continue</button>
        </div>
    `,
    )
    .join("")
}

function continueCourse(courseId) {
  // Redirect to course detail page or video player
  window.location.href = `course-detail.html?id=${courseId}&continue=true`
}

function setupProgressChart() {
  const canvas = document.getElementById("progressChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  // Sample data for the week
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [1.5, 2.0, 0.5, 2.5, 1.8, 0.8, 1.2],
  }

  drawChart(ctx, data, canvas.width, canvas.height)
}

function drawChart(ctx, data, width, height) {
  const padding = 40
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Set styles
  ctx.strokeStyle = "#2563eb"
  ctx.fillStyle = "#2563eb"
  ctx.lineWidth = 3

  // Find max value for scaling
  const maxValue = Math.max(...data.values)
  const scale = chartHeight / maxValue

  // Draw axes
  ctx.beginPath()
  ctx.strokeStyle = "#e2e8f0"
  ctx.lineWidth = 1

  // Y-axis
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)

  // X-axis
  ctx.moveTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  // Draw data line
  ctx.beginPath()
  ctx.strokeStyle = "#2563eb"
  ctx.lineWidth = 3

  const stepX = chartWidth / (data.labels.length - 1)

  data.values.forEach((value, index) => {
    const x = padding + index * stepX
    const y = height - padding - value * scale

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // Draw data points
  ctx.fillStyle = "#2563eb"
  data.values.forEach((value, index) => {
    const x = padding + index * stepX
    const y = height - padding - value * scale

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Draw labels
  ctx.fillStyle = "#64748b"
  ctx.font = "12px Inter"
  ctx.textAlign = "center"

  data.labels.forEach((label, index) => {
    const x = padding + index * stepX
    ctx.fillText(label, x, height - padding + 20)
  })
}

function loadLearningProgress() {
  // Update progress summary
  const summaryData = {
    thisWeek: "8.5 hours",
    averageDaily: "1.2 hours",
    streak: "5 days",
  }

  document.querySelectorAll(".summary-item").forEach((item, index) => {
    const valueElement = item.querySelector(".summary-value")
    if (valueElement) {
      switch (index) {
        case 0:
          valueElement.textContent = summaryData.thisWeek
          break
        case 1:
          valueElement.textContent = summaryData.averageDaily
          break
        case 2:
          valueElement.textContent = summaryData.streak
          break
      }
    }
  })
}

function loadAchievements() {
  const achievements = [
    {
      icon: "fas fa-trophy",
      title: "Course Completed",
      description: 'Finished "React Fundamentals"',
      date: "2 days ago",
    },
    {
      icon: "fas fa-fire",
      title: "5-Day Streak",
      description: "Learned for 5 consecutive days",
      date: "Today",
    },
    {
      icon: "fas fa-star",
      title: "Quiz Master",
      description: "Scored 100% on JavaScript quiz",
      date: "1 week ago",
    },
  ]

  const container = document.querySelector(".achievements")
  if (container) {
    container.innerHTML = achievements
      .map(
        (achievement) => `
            <div class="achievement-item">
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    <span class="achievement-date">${achievement.date}</span>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function loadRecommendedCourses() {
  const recommendedCourses = [
    {
      title: "Node.js Complete Guide",
      rating: 4.7,
      price: 390,
      thumbnail: "/placeholder.svg?height=80&width=120",
    },
    {
      title: "Python for Beginners",
      rating: 4.9,
      price: 290,
      thumbnail: "/placeholder.svg?height=80&width=120",
    },
    {
      title: "Advanced CSS & Sass",
      rating: 4.8,
      price: 350,
      thumbnail: "/placeholder.svg?height=80&width=120",
    },
  ]

  const container = document.querySelector(".recommended-courses")
  if (container) {
    container.innerHTML = recommendedCourses
      .map(
        (course) => `
            <div class="mini-course-card">
                <img src="${course.thumbnail}" alt="${course.title}">
                <div class="mini-course-info">
                    <h4>${course.title}</h4>
                    <div class="mini-course-meta">
                        <span class="rating">
                            <i class="fas fa-star"></i>
                            ${course.rating}
                        </span>
                        <span class="price">₹${course.price}</span>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function setupCalendar() {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  renderCalendar(currentYear, currentMonth)

  // Setup navigation
  document.getElementById("prevMonth")?.addEventListener("click", () => {
    const newDate = new Date(currentYear, currentMonth - 1)
    renderCalendar(newDate.getFullYear(), newDate.getMonth())
  })

  document.getElementById("nextMonth")?.addEventListener("click", () => {
    const newDate = new Date(currentYear, currentMonth + 1)
    renderCalendar(newDate.getFullYear(), newDate.getMonth())
  })
}

function renderCalendar(year, month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Update month header
  const monthHeader = document.getElementById("currentMonth")
  if (monthHeader) {
    monthHeader.textContent = `${monthNames[month]} ${year}`
  }

  // Generate calendar grid
  const calendarGrid = document.getElementById("calendarGrid")
  if (!calendarGrid) return

  let calendarHTML = ""

  // Add day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  dayHeaders.forEach((day) => {
    calendarHTML += `<div class="calendar-day-header">${day}</div>`
  })

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<div class="calendar-day empty"></div>'
  }

  // Add days of the month
  const today = new Date()
  const learningDays = [3, 5, 8, 12, 15, 18, 22, 25, 28] // Sample learning days

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
    const hasLearning = learningDays.includes(day)

    let classes = "calendar-day"
    if (isToday) classes += " today"
    if (hasLearning) classes += " has-learning"

    calendarHTML += `<div class="${classes}">${day}</div>`
  }

  calendarGrid.innerHTML = calendarHTML
}

// Time filter functionality
document.querySelector(".time-filter")?.addEventListener("change", function () {
  const period = this.value
  updateProgressChart(period)
})

function updateProgressChart(period) {
  // Update chart based on selected time period
  // This would fetch different data based on the period
  console.log("Updating chart for period:", period)
}
