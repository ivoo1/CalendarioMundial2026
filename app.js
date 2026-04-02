// ===== COUNTRY ISO CODES for flag images =====
const countryCodes = {
    "México": "mx", "Sudáfrica": "za", "Corea del Sur": "kr", "Chequia": "cz",
    "Canadá": "ca", "Bosnia y Herz.": "ba", "Estados Unidos": "us", "Paraguay": "py",
    "Catar": "qa", "Suiza": "ch", "Brasil": "br", "Marruecos": "ma",
    "Haití": "ht", "Escocia": "gb-sct", "Australia": "au", "Turquía": "tr",
    "Alemania": "de", "Curazao": "cw", "Países Bajos": "nl", "Japón": "jp",
    "Costa de Marfil": "ci", "Ecuador": "ec", "Suecia": "se", "Túnez": "tn",
    "España": "es", "Cabo Verde": "cv", "Bélgica": "be", "Egipto": "eg",
    "Arabia Saudí": "sa", "Uruguay": "uy", "RI de Irán": "ir", "Nueva Zelanda": "nz",
    "Francia": "fr", "Senegal": "sn", "Irak": "iq", "Noruega": "no",
    "Argentina": "ar", "Argelia": "dz", "Austria": "at", "Jordania": "jo",
    "Portugal": "pt", "RD Congo": "cd", "Inglaterra": "gb-eng", "Croacia": "hr",
    "Ghana": "gh", "Panamá": "pa", "Uzbekistán": "uz", "Colombia": "co",
};

function getFlagImg(team, size = 24) {
    const code = countryCodes[team];
    if (!code) return '';
    return `<img src="https://flagcdn.com/w40/${code}.png" width="${size}" height="${Math.round(size * 0.75)}" alt="${team}" class="flag-img" loading="lazy">`;
}

// ===== FIFA RANKING (approximate, for importance scoring) =====
const fifaRanking = {
    "Argentina": 1, "Francia": 2, "España": 3, "Inglaterra": 4, "Brasil": 5,
    "Bélgica": 6, "Portugal": 7, "Países Bajos": 8, "Colombia": 9, "Alemania": 10,
    "Uruguay": 11, "Croacia": 12, "Italia": 13, "México": 14, "Estados Unidos": 15,
    "Suiza": 16, "Japón": 17, "Marruecos": 18, "Senegal": 19, "Turquía": 20,
    "Austria": 21, "Ecuador": 22, "Corea del Sur": 23, "Australia": 24, "Suecia": 25,
    "Noruega": 26, "Egipto": 27, "Chequia": 28, "Canadá": 29, "Paraguay": 30,
    "Arabia Saudí": 31, "RI de Irán": 32, "Ghana": 33, "Panamá": 34, "Túnez": 35,
    "Escocia": 36, "Costa de Marfil": 37, "Argelia": 38, "Irak": 39, "Uzbekistán": 40,
    "Jordania": 41, "Bosnia y Herz.": 42, "Sudáfrica": 43, "Catar": 44, "Nueva Zelanda": 45,
    "Haití": 46, "RD Congo": 47, "Cabo Verde": 48, "Curazao": 49
};

// ===== HISTORICAL RIVALRIES / HIGH-INTEREST MATCHUPS =====
// Pairs that have significant history (World Cup clashes, regional derbies, etc.)
const historicRivalries = [
    ["Argentina", "Brasil"], ["Argentina", "Uruguay"], ["Argentina", "Inglaterra"],
    ["Argentina", "Alemania"], ["Argentina", "Francia"], ["Argentina", "Países Bajos"],
    ["Brasil", "Francia"], ["Brasil", "Alemania"], ["Brasil", "Uruguay"],
    ["España", "Portugal"], ["España", "Francia"], ["España", "Alemania"],
    ["Inglaterra", "Alemania"], ["Inglaterra", "Francia"], ["Inglaterra", "Escocia"],
    ["Inglaterra", "Croacia"], ["Francia", "Alemania"], ["Francia", "Portugal"],
    ["Francia", "Bélgica"], ["Países Bajos", "Alemania"], ["Países Bajos", "España"],
    ["Brasil", "Marruecos"], ["Portugal", "Croacia"], ["Uruguay", "España"],
    ["Colombia", "Brasil"], ["Uruguay", "Colombia"], ["México", "Estados Unidos"],
    ["Colombia", "Argentina"], ["Japón", "Corea del Sur"],
    ["Colombia", "Portugal"], ["Marruecos", "Francia"], ["Marruecos", "España"],
    ["Croacia", "Argentina"], ["Japón", "Alemania"], ["Arabia Saudí", "Argentina"],
    ["Senegal", "Francia"], ["Australia", "Estados Unidos"],
];

