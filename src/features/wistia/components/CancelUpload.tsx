import {Box, IconButton, ModalLauncher, ModalConfirm, Text, Tooltip} from '@contentful/f36-components';
import {CloseTrimmedIcon} from '@contentful/f36-icons';
import {Notification} from "@contentful/f36-notification";
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
                        onClose('Video upload continues...')
                    }}
                    onConfirm={() => {
                        window.wistiaUploader.cancel();
                        onClose('Video upload cancelled')
                    }}
                    confirmLabel="Cancel upload anyway"
                    cancelLabel="Continue uploading">
                    <Text>Do you really want to cancel uploading this video?</Text>
                </ModalConfirm>
            );
        }).then((result) => {
            if (result.includes('cancelled')) {
                Notification.warning(result, {
                    cta: {
                        label: 'Try again',
                        textLinkProps: {
                            variant: 'primary',
                            onClick: () => {
                                Notification.closeAll();
                                window.location.reload();
                            }
                        },
                    },
                });
            } else {
                Notification.success(result);
            }
        });
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