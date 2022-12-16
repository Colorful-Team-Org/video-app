import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

export const styles = {
  progressBar: css({
    width: '80%',
    height: '8x',
    margin: '1rem auto',
    backgroundColor: tokens.gray200,
    borderRadius: '6px',
  }),
  progressBar__progress: css({
    height: '12px',
    backgroundColor: tokens.blue500,
    borderRadius: '6px',
    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }),
};
