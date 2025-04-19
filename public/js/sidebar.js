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