import { /*fireEvent,*/ render } from '@testing-library/react';
// import * as serviceTarget from '@linode/api-v4/lib/aglb/service-targets';
import * as React from 'react';
// import { rest, server } from 'src/mocks/testServer';
import { includesActions } from 'src/utilities/testHelpers';
import { ServiceTargetActionMenu } from './ServiceTargetActionMenu';
// import { createServiceTargetFactory } from 'src/factories/aglb';

vi.mock('src/components/ActionMenu/ActionMenu');
// const mockEditServiceTarget = vi.spyOn<any, any>(
//     serviceTarget,
//     'updateServiceTarget'
//   );
// const mockDeleteServiceTarget = vi.spyOn<any, any>(
//   serviceTarget,
//   'deleteServiceTarget'
// );

const props = {
  serviceTargetId: 1,
  toggleDialog: vi.fn(),
  label: 'my-service-target',
};

describe('Service target action menu', () => {
  it.skip('should include the correct service target actions', () => {
    const { queryByText } = render(<ServiceTargetActionMenu {...props} />);
    includesActions(['Edit', 'Delete'], queryByText);
  });

  it.skip('should navigate to edit service target page when the edit action is clicked', () => {
    // const { getByText } = render(
    //   wrapWithTheme(<ServiceTargetActionMenu {...props} />)
    // );
    // fireEvent.click(getByText(/edit/i));
    // expect(mockGetKubeConfig).toHaveBeenCalledWith(123456);
  });

  it.skip('should send a delete request to the API when the delete action is clicked and confirmed via dialog', () => {
    // const { getByText } = render(
    //   wrapWithTheme(<ServiceTargetActionMenu {...props} />)
    // );
    // fireEvent.click(getByText(/delete/i));
    // expect(mockGetKubeConfig).toHaveBeenCalledWith(123456);
  });
});
