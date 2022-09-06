import {Box} from '@contentful/f36-components';
import React from "react";

const ProgressBar = ({progress}: any) => {

    return (
        <Box
            as="div"
            style={{
                width: '80%',
                height: '8x',
                margin: '1rem auto',
                backgroundColor: 'rgba(3,111,227,0.2)',
                borderRadius: '6px',
            }}>
            <Box
                as="div"
                style={{
                    width: progress ? progress : '0%',
                    height: '12px',
                    backgroundColor: '#036fe3',
                    borderRadius: '6px',
                }}>
            </Box>
        </Box>
    );
}

export default ProgressBar;