import {Button} from '@contentful/f36-components';
import React from "react";

const ButtonRetry = ({progress}: any) => {

    return (
        <Button
            variant="primary"
            style={{marginTop: '10px'}}
            onClick={() => {
                window.location.reload();
            }}>
            {progress === "100% uploaded" || progress === ''
                ? 'Let\'s try again'
                : 'Upload a new video'
            }
        </Button>
    );
}

export default ButtonRetry;