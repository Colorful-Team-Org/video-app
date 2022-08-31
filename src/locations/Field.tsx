import React, {useEffect} from 'react';
import {Stack, Box, Flex, IconButton, Tooltip} from '@contentful/f36-components';
import {DeleteIcon, AssetIcon, CycleIcon} from '@contentful/f36-icons';
import tokens from "@contentful/f36-tokens";
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

        //TODO: remove console.log
        console.log(`File picker media`, media)
    }


    return (
        <Box>
            <Wistia viewVideosList={viewVideosList}/>

            {media !== undefined &&
                <Preview media={media}/>
            }
            {media !== undefined &&
                <Box
                    style={{
                        margin: '1rem auto',
                    }}
                >
                    <Flex
                        justifyContent="center"
                        style={{
                            backgroundColor: tokens.gray200,
                            borderRadius: tokens.borderRadiusMedium,
                            maxWidth: '30%',
                            margin: 'auto',
                        }}
                    >
                        <Stack margin="spacingXs">
                            <Tooltip content="Replace Video File">
                                <IconButton
                                    aria-label="Replace Video File"
                                    icon={<CycleIcon/>}
                                    variant="transparent"
                                    size="small"
                                    onClick={() => console.log('Work in progress...')}
                                />
                            </Tooltip>
                            <Tooltip content="Set Thumbnail">
                                <IconButton
                                    aria-label="Set Thumbnail"
                                    icon={<AssetIcon/>}
                                    variant="transparent"
                                    size="small"
                                    onClick={() => console.log('Work in progress...')}
                                />
                            </Tooltip>
                            <Tooltip content="Remove Video">
                                <IconButton
                                    aria-label="Remove Video"
                                    icon={<DeleteIcon/>}
                                    variant="transparent"
                                    size="small"
                                    onClick={() => {
                                        setMedia(undefined)
                                        Notification.warning('Media data removed, please update access token permissions in order to remove it from Wistia project.')
                                    }}
                                />
                            </Tooltip>
                        </Stack>
                    </Flex>
                </Box>}
        </Box>
    );
};

export default Field;
