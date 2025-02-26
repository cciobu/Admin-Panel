document.addEventListener("DOMContentLoaded", () => {
    console.log("Pagina Setări încărcată.");

    // Elementele DOM
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const resetDataBtn = document.getElementById("reset-data-btn");

    // Funcție pentru salvarea și obținerea preferințelor din localStorage
    function getSettings() {
        return JSON.parse(localStorage.getItem("settings")) || { darkMode: true };
    }

    function saveSettings(settings) {
        localStorage.setItem("settings", JSON.stringify(settings));
    }

    // Inițializăm tema
    const settings = getSettings();
    darkModeToggle.checked = settings.darkMode;
    applyTheme(settings.darkMode);

    // Aplicăm tema
    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
        }
    }

    // Gestionăm comutatorul de temă
    darkModeToggle.addEventListener("change", () => {
        const isDark = darkModeToggle.checked;
        settings.darkMode = isDark;
        saveSettings(settings);
        applyTheme(isDark);
    });

    // Gestionăm resetarea datelor
    resetDataBtn.addEventListener("click", () => {
        if (confirm("Sigur vrei să resetezi toate datele? Această acțiune nu poate fi anulată.")) {
            localStorage.removeItem("clients"); // Ștergem doar clienții și comenzile
            alert("Datele au fost resetate cu succes!");
            // Opțional: putem păstra setările temei
        }
    });
});