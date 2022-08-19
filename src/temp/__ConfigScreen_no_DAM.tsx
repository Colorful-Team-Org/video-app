import React, {useCallback, useState, useEffect} from 'react';
import {AppExtensionSDK} from '@contentful/app-sdk';
import {
    Heading,
    Form,
    Paragraph,
    Flex,
    FormControl,
    Button,
    TextInput,
    Subheading,
    TextLink, Note
} from '@contentful/f36-components';
import {css} from 'emotion';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';

export interface AppInstallationParameters {
    accessToken?: string;
    projectId?: string;
}

const ConfigScreen = () => {
    const [parameters, setParameters] = useState<AppInstallationParameters>({});
    const sdk = useSDK<AppExtensionSDK>();
    const [secret, setSecret] = useState('');
    const [projectId, setProjectId] = useState('5l57vxwax2'); // 'Customer KB' project id
    /*
       To use the cma, inject it as follows.
       If it is not needed, you can remove the next line.
    */
    // const cma = useCMA();

    const onConfigure = useCallback(async () => {
        // This method will be called when a user clicks on "Install"
        // or "Save" in the configuration screen.
        // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

        // Get current the state of EditorInterface and other entities
        // related to this app installation
        const currentState = await sdk.app.getCurrentState();

        return {
            // Parameters to be persisted as the app configuration.
            parameters,
            // In case you don't want to submit any update to app
            // locations, you can just pass the currentState as is
            targetState: currentState,
        };
    }, [parameters, sdk]);

    useEffect(() => {
        // `onConfigure` allows to configure a callback to be
        // invoked when a user attempts to install the app or update
        // its configuration.
        sdk.app.onConfigure(() => onConfigure());
    }, [sdk, onConfigure]);

    useEffect(() => {
        (async () => {
            // Get current parameters of the app.
            // If the app is not installed yet, `parameters` will be `null`.
            const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

            if (currentParameters) {
                setParameters(currentParameters);
            }

            // Once preparation has finished, call `setReady` to hide
            // the loading screen and present the app to a user.
            sdk.app.setReady();
        })();
    }, [sdk]);


    useEffect(() => {
        if (projectId) {
            setParameters({
                ...parameters,
                projectId,
            });
        }
        if (secret) {
            setParameters({
                ...parameters,
                accessToken: secret,
            });
        }
    }, [projectId, secret]);

    const {ids} = sdk;
    const {space, environment} = ids;

    return (
        <Flex flexDirection="column" className={css({margin: '80px auto', maxWidth: '800px'})}>
            <Form>
                <Heading>Wistia App</Heading>
                <Paragraph>Install the app to add external assets from Wistia straight into Contentful. Hey! You can
                    upload the media to Wistia too!</Paragraph>
                <Subheading>Wistia App configuration</Subheading>
                <FormControl>
                    <FormControl.Label isRequired>Wistia access token</FormControl.Label>
                    <TextInput
                        maxLength={64}
                        type="password"
                        onChange={(e) => setSecret(e.target.value)}
                        value={secret}
                    />
                    <Flex justifyContent="space-between">
                        <FormControl.HelpText>
                            Provide a valid token to upload media to Wistia.
                        </FormControl.HelpText>
                    </Flex>
                </FormControl>
                <FormControl>
                    <FormControl.Label
                        isRequired
                        style={{width: '100%'}}
                    >
                        Wistia Project ID
                    </FormControl.Label>
                    <TextInput
                        maxLength={10}
                        type="text"
                        isDisabled
                        value={(parameters && parameters.projectId) || ''}
                        style={{width: '100%', maxWidth: '150px'}}
                    />
                    <Flex justifyContent="space-between">
                        <FormControl.HelpText>
                            At the moment the Project ID is fixed to 'Customer KB' at contentful.wistia.com.
                        </FormControl.HelpText>
                    </Flex>
                </FormControl>
                <Subheading>Assign to fields</Subheading>
                <Paragraph>
                    This app can only be used with <strong>JSON object</strong> fields.
                </Paragraph>
                <Note>
                    <strong>Note:</strong> Please assign the app to a external wrapper field after installation of the app.
                    Config screen requires some tweaking to render the content type fields.
                </Note>
            </Form>
        </Flex>
    );

};


export default ConfigScreen;
