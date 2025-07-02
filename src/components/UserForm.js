import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Toast } from '../helpers/CustomToastify';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Modal, Select } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useUsers } from '../react-query/users/useUsers';
import { useGroups } from '../react-query/groups/useGroups';
import { useAddGroup } from '../react-query/groups/useAddGroup';
import GroupForm from './GroupForm';

const initial_group = {
  group_desp: '',
  group_category: '',
};

const UserForm = ({
  state,
  setState,
  add_User,
  update_User,
  statustype,
  onFormClose,
}) => {
  const field_width = '180';
  const field_gap = '3';
  const { users } = useUsers();
  const { groups } = useGroups();
  const addGroup = useAddGroup();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');

  const {
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
  } = useDisclosure();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const onSubmit = values => {
    if (statustype === 'edit') {
      update_User(values);
      onFormClose();
    }
    if (statustype === 'add') {
      const { u_userid } = values;
      const found = users.some(
        el => el.u_userid.toLowerCase() === u_userid.toLowerCase()
      );
      if (found) {
        Toast({
          title: `This user no ${u_userid} is existed !`,
          status: 'warning',
          customId: 'useradd',
        });
      } else {
        add_User(values);
        onFormClose();
      }
    }
  };

  const handleExit = () => {
    onFormClose();
  };

  const add_Group = data => {
    addGroup(data);
  };

  const update_Group = data => {
    onGroupClose();
  };

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setState(data);
    onGroupOpen();
  };

  return (
    <Flex
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //alignItems="flex-start"
      >
        <form>
          <Grid templateColumns="repeat(5, 1fr)" gap={1} py={2}>
            <GridItem colSpan={2}>
              <VStack alignItems={'flex-start'} px={1}>
                <Heading size="lg">User Form</Heading>
                <Divider border="2px solid teal" w={300} />
              </VStack>
            </GridItem>
            <GridItem colSpan={2}></GridItem>
            <GridItem>
              <HStack alignItems={'flex-end'} py={2}>
                <ButtonGroup>
                  <Button
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    variant="outline"
                    size="lg"
                  >
                    Submit
                  </Button>
                  <Button
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    onClick={handleExit}
                    variant="outline"
                    size="lg"
                  >
                    Close
                  </Button>
                </ButtonGroup>
              </HStack>
            </GridItem>
          </Grid>
          <Grid
            templateColumns="repeat(6, 1fr)"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid teal"
            borderRadius="10"
          >
            <GridItem colSpan={4} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="u_userid"
                  //defaultValue={state.u_userid}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="User Id"
                          minWidth={field_width}
                        />
                        <Input
                          name="u_userid"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="user id"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="u_name"
                  //defaultValue={state.u_name}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Name"
                          minWidth={field_width}
                        />
                        <Input
                          name="u_name"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="user name"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={4} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="u_email"
                  defaultValue={state.u_email}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Email"
                          minWidth={field_width}
                        />
                        <Input
                          name="u_email"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="email"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={4} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="u_password"
                  defaultValue={state.u_password}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Password"
                          minWidth={field_width}
                        />
                        <Input
                          name="u_password"
                          value={value || ''}
                          width="full"
                          type="password"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="password"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={4} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="u_usergroup"
                    defaultValue={state.u_usergroup}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="User Group"
                            minWidth={field_width}
                          />
                          <Select
                            name="u_usergroup"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            ref={ref}
                            data={groups
                              .filter(r => r.group_category === 'User Group')
                              .map(rec => {
                                return {
                                  value: rec.group_desp,
                                  label: rec.group_desp,
                                };
                              })}
                            nothingFound="None"
                            clearable
                            searchable
                          />
                        </HStack>
                      </InputGroup>
                    )}
                  />
                </FormControl>
                <Box pt={0}>
                  <IconButton
                    onClick={() => handleAddGroup('User Group')}
                    icon={<IconPlus />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={4} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="u_level"
                    defaultValue={state.u_level}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="User Level"
                            minWidth={field_width}
                          />
                          <Select
                            name="u_userlevel"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            ref={ref}
                            data={groups
                              .filter(r => r.group_category === 'User Level')
                              .map(rec => {
                                return {
                                  value: rec.group_desp,
                                  label: rec.group_desp,
                                };
                              })}
                            nothingFound="None"
                            clearable
                            searchable
                          />
                        </HStack>
                      </InputGroup>
                    )}
                  />
                </FormControl>
                <Box pt={0}>
                  <IconButton
                    onClick={() => handleAddGroup('User Level')}
                    icon={<IconPlus />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={4} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="u_jobtitle"
                    defaultValue={state.u_jobtitle}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="Job Title"
                            minWidth={field_width}
                          />
                          <Select
                            name="u_jobtitle"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            ref={ref}
                            data={groups
                              .filter(r => r.group_category === 'Job Title')
                              .map(rec => {
                                return {
                                  value: rec.group_desp,
                                  label: rec.group_desp,
                                };
                              })}
                            nothingFound="None"
                            clearable
                            searchable
                          />
                        </HStack>
                      </InputGroup>
                    )}
                  />
                </FormControl>
                <Box pt={0}>
                  <IconButton
                    onClick={() => handleAddGroup('Job Title')}
                    icon={<IconPlus />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
          </Grid>
        </form>
      </VStack>
      <Modal opened={isGroupOpen} onClose={onGroupClose} size="lg">
        <GroupForm
          state={state}
          setState={setState}
          add_Group={add_Group}
          update_Group={update_Group}
          statustype={groupstatustype}
          onGroupClose={onGroupClose}
          grouptype={grouptype}
        />
      </Modal>
    </Flex>
  );
};

export default UserForm;
