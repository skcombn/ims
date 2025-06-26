import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { round } from 'lodash';
import dayjs from 'dayjs';
import { Toast } from '../helpers/CustomToastify';
import axios from 'axios';
import { nanoid } from 'nanoid';
import {
  AddIcon,
  SearchIcon,
  ViewIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons';
import { IconDoorExit, IconPencilCancel, IconSend } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PDFPic from '../assets/pdfformat.jpg';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  //Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useRadio,
  useRadioGroup,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  ActionIcon,
  Checkbox,
  Modal,
  NumberInput,
  Select,
  Switch,
  Tabs,
} from '@mantine/core';
import { useRecoilState } from 'recoil';
import { itemState, editItemIdState } from '../data/atomdata';
import { useItems } from '../react-query/items/useItems';
import { useAddItem } from '../react-query/items/useAddItem';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useItemsHistory } from '../react-query/itemshistory/useItemsHistory';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import { useItemsSerial } from '../react-query/itemsserial/useItemsSerial';
import { useTrans } from '../react-query/trans/useTrans';
import { useTransDetls } from '../react-query/transdetls/useTranDetls';
import { useGroups } from '../react-query/groups/useGroups';
import { useAddGroup } from '../react-query/groups/useAddGroup';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import ItemHistDetlsTable from './ItemHistDetlsTable';
import ItemHistLotTable from './ItemHistLotTable';
import GroupForm from './GroupForm';
import SupplierSearchTable from './SupplierSearchTable';
import ItemHistOnOrderTable from './ItemHistOnOrderTable';
import ItemHistSerialTable from './ItemHistSerialTable';
//import ManufacturerSearchTable from "./ManufacturerSearchTable";
//import DropBox from "../helpers/DropBox";

//const FileViewers = React.lazy(() => import("../helpers/FileViewers"));
//const UPLOADURL = 'https://192.168.0.103:4000/upload-avatar';
//const DOWNLOADURL = 'https://res.cloudinary.com/v1_1/dlmzwvakr/image/upload';
//const UPLOADPRESET = 'appsmiths';
const UPLOADURL = process.env.REACT_APP_API_URL_FILESUPLOAD;
const DOWNLOADURL = process.env.REACT_APP_API_URL_FILESDOWNLOAD;

const initial_group = {
  group_desp: '',
  group_category: '',
};

const initial_totals = {
  totpoqty: 0,
  totpoamt: 0,
  totadjustqty: 0,
  totadjustamt: 0,
  totportnqty: 0,
  totportnamt: 0,
  totsalesqty: 0,
  totsalesamt: 0,
  totsalesrtnqty: 0,
  totsalesrtnamt: 0,
  totqtyonhand: 0,
  totamount: 0,
};

