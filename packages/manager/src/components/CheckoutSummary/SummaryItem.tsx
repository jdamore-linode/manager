import { styled } from '@mui/material/styles';
import React from 'react';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Typography } from '../Typography';

export interface SummaryItemProps {
  details?: number | string;
  hourly?: number;
  monthly?: number;
  title?: string;
}

export const SummaryItem = ({ details, title }: SummaryItemProps) => {
  return (
    <StyledGrid>
      {title ? (
        <>
          <Typography
            sx={(theme) => ({
              fontFamily: theme.font.bold,
            })}
            component="span"
          >
            {title}
          </Typography>{' '}
        </>
      ) : null}
      <Typography component="span" data-qa-details={details}>
        {details}
      </Typography>
    </StyledGrid>
  );
};

const StyledGrid = styled(Grid2)(({ theme }) => ({
  marginBottom: `${theme.spacing()} !important`,
  marginTop: `${theme.spacing()} !important`,
  paddingBottom: '0 !important',
  paddingTop: '0 !important',
}));
