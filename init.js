// Run initialization after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initEventHandling());

// Initialize the grid
const holidays = holidayMap();
const today = new Date();
const todayEvents = getTodayEvents(today);
document.querySelector('#yearInput').value = today.getFullYear();
document.querySelector('#monthSelect').value = today.getMonth();
createGrid();
updateCalendarGrid();
addTodayEventsToSidebar();
setViewMode('month');
