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
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".sidebar");

    // Navigare pe tot tab-ul
    sidebarItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (e.target.tagName !== "A") {
                const link = item.querySelector("a");
                if (link) {
                    link.click();
                }
            }
            // Închidem sidebar-ul pe mobil după click pe item
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("open");
            }
        });
    });

    // Evidențiere tab activ bazat pe URL
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    sidebarItems.forEach(item => {
        const link = item.querySelector("a");
        if (link && link.getAttribute("href") === currentPage) {
            item.classList.add("bg-blue-700", "font-semibold");
        } else {
            item.classList.remove("bg-blue-700", "font-semibold");
        }
    });

    // Gestionare hamburger
    hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    // Închidem sidebar-ul la click în afara lui
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
        }
    });

    // Închidem sidebar-ul la redimensionare dacă devine desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
        }
    });
});