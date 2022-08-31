import {Button} from '@contentful/f36-components';
import React from "react";

const ButtonUpload = ({progress, isActive}: any) => {
    return (
        <Button
            id="wistia_upload_button"
            variant="primary"
            isActive={isActive}
            isLoading={isActive}
        >
            {progress
                ? progress + ' uploaded'
                : 'Upload Video'
            }
        </Button>
    );
}

export default ButtonUpload;