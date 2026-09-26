const SUPABASE_URL =
  "https://kkzhxcxvkhxdbobffzwj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_8-tgQwuEqxyLnHtGRExfcg_sbZCaDTx";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ==========================================================
// LOGIN ELEMENTS
// ==========================================================

const loginForm =
  document.getElementById("loginForm");

const loginId =
  document.getElementById("loginId");

const password =
  document.getElementById("password");

const loginError =
  document.getElementById("loginError");

const togglePassword =
  document.getElementById("togglePassword");


// ==========================================================
// PASSWORD TOGGLE
// ==========================================================

togglePassword.addEventListener("click", () => {

  if (password.type === "password") {

    password.type = "text";
    togglePassword.textContent = "Hide";

  } else {

    password.type = "password";
    togglePassword.textContent = "Show";

  }

});


// ==========================================================
// LOGIN
// ==========================================================

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    loginError.classList.remove("show");

    const enteredId =
      loginId.value.trim().toLowerCase();

    const enteredPassword =
      password.value;


    // Only one dashboard user
    if (enteredId !== "nicadmin") {

      loginError.textContent =
        "Invalid login ID or password.";

      loginError.classList.add("show");

      password.value = "";
      password.focus();

      return;
    }


    // Supabase Auth login
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({

        email: "admin@nic.dash",

        password: enteredPassword

      });


    if (error) {

      console.error(
        "Login error:",
        error
      );

      loginError.textContent =
        "Invalid login ID or password.";

      loginError.classList.add("show");

      password.value = "";
      password.focus();

      return;
    }


    // Successful login
    sessionStorage.setItem(
      "sevaLoggedIn",
      "true"
    );

    sessionStorage.setItem(
      "sevaUser",
      "nicadmin"
    );


    window.location.href =
      "index.html";

  }
);