// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  themeToggle.innerHTML = `<i class="fas fa-${newTheme === 'light' ? 'moon' : 'sun'}"></i>`;
});

// Navigation
const navLinks = document.querySelectorAll('.course-nav-link');
const contentContainer = document.getElementById('courseContent');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    loadSection(link.dataset.section);
  });
});

// Load Content Section
async function loadSection(section) {
  const response = await fetch('/api/course/1');
  const courseData = await response.json();
  
  let content = '';
  
  switch(section) {
    case 'content':
      content = generateContentSection(courseData);
      break;
    case 'announcements':
      content = generateAnnouncementsSection(courseData);
      break;
    case 'performance':
      content = generatePerformanceSection(courseData);
      break;
  }
  
  contentContainer.innerHTML = content;
  initializeSectionHandlers(section);
}

// Generate Content Section
function generateContentSection(courseData) {
  return `
    <div class="course-section">
      <div class="section-header">
        <h2 class="section-title">Course Content</h2>
      </div>
      <div class="content-accordion">
        ${courseData.topics.map(topic => `
          <div class="topic-item">
            <div class="topic-header" data-topic="${topic.id}">
              <div class="topic-header-left">
                <div class="topic-icon">
                  <i class="fas fa-book"></i>
                </div>
                <div class="topic-meta">
                  <h3 class="topic-title">${topic.title}</h3>
                  <div class="topic-info">
                    <span class="topic-info-item">
                      <i class="fas fa-film"></i>
                      ${topic.lessons.length} Lessons
                    </span>
                    <span class="topic-info-item">
                      <i class="fas fa-clock"></i>
                      2 hours
                    </span>
                  </div>
                </div>
              </div>
              <div class="topic-toggle">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
            <div class="topic-content">
              <div class="lesson-list">
                ${topic.lessons.map(lesson => `
                  <div class="lesson-item">
                    <div class="lesson-icon ${lesson.type}">
                      <i class="fas fa-${lesson.type === 'video' ? 'play' : 'file-pdf'}"></i>
                    </div>
                    <div class="lesson-details">
                      <h4 class="lesson-title">${lesson.title}</h4>
                      <div class="lesson-info">
                        <span><i class="fas fa-clock"></i> ${lesson.duration || '10 min'}</span>
                      </div>
                    </div>
                    <span class="lesson-status ${lesson.status}">${lesson.status}</span>
                    ${lesson.type === 'assignment' ? `
                      <div class="submission-portal">
                        <div class="submission-header">
                          <div class="submission-title">
                            <i class="fas fa-upload"></i>
                            Submit Assignment
                          </div>
                          <div class="submission-date">Due: Apr 22, 2025</div>
                        </div>
                        <div class="submission-form">
                          <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" placeholder="Add a description..."></textarea>
                          </div>
                          <div class="form-group">
                            <label class="form-label">Upload Files</label>
                            <div class="file-upload">
                              <div class="file-upload-area">
                                <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                                <div class="file-upload-text">
                                  Drag and drop files here or
                                  <span class="file-upload-btn">browse</span>
                                </div>
                                <div class="file-format">Supported formats: PDF, DOC, DOCX</div>
                              </div>
                            </div>
                          </div>
                          <button class="submit-btn">Submit Assignment</button>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Generate Announcements Section
function generateAnnouncementsSection(courseData) {
  return `
    <div class="course-section">
      <div class="section-header">
        <h2 class="section-title">Announcements</h2>
      </div>
      <div class="announcement-list">
        ${courseData.announcements.map(announcement => `
          <div class="announcement-item">
            <div class="announcement-header">
              <h3 class="announcement-title">${announcement.title}</h3>
              <span class="announcement-date">${announcement.date}</span>
            </div>
            <div class="announcement-body">
              ${announcement.content}
            </div>
            <div class="announcement-footer">
              <div class="announcement-instructor">
                <img src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg" alt="Instructor" class="instructor-avatar" />
                <div class="instructor-info">
                  <span class="instructor-name">${announcement.instructor}</span>
                  <span class="instructor-role">Course Instructor</span>
                </div>
              </div>
              <div class="announcement-actions">
                <button class="action-btn">
                  <i class="fas fa-thumbs-up"></i>
                  <span>Like</span>
                </button>
                <button class="action-btn">
                  <i class="fas fa-comment"></i>
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Generate Performance Section
function generatePerformanceSection(courseData) {
  return `
    <div class="performance-section">
      <div class="performance-card">
        <h3 class="performance-title">
          <i class="fas fa-chart-line"></i>
          Course Progress
        </h3>
        <div class="progress-stats">
          <div class="progress-percent">
            <div class="progress-circle" style="--progress: ${courseData.progress}%">
              <span class="progress-value">${courseData.progress}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="performance-card">
        <h3 class="performance-title">
          <i class="fas fa-tasks"></i>
          Submissions
        </h3>
        <div class="submission-stats">
          <div class="stat-box completed">
            <div class="stat-value">12</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-box pending">
            <div class="stat-value">3</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>
        <div class="submission-list">
          <div class="submission-item">
            <div class="submission-icon completed">
              <i class="fas fa-check"></i>
            </div>
            <div class="submission-details">
              <h4 class="submission-name">JavaScript Basics Quiz</h4>
              <div class="submission-info">Submitted on Apr 15, 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize Section Handlers
function initializeSectionHandlers(section) {
  if (section === 'content') {
    const topicHeaders = document.querySelectorAll('.topic-header');
    topicHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isActive = content.classList.contains('active');
        
        // Close all other topics
        document.querySelectorAll('.topic-content').forEach(c => {
          c.classList.remove('active');
          c.previousElementSibling.querySelector('.topic-toggle i').className = 'fas fa-chevron-down';
        });
        
        // Toggle current topic
        if (!isActive) {
          content.classList.add('active');
          header.querySelector('.topic-toggle i').className = 'fas fa-chevron-up';
        }
      });
    });
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadSection('content');
});