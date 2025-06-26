import {
  Box,
  Flex,
  Icon,
  chakra,
  Heading,
  CloseAllToastsOptions,
  ToastId,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import { IoMdAlert, IoMdCheckmarkCircle } from 'react-icons/io';

const OnSuccess = ({ title }) => {
  return (
    <Flex>
      <Flex justifyContent="center" alignItems="center" w={12} bg="green.500">
        <Icon as={IoMdCheckmarkCircle} color="white" boxSize={6} />
      </Flex>

      <Box mx={-3} py={2} px={4}>
        <Box mx={3}>
          <chakra.span
            color="green.500"
            _dark={{
              color: 'green.400',
            }}
            fontWeight="bold"
          >
            Success
          </chakra.span>
          <chakra.p
            color="gray.600"
            _dark={{
              color: 'gray.200',
            }}
            fontSize="sm"
          >
            {title}
          </chakra.p>
        </Box>
      </Box>
    </Flex>
  );
};

const OnFail = ({ title }) => {
  return (
    <Flex>
      <Flex justifyContent="center" alignItems="center" w={12} bg="yellow.500">
        <Icon as={IoMdAlert} color="white" boxSize={6} />
      </Flex>

      <Box mx={-3} py={2} px={4}>
        <Box mx={3}>
          <chakra.span
            color="yellow.600"
            _dark={{
              color: 'yellow.300',
            }}
            fontWeight="bold"
          >
            Warning
          </chakra.span>
          <chakra.p
            color="gray.600"
            _dark={{
              color: 'gray.200',
            }}
            fontSize="sm"
          >
            {title}
          </chakra.p>
        </Box>
      </Box>
    </Flex>
  );
};

// a wrapper around Chakra UI's useToast that has my default options applied
export function useCustomToast() {
  return useToast({
    isClosable: true,
    variant: 'subtle',
    position: 'bottom',
    render: ({ title, status }) => (
      <Flex
        maxW="sm"
        w="full"
        mx="auto"
        bg="white"
        _dark={{
          bg: 'gray.800',
        }}
        shadow="md"
        rounded="lg"
        overflow="hidden"
        border="1px solid"
        borderRadius={10}
      >
        {status === 'success' ? <OnSuccess title={title} /> : ''}

        {status === 'warning' ? <OnFail title={title} /> : ''}
      </Flex>
    ),
  });
}
