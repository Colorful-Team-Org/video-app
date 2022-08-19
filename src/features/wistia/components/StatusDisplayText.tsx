import {Box, Flex, DisplayText, Paragraph, Text} from '@contentful/f36-components';
import React from "react";

const StatusDisplayText = ({ file, retry, status }: any) => {

  return (
      <Box>
        <Flex flexDirection="column" alignItems="center">
          {!retry &&
              <DisplayText>
                Hello!{' '}
                <span role="img" aria-label="Hand wave">👋️</span>
              </DisplayText>
          }
          {retry && !status.includes('failed') && !status.includes('finished') &&
              <DisplayText>
                There is always another time!{' '}
                <span role="img" aria-label="Wink face">😉</span>
              </DisplayText>
          }
          {retry && status.includes('failed') &&
              <DisplayText>
                Oops!{' '}
                <span role="img" aria-label="Thinking face">🤔</span>
              </DisplayText>
          }
          {retry && status.includes('finished') &&
              <DisplayText>
                Success!{' '}
                <span role="img" aria-label="Celebrate">🎉</span>
              </DisplayText>
          }
          <Paragraph
              marginLeft="spacingXl"
              marginRight="spacingXl"
          >
            {status
                ? status
                : 'Drop your video here or'
            }
          </Paragraph>
        </Flex>
        {file &&
            <Text fontWeight="fontWeightDemiBold">{file}</Text>
        }
      </Box>
  );
}

export default StatusDisplayText;