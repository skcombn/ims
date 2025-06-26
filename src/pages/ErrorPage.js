import React from 'react';
import { Link as ReactLink } from 'react-router-dom';
import { TiArrowBack } from 'react-icons/ti';
import { Box, Container, Heading, Icon, Link, HStack } from '@chakra-ui/react';

const fixedHeight = '115';

const ErrorPage = () => {
  return (
    <Container w="100%" h="600" align="center">
      <Box mt={100} w="100%" h="100%" align="center" pt={fixedHeight}>
        <Heading>404</Heading>
        <Heading size="md">Sorry, the page you tried cannot be found</Heading>
        <Link as={ReactLink} to="/">
          <HStack pt="20" pl="38%">
            <Icon as={TiArrowBack} boxSize={30} />
            <Heading size="md" color="red">
              Back Home
            </Heading>
          </HStack>
        </Link>
      </Box>
    </Container>
  );
};

export default ErrorPage;
