import { ENABLE_DEV_TOOLS } from 'src/constants';

// Mock Service Worker local storage key.
const LOCAL_STORAGE_KEY = 'msw';

/**
 * Defaults to `true` for development
 * Default to `false` in production builds
 *
 * Define `REACT_APP_ENABLE_DEV_TOOLS` to explicitly enable or disable dev tools
 */
export const shouldEnableDevTools =
  ENABLE_DEV_TOOLS !== undefined ? ENABLE_DEV_TOOLS : import.meta.env.DEV;

/**
 * Determines whether MSW is enabled via local storage settings.
 *
 * @returns `true` if MSW is enabled, `false` otherwise.
 */
export const isMSWEnabled =
  localStorage.getItem(LOCAL_STORAGE_KEY) === 'enabled';

/**
 * Enables or disables MSW.
 *
 * The window reloads after enabling or disabling MSW.
 *
 * @param enabled - Whether or not MSW should be enabled.
 */
export const setMSWEnabled = (enabled: boolean) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, enabled ? 'enabled' : 'disabled');
  window.location.reload();
};
