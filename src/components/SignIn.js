import dayjs from "dayjs";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  VStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toast } from "../helpers/CustomToastify";
import { useUsers } from "../react-query/users/useUsers";
import { useUpdateUser } from "../react-query/users/useUpdateUser";
import { useAddAuditlog } from "../react-query/auditlog/useAddAuditlog";
import useLocalStorageState from "use-local-storage-state";
import { user_localstorage_key } from "../utils/constants";
import ReactEncrypt from "react-encrypt";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
const secretPass = "XkhZG4fW2t2W";

const SignIn = () => {
  const [encrptedData, setEncrptedData] = useState("");
  const [decrptedData, setDecrptedData] = useState("");
  const [localstate, setLocalState, { removeItem }] = useLocalStorageState(
    user_localstorage_key
  );
  const { users, setUserId } = useUsers();
  const updateUser = useUpdateUser();
  const addAuditlog = useAddAuditlog();

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, id },
  } = useForm();

  const encryptData = (text) => {
    const encryptedText = ReactEncrypt.encrypt(text);

    setEncrptedData(encryptedText);
    console.log("enctext", encryptedText);
  };

  const decryptData = (text) => {};

  const handleSignIn = (data) => {
    const user = users && users.filter((r) => r.u_userid === data.userid);

    if (user && user.length > 0) {
      const { u_password, u_name } = user[0];

      if (data.password !== u_password) {
        //add to auditlog
        const auditdata = {
          al_userid: data.userid,
          al_user: data.name,
          al_date: dayjs().format("YYYY-MM-DD"),
          al_time: dayjs().format("HHmmss"),
          al_timestr: dayjs().format("HH:mm:ss"),
          al_module: "Sign In",
          al_action: "Log in",
          al_record: "",
          al_remark: "Invalid password",
        };
        addAuditlog(auditdata);

        Toast({
          title: "Invalid UserId / Password",
          status: "warning",
        });
      } else {
        setLocalState({ userid: data.userid, name: u_name });
        //add to auditlog
        const auditdata = {
          al_userid: data.userid,
          al_user: u_name,
          al_date: dayjs().format("YYYY-MM-DD"),
          al_time: dayjs().format("HHmmss"),
          al_timestr: dayjs().format("HH:mm:ss"),
          al_module: "Sign In",
          al_action: "Log in",
          al_record: "",
          al_remark: "Successful",
        };
        addAuditlog(auditdata);
      }
    } else {
      Toast({
        title: "Invalid UserId",
        status: "warning",
      });
      //add to auditlog
      const auditdata = {
        al_userid: data.userid,
        al_user: data.name,
        al_date: dayjs().format("YYYY-MM-DD"),
        al_time: dayjs().format("HHmmss"),
        al_timestr: dayjs().format("HH:mm:ss"),
        al_module: "Sign In",
        al_action: "Log in",
        al_record: "",
        al_remark: "Invalid user id",
      };
      addAuditlog(auditdata);
    }
  };

  const handleChangePW = (data) => {
    const { userid, userid2, currpw, newpw, newpwconfirm } = data;
    const user = users.filter((r) => r.u_userid === userid2);

    if (user.length > 0) {
      if (currpw === user[0].u_password) {
        if (newpw === newpwconfirm) {
          //change pw
          const { id, u_id, ...fields } = user[0];
          const updRec = { ...fields, u_password: newpw };
          updateUser({ id, ...updRec });
        } else {
          Toast({
            title: "Invalid new password / confirm password",
            status: "warning",
          });
        }
      } else {
        Toast({
          title: "Invalid UserId / Password",
          status: "warning",
        });
      }
    } else {
      Toast({
        title: "Invalid UserId / Password",
        status: "warning",
      });
    }
  };

  return (
    <Container
      mt={16}
      maxW="lg"
      py={{ base: "12", md: "20" }}
      px={{ base: "0", sm: "8" }}
      border="1px solid teal"
      boxShadow={{ base: "none", sm: useColorModeValue("md", "md-dark") }}
      borderRadius={{ base: "none", sm: "xl" }}
      bg="olive.50"
    >
      <Stack spacing="8">
        <Stack spacing="6">
          {/* <Logo /> */}
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading
              size={useBreakpointValue({ base: "xs", md: "md" })}
              color="teal"
              letterSpacing={1}
              pb="5"
              fontWeight={800}
              fontFamily="sans-serif"
            >
              INVENTORY MANAGEMENT SYSTEM
            </Heading>
            <Heading size={useBreakpointValue({ base: "xs", md: "md" })}>
              User Log in
            </Heading>
            {/* <HStack spacing="1" justify="center">
            <Text color="muted">Don't have an account?</Text>
            <Button variant="link" colorScheme="blue">
            Sign up
            </Button>
          </HStack> */}
          </Stack>
        </Stack>
        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          //bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
          //bg={useBreakpointValue({ base: "transparent", sm: "teal.50" })}
          boxShadow={{ base: "none", sm: useColorModeValue("md", "md-dark") }}
          borderRadius={{ base: "none", sm: "xl" }}
          border="1px solid"
          borderColor="teal.200"
        >
          <form>
            <Stack spacing="6">
              <Tabs isFitted>
                <TabList>
                  <Tab>SignIn</Tab>
                  <Tab>Change Password</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Stack spacing="5">
                      <FormControl>
                        <Controller
                          control={control}
                          name="userid"
                          //defaultValue={localstate[0].user || ''}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left">
                              <Text as="b" fontSize="sm" textAlign="left">
                                User ID
                              </Text>
                              <Input
                                name="userid"
                                value={value || ""}
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="user id"
                                minWidth="100"
                              />
                            </VStack>
                          )}
                        />
                      </FormControl>
                      <FormControl>
                        <Controller
                          control={control}
                          name="password"
                          //defaultValue={invoice.sls_no || ''}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left">
                              <Text as="b" fontSize="sm" textAlign="left">
                                Password
                              </Text>
                              <Input
                                name="password"
                                value={value || ""}
                                type="password"
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="password"
                                minWidth="100"
                              />
                            </VStack>
                          )}
                        />
                      </FormControl>
                    </Stack>
                    <Stack spacing="6" pt={2}>
                      <Button
                        variant="solid"
                        colorScheme={"teal"}
                        onClick={handleSubmit(handleSignIn)}
                      >
                        Sign in
                      </Button>
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <Stack spacing="5">
                      <FormControl>
                        <Controller
                          control={control}
                          name="userid2"
                          //defaultValue={localstate[0].user || ''}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left">
                              <Text as="b" fontSize="sm" textAlign="left">
                                User ID
                              </Text>
                              <Input
                                name="userid2"
                                value={value || ""}
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="user id"
                                minWidth="100"
                              />
                            </VStack>
                          )}
                        />
                      </FormControl>
                      <FormControl>
                        <Controller
                          control={control}
                          name="currpw"
                          //defaultValue={localstate[0].user || ''}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left">
                              <Text as="b" fontSize="sm" textAlign="left">
                                Current PW
                              </Text>
                              <Input
                                name="currpw"
                                value={value || ""}
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="current pw"
                                minWidth="100"
                              />
                            </VStack>
                          )}
                        />
                      </FormControl>
                      <FormControl>
                        <Controller
                          control={control}
                          name="newpw"
                          //defaultValue={invoice.sls_no || ''}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left">
                              <Text as="b" fontSize="sm" textAlign="left">
                                New PW
                              </Text>
                              <Input
                                name="newpw"
                                value={value || ""}
                                type="password"
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="new password"
                                minWidth="100"
                              />
                            </VStack>
                          )}
                        />
                      </FormControl>
                      <FormControl>
                        <Controller
                          control={control}
                          name="newpwconfirm"
                          //defaultValue={invoice.sls_no || ''}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left">
                              <Text as="b" fontSize="sm" textAlign="left">
                                Confirm PW
                              </Text>
                              <Input
                                name="newpwconfirm"
                                value={value || ""}
                                type="password"
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="password"
                                minWidth="100"
                              />
                            </VStack>
                          )}
                        />
                      </FormControl>
                    </Stack>
                    <Stack spacing="6" pt={2}>
                      <Button
                        variant="solid"
                        size="md"
                        colorScheme={"teal"}
                        onClick={handleSubmit(handleChangePW)}
                      >
                        Update Password
                      </Button>
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default SignIn;
