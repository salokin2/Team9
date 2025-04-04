document.addEventListener("DOMContentLoaded", function() {

    const dateHeaders = document.querySelectorAll('#date-header .date');
    const dayGrid = document.getElementById("day-grid");
    const prevWeekButton = document.getElementById("prev-week");
    const nextWeekButton = document.getElementById("next-week");
    const currentWeekDisplay = document.getElementById("current-week-display");

    
    let currentMonday; // Holds the Date object for the Monday of the currently viewed week
    initializeWeekView();
    createTimeSlots(); 
    prevWeekButton.addEventListener("click", () => changeWeek(-7));
    nextWeekButton.addEventListener("click", () => changeWeek(7));


    // Sets current Week form current date
    function initializeWeekView() {
        

        const today = new Date(); 
        const currentDay = today.getDay(); 
        const diff = currentDay === 0 ? -6 : 1 - currentDay; 

        currentMonday = new Date(today);
        currentMonday.setDate(today.getDate() + diff); 
        currentMonday.setHours(0, 0, 0, 0); 

        updateWeekDisplay(currentMonday);
    }

    // Changes date header
    function updateWeekDisplay(mondayDate) {
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(mondayDate);
            currentDate.setDate(mondayDate.getDate() + i);
            weekDates.push(currentDate); 

            dateHeaders[i].textContent = formatDate(currentDate);
            dateHeaders[i].dataset.fullDate = currentDate.toISOString().split('T')[0]; 
        }

        const sundayDate = weekDates[6];
        currentWeekDisplay.textContent = `${formatDate(mondayDate)} - ${formatDate(sundayDate)}`;

        // TODO: Add logic here to clear old events and load/display events for the new week
        // clearEvents();
        // loadEventsForWeek(mondayDate);
    }

    // Function to change the week forward or backward
    function changeWeek(daysToAdd) {
        currentMonday.setDate(currentMonday.getDate() + daysToAdd);
        updateWeekDisplay(currentMonday);
    }

    // Function to format date as "MMM D"
    function formatDate(date) {
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[date.getMonth()] + " " + date.getDate();
    }


    // creates grid cells
    function createTimeSlots() {
        if (dayGrid.children.length > 0) return; // Avoid recreating if already done

        const totalSlots = 24 * 7; // 24 hours × 7 days
        for (let i = 0; i < totalSlots; i++) {
            const cell = document.createElement("div");
            cell.classList.add("time-slot");

            const dayIndex = i % 7; 
            const hour = Math.floor(i / 7); 

            cell.dataset.dayIndex = dayIndex;
            cell.dataset.hour = hour; 

           

            dayGrid.appendChild(cell);
        }
    }
});

// Change view
function updateCalendarView(viewType) {
    if (viewType === 'year') {
        window.location.href = "yearView.html";
    } else if (viewType === 'month') {
        window.location.href = "app.html";
    }
    
}
