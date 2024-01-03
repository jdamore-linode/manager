import { ipAddressFactory } from 'src/factories/networking';
import { listIPv6InRange } from './linodeNetworkingUtils';

describe('listIPv6InRange utility function', () => {
  const ipv4List = ipAddressFactory.buildList(4);
  const ipv6Range = ipAddressFactory.build({
    address: '2600:3c03:e000:3cb::2',
    rdns: 'my-site.com',
    type: 'ipv6/range',
  });
  it('returns IPs within the given range', () => {
    expect(
      listIPv6InRange('2600:3c03:e000:3cb::', 64, [...ipv4List, ipv6Range])
    ).toHaveLength(1);
  });
  it('returns an empty array if no IPs fall within the range', () => {
    const outOfRangeIP = ipAddressFactory.build({
      address: '0000::',
      rdns: 'my-site.com',
      type: 'ipv6/range',
    });
    expect(
      listIPv6InRange('2600:3c03:e000:3cb::', 64, [...ipv4List, outOfRangeIP])
    ).toHaveLength(0);
  });
  it('allows pools', () => {
    const ipv6Pool = ipAddressFactory.build({
      address: '2600:3c03::e1:5000',
      rdns: 'my-site.com',
      type: 'ipv6/pool',
    });
    expect(
      listIPv6InRange('2600:3c03::e1:5000', 64, [...ipv4List, ipv6Pool])
    ).toHaveLength(1);
  });
});
