import React, {useEffect, useState} from 'react';
import {
    AssetCard,
    Spinner,
    Stack,
    Heading,
    Flex
} from '@contentful/f36-components';
import {DialogExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';

const Dialog = () => {
    const sdk = useSDK<DialogExtensionSDK>();

    useEffect(() => {
        sdk.window.startAutoResizer();
        return () => sdk.window.stopAutoResizer();
    }, [sdk]);

    const [media, setMedia] = useState<Medias[] | undefined>();

    const fetchMedia = async () => {
        // const response = await fetch (`https://api.wistia.com/v1/projects/${process.env.REACT_APP_WISTIA_PROJECT_ID}.json`, {
        const response = await fetch(`https://api.wistia.com/v1/medias.json?project_id=${sdk.parameters.installation.projectId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sdk.parameters.installation.accessToken}`,
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            }
        }).catch(error => {
            return error;
        });
        setMedia(response);
    }

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    if (!media) {
        return (
            <Stack
                flexDirection="column"
                style={{
                    minHeight: '100%',
                    justifyContent: 'center',
                    margin: '2rem auto',
            }}>
                <Heading>Fetching media...</Heading>
                <Spinner size="large"/>
            </Stack>
        );
    }

    return (
        <Flex
            justifyContent="space-evenly"
            alignItems="center"
            flexDirection="row"
            flexWrap="wrap"
        >
            {media.map((medias: any) => (
                    <AssetCard
                        key={medias.id}
                        testId={medias.id}
                        type="image"
                        title={`${medias.name}${
                            sdk.parameters.invocation === medias.name ? " (selected)" : ""
                        }`}
                        src={medias.thumbnail.url}
                        size="small"
                        onClick={() => {
                            sdk.close(medias); // close the dialog and return the selected value
                        }}
                    />
                ))}
        </Flex>
    );
};

export default Dialog;

export interface Medias {
    id: number;
    name: string;
    type: string;
    created: Date;
    updated: Date;
    duration: number;
    hashed_id: string;
    description: string;
    progress: number;
    status: string;
    thumbnail: Thumbnail;
    project: Project;
    assets: Asset[];
}

export interface Asset {
    url: string;
    width: number;
    height: number;
    fileSize: number;
    contentType: string;
    type: string;
}

export interface Project {
    id: number;
    name: string;
    hashed_id: string;
}

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}