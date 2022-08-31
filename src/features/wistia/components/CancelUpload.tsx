import {IconButton, ModalConfirm, Text, Tooltip} from '@contentful/f36-components';
import {CloseTrimmedIcon} from '@contentful/f36-icons';
import React from "react";

const CancelUpload = () => {

    const [isShown, setIsShown] = React.useState(false);

    return (
        <>

            <Tooltip content="Cancel upload">
                <IconButton
                    aria-label="Cancel upload"
                    icon={<CloseTrimmedIcon/>}
                    variant="transparent"
                    size="medium"
                    onClick={() => setIsShown(true)}
                />
            </Tooltip>

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