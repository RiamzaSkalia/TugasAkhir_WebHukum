
const contentArea = document.getElementById('content-area');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const babList = document.getElementById('bab-list');
const userInfo = document.getElementById('user-info');

let UUD_DATA = {}; 

let soal = [
    {
        ayat: "Negara Indonesia ialah Negara Kesatuan yang berbentuk Republik.",
        jawaban: "Pasal 1 Ayat 1",
        pilihan: ["Pasal 1 Ayat 1", "Pasal 4 Ayat 1", "Pasal 27 Ayat 1", "Pasal 30 Ayat 1"]
    },
    {
        ayat: "Presiden memegang kekuasaan membentuk undang- undang dengan persetujuan Dewan Perwakilan Rakyat.",
        jawaban: "Pasal 5 Ayat 1",
        pilihan: ["Pasal 5 Ayat 1", "Pasal 10 Ayat 1", "Pasal 2 Ayat 2", "Pasal 20 Ayat 1"]
    },
    {
        ayat: "Tiap-tiap warga negara berhak dan wajib ikut serta dalam usaha pembelaan negara.",
        jawaban: "Pasal 30 Ayat 1",
        pilihan: ["Pasal 30 Ayat 1", "Pasal 29 Ayat 1", "Pasal 18 Ayat 1", "Pasal 26 Ayat 1"]
    }
];

soal = soal.sort(() => Math.random() - 0.5);
let current = 0;

function loadQuestion() {
    document.getElementById("feedback").textContent = "";

    const data = soal[current % soal.length];
    document.getElementById("questionText").textContent = `Ayat: "${data.ayat}"`;

    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    data.pilihan.forEach(pilihan => {
        const btn = document.createElement("button");
        btn.textContent = pilihan;
        btn.onclick = () => {
            const feedback = document.getElementById("feedback");
            if (pilihan === data.jawaban) {
                feedback.textContent = "✅ Benar!";
                feedback.style.color = "green";
            } else {
                feedback.textContent = `❌ Salah. Jawaban benar: ${data.jawaban}`;
                feedback.style.color = "red";
            }
            choicesContainer.querySelectorAll("button").forEach(b => b.disabled = true);
        };
        choicesContainer.appendChild(btn);
    });

    current++;
}


const pages = {
    home: `<h2>Selamat Datang di Portal Hukum</h2>
           <p>UUD 1945 adalah dasar hukum tertinggi di Indonesia. Di sini kamu dapat mencari pasal-pasal penting, membaca berita hukum terkini, dan memahami struktur hukum negara.</p>`,
    berita: `<h2>Berita Terkini</h2>
             <div class="artikel">
                 <h3>Revisi KUHP Disahkan</h3>
                 <p>Pemerintah dan DPR akhirnya mengesahkan revisi KUHP. Perubahan ini mencakup sejumlah pasal kontroversial.</p>
             </div>
             <div class="artikel">
                 <h3>MK Putuskan Gugatan UU Cipta Kerja</h3>
                 <p>Mahkamah Konstitusi menyatakan UU Cipta Kerja konstitusional dengan catatan perbaikan dalam dua tahun.</p>
             </div>`,
    tentang: `<h2>Tentang Portal</h2><p>Portal ini menyediakan informasi edukatif seputar Undang-Undang Dasar 1945 dan perkembangan hukum nasional.</p>`,
    soal: `
            <div class="card">
                <h2>Tebak Pasal UUD 1945</h2>
                <p id="scoreDisplay">Skor: 0</p>
                <p id="questionText">Memuat soal...</p>
                <div id="choices"></div>
                <p class="feedback" id="feedback"></p>
                <button onclick="loadQuestion()">Soal Selanjutnya</button>
            </div>`
};

function showPage(pageName, babKey = null) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    contentArea.innerHTML = '';

    if (pageName === 'login') {
        loginForm.style.display = 'block';
    } else if (pageName === 'register') {
        registerForm.style.display = 'block';
    } else if (pages[pageName]) {
        contentArea.innerHTML = pages[pageName];
        if (pageName === 'soal') loadQuestion();
    } else if (babKey && UUD_DATA[babKey]) {
        displayBabContent(babKey);
    } else {
        contentArea.innerHTML = "<p>Halaman tidak ditemukan.</p>";
    }
}

