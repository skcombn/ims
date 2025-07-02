import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
import {
  Button,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import { IconDoorExit, IconSend } from '@tabler/icons-react';
import { useAddGroup } from '../react-query/groups/useAddGroup';
import { useUpdateGroup } from '../react-query/groups/useUpdateGroup';

const GroupForm = ({ state, statustype, onGroupClose, grouptype }) => {
  const isFetching = useIsFetching();
  const field_width = '150';
  const field_gap = '3';
  const addGroup = useAddGroup();
  const updateGroup = useUpdateGroup();
  const grouptitle = grouptype;

  console.log('groupform', state, grouptitle);

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
      update_Group(values);
    }
    if (statustype === 'add') {
      add_Group(values);
    }
    onGroupClose();
  };

  const handleExit = () => {
    onGroupClose();
  };

  const add_Group = data => {
    addGroup(data);
  };

  const update_Group = data => {
    updateGroup(data);
    onGroupClose();
  };

  /* useEffect(() => {
    setValue('group_category', grouptype);
  }, []);
 */
  return (
    <Flex
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
      >
        <form>
          <Grid templateColumns="repeat(4, 1fr)" gap={1} py={2}>
            <GridItem colSpan={2}>
              <VStack alignItems={'flex-start'} px={1}>
                <Heading size="lg">{grouptype}</Heading>
                <Divider border="2px solid teal" />
              </VStack>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <HStack>
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  //type="submit"
                  variant="outline"
                  size="lg"
                  leftIcon={<IconSend />}
                  isDisabled={isFetching}
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={handleExit}
                  variant="outline"
                  size="lg"
                  leftIcon={<IconDoorExit />}
                >
                  Close
                </Button>
              </HStack>
            </GridItem>
          </Grid>
          <Grid
            templateColumns="9"
            templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid teal"
            borderRadius="20"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="group_category"
                  defaultValue={grouptype}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Category"
                          minWidth={field_width}
                        />
                        <Input
                          name="group_category"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="category"
                          minWidth="100"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="group_desp"
                  defaultValue={state.group_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Description"
                          minWidth={field_width}
                        />
                        <Input
                          name="group_desp"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="description"
                          minWidth="200"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </form>
      </VStack>
    </Flex>
  );
};

export default GroupForm;
