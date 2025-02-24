document.addEventListener("DOMContentLoaded", () => {
    console.log("Pagina Analize încărcată.");

    // Obținem clienții din localStorage
    const clients = getClients();

    // Verificăm dacă există clienți
    if (!clients || clients.length === 0) {
        console.error("Nu există clienți în localStorage. Adaugă date de test.");
        return; // Oprim execuția dacă nu există date
    }

    // Calculăm clienții activi și inactivi
    const activeClients = clients.filter(c => c.status === "Activ").length;
    const inactiveClients = clients.filter(c => c.status === "Inactiv").length;

    // Configurăm graficul Distribuția Clienților (existente)
    const ctxClients = document.getElementById("clientsChart").getContext("2d");
    if (!ctxClients) {
        console.error("Elementul #clientsChart nu a fost găsit în DOM.");
        return;
    }
    const clientsChart = new Chart(ctxClients, {
        type: "pie",
        data: {
            labels: ["Clienți Activi", "Clienți Inactivi"],
            datasets: [{
                data: [activeClients, inactiveClients],
                backgroundColor: ["#10b981", "#ef4444"],
                borderColor: ["#1e293b", "#1e293b"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#a0aeca",
                        font: { size: 12 }
                    }
                },
                title: {
                    display: true,
                    text: "Distribuția Clienților",
                    color: "#e2e8f0",
                    font: { size: 16 }
                }
            },
            layout: { padding: 0 }
        }
    });

    // Configurăm graficul Total Comenzi pe Lună/An (nou)
    const ctxOrders = document.getElementById("ordersByMonthYearChart").getContext("2d");
    if (!ctxOrders) {
        console.error("Elementul #ordersByMonthYearChart nu a fost găsit în DOM.");
        return;
    }
    const ordersByMonthYearChart = new Chart(ctxOrders, {
        type: "bar",
        data: {
            labels: [], // Vom calcula etichetele (luni/ani) din date
            datasets: [{
                label: "Număr de comenzi",
                data: [], // Vom calcula datele (numărul de comenzi pe lună/an)
                backgroundColor: "#3b82f6",
                borderColor: "#1e293b",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Total Comenzi pe Lună/An",
                    color: "#e2e8f0",
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: "#a0aeca" }
                },
                x: {
                    ticks: { color: "#a0aeca" }
                }
            }
        }
    });

    // Funcție pentru a calcula comenzile pe lună/an
    function calculateOrdersByMonthYear() {
        const orders = [];
        clients.forEach(client => {
            (client.orders || []).forEach(order => {
                if (order.orderDate) {
                    try {
                        const date = new Date(order.orderDate);
                        if (isNaN(date.getTime())) {
                            console.warn(`Data invalidă pentru comanda: ${order.orderDate}`);
                            return; // Sări peste date invalide
                        }
                        const year = date.getFullYear();
                        const month = date.toLocaleString('default', { month: 'long' }); // Numele lunii (ex. "Februarie")
                        orders.push({ year, month });
                    } catch (error) {
                        console.error(`Eroare la procesarea datei ${order.orderDate}:`, error);
                    }
                } else {
                    console.warn("Comanda nu are câmpul orderDate:", order);
                }
            });
        });

        // Grupăm comenzile pe lună și an
        const ordersByMonthYear = {};
        orders.forEach(order => {
            const key = `${order.month} ${order.year}`;
            ordersByMonthYear[key] = (ordersByMonthYear[key] || 0) + 1;
        });

        // Sortăm lunile/anii cronologic
        const sortedKeys = Object.keys(ordersByMonthYear).sort((a, b) => {
            const [monthA, yearA] = a.split(" ");
            const [monthB, yearB] = b.split(" ");
            const dateA = new Date(yearA, new Date(Date.parse(monthA + " 1, " + yearA)).getMonth());
            const dateB = new Date(yearB, new Date(Date.parse(monthB + " 1, " + yearB)).getMonth());
            return dateA - dateB;
        });

        // Actualizăm datele și etichetele graficului
        if (sortedKeys.length === 0) {
            console.warn("Nu există date pentru graficul comenzilor.");
            ordersByMonthYearChart.data.labels = ["Fără date"];
            ordersByMonthYearChart.data.datasets[0].data = [0];
        } else {
            ordersByMonthYearChart.data.labels = sortedKeys;
            ordersByMonthYearChart.data.datasets[0].data = sortedKeys.map(key => ordersByMonthYear[key] || 0);
        }
        ordersByMonthYearChart.update(); // Asigurăm actualizarea graficului
    }

    // Apelăm funcția după ce graficul este creat
    calculateOrdersByMonthYear();

    // Log pentru debug
    console.log("Clients:", clients);
    console.log("Orders by Month/Year Data:", ordersByMonthYearChart.data);
});