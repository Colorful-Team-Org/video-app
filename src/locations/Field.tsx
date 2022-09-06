import React, {useEffect} from 'react';
import {
    Stack,
    Box,
    Flex,
    Tooltip,
    Button,
    ButtonGroup,
    ModalLauncher,
    ModalConfirm,
    Text
} from '@contentful/f36-components';
import {DeleteIcon, AssetIcon, CycleIcon, InfoCircleIcon} from '@contentful/f36-icons';
// import tokens from "@contentful/f36-tokens";
import {FieldExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */useFieldValue, useSDK} from '@contentful/react-apps-toolkit';
import Wistia from '../features/wistia/Wistia';
import Preview from "../features/wistia/components/Preview";
import {Notification} from '@contentful/f36-notification';

const Field = () => {
    const sdk = useSDK<FieldExtensionSDK>();

    const [media, setMedia] = useFieldValue();

    useEffect(() => {
        sdk.window.startAutoResizer();
        return () => sdk.window.stopAutoResizer();
    }, [sdk]);

    const viewVideosList = async () => {
        const result = await sdk.dialogs.openCurrentApp({
            shouldCloseOnEscapePress: true,
            shouldCloseOnOverlayClick: true,
            minHeight: '30vh',
            title: "Select a video",
            // @ts-expect-error
            parameters: media,
        });

        if (!result) {
            return;
        }

        await setMedia(result);
    }

    const handleRemove= () => {
        ModalLauncher.open(({isShown, onClose}) => {
            return (
                <ModalConfirm
                    title="Remove video data"
                    intent="negative"
                    isShown={isShown}
                    allowHeightOverflow={true}
                    onCancel={() => {
                        onClose('Video removal cancelled');
                    }}
                    onConfirm={() => {
                        setMedia(undefined);
                        onClose('Video data removed, this action cannot be undone. Note, the file is still available in your Wistia project.')
                    }}
                    confirmLabel="Remove the video data"
                    cancelLabel="Keep the video">
                    <Text>Do you really want to remove this video data?</Text>
                </ModalConfirm>
            );
        }).then((result) => {
            if (result.includes('cancelled')) {
                Notification.warning(result);
            } else {
                Notification.success(result);
                setTimeout(() => {
                    Notification.closeAll();
                    window.location.reload();
                },3000);
            }
        });
    }

    const InfoIconTooltip = ({note, id}: any) => {
        return (
            <Tooltip content={note} id={id}>
                <Flex alignItems="center">
                    <InfoCircleIcon size="small"/>
                </Flex>
            </Tooltip>
        )
    }

    return (
        <Box>
            <Wistia viewVideosList={viewVideosList} />

            {media !== undefined &&
                <Preview media={media}/>
            }
            {media !== undefined && <Box>
                <Stack
                    spacing="spacingM"
                    justifyContent="space-evenly">
                    <ButtonGroup variant="spaced" spacing="spacing2Xs">
                        <Button
                            aria-label="Replace Video File"
                            startIcon={<CycleIcon/>}
                            variant="transparent"
                            isDisabled={true}>
                            Replace Video File
                        </Button>
                        <InfoIconTooltip note="When a media is replaced, the app overwrites the original video file but keeps all the other data -- name, description, thumbnail, stats -- unchanged. Use this feature to update a video with a slight editing tweak."
                                         id="replace-video-file"/>
                    </ButtonGroup>
                    <ButtonGroup variant="spaced" spacing="spacing2Xs">
                        <Button
                            aria-label="Set Thumbnail"
                            startIcon={<AssetIcon/>}
                            variant="transparent"
                            onClick={() => console.log('Work in progress...')}>
                            Set Thumbnail</Button>
                        <InfoIconTooltip
                            note="The thumbnail is what viewers see before they press play. By default, Wistia selects the middle frame of the video. If you want to replace it with an alternative shot, pause the video on the desired frame and hit this link."
                            id="set-thumbnail"/>
                    </ButtonGroup>
                    <ButtonGroup variant="spaced" spacing="spacing2Xs">
                        <Button
                            aria-label="Remove Video"
                            startIcon={<DeleteIcon/>}
                            variant="transparent"
                            onClick={() => handleRemove()}>
                            Remove Video</Button>
                        <InfoIconTooltip
                            note="To remove the attached video or attach a video from Wistia, press on this link. Removing the video, only removes it from Contentful, but it continues to live in Wistia. To remove the video completely, contact your colleague with access to our Wistia account."
                            id="remove-video"/>
                    </ButtonGroup>
                </Stack>
            </Box>}
        </Box>
    );
};

export default Field;
