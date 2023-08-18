import * as React from 'react';

import { includesActions, renderWithTheme } from 'src/utilities/testHelpers';

import { Props, VolumesActionMenu } from './VolumesActionMenu';

const props: Props = {
  attached: false,
  filesystemPath: '',
  handleAttach: vi.fn(),
  handleDelete: vi.fn(),
  handleDetach: vi.fn(),
  isVolumesLanding: false,
  label: '',
  linodeId: 0,
  linodeLabel: '',
  openForClone: vi.fn(),
  openForConfig: vi.fn(),
  openForEdit: vi.fn(),
  openForResize: vi.fn(),
  regionID: '',
  size: 50,
  volumeId: 12345,
  volumeLabel: '',
  volumeTags: ['abc', 'def'],
};

describe('Volume action menu', () => {
  it('should include basic Volume actions', () => {
    const { queryByText } = renderWithTheme(<VolumesActionMenu {...props} />);
    includesActions(['Show Config', 'Edit'], queryByText);
  });

  it('should include Attach if the Volume is not attached', () => {
    const { queryByText } = renderWithTheme(
      <VolumesActionMenu {...props} isVolumesLanding={true} />
    );
    includesActions(['Attach'], queryByText);
    expect(queryByText('Detach')).toBeNull();
  });

  it('should include Detach if the Volume is attached', () => {
    const { queryByText } = renderWithTheme(
      <VolumesActionMenu {...props} attached={true} />
    );
    includesActions(['Detach'], queryByText);
    expect(queryByText('Attach')).toBeNull();
  });

  it('should include Delete', () => {
    const { queryByText } = renderWithTheme(
      <VolumesActionMenu {...props} attached={false} />
    );
    includesActions(['Delete'], queryByText);
  });
});
