import { vi } from 'vitest';
import { render } from '@testing-library/react';
import * as React from 'react';
import { clearDocs, setDocs } from 'src/store/documentation';
import { wrapWithTheme } from 'src/utilities/testHelpers';
import { reactRouterProps } from 'src/__data__/reactRouterProps';
import { ListLinodes } from './LinodesLanding';

describe('ListLinodes', () => {
  const classes = {
    root: '',
    CSVlinkContainer: '',
    CSVlink: '',
    CSVwrapper: '',
  };

  it('renders without error', () => {
    const { getByText } = render(
      wrapWithTheme(
        <ListLinodes
          someLinodesHaveScheduledMaintenance={true}
          linodesData={[]}
          classes={classes}
          clearDocs={clearDocs}
          enqueueSnackbar={vi.fn()}
          linodesCount={0}
          linodesRequestError={undefined}
          linodesRequestLoading={false}
          closeSnackbar={vi.fn()}
          setDocs={setDocs}
          deleteLinode={vi.fn()}
          {...reactRouterProps}
          linodesInTransition={new Set<number>()}
        />
      )
    );

    expect(getByText('Create Linode')).toBeInTheDocument();
  });
});
