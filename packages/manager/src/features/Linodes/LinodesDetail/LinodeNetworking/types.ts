import type { IPAddress, IPRange } from '@linode/api-v4/lib/networking';

export type IPTypes =
  | 'IPv4 – Private'
  | 'IPv4 – Public'
  | 'IPv4 – Reserved (private)'
  | 'IPv4 – Reserved (public)'
  | 'IPv4 – Shared'
  | 'IPv6 – Link Local'
  | 'IPv6 – Range'
  | 'IPv6 – SLAAC';

// Higher-level IP address display for the IP Table.
export interface IPDisplay {
  // Not for display, but useful for lower-level components.
  _ip?: IPAddress;
  _range?: IPRange;
  address: string;
  gateway: string;
  rdns: string;
  subnetMask: string;
  type: IPTypes;
}
