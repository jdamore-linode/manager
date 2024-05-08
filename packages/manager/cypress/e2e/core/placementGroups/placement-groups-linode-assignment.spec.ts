import {
  accountFactory,
  linodeFactory,
  placementGroupFactory,
  regionFactory,
} from 'src/factories';
import { mockGetAccount } from 'support/intercepts/account';
import {
  mockAppendFeatureFlags,
  mockGetFeatureFlagClientstream,
} from 'support/intercepts/feature-flags';
import {
  mockGetLinodeDetails,
  mockGetLinodes,
} from 'support/intercepts/linodes';
import {
  mockAssignPlacementGroupLinodes,
  mockAssignPlacementGroupLinodesError,
  mockGetPlacementGroup,
  mockGetPlacementGroups,
  mockUnassignPlacementGroupLinodes,
  mockUnassignPlacementGroupLinodesError,
} from 'support/intercepts/placement-groups';
import { mockGetRegions } from 'support/intercepts/regions';
import { ui } from 'support/ui';
import { buildArray } from 'support/util/arrays';
import { makeFeatureFlagData } from 'support/util/feature-flags';
import { randomLabel, randomNumber } from 'support/util/random';
import { chooseRegion } from 'support/util/regions';

import type { Linode } from '@linode/api-v4';
import type { Flags } from 'src/featureFlags';

const mockAccount = accountFactory.build();

const mockRegions = regionFactory.buildList(10, {
  capabilities: [
    'Linodes',
    'NodeBalancers',
    'Block Storage',
    'Object Storage',
    'Kubernetes',
    'Cloud Firewall',
    'Placement Group',
    'Vlans',
    'Premium Plans',
  ],
  placement_group_limits: {
    maximum_linodes_per_pg: 10,
    maximum_pgs_per_customer: 5,
  },
});

