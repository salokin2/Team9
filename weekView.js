document.addEventListener("DOMContentLoaded", function () {
    const dayGrid = document.getElementById("dayGrid");

    // Define number of rows (12 hours) and columns (7 days)
    const totalSlots = 12 * 7;

    for (let i = 0; i < totalSlots; i++) {
        const cell = document.createElement("div");
        cell.classList.add("time-slot");
        dayGrid.appendChild(cell);
    }
});
