import {Button, ModalConfirm, Text} from '@contentful/f36-components';
import React from "react";

const CancelUpload = () => {

    const [isShown, setIsShown] = React.useState(false);

    return (
        <>
            <Button
                variant="transparent"
                onClick={() => setIsShown(true)}>
                Cancel video upload
            </Button>
            <ModalConfirm
                title="Cancel video upload"
                intent="negative"
                isShown={isShown}
                onCancel={() => {
                    setIsShown(false);
                }}
                onConfirm={() => {
                    setIsShown(false);
                    window.wistiaUploader.cancel();
                }}
                confirmLabel="Cancel upload anyway"
                cancelLabel="Continue uploading">
                <Text>Do you really want to cancel uploading this video?</Text>
            </ModalConfirm>
        </>
    );
}

export default CancelUpload;