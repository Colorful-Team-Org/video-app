import React, {KeyboardEventHandler, useState} from "react";
import {Box, Flex, Text} from "@contentful/f36-components";
import {Skeleton} from '@contentful/f36-skeleton';
import {timeDuration, timeSince} from "../../../utils/time";
import {useSDK} from "@contentful/react-apps-toolkit";
import {DialogExtensionSDK} from "@contentful/app-sdk";
import {cx} from "emotion";
import {styles} from "./VideoCard.styles"
import {Media} from "../../../utils/types";

interface Props {
    medias: Media;
    width: number;
    height: number;
    handleKeyboardEvent: KeyboardEventHandler;
}


const VideoCard = ({medias, width, height, handleKeyboardEvent}: Props) => {
    const sdk = useSDK<DialogExtensionSDK>();
    const [mediaId, setMediaId] = useState(null);
    const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

    const handleMouseOver = (id: any) => {
        setMediaId(id);
    }

    return (
        <>
            <Flex
                className={cx(styles.videoCard)}
                onMouseEnter={() => handleMouseOver(medias.id)}
                onMouseLeave={() => handleMouseOver(null)}
                onFocus={() => handleMouseOver(medias.id)}
                onBlur={() => handleMouseOver(null)}
                onKeyDown={handleKeyboardEvent}
                role="button"
                tabIndex={0}
                aria-label={medias.name}
                onClick={() => {
                    sdk.close(medias); // close the dialog and return the selected value
                }}
            >
                <Box className={cx(styles.thumbnail, {[styles.active]: mediaId === medias.id})}>
                    <img
                        src={medias.thumbnail.url.replace(
                            '200x120',
                            `${width}x${height}`
                        )}
                        width={width}
                        height={height}
                        onLoad={() => setThumbnailLoaded(true)}
                        className={cx(styles.thumbnailImage, {[styles.thumbnailImage__loaded]: thumbnailLoaded})}
                        alt={medias.name}
                    />
                    {!thumbnailLoaded &&
                        <Skeleton.Container className={cx(styles.videoCard__skeletonImage)}>
                            <Skeleton.Image width={270} height={169} offsetTop={0}/>
                        </Skeleton.Container>
                    }
                </Box>
                <Flex className={cx(styles.timeWrapper)}>
                    <Text className={cx(styles.time, {[styles.show]: mediaId === medias.id})}>
                        {timeSince(medias.created)} ago
                    </Text>
                    <Text className={cx(styles.time, {[styles.show]: mediaId === medias.id})}>
                        {timeDuration(medias.duration)}
                    </Text>
                </Flex>
                <Text className={cx(styles.name)}>
                    {medias.name}
                </Text>
                <Text className={cx(styles.project, {[styles.show]: mediaId === medias.id})}>
                    {medias.project.name}
                </Text>
            </Flex>
        </>
    );
};

export default VideoCard;