describe('Placement Groups Linode assignment', () => {
  // Mock the VM Placement Groups feature flag to be enabled for each test in this block.
  // TODO Remove these mocks when `placementGroups` feature flag is retired.
  beforeEach(() => {
    mockAppendFeatureFlags({
      placementGroups: makeFeatureFlagData<Flags['placementGroups']>({
        beta: true,
        enabled: true,
      }),
    });
    mockGetFeatureFlagClientstream();
    mockGetAccount(mockAccount).as('getAccount');
  });

  /*
   * - Confirms Placement Group Linode assignment UI flow using mock API data.
   * - Confirms that no Linodes are listed when Placement Group has no assigned Linodes.
   * - Confirms that Cloud handles API errors gracefully upon failed Linode assignment.
   * - Confirms that Placement Group details page updates its content upon successful assignment.
   * - Confirms that assigned Linode is listed and clicking its label navigates to its details page.
   */
  it('can assign a Linode', () => {
    const mockPlacementGroupRegion = chooseRegion({ regions: mockRegions });

    const mockLinodes = buildArray(5, (i) => {
      return linodeFactory.build({
        id: randomNumber(i * 100, i * 100 + 50),
        label: randomLabel(),
        region: mockPlacementGroupRegion.id,
        status: 'running',
      });
    });

    const mockLinode = mockLinodes[0];

    const mockPlacementGroup = placementGroupFactory.build({
      label: randomLabel(),
      region: mockPlacementGroupRegion.id,
      members: [],
      is_compliant: true,
    });

    const mockPlacementGroupWithLinode = {
      ...mockPlacementGroup,
      members: [{ is_compliant: true, linode_id: mockLinode.id }],
    };

    mockGetRegions(mockRegions);
    mockGetLinodes(mockLinodes);
    mockGetLinodeDetails(mockLinode.id, mockLinode);
    mockGetPlacementGroups([mockPlacementGroup]);
    mockGetPlacementGroup(mockPlacementGroup).as('getPlacementGroup');

    cy.visitWithLogin(`/placement-groups/${mockPlacementGroup.id}`);
    cy.wait('@getPlacementGroup');

    // Confirm that no assigned Linodes are listed for the Placement Group, then
    // click the assignment button.
    cy.findByText('0 of 10').should('be.visible');
    cy.findByText('No data to display.').should('be.visible');

    ui.button
      .findByTitle('Assign Linode to Placement Group')
      .should('be.visible')
      .should('be.enabled')
      .click();

    // Fill out assignment form and click submit.
    mockGetPlacementGroup(mockPlacementGroupWithLinode).as('getPlacementGroup');
    mockAssignPlacementGroupLinodesError(mockPlacementGroup.id).as(
      'assignLinode'
    );
    ui.drawer
      .findByTitle(
        `Assign Linodes to Placement Group ${mockPlacementGroup.label}`
      )
      .should('be.visible')
      .within(() => {
        // Confirm that Assign button is disabled before selecting Linode.
        ui.button
          .findByTitle('Assign Linode')
          .should('be.visible')
          .should('be.disabled');

        cy.findByLabelText(
          `Linodes in ${mockPlacementGroupRegion.label} (${mockPlacementGroupRegion.id})`
        ).type(mockLinode.label);

        ui.select.findItemByText(mockLinode.label).should('be.visible').click();

        ui.button.findByTitle('Assign Linode').should('be.enabled').click();

        // Confirm that initial attempt error message is displayed to the user.
        // Then re-submit with a successful response.
        cy.findByText('An error has occurred').should('be.visible');
        mockAssignPlacementGroupLinodes(
          mockPlacementGroup.id,
          mockPlacementGroup
        ).as('assignLinode');

        cy.findByLabelText(
          `Linodes in ${mockPlacementGroupRegion.label} (${mockPlacementGroupRegion.id})`
        ).type(`${mockLinode.label}`);

        ui.select.findItemByText(mockLinode.label).should('be.visible').click();

        ui.button.findByTitle('Assign Linode').click();
      });

    // Confirm that outgoing assignment API request includes the correct Linode.
    cy.wait('@assignLinode').then((xhr) => {
      const requestBody = xhr.request?.body;
      expect(requestBody['linodes'][0]).to.equal(mockLinode.id);
    });

    // Confirm that UI responds by showing toast notification, displaying the assigned
    // Linode in the list, and confirm that clicking the Linode navigates to its
    // details page.
    ui.toast.assertMessage(`Linode ${mockLinode.label} successfully assigned.`);
    cy.findByText('1 of 10').should('be.visible');
    cy.findByText(mockLinode.label)
      .should('be.visible')
      .closest('tr')
      .within(() => {
        cy.findByText('Running');
        cy.findByText(mockLinode.label).click();
      });

    cy.url().should('endWith', `/linodes/${mockLinode.id}`);
  });

  /*
   * - Confirms Placement Group Linode unassign UI flow using mock API data.
   * - Confirms that attached Linodes are listed on Placement Group details page.
   * - Confirms that Cloud handles API errors gracefully upon failed unassignment.
   * - Confirms that Placement Group details page updates its content upon successful assignment.
   */
  it('can unassign a Linode', () => {
    const mockPlacementGroupRegion = chooseRegion({ regions: mockRegions });

    const mockLinodes = buildArray(2, (i) => {
      return linodeFactory.build({
        id: randomNumber(i * 100, i * 100 + 50),
        label: randomLabel(),
        region: mockPlacementGroupRegion.id,
        status: 'running',
      });
    });

    const mockLinodeUnassigned = mockLinodes[0];
    const mockLinodeRemaining = mockLinodes[1];

    const mockPlacementGroup = placementGroupFactory.build({
      label: randomLabel(),
      region: mockPlacementGroupRegion.id,
      members: mockLinodes.map((linode: Linode) => ({
        linode_id: linode.id,
        is_compliant: true,
      })),
      is_compliant: true,
    });

    const mockPlacementGroupAfterUnassignment = {
      ...mockPlacementGroup,
      members: [{ linode_id: mockLinodeRemaining.id, is_compliant: true }],
    };

    mockGetRegions(mockRegions);
    mockGetLinodes(mockLinodes);
    mockGetPlacementGroups([mockPlacementGroup]);
    mockGetPlacementGroup(mockPlacementGroup).as('getPlacementGroup');

    cy.visitWithLogin(`/placement-groups/${mockPlacementGroup.id}`);
    cy.wait('@getPlacementGroup');

    // Confirm that both assigned Linodes are listed.
    cy.findByText('2 of 10').should('be.visible');
    mockLinodes.forEach((linode: Linode) => {
      cy.findByText(linode.label).should('be.visible');
    });

    // Unassign the first Linode.
    cy.findByText(mockLinodeUnassigned.label)
      .should('be.visible')
      .closest('tr')
      .within(() => {
        ui.button.findByTitle('Unassign').should('be.enabled').click();
      });

    mockUnassignPlacementGroupLinodesError(mockPlacementGroup.id).as(
      'unassignLinode'
    );
    mockGetPlacementGroup(mockPlacementGroupAfterUnassignment).as(
      'getPlacementGroup'
    );
    ui.dialog
      .findByTitle(`Unassign ${mockLinodeUnassigned.label}`)
      .should('be.visible')
      .within(() => {
        // On first attempt, mock an HTTP error and confirm that Cloud handles
        // it by displaying its message.
        ui.button
          .findByTitle('Unassign')
          .should('be.visible')
          .should('be.enabled')
          .click();

        cy.findByText('An error has occurred').should('be.visible');

        // Confirm again with a successful response mocked.
        mockUnassignPlacementGroupLinodes(
          mockPlacementGroup.id,
          mockPlacementGroupAfterUnassignment
        ).as('unassignLinode');
        ui.button.findByTitle('Unassign').click();
      });

    // Confirm that outgoing unassignment API request contains expected payload data.
    cy.wait('@unassignLinode').then((xhr) => {
      const requestBody = xhr.request?.body;
      expect(requestBody['linodes'][0]).to.equal(mockLinodeUnassigned.id);
    });

    ui.toast.assertMessage(
      `Linode ${mockLinodeUnassigned.label} successfully unassigned.`
    );

    // Confirm that unassigned Linode is removed from list while other Linode remains.
    cy.findByText('2 of 10').should('not.exist');
    cy.findByText('1 of 10').should('be.visible');

    cy.findByText(mockLinodeUnassigned.label).should('not.exist');
    cy.findByText(mockLinodeRemaining.label).should('be.visible');
  });
});
