import {Box, Flex, DisplayText, Paragraph, Text} from '@contentful/f36-components';
import React from "react";

const StatusDisplayText = ({file, retry, status}: any) => {

    return (
        <Box>
            {!retry &&
                <Flex flexDirection="column" alignItems="center">
                    <Paragraph
                        marginLeft="spacingXl"
                        marginRight="spacingXl"
                    >
                        {status
                            ? status
                            : 'Drop your video here or'
                        }
                    </Paragraph>
                </Flex>}
            {!retry && file &&
                <Text fontWeight="fontWeightDemiBold">{file}</Text>
            }
        </Box>
    );
}

export default StatusDisplayText;