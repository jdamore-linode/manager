import { styled } from '@mui/material/styles';
import { CircleProgress } from 'src/components/CircleProgress';

/**
 * Circle progress indicator for Lish.
 *
 * Styled to center the indicator in its parent container.
 */
export const LishCircleProgress = styled(CircleProgress)(() => ({
  left: '50%',
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
}));
