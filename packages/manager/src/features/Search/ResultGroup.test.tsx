import { vi } from 'vitest';
import { shallow } from 'enzyme';
import * as React from 'react';

import { searchbarResult1, searchbarResult2 } from 'src/__data__/searchResults';
import Button from 'src/components/Button';
import Typography from 'src/components/core/Typography';

import { ResultGroup } from './ResultGroup';

vi.mock('@mui/styles', async () => {
  const actual = await vi.importActual<{}>('@mui/styles');
  return {
    ...actual,
    makeStyles: vi.fn(() => () => ({})),
  };
});

vi.mock('src/hooks/useFlags', () => ({
  default: vi.fn().mockReturnValue({}),
}));

const props = {
  entity: 'linodes',
  results: [
    searchbarResult1,
    searchbarResult2,
    searchbarResult1,
    searchbarResult2,
    searchbarResult1,
    searchbarResult2,
  ],
  loading: false,
  groupSize: 5,
  showMore: false,
  toggle: vi.fn(),
};

const emptyProps = {
  entity: 'linodes',
  results: [],
  groupSize: 5,
  showMore: false,
  toggle: vi.fn(),
};

const component = shallow(<ResultGroup {...props} />);

describe('ResultGroup component', () => {
  it('should render', () => {
    expect(component).toBeDefined();
  });
  it('should return null if there are no results', () => {
    expect(ResultGroup(emptyProps)).toBeNull();
  });
  it('should render the capitalized entity label', () => {
    expect(
      component.containsMatchingElement(<Typography>Linodes</Typography>)
    ).toBeTruthy();
  });
  it('should render its children', () => {
    expect(component.find('[data-qa-result-row-component]')).toHaveLength(5);
  });
  describe('Hidden results', () => {
    it('should have a Show All button', () => {
      expect(
        component.containsMatchingElement(
          <Button buttonType="primary">Show All</Button>
        )
      );
    });
    it('should show hidden results when showMore is true', () => {
      component.setProps({ showMore: true });
      expect(component.find('[data-qa-result-row-component]')).toHaveLength(6);
    });
    it('should have a Show Less button', () => {
      component.setProps({ showMore: true });
      expect(
        component.containsMatchingElement(
          <Button buttonType="primary">Show Less</Button>
        )
      ).toBeTruthy();
    });
    it('should toggle showMore on click', () => {
      component.find('[data-qa-show-more-toggle]').simulate('click');
      expect(props.toggle).toHaveBeenCalled();
    });
  });
});
