import {Box, Flex} from "@contentful/f36-components";
import StatusDisplayText from "./StatusDisplayText";
import ProgressBar from "./ProgressBar";
import CancelUpload from "./CancelUpload";
import ButtonRetry from "./ButtonRetry";
import ButtonUpload from "./ButtonUpload";
import React from "react";


const DropZone = ({status, progress, file, retry, isActive}: any) => {
    return (
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
                    minHeight: '320px',
                    backgroundColor: '#f7f9fa',
                    textAlign: 'center',
                    border: '1px dashed rgb(174, 193, 204)',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                }}
            >
                <StatusDisplayText
                    status={status}
                    file={file}
                    retry={retry}
                />
                {isActive &&
                    <ProgressBar progress={progress}/>
                }
                {!retry &&
                    <ButtonUpload
                        progress={progress}
                        isActive={isActive}
                    />
                }
                {isActive &&
                    <CancelUpload/>
                }
                {retry &&
                    <ButtonRetry progress={progress}/>
                }
            </Flex>
        </Box>
    );
}

export default DropZone;


