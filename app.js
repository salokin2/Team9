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
            grid[i].setAttribute('day', t); // Set the day attribute for event handling
            
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
            grid[i].removeAttribute('day'); // Clear the day attribute
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
 * Set view mode for the calendar (month, week, day)
 */
function setViewMode(mode) {

    // Get all views
    const dayView = document.querySelector('.day-view');
    const monthView = document.querySelector('.month-view');

    // Remove active class from all views
    dayView.classList.remove('active');
    monthView.classList.remove('active');

    // Add active class to the selected view
    switch (mode) {
        case 'day':
            dayView.classList.add('active');
            break;
        case 'week':
            weekView.classList.add('active');
            break;
        case'month':
            monthView.classList.add('active');
            break;
        default:
            console.error('Invalid view mode');
            return;
    }
}

/**
 * Show specific day of the calendar
 */
function showDay(dayElement) {

    // Get the selected day's date
    const dayNum = parseInt(dayElement.getAttribute('day'), 10);
    const month = parseInt(document.querySelector('#monthSelect').value, 10);
    const year = parseInt(document.querySelector('#yearInput').value, 10);

    // Set mode to day view
    setViewMode('day');

    // Show the selected day
    const dayView = document.querySelector('.day-view');
    const dayViewDate = dayView.querySelector('.date');
    dayViewDate.textContent = `${month + 1}/${dayNum}/${year}`;
}

/**
 * Event handling functionality for the calendar
 */

// Store for all events
let calendarEvents = {};

/**
 * Load events from localStorage
 */
function loadEvents() {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
        calendarEvents = JSON.parse(savedEvents);
    }
}

/**
 * Save events to localStorage
 */
function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
}

/**
 * Add a new event to the calendar
 */
function addEvent(year, month, day, eventData) {
    const dateKey = `${year}-${month}-${day}`;
    
    if (!calendarEvents[dateKey]) {
        calendarEvents[dateKey] = [];
    }
    
    // Add unique ID to event
    eventData.id = Date.now().toString();
    calendarEvents[dateKey].push(eventData);
    
    saveEvents();
    return eventData.id;
}

/**
 * Delete an event from the calendar
 */
function deleteEvent(year, month, day, eventId) {
    const dateKey = `${year}-${month}-${day}`;
    
    if (calendarEvents[dateKey]) {
        calendarEvents[dateKey] = calendarEvents[dateKey].filter(event => event.id !== eventId);
        saveEvents();
        return true;
    }
    
    return false;
}

/**
 * Get all events for a specific date
 */
function getEventsForDate(year, month, day) {
    const dateKey = `${year}-${month}-${day}`;
    return calendarEvents[dateKey] || [];
}

/**
 * Render event indicators in the month view for days with events
 */
function renderEventIndicators() {
    const year = parseInt(document.querySelector('#yearInput').value, 10);
    const month = parseInt(document.querySelector('#monthSelect').value, 10);
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        const day = parseInt(cell.getAttribute('day'), 10);
        const events = getEventsForDate(year, month, day);
        
        // Remove old indicators
        const oldIndicator = cell.querySelector('.event-indicator');
        if (oldIndicator) {
            oldIndicator.remove();
        }

        // Remove indicator if cell is disabled
        console.log('a')
        if(cell.classList.contains('disabled')) {
            if(oldIndicator) {
                oldIndicator.remove();
            }
        }
        
        // Add indicator if there are events
        if (events.length > 0) {
            const indicator = document.createElement('div');
            indicator.className = 'event-indicator';
            indicator.textContent = events.length;
            cell.appendChild(indicator);
        }
    });
}

/**
 * Show event form for a specific day, optionally with an existing event to edit
 */
