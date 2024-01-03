import { LinodeIPsResponse } from '@linode/api-v4/lib/linodes';
import { ipAddressFactory } from 'src/factories/networking';

import { createType, ipResponseToDisplayRows } from './LinodeIPAddresses';

describe('ipResponseToDisplayRows utility function', () => {
  const response: LinodeIPsResponse = {
    ipv4: {
      private: ipAddressFactory.buildList(1, { public: false, type: 'ipv4' }),
      public: ipAddressFactory.buildList(1, { public: true, type: 'ipv4' }),
      reserved: ipAddressFactory.buildList(1),
      shared: ipAddressFactory.buildList(1),
    },
    ipv6: {
      global: [
        {
          prefix: 64,
          range: '2600:3c00:e000:0000::',
          region: 'us-west',
          route_target: '2a01:7e00::f03c:93ff:fe6e:1233',
        },
      ],
      link_local: ipAddressFactory.build({ type: 'ipv6' }),
      slaac: ipAddressFactory.build({ type: 'ipv6' }),
    },
  };

  it('returns a display row for each IP/range', () => {
    const result = ipResponseToDisplayRows(response);
    expect(result).toHaveLength(7);
  });

  it('includes the meta _ip field for IP addresses', () => {
    const result = ipResponseToDisplayRows(response);
    // Check the first six rows (the IPs)
    for (let i = 0; i < 5; i++) {
      expect(result[i]._ip).toBeDefined();
    }
  });

  it('includes the meta _range field for IP ranges', () => {
    const result = ipResponseToDisplayRows(response);
    // Check the last row (the IPv6 range)
    expect(result[6]._range).toBeDefined();
  });
});

describe('createType utility function', () => {
  it('creates the correct type for ipv4', () => {
    const publicIPv4 = ipAddressFactory.build({ public: true, type: 'ipv4' });
    const privateIPv4 = ipAddressFactory.build({ public: false, type: 'ipv4' });

    expect(createType(publicIPv4, 'Public')).toBe('IPv4 – Public');
    expect(createType(privateIPv4, 'Private')).toBe('IPv4 – Private');

    expect(createType(publicIPv4, 'Reserved')).toBe('IPv4 – Reserved (public)');
    expect(createType(privateIPv4, 'Reserved')).toBe(
      'IPv4 – Reserved (private)'
    );

    expect(createType(publicIPv4, 'Shared')).toBe('IPv4 – Shared');
  });

  it('creates the correct type for ipv6', () => {
    const ipv6 = ipAddressFactory.build({ type: 'ipv6' });

    expect(createType(ipv6, 'SLAAC')).toBe('IPv6 – SLAAC');
    expect(createType(ipv6, 'Link Local')).toBe('IPv6 – Link Local');
  });
});
