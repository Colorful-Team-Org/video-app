import {Box, IconButton, ModalLauncher, ModalConfirm, Text, Tooltip} from '@contentful/f36-components';
import {CloseTrimmedIcon} from '@contentful/f36-icons';
import React from "react";

const CancelUpload = () => {

    const handleCancel = () => {
        ModalLauncher.open(({isShown, onClose}) => {
            return (
                <ModalConfirm
                    title="Cancel video upload"
                    intent="negative"
                    isShown={isShown}
                    allowHeightOverflow={true}
                    onCancel={() => {
                        onClose(() => {
                            return false;
                        });
                    }}
                    onConfirm={() => {
                        window.wistiaUploader.cancel();
                        onClose(() => {
                            window.location.reload();
                        });
                    }}
                    confirmLabel="Cancel upload anyway"
                    cancelLabel="Continue uploading">
                    <Text>Do you really want to cancel uploading this video?</Text>
                </ModalConfirm>
            );
        }).then((result) => result());
    }

    return (
        <Box style={{marginLeft: 'auto'}}>
            <Tooltip content="Cancel upload" placement="top-end">
                <IconButton
                    aria-label="Cancel upload"
                    icon={<CloseTrimmedIcon/>}
                    variant="negative"
                    size="small"
                    onClick={handleCancel}
                />
            </Tooltip>
        </Box>
    );
}

export default CancelUpload;