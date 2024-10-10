// script.js

document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('monthSelect');
    const searchInput = document.getElementById('searchInput');
    const transactionsTable = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0];
    const totalSaleAmount = document.getElementById('totalSaleAmount');
    const totalSoldItems = document.getElementById('totalSoldItems');
    const totalNotSoldItems = document.getElementById('totalNotSoldItems');
    const ctxBar = document.getElementById('barChart').getContext('2d');

    let currentPage = 1;
    const perPage = 10; // Number of transactions per page

    // Global variables for Chart instances (to update instead of re-creating them)
    let barChartInstance;

    // Task 07: Fetch and Display Transactions
    const fetchTransactions = async (month, page, searchText = '') => {
        try {
            const response = await fetch(`http://localhost:5000/api/task_02/transactions?month=${month}&page=${page}&per_page=${perPage}&title=${searchText}`);
            const data = await response.json();
            populateTable(data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Populate the transactions table with API response data
    const populateTable = (transactions) => {
        transactionsTable.innerHTML = ''; // Clear existing rows
        transactions.forEach(transaction => {
            const row = transactionsTable.insertRow();
            row.insertCell(0).innerText = transaction.title;
            row.insertCell(1).innerText = transaction.description;
            row.insertCell(2).innerText = transaction.price;
            row.insertCell(3).innerText = transaction.category;
            row.insertCell(4).innerText = new Date(transaction.dateOfSale).toLocaleDateString();
            row.insertCell(5).innerText = transaction.sold ? 'Yes' : 'No';
        });
    };

    // Task 08: Fetch and Display Statistics
    const fetchStatistics = async (month) => {
        try {
            const response = await fetch(`http://localhost:5000/api/task_03/statistics?month=${month}`);
            const data = await response.json();
            totalSaleAmount.innerText = data.totalSaleAmount;
            totalSoldItems.innerText = data.totalSoldItems;
            totalNotSoldItems.innerText = data.totalNotSoldItems;
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // Task 09: Fetch and Render Bar Chart Data
    const renderBarChart = async (month) => {
        try {
            const response = await fetch(`http://localhost:5000/api/task_04/bar-chart?month=${month}`);
            const data = await response.json();
            
            const chartData = {
                labels: data.map(range => range.range),
                datasets: [{
                    label: 'Number of Items',
                    data: data.map(range => range.count),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            };

            if (barChartInstance) {
                barChartInstance.destroy(); // Destroy existing chart instance before creating a new one
            }

            barChartInstance = new Chart(ctxBar, {
                type: 'bar',
                data: chartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error rendering bar chart:', error);
        }
    };

    // Event Listeners for Interactions
    monthSelect.addEventListener('change', () => {
        currentPage = 1; // Reset to the first page on month change
        fetchTransactions(monthSelect.value, currentPage);
        fetchStatistics(monthSelect.value);
        renderBarChart(monthSelect.value);
    });

    searchInput.addEventListener('input', () => {
        fetchTransactions(monthSelect.value, currentPage, searchInput.value);
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchTransactions(monthSelect.value, currentPage, searchInput.value);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage++;
        fetchTransactions(monthSelect.value, currentPage, searchInput.value);
    });

    // Initial Fetch for Default Month (March)
    fetchTransactions(monthSelect.value, currentPage);
    fetchStatistics(monthSelect.value);
    renderBarChart(monthSelect.value);
});