function showEventForm(day, eventToEdit = null) {
    const month = parseInt(document.querySelector('#monthSelect').value, 10);
    const year = parseInt(document.querySelector('#yearInput').value, 10);
    
    // Show the form modal
    const modal = document.getElementById('eventFormModal');
    modal.style.display = 'block';
    
    // Set the date in the form
    document.getElementById('eventDate').textContent = `${month + 1}/${day}/${year}`;
    document.getElementById('eventDay').value = day;
    document.getElementById('eventMonth').value = month;
    document.getElementById('eventYear').value = year;
    
    // If editing an existing event, populate the form
    if (eventToEdit) {
        document.getElementById('eventTitle').value = eventToEdit.title;
        document.getElementById('eventTime').value = eventToEdit.time || '';
        document.getElementById('eventDescription').value = eventToEdit.description || '';
        document.getElementById('eventColor').value = eventToEdit.color || '#3a7bd5';
        document.getElementById('eventId').value = eventToEdit.id;
    } else {
        // Reset form fields for new event
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventTime').value = '';
        document.getElementById('eventDescription').value = '';
        document.getElementById('eventColor').value = '#3a7bd5';
        document.getElementById('eventId').value = '';
    }
}

/**
 * Save or update event from form
 */
function saveEventFromForm() {
    const day = parseInt(document.getElementById('eventDay').value, 10);
    const month = parseInt(document.getElementById('eventMonth').value, 10);
    const year = parseInt(document.getElementById('eventYear').value, 10);
    const eventId = document.getElementById('eventId').value;
    
    const eventData = {
        title: document.getElementById('eventTitle').value,
        time: document.getElementById('eventTime').value,
        description: document.getElementById('eventDescription').value,
        color: document.getElementById('eventColor').value,
        id: eventId || Date.now().toString() // Use existing ID or create new one
    };
    
    const dateKey = `${year}-${month}-${day}`;
    
    if (eventId) {
        // Update existing event
        if (calendarEvents[dateKey]) {
            const eventIndex = calendarEvents[dateKey].findIndex(e => e.id === eventId);
            if (eventIndex !== -1) {
                calendarEvents[dateKey][eventIndex] = eventData;
            }
        }
    } else {
        // Add new event
        if (!calendarEvents[dateKey]) {
            calendarEvents[dateKey] = [];
        }
        calendarEvents[dateKey].push(eventData);
    }
    
    saveEvents();
    
    // Close the modal
    document.getElementById('eventFormModal').style.display = 'none';
    
    // Update the calendar display
    renderEventIndicators();
    renderDayViewEvents(day, month, year);
    
    return false; // Prevent form submission
}


/**
 * Render events in the day view
 */
function renderDayViewEvents(day, month, year) {
    const events = getEventsForDate(year, month, day);
    const eventContainer = document.querySelector('.day-events');
    
    // Clear existing events
    eventContainer.innerHTML = '';
    
    if (events.length === 0) {
        const noEvents = document.createElement('p');
        noEvents.className = 'no-events';
        noEvents.textContent = 'No events scheduled for this day.';
        eventContainer.appendChild(noEvents);
        return;
    }
    
    // Sort events by time
    events.sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
    });
    
    // Create event elements
    events.forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = 'event-item';
        eventEl.style.borderLeft = `4px solid ${event.color || '#3a7bd5'}`;
        
        // Make the entire event clickable for editing
        eventEl.onclick = function() {
            showEventForm(day, event);
        };
        
        const eventTime = document.createElement('div');
        eventTime.className = 'event-time';
        eventTime.textContent = event.time || 'All day';
        
        const eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        eventTitle.textContent = event.title;
        
        const eventDesc = document.createElement('div');
        eventDesc.className = 'event-description';
        eventDesc.textContent = event.description;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-event';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = function(e) {
            e.stopPropagation(); // Prevent triggering the parent click event
            if (confirm('Are you sure you want to delete this event?')) {
                deleteEvent(year, month, day, event.id);
                renderDayViewEvents(day, month, year);
                renderEventIndicators();
            }
        };
        
        eventEl.appendChild(eventTime);
        eventEl.appendChild(eventTitle);
        eventEl.appendChild(eventDesc);
        eventEl.appendChild(deleteBtn);
        eventContainer.appendChild(eventEl);
    });
    
    // If we're in day view, also update hour slots
    if (document.querySelector('.day-view').classList.contains('active')) {
        updateHourSlots(events);
    }
}
/**
 * Update hour slots in day view with events
 */
