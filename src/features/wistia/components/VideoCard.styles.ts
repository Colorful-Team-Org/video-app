import {css} from "emotion";
import tokens from "@contentful/f36-tokens";

export const styles = {
    videoCard: css({
        position: 'relative',
        height: '100%',
        width: '270px',
        flexDirection: 'column',
        flexWrap: 'wrap',
        borderRadius: tokens.borderRadiusMedium,
        '&:hover': css({
            cursor: 'pointer',
        }),
        '&:focus': css({
            borderColor: '#0059C8',
            boxShadow: '0px 0px 0px 3px #98CBFF',
        }),
        '&:focus-visible': css({
            outline: 'none',
        }),
    }),

    videoCard__skeletonImage: css({
        minHeight: '169px',
        borderRadius: tokens.borderRadiusMedium,
    }),

    videoCard__skeletonText: css({
        height: '36px',
        marginTop: 0
    }),

    thumbnail: css({
        width: '100%',
        minHeight: '169px',
        backgroundColor: tokens.gray100,
        borderRadius: tokens.borderRadiusMedium,
        overflow: 'hidden',
        '> *': css({
            transform: 'scale(1.1)',
            transition: 'all 0.2s ease-in-out',
        }),
    }),

    thumbnailImage: css({
        display: 'none',
    }),

    thumbnailImage__loaded: css({
        display: 'block',
    }),

    timeWrapper: css({
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '100%',
        maxHeight: '169px',
        position: 'absolute',
        right: '0',
    }),

    time: css({
        display: 'flex',
        flexDirection: 'row',
        width: 'fit-content',
        fontSize: tokens.fontSizeS,
        lineHeight: tokens.lineHeightS,
        color: tokens.colorWhite,
        gap: 'spacingXs',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        borderRadius: '3px',
        padding: '0 0.125rem',
        margin: tokens.spacingXs,
        opacity: 0,
        transition: 'all 0.2s ease-in-out',
    }),

    name: css({
        fontSize: tokens.fontSizeM,
        lineHeight: tokens.lineHeightS,
        color: tokens.gray500,
        fontWeight: tokens.fontWeightDemiBold,
        marginTop: '0.25rem',
        inlineSize: '270px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    }),

    project: css({
        fontSize: tokens.fontSizeS,
        lineHeight: tokens.lineHeightS,
        color: tokens.gray500,
        opacity: 0,
        transition: 'all 0.2s ease-in-out',
    }),

    active: css({
        boxShadow: '0 0 0 1px #036fe3',
        '> *': css({
            transform: 'scale(1.2)',
        }),
    }),

    show: css({
        opacity: 1,
    }),
}