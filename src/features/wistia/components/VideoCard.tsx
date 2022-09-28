import React, {useState} from "react";
import {Asset, Flex, Text} from "@contentful/f36-components";
import {timeDuration, timeSince} from "../../../utils/time";
import {useSDK} from "@contentful/react-apps-toolkit";
import {DialogExtensionSDK} from "@contentful/app-sdk";
import {cx} from "emotion";
import {styles} from "./VideoCard.styles"


const VideoCard = ({key, medias}: any) => {
    const sdk = useSDK<DialogExtensionSDK>();
    const [mediaId, setMediaId] = useState(null);

    const handleMouseOver = (id: any) => {
        setMediaId(id);
    }

    return (
        <Flex
            key={key}
            className={cx(styles.videoCard)}
            onMouseEnter={() => handleMouseOver(medias.id)}
            onMouseLeave={() => handleMouseOver(null)}
            role="button"
            aria-label={medias.name}
            onClick={() => {
                sdk.close(medias); // close the dialog and return the selected value
            }}
        >
            <Asset
                type="image"
                src={medias.thumbnail.url.replace('200x120', '270x169')} // 16:10 aspect ratio
                className={cx(styles.asset,  {[styles.active]: mediaId === medias.id})}
            />
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
    );

};

export default VideoCard;