// import PopUp from '../pop_up/pop_up';

export default class HelpDesk {
  constructor(popUp) {
    this.popUp = popUp;
    this.container = document.getElementsByClassName('container');
    this.init();
  }

  init() {
    const buttonsChangeTicket = document.querySelectorAll('.buttonChangeTicket');
    for (const element of buttonsChangeTicket) {
      element.addEventListener('click', (event) => this.onClick(event));
    }
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
