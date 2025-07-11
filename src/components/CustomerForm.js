import { Controller, useForm } from 'react-hook-form';
import { Toast } from '../helpers/CustomToastify';
import { useIsFetching } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  Button,
  ButtonGroup,
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
import { IconSend, IconDoorExit } from '@tabler/icons-react';
import { useCustomers } from '../react-query/customers/useCustomers';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';

const CustomerForm = ({
  state,
  setState,
  add_Cust,
  update_Cust,
  statustype,
  onCustClose,
}) => {
  const isFetching = useIsFetching();
  const field_width = '150';
  const field_gap = '3';
  const { customers } = useCustomers();
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();

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
      //add to auditlog
      const auditdata = {
        al_userid: localuser.userid,
        al_user: localuser.name,
        al_date: dayjs().format('YYYY-MM-DD'),
        al_time: dayjs().format('HHmmss'),
        al_timestr: dayjs().format('HH:mm:ss'),
        al_module: 'Customers',
        al_action: 'Update',
        al_record: values.c_custno,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
      // update item
      update_Cust(values);
      onCustClose();
    }
    if (statustype === 'add') {
      const { c_custno } = values;
      const found = customers.some(el => el.c_custno === c_custno);
      if (found) {
        Toast({
          title: `This customer no ${c_custno} is existed !`,
          status: 'warning',
          customId: 'custadd',
        });
      } else {
        //add to auditlog
        const auditdata = {
          al_userid: localuser.userid,
          al_user: localuser.name,
          al_date: dayjs().format('YYYY-MM-DD'),
          al_time: dayjs().format('HHmmss'),
          al_timestr: dayjs().format('HH:mm:ss'),
          al_module: 'Customers',
          al_action: 'Add',
          al_record: values.c_custno,
          al_remark: 'Successful',
        };
        addAuditlog(auditdata);
        // update item
        add_Cust(values);
        onCustClose();
      }
    }
  };

  const handleExit = () => {
    onCustClose();
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={'repeat(4,1fr)'} columnGap={3} pb={2}>
            <GridItem colSpan={2}>
              <VStack alignItems={'flex-start'} px={1}>
                <Heading size="lg">Customer Form</Heading>
                <Divider border="2px solid teal" w={250} />
              </VStack>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <ButtonGroup>
                <Button
                  variant={'outline'}
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  leftIcon={<IconSend />}
                  isDisabled={isFetching}
                >
                  Submit
                </Button>
                <Button
                  variant={'outline'}
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={handleExit}
                  leftIcon={<IconDoorExit />}
                >
                  Close
                </Button>
              </ButtonGroup>
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
            borderRadius="20"
            //backgroundColor="blue.50"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_custno"
                  defaultValue={state.c_custno}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Customer No"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_custno"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="customer no"
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
                  name="c_cust"
                  defaultValue={state.c_cust}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Customer Name"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_cust"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="customer name"
                          minWidth="200"
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
                  name="c_add1"
                  defaultValue={state.c_add1}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Address"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_add1"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="address"
                          minWidth="500"
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
                  name="c_add2"
                  defaultValue={state.c_add2}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Address"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_add2"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="address"
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
                  name="c_add3"
                  defaultValue={state.c_add3}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Address"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_add3"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="address"
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
                  name="c_add4"
                  defaultValue={state.c_add4}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Address"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_add4"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="address"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_phone"
                  defaultValue={state.c_phone}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Phone"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_phone"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="phone"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_email"
                  defaultValue={state.c_email}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon children="Email" minWidth={50} />
                        <Input
                          name="c_email"
                          value={value}
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
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_contact"
                  defaultValue={state.c_contact}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Contact"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_contact"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="contact person"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_fax"
                  defaultValue={state.c_fax}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon children="Fax" minWidth={50} />
                        <Input
                          name="c_fax"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="fax"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_area"
                  defaultValue={state.c_area}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Area"
                          minWidth={field_width}
                        />
                        <Input
                          name="c_area"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="area"
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

export default CustomerForm;
