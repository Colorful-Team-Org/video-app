import React from 'react';
import { Box } from '@contentful/f36-components';
import { cx } from 'emotion';
import { styles } from './ProgressBar.styles';

const ProgressBar = ({ progress }: { progress: string }) => {
  return (
    <Box as="div" className={cx(styles.progressBar)}>
      <Box
        as="div"
        className={cx(styles.progressBar__progress, progress)}
        style={{
          width: progress ? progress : '0%',
        }}
      ></Box>
    </Box>
  );
};

export default ProgressBar;