function isRivalry(team1, team2) {
    return historicRivalries.some(([a, b]) =>
        (a === team1 && b === team2) || (a === team2 && b === team1)
    );
}

// Calculates match importance (0-100)
function getMatchImportance(match) {
    const rank1 = fifaRanking[match.team1] || 50;
    const rank2 = fifaRanking[match.team2] || 50;

    // Higher ranked teams = more important (inverted: rank 1 = 49 points, rank 49 = 1 point)
    const rankScore1 = Math.max(0, 50 - rank1);
    const rankScore2 = Math.max(0, 50 - rank2);

    // Combined rank importance (max ~98, normalized to 0-50)
    const combinedRank = ((rankScore1 + rankScore2) / 98) * 50;

    // Closeness bonus: closer ranks = more competitive (max 20)
    const rankDiff = Math.abs(rank1 - rank2);
    const closenessBonus = Math.max(0, 20 - rankDiff);

    // Rivalry bonus (30 points)
    const rivalryBonus = isRivalry(match.team1, match.team2) ? 30 : 0;

    // Argentina bonus (for local interest)
    const argBonus = isArgentina(match) ? 10 : 0;

    const total = combinedRank + closenessBonus + rivalryBonus + argBonus;
    return Math.min(100, Math.round(total));
}

// Star rating from importance score
function getStars(importance) {
    if (importance >= 75) return 5;
    if (importance >= 60) return 4;
    if (importance >= 45) return 3;
    if (importance >= 30) return 2;
    return 1;
}

function getImportanceLabel(stars) {
    if (stars >= 5) return "Imperdible";
    if (stars >= 4) return "Muy interesante";
    if (stars >= 3) return "Interesante";
    if (stars >= 2) return "Competitivo";
    return "";
}

function renderStars(count) {
    return '★'.repeat(count) + '<span class="star-empty">' + '★'.repeat(5 - count) + '</span>';
}


