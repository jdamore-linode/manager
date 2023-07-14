import { describeRegions } from 'support/util/regions';
import { interceptGetVolumes } from 'support/intercepts/volumes';
import { authenticate } from 'support/api/authentication';
import { createVolume } from '@linode/api-v4';
import { volumeRequestPayloadFactory } from '@src/factories';
import type { Volume, Region } from '@linode/api-v4';
import { randomLabel } from 'support/util/random';
import { pollVolumeStatus } from 'support/util/polling';
import { ui } from 'support/ui';

authenticate();
describeRegions('Volume delete tests', (region: Region) => {
  it('can delete a Volume', () => {
    const volumePayload = volumeRequestPayloadFactory.build({
      label: randomLabel(),
      region: region.id,
    });

    interceptGetVolumes().as('getVolumes');

    const createVolumeAndWaitForActive = async () => {
      const volume = await createVolume(volumePayload);
      await pollVolumeStatus(volume.id, 'active');
      return volume;
    };

    cy.defer(createVolumeAndWaitForActive()).then((volume: Volume) => {
      cy.visitWithLogin('/volumes');
      cy.wait('@getVolumes');

      cy.findByText(volume.label)
        .closest('tr')
        .within(() => {
          ui.actionMenu
            .findByTitle(`Action menu for Volume ${volume.label}`)
            .should('be.visible')
            .click();
        });

      ui.actionMenuItem.findByTitle('Delete').should('be.visible').click();

      ui.dialog
        .findByTitle(`Delete Volume ${volume.label}?`)
        .should('be.visible')
        .within(() => {
          cy.findByLabelText('Volume Label')
            .should('be.visible')
            .click()
            .type(volume.label);

          ui.button
            .findByTitle('Delete')
            .should('be.visible')
            .should('be.enabled')
            .click();
        });

      ui.toast.assertMessage('Volume successfully deleted.');
      cy.findByText(volume.label).should('not.exist');
    });
  });
});
