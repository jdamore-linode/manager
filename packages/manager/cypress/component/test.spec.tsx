import * as React from 'react';
import { BetaChip } from 'src/components/BetaChip/BetaChip';
// import App from './App'

it('renders learn react link', () => {
  cy.mountWithTheme(<BetaChip />);
  cy.findByText('beta').should('be.visible');
  // cy.mount(<BetaChip />);
  // cy.findByText('beta').should('be.visible');
  // cy.get('a').contains('Learn React')
});
