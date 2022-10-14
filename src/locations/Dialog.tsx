import React, {useEffect, useRef, useState} from 'react';
import {
    Spinner, Stack, Heading, Flex, Box, FormControl, TextInput, Paragraph, Subheading,
} from '@contentful/f36-components';
import {DialogExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';
import {Medias} from "../utils/types";
import VideoCard from "../features/wistia/components/VideoCard";
import {cx} from "emotion";
import {styles} from './Dialog.styles';
import {useAsync} from "react-async-hook";


const Dialog = () => {
    const sdk = useSDK<DialogExtensionSDK>();

    const searchInputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [queryResults, setQueryResults] = useState<Medias[] | undefined>();

    const getMediaList = fetch(`https://api.wistia.com/v1/medias.json?type=Video&project_id=${sdk.parameters.installation.projectId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sdk.parameters.installation.accessToken}`
        },
        cache: 'no-cache',
        credentials: 'same-origin',
    });

    const asyncGetMediaList = useAsync(
        async () => {
            const response = await getMediaList.then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    if (response.status === 404) {
                        throw new Error('We could not load the videos list. Please check your Project ID.');
                    }
                    if (response.status === 401) {
                        throw new Error('We could not load the videos list. Please check your access token.');
                    }
                    throw new Error('We could not load the videos list. Bad response from Wistia API.');
                }
            });
            return response;
        }, []);


    const filterMediaList = (query: string) => {
        const filteredList = asyncGetMediaList.result?.filter((media: Medias) => {
            return media.name.toLowerCase().includes(query.toLowerCase());
        });

        if (query.length > 0) {
            setQueryResults(filteredList);
        } else if (query.length === 0) {
            setQueryResults(asyncGetMediaList.result);
        }
    }

    useEffect(() => {
        filterMediaList(query);
    }, [query]);

    useEffect(() => {
        searchInputRef.current?.focus();
    }, [asyncGetMediaList.result]);

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
            if (event.key === 'Escape' && document.activeElement === document.body) {
                sdk.close(null)
            }
        });
    }, []);

    // Dialog close on error, maybe not the best way to surprise the user
    // asyncGetMediaList.error && setTimeout(() => sdk.close(), 6000);


    return (
        <>
            {asyncGetMediaList.loading &&
                <Stack className={cx(styles.loadingWrapper)}>
                    <Heading className={cx(styles.loadingHeading)}>Fetching videos</Heading>
                    <Spinner size="large"/>
                </Stack>
            }
            {asyncGetMediaList.error &&
                <Stack className={cx(styles.loadingWrapper)}>
                    <Heading className={cx(styles.loadingHeading)}>Houston, We’ve Had a Problem</Heading>
                    <Paragraph>{asyncGetMediaList.error.message}</Paragraph>
                </Stack>
            }
            {asyncGetMediaList.result &&
                <>
                    <Box className={cx(styles.searchHeader)}>
                        <FormControl className={cx(styles.searchHeaderInner)}>
                            <TextInput
                                value={query}
                                ref={searchInputRef}
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
                            {asyncGetMediaList.result.length > 0 && !queryResults ? (
                                asyncGetMediaList.result.map((medias: any) => (
                                    <VideoCard
                                        key={medias.id}
                                        medias={medias}
                                        width={270}  // Aspect ratio
                                        height={169} // 16:10
                                        handleKeyboardEvent={handleKeyboardEvent}
                                    />
                                )).reverse()
                            ) : (
                                <>
                                    {queryResults && queryResults?.length > 0 ? (
                                        queryResults.map((medias: any) => (
                                            <VideoCard
                                                key={medias.id}
                                                medias={medias}
                                                width={270}  // Aspect ratio
                                                height={169} // 16:10
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
                                </>
                            )}
                        </Flex>
                    </Box>
                </>
            }
        </>
    );
};

export default Dialog;