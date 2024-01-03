import { Notification } from '@linode/api-v4/lib/account';

/**
 * Notification containing an arbitrary JSX element.
 */
export interface ExtendedNotification extends Notification {
  jsx?: JSX.Element;
}
