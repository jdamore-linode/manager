/**
 * @file Volume create tests.
 */

import { describeRegions } from 'support/util/regions';
import { randomLabel, randomString } from 'support/util/random';
import { ui } from 'support/ui';
import type { Region, Linode } from '@linode/api-v4';
import { interceptCreateVolume } from 'support/intercepts/volumes';
import { volumeRequestPayloadFactory } from '@src/factories';
import { createLinode } from '@linode/api-v4';
import { createLinodeRequestFactory } from '@src/factories';
import { authenticate } from 'support/api/authentication';

authenticate();
describeRegions('Volume Create', (region: Region) => {
  it('Can create a Volume without a Linode', () => {
    const label = randomLabel();
    interceptCreateVolume().as('createVolume');

    cy.visitWithLogin('/volumes/create');
    cy.get('[data-qa-textfield-label="Label"]')
      .should('be.visible')
      .click()
      .type(label);

    cy.findByText('Select a Region').should('be.visible').click();

    ui.regionSelect.findItemByRegionId(region.id).should('be.visible').click();

    ui.button
      .findByTitle('Create Volume')
      .should('be.visible')
      .should('be.enabled')
      .click();

    cy.wait('@createVolume');
    cy.url().should('endWith', '/volumes');

    ui.drawer
      .findByTitle('Volume Configuration')
      .should('be.visible')
      .within(() => {
        cy.findByText('Volume scheduled for creation.').should('be.visible');
        ui.drawerCloseButton.find().should('be.visible').click();
      });

    cy.findByText(label).should('be.visible');
    ui.toast.assertMessage(`Volume ${label} successfully created.`);
  });

  it('Can create a Volume attached to a Linode', () => {
    const linodePayload = createLinodeRequestFactory.build({
      label: randomLabel(),
      region: region.id,
      root_password: randomString(32),
    });

    const volumeLabel = randomLabel();

    cy.defer(createLinode(linodePayload), 'creating Linode').then(
      (linode: Linode) => {
        interceptCreateVolume().as('createVolume');
        cy.visitWithLogin('/volumes/create');
        cy.get('[data-qa-textfield-label="Label"]')
          .should('be.visible')
          .click()
          .type(volumeLabel);

        cy.findByText('Select a Region').should('be.visible').click();

        ui.regionSelect
          .findItemByRegionId(region.id)
          .should('be.visible')
          .click();

        cy.findByText('Select a Linode')
          .should('be.visible')
          .click()
          .type(linode.label);

        ui.autocompletePopper
          .findByTitle(linode.label)
          .should('be.visible')
          .click();

        ui.button
          .findByTitle('Create Volume')
          .should('be.visible')
          .should('be.enabled')
          .click();

        cy.wait('@createVolume');
        cy.url().should('endWith', '/volumes');

        ui.drawer
          .findByTitle('Volume Configuration')
          .should('be.visible')
          .within(() => {
            cy.findByText('Volume scheduled for creation.').should(
              'be.visible'
            );
            ui.drawerCloseButton.find().should('be.visible').click();
          });

        cy.findByText(volumeLabel)
          .should('be.visible')
          .closest('tr')
          .within(() => {
            cy.findByText(linode.label).should('be.visible');
          });

        ui.toast.assertMessage(`Volume ${volumeLabel} successfully created.`);
      }
    );
  });
});
