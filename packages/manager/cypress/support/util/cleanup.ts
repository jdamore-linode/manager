/**
 * @file Utilities to faciliate test data cleanup.
 */

import { deleteAllTestDomains } from 'support/api/domains';

export const cleanUpTestDomains = () =>
  cy.defer(deleteAllTestDomains(), 'cleaning up test domains');
