import { Domain } from '@linode/api-v4/types';
import { domainFactory } from '@src/factories';
import { fbtClick, getClick, getVisible } from 'support/helpers';
import {
  interceptCreateDomain,
  mockGetDomains,
} from 'support/intercepts/domains';
import { randomDomainName } from 'support/util/random';
import { ui } from 'support/ui';

describe('Create a Domain', () => {
  it('Creates first Domain', () => {
    const mockDomains = domainFactory.buildList(2);
    const newDomainLabel = randomDomainName();

    mockGetDomains(mockDomains).as('getDomains');
    interceptCreateDomain().as('createDomain');

    cy.visitWithLogin('/domains');
    cy.wait('@getDomains');

    ui.button
      .findByTitle('Create Domain')
      .should('be.visible')
      .should('be.enabled')
      .click();

    // fbtClick('Create Domain');
    getVisible('[id="domain"][data-testid="textfield-input"]').type(
      newDomainLabel
    );
    getVisible('[id="soa-email-address"][data-testid="textfield-input"]').type(
      'devs@linode.com'
    );
    getClick('[data-testid="submit"]');
    cy.wait('@createDomain');
    cy.get('[data-qa-header]').should('contain', newDomainLabel);
  });
});
