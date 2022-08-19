import {setup} from '@contentful/dam-app-base';
import logo from '../temp/cloud-upload-outline.svg';

const validateParameters = ({accessToken, projectId}: any) => {
    if (accessToken === undefined) {
        return 'accessToken is required';
    }
    if (projectId === undefined) {
        return 'projectId is required';
    }
    return null;
}

const ConfigScreen = () => {
//@ts-expect-error
    setup({
        cta: "Wistia",
        logo,
        name: "Wistia Uploader",
        color: "#F7F9FA",
        description:
            "TInstall the app to add external assets from Wistia straight into Contentful. Hey! You can\n" +
            "                    upload the media to Wistia too!",
        parameterDefinitions: [
            {
                "id": "accessToken",
                "type": "Symbol",
                "name": "Wistia Upload Access Token",
                "description": "Provide a valid token to upload media to Wistia.",
                "required": true
            },
            {
                "id": "projectId",
                "type": "Symbol",
                "name": "Wistia Project ID",
                "description": "Provide a valid Project ID to upload media to Wistia. At the moment the Project ID is fixed to 'Customer KB' at contentful.wistia.com.",
                "required": true,
                "default": "5l57vxwax2"
            },
        ],
        validateParameters,
        isDisabled: () => false,
    });

    return null;
}
export default ConfigScreen;