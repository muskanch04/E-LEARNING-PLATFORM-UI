// Courses page functionality
// Sample course data
const coursesData = [
  {
    id: 1,
    title: "Complete JavaScript Mastery",
    category: "programming",
    level: "intermediate",
    price: 490,
    originalPrice: 990,
    rating: 4.8,
    students: 12450,
    image: "1.jpeg",
    instructor: "Vineet Panday",
    duration: "40 hours",
    description: "Learn JavaScript from basics to advanced concepts with hands-on projects",
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    category: "design",
    level: "beginner",
    price: 390,
    originalPrice: 790,
    rating: 4.9,
    students: 8230,
    image: "2.jpeg",
    instructor: "Satyam Choudhary",
    duration: "25 hours",
    description: "Master the art of user interface and experience design",
  },
  {
    id: 3,
    title: "Digital Marketing Mastery",
    category: "marketing",
    level: "intermediate",
    price: 590,
    originalPrice: 1190,
    rating: 4.7,
    students: 15670,
    image: "3.jpeg",
    instructor: "Shiv Shankar Das",
    duration: "35 hours",
    description: "Learn SEO, social media marketing, and online advertising strategies",
  },
  {
    id: 4,
    title: "Python for Beginners",
    category: "programming",
    level: "beginner",
    price: 290,
    originalPrice: 590,
    rating: 4.6,
    students: 9840,
    image: "4.jpeg",
    instructor: "Pihu Rawat",
    duration: "30 hours",
    description: "Start your programming journey with Python",
  },
  {
    id: 5,
    title: "Advanced CSS & Sass",
    category: "design",
    level: "advanced",
    price: 350,
    originalPrice: 700,
    rating: 4.8,
    students: 6750,
    image: "5.jpg",
    instructor: "Preeti Choudhary",
    duration: "20 hours",
    description: "Master advanced CSS techniques and Sass preprocessing",
  },
  {
    id: 6,
    title: "Business Strategy Fundamentals",
    category: "business",
    level: "beginner",
    price: 450,
    originalPrice: 900,
    rating: 4.5,
    students: 5420,
    image: "6.jpeg",
    instructor: "Manoj Kumar",
    duration: "28 hours",
    description: "Learn essential business strategy concepts and frameworks",
  },
  {
    id: 7,
    title: "Photography Masterclass",
    category: "photography",
    level: "intermediate",
    price: 550,
    originalPrice: 1100,
    rating: 4.9,
    students: 7890,
    image: "7.jpeg",
    instructor: "Aisha Kapoor",
    duration: "32 hours",
    description: "Master photography techniques from composition to post-processing",
  },
  {
    id: 8,
    title: "React Complete Guide",
    category: "programming",
    level: "advanced",
    price: 650,
    originalPrice: 1300,
    rating: 4.8,
    students: 11200,
    image: "8.jpeg",
    instructor: "Raj Khanna",
    duration: "45 hours",
    description: "Build modern web applications with React and its ecosystem",
  },
]

let filteredCourses = [...coursesData]
let currentPage = 1
const coursesPerPage = 6
let currentView = "grid"

function debounce(func, wait) {
  let timeout
  return function (...args) {
    
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCourses()
  setupEventListeners()
  renderCourses()
  setupPagination()
})

function initializeCourses() {
  // Set initial course count
  updateCourseCount()
}

function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById("courseSearch")
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300))
  }

  // Filter functionality
  const categoryFilter = document.getElementById("categoryFilter")
  const levelFilter = document.getElementById("levelFilter")
  const priceFilter = document.getElementById("priceFilter")
  const sortFilter = document.getElementById("sortFilter")

  if (categoryFilter) categoryFilter.addEventListener("change", handleFilters)
  if (levelFilter) levelFilter.addEventListener("change", handleFilters)
  if (priceFilter) priceFilter.addEventListener("change", handleFilters)
  if (sortFilter) sortFilter.addEventListener("change", handleSort)

  // View toggle
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      currentView = this.dataset.view
      renderCourses()
    })
  })

  // Pagination
  const prevBtn = document.getElementById("prevPage")
  const nextBtn = document.getElementById("nextPage")

  if (prevBtn) prevBtn.addEventListener("click", () => changePage(currentPage - 1))
  if (nextBtn) nextBtn.addEventListener("click", () => changePage(currentPage + 1))
}

function handleSearch() {
  const searchTerm = document.getElementById("courseSearch").value.toLowerCase()

  filteredCourses = coursesData.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructor.toLowerCase().includes(searchTerm),
  )

  applyFilters()
  currentPage = 1
  renderCourses()
  setupPagination()
  updateCourseCount()
}

