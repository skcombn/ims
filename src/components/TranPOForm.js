import { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import currency from 'currency.js';
import { nanoid } from 'nanoid';
import { Controller, useForm } from 'react-hook-form';
import { ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Group, Modal, Select } from '@mantine/core';
import { branch } from '../utils/constants';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { TiArrowBack, TiPrinter } from 'react-icons/ti';
import { IconTrash, IconLock, IconSearch, IconLink } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import {
  tranState,
  trandetlsState,
  editTranIdState,
  editTranDetlsIdState,
} from '../data/atomdata';
import { useItems } from '../react-query/items/useItems';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useTrans } from '../react-query/trans/useTrans';
import { useAddTran } from '../react-query/trans/useAddTran';
import { useUpdateTran } from '../react-query/trans/useUpdateTran';
import { useTransDetls } from '../react-query/transdetls/useTranDetls';
import { useAddTranDetls } from '../react-query/transdetls/useAddTranDetls';
import { useDeleteTranDetls } from '../react-query/transdetls/useDeleteTranDetls';
import { useAddItemsHistory } from '../react-query/itemshistory/useAddItemsHistory';
import { useAddItemExpiry } from '../react-query/itemsexpiry/useAddItemExpiry';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';
import SupplierSearchTable from './SupplierSearchTable';
import TranPODetlsForm from './TranPODetlsForm';
import TranPODetlsTable from './TranPODetlsTable';

const initial_ap = {
  ap_pono: '',
  ap_podate: null,
  ap_invno: '',
  ap_invdate: null,
  ap_recdate: null,
  ap_suppno: '',
  ap_supplier: '',
  ap_type: '',
  ap_subtotal_amt: 0,
  ap_nettotal_amt: 0,
  ap_paid_amt: 0,
  ap_disc_amt: 0,
  ap_disc_taken: 0,
  ap_dc: '',
  ap_acc: '',
  ap_disc_acc: '',
  ap_paid: false,
  ap_balance: 0,
  ap_branch: branch,
  ap_glcode: '',
  ap_paid_disc: 0,
};

const initial_batchdetls = {
  tl_tranno: '',
  tl_type: 'Item',
  tl_itemno: '',
  tl_qty: 0,
  tl_ucost: 0,
  tl_unit: '',
  tl_desp: '',
  tl_packing: '',
  tl_pfactor: 1,
  tl_netucost: 0,
  tl_disc: 0,
  tl_amount: 0,
  tl_remark: '',
  tl_order: 0,
  tl_branch: '',
  tl_lotno: '',
  tl_dateexpiry: dayjs().format('YYYY-MM-DD'),
  tl_trackexpiry: false,
  tl_uprice: 0,
  tl_location: '',
  tl_uoldcost: 0,
  tl_brand: '',
  tl_trantype: '',
  tl_post: '0',
  tl_trandate: null,
  tl_trackserial: false,
};

const initial_it = {
  it_transno: '',
  it_itemno: '',
  it_transdate: null,
  it_qty: 0,
  it_value: 0,
  it_disc: 0,
  it_netvalue: 0,
  it_extvalue: 0,
  it_pfactor: 1,
  it_transtype: '',
  it_scno: '',
  it_sc: '',
  it_branch: '',
  it_postdate: null,
  it_remark: '',
  it_desp: '',
  it_packing: '',
  it_lotno: '',
};

const initial_expiry = {
  ie_itemno: '',
  ie_lotno: '',
  ie_datereceived: null,
  ie_location: '',
  ie_dateexpiry: 0,
  ie_pono: 0,
  ie_podate: 0,
  ie_qtyonhand: 0,
  ie_qtyreceived: 1,
  ie_ucost: 0,
  ie_post: '0',
};

