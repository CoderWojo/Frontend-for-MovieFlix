// const login_endpoint = "http://localhost:8080/api/v1/auth/login";
const login_btn = document.getElementById("login-btn");
const register_btn = document.getElementById("register-btn");

function redirectToLoginPage() {
  window.location.href = "/pages/login.html";
}

function redirectToRegisterPage() {
  window.location.href = "/pages/register.html";
}

login_btn.addEventListener("click", redirectToLoginPage);
register_btn.addEventListener("click", redirectToRegisterPage);