function handleFilters() {
  applyFilters()
  currentPage = 1
  renderCourses()
  setupPagination()
  updateCourseCount()
}

function applyFilters() {
  const category = document.getElementById("categoryFilter").value
  const level = document.getElementById("levelFilter").value
  const price = document.getElementById("priceFilter").value

  let filtered = [...filteredCourses]

  if (category) {
    filtered = filtered.filter((course) => course.category === category)
  }

  if (level) {
    filtered = filtered.filter((course) => course.level === level)
  }

  if (price === "free") {
    filtered = filtered.filter((course) => course.price === 0)
  } else if (price === "paid") {
    filtered = filtered.filter((course) => course.price > 0)
  }

  filteredCourses = filtered
}

function handleSort() {
  const sortBy = document.getElementById("sortFilter").value

  switch (sortBy) {
    case "popular":
      filteredCourses.sort((a, b) => b.students - a.students)
      break
    case "newest":
      filteredCourses.sort((a, b) => b.id - a.id)
      break
    case "rating":
      filteredCourses.sort((a, b) => b.rating - a.rating)
      break
    case "price-low":
      filteredCourses.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredCourses.sort((a, b) => b.price - a.price)
      break
  }

  renderCourses()
}

function renderCourses() {
  const container = document.getElementById("coursesContainer")
  if (!container) return

  const startIndex = (currentPage - 1) * coursesPerPage
  const endIndex = startIndex + coursesPerPage
  const coursesToShow = filteredCourses.slice(startIndex, endIndex)

  container.className = currentView === "grid" ? "courses-grid" : "courses-list"

  container.innerHTML = coursesToShow.map((course) => createCourseCard(course)).join("")

  // Add click events to course cards
  container.querySelectorAll(".course-card").forEach((card) => {
    card.addEventListener("click", function () {
      const courseId = this.dataset.courseId
      window.location.href = `course-detail.html?id=${courseId}`
    })
  })
}

function createCourseCard(course) {
  return `
        <div class="course-card ${currentView === "list" ? "list-view" : ""}" data-course-id="${course.id}">
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
                <div class="course-overlay">
                    <button class="btn btn-primary">View Course</button>
                </div>
            </div>
            <div class="course-content">
                <div class="course-meta">
                    <span class="course-category">${course.category}</span>
                    <span class="course-rating">
                        <i class="fas fa-star"></i>
                        ${course.rating}
                    </span>
                </div>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-instructor">
                    <i class="fas fa-user"></i>
                    ${course.instructor}
                </div>
                <div class="course-duration">
                    <i class="fas fa-clock"></i>
                    ${course.duration}
                </div>
                <div class="course-footer">
                    <div class="course-price">
                        <span class="current-price">₹${course.price}</span>
                        ${course.originalPrice ? `<span class="original-price">₹${course.originalPrice}</span>` : ""}
                    </div>
                    <div class="course-students">
                        <i class="fas fa-users"></i>
                        ${course.students.toLocaleString()} students
                    </div>
                </div>
            </div>
        </div>
    `
}

function setupPagination() {
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const pageNumbers = document.getElementById("pageNumbers")
  const prevBtn = document.getElementById("prevPage")
  const nextBtn = document.getElementById("nextPage")

  if (!pageNumbers) return

  // Update button states
  if (prevBtn) prevBtn.disabled = currentPage === 1
  if (nextBtn) nextBtn.disabled = currentPage === totalPages

  // Generate page numbers
  let paginationHTML = ""
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
            <button class="page-number ${i === currentPage ? "active" : ""}" 
                    onclick="changePage(${i})">${i}</button>
        `
  }

  pageNumbers.innerHTML = paginationHTML
}

function changePage(page) {
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  if (page < 1 || page > totalPages) return

  currentPage = page
  renderCourses()
  setupPagination()

  // Scroll to top of courses section
  document.querySelector(".courses-section").scrollIntoView({
    behavior: "smooth",
  })
}

function updateCourseCount() {
  const countElement = document.getElementById("courseCount")
  if (countElement) {
    const count = filteredCourses.length
    countElement.textContent = `${count} course${count !== 1 ? "s" : ""} found`
  }
}

// Reset all filters
function resetFilters() {
  document.getElementById("courseSearch").value = ""
  document.getElementById("categoryFilter").value = ""
  document.getElementById("levelFilter").value = ""
  document.getElementById("priceFilter").value = ""
  document.getElementById("sortFilter").value = "popular"

  filteredCourses = [...coursesData]
  currentPage = 1
  renderCourses()
  setupPagination()
  updateCourseCount()
}