const TranPOForm = () => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_gap = '3';
  const { items } = useItems();
  const updateItem = useUpdateItem();
  const { transactions } = useTrans();
  const addTran = useAddTran();
  const updateTran = useUpdateTran();
  const addTranDetls = useAddTranDetls();
  const deleteTranDetls = useDeleteTranDetls();

  const addItemsHistory = useAddItemsHistory();
  const addItemExpiry = useAddItemExpiry();

  const { transdetls } = useTransDetls();

  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();
  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState({});
  const [singlebatchserialstate, setSingleBatchSerialState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(true);

  const [batch, setBatch] = useRecoilState(tranState);
  const [batchdetls, setBatchdetls] = useRecoilState(trandetlsState);
  const [editBatchId, setEditBatchId] = useRecoilState(editTranIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] =
    useRecoilState(editTranDetlsIdState);

  const [doclayout, setDocLayout] = useState(editBatchId.layout);
  const [tranno, setTranno] = useState(batch.t_no);
  const [totamt, setTotAmt] = useState(batch.t_subtotal);
  const [totdisc, setTotDisc] = useState(batch.t_disc);
  const [lock, setLock] = useState(batch.t_post);

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isBatchDetlsOpen,
    onOpen: onBatchDetlsOpen,
    onClose: onBatchDetlsClose,
  } = useDisclosure();

  const {
    isOpen: isBatchDetlsServOpen,
    onOpen: onBatchDetlsServOpen,
    onClose: onBatchDetlsServClose,
  } = useDisclosure();

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: {},
  } = useForm({
    defaultValues: {
      ...batch,
    },
  });

  const add_Batch = data => {
    console.log('add batch', data);
    const { t_no, t_type, t_date } = data;
    addTran(data);
    // delete old details

    //add details
    batchdetls.forEach(rec => {
      const { tl_id, ...fields } = rec;
      addTranDetls({
        ...fields,
        tl_tranno: t_no,
        tl_trandate: t_date,
        tl_trantype: t_type,
      });
    });
    //add serial details
  };

  const update_Batch = data => {
    console.log('edit batch', data);
    const { id, t_id, t_no, t_date, ...fields } = data;
    // delete old details

    const detlsitems = transdetls.filter(r => r.tl_tranno === t_no);
    detlsitems.length > 0 &&
      detlsitems.forEach(rec => {
        deleteTranDetls(rec);
      });

    updateTran(data);
    //add details
    batchdetls.forEach(rec => {
      const { t_id, ...fields } = rec;
      addTranDetls({
        ...fields,
        tl_trantype: data.t_type,
        tl_trandate: data.t_date,
      });
    });
  };

  const handleCalc = () => {
    console.log('calc');
    const totalamt = batchdetls.reduce((acc, item) => {
      return acc + item.tl_amount;
    }, 0);
    setValue('t_subtotal', totalamt);
    setValue('t_nettotal', totalamt - totdisc);
  };

  const handleSupplierSearch = () => {
    onSearchOpen();
  };

  const update_SuppDetls = data => {
    console.log('suppdata', data);
    const { s_suppno, s_supp, s_add1, s_add2, s_add3, s_add4 } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          t_scno: s_suppno,
          t_sc: s_supp,
          t_add1: s_add1,
          t_add2: s_add2,
          t_add3: s_add3,
          t_add4: s_add4,
        })
    );
    setValue('t_scno', s_suppno);
    setValue('t_sc', s_supp);
    setValue('t_add1', s_add1);
    setValue('t_add2', s_add2);
    setValue('t_add3', s_add3);
    setValue('t_add4', s_add4);
  };

  const handlePost = () => {
    var doctype = '';
    var qtyonhand = 0;
    var price = 0;
    var cost = 0;
    var suppno = '';
    var supp = '';
    const data = getValues();
    const newData = { ...data, t_post: '1' };

    const { id, t_id, t_no, ...fields } = newData;
    //delete old tran details
    const detlsitems = transdetls.filter(r => r.tl_tranno === t_no);
    detlsitems.length > 0 &&
      detlsitems.forEach(rec => {
        deleteTranDetls(rec);
      });

    // update header
    updateTran({ ...data, t_post: '1' });
    //add details
    batchdetls.forEach(rec => {
      const { tl_id, ...fields } = rec;
      console.log('adddetls', rec);
      addTranDetls({
        ...fields,
        tl_trantype: data.t_type,
        tl_trandate: data.t_date,
        tl_post: '1',
      });
    });

    if (data.t_layout === 'Item' && batchdetls.length > 0) {
      batchdetls.forEach(rec => {
        // get itemonhand details
        const itemonhandrec = items
          .filter(r => r.item_no === rec.tl_itemno)
          .map(item => {
            return { ...item };
          });
        const detlsdata = {
          ...initial_it,
          it_transno: data.t_no,
          it_itemno: rec.tl_itemno,
          it_transdate: data.t_date,
          it_qty: rec.tl_qty,
          it_value: rec.tl_netucost,
          it_disc: rec.tl_disc,
          it_netvalue: rec.tl_netucost,
          it_extvalue: rec.tl_amount,
          it_pfactor: rec.tl_pfactor,
          it_transtype: data.t_type,
          it_scno: data.t_scno,
          it_sc: data.t_sc,
          it_branch: '',
          it_postdate: null,
          it_remark: rec.tl_remark,
          it_desp: rec.tl_desp,
          it_packing: rec.tl_packing,
          it_lotno: rec.tl_lotno,
        };
        addItemsHistory(detlsdata);
        //add item expiry table
        if (rec.tl_trackexpiry) {
          const itemexpirydata = {
            ...initial_expiry,
            ie_itemno: rec.tl_itemno,
            ie_lotno: rec.tl_lotno,
            ie_dateexpiry: rec.tl_dateexpiry,
            ie_pono: data.t_no,
            ie_location: rec.tl_location,
            ie_podate: data.t_date,
            ie_datereceived: data.t_date,
            ie_qtyonhand: rec.tl_qty,
            ie_qtyreceived: rec.tl_qty,
            ie_ucost: rec.tl_netucost,
          };
          //console.log('expiry', itemexpirydata);
          addItemExpiry(itemexpirydata);
        }

        //update item onhand

        if (itemonhandrec.length > 0) {
          switch (data.t_type) {
            case 'Purchase':
              qtyonhand = itemonhandrec[0].item_qtyonhand + rec.tl_qty;
              cost = rec.tl_netucost;
              suppno = data.t_scno;
              supp = data.t_sc;
              console.log(
                'PO here',
                qtyonhand,
                itemonhandrec[0].item_qtyonhand
              );
              break;
            case 'PO Returns':
              qtyonhand = itemonhandrec[0].item_qtyonhand - rec.tl_qty;
              cost = itemonhandrec[0].item_cost;
              suppno = itemonhandrec[0].item_suppno;
              supp = itemonhandrec[0].item_supplier;
              break;
            default:
              break;
          }
          const newData = {
            ...itemonhandrec[0],
            item_qtyonhand: qtyonhand,
            item_cost: cost,
            item_suppno: suppno,
            item_supplier: supp,
          };
          const { id, item_id, ...fields } = newData;
          updateItem(newData);
          console.log('post update', newData);
        }
      });
      //add to auditlog
      const auditdata = {
        al_userid: localuser.userid,
        al_user: localuser.name,
        al_date: dayjs().format('YYYY-MM-DD'),
        al_time: dayjs().format('HHmmss'),
        al_timestr: dayjs().format('HH:mm:ss'),
        al_module: 'Purchases',
        al_action: 'Post',
        al_record: data.t_no,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
    }
    navigate(-1);
  };

  const handleOnSubmit = values => {
    onSubmit(values);
    navigate(-1);
  };

  const onSubmit = values => {
    console.log('onsubmit', values);
    const { id, status } = editBatchId;
    console.log('status value', status);
    if (status === 'edit') {
      //add to auditlog
      const auditdata = {
        al_userid: localuser.userid,
        al_user: localuser.name,
        al_date: dayjs().format('YYYY-MM-DD'),
        al_time: dayjs().format('HHmmss'),
        al_timestr: dayjs().format('HH:mm:ss'),
        al_module: 'Purchases',
        al_action: 'Edit',
        al_record: values.t_no,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
      // edit batch
      const newData = { ...values, t_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      var nexttranno = 0;
      // const docno = doc_despatch;
      const docabbre = 'PO';
      const year = dayjs().year().toString().substring(2);

      //get next sample no
      const transarray = transactions
        .filter(
          r =>
            r.t_type === 'Purchase' &&
            r.t_no.substring(0, 4) ===
              docabbre + dayjs().year().toString().substring(2)
        )
        .sort((a, b) => (a.t_no > b.t_no ? 1 : -1));

      if (transarray.length > 0) {
        nexttranno =
          10000001 +
          parseInt(transarray[transarray.length - 1].t_no.substring(6, 13));
      } else {
        nexttranno = 10000001;
      }
      const newdocno = docabbre + year + nexttranno.toString().substring(1);
      const newdata = { ...values, t_no: newdocno };
      add_Batch(newdata);
      //add to auditlog
      const auditdata = {
        al_userid: localuser.userid,
        al_user: localuser.name,
        al_date: dayjs().format('YYYY-MM-DD'),
        al_time: dayjs().format('HHmmss'),
        al_timestr: dayjs().format('HH:mm:ss'),
        al_module: 'Purchases',
        al_action: 'Add',
        al_record: newdocno,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
    }
  };

  const handleExit = () => {
    // exit
    navigate(-1);
  };

  const handleEditBatchDetls = row => {
    const { original } = row;

    setStatusType(prev => (prev = 'edit'));
    setSingleBatchDetlsState(prev => original);

    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
  };

  const handleDeleteBatchDetls = row => {
    const { original } = row;
    const { tl_id, tl_itemno } = original;
    setEditBatchdetlsId(prev => (prev = { id: tl_id, itemno: tl_itemno }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    const doctype = getValues('t_type');
    setStatusType(prev => (prev = 'add'));
    const detlsdata = {
      ...initial_batchdetls,
      tl_id: nanoid(),
      tl_tranno: editBatchId.no,
      tl_type: 'Item',
      tl_trantype: doctype,
    };
    setSingleBatchDetlsState(detlsdata);

    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
  };

  const add_BatchDetls = data => {
    console.log('add batchdetls data', data);
    const dataUpdate = { ...data };
    console.log('adddata', dataUpdate);
    const oldData = batchdetls;
    const newData = [...oldData, dataUpdate];

    setBatchdetls(newData);

    setIsCalc(true);
  };

  const update_BatchDetls = data => {
    const dataUpdate = { ...data };
    console.log('editdata', dataUpdate);
    const oldData = batchdetls.filter(r => r.tl_id !== data.tl_id);
    setBatchdetls([...oldData, dataUpdate]);

    setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.tl_id !== id);
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setIsCalc(true);
  };

  const handlePrint = () => {
    // add auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Purchases',
      al_action: 'Print',
      al_record: batch.t_no,
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // print
    navigate('/tranpoprint');
  };

  useEffect(() => {
    handleCalc();
    setIsCalc(false);
  }, [isCalc, totamt, totdisc]);

  return (
    <Box
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
      >
        <form>
          <HStack py={2} spacing="3">
            <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
              <GridItem colSpan={1}>
                <Button
                  leftIcon={<TiArrowBack size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                  variant={'outline'}
                  size="lg"
                >
                  Back
                </Button>
              </GridItem>

              <GridItem colSpan={3}>
                <VStack alignItems={'flex-start'} px={1}>
                  <Heading size="lg">Purchase Invoice Form</Heading>
                  <Divider border="2px solid teal" />
                </VStack>
              </GridItem>
              <GridItem colSpan={3}></GridItem>

              <GridItem colSpan={5}>
                <Flex>
                  <HStack mr={0} align="flex-end">
                    <Box>
                      {lock === '1' && <IconLock size={42} color="red" />}
                      {lock === 'D' && <IconTrash size={42} color="red" />}
                    </Box>
                    <Group>
                      <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        variant={'outline'}
                        size="lg"
                        //type="submit"
                        onClick={handleSubmit(handleOnSubmit)}
                        isDisabled={lock !== '0' || isFetching}
                      >
                        Submit
                      </Button>
                      <Button
                        leftIcon={<TiPrinter />}
                        colorScheme="teal"
                        variant={'outline'}
                        size="lg"
                        onClick={handlePrint}
                        isDisabled={editBatchId.status === 'add' || isFetching}
                      >
                        Print
                      </Button>
                      <Button
                        leftIcon={<IconLink />}
                        colorScheme="teal"
                        variant={'outline'}
                        size="lg"
                        onClick={() => handlePost()}
                        isDisabled={
                          editBatchId.status === 'add' ||
                          lock !== '0' ||
                          isFetching
                        }
                      >
                        Post
                      </Button>
                      <Button
                        leftIcon={<ImExit />}
                        colorScheme="teal"
                        variant={'outline'}
                        size="lg"
                        onClick={handleExit}
                      >
                        Close
                      </Button>
                    </Group>
                  </HStack>
                </Flex>
              </GridItem>
            </Grid>
          </HStack>

          <Grid
            templateColumns={'repeat(12,1fr)'}
            //templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid teal"
            borderRadius="10"
          >
            <GridItem colSpan={6}>
              <Grid templateColumns={'repeat(6,1fr)'} columnGap={3}>
                <GridItem colSpan={2} mt={field_gap}>
                  <HStack>
                    <FormControl>
                      <Controller
                        control={control}
                        name="t_scno"
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Supplier No
                            </Text>
                            <Input
                              name="t_scno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              ref={ref}
                              placeholder="supplier no"
                              minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleSupplierSearch()}
                        icon={<IconSearch />}
                        size="md"
                        colorScheme="teal"
                      />
                    </Box>
                  </HStack>
                </GridItem>
                <GridItem colSpan={4} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_sc"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Supplier
                          </Text>
                          <Input
                            name="t_sc"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="supplier"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={6} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="t_remark"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="remark"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_subtotal"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Amount
                          </Text>
                          <Input
                            name="t_subtotal"
                            value={currency(value || 0).format()}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="sub total amount"
                            minWidth="100"
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_disc"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Disc
                          </Text>
                          <Input
                            name="t_disc"
                            value={currency(value || 0).format()}
                            width="full"
                            onChange={e => {
                              onChange(parseFloat(e.target.value));
                              setTotDisc(
                                prev => (prev = parseFloat(e.target.value))
                              );
                            }}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="total discount"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_nettotal"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Nett Total Amount
                          </Text>
                          <Input
                            name="t_nettotal"
                            value={currency(value || 0).format()}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="total amount"
                            minWidth="100"
                            right
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={6}>
              <Grid templateColumns={'repeat(6,1fr)'} columnGap={3}>
                <GridItem colSpan={2} mt={field_gap} w="100%">
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_no"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            PO No
                          </Text>
                          <Input
                            name="t_no"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="mr no"
                            minWidth="100"
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>

                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            PO Date
                          </Text>

                          <Input
                            name="t_date"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="po date"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_type"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Type
                          </Text>
                          <Select
                            name="t_type"
                            value={value || ''}
                            width="full"
                            size="md"
                            onChange={onChange}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            data={[
                              { value: 'Purchase', label: 'Purchase' },
                              {
                                value: 'PO Returns',
                                label: 'PO Returns',
                              },
                            ]}
                            nothingFound="None"
                            clearable
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_docno"
                      //defaultValue={invoice.oei_type || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            MR No
                          </Text>
                          <Input
                            name="t_docno"
                            value={value || ''}
                            width="full"
                            onChange={e => {
                              onChange(e.target.value);
                              setTranno(e.target.value);
                            }}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="mr no"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_docdate"
                      //defaultValue={invoice.sls_oref ? invoice.sls_oref : ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            MR Date
                          </Text>
                          <Input
                            name="t_docdate"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="mr date"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_dono"
                      //defaultValue={invoice.oei_type || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            DO No
                          </Text>
                          <Input
                            name="t_dono"
                            value={value || ''}
                            width="full"
                            onChange={e => {
                              onChange(e.target.value);
                              setTranno(e.target.value);
                            }}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="DO no"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_dodate"
                      //defaultValue={invoice.sls_oref ? invoice.sls_oref : ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            DO Date
                          </Text>
                          <Input
                            name="t_dodate"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="DO date"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                {/*  <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_recdate"
                      //defaultValue={invoice.oei_yref || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Received Date
                          </Text>
                          <Input
                            name="t_recdate"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="received date"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem> */}
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_term"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Term
                          </Text>
                          <Input
                            name="t_term"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="term"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="t_layout"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Layout
                          </Text>
                          <Select
                            name="t_layout"
                            value={value || ''}
                            width="full"
                            size="md"
                            pointerEvents={
                              editBatchId.status === 'edit' ? 'none' : 'all'
                            }
                            onChange={e => {
                              onChange(e.target.value);
                              setEditBatchId(
                                prev =>
                                  (prev = { ...prev, layout: e.target.value })
                              );
                              setDocLayout(prev => (prev = e.target.value));
                            }}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="category"
                            data={[
                              { value: 'Item', label: 'Item' },
                              { value: 'Service', label: 'Service' },
                            ]}
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={12} w={'100%'}>
              <Divider borderWidth={1} borderColor="teal" />
            </GridItem>
            {/* 
            {doclayout === 'Service' && (
              <GridItem colSpan={12}>
                <PurchaseDetlsServTable
                  batchdetlsstate={batchdetls}
                  setBatchDetlsState={setBatchdetls}
                  handleAddBatchDetls={handleAddBatchDetls}
                  handleEditBatchDetls={handleEditBatchDetls}
                  handleDeleteBatchDetls={handleDeleteBatchDetls}
                />
              </GridItem>
            )} */}

            {doclayout !== 'Service' && (
              <GridItem colSpan={12}>
                <TranPODetlsTable
                  batchdetlsstate={batchdetls}
                  setBatchDetlsState={setBatchdetls}
                  handleAddBatchDetls={handleAddBatchDetls}
                  handleEditBatchDetls={handleEditBatchDetls}
                  handleDeleteBatchDetls={handleDeleteBatchDetls}
                />
              </GridItem>
            )}
            <GridItem colSpan={12} w={'100%'}>
              <Divider borderWidth={1} borderColor="teal" />
            </GridItem>
          </Grid>
        </form>
      </VStack>
      <Modal opened={isBatchDetlsOpen} onClose={onBatchDetlsClose} size="xl">
        <TranPODetlsForm
          state={singlebatchdetlsstate}
          setState={setSingleBatchDetlsState}
          serialstate={singlebatchserialstate}
          setSerialState={setSingleBatchSerialState}
          add_Item={add_BatchDetls}
          update_Item={update_BatchDetls}
          statustype={statustype}
          onItemClose={onBatchDetlsClose}
        />
      </Modal>
      {/*  <Modal
        closeOnOverlayClick={false}
        isOpen={isBatchDetlsServOpen}
        onClose={onBatchDetlsServClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          
          <ModalCloseButton />
          <ModalBody>
            <PurchaseDetlsServForm
              state={singlebatchdetlsstate}
              setState={setSingleBatchDetlsState}
              add_Item={add_BatchDetls}
              update_Item={update_BatchDetls}
              statustype={statustype}
              onItemClose={onBatchDetlsServClose}
            />
          </ModalBody>

        </ModalContent>
      </Modal> */}
      <Modal opened={isSearchOpen} onClose={onSearchClose} size="4xl">
        <SupplierSearchTable
          //state={state}
          //setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_SuppDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onSupplierSearchClose={onSearchClose}
        />
      </Modal>

      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDelBatchDetlsConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Item"
      >
        <Heading size="md">
          Are you sure you want to delete this item {editBatchdetlsId.itemno}?
        </Heading>
      </AlertDialogBox>
    </Box>
  );
};

export default TranPOForm;
