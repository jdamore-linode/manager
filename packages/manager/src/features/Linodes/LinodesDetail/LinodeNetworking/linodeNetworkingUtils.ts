import { parse as parseIP } from 'ipaddr.js';
import type { IPv6 } from 'ipaddr.js';
import type { IPAddress } from '@linode/api-v4/lib/networking';

/**
 * Returns an array of IP addresses that fall within in a range, given some prefix.
 *
 * @param range - IPv6 range.
 * @param prefix - IPv6 prefix.
 * @param ips - Array of IPs from which to find addresses in range.
 *
 * @return Array of IPv6 addresses in the given range.
 */
export const listIPv6InRange = (
  range: string,
  prefix: number,
  ips: IPAddress[] = []
) => {
  return ips.filter((thisIP) => {
    // Only keep addresses that:
    // 1. are part of an IPv6 range or pool
    // 2. have RDNS set
    if (
      !['ipv6/pool', 'ipv6/range'].includes(thisIP.type) ||
      thisIP.rdns === null
    ) {
      // eslint-disable-next-line array-callback-return
      return;
    }

    // The ipaddr.js library throws an if it can't parse an IP address.
    // We'll wrap this in a try/catch block just in case something is malformed.
    try {
      // We need to typecast here so that the overloaded `match()` is typed correctly.
      const addr = parseIP(thisIP.address) as IPv6;
      const parsedRange = parseIP(range) as IPv6;

      return addr.match(parsedRange, prefix);
    } catch {
      return false;
    }
  });
};
