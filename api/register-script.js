const form = document.getElementById("register-form");
const register_endpoint = "http://localhost:8080/api/v1/auth/register";
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
    if(response.ok) {
      alert("Registered successfully.");
    } else {
      alert("Something went wrong.");
    }
    } catch (error) {
      console.log(error);  
    }
  })
}