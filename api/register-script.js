const form = document.getElementById("register-form");
const register_endpoint = "http://localhost:8080/api/v1/auth/register";

const error_box = document.getElementById("error-box");
const success_box = document.getElementById("success-box");
const register_submit_btn = document.getElementById("register-submit-btn");
const register_header = document.getElementById("register-header");

function hideFormAndErrors() {
  error_box.classList.add("hidden");
  form.classList.add("hidden");
  register_header.classList.add("hidden");
}

if(form) {
  form.addEventListener("submit", async function(e) {
    // dołączamy event object aby zatrzymać domyślne odświeżenie formularza po submicie
    // aby móc odczytać response oraz manualnie panować nad userem
    e.preventDefault();
    const body = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
      repeat: form.repeatPassword.value
    };
    try {
      const response = await fetch(register_endpoint, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body),   // nie możemy wysłać JS object, tylko go jako JSON String
      })
      const data = await response.json();
      console.log("data = ", data);

    if(response.ok) {
      alert("Registered successfully.");
      register_submit_btn.disabled = true;
      hideFormAndErrors();
      success_box.classList.remove("hidden");
    } else {

      // poinformuj użytkownika
      error_box.innerHTML = `${data.detail}`;
      console.error("Error: ", data.detail);
      throw new Error(data.detail);
    }
    } catch (error) {
      console.log(error);  
    }
  })
}