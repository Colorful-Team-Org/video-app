import { FieldExtensionSDK } from '@contentful/app-sdk';
import { Button, Flex, Spinner, Stack, Text, Tooltip } from "@contentful/f36-components";
import { AssetIcon, DeleteIcon, InfoCircleIcon } from '@contentful/f36-icons';
import { Notification } from '@contentful/f36-notification';
import { /* useCMA, */ useFieldValue, useSDK } from '@contentful/react-apps-toolkit';
import { useEffect, useState } from 'react';
import Preview from "../features/wistia/components/Preview";
import Wistia from '../features/wistia/Wistia';
import { Media } from "../utils/types";


const Field = () => {
    const sdk = useSDK<FieldExtensionSDK>();

    const [media, setMedia] = useFieldValue<Media | undefined>();
    const [video, setVideo] = useState<any>();
    const [thumbIsLoading, setThumbIsLoading] = useState(false);

    useEffect(() => {
        sdk.window.startAutoResizer();
        return () => sdk.window.stopAutoResizer();
    }, [sdk]);

    const viewVideosList = async () => {
        const result = await sdk.dialogs.openCurrentApp({
            shouldCloseOnEscapePress: true,
            shouldCloseOnOverlayClick: true,
            width: 1000,
            minHeight: 790,
            title: "Select a video",
            // @ts-expect-error
            parameters: media,
        });

        if (!result) {
            return;
        }

        await setMedia(result);
    }

    const removeVideoData = () => {
        sdk.dialogs.openConfirm({
            title: 'Remove the video',
            message: 'Do you want to remove the video from the entry?',
            intent: 'negative',
            confirmLabel: 'Remove the video',
            cancelLabel: 'Cancel',
            shouldCloseOnEscapePress: true,
            shouldCloseOnOverlayClick: true,
        }).then((confirmed) => {
            if (confirmed) {
                Notification.success(
                    'Note that the video asset is still available in your Wistia project.',
                    {title: 'Video removed', duration: 2500}
                );
                setMedia(undefined)
            }
            return;

        });
    };

    const InfoIconTooltip = ({note, id}: any) => {
        return (
            <Tooltip content={note} id={id}>
                <Flex alignItems="center">
                    <InfoCircleIcon size="small" variant="muted"/>
                </Flex>
            </Tooltip>
        )
    }

    

    const setNewThumbnail = async () => {
        if (!media?.assets[0].url) {
            return;
        }
        setThumbIsLoading(true);

        const headers = new Headers(
            {
                Authorization: `Bearer ${sdk.parameters.installation.accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        );

        // Extracting the thumbnail
        // https://wistia.com/support/developers/extracting-thumbnails#extracting-the-thumbnail
        const embedAssetUrl = `${(media.assets[0].url).split('.bin')[0]}.jpg?video_still_time=${video?.time() || 0}`

        //TODO: DRY - optimize Thumbnail extraction
        const newThumbnail = await fetch(`https://upload.wistia.com?project_id=${sdk.parameters.installation.projectId}`, {
            method: 'POST',
            cache: 'no-cache',
            headers,
            body: `url=${embedAssetUrl}`,
        })
            .then(response => response.json())
            .then(data => {
                console.log('✨ New thumbnail', data);
                return data;
            }).catch(error => {
                console.error('Asset error: ', error);
            });

        if (newThumbnail.hashed_id !== undefined) {
            await fetch(`https://api.wistia.com/v1/medias/${media.hashed_id}.json?new_still_media_id=${newThumbnail.hashed_id}`, {
                method: 'PUT',
                headers,
            }).then(response => {
                if (response.ok) {
                    Notification.success(
                        `We're updating the thumbnail. It might take up to a minute for changes to take effect.`,
                        { title: 'Processing...' }
                    );
                }
            }).catch(error => {
                console.error('Set thumbnail error: ', error);
                return error
            });
        }

        if (newThumbnail !== undefined) {
            await fetch(`https://api.wistia.com/v1/medias/${newThumbnail.hashed_id}`, {
                method: 'DELETE',
                headers,
            }).then(response => {
                if (response.ok) {
                    console.log('✅ Temporary thumbnail file has been deleted.');
                }
            }).catch(error => {
                console.error('Delete thumbnail error: ', error);
                return error
            }).finally(() => setThumbIsLoading(false));
        }
    }

    const editingDisabled = thumbIsLoading || !video;

    useEffect(() => {
        if (media !== undefined) {
            // Get time change for thumbnail extraction
            window._wq = window._wq || [];
            window._wq.push({
                id: media.hashed_id, onReady: function (video: any) {
                    video.ready(() => {
                        console.log('🎬 Video is ready');
                        // Set video embed height to prevent the preview from breaking the layout after processing is done
                        video.height(395, {constrain: false});
                        setVideo(video);
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
                        <Stack spacing="spacingXs" marginTop="spacingXs" marginBottom="spacingXs">
                            <Button
                                variant="secondary"
                                isDisabled={editingDisabled}
                                startIcon={<AssetIcon/>}
                                onClick={() => setNewThumbnail()}
                            >
                                {thumbIsLoading ? (
                                    <>
                                        <Text marginRight="spacingXs">Loading</Text>
                                        <Spinner size="medium" variant="default"/>
                                    </>
                                ) : 'Set Thumbnail'}
                            </Button>
                            <InfoIconTooltip
                                note="To replace the default thumbnail, pause the video on the desired frame and click on this button."
                                id="set-thumbnail"/>
                        </Stack>
                        <Stack spacing="spacingXs" marginTop="spacingXs" marginBottom="spacingXs">
                            <Button
                                variant="secondary"
                                isDisabled={editingDisabled}
                                startIcon={<DeleteIcon/>}
                                onClick={removeVideoData}
                            >
                                Remove Video
                            </Button>
                            <InfoIconTooltip
                                note="Click this button to remove the video from the entry. You can upload a new video or select an existing video after."
                                id="remove-video"/>
                        </Stack>
                    </Stack>
                </>
            }
        </>
    );
};

export default Field;
