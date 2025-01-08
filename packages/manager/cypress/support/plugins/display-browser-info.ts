import { CypressPlugin } from './plugin';

/**
 * Displays a table of information about the browser being used for the tests.
 */
const displayBrowserInfo = (
  browser: Cypress.Browser,
  launchOptions: Cypress.BeforeBrowserLaunchOptions
) => {
  const browserBasicInfo = {
    Browser: `${browser.displayName} v${browser.version}`,
    Family: browser.family,
    Headless: browser.isHeadless ? 'Yes' : 'No',
  };

  const browserChromeSpecificInfo =
    browser.name === 'chrome'
      ? {
          // Show whether we're using the new or old Chrome headless implementation.
          'Chrome Headless': (() => {
            if (!browser.isHeadless) {
              return 'N/A';
            }
            if (launchOptions.args.includes('--headless=old')) {
              return 'Old';
            }
            return 'New';
          })(),
        }
      : {};

  console.log('Browser information:');
  console.table({
    ...browserBasicInfo,
    ...browserChromeSpecificInfo,
  });
};

/**
 * Configures the browser instance for Cypress testing.
 */
export const displayBrowser: CypressPlugin = (on, _config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    displayBrowserInfo(browser, launchOptions);
  });
};
