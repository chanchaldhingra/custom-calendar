const yearSelect = document.getElementById("yearSelect");

function showYearDropdown()  {
    const dt = new Date();
    let yr = Number(yearSelect.value) || dt.getFullYear();
    yearSelect.innerHTML = '';
    const startYear = yr - 10;
    const endYear = yr + 9;
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    yearSelect.value = yr;
}

showYearDropdown();

yearSelect.addEventListener('click', () => {showYearDropdown();});

yearSelect.addEventListener('change', () => {showYearDropdown();});
