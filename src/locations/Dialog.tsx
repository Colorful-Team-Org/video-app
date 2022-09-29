import React, {useEffect, useRef, useState} from 'react';
import {
    Spinner, Stack, Heading, Flex, Box, FormControl, TextInput, Paragraph, Subheading,
} from '@contentful/f36-components';
import {Notification} from '@contentful/f36-notification';
import {DialogExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';
import {Medias} from "../utils/types";
import wistiaFetch from "../utils/wistiaFetch";
import VideoCard from "../features/wistia/components/VideoCard";
import {cx} from "emotion";
import {styles} from './Dialog.styles';

const Dialog = () => {
    const sdk = useSDK<DialogExtensionSDK>();

    useEffect(() => {
        sdk.window.startAutoResizer();
        return () => sdk.window.stopAutoResizer();
    }, [sdk]);

    const searchInputRef = useRef<HTMLInputElement>(null);
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
        })
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

    useEffect(() => {
        searchInputRef.current?.focus();
    }, [queryResults]);

    const handleKeyboardEvent = (event: any, medias: any) => {
        if (event.key === 'Escape') {
            if (document.activeElement?.getAttribute('role') === 'button') {
                searchInputRef.current?.focus();
                return
            }
            if (document.activeElement === searchInputRef.current) {
                searchInputRef.current?.blur();
                return
            }
        }
        if (event.key === 'Enter') {
            sdk.close(medias); // close the dialog and return the selected value
        }
    }

    //TODO: add a better Escape key handling
    useEffect(() => {
        document.addEventListener('keydown', (event: any) => {
            if (document.activeElement === document.body) {
                sdk.close(null)
            }
        });
    }, []);

    if (!mediaList) {
        return (
            <Stack className={cx(styles.loadingWrapper)}>
                <Heading className={cx(styles.loadingHeading)}>Fetching videos</Heading>
                <Spinner size="large"/>
            </Stack>
        );
    }

    return (
        <>
            <Box className={cx(styles.searchHeader)}>
                <FormControl className={cx(styles.searchHeaderInner)}>
                    <TextInput
                        value={query}
                        ref={searchInputRef}
                        // ref={searchInput => searchInput && searchInput.focus()}
                        tabIndex={0}
                        type="text"
                        name="Search videos"
                        placeholder="Search videos..."
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => handleKeyboardEvent(e, queryResults)}
                    />
                </FormControl>
            </Box>
            <Box className={cx(styles.videoListWrapper)}>
                <Flex className={cx(styles.videoList)}>
                    {queryResults && queryResults.length > 0 ? (
                        queryResults.map((medias: any) => (
                            <VideoCard
                                key={medias.id}
                                medias={medias}
                                handleKeyboardEvent={handleKeyboardEvent}
                            />
                        )).reverse()) : (
                        <Flex className={cx(styles.noResultsWrapper)}>
                            <Subheading className={cx(styles.noResultsSubheading)}>
                                No results found</Subheading>
                            <Paragraph className={cx(styles.noResultsParagraph)}>
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