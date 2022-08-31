import React, {useCallback, useEffect, useState} from 'react';
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
    Stack, TextInput,
    Tooltip
} from "@contentful/f36-components";
import {Notification} from '@contentful/f36-notification';
import {EditIcon} from '@contentful/f36-icons';
import ButtonUpload from "./components/ButtonUpload";
import CancelUpload from "./components/CancelUpload";
import ProgressBar from "./components/ProgressBar";
import ButtonRetry from "./components/ButtonRetry";
import loadScript from '../../utils/loadScript';
// import tokens from "@contentful/f36-tokens";
import {DoneIcon} from "@contentful/f36-icons";

declare global {
    interface Window {
        _wapiq: any;
        _wq: any;
        wistiaUploader: any;
    }
}

const Wistia = (props: any) => {
    const sdk = useSDK<FieldExtensionSDK>();

    const {viewVideosList} = props;

    const uploaderConfig = {
        accessToken: sdk.parameters.installation.accessToken,
        projectId: sdk.parameters.installation.projectId,
        dropZone: "wistia_upload_drop_zone",
        dropZoneClickable: false,
        customButton: true,
        button: "wistia_upload_button",
    }

    const [status, setStatus] = useState("Drag and drop a video file to upload...");
    const [progress, setProgress] = useState("");
    const [retry, setRetry] = useState(false);
    const [uploadActive, setUploadActive] = useState(false);
    const [editNameOpen, setEditNameOpen] = useState(false);

    const [fileName, setFileName] = useState('');
    const [media, setMedia] = useFieldValue();


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

    const uploadCancelled = (file: any) => {
        setStatus('');
        setFileName('');
        setUploadActive(false);
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

        setStatus('');
        setFileName('');
        setUploadActive(false);
        setRetry(true);
    }, []);

    const uploadSuccess = useCallback((file: any, media: any) => {
        setStatus('');
        setUploadActive(false);
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
        // TODO: remove console.log
        console.log(`Upload media`, media)

        return window.wistiaUploader.unbind;
    }, [sdk, setMedia]);

    const updateName = async (media: any) => {
        console.log(`
        Update media name 
        ${fileName}
        
        Edit name likely 401, due to access token lacking permissions.
        `);

        const response = await fetch(`https://api.wistia.com/v1/${media.id}.json&name=${fileName}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${sdk.parameters.installation.accessToken}`,
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({name: fileName})
        }).then(response => {
            if (response.status === 200) {
                console.log(response.json());
                return response.json();
            }
        }).catch(error => {
            return error;
        });
    }


    useEffect(() => {
        Notification.setPlacement('top', {offset: 30});

        loadScript('//fast.wistia.com/assets/external/api.js').then(() => {
            window._wapiq = window._wapiq || [];
            window._wapiq.push(function (W: any) {
                window.wistiaUploader = new W.Uploader({
                    ...uploaderConfig,
                    // beforeUpload: () => {
                    //     const name = sdk.entry.fields.internalName.getValue();
                    //     const description = sdk.entry.fields.description.getValue();
                    //
                    //     if (name !== undefined) {
                    //         window.wistiaUploader.setFileName(name);
                    //     }
                    //
                    //     if (description !== undefined) {
                    //         window.wistiaUploader.setFileDescription(description);
                    //     }
                    //     console.log(`File name (beforeUpload)`, name);
                    //     console.log(`File description (beforeUpload)`, description);
                    // },
                    // embedCodeOptions: {
                    //     controlsVisibleOnLoad: false,
                    // }
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

    useEffect(() => {
        if (media !== undefined) {
            // @ts-ignore
            setFileName(media.name);
        }
    }, [media]);


    return (
        <>
            {media &&
                <Stack>
                    {!editNameOpen &&
                        <>
                            <Heading>{fileName}</Heading>
                            <Tooltip content="Edit Video Name">
                                <IconButton
                                    aria-label="Edit Video Name"
                                    icon={<EditIcon/>}
                                    variant="secondary"
                                    size="small"
                                    onClick={() => setEditNameOpen(!editNameOpen)}
                                    style={{marginBottom: '1rem'}}
                                />
                            </Tooltip>
                        </>
                    }
                    {editNameOpen &&
                        <FormControl
                            isRequired
                            isInvalid={!fileName}
                            style={{width: '100%'}}
                        >
                            <TextInput.Group>
                                <TextInput
                                    aria-label="Video Name"
                                    value={fileName}
                                    type="text"
                                    name="text"
                                    placeholder="Enter new video name"
                                    onChange={(e) => setFileName(e.target.value)}
                                />
                                <IconButton
                                    aria-label="Edit Done"
                                    icon={<DoneIcon/>}
                                    variant="secondary"
                                    onClick={() => {
                                        setEditNameOpen(!editNameOpen)
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
                </Stack>
            }
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
                        minHeight: '170px',
                        backgroundColor: '#f7f9fa',
                        textAlign: 'center',
                        border: '1px dashed rgb(174, 193, 204)',
                        // borderRadius: tokens.borderRadiusMedium,
                        // backgroundColor: tokens.gray200,
                        // borderTopLeftRadius: tokens.borderRadiusMedium,
                        // borderTopRightRadius: tokens.borderRadiusMedium,
                    }}
                >
                    <Stack spacing="spacingS" margin="spacingM">
                        {!retry &&
                            <ButtonUpload
                                progress={progress}
                                uploadActive={uploadActive}
                            />
                        }
                        {!uploadActive && !retry &&
                            <Button
                                variant="secondary"
                                onClick={viewVideosList}
                            >
                                Select Video
                            </Button>
                        }
                        {uploadActive &&
                            <CancelUpload/>
                        }
                        {retry &&
                            <ButtonRetry progress={progress}/>
                        }
                    </Stack>

                    {status &&
                        <Paragraph>{status}</Paragraph>
                    }

                    {uploadActive &&
                        <ProgressBar progress={progress}/>
                    }

                </Flex>
            </Box>
        </>
    );
}

export default Wistia;