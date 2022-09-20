import React, {useEffect, useState} from 'react';
import {
    AssetCard,
    Spinner,
    Stack,
    Heading,
    Flex, Box, FormControl, TextInput, Paragraph, Text, Subheading,
} from '@contentful/f36-components';
import {Notification} from '@contentful/f36-notification';
import {DialogExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';
import {Medias} from "../utils/types";
import tokens from "@contentful/f36-tokens";
import wistiaFetch from "../utils/wistiaFetch";

const Dialog = () => {
    const sdk = useSDK<DialogExtensionSDK>();

    useEffect(() => {
        sdk.window.startAutoResizer();
        return () => sdk.window.stopAutoResizer();
    }, [sdk]);

    const [mediaList, setMediaList] = useState<Medias[] | undefined>();
    const [selected, setSelected] = useState(false)
    const [query, setQuery] = useState('');
    const [queryResults, setQueryResults] = useState<Medias[] | undefined>();

    const getMediaList = wistiaFetch(
        `https://api.wistia.com/v1/medias.json?type=Video&project_id=${sdk.parameters.installation.projectId}`,
        `GET`,
        `application/json`,
        `Bearer ${sdk.parameters.installation.accessToken}`,
        null
    );

    useEffect(() => {
        getMediaList.then((data) => {
            data.json().then((data) => {
                setMediaList(data);
                setQueryResults(data);
            });

            if (!data.ok) {
                if (data.status === 401) {
                    Notification.error('Couldn\'t load videos list. Please check your access token.', {title: 'Unauthorized, 401.'});
                }
                if (data.status === 404) {
                    Notification.error('Couldn\'t load videos list. Please check your Project ID.', {title: 'Project not found, 404.'});
                }
                setTimeout(() => sdk.close('error'), 6000);
            }
        });
    },[]);

    const filterMediaList = (query: string) => {
        if (query.length > 0) {
            // @ts-ignore
            const result: any = mediaList.filter((media: Medias) => {
                return media.name.toLowerCase().includes(query.toLowerCase());
            });
            setQueryResults(result);
        } else if (query.length === 0) {
            setQueryResults(mediaList);
        }
    }

    useEffect(() => {
        filterMediaList(query);
    }, [query]);


    if (!mediaList) {
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
                justifyContent="flex-start"
                gap="1.875rem">
                {queryResults && queryResults.length > 0 ? (
                    queryResults.map((medias: any) => (
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
                    <Flex
                        fullWidth={true}
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center">
                        <Subheading
                            style={{color: tokens.gray600}}>
                            No results found</Subheading>
                        <Paragraph
                            style={{color: tokens.gray600}}>
                            Check your search for typos or try a more generic
                            word.</Paragraph>
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};

export default Dialog;