/**
 * Create the grid of days
 */
function createGrid() {
    const dayGrid = document.querySelector('.day-grid');
    const cell = document.querySelector('.cell');

    // Create 42 cells (6 rows x 7 columns)
    for (let i = 0; i < 42; i++) {
        const newCell = cell.cloneNode(true);
        newCell.classList.add(`day${i + 1}`);
        newCell.classList.add('cell');
        dayGrid.appendChild(newCell);
    }
    cell.remove(); // Remove the original template cell
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
 * Highlight the days in the current month
 */
function highlightDaysInMonth(year, month) {
    const calendarGridInfo = getCalendarGridInfo(year, month);
    const grid = document.querySelectorAll('.cell');

    for (let i = 0; i < 42; i++) {
        const dayNumLabel = grid[i].querySelector('.day-number');

        if (i >= calendarGridInfo.firstDayOfWeek && i < calendarGridInfo.numDays + calendarGridInfo.firstDayOfWeek) {
            // Days in the current month
            dayNumLabel.textContent = i - calendarGridInfo.firstDayOfWeek + 1;
            grid[i].classList.remove('disabled');

            // Highlight today's date
            const today = new Date();
            if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === i - calendarGridInfo.firstDayOfWeek + 1) {
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

/**
 * Update the calendar grid based on the selected year and month
 */
function updateCalendarGrid() {
    const year = parseInt(document.querySelector('#yearInput').value, 10);
    const month = parseInt(document.querySelector('#monthSelect').value, 10);

    if (isNaN(year) || isNaN(month)) {
        console.error('Invalid year or month input');
        return;
    }

    highlightDaysInMonth(year, month);
}

// Initialize the grid
const today = new Date();
document.querySelector('#yearInput').value = today.getFullYear();
document.querySelector('#monthSelect').value = today.getMonth();
createGrid();
updateCalendarGrid();

// Update Calender View
function updateCalendarView(viewType) {
    if(viewType == 'month') {

    }
    else if(viewType == 'year') {

    }
    else if(viewType == 'week') {
        window.location.href = "weekView.html";
    }
}