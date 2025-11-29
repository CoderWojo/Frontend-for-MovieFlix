const me_endpoint = "http://localhost:8080/api/v1/settings/me";
const change_password_endpoint = "http://localhost:8080/api/v1/settings/change-password"

const userInfoBox = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const p1 = document.getElementById("password1");
const p2 = document.getElementById("password2");
const passMsg = document.getElementById("password-msg");
const submit_passwords = document.getElementById("change-password-btn");

const accessToken = localStorage.getItem("accessToken");
if(!accessToken) {
    window.location.href = "../index.html"
}

// pobranie danych użytkownika
loadUser();

async function loadUser() {
  try {
    const res = await fetch(me_endpoint, {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    });

    if (!res.ok) {
      localStorage.removeItem("accessToken");
      window.location.href = "../pages/login.html";
      return;
    }
    const user = await res.json();

    userInfoBox.innerHTML = `
      <h2 class="text-2xl font-semibold mb-2">Witaj, ${user.username}!</h2>
      <p class="text-gray-700"><b>Email:</b> ${user.email}</p>
      <p class="text-gray-700 mt-1"><b>Rola:</b> ${user.role}</p>
    `;

  } catch (e) {
    console.error(e);
    userInfoBox.innerHTML = `<p class="text-red-600">Błąd ładowania danych.</p>`;
  }
}

submit_passwords.addEventListener("click", async() => {
    
    passMsg.textContent = "";

    const pass1 = p1.value.trim();
    const pass2 = p2.value.trim();

    if (!pass1 || !pass2) {
        passMsg.textContent = "Oba pola muszą być wypełnione!"
        return
    }

    // wyślij do backendu nowe hasła 
    try {
        const res = await fetch(change_password_endpoint, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            oldPassword: pass1,
            newPassword: pass2, 
            repeatPassword: pass2
        })
        })
        const data = await res.json();
        
        if (!res.ok) {
            passMsg.textContent = data.detail;
        } else {
            passMsg.classList.remove("text-red-600");
            passMsg.classList.add("text-green-600");
            passMsg.textContent = data.message;

            submit_passwords.classList.add("hidden");
            p1.disabled = true;
            p2.disabled = true;

        }

        
    } catch (error) {
        console.error(error);
        passMsg.textContent = error.detail;
    }
})

// wylogowanie
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/index.html";
});
