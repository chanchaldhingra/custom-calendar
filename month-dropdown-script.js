const monthSelect = document.getElementById("monthSelect");

// Populate month dropdown
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index + 1; // Month number (1-12)
    option.textContent = month;
    monthSelect.appendChild(option);
});

monthSelect.value = new Date().getMonth() + 1; // Default to current month