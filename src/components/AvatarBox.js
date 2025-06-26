import React, { useState } from 'react';
import { Avatar, Button, Stack, VStack, Text } from '@chakra-ui/react';
import useUserContext from '../react-query/global/useUserQuery';

const AvatarBox = () => {
  const [localstate, setLocalState] = useUserContext();

  return (
    <Stack
      flex={{ base: 1, md: 0 }}
      justify={'space-between'}
      direction={'row'}
      spacing={1}
    >
      {/* <Avatar
        size={'sm'}
        src={
          'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
        }
      /> */}
      {/* <VStack
        display={{ base: 'none', md: 'flex' }}
        //alignItems="flex-start"
        //spacing="1px"
        ml="2"
      > */}
        <Text fontSize="sm">{localstate ? localstate.user : 'unknown'}</Text>
        {/* <Text fontSize="sm" color="black">
          {localstate ? localstate.level : 'unknown'}
        </Text> */}
      {/* </VStack> */}
      {/* <Button
        as={'a'}
        fontSize={'sm'}
        fontWeight={400}
        variant={'link'}
        href={'#'}
      >
        Sign In
      </Button> */}
      <Button
        display={{ base: 'none', md: 'inline-flex' }}
        fontSize={'sm'}
        fontWeight={600}
        color={'white'}
        bg={'pink.400'}
        href={'#'}
        _hover={{
          bg: 'pink.300',
        }}
      >
        Sign Up
      </Button>
    </Stack>
  );
};

export default AvatarBox;