function loginUser() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (!user || !pass) {
        alert("Harap isi username dan password.");
        return;
    }

    const storedUser = localStorage.getItem('user');
    const storedPass = localStorage.getItem('pass');

    if ((user === 'admin' && pass === 'admin') || (user === storedUser && pass === storedPass)) {
        alert("Login berhasil sebagai " + user);
        userInfo.textContent = `Login sebagai: ${user}`;
        showPage('home');
    } else {
        alert("Login gagal. Username atau password salah.");
    }
}

function registerUser() {
    const newUser = document.getElementById('newUsername').value;
    const newPass = document.getElementById('newPassword').value;

    if (!newUser || !newPass) {
        alert("Harap isi semua kolom.");
        return;
    }

    localStorage.setItem('user', newUser);
    localStorage.setItem('pass', newPass);
    alert("Registrasi berhasil. Silakan login.");
    showPage('login');
}

function displayBabContent(babKey) {
    if (!UUD_DATA[babKey]) {
        contentArea.innerHTML = '<p>Data bab tidak ditemukan.</p>';
        return;
    }

    const bab = UUD_DATA[babKey];
    let htmlContent = `<div class="bab-content">`;
    htmlContent += `<h2>${babKey}: ${bab.nama}</h2>`;

    bab.pasal.forEach(pasal => {
        htmlContent += `<h3>Pasal ${pasal.pasal}</h3>`;
        for (const ayatKey in pasal.ayat) {
            if (pasal.ayat.hasOwnProperty(ayatKey)) {
                htmlContent += `<p class="ayat"><strong>Ayat ${ayatKey}:</strong> ${pasal.ayat[ayatKey]}</p>`;
            }
        }
    });
    htmlContent += `</div>`;
    contentArea.innerHTML = htmlContent;
}

function populateSidebarBab() {
    const ul = document.createElement('ul');
    for (const babKey in UUD_DATA) {
        if (UUD_DATA.hasOwnProperty(babKey)) {
            const bab = UUD_DATA[babKey];
            const li = document.createElement('li');
            li.setAttribute('onclick', `showPage('uud', '${babKey}')`);
            li.textContent = `${babKey} - ${bab.nama}`;
            ul.appendChild(li);
        }
    }
    babList.innerHTML = '';
    babList.appendChild(ul);
}

function searchContent() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';

    if (query === '') {
        showPage('home');
        return;
    }

    let searchResultsHtml = `<h2>Hasil Pencarian untuk "${query}"</h2>`;
    let foundResults = false;

    for (const babKey in UUD_DATA) {
        if (UUD_DATA.hasOwnProperty(babKey)) {
            const bab = UUD_DATA[babKey];
            let babMatch = false;
            let babContentForSearch = `<div class="bab-content"><h3>${babKey}: ${bab.nama}</h3>`;

            bab.pasal.forEach(pasal => {
                let pasalMatch = false;
                let pasalContentForSearch = `<h4>Pasal ${pasal.pasal}</h4>`;

                for (const ayatKey in pasal.ayat) {
                    if (pasal.ayat.hasOwnProperty(ayatKey)) {
                        const ayatText = pasal.ayat[ayatKey];
                        if (ayatText.toLowerCase().includes(query) || `pasal ${pasal.pasal}`.includes(query)) {
                            const highlightedText = ayatText.replace(new RegExp(query, 'gi'), match => `<mark>${match}</mark>`);
                            pasalContentForSearch += `<p class="ayat"><strong>Ayat ${ayatKey}:</strong> ${highlightedText}</p>`;
                            pasalMatch = true;
                            foundResults = true;
                        }
                    }
                }
                if (pasalMatch) babContentForSearch += pasalContentForSearch;
            });

            if (babMatch) searchResultsHtml += babContentForSearch + `</div>`;
        }
    }

    for (const key in pages) {
        if (pages[key].toLowerCase().includes(query)) {
            const highlighted = pages[key].replace(new RegExp(query, 'gi'), match => `<mark>${match}</mark>`);
            searchResultsHtml += `<div class="artikel"><h3>Ditemukan di Halaman: ${key.charAt(0).toUpperCase() + key.slice(1)}</h3>${highlighted}</div>`;
            foundResults = true;
        }
    }

    contentArea.innerHTML = foundResults ? searchResultsHtml : `<p>Tidak ada konten yang cocok dengan "${query}".</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('uud1945.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            UUD_DATA = data.UUD_1945;
            populateSidebarBab();
            showPage('home');
        })
        .catch(error => {
            console.error('Error data uud', error);
            contentArea.innerHTML = '<p style="color: red;">Gagal memuat data UUD 1945. Silakan coba lagi nanti.</p>';
        });
});
