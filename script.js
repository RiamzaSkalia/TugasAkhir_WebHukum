let currentData = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnSebelum").addEventListener("click", () => {
    loadUUD("UUD1945_sblmAmandemen.json");
  });

  document.getElementById("btnSesudah").addEventListener("click", () => {
    loadUUD("uud1945_sdhAmandemen.json");
  });

  document.getElementById("searchButton").addEventListener("click", searchText);
});

function loadUUD(fileName) {
  fetch(fileName)
    .then(res => res.json())
    .then(data => {
      currentData = data;
      renderContent(data);
    })
    .catch(err => {
      document.getElementById('content').innerHTML = 'Gagal memuat data: ' + err;
    });
}

function renderContent(data) {
  const content = document.getElementById('content');
  content.innerHTML = '';
  for (let bab in data.UUD_1945) {
    const babData = data.UUD_1945[bab];
    let html = `<h2>${bab}: ${babData.nama}</h2>`;
    babData.pasal.forEach(pasal => {
      html += `<div><strong>Pasal ${pasal.pasal}</strong>`;
      for (let ayat in pasal.ayat) {
        const id = `${bab}-Pasal-${pasal.pasal}-Ayat-${ayat}`;
        html += `<p id="${id}">
                   <span>${ayat}. ${pasal.ayat[ayat]}</span>
                   <span class='bookmark' onclick='addBookmark("${id}")'>&#128278;</span>
                   <span class='favorite' onclick='addFavorite("${id}")'>&#10084;</span>
                 </p>`;
      }
      html += '</div>';
    });
    content.innerHTML += html;
  }
}

function searchText() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  if (!term || !currentData) return;
  renderContent(currentData); // reset highlight
  const content = document.getElementById('content');
  content.querySelectorAll('p').forEach(p => {
    const raw = p.textContent.toLowerCase();
    if (raw.includes(term)) {
      const regex = new RegExp(`(${term})`, 'gi');
      p.innerHTML = p.innerHTML.replace(regex, '<span class=\"highlight\">$1</span>');
    }
  });
}

function addBookmark(id) {
  const item = document.getElementById(id).cloneNode(true);
  document.getElementById('bookmarks').appendChild(item);
}

function addFavorite(id) {
  const item = document.getElementById(id).cloneNode(true);
  document.getElementById('favorites').appendChild(item);
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnSebelum").addEventListener("click", () => {
    loadUUD("UUD1945_sblmAmandemen.json");
  });

  document.getElementById("btnSesudah").addEventListener("click", () => {
    loadUUD("uud1945_sdhAmandemen.json");
  });

  document.getElementById("searchButton").addEventListener("click", searchText);

  // Toggle Bookmark & Favorit Panel
  const favToggle = document.getElementById("favToggle");
  const bmToggle = document.getElementById("bmToggle");
  const favList = document.getElementById("favorites");
  const bmList = document.getElementById("bookmarks");

  favToggle.addEventListener("click", () => {
    favList.classList.toggle("hidden");
    favToggle.innerHTML = favList.classList.contains("hidden") ? "❤️ Favorit ⬇️" : "❤️ Favorit ⬆️";
  });

  bmToggle.addEventListener("click", () => {
    bmList.classList.toggle("hidden");
    bmToggle.innerHTML = bmList.classList.contains("hidden") ? "🔖 Bookmark ⬇️" : "🔖 Bookmark ⬆️";
  });
});
