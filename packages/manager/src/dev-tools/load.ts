import { ApplicationStore } from 'src/store';
import { isMSWEnabled } from './devToolsUtils';

/**
 * Use this to dynamicly import our custom dev-tools ONLY when they
 * are needed.
 * @param store Redux store to control
 */
export async function loadDevTools(store: ApplicationStore) {
  const devTools = await import('./dev-tools');

  if (isMSWEnabled) {
    const { worker } = await import('../mocks/testBrowser');

    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  devTools.install(store);
}
