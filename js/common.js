// Particule
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#3b82f6" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#9333ea", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out" }
    },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" } } },
    retina_detect: true
});

// Funcții comune
function getSettings() {
    return JSON.parse(localStorage.getItem("settings")) || { darkMode: true };
}

function saveSettings(settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
}

function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
    }
}

// Aplicăm tema la încărcare
const settings = getSettings();
applyTheme(settings.darkMode);

// Exportăm funcțiile
window.getSettings = getSettings;
window.saveSettings = saveSettings;
window.applyTheme = applyTheme;

function getClients() {
    let storedClients = JSON.parse(localStorage.getItem("clients")) || [];
    storedClients = storedClients.map(client => ({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        status: client.status || "Activ",
        orders: client.orders || []
    }));
    localStorage.setItem("clients", JSON.stringify(storedClients));
    return storedClients;
}

// Navigare sidebar și evidențiere tab activ
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const hamburger = document.querySelector(".hamburger");
    const sidebarLinks = document.querySelectorAll(".sidebar-item a");

    console.log("DOM fully loaded");
    console.log("Sidebar found:", sidebar ? "Yes" : "No");
    console.log("Hamburger found:", hamburger ? "Yes" : "No");
    console.log("Sidebar links found:", sidebarLinks.length);

    if (!sidebar) {
        console.error("Sidebar nu a fost găsit!");
        return;
    }
    if (!hamburger) {
        console.error("Hamburger nu a fost găsit!");
        return;
    }
    if (sidebarLinks.length === 0) {
        console.error("Niciun link nu a fost găsit în sidebar!");
        return;
    }

    // Gestionare hamburger
    hamburger.addEventListener("click", () => {
        console.log("Hamburger clicked, toggle sidebar");
        sidebar.classList.toggle("open");
        console.log("Sidebar open state:", sidebar.classList.contains("open"));
        if (!sidebar.classList.contains("open")) {
            sidebar.style.width = "0"; // Forțăm închiderea completă
        }
    });

    // Gestionăm click-ul pe link-urile din sidebar
    sidebarLinks.forEach((link, index) => {
        console.log(`Atașăm eveniment pe link ${index}:`, link.getAttribute("href"));
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Oprim navigarea implicită
            const href = link.getAttribute("href");
            console.log(`Link ${index} clicked:`, href);

            // Închidem sidebar-ul pe mobil
            if (window.innerWidth <= 768) {
                console.log("Închidem sidebar-ul pe mobil");
                sidebar.classList.remove("open");
                sidebar.style.width = "0"; // Forțăm închiderea completă
                setTimeout(() => {
                    console.log("Navigăm la:", href);
                    window.location.href = href;
                }, 300); // Așteptăm tranziția
            } else {
                console.log("Navigare directă pe desktop");
                window.location.href = href;
            }
        });
    });

    // Închidem sidebar-ul la click în afara lui
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains("open")) {
            console.log("Click în afara sidebar-ului, închidem");
            sidebar.classList.remove("open");
            sidebar.style.width = "0";
        }
    });

    // Închidem sidebar-ul la redimensionare dacă devine desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && sidebar.classList.contains("open")) {
            console.log("Redimensionare la desktop, închidem sidebar-ul");
            sidebar.classList.remove("open");
            sidebar.style.width = "0";
        }
    });

    // Evidențiere tab activ bazat pe URL
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    sidebarItems.forEach(item => {
        const link = item.querySelector("a");
        if (link && link.getAttribute("href") === currentPage) {
            item.classList.add("bg-blue-700", "font-semibold");
        } else {
            item.classList.remove("bg-blue-700", "font-semibold");
        }
    });
});
