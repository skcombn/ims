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
import { IoMdAlert } from 'react-icons/io';

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
        border="1px solid black"
        borderRadius={15}
      >
        <Flex justifyContent="center" alignItems="center" w={20} bg="blue.500">
          <Icon as={IoMdAlert} color="white" boxSize={6} />
        </Flex>
        <Box mx={-3} py={2} px={4}>
          <Box mx={3}>
            <chakra.span
              color="blue.500"
              _dark={{
                color: 'blue.400',
              }}
              fontWeight="bold"
            >
              <Heading size="md">{status}</Heading>
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
    ),
  });
}
