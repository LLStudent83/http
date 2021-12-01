/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import PopUp from './modules/pop_up/pop_up';
import HelpDesk from './modules/desk/desk';
import Ticket from './modules/ticket/ticket';

const ticket = new Ticket();
const pop_up = new PopUp('container', ticket);
const helpDesk = new HelpDesk(pop_up);

export default pop_up;
