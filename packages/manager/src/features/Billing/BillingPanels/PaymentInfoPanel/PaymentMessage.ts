import { VariantType } from 'notistack';

/**
 * Describes a payment notification.
 */
export interface PaymentMessage {
  /** Payment message content. */
  text: string;

  /** Payment message notification variant type. */
  variant: VariantType;
}
