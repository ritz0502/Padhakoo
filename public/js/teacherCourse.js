// Global state
let currentCourseId = null;
let currentUnitId = null;
let currentTopicId = null;
let deleteItemType = null;
let deleteItemId = null;

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const addCourseBtn = document.getElementById('addCourseBtn');
const courseContainer = document.getElementById('courseContainer');
const addCourseModal = document.getElementById('addCourseModal');
const addCourseForm = document.getElementById('addCourseForm');
const manageCourseModal = document.getElementById('manageCourseModal');
const addUnitModal = document.getElementById('addUnitModal');
const addUnitForm = document.getElementById('addUnitForm');
const addUnitBtn = document.getElementById('addUnitBtn');
const unitsList = document.getElementById('unitsList');
const unitContent = document.getElementById('unitContent');
const addTopicModal = document.getElementById('addTopicModal');
const addTopicForm = document.getElementById('addTopicForm');
const materialType = document.getElementById('materialType');
const addMaterialForm = document.getElementById('addMaterialForm');
const addMaterialModal = document.getElementById('addMaterialModal');
const addAssignmentModal = document.getElementById('addAssignmentModal');
const addAssignmentForm = document.getElementById('addAssignmentForm');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const courseTitleHeader = document.getElementById('courseTitleHeader');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadCourses();
  setupEventListeners();
  checkThemePreference();
});

// Setup event listeners
function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Modal close buttons
  document.querySelectorAll('.close-modal, .cancel-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  
  // Add course button
  addCourseBtn.addEventListener('click', () => {
    openModal(addCourseModal);
  });
  
  // Add course form submission
  addCourseForm.addEventListener('submit', handleAddCourse);
  
  // Add unit button
  addUnitBtn.addEventListener('click', () => {
    openModal(addUnitModal);
  });
  
  // Add unit form submission
  addUnitForm.addEventListener('submit', handleAddUnit);
  
  // Add topic form submission
  addTopicForm.addEventListener('submit', handleAddTopic);
  
  // Material type selection change
  materialType.addEventListener('change', handleMaterialTypeChange);
  
  // Add material form submission
  addMaterialForm.addEventListener('submit', handleAddMaterial);
  
  // Add assignment form submission
  addAssignmentForm.addEventListener('submit', handleAddAssignment);
  
  // Confirm delete button
  confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
}

// Theme functions
function checkThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

function toggleTheme() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  
  if (isDarkMode) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', 'light');
  }
}

// Modal functions
function openModal(modal) {
  closeAllModals();
  modal.classList.add('show');
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('show');
  });
}

// API functions
async function loadCourses() {
  try {
    const response = await fetch('/api/courses');
    if (!response.ok) throw new Error('Failed to fetch courses');
    
    const courses = await response.json();
    renderCourses(courses);
  } catch (error) {
    console.error('Error loading courses:', error);
    courseContainer.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>Failed to load courses. Please try again later.</p>
      </div>
    `;
  }
}

async function createCourse(courseData) {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(courseData)
    });
    
    if (!response.ok) throw new Error('Failed to create course');
    
    const newCourse = await response.json();
    return newCourse;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}

async function loadCourseDetails(courseId) {
  try {
    const response = await fetch(`/api/courses/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch course details');
    
    return await response.json();
  } catch (error) {
    console.error('Error loading course details:', error);
    throw error;
  }
}

async function createUnit(courseId, unitData) {
  try {
    const response = await fetch(`/api/courses/${courseId}/units`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(unitData)
    });
    
    if (!response.ok) throw new Error('Failed to create unit');
    
    return await response.json();
  } catch (error) {
    console.error('Error creating unit:', error);
    throw error;
  }
}

