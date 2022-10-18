import {useEffect} from "react";
import loadScript from "../src/utils/loadScript";

// Check if the external asset is a Wistia video
const setExternalAssetId = (asset: any) => {
    const { hashed_id, type } = asset;
    if (hashed_id && type === 'Video') {
        return hashed_id;
    }
}

// Wistia Video Player Component
// https://wistia.com/support/developers/embed-options
const WistiaVideo = (props: any) => {
    const {id} = props;

    return (
        <div className="wistia_responsive_padding" style={{padding: '56.25% 0 0 0', position: 'relative'}}>
            <div className="wistia_responsive_wrapper" style={{height: '100%', left: 0, position: 'absolute', top: 0, width: '100%'}}>
                <div className={`wistia_embed wistia_async_${id} controlsVisibleOnLoad=false`} style={{height: '100%', width: '100%'}}>&nbsp;</div>
            </div>
        </div>
    )
}

// Note:
// This is not a part of the app.
// This example assumes that you have created the Content Model with External Asset JSON Object field.
const ExternalAsset = (props: any) => {
    const {externalAsset} = props;

    useEffect(() => {
        loadScript('//fast.wistia.com/assets/external/E-v1.js')
            .catch((error) => {
                throw new Error(error);
            });
    }, [externalAsset]);

    if (externalAsset?.[0] === undefined) {
        if (
            externalAsset !== undefined &&
            externalAsset !== null &&
            externalAsset !== ''
        ) {

            const externalAssetId = setExternalAssetId(externalAsset);

            return (
                <WistiaVideo id={externalAssetId}/>
            )
        }
        return null;
    }
}

export default ExternalAsset;
