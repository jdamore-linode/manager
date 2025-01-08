export type CypressPlugin = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) =>
  | Cypress.PluginConfigOptions
  | Promise<Cypress.PluginConfigOptions | void>
  | void;

type CypressPluginEventCallback = ((browser: Cypress.Browser, browserLaunchDetails: Cypress.AfterBrowserLaunchDetails) => void | Promise<void>)
  | ((results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult) => void | Promise<void>)
  | ((details: Cypress.ScreenshotDetails) => void | Cypress.AfterScreenshotReturnObject | Promise<Cypress.AfterScreenshotReturnObject> )
  | ((spec: Cypress.Spec, results: CypressCommandLine.RunResult) => void | Promise<void> )
  | ((runDetails: Cypress.BeforeRunDetails) => void | Promise<void> )
  | ((spec: Cypress.Spec) => void | Promise<void> )
  | ((browser: Cypress.Browser, afterBrowserLaunchOptions: Cypress.BeforeBrowserLaunchOptions) => void | Promise<void> | Cypress.BeforeBrowserLaunchOptions | Promise<Cypress.BeforeBrowserLaunchOptions> )
  | ((file: Cypress.FileObject) => string | Promise<string> )
  | ((file: Cypress.DevServerConfig) => Promise<Cypress.ResolvedDevServerConfig> )
  | (Cypress.Tasks);

interface CypressPluginEventListeners {
  [key: string]: CypressPluginEventCallback[],
}

export const onPluginHookProxy = (on: Cypress.PluginEvents): Cypress.PluginEvents => {
  const listeners: CypressPluginEventListeners = {};
  const proxy: Cypress.PluginEvents = (action, tasks) => {
    if (action === 'task') {
      return on(action, tasks as Cypress.Tasks);
    }
    if (action in listeners) {
      listeners[action].push(tasks);
    }
    else {
      listeners[action] = [tasks];
      (on as any)(action, async function(...args: any[]) {
        let result;
        for (let callback of listeners[action]) {
          result = await (callback as Function).apply(null, args);
        }
        return result;
      });
    }
  };
  return proxy;
}
