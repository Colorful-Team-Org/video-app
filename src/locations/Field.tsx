import React, {useEffect} from 'react';
import {Button, Flex} from '@contentful/f36-components';
import {ExternalLinkIcon} from '@contentful/f36-icons';
import {FieldExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */useFieldValue, useSDK} from '@contentful/react-apps-toolkit';
import WistiaUploader from '../features/wistia/WistiaUploader';


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

        const {hashed_id} = result; // video id to build the url
        sdk.entry.fields.externalUrl.setValue(`https://contentful.wistia.com/medias/${hashed_id}`);
        setMedia(result);
    }

    return (
        <>
            <WistiaUploader/>
            <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{
                    width: '100%',
                    minHeight: '60px',
                    backgroundColor: '#f7f9fa',
                    textAlign: 'center',
                    border: '1px dashed rgb(174, 193, 204)',
                    borderBottomLeftRadius: '6px',
                    borderBottomRightRadius: '6px',
                    borderTop: 'none',
                }}
            >
                <Button
                    variant="secondary"
                    endIcon={<ExternalLinkIcon/>}
                    onClick={viewVideosList}>
                    Select an existing video
                </Button>
            </Flex>
        </>
    );
};

export default Field;
