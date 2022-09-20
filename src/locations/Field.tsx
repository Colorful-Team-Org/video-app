import React, {useEffect, useState} from 'react';
import {
    Stack,
    Flex,
    Tooltip,
    ModalLauncher,
    ModalConfirm,
    Text, Spinner, TextLink
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
    const [isDisabled, setIsDisabled] = useState(false);

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
                        Notification.success('This action cannot be undone. Note, the file is still available in your Wistia project.', {title: 'Video data removed!'});
                        onClose(() => setMedia(undefined));
                    }}
                    confirmLabel="Remove the video data"
                    cancelLabel="Keep the video">
                    <Text>Do you really want to remove this video data?</Text>
                </ModalConfirm>
            );
        }).then((result) => result());
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
        setIsDisabled(true);

        const headers = new Headers(
            {
                Authorization: `Bearer ${sdk.parameters.installation.accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        );

        // Extracting the thumbnail
        // https://wistia.com/support/developers/extracting-thumbnails#extracting-the-thumbnail
        //@ts-ignore
        const embedAssetUrl = `${(media.assets[0].url).split('.bin')[0]}.jpg?video_still_time=${timeChange}`

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
            //@ts-ignore
            await fetch(`https://api.wistia.com/v1/medias/${media.hashed_id}.json?new_still_media_id=${newThumbnail.hashed_id}`, {
                method: 'PUT',
                headers,
            }).then(response => {
                if (response.ok) {
                    Notification.success('Thumbnail is being updated. Preview window will reload once ready.', {title: 'Success!'});
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
                    setTimeout(() => {
                        setIsLoading(false);
                        console.log('🔄 Reloading preview window...');
                        window.location.reload();
                        sdk.notifier.success('Video preview has been reloaded with the updated thumbnail.');
                    }, 9000);
                }
            }).catch(error => {
                console.error('Delete thumbnail error: ', error);
                return error
            });
        }
    }

    useEffect(() => {
        //@ts-ignore
        if (media !== undefined && media.status === 'ready') {
            //@ts-ignore
            console.log('📺 Media status ', media.status);

            // Get time change for thumbnail extraction
            window._wq = window._wq || [];
            window._wq.push({
                //@ts-ignore
                id: media.hashed_id, onReady: function (video: any) {

                    video.bind("pause", function () {
                        console.warn(`⏸ ${video.time()} seconds`);
                        setTimeChange(video.time());
                    });

                    video.bind("timechange", function () {
                        console.log(`⏱ ${video.time()} seconds`);
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
                        <Stack spacing="spacingXs" marginTop="spacingXs" marginBottom="spacingXs">
                            <TextLink
                                as="button"
                                variant="secondary"
                                isDisabled={isDisabled}
                                icon={<AssetIcon/>}
                                alignIcon="start"
                                onClick={() => setNewThumbnail()}
                            >
                                {isLoading ? (
                                    <><Text marginRight="spacingXs">Loading</Text><Spinner size="medium"
                                                                                           variant="default"/></>
                                ) : 'Set Thumbnail'}
                            </TextLink>
                            <InfoIconTooltip
                                note="The thumbnail is what viewers see before they press play. If you want to replace it with an alternative shot, pause the video on the desired frame and hit this link."
                                id="set-thumbnail"/>
                        </Stack>
                        <Stack spacing="spacingXs" marginTop="spacingXs" marginBottom="spacingXs">
                            <TextLink
                                as="button"
                                variant="secondary"
                                isDisabled={isDisabled}
                                icon={<DeleteIcon/>}
                                alignIcon="start"
                                onClick={() => handleRemove()}
                            >
                                Remove Video
                            </TextLink>
                            <InfoIconTooltip
                                note="To remove the attached video or to attach a new video from Wistia, press on this link. Note that this action only removes the video from the entry, the video asset in Wistia remains untouched."
                                id="remove-video"/>
                        </Stack>
                    </Stack>
                </>
            }
        </>
    );
};

export default Field;
