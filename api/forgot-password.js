const step1_endpoint = "http://localhost:8080/api/v1/forgot-password/send-code";
const step2_endpoint = "http://localhost:8080/api/v1/forgot-password/verify-code";
const step3_endpoint = "http://localhost:8080/api/v1/forgot-password/change-password";

const form = document.getElementById("forgot-password-form");
const form2 = document.getElementById("verify-code-form");
const form3 = document.getElementById("change-forgot-password-form");
const home_page_btn = document.getElementById("home-page-btn");

const message1 = document.getElementById("message-after-enter-mail");
const message2 = document.getElementById("message-after-enter-code");
const message3 = document.getElementById("password-changed-success").querySelector("h2");

const global_error = document.getElementById("global-error");
const login_page_btn = document.getElementById("get-back-to-login-page-btn");

function showMessage(text, success, p) {
    p.innerHTML = text;

    p.classList.remove("text-red-600");
    // dodaje odpowiednie klasy Tailwind stylizujące
    p.classList.add(success ? "text-green-600" : "text-red-600");
    p.classList.remove("hidden");
}

function blockSubmitBtn(form) {
  form.querySelector("button[type='submit']").disabled = true;
}

function unblockSubmitBtn(form) {
  form.querySelector("button[type='submit']").disabled = false;
}

function redirectToLogin() {
  window.location.href = "../pages/login.html";
}

// sendPost
async function postData(url, body) {
  try {
    const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // sprawdz czy odp nie jest pusta np gdy kliknie szybko pare razy
    const data = await response.json();  // może rzucić wyjątek

    if (!response.ok) {
      throw new Error(data.detail);
    }

    console.log("Odpowiedź serwera: ", data);

    return data;
  } catch (error) {
    // W javaScript jeśli funkcja async nie ma return w catch ani throw, to domyślnie zwraca undefined
    console.error("Something went wrong with given request.");
    if(error.message == "failed to fetch") {
      setTimeout(() => {
        redirectToLogin();
      }, 3000); // po 3 sekundach komunikatu 'failed to fetch' przekieruj do strony logowania
    }
    throw error;
  }
}

async function onSubmitForm1(e) {
    // blokujemy 2 zatwierdzenie
    blockSubmitBtn(form);
    e.preventDefault();
      const email = form.email.value;
      localStorage.setItem("email", email);
      try {
        const data = await postData(step1_endpoint, { email }); // responseData
        showMessage(data.message, true, message1);
        form.classList.add("hidden");
      
        form2.classList.remove("hidden");
      } catch (error) {
        showMessage(error.message, false, message1);
        console.error("Cannot to send request to ", step1_endpoint);
      } finally {
        //  odblokujmy przycisk nie ważne co wczesniej
        unblockSubmitBtn(form);
      }
}

async function onSubmitForm2(e) {
  const email = localStorage.getItem("email");
  message1.classList.add("hidden");
  blockSubmitBtn(form);
  e.preventDefault();
  // usuń wcześniejszą wiadomosc
  
  const code = parseInt(form2.code.value, 10);
  localStorage.setItem("code", code);
  const body2 = {
    email: email,
    code: code
  };
  try {
    const data2 = await postData(step2_endpoint, body2);
    showMessage(data2.message, true, message2);
    
    form2.classList.add("hidden");
    form3.classList.remove("hidden");
  } catch (error) {
    showMessage(error.message, false, message2);
    console.error("Cannot send request to: ", step2_endpoint);
  } finally {
    unblockSubmitBtn(form2);
  }
} 

async function onSubmitForm3(e) {
  const email = localStorage.getItem("email");
  const code = localStorage.getItem("code");
  message2.classList.add("hidden");
  blockSubmitBtn(form3);
  e.preventDefault();
  
  const body3 = {
    email: email,
    code: code,
    password: form3.password1.value,
    repeatPassword: form3.password2.value
  }
  try {
    const data3 = await postData(step3_endpoint, body3);
    // jak submitnie to wtedy show komunikat
    showMessage(data3.message, true, message3);

    form3.classList.add("hidden");
    message3.parentElement.classList.remove("hidden");
    
  } catch (error) {
    showMessage(error.message, false, message3);
    console.log("Cannot send request to ", step3_endpoint);
  } finally {
    unblockSubmitBtn(form3);
  }
}

// 1.
async function handleSendEmail() {
  form.addEventListener("submit", onSubmitForm1);

  form2.addEventListener("submit", onSubmitForm2);

  form3.addEventListener("submit", onSubmitForm3);
      
}

handleSendEmail();
