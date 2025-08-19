const login_endpoint = "http://localhost:8080/api/v1/auth/login";

const login_form = document.getElementById("login-form");
const success_announcement = document.getElementById("success-box");
const error_announcement = document.getElementById("error-box");

login_form.addEventListener("submit", postLoginForm);

async function postLoginForm(e) {
    e.preventDefault();

    const username = login_form.username.value;
    const password = login_form.password.value;
    const body = {
        username: username,
        password: password
    }

    try {
        const resp = await fetch(login_endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const data = await resp.json(); // accessToken który zapisujemy w localStorage
        const accessToken = data.accessToken;

        if(resp.ok) {
           // wyswietl komunikat
           success_announcement.classList.remove("hidden");
           error_announcement.classList.add("hidden");
           localStorage.setItem("accessToken", accessToken);

           login_form.username.disabled = true;
           login_form.password.disabled = true;
           login_form.querySelector("button[type='submit']").disabled = true;
        } else {
            success_announcement.classList.add("hidden");
            error_announcement.classList.remove("hidden");

        }
    } catch (error) {
        console.error(error);
        error_announcement.textContent = "⚠️ Wystąpił problem z serwerem. Spróbuj ponownie później.";
        error_announcement.classList.remove("hidden");

        throw error;
    }
}