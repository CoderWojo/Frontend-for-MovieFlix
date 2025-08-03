const step1_endpoint = "http://localhost:8080/api/v1/forgot-password/send-code";
const step2_endpoint = "http://localhost:8080/api/v1/forgot-password/verify-code";
const step3_endpoint = "http://localhost:8080/api/v1/forgot-password/change-password";

const form = document.getElementById("forgot-password-form");
const form2 = document.getElementById("verify-code-form");
const form3 = document.getElementById("change-forgot-password-form");
const home_page_btn = document.getElementById("home-page-btn");

const message1 = document.getElementById("message-after-enter-mail");
const message2 = document.getElementById("message-after-enter-code");
const message3 = document.getElementById("message-after-enter-code");

function showMessage(text, success, p) {
  console.log("text = ", text);
    p.innerHTML = text;

    // dodaje odpowiednie klasy Tailwind stylizujące
    p.classList.add(success ? "text-green-600" : "text-red-600");
    p.classList.remove("hidden");
}

// sendPost
async function postData(url, body, p) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();  // może rzucić wyjątek

  if (!response.ok) {
    showMessage(data.detail, false, p);
    throw new Error(data.detail);
  }

  console.log(data);
  return data;
}

// 1.
async function handleSendEmail() {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const email = form.email.value;
      localStorage.setItem("email", email);
      const data = await postData(step1_endpoint, { email }, message1); // responseData
      console.log(1);
      showMessage(data.message, true, message1);
      console.log(2);

      // 2. hidden
      form.classList.add("hidden");
    
      // display
      form2.classList.remove("hidden");

      form2.addEventListener("submit", async function(e) {
        e.preventDefault();
        const code = parseInt(form2.code.value, 10);
        const body2 = {
          email: email,
          code: code
        };
        const data2 = await postData(step2_endpoint, body2, message2);
        // jesli zly kod no to showMessage(false)
        // if(data2.)

        console.log("wyslano 2., data2 = ", data2);
        // show message
        showMessage(data2.message, true, message2);

        // hide form, display form
        form2.classList.add("hidden");
        form3.classList.remove("hidden");

        form3.addEventListener("submit", async function(e) {
          e.preventDefault();
          
          const body3 = {
            email: email,
            code: code,
            password: form3.password1.value,
            repeatPassword: form3.password2.value
          }
          
          console.log("password1:", form3.password1.value);
console.log("password2:", form3.password2.value);
          const data3 = await postData(step3_endpoint, body3, message3);

          // jak submitnie to wtedy show komunikat
          showMessage(data3.message, true, message3);

          // show button to get back to home page
          home_page_btn.classList.remove("hidden");
        })
      })

      // odczytaj kod i wyslij
      
      } catch (error) {
        showMessage(error.message, false, message1);
      }
  });
}

handleSendEmail();
