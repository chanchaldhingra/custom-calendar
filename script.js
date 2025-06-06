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
const monthDropdownContainerEle = document.getElementById('monthDropdown');
const monthNames = ['Jan', 'Feb', 'Mar', 'Ap', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
    const spanEle = document.createElement('span');
    spanEle.classList.add('month-number');
    spanEle.textContent = monthNames[i-1];
    monthSquare.appendChild(spanEle);
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
  let month = 0;
  try {
    month = Number(monthSelect.value) ?? dt.getMonth();
  } catch(e) {
    month = dt.getMonth();
  }
  let year = Number(yearSelect.value) || dt.getFullYear();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
  calendarMonth.innerHTML = '';
  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const dayString = formatDate(new Date(year, month, i- paddingDays));
      const eventForDay = events.filter(e => e.date.includes(dayString));
      const todayDate = new Date();
      const todayYear = todayDate.getFullYear();
      const todayMonth = todayDate.getMonth();
      const todayDay = todayDate.getDate();
      if(year === todayYear && month === todayMonth && i - paddingDays === todayDay) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay.length > 0) {
        eventForDay.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = event.title;
          eventDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(event.date, false, event.id);
          });
          daySquare.appendChild(eventDiv);
        });
      }

      daySquare.addEventListener('click', () => openModal(dayString, true));
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
    loadMonthView();
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
  monthDropdownContainerEle.style.display = 'none';
  calendarYear.style.display = 'flex';
  calendarMonth.style.display = 'none';
  monthViewBtn.classList.remove('btn-active');
  yearViewBtn.classList.add('btn-active');
  weekdaysEle.style.display = 'none';
  loadYearView();
  activeView = 'year';
}

function showMonthView() {
  monthDropdownContainerEle.style.display = 'block';
  calendarYear.style.display = 'none';
  calendarMonth.style.display = 'grid';
  monthViewBtn.classList.add('btn-active');
  yearViewBtn.classList.remove('btn-active');
  weekdaysEle.style.display = 'grid';
  showMonthDropdown();
  loadMonthView();
  activeView = 'month';
}

function initButtons() {
  yearSelect.addEventListener('change', (e) => {
    loadYearView();
  });

  monthSelect.addEventListener('change', (e) => {
    loadMonthView();
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
