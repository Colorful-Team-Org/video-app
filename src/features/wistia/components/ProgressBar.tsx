import {Box} from '@contentful/f36-components';
import React from "react";

const ProgressBar = ({ progress }: any) => {

  return (
      <Box
          as="div"
          style={{
              width: '80%',
              height: '8x',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
              marginBottom: '10px',
          }}>
          <Box
              as="div"
              style={{
                  width: progress ? progress : '0%',
                  height: '8px',
                  backgroundColor: '#036fe3',
                  borderRadius: '6px',
              }}>
          </Box>
      </Box>
  );
}

export default ProgressBar;