async function createTopic(courseId, unitId, topicData) {
  try {
    const response = await fetch(`/api/courses/${courseId}/units/${unitId}/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(topicData)
    });
    
    if (!response.ok) throw new Error('Failed to create topic');
    
    return await response.json();
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
}

async function addMaterial(courseId, unitId, topicId, materialData) {
  try {
    // Create FormData for file upload if needed
    let requestBody;
    let headers = {};
    
    if (materialData.type === 'pdf' || materialData.type === 'video') {
      requestBody = new FormData();
      requestBody.append('title', materialData.title);
      requestBody.append('type', materialData.type);
      requestBody.append('file', materialData.file);
    } else {
      requestBody = JSON.stringify(materialData);
      headers = { 'Content-Type': 'application/json' };
    }
    
    const response = await fetch(`/api/courses/${courseId}/units/${unitId}/topics/${topicId}/materials`, {
      method: 'POST',
      headers,
      body: requestBody
    });
    
    if (!response.ok) throw new Error('Failed to add material');
    
    return await response.json();
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
}

async function createAssignment(courseId, unitId, topicId, assignmentData) {
  try {
    // Create FormData for file upload if needed
    let requestBody;
    let headers = {};
    
    if (assignmentData.attachment) {
      requestBody = new FormData();
      requestBody.append('title', assignmentData.title);
      requestBody.append('description', assignmentData.description);
      requestBody.append('deadline', assignmentData.deadline);
      requestBody.append('attachment', assignmentData.attachment);
    } else {
      requestBody = JSON.stringify(assignmentData);
      headers = { 'Content-Type': 'application/json' };
    }
    
    const response = await fetch(`/api/courses/${courseId}/units/${unitId}/topics/${topicId}/assignment`, {
      method: 'POST',
      headers,
      body: requestBody
    });
    
    if (!response.ok) throw new Error('Failed to create assignment');
    
    return await response.json();
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
}

async function deleteItem(type, id, parentId, grandParentId) {
  try {
    let endpoint;
    
    switch (type) {
      case 'course':
        endpoint = `/api/courses/${id}`;
        break;
      case 'unit':
        endpoint = `/api/courses/${parentId}/units/${id}`;
        break;
      case 'topic':
        endpoint = `/api/courses/${grandParentId}/units/${parentId}/topics/${id}`;
        break;
      case 'material':
        endpoint = `/api/courses/${grandParentId}/units/${parentId}/topics/${currentTopicId}/materials/${id}`;
        break;
      case 'assignment':
        endpoint = `/api/courses/${grandParentId}/units/${parentId}/topics/${currentTopicId}/assignment`;
        break;
      default:
        throw new Error('Invalid item type');
    }
    
    const response = await fetch(endpoint, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error(`Failed to delete ${type}`);
    
    return true;
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    throw error;
  }
}

// Render functions
function renderCourses(courses) {
  if (courses.length === 0) {
    courseContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book"></i>
        <p>No courses yet. Click "Add Course" to create your first course.</p>
      </div>
    `;
    return;
  }
  
  courseContainer.innerHTML = courses.map(course => {
    return `
      <div class="course-card">
        <div class="course-header">
          <span class="course-department">${course.department}</span>
          <h3 class="course-title">${course.name}</h3>
          <p>${course.description || 'No description provided'}</p>
        </div>
        <div class="course-stats">
          <div class="stat">
            <i class="fas fa-layer-group"></i>
            <span>${course.unitCount || 0} Units</span>
          </div>
          <div class="stat">
            <i class="fas fa-file-alt"></i>
            <span>${course.topicCount || 0} Topics</span>
          </div>
        </div>
        <div class="course-actions">
          <button class="btn secondary" onclick="openCourseManagement('${course._id}')">
            <i class="fas fa-edit"></i> Manage
          </button>
          <button class="btn danger" onclick="showDeleteConfirmation('course', '${course._id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function openCourseManagement(courseId) {
  try {
    currentCourseId = courseId;
    const course = await loadCourseDetails(courseId);
    
    courseTitleHeader.textContent = `Course: ${course.name}`;
    
    // Render the units list
    renderUnitsList(course.units || []);
    
    // Show empty state for unit content
    unitContent.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book-open"></i>
        <p>Select a unit to view or create new content</p>
      </div>
    `;
    
    openModal(manageCourseModal);
  } catch (error) {
    console.error('Error opening course management:', error);
    alert('Failed to load course details. Please try again.');
  }
}

function renderUnitsList(units) {
  if (units.length === 0) {
    unitsList.innerHTML = `
      <div class="empty-state small">
        <p>No units yet. Click "Add Unit" to create your first unit.</p>
      </div>
    `;
    return;
  }
  
  unitsList.innerHTML = units.map(unit => {
    return `
      <div class="unit-item ${currentUnitId === unit._id ? 'active' : ''}" 
           onclick="selectUnit('${unit._id}')">
        <div class="unit-name">${unit.title}</div>
      </div>
    `;
  }).join('');
}

async function selectUnit(unitId) {
  try {
    currentUnitId = unitId;
    const course = await loadCourseDetails(currentCourseId);
    const unit = course.units.find(u => u._id === unitId);
    
    if (!unit) {
      throw new Error('Unit not found');
    }
    
    // Update units list to show active state
    renderUnitsList(course.units);
    
    // Render the unit content
    renderUnitContent(unit);
  } catch (error) {
    console.error('Error selecting unit:', error);
    alert('Failed to load unit details. Please try again.');
  }
}

function renderUnitContent(unit) {
  const topics = unit.topics || [];
  
  unitContent.innerHTML = `
    <div class="unit-header">
      <h3>${unit.title}</h3>
      <p>${unit.description || 'No description provided'}</p>
      <div class="unit-actions">
        <button class="btn danger" onclick="showDeleteConfirmation('unit', '${unit._id}')">
          <i class="fas fa-trash"></i> Delete Unit
        </button>
      </div>
    </div>
    
    <div class="topics-container">
      ${topics.map((topic, index) => renderTopicCard(topic, index)).join('')}
    </div>
    
    <div class="add-topic-section">
      <button class="btn primary" onclick="showAddTopicModal()">
        <i class="fas fa-plus"></i> Add New Topic
      </button>
    </div>
  `;
}

function renderTopicCard(topic, index) {
  const materials = topic.materials || [];
  const assignment = topic.assignment;
  
  return `
    <div class="topic-card">
      <div class="topic-header">
        <div class="topic-title">
          <span>Topic ${index + 1}: ${topic.title}</span>
          <div class="time-estimate">
            <i class="fas fa-clock"></i>
            <span>${topic.estimatedTime || 30} mins</span>
          </div>
        </div>
        <div class="topic-actions">
          <button class="action-btn" onclick="showDeleteConfirmation('topic', '${topic._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="topic-content">
        <div class="content-section">
          <h4>
            Study Materials
            <button class="btn secondary" onclick="showAddMaterialModal('${topic._id}')">
              <i class="fas fa-plus"></i> Add Material
            </button>
          </h4>
          ${materials.length > 0 ? `
            <div class="materials-list">
              ${materials.map(material => renderMaterialItem(material)).join('')}
            </div>
          ` : '<p>No study materials yet</p>'}
        </div>
        
        <div class="content-section">
          <h4>
            Assignment
            ${!assignment ? `
              <button class="btn secondary" onclick="showAddAssignmentModal('${topic._id}')">
                <i class="fas fa-plus"></i> Create Assignment
              </button>
            ` : ''}
          </h4>
          ${assignment ? renderAssignmentBlock(assignment, topic._id) : '<p>No assignment yet</p>'}
        </div>
      </div>
    </div>
  `;
}

function renderMaterialItem(material) {
  let icon;
  switch (material.type) {
    case 'pdf':
      icon = 'fa-file-pdf';
      break;
    case 'video':
      icon = 'fa-video';
      break;
    case 'link':
      icon = 'fa-link';
      break;
    default:
      icon = 'fa-file';
  }
  
  return `
    <div class="material-item">
      <div class="material-icon">
        <i class="fas ${icon}"></i>
      </div>
      <div class="material-title">${material.title}</div>
      <div class="material-actions">
        <button class="action-btn" onclick="showDeleteConfirmation('material', '${material._id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
}

function renderAssignmentBlock(assignment, topicId) {
  const deadline = new Date(assignment.deadline);
  const formattedDeadline = deadline.toLocaleDateString() + ' ' + deadline.toLocaleTimeString();
  
  return `
    <div class="assignment-block">
      <div class="assignment-header">
        <div class="assignment-title">${assignment.title}</div>
        <div class="assignment-deadline">
          <i class="fas fa-calendar-alt"></i>
          Due: ${formattedDeadline}
        </div>
      </div>
      <div class="assignment-desc">${assignment.description}</div>
      <div class="assignment-actions">
        <button class="action-btn" onclick="showDeleteConfirmation('assignment', '${assignment._id}')">
          <i class="fas fa-trash"></i> Delete Assignment
        </button>
      </div>
    </div>
  `;
}

// Event Handlers
async function handleAddCourse(e) {
  e.preventDefault();
  
  const courseData = {
    name: document.getElementById('courseName').value,
    department: document.getElementById('department').value,
    description: document.getElementById('courseDescription').value || ''
  };
  
  try {
    await createCourse(courseData);
    closeAllModals();
    loadCourses();
    addCourseForm.reset();
  } catch (error) {
    alert('Failed to create course. Please try again.');
  }
}

async function handleAddUnit(e) {
  e.preventDefault();
  
  const unitData = {
    title: document.getElementById('unitTitle').value,
    description: document.getElementById('unitDescription').value || ''
  };
  
  try {
    await createUnit(currentCourseId, unitData);
    closeAllModals();
    
    // Refresh the course management view
    openCourseManagement(currentCourseId);
    addUnitForm.reset();
  } catch (error) {
    alert('Failed to create unit. Please try again.');
  }
}

function showAddTopicModal() {
  currentTopicId = null;
  addTopicForm.reset();
  openModal(addTopicModal);
}

async function handleAddTopic(e) {
  e.preventDefault();
  
  const topicData = {
    title: document.getElementById('topicTitle').value,
    estimatedTime: document.getElementById('estimatedTime').value
  };
  
  try {
    await createTopic(currentCourseId, currentUnitId, topicData);
    closeAllModals();
    
    // Refresh the unit content
    selectUnit(currentUnitId);
    addTopicForm.reset();
  } catch (error) {
    alert('Failed to create topic. Please try again.');
  }
}

function showAddMaterialModal(topicId) {
  currentTopicId = topicId;
  addMaterialForm.reset();
  
  // Hide all conditional fields
  document.getElementById('pdfUploadField').classList.add('hidden');
  document.getElementById('videoUploadField').classList.add('hidden');
  document.getElementById('linkField').classList.add('hidden');
  
  openModal(addMaterialModal);
}

function handleMaterialTypeChange() {
  const selectedType = materialType.value;
  
  // Hide all fields first
  document.getElementById('pdfUploadField').classList.add('hidden');
  document.getElementById('videoUploadField').classList.add('hidden');
  document.getElementById('linkField').classList.add('hidden');
  
  // Show the selected type field
  if (selectedType === 'pdf') {
    document.getElementById('pdfUploadField').classList.remove('hidden');
  } else if (selectedType === 'video') {
    document.getElementById('videoUploadField').classList.remove('hidden');
  } else if (selectedType === 'link') {
    document.getElementById('linkField').classList.remove('hidden');
  }
}

async function handleAddMaterial(e) {
  e.preventDefault();
  
  const materialTitle = document.getElementById('materialTitle').value;
  const materialType = document.getElementById('materialType').value;
  
  let materialData = {
    title: materialTitle,
    type: materialType
  };
  
  // Add type-specific data
  if (materialType === 'pdf') {
    materialData.file = document.getElementById('pdfFile').files[0];
  } else if (materialType === 'video') {
    materialData.file = document.getElementById('videoFile').files[0];
  } else if (materialType === 'link') {
    materialData.url = document.getElementById('externalLink').value;
  }
  
  try {
    await addMaterial(currentCourseId, currentUnitId, currentTopicId, materialData);
    closeAllModals();
    
    // Refresh the unit content
    selectUnit(currentUnitId);
    addMaterialForm.reset();
  } catch (error) {
    alert('Failed to add material. Please try again.');
  }
}

function showAddAssignmentModal(topicId) {
  currentTopicId = topicId;
  addAssignmentForm.reset();
  
  // Set min date to today
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 16);
  document.getElementById('assignmentDeadline').min = formattedDate;
  
  openModal(addAssignmentModal);
}

async function handleAddAssignment(e) {
  e.preventDefault();
  
  const assignmentData = {
    title: document.getElementById('assignmentTitle').value,
    description: document.getElementById('assignmentDescription').value,
    deadline: document.getElementById('assignmentDeadline').value
  };
  
  const attachmentFile = document.getElementById('assignmentAttachment').files[0];
  if (attachmentFile) {
    assignmentData.attachment = attachmentFile;
  }
  
  try {
    await createAssignment(currentCourseId, currentUnitId, currentTopicId, assignmentData);
    closeAllModals();
    
    // Refresh the unit content
    selectUnit(currentUnitId);
    addAssignmentForm.reset();
  } catch (error) {
    alert('Failed to create assignment. Please try again.');
  }
}

function showDeleteConfirmation(type, id, parentId, grandParentId) {
  deleteItemType = type;
  deleteItemId = id;
  
  if (parentId) {
    deleteParentId = parentId;
    deleteGrandParentId = grandParentId || null;
  } else {
    deleteParentId = type === 'unit' ? currentCourseId : (type === 'topic' ? currentUnitId : null);
    deleteGrandParentId = (type === 'topic' || type === 'material' || type === 'assignment') ? currentCourseId : null;
  }
  
  openModal(deleteConfirmModal);
}

async function handleConfirmDelete() {
  try {
    await deleteItem(deleteItemType, deleteItemId, deleteParentId, deleteGrandParentId);
    closeAllModals();
    
    // Refresh the view based on what was deleted
    if (deleteItemType === 'course') {
      loadCourses();
    } else if (deleteItemType === 'unit') {
      openCourseManagement(currentCourseId);
    } else {
      selectUnit(currentUnitId);
    }
  } catch (error) {
    alert(`Failed to delete ${deleteItemType}. Please try again.`);
  }
}

// Load default courses on startup
async function loadDefaultCourses() {
  const defaultCourses = [
    {
      name: 'Data Structures',
      department: 'Computer Engineering',
      isDefault: true
    },
    {
      name: 'Operating Systems',
      department: 'Computer Science and Engineering',
      isDefault: true
    },
    {
      name: 'Computer Organisation and Architecture',
      department: 'Electronics and Telecommunication',
      isDefault: true
    }
  ];
  
  try {
    const response = await fetch('/api/courses/default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courses: defaultCourses })
    });
    
    if (!response.ok) throw new Error('Failed to load default courses');
    
    loadCourses();
  } catch (error) {
    console.error('Error loading default courses:', error);
  }
}

// Check if we need to load default courses
async function checkAndLoadDefaultCourses() {
  try {
    const response = await fetch('/api/courses');
    const courses = await response.json();
    
    if (courses.length === 0) {
      loadDefaultCourses();
    }
  } catch (error) {
    console.error('Error checking courses:', error);
  }
}

// Initialize default courses after DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  checkAndLoadDefaultCourses();
});