// Theme Toggle
const themeToggle = document.getElementById("theme-toggle")
const body = document.body

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark") {
  body.classList.add("dark-mode")
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode")
  const isDarkMode = body.classList.contains("dark-mode")
  localStorage.setItem("theme", isDarkMode ? "dark" : "light")
})

// Sample Data for Preloaded Courses
const preloadedCourses = [
  {
    id: "ds-001",
    name: "Data Structures",
    department: "Computer Engineering",
    units: [
      {
        id: "ds-unit-001",
        name: "Arrays and Linked Lists",
        topics: [
          {
            id: "ds-topic-001",
            name: "Introduction to Arrays",
            description: "Learn about array data structure, its properties and operations.",
            timeEstimate: 45,
            materials: [
              { type: "pdf", name: "Arrays.pdf", url: "#" },
              { type: "video", name: "Array Operations.mp4", url: "#" },
            ],
            assignment: {
              title: "Array Implementation",
              description: "Implement basic array operations in your preferred language.",
              deadline: "2023-12-15T23:59",
            },
            isLocked: false,
          },
          {
            id: "ds-topic-002",
            name: "Linked Lists",
            description: "Understanding singly and doubly linked lists.",
            timeEstimate: 60,
            materials: [
              { type: "pdf", name: "LinkedLists.pdf", url: "#" },
              { type: "link", name: "Visualization Tool", url: "https://visualgo.net/en/list" },
            ],
            assignment: {
              title: "Linked List Problems",
              description: "Solve 5 linked list problems from the assignment sheet.",
              deadline: "2023-12-20T23:59",
            },
            isLocked: true,
          },
        ],
      },
      {
        id: "ds-unit-002",
        name: "Trees and Graphs",
        topics: [
          {
            id: "ds-topic-003",
            name: "Binary Trees",
            description: "Introduction to tree data structures with focus on binary trees.",
            timeEstimate: 90,
            materials: [{ type: "pdf", name: "BinaryTrees.pdf", url: "#" }],
            assignment: {
              title: "Tree Traversal",
              description: "Implement pre-order, in-order, and post-order traversals.",
              deadline: "2023-12-25T23:59",
            },
            isLocked: true,
          },
        ],
      },
    ],
  },
  {
    id: "os-001",
    name: "Operating Systems",
    department: "Computer Science and Engineering",
    units: [
      {
        id: "os-unit-001",
        name: "Process Management",
        topics: [
          {
            id: "os-topic-001",
            name: "Processes and Threads",
            description: "Understanding the concept of processes, threads, and concurrency.",
            timeEstimate: 60,
            materials: [
              { type: "pdf", name: "Processes.pdf", url: "#" },
              { type: "video", name: "Concurrency.mp4", url: "#" },
            ],
            assignment: {
              title: "Process Simulation",
              description: "Create a simple process scheduler simulation.",
              deadline: "2023-12-18T23:59",
            },
            isLocked: false,
          },
        ],
      },
    ],
  },
  {
    id: "coa-001",
    name: "Computer Organisation and Architecture",
    department: "Electronics and Telecommunication",
    units: [
      {
        id: "coa-unit-001",
        name: "CPU Architecture",
        topics: [
          {
            id: "coa-topic-001",
            name: "Instruction Set Architecture",
            description: "Understanding the instruction set architecture and its components.",
            timeEstimate: 75,
            materials: [{ type: "pdf", name: "ISA.pdf", url: "#" }],
            assignment: {
              title: "ISA Analysis",
              description: "Compare RISC and CISC architectures with examples.",
              deadline: "2023-12-22T23:59",
            },
            isLocked: false,
          },
        ],
      },
    ],
  },
]

// Initialize courses from localStorage or use preloaded courses
let courses = JSON.parse(localStorage.getItem("courses")) || preloadedCourses

// Save courses to localStorage
function saveCourses() {
  localStorage.setItem("courses", JSON.stringify(courses))
}

// DOM Elements
const coursesContainer = document.getElementById("courses-container")
const departmentSelect = document.getElementById("department-select")
const addCourseBtn = document.getElementById("add-course-btn")
const addCourseModal = document.getElementById("add-course-modal")
const addCourseForm = document.getElementById("add-course-form")
const addUnitModal = document.getElementById("add-unit-modal")
const addUnitForm = document.getElementById("add-unit-form")
const addTopicModal = document.getElementById("add-topic-modal")
const addTopicForm = document.getElementById("add-topic-form")
const courseDetailModal = document.getElementById("course-detail-modal")
const closeModalButtons = document.querySelectorAll(".close-modal, .cancel-modal")