// ===== MATCH DATA (First Round - Argentine Time GMT-3) =====
const matches = [
    // JUN 11
    { date: "2026-06-11", time: "16:00", team1: "México", team2: "Sudáfrica", channel: "DSports" },
    { date: "2026-06-11", time: "23:00", team1: "Corea del Sur", team2: "Chequia", channel: "DSports" },
    // JUN 12
    { date: "2026-06-12", time: "16:00", team1: "Canadá", team2: "Bosnia y Herz.", channel: "DSports" },
    { date: "2026-06-12", time: "22:00", team1: "Estados Unidos", team2: "Paraguay", channel: "DSports" },
    // JUN 13
    { date: "2026-06-13", time: "16:00", team1: "Catar", team2: "Suiza", channel: "DSports" },
    { date: "2026-06-13", time: "19:00", team1: "Brasil", team2: "Marruecos", channel: "DSports" },
    { date: "2026-06-13", time: "22:00", team1: "Haití", team2: "Escocia", channel: "DSports" },
    // JUN 14
    { date: "2026-06-14", time: "01:00", team1: "Australia", team2: "Turquía", channel: "DSports" },
    { date: "2026-06-14", time: "02:00", team1: "Alemania", team2: "Curazao", channel: "DSports" },
    { date: "2026-06-14", time: "17:00", team1: "Países Bajos", team2: "Japón", channel: "DSports" },
    { date: "2026-06-14", time: "20:00", team1: "Costa de Marfil", team2: "Ecuador", channel: "DSports" },
    { date: "2026-06-14", time: "23:00", team1: "Suecia", team2: "Túnez", channel: "DSports" },
    // JUN 15
    { date: "2026-06-15", time: "13:00", team1: "España", team2: "Cabo Verde", channel: "DSports" },
    { date: "2026-06-15", time: "16:00", team1: "Bélgica", team2: "Egipto", channel: "DSports" },
    { date: "2026-06-15", time: "19:00", team1: "Arabia Saudí", team2: "Uruguay", channel: "DSports" },
    { date: "2026-06-15", time: "21:00", team1: "RI de Irán", team2: "Nueva Zelanda", channel: "DSports" },
    // JUN 16
    { date: "2026-06-16", time: "16:00", team1: "Francia", team2: "Senegal", channel: "DSports" },
    { date: "2026-06-16", time: "19:00", team1: "Irak", team2: "Noruega", channel: "DSports" },
    { date: "2026-06-16", time: "22:00", team1: "Argentina", team2: "Argelia", channel: "DSports / TVP" },
    // JUN 17
    { date: "2026-06-17", time: "01:00", team1: "Austria", team2: "Jordania", channel: "DSports" },
    { date: "2026-06-17", time: "14:00", team1: "Portugal", team2: "RD Congo", channel: "DSports" },
    { date: "2026-06-17", time: "17:00", team1: "Inglaterra", team2: "Croacia", channel: "DSports" },
    { date: "2026-06-17", time: "20:00", team1: "Ghana", team2: "Panamá", channel: "DSports" },
    { date: "2026-06-17", time: "23:00", team1: "Uzbekistán", team2: "Colombia", channel: "DSports" },
    // JUN 18
    { date: "2026-06-18", time: "13:00", team1: "Chequia", team2: "Sudáfrica", channel: "DSports" },
    { date: "2026-06-18", time: "16:00", team1: "Suiza", team2: "Bosnia y Herz.", channel: "DSports" },
    { date: "2026-06-18", time: "19:00", team1: "Canadá", team2: "Catar", channel: "DSports" },
    { date: "2026-06-18", time: "22:00", team1: "México", team2: "Corea del Sur", channel: "DSports" },
    // JUN 19
    { date: "2026-06-19", time: "16:00", team1: "Estados Unidos", team2: "Australia", channel: "DSports" },
    { date: "2026-06-19", time: "19:00", team1: "Escocia", team2: "Marruecos", channel: "DSports" },
    { date: "2026-06-19", time: "22:00", team1: "Brasil", team2: "Haití", channel: "DSports" },
    // JUN 20
    { date: "2026-06-20", time: "01:00", team1: "Turquía", team2: "Paraguay", channel: "DSports" },
    { date: "2026-06-20", time: "14:00", team1: "Países Bajos", team2: "Suecia", channel: "DSports" },
    { date: "2026-06-20", time: "17:00", team1: "Alemania", team2: "Costa de Marfil", channel: "DSports" },
    { date: "2026-06-20", time: "21:00", team1: "Ecuador", team2: "Curazao", channel: "DSports" },
    // JUN 21
    { date: "2026-06-21", time: "01:00", team1: "Túnez", team2: "Japón", channel: "DSports" },
    { date: "2026-06-21", time: "13:00", team1: "España", team2: "Arabia Saudí", channel: "DSports" },
    { date: "2026-06-21", time: "16:00", team1: "Bélgica", team2: "RI de Irán", channel: "DSports" },
    { date: "2026-06-21", time: "19:00", team1: "Uruguay", team2: "Cabo Verde", channel: "DSports" },
    { date: "2026-06-21", time: "22:00", team1: "Nueva Zelanda", team2: "Egipto", channel: "DSports" },
    // JUN 22
    { date: "2026-06-22", time: "14:00", team1: "Argentina", team2: "Austria", channel: "DSports / TVP" },
    { date: "2026-06-22", time: "18:00", team1: "Francia", team2: "Irak", channel: "DSports" },
    { date: "2026-06-22", time: "21:00", team1: "Noruega", team2: "Senegal", channel: "DSports" },
    // JUN 23
    { date: "2026-06-23", time: "00:00", team1: "Jordania", team2: "Argelia", channel: "DSports" },
    { date: "2026-06-23", time: "14:00", team1: "Portugal", team2: "Uzbekistán", channel: "DSports" },
    { date: "2026-06-23", time: "17:00", team1: "Inglaterra", team2: "Ghana", channel: "DSports" },
    { date: "2026-06-23", time: "20:00", team1: "Panamá", team2: "Croacia", channel: "DSports" },
    { date: "2026-06-23", time: "23:00", team1: "Colombia", team2: "RD Congo", channel: "DSports" },
    // JUN 24
    { date: "2026-06-24", time: "16:00", team1: "Suiza", team2: "Canadá", channel: "DSports" },
    { date: "2026-06-24", time: "16:00", team1: "Bosnia y Herz.", team2: "Catar", channel: "DSports" },
    { date: "2026-06-24", time: "19:00", team1: "Escocia", team2: "Brasil", channel: "DSports" },
    { date: "2026-06-24", time: "19:00", team1: "Marruecos", team2: "Haití", channel: "DSports" },
    { date: "2026-06-24", time: "22:00", team1: "Chequia", team2: "México", channel: "DSports" },
    { date: "2026-06-24", time: "22:00", team1: "Sudáfrica", team2: "Corea del Sur", channel: "DSports" },
    // JUN 25
    { date: "2026-06-25", time: "17:00", team1: "Ecuador", team2: "Alemania", channel: "DSports" },
    { date: "2026-06-25", time: "17:00", team1: "Curazao", team2: "Costa de Marfil", channel: "DSports" },
    { date: "2026-06-25", time: "20:00", team1: "Túnez", team2: "Países Bajos", channel: "DSports" },
    { date: "2026-06-25", time: "20:00", team1: "Japón", team2: "Suecia", channel: "DSports" },
    // JUN 26
    { date: "2026-06-26", time: "01:00", team1: "Turquía", team2: "Estados Unidos", channel: "DSports" },
    { date: "2026-06-26", time: "01:00", team1: "Paraguay", team2: "Australia", channel: "DSports" },
    { date: "2026-06-26", time: "16:00", team1: "Noruega", team2: "Francia", channel: "DSports" },
    { date: "2026-06-26", time: "16:00", team1: "Senegal", team2: "Irak", channel: "DSports" },
    { date: "2026-06-26", time: "21:00", team1: "Uruguay", team2: "España", channel: "DSports" },
    { date: "2026-06-26", time: "21:00", team1: "Cabo Verde", team2: "Arabia Saudí", channel: "DSports" },
    // JUN 27
    { date: "2026-06-27", time: "00:00", team1: "Nueva Zelanda", team2: "Bélgica", channel: "DSports" },
    { date: "2026-06-27", time: "00:00", team1: "Egipto", team2: "RI de Irán", channel: "DSports" },
    { date: "2026-06-27", time: "18:00", team1: "Panamá", team2: "Inglaterra", channel: "DSports" },
    { date: "2026-06-27", time: "18:00", team1: "Croacia", team2: "Ghana", channel: "DSports" },
    { date: "2026-06-27", time: "20:30", team1: "Colombia", team2: "Portugal", channel: "DSports" },
    { date: "2026-06-27", time: "20:30", team1: "RD Congo", team2: "Uzbekistán", channel: "DSports" },
    // JUN 28
    { date: "2026-06-28", time: "01:00", team1: "Jordania", team2: "Argentina", channel: "DSports / TVP" },
    { date: "2026-06-28", time: "01:00", team1: "Argelia", team2: "Austria", channel: "DSports" },
];

