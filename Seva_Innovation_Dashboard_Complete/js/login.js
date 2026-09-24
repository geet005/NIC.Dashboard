const USERS = {
  nicadmin: "NIC@2026",
  nicteam: "Team@2026"
};

const loginForm = document.getElementById("loginForm");
const loginId = document.getElementById("loginId");
const password = document.getElementById("password");
const loginError = document.getElementById("loginError");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    togglePassword.textContent = "Hide";
  } else {
    password.type = "password";
    togglePassword.textContent = "Show";
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredId = loginId.value.trim().toLowerCase();
  const enteredPassword = password.value;

  if (USERS[enteredId] === enteredPassword) {
    sessionStorage.setItem("sevaLoggedIn", "true");
    sessionStorage.setItem("sevaUser", enteredId);

    window.location.href = "index.html";
  } else {
    loginError.classList.add("show");
    password.value = "";
    password.focus();
  }
});