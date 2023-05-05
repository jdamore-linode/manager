import { Theme } from '@mui/material/styles';
import copy from 'copy-to-clipboard';
import * as React from 'react';
import FileCopy from 'src/assets/icons/copy.svg';
import ToolTip from 'src/components/core/Tooltip';
import { makeStyles } from 'tss-react/mui';

interface Props {
  text: string;
  className?: string;
  copyableText?: boolean;
  onClickCallback?: () => void;
}

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    position: 'relative',
    padding: 4,
    backgroundColor: 'transparent',
    transition: theme.transitions.create(['background-color']),
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    color: theme.color.grey1,
    '& svg': {
      transition: theme.transitions.create(['color']),
      color: theme.color.grey1,
      margin: 0,
      position: 'relative',
      width: 20,
      height: 20,
    },
    '& svg:hover': {
      color: theme.palette.primary.main,
    },
  },
  flex: {
    display: 'flex',
    width: 'auto !important',
  },
  copyableTextBtn: {
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    font: 'inherit',
    color: theme.palette.text.primary,
  },
}));

export const CopyTooltip = (props: Props) => {
  const { classes, cx } = useStyles();
  const [copied, setCopied] = React.useState<boolean>(false);

  const { text, className, copyableText, onClickCallback } = props;

  const handleIconClick = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
    copy(text);
    if (onClickCallback) {
      onClickCallback();
    }
  };

  return (
    <ToolTip title={copied ? 'Copied!' : 'Copy'} placement="top" data-qa-copied>
      <button
        aria-label={`Copy ${text} to clipboard`}
        name={text}
        type="button"
        onClick={handleIconClick}
        className={cx(classes.root, className, {
          [classes.copyableTextBtn]: copyableText,
        })}
        data-qa-copy-btn
      >
        {copyableText ? text : <FileCopy />}
      </button>
    </ToolTip>
  );
};
