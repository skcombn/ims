import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
  useDisclosure,
  Show,
} from '@chakra-ui/react';
import { Grid, Group, Modal, SimpleGrid } from '@mantine/core';
import { useAuditlog } from '../react-query/auditlog/useAuditlog';
import CustomReactTable from '../helpers/CustomReactTable';
import UserSearchTable from './UserSearchTable';
import { IconX, IconSearch } from '@tabler/icons-react';

const AuditlogTable = () => {
  const { auditlog } = useAuditlog();
  const [today, setToday] = useState(dayjs().format('YYYY-MM-DD'));
  const [fromdate, setFromDate] = useState(
    dayjs().date(1).format('YYYY-MM-DD')
  );
  const [todate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [userid, setUserId] = useState('');
  const [user, setUser] = useState('');

  const {
    isOpen: isUserSearchOpen,
    onOpen: onUserSearchOpen,
    onClose: onUserSearchClose,
  } = useDisclosure();

  const title = 'Audit Log';

  const columns = useMemo(
    () => [
      {
        header: 'User Id',
        accessorFn: row => row.al_userid,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        id: 'date',
        header: 'Date',
        accessorFn: row => {
          const tDay = new Date(row.al_date);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),
        size: 150,
        filterVariant: 'date',
        sortingFn: 'datetime',
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Time',
        accessorKey: 'al_time',
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        id: 'timestr',
        header: 'Time',
        accessorKey: 'al_timestr',
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Module',
        accessorKey: 'al_module',
        size: 150,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Record',
        accessorKey: 'al_record',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'HIV Id',
        accessorKey: 'al_hivno',
        size: 150,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Malaria Id',
        accessorKey: 'al_malariano',
        size: 150,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Action',
        accessorKey: 'al_action',
        size: 150,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Remark',
        accessorKey: 'al_remark',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleUserSearch = () => {
    onUserSearchOpen();
  };

  const update_UserDetls = data => {
    const { u_userid, u_name } = data;
    setUserId(u_userid);
    setUser(u_name);
  };

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="scroll"
      >
        <HStack align="left" pl={4} py={1}>
          <Grid columns={12}>
            <Grid.Col span={2}>
              <VStack align="flex-start">
                <Heading size="lg">{title}</Heading>
                <Divider border="2px solid teal" />
              </VStack>
            </Grid.Col>
            <Grid.Col span={12}>
              <SimpleGrid>
                <HStack>
                  <VStack align="left" ml={5}>
                    <Text as="b" fontSize="sm" textAlign="left">
                      From Date
                    </Text>
                    <Input
                      //name="today"
                      value={fromdate}
                      type="date"
                      width="full"
                      onChange={e => {
                        setFromDate(e.target.value);
                      }}
                      borderColor="gray.400"
                      //textTransform="capitalize"
                      //ref={ref}
                      placeholder="registration date"
                      minWidth="100"
                    />
                  </VStack>
                  <VStack align="left" ml={1}>
                    <Text as="b" fontSize="sm" textAlign="left">
                      To Date
                    </Text>
                    <Input
                      //name="today"
                      value={todate}
                      type="date"
                      width="full"
                      onChange={e => {
                        setToDate(e.target.value);
                      }}
                      borderColor="gray.400"
                      //textTransform="capitalize"
                      //ref={ref}
                      placeholder="registration date"
                      minWidth="100"
                    />
                  </VStack>
                  <VStack>
                    <HStack>
                      <VStack align="left">
                        <Text as="b" fontSize="sm" textAlign="left">
                          User Id
                        </Text>
                        <Input
                          name="patientid"
                          value={userid}
                          width={150}
                          onChange={e => {
                            setUserId(e.target.value);
                          }}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          //ref={ref}
                          placeholder="user id"
                          //minWidth="50"
                        />
                      </VStack>

                      <Box pt={7}>
                        <Group spacing="xs">
                          <IconButton
                            onClick={() => setUserId('')}
                            icon={<IconX />}
                            size="md"
                            colorScheme="teal"
                            //variant="outline"
                          />
                          <IconButton
                            onClick={() => handleUserSearch()}
                            icon={<IconSearch />}
                            size="md"
                            colorScheme="teal"
                            //variant="outline"
                          />
                        </Group>
                      </Box>
                    </HStack>
                  </VStack>
                  <VStack>
                    <VStack align="left">
                      <Text as="b" fontSize="sm" textAlign="left">
                        User Name
                      </Text>
                      <Input
                        name="user"
                        value={user}
                        width={350}
                        onChange={e => {
                          setUser(e.target.value);
                        }}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        //ref={ref}
                        placeholder="user name"
                        //minWidth="150"
                        readOnly
                        overflowWrap={true}
                      />
                    </VStack>
                  </VStack>
                </HStack>
              </SimpleGrid>
            </Grid.Col>
            <Grid.Col span={12}>
              <CustomReactTable
                title={title}
                columns={columns}
                data={auditlog.filter(r =>
                  r.al_date >= dayjs(fromdate).format('YYYY-MM-DD') &&
                  r.al_date <= dayjs(todate).format('YYYY-MM-DD') &&
                  userid.length > 0
                    ? r.al_userid === userid
                    : {}
                )}
                initialState={{
                  sorting: [
                    { id: 'date', desc: true },
                    { id: 'al_time', desc: true },
                  ],
                  columnVisibility: { al_time: false },
                }}
                disableAddStatus={true}
                disableRowActionStatus={true}
                disableEditStatus={true}
              />
            </Grid.Col>
          </Grid>
        </HStack>
      </Box>
      <Modal opened={isUserSearchOpen} onClose={onUserSearchClose} size="6xl">
        <UserSearchTable
          //state={state}
          //setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_UserDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onUserSearchClose={onUserSearchClose}
        />
      </Modal>
    </Flex>
  );
};

export default AuditlogTable;
