let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function openModal(monthString) {
  clicked = monthString;
  newEventModal.style.display = 'block';
  backDrop.style.display = 'block';
}

function load() {
  const dt = new Date();
  let year = dt.getFullYear();

  if (nav !== 0) {
    year = year+nav;
  }

  const month = dt.getMonth();

  document.getElementById('yearDisplay').textContent = `${year}`;
  calendar.innerHTML = '';

  for(let i=1;i<=12;i++)  {
    const monthSquare = document.createElement('div');
    monthSquare.textContent = weekdays[i-1];
    const monthString = `${i}/${year}`;
    const eventForMonth = events.filter(e => e.date === monthString);
    if (eventForMonth.length > 0) {
      eventForMonth.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = event.title;
        monthSquare.appendChild(eventDiv);
      });
      
    }
    monthSquare.addEventListener('click', () => openModal(monthString));
    calendar.appendChild(monthSquare);

  }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();
