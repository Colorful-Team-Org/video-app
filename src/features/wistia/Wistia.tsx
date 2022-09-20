import React, {useEffect, useState} from 'react';
import {useFieldValue, useSDK} from '@contentful/react-apps-toolkit';
import {FieldExtensionSDK} from "@contentful/app-sdk";
import {
    Box,
    Button,
    Flex,
    FormControl,
    Heading,
    IconButton,
    Paragraph,
    Stack,
    TextInput,
    Text,
    TextLink,
    Tooltip
} from "@contentful/f36-components";
import {Notification} from '@contentful/f36-notification';
import tokens from "@contentful/f36-tokens";
import {EditIcon, ExternalLinkIcon, DoneIcon} from '@contentful/f36-icons';
import CancelUpload from "./components/CancelUpload";
import ProgressBar from "./components/ProgressBar";
import loadScript from '../../utils/loadScript';
import {Medias} from "../../utils/types";
import wistiaFetch from "../../utils/wistiaFetch";

declare global {
    interface Window {
        _wapiq: any;
        _wq: any;
        wistiaUploader: any;
    }
}

const Wistia = ({ viewVideosList }: any) => {
    const sdk = useSDK<FieldExtensionSDK>();

    const uploaderConfig = {
        accessToken: sdk.parameters.installation.accessToken,
        projectId: sdk.parameters.installation.projectId,
        dropZone: "wistia_upload_drop_zone",
        dropZoneClickable: false,
        customButton: true,
        button: "wistia_upload_button",
    }

    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState('');
    const [uploadActive, setUploadActive] = useState(false);
    const [editNameShow, setEditNameShow] = useState(false);

    const [fileName, setFileName] = useState('');
    const [wistiaUrl, setWistiaUrl] = useState('');
    const [media, setMedia] = useFieldValue<Medias[] | undefined>();

    const filterErrorMessage = (error: string, query: string) => {
        return error.includes(query);
    }

    const uploadStart = (file: any) => {
        setStatus('Your video upload is starting...');
        setFileName(file.name);
        setUploadActive(true);
    }

    const uploadProgress = (file: any, progress: any) => {
        setStatus('Sending pixie dust to Wistia...');
        setProgress(Math.round(progress * 100) + "%");
    }

    const uploadCancelled = () => {
        setStatus('');
        setFileName('');
        setUploadActive(false);
    }

    const uploadFailed = (file: any, errorResponse: any) => {
        const error = errorResponse.error.message.toString();

        const res1 = error.lastIndexOf(":\"");
        const res2 = error.lastIndexOf("\"}");
        const response = error.substring(res1 + 2, res2);

        //TODO: update error message
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
            title: 'Upload failed',
            cta: {
                label: 'Try again',
                textLinkProps: {
                    variant: 'primary',
                    onClick: () => {
                        Notification.closeAll();
                        //TODO: reset uploader
                        window.location.reload();
                    }
                },
            }
        });

        setStatus('');
        setFileName('');
        setUploadActive(false);
    }

    const uploadSuccess = (file: any, media: any) => {
        console.log(`✅ Uploaded `, media);

        if (media !== undefined) {
            getMediaData(media).then((data) => {
                data.json().then((data) => {
                    setMedia(data);
                    console.log(`💾 Saved: ${data.name} (hashed_id: ${data.hashed_id}) `, data);
                });
            });
        }
        setUploadActive(false);
        setProgress('');
        setStatus('');
        setFileName('');

        return window.wistiaUploader.unbind;
    }

    const getMediaData = (media: any) => wistiaFetch(
        `https://api.wistia.com/v1/medias/${media.id}.json`,
        'GET',
        'application/json',
        `Bearer ${sdk.parameters.installation.accessToken}`,
        null);

    const updateName = (media: any) => wistiaFetch(
        `https://api.wistia.com/v1/medias/${media.hashed_id}.json?name=${fileName}`,
        'PUT',
        'application/x-www-form-urlencoded',
        `Bearer ${sdk.parameters.installation.accessToken}`,
        null
    ).then(data => {
        data.json().then((data) => {
            console.log(`✅ Name updated successfully, response: `, data);
            setMedia({
                ...media,
                name: fileName
            });
        });

        if (!data.ok) {
            console.log(`❌ Error updating name, response: `, data);

            if (data.status === 404) {
                Notification.error(`The video might have been removed from the Wistia platform or the project permissions might have been changed.`, {title: `Video not found`});
            }
        }
    });

    const wistiaUploader = () => {
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
                .bind('uploadsuccess', uploadSuccess)
        })
    }

    useEffect(() => {
        loadScript('//fast.wistia.com/assets/external/api.js')
            .then(() => wistiaUploader())
            .catch((error) => {
                throw new Error(error);
            });
    }, [media]);

    useEffect(() => {
        if (media !== undefined) {
            // @ts-ignore
            setFileName(media.name);
            // @ts-ignore
            setWistiaUrl(`https://contentful.wistia.com/medias/${media.hashed_id}`);
        } else {
            setFileName('');
        }
    }, [media]);

    return (
        <>
            <Stack style={{marginBottom: '1rem'}}>
                {!editNameShow &&
                    <>
                        <Heading style={{margin: 0}}>{fileName}</Heading>
                        {fileName !== '' &&
                            <Tooltip
                                content={uploadActive ? 'You cannot edit the name while uploading' : 'Edit video name'}>
                                <IconButton
                                    aria-label="Edit Video Name"
                                    icon={<EditIcon/>}
                                    variant="secondary"
                                    size="small"
                                    onClick={() => setEditNameShow(!editNameShow)}
                                    isDisabled={uploadActive}
                                />
                            </Tooltip>
                        }
                    </>
                }
                {editNameShow &&
                    <FormControl
                        isRequired
                        isInvalid={!fileName}
                        style={{width: '100%', marginBottom: '0'}}>
                        <TextInput.Group>
                            <TextInput
                                aria-label="Video Name"
                                value={fileName}
                                type="text"
                                name="text"
                                placeholder="Enter new video name"
                                size="small"
                                onChange={(e) => setFileName(e.target.value)}
                            />
                            <IconButton
                                aria-label="Edit Done"
                                icon={<DoneIcon/>}
                                variant="positive"
                                size="small"
                                onClick={() => {
                                    setEditNameShow(!editNameShow)
                                    updateName(media);
                                }}
                            />
                        </TextInput.Group>
                        {!fileName && (
                            <FormControl.ValidationMessage>
                                Please, provide a video name
                            </FormControl.ValidationMessage>
                        )}
                    </FormControl>
                }
                {uploadActive &&
                    <CancelUpload/>
                }
                {media !== undefined &&
                    <Box style={{
                        marginLeft: 'auto',
                        minWidth: '118px',
                    }}>
                        {wistiaUrl &&
                            <TextLink
                                icon={<ExternalLinkIcon/>}
                                alignIcon="end"
                                href={wistiaUrl} target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open in Wistia
                            </TextLink>
                        }
                    </Box>
                }
            </Stack>

            {!media &&
                <Box
                    as="div"
                    id="wistia_upload_drop_zone"
                >
                    <Flex
                        as="div"
                        id="wistia_upload_drop_zone_hover"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        style={{
                            width: '100%',
                            minHeight: '395px',
                            backgroundColor: '#f7f9fa',
                            textAlign: 'center',
                            border: '1px dashed rgb(174, 193, 204)',
                            borderRadius: tokens.borderRadiusMedium,
                        }}
                    >
                        {!uploadActive &&
                            <Stack spacing="spacingS" margin="spacingM">
                                <Button
                                    id="wistia_upload_button"
                                    variant="primary">
                                    Upload Video
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={viewVideosList}>
                                    Select Video
                                </Button>
                            </Stack>
                        }
                        {uploadActive && progress &&
                            <>
                                <Text><strong>{progress} uploaded</strong></Text>
                                <ProgressBar progress={progress}/>
                            </>
                        }
                        <Paragraph
                            style={{color: tokens.gray600}}
                        >
                            {status
                                ? status
                                : "Drag and drop a video file to upload..."
                            }
                        </Paragraph>
                    </Flex>
                </Box>}
        </>
    );
}

export default Wistia;