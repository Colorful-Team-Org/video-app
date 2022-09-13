import {Box, IconButton, ModalLauncher, ModalConfirm, Text, Tooltip} from '@contentful/f36-components';
import {CloseTrimmedIcon} from '@contentful/f36-icons';
import {Notification} from "@contentful/f36-notification";
import {useSDK} from "@contentful/react-apps-toolkit";
import React from "react";
import {FieldExtensionSDK} from "@contentful/app-sdk";

const CancelUpload = () => {
    const sdk = useSDK<FieldExtensionSDK>();

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
                            Notification.success('You can track you upload progress.', {title: 'Upload continues'});
                        });
                    }}
                    onConfirm={() => {
                        window.wistiaUploader.cancel();
                        sdk.notifier.success('You have cancelled your video upload. Uploader was reset to default.');
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