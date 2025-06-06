const monthSelect = document.getElementById("monthSelect");
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function showMonthDropdown() {
    months.forEach((month, index) => {
    const option = document.createElement("option");
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    monthSelect.value = new Date().getMonth();
}
