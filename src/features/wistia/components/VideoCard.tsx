import React, {useState} from "react";
import {AssetCard, Box, Flex, Text} from "@contentful/f36-components";
import {timeDuration, timeSince} from "../../../utils/time";
import {useSDK} from "@contentful/react-apps-toolkit";
import {DialogExtensionSDK} from "@contentful/app-sdk";

const VideoCard = ({key, medias}: any) => {
    const sdk = useSDK<DialogExtensionSDK>();
    const [mediaId, setMediaId] = useState(null);

    const handleMouseOver = (id: any) => {
        setMediaId(id);
    }

    return (
        <Flex key={key}
              flexDirection="column"
              flexWrap="wrap"
              style={{position: 'relative'}}
              onMouseEnter={() => handleMouseOver(medias.id)}
              onMouseLeave={() => handleMouseOver(null)}
        >
            <AssetCard
                type="image"
                src={medias.thumbnail.url.replace('200x120', '274x183')}
                style={{
                    width: '270px',
                    height: '181px',
                    overflow: 'hidden'
                }}
                onClick={() => {
                    sdk.close(medias); // close the dialog and return the selected value
                }}
            />
            <Box as="span"
                 style={{
                     display: 'flex',
                     flexDirection: 'row',
                     gap: 'spacingXs',
                     position: 'absolute',
                     right: '0.5rem',
                     bottom: '4.5rem',
                     backgroundColor: 'rgba(0, 0, 0, 0.35)',
                     borderRadius: '3px',
                     padding: '0 0.125rem',
                     opacity: mediaId === medias.id ? 1 : 0,
                     transition: 'all 0.2s ease-in-out',
                 }}>
                <Text
                    fontSize="fontSizeS"
                    lineHeight="lineHeightS"
                    fontColor="colorWhite"
                >
                    {timeDuration(medias.duration)}
                </Text>
            </Box>
            <Box as="span"
                 style={{
                     display: 'flex',
                     flexDirection: 'row',
                     gap: 'spacingXs',
                     position: 'absolute',
                     right: '0.5rem',
                     top: '0.5rem',
                     backgroundColor: 'rgba(0, 0, 0, 0.35)',
                     borderRadius: '3px',
                     padding: '0 0.125rem',
                     opacity: mediaId === medias.id ? 1 : 0,
                     transition: 'all 0.2s ease-in-out',
                 }}>
                <Text
                    fontSize="fontSizeS"
                    lineHeight="lineHeightS"
                    fontColor="colorWhite"
                >
                    {timeSince(medias.created)} ago
                </Text>
            </Box>
            <Text
                fontSize="fontSizeM"
                lineHeight="lineHeightS"
                fontColor="gray600"
                fontWeight="fontWeightDemiBold"
                style={{
                    marginTop: '0.25rem',
                    inlineSize: '270px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                }}>
                {medias.name}</Text>
            <Text
                fontSize="fontSizeS"
                lineHeight="lineHeightS"
                fontColor="gray500"
                style={{
                    opacity: mediaId === medias.id ? 1 : 0,
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                {medias.project.name}
            </Text>
        </Flex>
    );

};

export default VideoCard;