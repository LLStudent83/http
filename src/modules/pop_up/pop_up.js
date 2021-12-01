import createRequest from '../http/createRequest';

export default class PopUp {
  constructor(container, ticket) {
    if (typeof container === 'string') {
      this.container = document.querySelector('.container');
    } else this.container = container;
    this.ticket = ticket;
  }

  getHTMLPopUp(Issuer, short = '', full = '') { // аргумент это класс кнопки
    const labelsPopUp = `<p>
      <label class="form_nameInput" for="description">
      Краткое описание
      </label>
        <textarea class="form_input" type="text" id="description" name='short'>${short}</textarea>
      </p>
    <p>
      <label class="form_nameInput" for="content">
      Подробное описание
      </label>
      <textarea class="form_input form_inputDetail" type="text" id="content" name='full'>${full}</textarea>
    </p>`;
    const textDeleteTicket = `
      <span class="messageTextDelete">
        Вы уверены, что хотите удалить тикет? Это
        действительно необходимо?
      </span>`;
    if (Issuer === 'addTicket') {
      this.title = 'Добавить тикет';
      this.className = 'addTicket';
      this.section = labelsPopUp;
    }
    if (Issuer === 'changeTicket') {
      this.title = 'Изменить тикет';
      this.className = 'changeTicket';
      this.section = labelsPopUp;
    }
    if (Issuer === 'deleteTicket') {
      this.title = 'Удалить тикет';
      this.className = 'deleteTicket';
      this.section = textDeleteTicket;
    }
    const HTML = `
        <form class="form ${this.className}" action="">
          <h1 class="form_Name">${this.title}</h1>
          ${this.section}
          <footer class="form_footer">
            <button type="button" class="form_cancell button">Отмена</button>
            <button type="submit" class="form_submitBt button">Ok</button>
          </footer>
        </form>
    `;
    return HTML;
  }

  renderingPopUp(Issuer, short = '', full = '') {
    const containerForm = document.createElement('div');
    containerForm.className = 'popup';
    this.container.append(containerForm);
    containerForm.innerHTML = this.getHTMLPopUp(Issuer, short, full);
    const popUpButtons = containerForm.querySelectorAll('button');
    for (const element of popUpButtons) {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        this.onClickPopUp(event);
      });
    }
  }

  onClickPopUp(event) {
    const { target } = event;
    if (target.classList.contains('form_cancell')) this.closepopUp();
    if (target.classList.contains('form_submitBt')) this.ticket.processingEventSubmit(event);
  }

  // eslint-disable-next-line class-methods-use-this
  closepopUp() {
    document.querySelector('.popup').remove();
  }
}
