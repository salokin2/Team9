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

    const days = [0,0,0,0,0,0,0]; // Save how many of each day seen so far

    for (let i = 0; i < 42; i++) {
        const dayNumLabel = grid[i].querySelector('.day-number');

        if (i >= calendarGridInfo.firstDayOfWeek && i < calendarGridInfo.numDays + calendarGridInfo.firstDayOfWeek) {
            // Days in the current month
            days[i % 7]++; // Increment current day
            const t = i - calendarGridInfo.firstDayOfWeek + 1;
            const holTxt = getHoliday(t, month, year, days);
            dayNumLabel.textContent = `${t}${holTxt}`;
            
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

/**
 * check if their a holiday on a given day and return holiday text
 */
function getHoliday(day, month, year, days) {
    let txt = "";
    const d = new Date(year, month,day);
    // Check for map holidays
    if (holidays.get(`${day}-${month}`) != undefined) {
        txt += " " + holidays.get(`${day}-${month}`);
    }

    // check for day count holidays
    // MLK
    if (month === 0 && days[1] === 3 && d.getDay() === 2) {
        txt += " Martin Luther King";
    }
    // Memorial Day
    if (month === 4 && d.getDay() === 2 && ((days[1] === 5 && day >= 29) || (days[1] === 4 && day >= 25))) {
        txt += " Memorial Day";
    }
    // Labor Day
    if (month === 8 && days[1] === 1 && d.getDay() === 1) {
        txt += " Labor Day";
    }
    // Thanksgiving
    if (month === 10 && days[4] === 4 && d.getDay() === 4) {
        txt += " Thanksgiving";
    }

    // Easter
    console.log(getEasterDate(year));
    if (d.getMonth() === getEasterDate(year).getMonth() && d.getDate() === getEasterDate(year).getDate()) {
        txt += " Easter";
    }
    return txt;
}

/**
 * Calculate when easter is. Gotten from the Internet
 */
function getEasterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
  
    return new Date(year, month - 1, day);
  }

/**
 * create a has map of all holidays where key: 'day-month' value: display text
 */
function holidayMap() {
    const temp = new Map();
    temp.set('1-0', "New Year's day");
    temp.set('4-6', "Independence Day");
    temp.set('1-3', "April Fools Day");
    temp.set('25-11', "Christmas");
    temp.set('31-11', "New Year's Eve");
    temp.set('24-11', "Christmas Eve");
    temp.set('14-1', "Valentine's Day");
    temp.set('1-15', "Presidents' Day");
    temp.set('11-10', "Veterans' Day");
    temp.set('31-9', "Halloween");
    return temp;
}

const holidays = holidayMap();

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
