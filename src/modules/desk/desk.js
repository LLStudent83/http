import createRequest from '../http/createRequest';

export default class HelpDesk {
  constructor(popUp, ticket) {
    this.ticket = ticket;
    this.popUp = popUp;
    this.container = document.getElementsByClassName('container');
    this.init();
  }

  init() {
    const buttonsChangeTicket = document.querySelectorAll('.buttonChangeTicket');
    for (const element of buttonsChangeTicket) {
      element.addEventListener('click', (event) => this.onClick(event));
    }
    this.renderingTickets();
  }

  renderingTickets() {
    createRequest('GET', null, 'allTickets', null, null, (xhr) => {
      const arrTickets = JSON.parse(xhr.response);
      for (const ticket of arrTickets) {
        const ticketString = JSON.stringify(ticket);
        const ticketHTML = this.ticket.createHTMLTicket(ticketString);
        this.ticket.renderingTicket(ticketHTML, 'new');
      }
    });
  }

  onClick(event) {
    const { target } = event;
    if (target === document.getElementById('addTicket')) this.onAddTicket('addTicket');
    event.stopPropagation();
  }

  onAddTicket(Issuer) {
    this.popUp.renderingPopUp(Issuer);
  }
}
