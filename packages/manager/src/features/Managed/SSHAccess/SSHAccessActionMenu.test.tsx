import { vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { includesActions, wrapWithTheme } from 'src/utilities/testHelpers';
import {
  Props,
  SSHAccessActionMenu as ActionMenu,
} from './SSHAccessActionMenu';

vi.mock('src/components/ActionMenu/ActionMenu');

const mockOpenDrawer = vi.fn();

const props: Props = {
  linodeId: 1,
  isEnabled: true,
  linodeLabel: 'label',
  openDrawer: mockOpenDrawer,
};

describe('SSH Access Action Menu', () => {
  it('should include basic actions', () => {
    const { queryByText } = render(wrapWithTheme(<ActionMenu {...props} />));
    includesActions(['Edit'], queryByText);
  });

  it('should include Enable if access to the Linode is disabled', () => {
    const { queryByText } = render(
      wrapWithTheme(<ActionMenu {...props} isEnabled={false} />)
    );
    expect(queryByText('Enable')).toBeInTheDocument();
    expect(queryByText('Disable')).not.toBeInTheDocument();
  });

  it('should include Disable if access to the Linode is enabled', () => {
    const { queryByText } = render(
      wrapWithTheme(<ActionMenu {...props} isEnabled={true} />)
    );
    expect(queryByText('Disable')).toBeInTheDocument();
    expect(queryByText('Enable')).not.toBeInTheDocument();
  });

  it('should open the drawer when "Edit" option is clicked', () => {
    const { getByText } = render(wrapWithTheme(<ActionMenu {...props} />));
    fireEvent.click(getByText('Edit'));
    expect(mockOpenDrawer).toHaveBeenCalledWith(1);
  });
});