// ===== HELPERS =====
const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function formatDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return `${dayNames[date.getDay()]} ${d} de ${monthNames[date.getMonth()]}`;
}

function formatDateShort(dateStr) {
    const [, m, d] = dateStr.split("-").map(Number);
    return `${d}/${m}`;
}

function isArgentina(match) {
    return match.team1 === "Argentina" || match.team2 === "Argentina";
}

// ===== DOM =====
const grid = document.getElementById("matchesGrid");
const filtersContainer = document.getElementById("dateFilters");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearSearch");
const noResults = document.getElementById("noResults");
const featuredGrid = document.getElementById("featuredGrid");

// ===== STATS =====
const uniqueDates = [...new Set(matches.map(m => m.date))];
document.getElementById("totalMatches").textContent = matches.length;
document.getElementById("totalDays").textContent = uniqueDates.length;
document.getElementById("argMatches").textContent = matches.filter(isArgentina).length;

// ===== BUILD DATE FILTERS =====
uniqueDates.forEach(date => {
    const pill = document.createElement("button");
    pill.className = "filter-pill";
    pill.dataset.date = date;
    pill.textContent = formatDateShort(date);
    filtersContainer.appendChild(pill);
});

// ===== FEATURED MATCHES =====
function renderFeatured() {
    // Score all matches and pick the best ones
    const scored = matches.map(m => ({
        ...m,
        importance: getMatchImportance(m),
        stars: getStars(getMatchImportance(m))
    }));

    // Top featured matches (4-5 stars)
    const featured = scored
        .filter(m => m.stars >= 4)
        .sort((a, b) => b.importance - a.importance);

    if (!featuredGrid) return;

    featuredGrid.innerHTML = featured.map(m => {
        const argClass = isArgentina(m) ? " argentina" : "";
        const label = getImportanceLabel(m.stars);
        const rivalryTag = isRivalry(m.team1, m.team2)
            ? '<span class="rivalry-tag">⚔️ Rivalidad histórica</span>'
            : '';

        return `
            <div class="featured-card${argClass}">
                <div class="featured-top">
                    <span class="featured-date">${formatDateShort(m.date)} · ${m.time}</span>
                    <span class="featured-label">${label}</span>
                </div>
                <div class="featured-matchup">
                    <div class="featured-team">
                        ${getFlagImg(m.team1, 32)}
                        <span>${m.team1}</span>
                        <span class="featured-rank">#${fifaRanking[m.team1] || '?'}</span>
                    </div>
                    <div class="featured-vs">VS</div>
                    <div class="featured-team">
                        ${getFlagImg(m.team2, 32)}
                        <span>${m.team2}</span>
                        <span class="featured-rank">#${fifaRanking[m.team2] || '?'}</span>
                    </div>
                </div>
                <div class="featured-bottom">
                    <div class="featured-stars">${renderStars(m.stars)}</div>
                    ${rivalryTag}
                </div>
            </div>
        `;
    }).join("");
}

