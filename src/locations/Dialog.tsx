import {KeyboardEventHandler, useCallback, useEffect, useRef, useState} from 'react';
import {
    Spinner, Stack, Heading, Flex, Box, FormControl, TextInput, Paragraph, Subheading,
} from '@contentful/f36-components';
import {DialogExtensionSDK} from '@contentful/app-sdk';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';
import {Media} from "../utils/types";
import VideoCard from "../features/wistia/components/VideoCard";
import {cx} from "emotion";
import {styles} from './Dialog.styles';
import {useAsync} from "react-async-hook";


const Dialog = () => {
    const sdk = useSDK<DialogExtensionSDK>();

    const searchInputRef = useRef<HTMLInputElement>(null);
    const [queryResults, setQueryResults] = useState<Media[] | undefined>();

    const asyncGetMediaList = useAsync(
        async (projectId?: string) => {
            if (!projectId) {
                throw new Error('We could not load the videos list. Please check your Project ID.');
            }
            const response = await fetch(`https://api.wistia.com/v1/medias.json?type=Video&project_id=${projectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sdk.parameters.installation.accessToken}`
                },
                cache: 'no-cache',
                credentials: 'same-origin',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('We could not load the videos list. Please check your Project ID.');
                }
                if (response.status === 401) {
                    throw new Error('We could not load the videos list. Please check your access token.');
                }
                throw new Error('We could not load the videos list. Bad response from Wistia API.');
            }
            return await response.json() as Media[]
        }, [sdk.parameters.installation.projectId]);

    const handleQueryInput = useCallback((query: string) => {
        if (!query.length) {
            setQueryResults(asyncGetMediaList.result);
            return;
        }
        const filteredList = asyncGetMediaList.result?.filter((media: Media) => {
            return media.name.toLowerCase().includes(query.toLowerCase());
        });
        setQueryResults(filteredList);
    }, [asyncGetMediaList.result]);

    const handleInputKeyboardEvent: KeyboardEventHandler = event => {
        if (event.key === 'Escape') {
            if (document.activeElement?.getAttribute('role') === 'button') {
                searchInputRef.current?.focus();
                return;
            }
            if (document.activeElement === searchInputRef.current) {
                searchInputRef.current?.blur();
                return;
            }
        }
        if (event.key === 'Enter') {
            sdk.close(queryResults); // close the dialog and return the selected value
        }
    }

    //TODO: add a better Escape key handling
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && document.activeElement === document.body) {
                sdk.close(null);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [sdk]);

    // Dialog close on error, maybe not the best way to surprise the user
    // asyncGetMediaList.error && setTimeout(() => sdk.close(), 6000);

    useEffect(() => {
        searchInputRef.current?.focus();
    }, [asyncGetMediaList.result]);


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
                                // value={query}
                                ref={searchInputRef}
                                tabIndex={0}
                                type="text"
                                name="Search videos"
                                placeholder="Search videos..."
                                onChange={(e) => handleQueryInput(e.target.value)}
                                onKeyDown={(e) => handleInputKeyboardEvent(e)}
                            />
                        </FormControl>
                    </Box>
                    <Box className={cx(styles.videoListWrapper)}>
                        <Flex className={cx(styles.videoList)}>
                            {asyncGetMediaList.result.length > 0 && !queryResults ? (
                                asyncGetMediaList.result.map(medias => (
                                    <VideoCard
                                        key={medias.id}
                                        medias={medias}
                                        width={270}  // Aspect ratio
                                        height={169} // 16:10
                                        handleKeyboardEvent={handleInputKeyboardEvent}
                                    />
                                )).reverse()
                            ) : (
                                <>
                                    {queryResults?.length ? (
                                        queryResults.map(medias => (
                                            <VideoCard
                                                key={medias.id}
                                                medias={medias}
                                                width={270}  // Aspect ratio
                                                height={169} // 16:10
                                                handleKeyboardEvent={handleInputKeyboardEvent}
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