// Display Courses
function displayCourses(filteredCourses = null) {
  const coursesToDisplay = filteredCourses || courses
  coursesContainer.innerHTML = ""

  coursesToDisplay.forEach((course) => {
    const unitCount = course.units.length
    let topicCount = 0
    course.units.forEach((unit) => {
      topicCount += unit.topics.length
    })

    const courseCard = document.createElement("div")
    courseCard.className = "course-card"
    courseCard.innerHTML = `
      <div class="course-header">
        <h3 class="course-title">${course.name}</h3>
        <p class="course-department">${course.department}</p>
      </div>
      <div class="course-body">
        <div class="course-stats">
          <div class="stat">
            <span class="stat-value">${unitCount}</span>
            <span class="stat-label">Units</span>
          </div>
          <div class="stat">
            <span class="stat-value">${topicCount}</span>
            <span class="stat-label">Topics</span>
          </div>
        </div>
        <p class="course-description">A comprehensive course on ${course.name.toLowerCase()} for ${course.department} students.</p>
      </div>
      <div class="course-footer">
        <button class="view-course-btn" data-course-id="${course.id}">View Course</button>
        <button class="delete-course-btn" data-course-id="${course.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      </div>
    `

    coursesContainer.appendChild(courseCard)
  })

  // Add event listeners to view and delete buttons
  document.querySelectorAll(".view-course-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const courseId = button.getAttribute("data-course-id")
      openCourseDetail(courseId)
    })
  })

  document.querySelectorAll(".delete-course-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const courseId = button.getAttribute("data-course-id")
      if (confirm("Are you sure you want to delete this course?")) {
        deleteCourse(courseId)
      }
    })
  })
}

// Filter Courses by Department
departmentSelect.addEventListener("change", () => {
  const selectedDepartment = departmentSelect.value
  if (selectedDepartment === "all") {
    displayCourses()
  } else {
    const filteredCourses = courses.filter((course) => course.department === selectedDepartment)
    displayCourses(filteredCourses)
  }
})

// Delete Course
function deleteCourse(courseId) {
  courses = courses.filter((course) => course.id !== courseId)
  saveCourses()
  displayCourses()
}

// Open Course Detail
function openCourseDetail(courseId) {
  const course = courses.find((course) => course.id === courseId)
  if (!course) return

  const courseDetailTitle = document.getElementById("course-detail-title")
  const courseDepartment = document.getElementById("course-detail-department")
  const unitsContainer = document.getElementById("units-container")
  const addUnitBtn = document.getElementById("add-unit-btn")

  courseDetailTitle.textContent = course.name
  courseDepartment.textContent = `Department: ${course.department}`

  // Set the course ID for the add unit button
  addUnitBtn.setAttribute("data-course-id", course.id)

  // Display units
  displayUnits(course, unitsContainer)

  // Show the modal
  courseDetailModal.style.display = "block"
}

// Display Units
function displayUnits(course, container) {
  container.innerHTML = ""

  course.units.forEach((unit) => {
    const unitCard = document.createElement("div")
    unitCard.className = "unit-card"
    unitCard.innerHTML = `
      <div class="unit-header" data-unit-id="${unit.id}">
        <div class="unit-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          ${unit.name}
        </div>
        <div class="unit-actions">
          <button class="add-topic-to-unit-btn" data-unit-id="${unit.id}" data-course-id="${course.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          </button>
        </div>
      </div>
      <div class="unit-content">
        <div class="topics-container" id="topics-${unit.id}"></div>
      </div>
    `

    container.appendChild(unitCard)

    // Display topics for this unit
    const topicsContainer = unitCard.querySelector(`#topics-${unit.id}`)
    displayTopics(unit, topicsContainer, course.id)
  })

  // Add event listeners to unit headers for expand/collapse
  document.querySelectorAll(".unit-header").forEach((header) => {
    header.addEventListener("click", () => {
      const unitContent = header.nextElementSibling
      const unitTitle = header.querySelector(".unit-title")

      unitContent.classList.toggle("expanded")
      unitTitle.classList.toggle("expanded")
    })
  })

  // Add event listeners to add topic buttons
  document.querySelectorAll(".add-topic-to-unit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation() // Prevent unit expansion/collapse
      const unitId = button.getAttribute("data-unit-id")
      const courseId = button.getAttribute("data-course-id")
      openAddTopicModal(unitId, courseId)
    })
  })
}

