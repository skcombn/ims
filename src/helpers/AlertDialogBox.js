import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

export const AlertDialogBox = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      cancelRef={cancelRef}
      onClose={onClose}
      conConfirm={onConfirm}
      blockScrollOnMount={true}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontFamily="roboto"
            fontWeight="bold"
            fontSize="1.5rem"
          >
            {title}
          </AlertDialogHeader>

          <AlertDialogBody fontFamily="roboto" fontSize="1.25rem">
            {children}
          </AlertDialogBody>

          <AlertDialogFooter>
            {/* <Button ref={cancelRef} onClick={onClose}> */}
            <Button
              w="100px"
              py="0.5rem"
              fontFamily="cursive"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              py="0.5rem"
              w="100px"
              ml={3}
              fontFamily="cursive"
              onClick={() => {
                onClose();
                onConfirm();
              }}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
