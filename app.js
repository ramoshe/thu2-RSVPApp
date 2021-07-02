document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  
  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');
  
  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');

  //LocalStorage - load and save
  if (localStorage.length > 0) {
    ul.innerHTML = localStorage.getItem('savedList')
  }
  function saveToLocalStorage() {
    localStorage.setItem('savedList', ul.innerHTML);
    console.log(localStorage);
  };
  
  //add the filter for respondents to the page
  filterLabel.textContent = "Hide those who haven't responded";
  filterCheckBox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckBox);
  mainDiv.insertBefore(div, ul);
  
  //handler for filter
  filterCheckBox.addEventListener('change', (e) => {
    const list = Array.from(ul.children);
    if(e.target.checked) {
      list.forEach(li => {
        (li.className === 'responded') ? (li.style.display = '') : (li.style.display = 'none');
        let label = li.querySelector('label');
        label.style.display = 'none';
      });
    } else {
      list.forEach(li => {
        li.style.display = '';
        let label = li.querySelector('label');
        label.style.display = '';
      });                                
    }
  });
  
  //function that turns form input into an atendee card (list item)
  function createLI(text) {
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);  
      element[property] = value; 
      return element;
    }
    function appendToLI(elementName, property, value) {
      const element = createElement(elementName, property, value);     
      li.appendChild(element); 
      return element;
    }
    const li = document.createElement('li');
    appendToLI('span', 'textContent', text); 

    //add a notes paragraph and set styling
    const notes = document.createElement('span');
    notes.style.fontSize = '.9em';
    notes.style.padding = '.5em';
    notes.textContent = 'Notes: ';
    li.appendChild(notes);

    appendToLI('label', 'textContent', 'Confirm')
      .appendChild(createElement('input', 'type', 'checkbox'));

    //add a select for not attending
    li.appendChild(createElement('br'));
    const notAttending = document.createElement('select');
      notAttending.name = 'notAttending';
      li.appendChild(notAttending);
    const option1 = document.createElement('option');
      option1.textContent = 'Attending?';
      option1.value = 'maybe';
      notAttending.appendChild(option1);
    const option2 = document.createElement('option');
      option2.textContent = 'Not Attending';
      option2.value = 'no';
      notAttending.appendChild(option2);
    li.appendChild(createElement('br'));

    appendToLI('button', 'textContent', 'edit');
    appendToLI('button', 'textContent', 'remove');
        
    return li;
  }
  
  //event handler for submit button
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    
    if (text === '') {
      alert('Please enter the name of the invitee');
    } else {
      input.value = '';
      const li = createLI(text);
      ul.appendChild(li);

      //reject if name is already on list
      const names = [];
      const list = Array.from(ul.children);
      for (let i=0; i<list.length; i++) {
        names[i] = list[i].firstElementChild.textContent;
      }

      for (let i=0; i<list.length-1; i++) {
        if (names[i] === text) {
          alert(`${text} is already on the list`);
          ul.removeChild(li);
        }
      } 
    }
    saveToLocalStorage();
  });

  //event handler for confirmed checkbox on invitee card (list item)
  ul.addEventListener('change', (e) => {
    if (e.target.tagName === 'INPUT') {
      const checkbox = e.target;
      const listItem = checkbox.parentNode.parentNode;
      
      if (checkbox.checked) {
        listItem.className = 'responded';
        checkbox.previousSibling.textContent = 'Confirmed';
        checkbox.setAttribute('checked', '');
      } else {
        listItem.className = '';
        checkbox.previousSibling.textContent = 'Confirm';
        checkbox.removeAttribute('checked');
      }
    }

  //event handler for submit select on invitee card (list item)  
    if (e.target.tagName === 'SELECT') {
      const select = e.target;
      const listItem = select.parentNode;

      console.log(select.firstElementChild);
      console.log(select.lastElementChild);

      if (select.value === 'no') {
        listItem.style.backgroundColor = 'gainsboro';
        select.firstElementChild.removeAttribute('selected', '');
        select.lastElementChild.setAttribute('selected', '');
      }
      if (select.value === 'maybe') {
        listItem.style.backgroundColor = 'white';
        select.firstElementChild.setAttribute('selected', '');
        select.lastElementChild.removeAttribute('selected', '');
      }
    }
    saveToLocalStorage();
  });

  //event handler for the other buttons on the invitee card (list item)
  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      const action = button.textContent;
      const nameActions = {
        remove: () => {
          ul.removeChild(li);
        },
        edit: () => {
          const span = li.firstElementChild;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = span.textContent;
          li.insertBefore(input, span);
          li.removeChild(span);

          const notes = input.nextElementSibling;
          const notesInput = document.createElement('textarea');
          notesInput.value = notes.textContent;
          li.insertBefore(notesInput, notes);
          li.removeChild(notes);

          button.textContent = 'save';  
        },
        save: () => {
          const input = li.firstElementChild;
          const span = document.createElement('span');
          span.textContent = input.value;
          li.insertBefore(span, input);
          li.removeChild(input);
          
          const notesInput = span.nextElementSibling;
          const notes = document.createElement('span');
          notes.textContent = notesInput.value;
          notes.style.fontSize = '.9em';
          notes.style.padding = '.5em';
          li.insertBefore(notes, notesInput);
          li.removeChild(notesInput);

          button.textContent = 'edit';  
        }
      };
      // select and run action in button's name
      nameActions[action]();
      saveToLocalStorage();
    }
  });
});
