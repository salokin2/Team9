/** 
 * Create a basic grid for all twelve months
 */
function gridInit() {
    const month = document.querySelector('.month');
    const monNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    for (let i = 0; i < 12; i++) {
        const newM = month.cloneNode(true);
        
        newM.querySelector('.name').textContent = monNames[i];

        const dayGrid = newM.querySelector('.day-grid');
        const cell = newM.querySelector('.cell');

        // Create 42 cells (6 rows x 7 columns)
        for (let x = 0; x < 42; x++) {
            const newCell = cell.cloneNode(true);
            newCell.classList.add(`day${x + 1}`);
            newCell.classList.add('cell');
            dayGrid.appendChild(newCell);
        }
        cell.remove(); // Remove the original template cell

        document.querySelector('.calendar-grid').appendChild(newM);
    }
    month.remove();
}

/**
 * create a year view calendar from a given year 
 */
function updateCalendar() {
    const year = document.querySelector('#yearInput').value;

    if (isNaN(year)) {
        console.error('Invalid year or month input');
        return;
    }

    for (let month = 0; month < 12; month++) {
        highlightDays(year, month);
    }
}

/**
 * Get calendar grid information for a given year and month
 */
function getCalendarGridInfo(year, month) {
    const date = new Date(year, month, 1);
    return {
        day: date.toLocaleString('default', { weekday: 'long' }),
        numDays: new Date(year, month + 1, 0).getDate(), // Correctly calculates the number of days in the month
        firstDayOfWeek: date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    };
}

/**
 * highlight the days in the given month 
 */
function highlightDays(year, month) {
    const calendarGridInfo = getCalendarGridInfo(year, month);
    const monthGrid = document.querySelectorAll('.calendar-grid .month')[month];
    const grid = monthGrid.querySelectorAll('.cell');

    for (let i = 0; i < 42; i++) {
        const dayNumLabel = grid[i].querySelector('.day-number');

        if (i >= calendarGridInfo.firstDayOfWeek && i < calendarGridInfo.numDays + calendarGridInfo.firstDayOfWeek) {
            // Days in the current month
            const t = i - calendarGridInfo.firstDayOfWeek + 1;
            dayNumLabel.textContent = t;
            
            grid[i].classList.remove('disabled');
            
            // Highlight today's date
            if (today.getFullYear() == year && today.getMonth() === month && today.getDate() === t) {
                grid[i].classList.add('today');
            } else {
                grid[i].classList.remove('today');
            }
        } else {
            // Days outside the current month
            dayNumLabel.textContent = '';
            grid[i].classList.add('disabled');
        }
    }
}

const today = new Date();   
document.querySelector('#yearInput').value = today.getFullYear();
gridInit()
updateCalendar()

/**
 * change the web page accoringly when view is chnaged
 */
function updateCalendarView(viewType) {
    if(viewType == 'month') {
        window.location.href = "app.html";
    }
    else if(viewType == 'week') {
        window.location.href = "weekView.html";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    //Toggle Dark Mode
    const toggleSwitch = document.getElementById("dark-mode-toggle");
    const root = document.documentElement;

    const viewToggleBtn = document.getElementById("view-toggle");
    const calendarContainer = document.querySelector(".calendar-container");

    if (localStorage.getItem("darkMode") === "enabled") {
        root.classList.add("dark-mode");
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener("change", function () {
        if (toggleSwitch.checked) {
            root.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            root.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    });
});