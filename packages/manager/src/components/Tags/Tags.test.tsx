import * as React from 'react';
import { renderWithTheme } from 'src/utilities/testHelpers';
import { Tags } from './Tags';

const threeTags = ['Tag 1', 'Tag 2', 'Tag 3'];

const fiveTags = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'];

const classes = {
  root: '',
  tag: '',
};

describe('Tags list', () => {
  it('Should display only first 3 tags when more than 3 tags are in tags list', () => {
    const { getByText, queryByText } = renderWithTheme(
      <Tags tags={fiveTags} classes={classes} />
    );

    // Check that first 3 tags are displayed.
    fiveTags.slice(0, 3).forEach((tag) => {
      expect(getByText(tag)).toBeVisible();
    });

    // Check that remaining tags are hidden.
    fiveTags.slice(3).forEach((tag) => {
      expect(queryByText(tag)).toBeNull();
    });
  });

  it('Should have a show more button when more than 3 tags are in tags list', () => {
    const { container, getByLabelText } = renderWithTheme(
      <Tags tags={fiveTags} classes={classes} />
    );

    expect(getByLabelText('+2 tags')).toBeVisible();
    expect(
      container.querySelector('[data-qa-show-more-chip="true"]')
    ).toBeVisible();
  });

  it('Should not have show more button when 3 or fewer tags are in tags list', () => {
    const { container } = renderWithTheme(
      <Tags tags={threeTags} classes={classes} />
    );

    expect(
      container.querySelector('[data-qa-show-more-chip="true"]')
    ).toBeNull();
  });
});
