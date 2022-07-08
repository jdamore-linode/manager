import { DateTime } from 'luxon';
import { UserPreferences } from '@linode/api-v4/lib/profile/types';
import {
  mockCommonRequests,
  CommonRequestMockOptions,
} from 'support/intercepts/common';

// handles login authorization and visits specified url
const oauthtoken = Cypress.env('MANAGER_OAUTH');
const _loginWithToken = (win) => {
  win.localStorage.setItem('authentication/oauth-token', oauthtoken);
  win.localStorage.setItem('authentication/scopes', '*');
  // cy.log(window.localStorage.getItem('authentication/oauth-token'));
  const expireDate = DateTime.local().plus({ days: 30 });
  const isoExpire = expireDate.toISO();
  // cy.log(isoExpire);
  win.localStorage.setItem('authentication/expires', isoExpire);
  win.localStorage.setItem('authentication/expire-datetime', isoExpire);
  win.localStorage.setItem('authentication/token', 'Bearer ' + oauthtoken);
  win.localStorage.setItem('authentication/expire', isoExpire);
};

export interface LinodeVisitOptions {
  /**
   * Whether or not to mock common Linode API requests.
   *
   * If `true`, mocks are enabled with default options. If a
   * `CommonRequestMockOptions` object is passed, mocks are enabled with the
   * provided options. Otherwise (e.g. `false` or `undefined`) mocks are disabld.
   *
   * @var {boolean | CommonRequestMockOptions | undefined}
   */
  mockRequests?: boolean | CommonRequestMockOptions;

  /**
   * User preference overrides.
   *
   * The given object will override the specific user preferences fetched by
   * Cloud Manager without mocking the preferences altogether.
   *
   * If `undefined` is passed, preference overriding will be disabled.
   *
   * @var {UserPreferences | undefined}
   */
  preferenceOverrides?: UserPreferences;
}

Cypress.Commands.add(
  'visitWithLogin',
  (url: string, linodeOptions?: LinodeVisitOptions, cypressOptions?: any) => {
    const defaultLinodeOptions: LinodeVisitOptions = {
      mockRequests: true,
      preferenceOverrides: undefined,
    };

    const resolvedLinodeOptions = linodeOptions
      ? {
          ...defaultLinodeOptions,
          ...linodeOptions,
        }
      : defaultLinodeOptions;

    // returning false here prevents Cypress from
    // failing the test with newrelic errors
    Cypress.on('uncaught:exception', (_err, _runnable) => false);

    const opt = {
      onBeforeLoad: (win: any) => {
        _loginWithToken(win);
      },
    };

    if (resolvedLinodeOptions.mockRequests) {
      const mockOptions =
        typeof resolvedLinodeOptions.mockRequests === 'boolean'
          ? undefined
          : resolvedLinodeOptions.mockRequests;
      mockCommonRequests(mockOptions);
    }

    if (resolvedLinodeOptions.preferenceOverrides) {
      cy.intercept('GET', '*/profile/preferences*', (request) => {
        request.continue((response) => {
          response.body = {
            ...response?.body,
            ...resolvedLinodeOptions.preferenceOverrides,
          };
        });
      });
    }

    console.log('executing visit');
    return cy.visit(url, { ...cypressOptions, ...opt });
  }
);
