import { Box, IconButton, Tooltip } from '@contentful/f36-components';
import { CloseTrimmedIcon } from '@contentful/f36-icons';
import { useSDK } from "@contentful/react-apps-toolkit";


const CancelUpload = () => {
    const sdk = useSDK();

    const handleCancel= () => {
        sdk.dialogs.openConfirm({
            title: 'Cancel the upload',
            message: 'Do you want to cancel the upload?',
            intent: 'negative',
            confirmLabel: 'Cancel the upload',
            cancelLabel: 'Continue uploading',
            shouldCloseOnEscapePress: true,
            shouldCloseOnOverlayClick: true,
        }).then((confirmed) => {
            if (confirmed) {
                window.wistiaUploader.cancel();
                window.location.reload();
            }
            return;

        });
    };

    // TODO: Investigate Broken ModalConfirm
    // const handleCancel = () => {
    //     ModalLauncher.open(({isShown, onClose}) => {
    //         return (
    //             <ModalConfirm
    //                 title="Cancel the upload"
    //                 intent="negative"
    //                 isShown={isShown}
    //                 allowHeightOverflow={true}
    //                 onCancel={() => {
    //                     onClose(() => {
    //                         return false;
    //                     });
    //                 }}
    //                 onConfirm={() => {
    //                     window.wistiaUploader.cancel();
    //                     onClose(() => {
    //                         window.location.reload();
    //                     });
    //                 }}
    //                 confirmLabel="Cancel the upload"
    //                 cancelLabel="Continue uploading">
    //                 <Text>Do you want to cancel the upload?</Text>
    //             </ModalConfirm>
    //         );
    //     }).then((result) => result());
    // };

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