import {Box, Flex, Paragraph, Subheading} from "@contentful/f36-components";
import React, {useEffect, useState} from "react";
import tokens from "@contentful/f36-tokens";
import {useSDK} from "@contentful/react-apps-toolkit";
import {FieldExtensionSDK} from "@contentful/app-sdk";


const Preview = ({media}: any) => {

    const sdk = useSDK<FieldExtensionSDK>();

    const [iframeSrc, setIframeSrc] = useState('');
    const [preview, setPreview] = useState(true);

    const checkMedia = async (media: any) => {
        await fetch(`https://api.wistia.com/v1/medias/${media.hashed_id}.json`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${sdk.parameters.installation.accessToken}`}
        })
            .then(response => {
                if (!response.ok) {
                    setPreview(false);
                    if (response.status === 404) {
                        console.error('❌ Video not found, 404.');
                    }
                }

                setIframeSrc(`https://fast.wistia.net/embed/iframe/${media.hashed_id}`);

                return response.json();
            }).catch(error => {
                console.error('Error: ', error);
            });
    }

    useEffect(() => {
        checkMedia(media);
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
                        >The video might have been removed from the Wistia platform
                            or the project permissions might have been changed.</Paragraph>
                    </Box>
                </Flex>
            ) : (<Box
                    as="div"
                    id="wistia_upload_preview"
                    style={{
                        width: "100%",
                        height: "395px",
                    }}
                >
                    <iframe
                        src={`${iframeSrc}?controlsVisibleOnLoad=false&smallPlayButton=true`}
                        title="Wistia Preview"
                        frameBorder="0"
                        scrolling="no"
                        className="wistia_embed"
                        name="wistia_embed"
                        allowFullScreen
                        width="100%"
                        height="100%"
                    ></iframe>
                </Box>
            )}
        </>);
}

export default Preview;