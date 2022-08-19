import React, {useCallback, useEffect, useState} from 'react';
import {Notification} from '@contentful/f36-components';
import {useFieldValue, useSDK} from '@contentful/react-apps-toolkit';
import loadScript from '../../utils/loadScript';
import DropZone from './components/DropZone';
import {FieldExtensionSDK} from "@contentful/app-sdk";

declare global {
    interface Window {
        _wapiq: any;
        wistiaUploader: any;
    }
}

const WistiaUploader = () => {
    const sdk = useSDK<FieldExtensionSDK>();

    const uploaderConfig = {
        accessToken: sdk.parameters.installation.accessToken,
        projectId: sdk.parameters.installation.projectId,
        dropZone: "wistia_upload_drop_zone",
        dropZoneClickable: false,
        customButton: true,
        button: "wistia_upload_button",
    }

    const [progress, setProgress] = useState("");
    const [status, setStatus] = useState("");
    const [retry, setRetry] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const [file, setFile] = useState(null);
    const [media, setMedia] = useFieldValue();

    const filterErrorMessage = (error: string, query: string) => {
        return error.includes(query);
    }

    const uploadStart = (file: any) => {
        setStatus('Your video is being uploaded.');
        setFile(file.name);
        setIsActive(true);
    }

    const uploadProgress = (file: any, progress: any) => {
        setProgress(Math.round(progress * 100) + "%");
    }

    const uploadCancelled = (file: any) => {
        setStatus('You have cancelled your video upload.');
        setFile(null);
        setIsActive(false);
        setRetry(true);
        Notification.warning(`The video upload has been cancelled!`, {
            cta: {
                label: 'Try again',
                textLinkProps: {
                    variant: 'primary',
                    onClick: () => {
                        Notification.closeAll();
                        window.location.reload();
                    }
                },
            },
        });
    }

    const uploadFailed = useCallback((file: any, errorResponse: any) => {
        const error = errorResponse.error.message.toString();

        const res1 = error.lastIndexOf(":\"");
        const res2 = error.lastIndexOf("\"}");
        const response = error.substring(res1 + 2, res2);

        //TODO: remove console.log(<error filter>)
        if (filterErrorMessage(error, '401')) {
            console.log(`Upload failed: 401, access denied. ${response}`);
        }

        if (filterErrorMessage(error, '403')) {
            console.log(`Upload failed: 403, forbidden. ${response}`);
        }

        if (filterErrorMessage(error, '404')) {
            console.log(`Upload failed: 404, not found. ${response}`);
        }

        Notification.error(`${response}`, {
            cta: {
                label: 'Try again',
                textLinkProps: {
                    variant: 'primary',
                    onClick: () => {
                        Notification.closeAll();
                        window.location.reload();
                    }
                },
            }
        });

        setStatus(`Upload failed. ${response}`);
        setFile(null);
        setIsActive(false);
        setRetry(true);
    }, []);

    const uploadSuccess = useCallback((file: any, media: any) => {
        setStatus(`The video upload has finished! Now you can publish your content.`);
        setIsActive(false);
        setRetry(true);

        if (media !== undefined) {
            const setMediaRef = async () => {
                try {
                    await setMedia(media);
                } catch (error) {
                    return error;
                }
            }
            setMediaRef();
        }

        Notification.success(`Upload successful! ${media.url}`);
        sdk.entry.fields.externalUrl.setValue(media.url);

        return window.wistiaUploader.unbind;
    }, [sdk, setMedia]);

    useEffect(() => {

        loadScript('//fast.wistia.com/assets/external/api.js').then(() => {
            window._wapiq = window._wapiq || [];
            window._wapiq.push(function (W: any) {
                window.wistiaUploader = new W.Uploader({
                    ...uploaderConfig,
                });

                window.wistiaUploader
                    .bind('uploadstart', uploadStart)
                    .bind('uploadprogress', uploadProgress)
                    .bind('uploadcancelled', uploadCancelled)
                    .bind('uploadfailed', uploadFailed)
                    .bind('uploadsuccess', uploadSuccess);

            });
        }).catch((error) => {
            console.log('Error loading Wistia script', error);
        });

        return () => {
            window._wapiq.push({
                revoke: uploaderConfig,
            });
        };
    }, [uploadFailed, uploadSuccess]);

    const PropsDropZone = {
        status,
        progress,
        file,
        retry,
        isActive
    };

    return (
        <DropZone {...PropsDropZone}/>
    );
}

export default WistiaUploader;