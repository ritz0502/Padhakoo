document.getElementById("theme-toggle").addEventListener("click", () => {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  });
  
  document.getElementById("toggle-password").addEventListener("click", () => {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
  });
  
  let isSignup = false;
  
  document.getElementById("toggle-form").addEventListener("click", (e) => {
    e.preventDefault();
    isSignup = !isSignup;
  
    document.getElementById("form-title").textContent = isSignup ? "Teacher Signup" : "Teacher Login";
    document.getElementById("submit-btn").textContent = isSignup ? "Sign Up" : "Sign In";
    document.getElementById("toggle-form").textContent = isSignup ? "Already have an account? Log in" : "Sign up here";
    document.getElementById("name-group").style.display = isSignup ? "block" : "none";
  });
  

  document.getElementById("auth-form").addEventListener("submit", (e) => {
    e.preventDefault(); // prevent actual form submission for now
  
    if (!isSignup) {
      // Login mode – redirect to dashboard
      window.location.href = "../pages/teacherDash.html";
    } else {
      // Signup mode – maybe show a "signup successful" message instead
      alert("Signup successful! You can now log in.");
      // Optionally auto-switch back to login
      document.getElementById("toggle-form").click();
    }
  });
  