import React, {useEffect, useState} from 'react';
import {
    AssetCard,
    Spinner,
    Stack,
    Heading,
    Flex, Box, FormControl, TextInput, Paragraph, Text,
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
    const [selected, setSelected] = useState(false)
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Medias[] | undefined>();

    const fetchMedia = async () => {
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
        setResults(response);
    }

    useEffect(() => {
        fetchMedia();
    }, []);

    const filterMedia = (query: string) => {
        if (query.length > 0) {
            // @ts-ignore
            const result: any = media.filter((media: Medias) => {
                return media.name.toLowerCase().includes(query.toLowerCase());
            });
            setResults(result);
        } else if (query.length === 0) {
            setResults(media);
        }
    }

    useEffect(() => {
        filterMedia(query);
    }, [query]);


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
        <Box style={{margin: '1.25rem'}}>
            <FormControl>
                <TextInput
                    value={query}
                    type="text"
                    name="Search videos"
                    placeholder="Search videos..."
                    onChange={(e) => setQuery(e.target.value)}
                />
            </FormControl>
            <Flex
                fullWidth={true}
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="space-between"
                gap="spacingM">
                {results && results.length > 0 ? (
                    results.map((medias: any) => (
                        <Flex key={medias.id}
                              flexDirection="column"
                              flexWrap="wrap"
                              gap="spacingXs">
                            <AssetCard
                                type="image"
                                title={`${medias.name}${
                                    sdk.parameters.invocation === medias.name ? " (selected)" : ""
                                }`}
                                src={medias.thumbnail.url}
                                style={{
                                    width: '200px',
                                    height: '121px',
                                    overflow: 'hidden'
                                }}
                                isSelected={selected}
                                onClick={() => {
                                    setSelected(!selected);
                                    sdk.close(medias); // close the dialog and return the selected value
                                }}
                            />
                            <Text
                                fontSize="fontSizeS"
                                lineHeight="lineHeightS"
                                fontColor="gray600"
                                fontWeight="fontWeightDemiBold"
                                style={{
                                    inlineSize: '200px',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                }}>
                                {medias.name}</Text>
                        </Flex>
                    ))) : (
                    <Paragraph>No media found</Paragraph>
                )}
            </Flex>
        </Box>
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