// Display Topics
function displayTopics(unit, container, courseId) {
  container.innerHTML = ""

  unit.topics.forEach((topic, index) => {
    const isLocked = topic.isLocked
    const topicCard = document.createElement("div")
    topicCard.className = `topic-card ${isLocked ? "locked-topic" : ""}`

    topicCard.innerHTML = `
      ${
        isLocked
          ? `
        <div class="locked-overlay">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lock-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
      `
          : ""
      }
      <div class="topic-header" data-topic-id="${topic.id}">
        <div class="topic-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          ${topic.name}
        </div>
        <div class="topic-actions">
          ${
            !isLocked
              ? `
            <span class="topic-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${topic.timeEstimate} min
            </span>
          `
              : ""
          }
        </div>
      </div>
      <div class="topic-content">
        <p class="topic-description">${topic.description}</p>
        
        <div class="topic-materials">
          <h4>Study Materials</h4>
          <div class="materials-list">
            ${topic.materials
              .map(
                (material) => `
              <div class="material-item">
                ${
                  material.type === "pdf"
                    ? `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                `
                    : material.type === "video"
                      ? `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg>
                `
                      : `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                `
                }
                <a href="${material.url}" target="_blank">${material.name}</a>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        
        ${
          topic.assignment
            ? `
          <div class="topic-assignment">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
              Assignment: ${topic.assignment.title}
            </h4>
            <p class="assignment-details">${topic.assignment.description}</p>
            <div class="assignment-deadline">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
              Due: ${new Date(topic.assignment.deadline).toLocaleString()}
            </div>
            <div class="assignment-actions">
              <button class="secondary-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                Upload Submission
              </button>
            </div>
          </div>
        `
            : ""
        }
        
        ${
          !isLocked
            ? `
          <button class="primary-button mark-complete-btn" data-topic-id="${topic.id}" data-unit-id="${unit.id}" data-course-id="${courseId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Mark as Complete
          </button>
        `
            : ""
        }
      </div>
    `

    container.appendChild(topicCard)
  })

  // Add event listeners to topic headers for expand/collapse
  document.querySelectorAll(".topic-header").forEach((header) => {
    header.addEventListener("click", () => {
      const topicContent = header.nextElementSibling
      const topicTitle = header.querySelector(".topic-title")

      if (!header.closest(".locked-topic")) {
        topicContent.classList.toggle("expanded")
        topicTitle.classList.toggle("expanded")
      }
    })
  })

  // Add event listeners to mark complete buttons
  document.querySelectorAll(".mark-complete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const topicId = button.getAttribute("data-topic-id")
      const unitId = button.getAttribute("data-unit-id")
      const courseId = button.getAttribute("data-course-id")

      markTopicComplete(courseId, unitId, topicId)
    })
  })

  // Add "Add Topic" button at the end
  const addTopicBtn = document.createElement("button")
  addTopicBtn.className = "add-topic-btn"
  addTopicBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
    Add New Topic
  `
  addTopicBtn.setAttribute("data-unit-id", unit.id)
  addTopicBtn.setAttribute("data-course-id", courseId)

  addTopicBtn.addEventListener("click", () => {
    openAddTopicModal(unit.id, courseId)
  })

  container.appendChild(addTopicBtn)
}

// Mark Topic as Complete
function markTopicComplete(courseId, unitId, topicId) {
  const course = courses.find((course) => course.id === courseId)
  if (!course) return

  const unit = course.units.find((unit) => unit.id === unitId)
  if (!unit) return

  const topicIndex = unit.topics.findIndex((topic) => topic.id === topicId)
  if (topicIndex === -1) return

  // If there's a next topic in this unit, unlock it
  if (topicIndex < unit.topics.length - 1) {
    unit.topics[topicIndex + 1].isLocked = false
  }
  // If this is the last topic in the unit, check if there's a next unit
  else {
    const unitIndex = course.units.findIndex((u) => u.id === unitId)
    if (unitIndex !== -1 && unitIndex < course.units.length - 1) {
      // If there's a next unit, unlock its first topic
      if (course.units[unitIndex + 1].topics.length > 0) {
        course.units[unitIndex + 1].topics[0].isLocked = false
      }
    }
  }

  saveCourses()

  // Refresh the course detail view
  openCourseDetail(courseId)
}

// Modal Functions
function openAddCourseModal() {
  addCourseModal.style.display = "block"
}

function openAddUnitModal(courseId) {
  document.getElementById("unit-course-id").value = courseId
  addUnitModal.style.display = "block"
}

function openAddTopicModal(unitId, courseId) {
  document.getElementById("topic-unit-id").value = unitId
  document.getElementById("topic-course-id").value = courseId
  addTopicModal.style.display = "block"
}

function closeAllModals() {
  addCourseModal.style.display = "none"
  addUnitModal.style.display = "none"
  addTopicModal.style.display = "none"
  courseDetailModal.style.display = "none"

  // Reset forms
  addCourseForm.reset()
  addUnitForm.reset()
  addTopicForm.reset()

  // Reset file input displays
  document.getElementById("pdf-filename").textContent = ""
  document.getElementById("video-filename").textContent = ""
}

// Close modals when clicking close button or outside the modal
closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeAllModals)
})

