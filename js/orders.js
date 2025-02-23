document.addEventListener("DOMContentLoaded", () => {
    let clients = getClients();
    let currentTablePage = 1;
    const ordersPerPage = 50;

    const tableBody = document.getElementById("orders-table");
    const exportBtn = document.getElementById("export-btn");
    const searchInput = document.getElementById("search-input");
    const pagination = document.getElementById("pagination");

    // Construim lista cu toate comenzile din toți clienții
    function getAllOrders() {
        const allOrders = [];
        clients.forEach((client, clientIndex) => {
            (client.orders || []).forEach(order => {
                allOrders.push({
                    clientName: client.name,
                    clientIndex: clientIndex,
                    ...order
                });
            });
        });
        return allOrders;
    }

    function renderOrders(filter = "") {
        tableBody.innerHTML = ""; // Resetăm tabelul
        const allOrders = getAllOrders();
        const filteredOrders = allOrders.filter(order => 
            order.orderName.toLowerCase().includes(filter.toLowerCase()) || 
            order.clientName.toLowerCase().includes(filter.toLowerCase())
        );
        const start = (currentTablePage - 1) * ordersPerPage;
        const end = start + ordersPerPage;
        const paginatedOrders = filteredOrders.slice(start, end);

        paginatedOrders.forEach(order => {
            const rowHTML = `
                <tr class="table-row" data-client-id="${order.clientIndex}">
                    <td class="p-4"><a href="client-details.html?id=${order.clientIndex}" class="text-blue-400 hover:text-blue-300">${order.orderName}</a></td>
                    <td class="p-4">${order.clientName}</td>
                    <td class="p-4">${order.orderDate}</td>
                    <td class="p-4">${order.finishDate}</td>
                    <td class="p-4">${order.cost || 0} lei</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", rowHTML);
        });

        // Adăugăm event listener pe rânduri după ce sunt create
        const rows = tableBody.querySelectorAll(".table-row");
        rows.forEach(row => {
            row.addEventListener("click", (e) => {
                if (e.target.tagName !== "A") {
                    const link = row.querySelector("a");
                    if (link) {
                        link.click();
                    }
                }
            });
        });

        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        pagination.innerHTML = "";
        if (totalPages <= 1) return;

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Înapoi";
        prevBtn.className = "page-btn text-white";
        prevBtn.disabled = currentTablePage === 1;
        prevBtn.addEventListener("click", () => {
            if (currentTablePage > 1) {
                currentTablePage--;
                renderOrders(searchInput.value);
            }
        });
        pagination.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.className = `page-btn text-white ${i === currentTablePage ? 'active' : ''}`;
            pageBtn.addEventListener("click", () => {
                currentTablePage = i;
                renderOrders(searchInput.value);
            });
            pagination.appendChild(pageBtn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Înainte";
        nextBtn.className = "page-btn text-white";
        nextBtn.disabled = currentTablePage === totalPages;
        nextBtn.addEventListener("click", () => {
            if (currentTablePage < totalPages) {
                currentTablePage++;
                renderOrders(searchInput.value);
            }
        });
        pagination.appendChild(nextBtn);
    }

    searchInput.addEventListener("input", (e) => {
        currentTablePage = 1;
        renderOrders(e.target.value);
    });

    exportBtn.addEventListener("click", () => {
        const allOrders = getAllOrders();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allOrders));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "orders.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    renderOrders(); // Inițializăm tabelul
});