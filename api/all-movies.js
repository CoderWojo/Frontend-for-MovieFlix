const ENDPOINT = "http://localhost:8080/api/v1/movie/allMoviesPage";

async function loadMovies() {
  const grid = document.getElementById("moviesGrid");
  grid.innerHTML = "<p class='col-span-full text-center'>Ładowanie...</p>";

  try {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(ENDPOINT, {
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    });

    if(res.status == 403) {
        alert("Brak uprawnien do wykonania tej akcji");
        throw new Error("Brak uprawnień.");
    } else if(res.status == 401) {
        const errorData = await res.json();
        console.log("errorData:", errorData);
        throw new Error("Wystąpił błąd. Zaloguj się ponownie.");
    } else if (!res.ok) {
        throw new Error(`Błąd. Status błędu: ${res.status}`);
    }

    const data = await res.json();
    console.log("odp backendu: ", data);
    
    const movies = data.movieDtos;
    grid.innerHTML = "";

    if (!movies.length) {
      grid.innerHTML = "<p class='col-span-full text-center text-gray-500'>Brak filmów do wyświetlenia</p>";
      return;
    }

    // movies.map(m => {...}) zwraca tablicę (w tym przypadku tablicę elementów HTML (string))
    // a innerHTML potrzebuje pojedyńczego stringa
    grid.innerHTML = movies.map(m => {
    const title = m.title;
    const year = m.releaseYear;
    const img = m.posterURL;
    console.log("img: ", img);
    //   TODO: dodać rating do filmów 
      const rating = m.rating ?? "-";

      return `
        <div class="bg-white rounded-xl shadow p-3 flex flex-col">
          <img src="${img}" alt="${title}" class="rounded-xl mb-3">
          <h2 class="font-semibold text-lg mb-1">${title}</h2>
          <p class="text-sm text-gray-500 mb-1">${year}</p>
          <p class="text-yellow-500 font-bold">⭐ ${rating}</p>
        </div>`;
    }).join("");

  } catch (err) {
    grid.innerHTML = `<p class='col-span-full font-semibold text-center text-red-600'>${err}</p>
    <button onclick="window.location.href='../pages/login.html'" class="bg-blue-500 col-span-full mx-auto text-white px-6 py-3 rounded hover:bg-blue-700 transition">
        Zaloguj się
      </button>`;
  }
}

loadMovies();
