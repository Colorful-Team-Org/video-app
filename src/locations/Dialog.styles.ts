import {css} from "emotion";
import tokens from "@contentful/f36-tokens";

export const styles = {
    loadingWrapper: css({
        flexDirection: 'column',
        height: 'calc(100ch - 170px)',
        justifyContent: 'center',
    }),

    loadingHeading: css({
        color: tokens.gray700,
    }),

    searchHeader: css({
        backgroundColor: 'white',
        paddingTop: '1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 1,
    }),

    searchHeaderInner: css({
        marginLeft: '4.435rem',
        marginRight: '4.435rem',
        marginBottom: '0',
        paddingBottom: '1.5rem',
    }),

    videoListWrapper: css({
        margin: '1.25rem 4.435rem',
    }),

    videoList: css({
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: '1.5rem',
        width: '100%',
    }),

    noResultsWrapper: css({
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    }),

    noResultsSubheading: css({
        color: tokens.gray600,
        marginTop: '2.5rem',
    }),

    noResultsParagraph: css({
        color: tokens.gray600,
    }),

}