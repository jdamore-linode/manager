import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { EntityIcon } from 'src/components/EntityIcon/EntityIcon';
import { Hidden } from 'src/components/Hidden';
import { TableCell } from 'src/components/TableCell';
import { TableRow, TableRowProps } from 'src/components/TableRow';

import { FolderActionMenu } from './FolderActionMenu';

export interface FolderTableRowProps extends TableRowProps {
  displayName: string;
  folderName: string;
  handleClickDelete: (objectName: string) => void;
  manuallyCreated: boolean;
}

export const FolderTableRow = (props: FolderTableRowProps) => {
  const {
    displayName,
    folderName,
    handleClickDelete,
    manuallyCreated,
    ...tableRowProps
  } = props;

  return (
    <TableRow key={folderName} {...tableRowProps}>
      <TableCell parentColumn="Object">
        <Grid alignItems="center" container spacing={2} wrap="nowrap">
          <StyledIconWrapper>
            <EntityIcon size={22} variant="folder" />
          </StyledIconWrapper>
          <Grid>
            <Link
              className="secondaryLink"
              to={`?prefix=${encodeURIComponent(folderName)}`}
            >
              {displayName}
            </Link>
          </Grid>
        </Grid>
      </TableCell>
      {/* Three empty TableCells corresponding to the Size, Last Modified, and Action Menu (for ObjectTableRow) columns for formatting purposes. */}
      <TableCell />
      <Hidden mdDown>
        <TableCell />
      </Hidden>
      <TableCell actionCell>
        <FolderActionMenu
          handleClickDelete={handleClickDelete}
          objectName={folderName}
        />
      </TableCell>
    </TableRow>
  );
};

const StyledIconWrapper = styled(Grid, {
  label: 'StyledIconWrapper',
})(() => ({
  margin: '2px 0',
}));
