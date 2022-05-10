import { getAll, isTestEntity } from './common';
import { getOauthToken } from './authentication';

const oauthtoken = getOauthToken();

export const getTickets = () => getAll('support/tickets');

export const deleteTicketById = (ticketId: number) => {
  return cy.request({
    method: 'POST',
    url:
      Cypress.env('REACT_APP_API_ROOT') + `/support/tickets/${ticketId}/close`,
    auth: {
      bearer: oauthtoken,
    },
  });
};

export const deleteAllTestTickets = () => {
  getTickets().then((resp) => {
    resp.body.data.forEach((ticket) => {
      if (isTestEntity(ticket) && ticket.closable) {
        deleteTicketById(ticket.id);
      }
    });
  });
};
