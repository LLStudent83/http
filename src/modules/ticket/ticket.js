// eslint-disable-next-line import/no-cycle
import popUp from '../../app';
import createRequest from '../http/createRequest';

export default class Ticket {
  constructor() {
    this.contaner = document.querySelector('.tickets');
    this.addEvents();
  }

  // eslint-disable-next-line class-methods-use-this
  createHTMLTicket(data) { // добвить класс done
    const dataTicket = JSON.parse(data);
    // eslint-disable-next-line prefer-const
    let { name, id, status } = dataTicket;
    const dateCreate = dataTicket.created;
    let statusClass;
    // eslint-disable-next-line no-unused-expressions
    if (typeof status === 'string') {
      // eslint-disable-next-line no-unused-expressions
      status === 'true' ? status = true : status = false;
    }
    // eslint-disable-next-line no-unused-expressions
    status ? statusClass = 'done' : statusClass = '';
    const HTML = `
    <li class="ticket" id="${id}">
        <div class="ticketShort">
          <button class="ticketButton ticketDone ${statusClass}"></button>
          <span class="ticketName">${name}</span>
          <span class="ticketDate">${dateCreate}</span>
          <button class="ticketButton ticketChange"></button>
          <button class="ticketButton ticketDelete"></button>
        </div>  
    </li>
    `;
    return HTML;
  }

  renderingTicket(ticketHTML, sign) {
    if (sign === 'new') this.contaner.innerHTML += ticketHTML;
    if (sign === 'change') {
      const ticket = document.getElementById(this.idTicket);
      ticket.remove();
      this.contaner.innerHTML += ticketHTML;
    }
  }

  addEvents() {
    this.contaner.addEventListener('click', (event) => {
      this.handlerEvents(event);
    });
  }

  handlerEvents(event) {
    const { target } = event;
    if (target.classList.contains('ticketDone')) this.doneTrue(event);
    if (target.classList.contains('ticketName')) this.showFullName(event);
    if (target.classList.contains('ticketChange')) this.openPopUpticketChange(event);// открывает popUp
    if (target.classList.contains('ticketDelete')) this.openPopUpTicketDelete(event);
  }

  processingEventSubmit(event) {
    const { target } = event;
    const form = target.closest('.form');
    if (form.classList.contains('addTicket')) this.createTicket(event);
    if (form.classList.contains('changeTicket')) this.changeTicket(event);
    if (form.classList.contains('deleteTicket')) this.deleteTicket();
  }

  createTicket(event) {
    event.preventDefault();
    const form = document.querySelector('.form');
    popUp.closepopUp();
    createRequest('POST', form, 'createTicket', null, null, (xhr) => {
      const ticketHTML = this.createHTMLTicket(xhr.response);
      this.renderingTicket(ticketHTML, 'new');
    });
  }

  changeTicket(event) {
    event.preventDefault();
    const form = document.querySelector('.form');
    popUp.closepopUp();
    createRequest('POST', form, 'changeTicket', this.idTicket, this.ticketStatus, (xhr) => {
      const ticketHTML = this.createHTMLTicket(xhr.response);
      this.renderingTicket(ticketHTML, 'change');
    });
  }

  // eslint-disable-next-line class-methods-use-this
  doneTrue(event) {
    const { target } = event;
    target.classList.toggle('done');
    this.idTicket = target.closest('.ticket').getAttribute('id');
    // eslint-disable-next-line no-unused-expressions
    target.classList.contains('done') ? this.ticketStatus = true : this.ticketStatus = false;
    createRequest('GET', null, 'changeTicket', this.idTicket, this.ticketStatus, (xhr) => {
      // eslint-disable-next-line no-console
      console.log(xhr.response);
    });
  }

  showFullName(event) {
    const { target } = event;
    if (target.closest('.ticketShort').nextElementSibling) {
      target.closest('.ticketShort').nextElementSibling.remove();
      return;
    }
    this.idTicket = target.closest('.ticket').getAttribute('id');
    const ticket = target.closest('.ticket');
    const fullNameEl = document.createElement('div');
    fullNameEl.className = 'ticketFullName';

    createRequest('GET', null, 'ticketById', this.idTicket, null, (xhr) => {
      const response = JSON.parse(xhr.response);
      fullNameEl.innerText = response.description;
      ticket.append(fullNameEl);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  openPopUpticketChange(event) { // открывает popUp
    const { target } = event;
    this.idTicket = target.closest('.ticket').getAttribute('id');
    createRequest('GET', null, 'ticketById', this.idTicket, null, (xhr) => {
      const response = JSON.parse(xhr.response);
      this.ticketStatus = response.status;
      popUp.renderingPopUp('changeTicket', response.name, response.description);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  openPopUpTicketDelete(event) {
    const { target } = event;
    this.deleteTicketEl = target.closest('.ticket');
    popUp.renderingPopUp('deleteTicket', '', '');
  }

  // eslint-disable-next-line class-methods-use-this
  deleteTicket() {
    const idTicket = this.deleteTicketEl.getAttribute('id');
    popUp.closepopUp();
    this.deleteTicketEl.remove();
    createRequest('GET', null, 'deleteTicket', idTicket, null, (xhr) => {
      if (!xhr.response === 'OK') {
        // eslint-disable-next-line no-alert
        alert(xhr.response.error);
      }
    });
  }
}
