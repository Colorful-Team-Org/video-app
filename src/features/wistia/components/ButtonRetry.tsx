import {Button} from '@contentful/f36-components';
import React from "react";

const ButtonRetry = () => {
    return (
        <Button
            variant="primary"
            onClick={() => window.location.reload()}>
            Upload a new video
        </Button>
    );
}

export default ButtonRetry;