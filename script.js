let clickedId = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let uniqueEventId = 1;
let activeView = 'year';
const calendarYear = document.getElementById('calendar-year-view');
const calendarMonth = document.getElementById('calendar-month-view');
const monthViewBtn = document.getElementById('monthViewBtn');
const yearViewBtn = document.getElementById('yearViewBtn');
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventDateInput = document.getElementById('eventDateInput');
const saveModalBtn = document.getElementById('saveButton');
const cancelModalBtn = document.getElementById('cancelButton');
const deleteModalBtn = document.getElementById('deleteButton');
const weekdaysEle = document.getElementById('weekdays');
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openModal(dateString, newEvent=true, uniqueId = null) {
  const [year, month, day] = dateString.split('-').map(Number);
  let minDate = '';
  let maxDate = '';
  if (month === 12) {
    minDate = new Date(year, 11, 1);
    maxDate = new Date(year, 12, 0);
  }
  else {
    minDate = new Date(year, month-1, 1);
    maxDate = new Date(year, month, 0);
  }
  eventDateInput.min = formatDate(minDate);
  eventDateInput.max = formatDate(maxDate);
  eventDateInput.value = new Date(year, month, 1);
  newEventModal.style.display = 'block';
  backDrop.style.display = 'block';
  if(newEvent) {
    disableSaveButton();
    eventTitleInput.value = '';
    eventDateInput.value = '';
    clickedId = null;
  }
  else {
    enableSaveButton();
    const eventForDay = events.find(e => e.date === dateString);
    if (eventForDay) {
      eventDateInput.value = eventForDay.date;
      eventTitleInput.value = eventForDay.title;
      clickedId = uniqueId;
    }
  } 
}

function enableSaveButton() {
  saveModalBtn.disabled = false;
  saveModalBtn.classList.remove('disabled');
}

function disableSaveButton() {
  saveModalBtn.disabled = true;
  saveModalBtn.classList.add('disabled');
}

function formatDate (dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadYearView() {
  const dt = new Date();
  let year = Number(yearSelect.value) || dt.getFullYear();
  document.getElementById('yearSelect').value = `${year}`;
  calendarYear.innerHTML = '';

  for(let i=1;i<=12;i++)  {
    const monthSquare = document.createElement('div');
    monthSquare.textContent = monthNames[i-1];
    const dateString = `${year}-${String(i).padStart(2, '0')}`;
    const eventForMonth = events.filter(e => e.date.includes(dateString));
    if (eventForMonth.length > 0) {
      eventForMonth.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = event.title;
        eventDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(event.date, false, event.id);
        });
        monthSquare.appendChild(eventDiv);
      });
      
    }
    monthSquare.addEventListener('click', () => openModal(dateString, true));
    calendarYear.appendChild(monthSquare);
  }
}

function loadMonthView() {
  const dt = new Date();
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendarMonth.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendarMonth.appendChild(daySquare);    
  }
}


function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clickedId = null;
  if (activeView === 'year') {
    loadYearView();
  }
  else {
    // Load month view logic here
  }
}

function saveEvent() {
  if (!clickedId) {
    events.push({
      date: eventDateInput.value,
      title: eventTitleInput.value,
      id: uniqueEventId++
    });
  }
  else {
    const index = events.findIndex(e => e.id === clickedId);
    events[index].title = eventTitleInput.value;
    events[index].date = eventDateInput.value;
  }
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function deleteEvent() {
  events = events.filter(e => e.id !== clickedId);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function toggleSaveBtn() {
  if (eventTitleInput.value.trim() !== '' && eventDateInput.value) {
    enableSaveButton();
  } else {
    disableSaveButton();
  }
}

function showYearView() {
  calendarYear.style.display = 'block';
  calendarMonth.style.display = 'none';
  monthViewBtn.classList.remove('btn-active');
  yearViewBtn.classList.add('btn-active');
  weekdaysEle.style.display = 'none';
  loadYearView();
  activeView = 'year';
}

function showMonthView() {
  calendarYear.style.display = 'none';
  calendarMonth.style.display = 'block';
  monthViewBtn.classList.add('btn-active');
  yearViewBtn.classList.remove('btn-active');
  weekdaysEle.style.display = 'block';
  // Load month view logic here if needed
  activeView = 'month';
}

function initButtons() {
  yearSelect.addEventListener('change', (e) => {
    loadYearView();
  });

  eventDateInput.addEventListener('change', (e) => {
    toggleSaveBtn();
  });
  eventTitleInput.addEventListener('input', (e) => {
    toggleSaveBtn();
  });

  monthViewBtn.addEventListener('click', (e) => {
    showMonthView();
  });

  yearViewBtn.addEventListener('click', (e) => {
    showYearView();
  });

  saveModalBtn.addEventListener('click', saveEvent);
  cancelModalBtn.addEventListener('click', closeModal);
  deleteModalBtn.addEventListener('click', deleteEvent);
}

initButtons();
showYearView();