function updateHourSlots(events) {
    // Clear existing event slots
    const existingSlots = document.querySelectorAll('.event-slot');
    existingSlots.forEach(slot => slot.remove());
    
    // Add events to hour slots
    events.forEach(event => {
        if (!event.time) return; // Skip all-day events
        
        const timeValue = event.time;
        const hourMatch = timeValue.match(/(\d+):(\d+)\s*(AM|PM)/i);
        
        if (hourMatch) {
            let hour = parseInt(hourMatch[1], 10);
            const minutes = parseInt(hourMatch[2], 10);
            const ampm = hourMatch[3].toUpperCase();
            
            // Convert to 24-hour format
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
            
            // Find the corresponding hour element
            const hourIndex = hour;
            const hourEl = document.querySelectorAll('.hour')[hourIndex];
            
            if (hourEl) {
                const eventSlot = document.createElement('div');
                eventSlot.className = 'event-slot';
                eventSlot.style.backgroundColor = event.color || '#3a7bd5';
                eventSlot.style.top = `${(minutes / 60) * 100}%`;
                eventSlot.textContent = event.title;
                
                // Make the hour slot clickable for editing
                eventSlot.onclick = function(e) {
                    e.stopPropagation();
                    const day = parseInt(document.querySelector('.day-view .date').textContent.split('/')[1], 10);
                    showEventForm(day, event);
                };
                
                hourEl.appendChild(eventSlot);
            }
        }
    });
}

/**
 * Extend the showDay function to display events
 */
function showDay(dayElement) {
    // Get the selected day's date
    const dayNum = parseInt(dayElement.getAttribute('day'), 10);
    const month = parseInt(document.querySelector('#monthSelect').value, 10);
    const year = parseInt(document.querySelector('#yearInput').value, 10);

    // Set mode to day view
    setViewMode('day');

    // Show the selected day
    const dayView = document.querySelector('.day-view');
    const dayViewDate = dayView.querySelector('.date');
    dayViewDate.textContent = `${month + 1}/${dayNum}/${year}`;
    
    // Render events for this day
    renderDayViewEvents(dayNum, month, year);
}

/**
 * Extend the original updateCalendarGrid function to show event indicators
 */
const originalUpdateCalendarGrid = updateCalendarGrid;
updateCalendarGrid = function() {
    originalUpdateCalendarGrid();
    renderEventIndicators();
};

/**
 * Initialize event handling
 */
function initEventHandling() {
    loadEvents();
    
    // Add click event for cells that combines both showDay and event creation
    const cells = document.querySelectorAll('.cell:not(.disabled)');
    cells.forEach(cell => {
        cell.onclick = function(e) {
            const day = parseInt(this.getAttribute('day'), 10);
            if (e.shiftKey || e.ctrlKey) {
                // Show event form when clicking with modifier key
                showEventForm(day);
                e.stopPropagation();
            } else {
                // Normal day view
                showDay(this);
            }
        };
        
        // Add double-click for event creation
        cell.ondblclick = function(e) {
            const day = parseInt(this.getAttribute('day'), 10);
            showEventForm(day);
            e.stopPropagation();
        };
    });
    
    // Add "Add Event" button to day view
    const dayViewHeader = document.querySelector('.day-view .header');
    const addEventBtn = document.createElement('button');
    addEventBtn.className = 'button add-event-btn';
    addEventBtn.textContent = 'Add Event';
    addEventBtn.onclick = function() {
        const dayText = document.querySelector('.day-view .date').textContent;
        const dateParts = dayText.split('/');
        showEventForm(parseInt(dateParts[1], 10));
    };
    dayViewHeader.appendChild(addEventBtn);
    
    // Render initial event indicators
    renderEventIndicators();
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

function getTodayEvents() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    return getEventsForDate(year, month, day);
}

function addTodayEventsToSidebar() {
    const leftSidebar = document.querySelector('.sidebar.left');
    const todayEvents = getTodayEvents();

    leftSidebar.innerHTML = ''; // Clear existing content
    const todayEventsContainer = document.createElement('div');
    todayEventsContainer.className = 'today-events';
    todayEventsContainer.innerHTML = '<h2>Today\'s Events</h2>';
    if (todayEvents.length === 0) {
        todayEventsContainer.innerHTML += '<p>No events for today.</p>';
    } else {
        todayEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.textContent = `${event.time || 'All day'}: ${event.title}`;
            todayEventsContainer.appendChild(eventItem);
        });
    }
    leftSidebar.appendChild(todayEventsContainer);
}
