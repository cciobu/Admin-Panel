document.addEventListener("DOMContentLoaded", () => {
    let clients = getClients();
    let editIndex = null;
    let currentTablePage = 1;
    const clientsPerPage = 50;

    const tableBody = document.getElementById("client-table");
    const addClientBtn = document.getElementById("add-client-btn");
    const exportBtn = document.getElementById("export-btn");
    const modal = document.getElementById("client-modal");
    const modalTitle = document.getElementById("modal-title");
    const form = document.getElementById("client-form");
    const closeModalBtn = document.getElementById("close-modal");
    const nameInput = document.getElementById("client-name");
    const emailInput = document.getElementById("client-email");
    const phoneInput = document.getElementById("client-phone");
    const statusInput = document.getElementById("client-status");
    const searchInput = document.getElementById("search-input");
    const pagination = document.getElementById("pagination");

    function renderClients(filter = "") {
        tableBody.innerHTML = ""; // Resetăm tabelul
        const filteredClients = clients.filter(client => 
            client.name.toLowerCase().includes(filter.toLowerCase()) || 
            client.email.toLowerCase().includes(filter.toLowerCase())
        );
        const start = (currentTablePage - 1) * clientsPerPage;
        const end = start + clientsPerPage;
        const paginatedClients = filteredClients.slice(start, end);

        paginatedClients.forEach((client, index) => {
            const globalIndex = clients.indexOf(client);
            const rowHTML = `
                <tr class="table-row" data-client-id="${globalIndex}">
                    <td class="p-4"><a href="client-details.html?id=${globalIndex}" class="text-blue-400 hover:text-blue-300">${client.name}</a></td>
                    <td class="p-4">${client.email}</td>
                    <td class="p-4 ${client.status === 'Activ' ? 'status-active' : 'status-inactive'}">${client.status}</td>
                    <td class="p-4">
                        <button class="edit-btn text-blue-400 hover:text-blue-300" data-index="${globalIndex}">Editează</button>
                        <button class="delete-btn text-red-400 ml-2 hover:text-red-300" data-index="${globalIndex}">Șterge</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", rowHTML);
        });

        // Adăugăm event listener pe rânduri după ce sunt create
        const rows = tableBody.querySelectorAll(".table-row");
        rows.forEach(row => {
            row.addEventListener("click", (e) => {
                if (!e.target.classList.contains("edit-btn") && !e.target.classList.contains("delete-btn")) {
                    const link = row.querySelector("a");
                    if (link) {
                        link.click();
                    }
                }
            });
        });

        // Adăugăm event listeners pe butoane
        tableBody.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => editClient(btn.dataset.index));
        });
        tableBody.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => deleteClient(btn.dataset.index));
        });

        const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
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
                renderClients(searchInput.value);
            }
        });
        pagination.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.className = `page-btn text-white ${i === currentTablePage ? 'active' : ''}`;
            pageBtn.addEventListener("click", () => {
                currentTablePage = i;
                renderClients(searchInput.value);
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
                renderClients(searchInput.value);
            }
        });
        pagination.appendChild(nextBtn);
    }

    searchInput.addEventListener("input", (e) => {
        currentTablePage = 1;
        renderClients(e.target.value);
    });

    exportBtn.addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "clients.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    addClientBtn.addEventListener("click", () => {
        modalTitle.textContent = "Adaugă Client";
        form.reset();
        editIndex = null;
        modal.classList.remove("hidden");
    });

    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newClient = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value || "",
            status: statusInput.value,
            orders: []
        };

        if (editIndex === null) {
            clients.push(newClient);
        } else {
            clients[editIndex] = { ...clients[editIndex], ...newClient };
            editIndex = null;
        }

        saveClients(clients);
        renderClients(searchInput.value);
        modal.classList.add("hidden");
    });

    window.editClient = function(index) {
        editIndex = index;
        const client = clients[index];
        nameInput.value = client.name;
        emailInput.value = client.email;
        phoneInput.value = client.phone || "";
        statusInput.value = client.status;
        modalTitle.textContent = "Editează Client";
        modal.classList.remove("hidden");
    };

    window.deleteClient = function(index) {
        if (confirm("Sigur vrei să ștergi acest client?")) {
            clients.splice(index, 1);
            saveClients(clients);
            renderClients(searchInput.value);
        }
    };

    renderClients(); // Inițializăm tabelul
});