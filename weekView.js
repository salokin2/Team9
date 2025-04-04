document.addEventListener("DOMContentLoaded", function() {
    // Function to format date as "MMM D" (e.g., "Mar 1")
    function formatDate(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[date.getMonth()] + " " + date.getDate();
    }
    
    // Get current date and calculate the week's start date (Monday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diff = currentDay === 0 ? 6 : currentDay - 1; // Adjust for Monday start
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    
    // Set up date headers
    const dateHeaders = document.querySelectorAll('#date-header .date');
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        dateHeaders[i].textContent = formatDate(currentDate);
        dateHeaders[i].dataset.fullDate = currentDate.toISOString().split('T')[0];
    }
    
    // Create time slots in the day grid
    const dayGrid = document.getElementById("day-grid");
    const totalSlots = 24 * 7; // 24 hours × 7 days
    
    for (let i = 0; i < totalSlots; i++) {
        const cell = document.createElement("div");
        cell.classList.add("time-slot");
        
        // Calculate which day and hour this cell represents
        const day = i % 7;
        const hour = Math.floor(i / 7);
        
        cell.dataset.day = day;
        cell.dataset.hour = hour;
        
        dayGrid.appendChild(cell);
    }
    
});

function updateCalendarView(viewType) {
    if(viewType == 'year') {
        window.location.href = "yearView.html";
    }
    else if(viewType == 'month') {
        window.location.href = "app.html";
    }
}

