import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Toast } from '../helpers/CustomToastify';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import { IconSend, IconDoorExit } from '@tabler/icons-react';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';

const SupplierForm = ({
  state,
  setState,
  add_Supp,
  update_Supp,
  statustype,
  onSuppClose,
}) => {
  const isFetching = useIsFetching();
  const field_width = '150';
  const field_gap = '3';
  const { suppliers } = useSuppliers();
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, id },
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
        al_module: 'Suppliers',
        al_action: 'Update',
        al_record: state.s_suppno,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
      // update
      update_Supp(values);
      onSuppClose();
    }
    if (statustype === 'add') {
      const { s_suppno } = values;
      const found = suppliers.some(el => el.s_suppno === s_suppno);
      if (found) {
        Toast({
          title: `This supplier no ${s_suppno} is existed !`,
          status: 'warning',
          customId: 'manuadd',
        });
      } else {
        //add to auditlog
        const auditdata = {
          al_userid: localuser.userid,
          al_user: localuser.name,
          al_date: dayjs().format('YYYY-MM-DD'),
          al_time: dayjs().format('HHmmss'),
          al_timestr: dayjs().format('HH:mm:ss'),
          al_module: 'Suppliers',
          al_action: 'Add',
          al_record: state.s_suppno,
          al_remark: 'Successful',
        };
        addAuditlog(auditdata);
        // add
        add_Supp(values);
        onSuppClose();
      }
    }
  };

  const handleExit = () => {
    onSuppClose();
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
                <Heading size="lg">Supplier Form</Heading>
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
            border="1px solid blue"
            borderRadius="15"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_suppno"
                  defaultValue={state.s_suppno}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Supplier No"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_suppno"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="supplier no"
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
                  name="s_supp"
                  defaultValue={state.s_supp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Supplier Name"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_supp"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="supplier name"
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
                  name="s_add1"
                  defaultValue={state.s_add1}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Address"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_add1"
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
                  name="s_add2"
                  defaultValue={state.s_add2}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Address"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_add2"
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
                  name="s_add3"
                  defaultValue={state.s_add3}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Address"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_add3"
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
                  name="s_add4"
                  defaultValue={state.s_add4}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Address"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_add4"
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
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_phone"
                  defaultValue={state.s_phone}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Phone"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_phone"
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
                  name="s_email"
                  defaultValue={state.s_email}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon children="Email" minWidth={50} />
                        <Input
                          name="s_email"
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
                  name="s_contact"
                  defaultValue={state.s_contact}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Contact"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_contact"
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
                  name="s_fax"
                  defaultValue={state.s_fax}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon children="Fax" minWidth={50} />
                        <Input
                          name="s_fax"
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
          </Grid>
        </form>
      </VStack>
    </Flex>
  );
};

export default SupplierForm;