// ===== RENDER =====
let activeDate = "all";
let searchTerm = "";

function render() {
    let filtered = matches;

    if (activeDate !== "all") {
        filtered = filtered.filter(m => m.date === activeDate);
    }

    if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(m =>
            m.team1.toLowerCase().includes(q) ||
            m.team2.toLowerCase().includes(q)
        );
    }

    grid.innerHTML = "";

    if (filtered.length === 0) {
        noResults.style.display = "block";
        return;
    }
    noResults.style.display = "none";

    // Group by date
    const grouped = {};
    filtered.forEach(m => {
        if (!grouped[m.date]) grouped[m.date] = [];
        grouped[m.date].push(m);
    });

    Object.keys(grouped).sort().forEach(date => {
        const section = document.createElement("div");
        section.className = "date-section";

        const matchesForDay = grouped[date];

        section.innerHTML = `
            <div class="date-header">
                <span class="date-header-icon">📅</span>
                <h2>${formatDate(date)}</h2>
                <span class="match-count">${matchesForDay.length} partido${matchesForDay.length > 1 ? 's' : ''}</span>
            </div>
            <div class="day-matches">
                ${matchesForDay.map(m => renderCard(m)).join("")}
            </div>
        `;

        grid.appendChild(section);
    });
}

function renderCard(m) {
    const argClass = isArgentina(m) ? " argentina" : "";
    const importance = getMatchImportance(m);
    const stars = getStars(importance);
    const showStars = stars >= 3;

    return `
        <div class="match-card${argClass}">
            <div class="arg-badge">${getFlagImg("Argentina", 14)} ARG</div>
            <div class="match-time">
                <div class="time">${m.time}</div>
            </div>
            <div class="match-divider"></div>
            <div class="match-teams">
                <div class="team">${getFlagImg(m.team1)} ${m.team1}</div>
                <span class="team-vs">vs</span>
                <div class="team">${getFlagImg(m.team2)} ${m.team2}</div>
            </div>
            <div class="match-meta">
                ${showStars ? `<div class="card-stars">${renderStars(stars)}</div>` : ''}
                <div class="match-channel">${m.channel}</div>
            </div>
        </div>
    `;
}

// ===== EVENT LISTENERS =====

// Date filter pills
filtersContainer.addEventListener("click", e => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;

    filtersContainer.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    activeDate = pill.dataset.date;
    render();
});

// Search
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    clearBtn.classList.toggle("visible", searchTerm.length > 0);
    render();
});

clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchTerm = "";
    clearBtn.classList.remove("visible");
    searchInput.focus();
    render();
});

// ===== INIT =====
renderFeatured();
render();