window.addEventListener("click", (e) => {
  if (
    e.target === addCourseModal ||
    e.target === addUnitModal ||
    e.target === addTopicModal ||
    e.target === courseDetailModal
  ) {
    closeAllModals()
  }
})

// Add Course
addCourseBtn.addEventListener("click", openAddCourseModal)

addCourseForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const courseName = document.getElementById("course-name").value
  const courseDepartment = document.getElementById("course-department").value

  const newCourse = {
    id: "course-" + Date.now(),
    name: courseName,
    department: courseDepartment,
    units: [],
  }

  courses.push(newCourse)
  saveCourses()
  displayCourses()
  closeAllModals()
})

// Add Unit
document.getElementById("add-unit-btn").addEventListener("click", function () {
  const courseId = this.getAttribute("data-course-id")
  openAddUnitModal(courseId)
})

addUnitForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const courseId = document.getElementById("unit-course-id").value
  const unitName = document.getElementById("unit-name").value

  const course = courses.find((course) => course.id === courseId)
  if (!course) return

  const newUnit = {
    id: "unit-" + Date.now(),
    name: unitName,
    topics: [],
  }

  course.units.push(newUnit)
  saveCourses()
  openCourseDetail(courseId)
  closeAllModals()
})

// Add Topic
addTopicForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const unitId = document.getElementById("topic-unit-id").value
  const courseId = document.getElementById("topic-course-id").value
  const topicName = document.getElementById("topic-name").value
  const topicDescription = document.getElementById("topic-description").value
  const topicTimeEstimate = document.getElementById("topic-time-estimate").value
  const externalLink = document.getElementById("external-link").value

  const assignmentTitle = document.getElementById("assignment-title").value
  const assignmentDescription = document.getElementById("assignment-description").value
  const assignmentDeadline = document.getElementById("assignment-deadline").value

  const pdfFile = document.getElementById("pdf-upload").files[0]
  const videoFile = document.getElementById("video-upload").files[0]

  const course = courses.find((course) => course.id === courseId)
  if (!course) return

  const unit = course.units.find((unit) => unit.id === unitId)
  if (!unit) return

  // Determine if this topic should be locked
  // First topic in first unit is always unlocked
  // All other topics are locked by default
  let isLocked = true
  if (course.units[0].id === unitId && unit.topics.length === 0) {
    isLocked = false
  }

  const materials = []

  if (pdfFile) {
    materials.push({
      type: "pdf",
      name: pdfFile.name,
      url: "#", // In a real app, this would be the uploaded file URL
    })
  }

  if (videoFile) {
    materials.push({
      type: "video",
      name: videoFile.name,
      url: "#", // In a real app, this would be the uploaded file URL
    })
  }

  if (externalLink) {
    materials.push({
      type: "link",
      name: "External Resource",
      url: externalLink,
    })
  }

  const newTopic = {
    id: "topic-" + Date.now(),
    name: topicName,
    description: topicDescription,
    timeEstimate: topicTimeEstimate ? Number.parseInt(topicTimeEstimate) : 30,
    materials: materials,
    isLocked: isLocked,
  }

  if (assignmentTitle) {
    newTopic.assignment = {
      title: assignmentTitle,
      description: assignmentDescription,
      deadline: assignmentDeadline,
    }
  }

  unit.topics.push(newTopic)
  saveCourses()
  openCourseDetail(courseId)
  closeAllModals()
})

// File input display
document.getElementById("pdf-upload").addEventListener("change", function () {
  const filename = this.files[0] ? this.files[0].name : ""
  document.getElementById("pdf-filename").textContent = filename
})

document.getElementById("video-upload").addEventListener("change", function () {
  const filename = this.files[0] ? this.files[0].name : ""
  document.getElementById("video-filename").textContent = filename
})

// Initialize the page
displayCourses()

document.addEventListener("DOMContentLoaded", function () {
  // Sidebar functionality
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const body = document.body;

  // Create overlay element
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);

  // Toggle sidebar
  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    body.classList.toggle("sidebar-active");
    overlay.classList.toggle("active");
  });

  // Close sidebar when clicking overlay
  overlay.addEventListener("click", function () {
    sidebar.classList.remove("active");
    body.classList.remove("sidebar-active");
    overlay.classList.remove("active");
  });
});