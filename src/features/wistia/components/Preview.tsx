import {Box, Flex, Paragraph, Subheading} from "@contentful/f36-components";
import React, {useEffect, useState} from "react";
import tokens from "@contentful/f36-tokens";


const Preview = ({media}: any) => {

    const [iframeSrc, setIframeSrc] = useState('');
    const [preview, setPreview] = useState(true);

    useEffect(() => {
        if (media !== undefined && media.hashed_id !== undefined) {

            const checkMedia = async (mediaUrl: string) => {
                // TODO: remove console.log
                console.log('Preview URL: ', mediaUrl);

                await fetch(mediaUrl, {method: 'GET'})
                    .then(response => {
                        const contentType = response.headers.get('content-type');
                        // TODO: remove console.log
                        console.log('Preview contentType: ', contentType);

                        if (contentType && contentType.indexOf('application/json') !== -1) {
                            return response.json();
                        }

                        return response;
                    }).then(data => {
                        //TODO: remove console.log
                        console.log('Preview data: ', data);

                        //TODO: Handle errors
                        if (data.error === true) {
                            console.log('Preview data.error: ', data.error);
                            setPreview(false);
                            return data;
                        }

                        setIframeSrc(data.url);
                        return data;
                    }).catch(error => {
                        console.log('error', error);
                        return error;
                    });
            }
            checkMedia(`https://fast.wistia.net/embed/iframe/${media.hashed_id}`);
        }
    }, [media]);

    return (
        <>
            {!preview ? (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    style={{
                        width: "100%",
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