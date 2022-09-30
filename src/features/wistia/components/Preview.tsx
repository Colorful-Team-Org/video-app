import {Box, Flex, Paragraph, Subheading} from "@contentful/f36-components";
import React, {useEffect, useState} from "react";
import tokens from "@contentful/f36-tokens";
import {useSDK} from "@contentful/react-apps-toolkit";
import {FieldExtensionSDK} from "@contentful/app-sdk";
import wistiaFetch from "../../../utils/wistiaFetch";


const Preview = ({media}: any) => {

    const sdk = useSDK<FieldExtensionSDK>();

    // const [iframeSrc, setIframeSrc] = useState('');
    const [preview, setPreview] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const getMediaItem = wistiaFetch(
        `https://api.wistia.com/v1/medias/${media.hashed_id}.json`,
        `GET`,
        `application/json`,
        `Bearer ${sdk.parameters.installation.accessToken}`,
        null
    );

    useEffect(() => {
        getMediaItem.then((data) => {
            if (!data.ok) {
                setPreview(false);
                setErrorMessage('The video might have been removed from the Wistia platform\n' +
                    '                            or the project permissions might have been changed.');
                if (data.status === 404) {
                    console.error('❌ Video not found, 404.');
                }
            }
            if (data.ok) {
                data.json().then((data) => {
                    if (data.type === 'UnknownType') {
                        setPreview(false);
                        setErrorMessage('Looks like the video file might be corrupted.\n' +
                            '                            Please check the video file in the Wistia project.');
                        console.error('💀 Unknown video type or corrupted file.');
                    }
                });
            }
        }).catch((error) => {
            throw new Error(error);
        });
    }, [media]);

    useEffect(() => {
        if (media !== undefined) {
            // TODO: consider adding iframe as a fallback
            // setIframeSrc(`https://fast.wistia.net/embed/iframe/${media.hashed_id}`);
            setPreview(true);
        }
    }, [media]);

    return (
        <>
            {!preview ? (
                <Flex
                    fullWidth={true}
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    style={{
                        height: "395px",
                        backgroundColor: '#f7f9fa',
                        textAlign: 'center',
                        border: '1px dashed rgb(174, 193, 204)',
                        borderRadius: tokens.borderRadiusMedium,
                    }}>
                    <Box style={{width: '75%'}}>
                        <Subheading
                            style={{color: tokens.red600}}
                        > Video not found</Subheading>
                        <Paragraph
                            style={{color: tokens.gray600}}
                        >{errorMessage}</Paragraph>
                    </Box>
                </Flex>
            ) : (<Box
                    as="div"
                    id="wistia_upload_preview"
                    style={{
                        width: "100%",
                        maxWidth: "700px",
                        height: "395px",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        as="div"
                        className={`wistia_embed wistia_async_${media.hashed_id} controlsVisibleOnLoad=false`}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        &nbsp;
                    </Box>
                </Box>
            )}
        </>);
}

export default Preview;