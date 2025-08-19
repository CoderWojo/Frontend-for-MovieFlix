// const login_endpoint = "http://localhost:8080/api/v1/auth/login";
const get_three_endpoint = "http://localhost:8080/api/v1/movie/firstThree";

const login_btn = document.getElementById("login-btn");
const register_btn = document.getElementById("register-btn");
const popular_films = document.getElementById("popular-films");
const authSection = document.getElementById("auth-section");
const underFaq = document.getElementById("under-faq");
const buttons_container = document.getElementById("buttons-container");

function redirectToLoginPage() {
  window.location.href = "/pages/login.html";
}

function redirectToRegisterPage() {
  window.location.href = "/pages/register.html";
}

login_btn.addEventListener("click", redirectToLoginPage);
register_btn.addEventListener("click", redirectToRegisterPage);

getThree();

async function getThree() {
  try {
    const response = await fetch(get_three_endpoint);

    if(response.status == 403) {
      alert("Brak uprawnień do wykonania tej akcji.");
      throw new Error();
    }
    const dataList = await response.json(); // List<MovieDto>
    console.log("odpowiedź serwera: ", dataList);

    const container = document.getElementById("movies");
    
    dataList.forEach(movie => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow p-3 flex flex-col"
      
      card.innerHTML = `
      <img src="${movie.posterURL}" 
            alt="${movie.title}"
            class="rounded-xl mb-3 max-w-[168px] max-h-[168px]">
      <h2 class="font-semibold text-lg text-center">${movie.title}</h2>
      <p class="text-sm text-center">${movie.releaseYear}</p>
      <p class="text-yellow-500 font-bold"> 5⭐</p>
      `;

      container.appendChild(card);
    })

  } catch (error) {
    const h2 = document.createElement("h2");
    h2.className = "bg-red-500 text-white text-center";
    h2.innerHTML = "Nie udało się pobrać filmów.";

    popular_films.appendChild(h2);
    console.log(error, "CATCH!");
    throw error;
  }
}

  const accessToken = localStorage.getItem("accessToken");

  // TODO: wylogowanie sie , delete refreshTOken(cookie, db), delete AccessToken
  if(accessToken) {
    buttons_container.classList.add("hidden"); 
    // jeśli zalogowany – pokaż ikonę użytkownika oraz przycisk wyloguj się
    authSection.innerHTML = `
    <a href="/settings" class="text-2xl hover:text-gray-500 transition">
      Twoje konto 👤</a>
    
    <h2 class="ml-5 hover:text-gray-400 hover: transition"> Wyloguj się</h2>
  `;

      underFaq.innerHTML = `
      <button id="login-btn" onclick="window.location.href='/pages/all-movies.html'" class="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
        Zobacz wszystkie filmy
      </button>`;
  } else {
    // jeśli niezalogowany – pokaż przycisk logowania
    authSection.innerHTML = `
      <a href="/pages/login.html" class="bg-white text-blue-600 px-4 py-2 mr-4 rounded hover:bg-gray-300 transition font-semibold">
        Zaloguj się
      </a> 
            <a href="/pages//register.html" class="bg-black text-blue-600 px-4 py-2 rounded hover:bg-gray-800 transition font-semibold">
        Zarejestruj się
      </a>
    `;
  }