import {setup} from '@contentful/dam-app-base';
import logo from '../features/wistia/assets/wistia-flags_color.png';

const validateParameters = ({accessToken, projectId}: any) => {
    if (accessToken === undefined) {
        return 'Access Token is required';
    }
    if (projectId === undefined) {
        return 'Project ID is required';
    }
    if (accessToken && accessToken.length < 64) {
        return 'Access Token must be at least 64 characters long';
    }
    if (projectId && projectId.length < 10) {
        return 'Project ID must be at least 10 characters long';
    }
    return null;
}

const ConfigScreen = () => {
//@ts-expect-error
    setup({
        cta: "Wistia",
        logo,
        name: "Wistia Uploader & Media picker",
        color: "#1e64f0",
        description:
            `The application connects with your Wistia account and allows to upload media or link already uploaded videos to your content in Contentful.
            Once the Access Token and Project ID are set, choose which JSON Object fields you want to use for the Wistia Uploader.`,
        parameterDefinitions: [
            {
                "id": "accessToken",
                "type": "Symbol",
                "name": "Wistia Upload Access Token",
                "description": "Here comes the token from the Wistia dashboard -> Settings -> API Access. If you do not have access to Settings, you can request the Upload token from your administrator.",
                "required": true,
            },
            {
                "id": "projectId",
                "type": "Symbol",
                "name": "Wistia Project ID",
                "description": "Provide a valid Project ID to upload media to Wistia. You can find your Project ID in your Wistia account.",
                "required": true,
            },
        ],
        validateParameters,
        isDisabled: () => false,
    });

    return null;
}
export default ConfigScreen;