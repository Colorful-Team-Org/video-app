import React, {useEffect, useState} from 'react';
import {
    Stack,
    Flex,
    Tooltip,
    Button,
    ButtonGroup,
    ModalLauncher,
    ModalConfirm,
    Text, Spinner
} from '@contentful/f36-components';
import {DeleteIcon, AssetIcon, InfoCircleIcon} from '@contentful/f36-icons';
import {FieldExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */useFieldValue, useSDK} from '@contentful/react-apps-toolkit';
import Wistia from '../features/wistia/Wistia';
import Preview from "../features/wistia/components/Preview";
import {Notification} from '@contentful/f36-notification';
import {Medias} from "../utils/types";


const Field = () => {
    const sdk = useSDK<FieldExtensionSDK>();

    const [media, setMedia] = useFieldValue<Medias[] | undefined>();
    const [timeChange, setTimeChange] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleRemove = () => {
        ModalLauncher.open(({isShown, onClose}) => {
            return (
                <ModalConfirm
                    title="Remove video data"
                    intent="negative"
                    isShown={isShown}
                    allowHeightOverflow={true}
                    onCancel={() => {
                        onClose('No video data was removed.');
                    }}
                    onConfirm={() => {
                        setMedia(undefined);
                        sdk.notifier.success('Video data removed, this action cannot be undone. Uploader was reset to default. Note, the file is still available in your Wistia project.');
                        onClose(()=> window.location.reload());
                    }}
                    confirmLabel="Remove the video data"
                    cancelLabel="Keep the video">
                    <Text>Do you really want to remove this video data?</Text>
                </ModalConfirm>
            );
        }).then((result) => result ());
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

    const setNewThumbnail = async () => {
        setIsLoading(true);
        // Extracting the thumbnail
        // https://wistia.com/support/developers/extracting-thumbnails#extracting-the-thumbnail
        //@ts-ignore
        const embedAssetUrl = `${(media.assets[0].url).split('.bin')[0]}.jpg?video_still_time=${timeChange}`

        //TODO: DRY - optimize Thumbnail extraction

        const newThumbnail = await fetch(`https://upload.wistia.com?project_id=${sdk.parameters.installation.projectId}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                Authorization: `Bearer ${sdk.parameters.installation.accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${embedAssetUrl}`,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setIsLoading(false);
                return data;
            }).catch(error => {
                console.log('Asset error: ', error);
            });

        //@ts-ignore
        await fetch(`https://api.wistia.com/v1/medias/${media.hashed_id}.json?new_still_media_id=${newThumbnail.hashed_id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${sdk.parameters.installation.accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(response => {
            if (response.ok) {
                Notification.success('Thumbnail has been updated.', {title: 'Success!'});
                setTimeout(() => {
                    Notification.closeAll();
                    window.location.reload();
                }, 3000);
            }
        }).catch(error => {
            return error
        });
    }

    useEffect(() => {
        if (media !== undefined) {

            // Get time change for thumbnail extraction
            window._wq = window._wq || [];
            window._wq.push({
                //@ts-ignore
                id: media.hashed_id, onReady: function (video: any) {
                    console.log('Media', media);
                    console.log("Preview Video handle: ", video);

                    video.bind("pause", function () {
                        console.log(`Paused at ${video.time()} seconds`);
                        setTimeChange(video.time());
                    });

                    video.bind("timechange", function () {
                        console.log(`Time changed to: ${video.time()} seconds`);
                        setTimeChange(video.time());
                    });

                }
            });
        }
    }, [media]);

    return (
        <>
            <Wistia viewVideosList={viewVideosList}/>

            {media !== undefined &&
                <>
                    <Preview media={media}/>
                    <Stack
                        marginTop="spacingS"
                        spacing="spacingM"
                        justifyContent="space-evenly">
                        <ButtonGroup variant="spaced" spacing="spacing2Xs">
                            <Button
                                aria-label="Set Thumbnail"
                                startIcon={<AssetIcon/>}
                                variant="secondary"
                                onClick={() => {
                                    setNewThumbnail()
                                }}>
                                {isLoading ? (
                                    <>Thumbnail loading{(' ')}<Spinner size="medium" variant="primary"/></>
                                ) : 'Set Thumbnail'}
                            </Button>
                            <InfoIconTooltip
                                note="The thumbnail is what viewers see before they press play. By default, Wistia selects the middle frame of the video. If you want to replace it with an alternative shot, pause the video on the desired frame and hit this link."
                                id="set-thumbnail"/>
                        </ButtonGroup>
                        <ButtonGroup variant="spaced" spacing="spacing2Xs">
                            <Button
                                aria-label="Remove Video"
                                startIcon={<DeleteIcon/>}
                                variant="secondary"
                                onClick={() => handleRemove()}>
                                Remove Video</Button>
                            <InfoIconTooltip
                                note="To remove the attached video or attach a video from Wistia, press on this link. Removing the video, only removes it from Contentful, but it continues to live in Wistia. To remove the video completely, contact your colleague with access to our Wistia account."
                                id="remove-video"/>
                        </ButtonGroup>
                    </Stack>
                </>
            }
        </>
    );
};

export default Field;