const ItemForm = () => {
  const navigate = useNavigate();
  const isFetching = useIsFetching();
  const field_width = '150';
  const field_gap = '3';
  const { items } = useItems();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const { itemshistory, setItemHistId } = useItemsHistory();
  const { itemsexpiry, setItemExpId } = useItemsExpiry();
  const { itemsserial, setItemSerialId } = useItemsSerial();
  const { trans } = useTrans();
  const { transdetls } = useTransDetls();
  const { groups } = useGroups();
  const addGroup = useAddGroup();
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();
  const [grouptype, setGrouptype] = useState('');
  const [groupstate, setGroupState] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');
  const [state, setState] = useRecoilState(itemState);
  const [editItemId, setEditItemId] = useRecoilState(editItemIdState);
  const [isnonstock, setIsnonstock] = useState(false);
  const [itemtype, setItemtype] = useState(false);
  const [files, setFiles] = useState([]);
  //const [image, setImage] = useRecoilState(viewImageState);
  const [images, setImages] = useState([]);
  const [uploadfiles, setUploadfiles] = useState([]);
  const [newFile, setNewFile] = useState({});
  const [filterText, setFilterText] = useState('');
  const [attachmentstate, setAttachmentState] = useState({});
  const [viewfile, setViewFile] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [totals, setTotals] = useState(initial_totals);
  const [isCalc, setIsCalc] = useState(false);
  const [totqtyonorder, setTotQtyOnOrder] = useState(0);
  const [expirychecked, setExpiryChecked] = useState(false);
  const [serialchecked, setSerialChecked] = useState(false);
  const [inactive, setInactive] = useState(false);

  const {
    isOpen: isViewImageOpen,
    onOpen: onViewImageOpen,
    onClose: onViewImageClose,
  } = useDisclosure();

  const {
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
  } = useDisclosure();
  const {
    isOpen: isSupplierSearchOpen,
    onOpen: onSupplierSearchOpen,
    onClose: onSupplierSearchClose,
  } = useDisclosure();

  const {
    isOpen: isAlertDeleteAttachmentOpen,
    onOpen: onAlertDeleteAttachmentOpen,
    onClose: onAlertDeleteAttachmentClose,
  } = useDisclosure();

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const itemsonorder = transdetls
    .filter(
      r =>
        r.tl_trantype === 'Purchase' &&
        r.tl_post === '0' &&
        r.tl_itemno === state.item_no
    )
    .map(rec => {
      return { ...rec };
    });

  const itemslotdata = itemsexpiry
    .filter(r => r.ie_itemno === state.item_no && r.ie_post === '0')
    .map(rec => {
      return { ...rec };
    });

  console.log('lots', itemslotdata);
  /*  const itemsserialdata = itemsserial
    .filter((r) => r.is_post === "0" && r.is_itemno === state.item_no)
    .map((rec) => {
      return { ...rec };
    });

  console.log("serial state", itemsserialdata);
 */
  const handleViewImage = data => {
    console.log('image view', data);
    const downloadurl = `${DOWNLOADURL}/${data.ia_src}`;
    //console.log('downloadurl', uploadurl);
    setViewFile(prev => downloadurl);
    onViewImageOpen();
  };

  const handleDeleteImage = data => {
    console.log('image delete', data);
  };

  const onSubmit = values => {
    const { item_no } = values;
    const found = items.some(el => el.item_no === item_no);

    if (editItemId.status === 'edit') {
      //add to auditlog
      const auditdata = {
        al_userid: localuser.userid,
        al_user: localuser.name,
        al_date: dayjs().format('YYYY-MM-DD'),
        al_time: dayjs().format('HHmmss'),
        al_timestr: dayjs().format('HH:mm:ss'),
        al_module: 'Items',
        al_action: 'Update',
        al_record: item_no,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
      // update item
      update_Item(values);
      navigate(-1);
    }
    if (editItemId.status === 'add') {
      if (found) {
        Toast({
          title: `This item no ${item_no} is existed!`,
          status: 'warning',
          customId: 'itemupdAdd',
        });
      } else {
        //add to auditlog
        const auditdata = {
          al_userid: localuser.userid,
          al_user: localuser.name,
          al_date: dayjs().format('YYYY-MM-DD'),
          al_time: dayjs().format('HHmmss'),
          al_timestr: dayjs().format('HH:mm:ss'),
          al_module: 'Items',
          al_action: 'Add',
          al_record: item_no,
          al_remark: 'Successful',
        };
        addAuditlog(auditdata);
        add_Item(values);
        navigate(-1);
      }
    }
  };

  const onDrop2 = acceptedFiles => {
    console.log('acceptedfiles', acceptedFiles);
    acceptedFiles.forEach(file => {
      setFiles(
        prev =>
          (prev = [
            ...files,
            ...[
              {
                name: file.name,
                preview: URL.createObjectURL(file),
                type: file.type,
              },
            ],
          ])
      );

      Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
    });

    const allfiles = [...files, ...acceptedFiles];
    setFiles(allfiles);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const add_Group = data => {
    addGroup(data);
  };

  const update_Group = data => {
    //updateGroup(data);
    onGroupClose();
  };

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setGroupState(data);
    onGroupOpen();
  };

  const handleSupplierSearch = () => {
    onSupplierSearchOpen();
  };

  const update_SuppDetls = data => {
    const { s_suppno, s_supp } = data;
    // setInvoice(
    //   prev => (prev = { ...invoice, po_suppno: s_suppno, po_supp: s_supp })
    // );
    setValue('item_suppno', s_suppno);
    setValue('item_supplier', s_supp);
  };

  const handleDeleteAttachment = rowData => {
    setAttachmentState(prev => (prev = { ...rowData }));
    onAlertDeleteAttachmentOpen();
  };

  const handleOnDeleteAttachmentConfirm = () => {
    const { ia_id } = attachmentstate;
    /*  const updatedData = attachments
      .filter((r) => r.ia_id !== ia_id)
      .map((rec) => {
        return { ...rec };
      }); */
    // setAttachments((prev) => (prev = updatedData));
    //deleteItemAttachment(state);
  };

  /* const handleViewFile = type => {
    switch (type) {
      case '1':
        const newImage = { url: 'c:\testguitar.jpg', name: 'guitar' };
        setImage(prev => newImage);
        //const type = preview.split('.').pop();
        onViewImageOpen();
        break;

      default:
        break;
    }
  }; */

  const Image = ({ image }) => {
    return (
      <div>
        <img alt={PDFPic} src={image.src} />
      </div>
    );
  };

  const ShowImage = ({ images }) => {
    console.log('images', images);
    const show = image => {
      return <Image image={image} />;
    };

    return (
      <Box
        display="flex"
        flexWrap="wrap"
        width="80%"
        margin="20px auto"
        padding="20px"
      >
        {images.map(show)}
      </Box>
    );
  };

  const onDrop = useCallback(acceptedFiles => {
    console.log('acceptedFiles', acceptedFiles);
    const formData = new FormData();
    formData.append('dssenv-file', acceptedFiles[0], acceptedFiles[0].name);
    setFiles(prev => formData);

    acceptedFiles.map((file, index) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const formData = new FormData();
        formData.append('dssenv-file', acceptedFiles[0], acceptedFiles[0].name);
        setFiles(prev => formData);
        handleFileUpload({ formData });

        /* setAttachments((prevState) => [
          ...prevState,
          {
            ia_id: nanoid(),
            ia_src: `dssenv-file_${file.name}`,
            ia_itemno: state.item_no,
            ia_name: file.name,
            ia_size: file.size,
            ia_type: file.type,
          },
        ]); */
      };

      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const handleUploadFiles = () => {
    console.log('uploadfiles', uploadfiles);
  };

  const handleFileInput = e => {
    console.log('handleFileInput working!');
    console.log('handlefileinput', e.target.files[0]);
    const formData = new FormData();
    formData.append('dssenv-file', e.target.files[0], e.target.files[0].name);
    setUploadfiles(formData);
  };

  const handleFileUpload = ({ formData }) => {
    /*     for (var pair of uploadfiles.entries()) {
      console.log('uploadfile', pair[0] + ', ' + pair[1]);
    }
    /* axios.post('http://localhost:4000/file-upload', uploadfiles).then(res => {
      console.log('Axios response: ', res);
    }); */
    /*  axios.post('http://localhost:4000/files-upload', files).then(res => {
      console.log('Axios response: ', res);
    }); */
    axios.post(`${UPLOADURL}`, formData).then(res => {
      console.log('Axios response: ', res);
    });
    /*   files.forEach(file => {
      axios.post(UPLOADURL, file).then(res => {
        console.log('Axios response: ', res);
      });
    }); */
  };

  /* const add_Item = data => {
    //console.log('add', data);
    addItem(data);
  };

  const update_Item = data => {
    updateItem(data);
  }; */

  const add_Item = data => {
    //console.log('add', data);
    addItem(data);

    /*   attachments.forEach((rec) => {
      const { ia_id, ...fields } = rec;
      addItemAttachment({ ...fields, ia_itemno: data.item_no });
    }); */
  };

  const update_Item = data => {
    const { id, item_id, ...fields } = data;
    updateItem(data);
    //delete attachments
    /*  itemsattachments
      .filter((r) => r.ia_itemno === data.item_no)
      .forEach((rec) => {
        deleteItemAttachment({ ...rec });
      }); */
    /*  attachments.forEach((rec) => {
      const { ia_id, ...fields } = rec;
      addItemAttachment(fields);
    }); */
  };

  const handleUpdQtyOnhand = () => {
    setValue('item_qtyonhand', totals.totqtyonhand);
  };

  const handleCalcTotals = () => {
    console.log('calc here', editItemId.no);
    var totpoqty = 0,
      totpoamt = 0,
      totadjustqty = 0,
      totadjustamt = 0,
      totportnqty = 0,
      totportnamt = 0,
      totsalesqty = 0,
      totsalesamt = 0,
      totsalesrtnqty = 0,
      totsalesrtnamt = 0,
      totqtyonorder = 0,
      totqtyonhand = 0,
      totamount = 0;

    const ucost = getValues('item_cost');

    itemshistory
      .filter(r => r.it_itemno === editItemId.no)
      .forEach(rec => {
        switch (rec.it_transtype) {
          case 'Purchase':
            totpoqty = round(totpoqty + rec.it_qty, 3);
            totpoamt = round(totpoamt + rec.it_extvalue, 2);
            return null;
          case 'PO Returns':
            totportnqty = round(totportnqty + rec.it_qty, 3);
            totportnamt = round(totportnamt + rec.it_extvalue, 2);
            return null;
          case 'Sales':
            totsalesqty = round(totsalesqty + rec.it_qty, 3);
            totsalesamt = round(totsalesamt + rec.it_extvalue, 2);
            return null;
          case 'Sales Returns':
            totsalesrtnqty = round(totsalesrtnqty + rec.it_qty, 3);
            totsalesrtnamt = round(totsalesrtnamt + rec.it_extvalue, 2);
            return null;
          case 'Adjustment':
            totadjustqty = round(totadjustqty + rec.it_qty, 3);
            totadjustamt = round(totadjustamt + rec.it_extvalue, 2);
            return null;
          default:
            return null;
        }
      });

    totqtyonhand =
      totpoqty - totportnqty - totsalesqty + totsalesrtnqty + totadjustqty;
    totamount = round(totqtyonhand * ucost, 2);
    totqtyonorder = itemsonorder.reduce((acc, item) => {
      return acc + item.tl_qty;
    }, 0);
    setTotQtyOnOrder(prev => (prev = totqtyonorder));

    console.log('totqtyonorder', totqtyonorder);
    // const totpoamt = itemshistory
    //   .filter(r => r.it_itemno === item_no && r.it_transtype === 'Purchase')
    //   .reduce((acc, item) => {
    //     return acc + item.it_extvalue;
    //   }, 0);

    setTotals(
      prev =>
        (prev = {
          ...prev,
          totpoqty: totpoqty,
          totpoamt: totpoamt,
          totportnqty: totportnqty,
          totportnamt: totportnamt,
          totadjustqty: totadjustqty,
          totadjustamt: totadjustamt,
          totsalesqty: totsalesqty,
          totsalesamt: totsalesamt,
          totsalesrtnqty: totsalesrtnqty,
          totsalesrtnamt: totsalesrtnamt,
          totqtyonhand: totqtyonhand,
          totqtyonorder: totqtyonorder,
          totamount: totamount,
        })
    );
  };

  useEffect(() => {
    setItemHistId(editItemId.no);
    setItemExpId(editItemId.no);
    setExpiryChecked(state.item_trackexpiry);
    setSerialChecked(state.item_trackserial);
    setInactive(state.item_inactive);
    setIsCalc(true);
  }, []);

  useEffect(() => {
    //console.log("here");
    handleCalcTotals();
    setIsCalc(false);
  }, [isCalc]);

  return (
    <Box
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: '98%' }}
        h={{ base: 'auto', md: 'full' }}
        spacing="10"
        alignItems="center"
        //mx={5}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns="repeat(5, 1fr)" gap={1} py={2}>
            <GridItem colSpan={3}>
              <VStack alignItems={'flex-start'} px={1}>
                <Heading size="lg">Item Update</Heading>
                <Divider border="2px solid teal" w={300} />
              </VStack>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <HStack alignItems={'flex-end'} py={2}>
                <ButtonGroup>
                  <Button
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    type="submit"
                    variant="outline"
                    size="lg"
                    leftIcon={<IconSend />}
                    isDisabled={isFetching}
                  >
                    Submit
                  </Button>
                  <Button
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    onClick={handleClose}
                    variant="outline"
                    size="lg"
                    leftIcon={<IconDoorExit />}
                  >
                    Close
                  </Button>
                </ButtonGroup>
              </HStack>
            </GridItem>
          </Grid>
          <Grid templateColumns="repeat(12, 1fr)" gap={1}>
            <GridItem
              colSpan={12}
              w="100%"
              h="auto"
              border="1px solid"
              borderRadius={10}
              gap={0}
              px={2}
            >
              <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                <GridItem colSpan={2}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="item_no"
                      defaultValue={state.item_no}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left" alignItems="left" py={1}>
                          <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Item ID
                          </Text>
                          <Input
                            name="item_no"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="item no"
                            //minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="item_desp"
                      defaultValue={state.item_desp}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left" py={1}>
                          {/* <FormLabel>Description</FormLabel> */}
                          <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Description
                          </Text>
                          <Input
                            name="item_desp"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="description"

                            //minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={3}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="item_pack"
                      defaultValue={state.item_pack}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left" py={1}>
                          {/* <FormLabel>Description</FormLabel> */}
                          <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Packing
                          </Text>
                          <Input
                            name="item_pack"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="packing"

                            //minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={3}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="item_inactive"
                      defaultValue={inactive}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left" py={1}>
                          <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Status
                          </Text>
                          <Checkbox
                            name="item_inactive"
                            value={value || false}
                            width="full"
                            label="Inactive Item"
                            checked={inactive}
                            size="lg"
                            ml={10}
                            onChange={e => {
                              onChange(e.target.checked);
                              setInactive(e.target.checked);
                            }}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="category"
                            //disabled={!type}
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>

                <GridItem
                  colSpan={2}
                  w="100%"
                  h="auto"
                  px={1}
                  //border="1px solid"
                >
                  <FormControl>
                    <Controller
                      control={control}
                      name="item_qtyonhand"
                      defaultValue={state.item_qtyonhand}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack w="100%" py={1} align="left">
                          <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Qty Onhand
                          </Text>
                          <NumberInput
                            name="item_qtyonhand"
                            value={value || 0}
                            precision={2}
                            //fixedDecimalScale
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            formatter={value =>
                              !Number.isNaN(parseFloat(value))
                                ? ` ${value}`.replace(
                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                                : ' '
                            }
                            width="full"
                            onChange={onChange}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="qty onhand"
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="item_unit"
                      defaultValue={state.item_unit}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left" py={1}>
                          {/* <FormLabel>Description</FormLabel> */}
                          <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Unit
                          </Text>
                          <Input
                            name="item_unit"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="unit"

                            //minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem
                  colSpan={2}
                  w="100%"
                  h="auto"
                  px={1}
                  //border="1px solid"
                >
                  <FormControl>
                    <Controller
                      control={control}
                      name="item_cost"
                      defaultValue={state.item_cost}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack w="100%" py={1} align="left">
                          <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Unit Cost
                          </Text>
                          <NumberInput
                            name="item_cost"
                            value={value || 0}
                            precision={2}
                            //fixedDecimalScale
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            formatter={value =>
                              !Number.isNaN(parseFloat(value))
                                ? `$ ${value}`.replace(
                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                                : '$ '
                            }
                            width="full"
                            onChange={onChange}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="cost"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem
                  colSpan={2}
                  w="100%"
                  h="auto"
                  px={1}
                  //border="1px solid"
                >
                  <FormControl>
                    <Controller
                      control={control}
                      name="item_price"
                      defaultValue={state.item_price}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack w="100%" py={1} align="left">
                          <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Unit Price
                          </Text>
                          <NumberInput
                            name="item_price"
                            value={value || 0}
                            precision={2}
                            //fixedDecimalScale
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            formatter={value =>
                              !Number.isNaN(parseFloat(value))
                                ? `$ ${value}`.replace(
                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                                : '$ '
                            }
                            width="full"
                            onChange={onChange}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="price"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem
                  colSpan={2}
                  w="100%"
                  h="auto"
                  px={1}
                  //border="1px solid"
                >
                  <HStack>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_trackexpiry"
                        defaultValue={expirychecked}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" pt={10} align="left">
                            {/*  <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Unit Price
                            </Text> */}
                            <Switch
                              name="item_trackexpiry"
                              value={value || false}
                              label={
                                <Heading size="sm" pt={2}>
                                  Track Expiry Date
                                </Heading>
                              }
                              onLabel="ON"
                              offLabel="OFF"
                              size="xl"
                              precision={2}
                              checked={expirychecked}
                              width="full"
                              onChange={e => {
                                onChange(e.target.checked);
                                setExpiryChecked(e.target.checked);
                              }}
                              //borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              //placeholder="price"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                  </HStack>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={12} py={2}>
              <Divider border="2px solid teal" />
            </GridItem>
            <GridItem colSpan={12}>
              <Box border="1px solid teal" borderRadius={10}>
                <Tabs value={activeTab} onTabChange={setActiveTab}>
                  <Tabs.List>
                    <Tabs.Tab value="details">
                      <VStack alignItems={'flex-start'} p={1}>
                        <Heading size="md">Details</Heading>
                      </VStack>
                    </Tabs.Tab>
                    <Tabs.Tab value="history">
                      <VStack alignItems={'flex-start'} p={1}>
                        <Heading size="md">History</Heading>
                      </VStack>
                    </Tabs.Tab>
                    {expirychecked && (
                      <Tabs.Tab value="expiry">
                        <VStack alignItems={'flex-start'} p={1}>
                          <Heading size="md">Expiry Lot</Heading>
                        </VStack>
                      </Tabs.Tab>
                    )}

                    <Tabs.Tab value="onorder">
                      <VStack alignItems={'flex-start'} p={1}>
                        <Heading size="md">On Order</Heading>
                      </VStack>
                    </Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="details">
                    <Stack
                      //border="1px solid teal"
                      //borderRadius={15}

                      my={2}
                      p={2}
                    >
                      <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                        <GridItem
                          colSpan={3}
                          w="100%"
                          h="auto"
                          px={1}
                          //border="1px solid"
                        >
                          <FormControl>
                            <Controller
                              control={control}
                              name="item_minlvl"
                              defaultValue={state.item_minlvl}
                              render={({ field: { onChange, value, ref } }) => (
                                <VStack w="100%" py={1} align="left">
                                  <Text
                                    as="b"
                                    fontSize="sm"
                                    textAlign="left"
                                    p={1}
                                  >
                                    Minimum Qty Level
                                  </Text>
                                  <NumberInput
                                    name="item_minqtylvl"
                                    value={value || 0}
                                    precision={2}
                                    //fixedDecimalScale
                                    parser={value =>
                                      value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    formatter={value =>
                                      !Number.isNaN(parseFloat(value))
                                        ? ` ${value}`.replace(
                                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                            ','
                                          )
                                        : ' '
                                    }
                                    width="full"
                                    onChange={onChange}
                                    //borderColor="gray.400"
                                    //textTransform="capitalize"
                                    ref={ref}
                                    //placeholder="price"
                                  />
                                </VStack>
                              )}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={3}>
                          <HStack>
                            <FormControl>
                              <Controller
                                control={control}
                                name="item_productno"
                                defaultValue={state.item_productno}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <VStack w="100%" py={1} align="left">
                                    <Text
                                      as="b"
                                      fontSize="sm"
                                      textAlign="left"
                                      p={1}
                                    >
                                      Product No
                                    </Text>
                                    <Input
                                      name="item_productno"
                                      value={value || ''}
                                      width="full"
                                      onChange={onChange}
                                      borderColor="gray.400"
                                      //textTransform="capitalize"
                                      ref={ref}
                                      placeholder="product no"
                                    />
                                  </VStack>
                                )}
                              />
                            </FormControl>
                          </HStack>
                        </GridItem>
                        <GridItem
                          colSpan={3}
                          w="100%"
                          h="auto"
                          px={1}
                          //border="1px solid"
                        >
                          <HStack>
                            <FormControl>
                              <Controller
                                control={control}
                                name="item_brand"
                                defaultValue={state.item_brand}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <VStack w="100%" py={1} align="left">
                                    <Text
                                      as="b"
                                      fontSize="sm"
                                      textAlign="left"
                                      p={1}
                                    >
                                      Brand
                                    </Text>
                                    <Select
                                      name="item_brand"
                                      value={value || ''}
                                      width="full"
                                      size="md"
                                      onChange={onChange}
                                      //borderColor="gray.400"
                                      //textTransform="capitalize"
                                      ref={ref}
                                      //placeholder="category"
                                      data={groups
                                        .filter(
                                          r => r.group_category === 'Brand'
                                        )
                                        .map(rec => {
                                          return {
                                            value: rec.group_desp,
                                            label: rec.group_desp,
                                          };
                                        })}
                                      //placeholder=""
                                      nothingFound="None"
                                      clearable
                                      searchable
                                    />
                                  </VStack>
                                )}
                              />
                            </FormControl>
                            <Box pt={8}>
                              <IconButton
                                onClick={() => handleAddGroup('Brand')}
                                icon={<AddIcon />}
                                size="md"
                                colorScheme="teal"
                              />
                            </Box>
                          </HStack>
                        </GridItem>
                        <GridItem
                          colSpan={3}
                          w="100%"
                          h="auto"
                          px={1}
                          //border="1px solid"
                        >
                          <HStack>
                            <FormControl>
                              <Controller
                                control={control}
                                name="item_cat"
                                defaultValue={state.item_catno}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <VStack w="100%" py={1} align="left">
                                    <Text
                                      as="b"
                                      fontSize="sm"
                                      textAlign="left"
                                      p={1}
                                    >
                                      Category
                                    </Text>
                                    <Select
                                      name="item_catno"
                                      value={value || ''}
                                      width="full"
                                      size="md"
                                      onChange={onChange}
                                      //borderColor="gray.400"
                                      //textTransform="capitalize"
                                      ref={ref}
                                      //placeholder="category"
                                      data={groups
                                        .filter(
                                          r => r.group_category === 'Category'
                                        )
                                        .map(rec => {
                                          return {
                                            value: rec.group_desp,
                                            label: rec.group_desp,
                                          };
                                        })}
                                      //placeholder=""
                                      nothingFound="None"
                                      clearable
                                      searchable
                                    />
                                  </VStack>
                                )}
                              />
                            </FormControl>
                            <Box pt={8}>
                              <IconButton
                                onClick={() => handleAddGroup('Category')}
                                icon={<AddIcon />}
                                size="md"
                                colorScheme="teal"
                              />
                            </Box>
                          </HStack>
                        </GridItem>
                        <GridItem
                          colSpan={3}
                          w="100%"
                          h="auto"
                          px={1}
                          //border="1px solid"
                        >
                          <HStack>
                            <FormControl>
                              <Controller
                                control={control}
                                name="item_manufacturer"
                                defaultValue={state.item_manufacturer}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <VStack w="100%" py={1} align="left">
                                    <Text
                                      as="b"
                                      fontSize="sm"
                                      textAlign="left"
                                      p={1}
                                    >
                                      Manufacturer
                                    </Text>
                                    <Select
                                      name="item_manufacturer"
                                      value={value || ''}
                                      width="full"
                                      size="md"
                                      onChange={onChange}
                                      //borderColor="gray.400"
                                      //textTransform="capitalize"
                                      ref={ref}
                                      //placeholder="category"
                                      data={groups
                                        .filter(
                                          r =>
                                            r.group_category === 'Manufacturer'
                                        )
                                        .map(rec => {
                                          return {
                                            value: rec.group_desp,
                                            label: rec.group_desp,
                                          };
                                        })}
                                      //placeholder=""
                                      nothingFound="None"
                                      clearable
                                      searchable
                                    />
                                  </VStack>
                                )}
                              />
                            </FormControl>
                            <Box pt={8}>
                              <IconButton
                                onClick={() => handleAddGroup('Manufacturer')}
                                icon={<AddIcon />}
                                size="md"
                                colorScheme="teal"
                              />
                            </Box>
                          </HStack>
                        </GridItem>
                        <GridItem
                          colSpan={3}
                          w="100%"
                          h="auto"
                          px={1}
                          //border="1px solid"
                        >
                          <HStack>
                            <FormControl>
                              <Controller
                                control={control}
                                name="item_grade"
                                defaultValue={state.item_grade}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <VStack w="100%" py={1} align="left">
                                    <Text
                                      as="b"
                                      fontSize="sm"
                                      textAlign="left"
                                      p={1}
                                    >
                                      Grade
                                    </Text>
                                    <Select
                                      name="item_grade"
                                      value={value || ''}
                                      width="full"
                                      size="md"
                                      onChange={onChange}
                                      //borderColor="gray.400"
                                      //textTransform="capitalize"
                                      ref={ref}
                                      //placeholder="category"
                                      data={groups
                                        .filter(
                                          r => r.group_category === 'Grade'
                                        )
                                        .map(rec => {
                                          return {
                                            value: rec.group_desp,
                                            label: rec.group_desp,
                                          };
                                        })}
                                      //placeholder=""
                                      nothingFound="None"
                                      clearable
                                      searchable
                                    />
                                  </VStack>
                                )}
                              />
                            </FormControl>
                            <Box pt={8}>
                              <IconButton
                                onClick={() => handleAddGroup('Grade')}
                                icon={<AddIcon />}
                                size="md"
                                colorScheme="teal"
                              />
                            </Box>
                          </HStack>
                        </GridItem>

                        <GridItem
                          colSpan={3}
                          w="100%"
                          h="auto"
                          px={1}
                          //border="1px solid"
                        >
                          <HStack>
                            <FormControl>
                              <Controller
                                control={control}
                                name="item_location"
                                defaultValue={state.item_location}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <VStack w="100%" py={1} align="left">
                                    <Text
                                      as="b"
                                      fontSize="sm"
                                      textAlign="left"
                                      p={1}
                                    >
                                      Location
                                    </Text>
                                    <Select
                                      name="item_location"
                                      value={value || ''}
                                      width="full"
                                      onChange={onChange}
                                      size="md"
                                      //borderColor="gray.400"
                                      //textTransform="capitalize"
                                      ref={ref}
                                      //placeholder="location"
                                      data={groups
                                        .filter(
                                          r =>
                                            r.group_category === 'Item Location'
                                        )
                                        .map(rec => {
                                          return {
                                            value: rec.group_desp,
                                            label: rec.group_desp,
                                          };
                                        })}
                                      //placeholder=""
                                      nothingFound="None"
                                      clearable
                                      searchable
                                    />
                                  </VStack>
                                )}
                              />
                            </FormControl>
                            <Box pt={8}>
                              <IconButton
                                onClick={() => handleAddGroup('Item Location')}
                                icon={<AddIcon />}
                                size="md"
                                colorScheme="teal"
                              />
                            </Box>
                          </HStack>
                        </GridItem>
                        <GridItem
                          colSpan={3}
                          w="100%"
                          h="auto"
                          px={1}
                          //border="1px solid"
                        >
                          <HStack>
                            <FormControl>
                              <Controller
                                control={control}
                                name="item_size"
                                defaultValue={state.item_size}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <VStack w="100%" py={1} align="left">
                                    <Text
                                      as="b"
                                      fontSize="sm"
                                      textAlign="left"
                                      p={1}
                                    >
                                      Size
                                    </Text>
                                    <Select
                                      name="item_size"
                                      value={value || ''}
                                      width="full"
                                      onChange={onChange}
                                      //borderColor="gray.400"
                                      //textTransform="capitalize"
                                      ref={ref}
                                      //placeholder="category"
                                      data={groups
                                        .filter(
                                          r => r.group_category === 'Item Size'
                                        )
                                        .map(rec => {
                                          return {
                                            value: rec.group_desp,
                                            label: rec.group_desp,
                                          };
                                        })}
                                      //placeholder=""
                                      nothingFound="None"
                                      clearable
                                      searchable
                                    />
                                  </VStack>
                                )}
                              />
                            </FormControl>
                            <Box pt={8}>
                              <IconButton
                                onClick={() => handleAddGroup('Item Size')}
                                icon={<AddIcon />}
                                size="md"
                                colorScheme="teal"
                              />
                            </Box>
                          </HStack>
                        </GridItem>

                        <GridItem colSpan={3} w="100%" h="auto" px={1}>
                          <HStack>
                            <FormControl>
                              <Controller
                                control={control}
                                name="item_suppno"
                                defaultValue={state.item_suppno}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <VStack w="100%" py={0} align="left">
                                    <Text
                                      as="b"
                                      fontSize="sm"
                                      textAlign="left"
                                      p={1}
                                    >
                                      Supp No
                                    </Text>
                                    <Input
                                      name="item_suppno"
                                      value={value || ''}
                                      width="full"
                                      onChange={onChange}
                                      borderColor="gray.400"
                                      //textTransform="capitalize"
                                      ref={ref}
                                      placeholder="supplier no"
                                    />
                                  </VStack>
                                )}
                              />
                            </FormControl>
                            <Box pt={8}>
                              <IconButton
                                onClick={() => handleSupplierSearch()}
                                icon={<SearchIcon />}
                                size="md"
                                colorScheme="teal"
                              />
                            </Box>
                          </HStack>
                        </GridItem>
                        <GridItem colSpan={6} w="100%" h="auto" px={1}>
                          <FormControl>
                            <Controller
                              control={control}
                              name="item_supplier"
                              defaultValue={state.item_supplier}
                              render={({ field: { onChange, value, ref } }) => (
                                <VStack w="100%" py={1} align="left">
                                  <Text
                                    as="b"
                                    fontSize="sm"
                                    textAlign="left"
                                    p={1}
                                  >
                                    Supplier
                                  </Text>
                                  <Input
                                    name="item_supplier"
                                    value={value || ''}
                                    width="full"
                                    onChange={onChange}
                                    borderColor="gray.400"
                                    //textTransform="capitalize"
                                    ref={ref}
                                    placeholder="supplier"
                                  />
                                </VStack>
                              )}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={6} w="100%" h="auto" px={1}>
                          <FormControl>
                            <Controller
                              control={control}
                              name="item_remark"
                              defaultValue={state.item_others}
                              render={({ field: { onChange, value, ref } }) => (
                                <VStack w="100%" py={1} align="left">
                                  <Text
                                    as="b"
                                    fontSize="sm"
                                    textAlign="left"
                                    p={1}
                                  >
                                    Remark
                                  </Text>
                                  <Input
                                    name="item_remark"
                                    value={value || ''}
                                    width="full"
                                    onChange={onChange}
                                    borderColor="gray.400"
                                    //textTransform="capitalize"
                                    ref={ref}
                                    placeholder="others"
                                  />
                                </VStack>
                              )}
                            />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Stack>
                  </Tabs.Panel>
                  <Tabs.Panel value="history">
                    <Container maxW={'8xl'}>
                      <ItemHistDetlsTable
                        itemno={editItemId.no}
                        itemhistdetls={itemshistory}
                        totals={totals}
                        handleUpdQtyOnhand={handleUpdQtyOnhand}
                      />
                    </Container>
                  </Tabs.Panel>
                  <Tabs.Panel value="expiry">
                    <Container maxW={'8xl'}>
                      <ItemHistLotTable
                        itemno={editItemId.no}
                        itemhistlot={itemslotdata}
                      />
                    </Container>
                  </Tabs.Panel>
                  <Tabs.Panel value="onorder">
                    <ItemHistOnOrderTable itemsonorder={itemsonorder} />
                  </Tabs.Panel>
                </Tabs>
              </Box>
            </GridItem>
            {/*  <GridItem
              colSpan={20}
              w="100%"
              h="auto"
              px={1}
              border="1px solid"
              borderRadius={10}
            ></GridItem> */}

            {/*   {editItemId.type === 'Solutions' && (
              <GridItem
                colSpan={20}
                w="100%"
                h="auto"
                px={1}
                border="1px solid"
                borderRadius={10}
              ></GridItem>
            )} */}
          </Grid>
        </form>
      </VStack>
      <Modal opened={isGroupOpen} onClose={onGroupClose} size="lg">
        <GroupForm
          state={groupstate}
          setState={setGroupState}
          add_Group={add_Group}
          update_Group={update_Group}
          statustype={groupstatustype}
          onGroupClose={onGroupClose}
          grouptype={grouptype}
        />
      </Modal>
      <Modal
        opened={isSupplierSearchOpen}
        onClose={onSupplierSearchClose}
        size="4xl"
      >
        <SupplierSearchTable
          state={state}
          setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_SuppDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onSupplierSearchClose={onSupplierSearchClose}
        />
      </Modal>
      {/*  <Modal
        opened={isManufacturerSearchOpen}
        onClose={onManufacturerSearchClose}
        size="4xl"
      >
        <ManufacturerSearchTable
          state={state}
          setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_ManufacturerDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onManufacturerSearchClose={onManufacturerSearchClose}
        />
      </Modal> */}
      {/* <CModal
        closeOnOverlayClick={false}
        isOpen={isViewImageOpen}
        onClose={onViewImageClose}
        size="3xl"
      >
        <CModalOverlay />
        <CModalContent>
          <CModalHeader>{files.name}</CModalHeader>
          <CModalCloseButton />
          <CModalBody pb={6}>
            <Box
              display="inline-flex"
              w="100%"
              h="800"
              mb={8}
              mr={8}
              p={4}
              border="1px solid #eaeaea"
              borderRadius={2}
            >
              <FileViewers
                imagefile={{
                  url: viewfile,
                  name: "guitar",
                }}
              />
            </Box>
          </CModalBody>

          <CModalFooter>
            <Button onClick={onViewImageClose}>Close</Button>
          </CModalFooter>
        </CModalContent>
      </CModal> */}
      <AlertDialogBox
        onClose={onAlertDeleteAttachmentClose}
        onConfirm={handleOnDeleteAttachmentConfirm}
        isOpen={isAlertDeleteAttachmentOpen}
        title="Delete Item Attachment"
      >
        <Heading size="md">
          Are you sure you want to delete this item attachment{' '}
          {attachmentstate.ia_name} ?
        </Heading>
      </AlertDialogBox>
    </Box>
  );
};

export default ItemForm;
