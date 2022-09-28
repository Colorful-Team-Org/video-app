import React, {useEffect, useState} from 'react';
import {
    Spinner, Stack, Heading, Flex, Box, FormControl, TextInput, Paragraph, Subheading,
} from '@contentful/f36-components';
import {Notification} from '@contentful/f36-notification';
import {DialogExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';
import {Medias} from "../utils/types";
import tokens from "@contentful/f36-tokens";
import wistiaFetch from "../utils/wistiaFetch";
import VideoCard from "../features/wistia/components/VideoCard";

const Dialog = () => {
    const sdk = useSDK<DialogExtensionSDK>();

    useEffect(() => {
        sdk.window.startAutoResizer();
        return () => sdk.window.stopAutoResizer();
    }, [sdk]);

    const [mediaList, setMediaList] = useState<Medias[] | undefined>();
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
    }, []);

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
                    height: '100vh',
                    justifyContent: 'center',
                }}>
                <Heading style={{color: tokens.gray700}}>Fetching videos</Heading>
                <Spinner size="large"/>
            </Stack>
        );
    }

    return (
        <>
            <Box style={{
                backgroundColor: 'white',
                borderBottom: `1px solid ${tokens.gray300}`,
                paddingTop: '1.5rem',
                position: 'sticky',
                top: 0,
                zIndex: 1,
            }}>
                <FormControl
                    style={{
                        marginLeft: '1.25rem',
                        marginRight: '1.25rem',
                    }}
                >
                    <TextInput
                        value={query}
                        type="text"
                        name="Search videos"
                        placeholder="Search videos..."
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </FormControl>
            </Box>
            <Box style={{margin: '1.25rem'}}>
                <Flex
                    fullWidth={true}
                    flexDirection="row"
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    gap="1.5rem">
                    {queryResults && queryResults.length > 0 ? (
                        queryResults.map((medias: any) => (
                            <VideoCard key={medias.id} medias={medias}/>
                        )).reverse()) : (
                        <Flex
                            fullWidth={true}
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center">
                            <Subheading
                                style={{color: tokens.gray600, marginTop: '2.5rem'}}>
                                No results found</Subheading>
                            <Paragraph
                                style={{color: tokens.gray600}}>
                                Check your search for typos or try a more generic
                                word.</Paragraph>
                        </Flex>
                    )}
                </Flex>
            </Box>
        </>
    );
};

export default Dialog;