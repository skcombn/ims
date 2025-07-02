import { useState } from 'react';
import { round } from 'lodash';
import { useIsFetching } from '@tanstack/react-query';
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
  Input,
  Select,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Modal } from '@mantine/core';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Group } from '@mantine/core';
import { TiArrowBack, TiPrinter } from 'react-icons/ti';
import { IconLock, IconTrash } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import {
  tranadjustState,
  tranadjustdetlsState,
  tranadjustlotState,
  editTranadjustIdState,
  editTranadjustDetlsIdState,
} from '../data/atomdata';
import { useAddTransadjust } from '../react-query/transadjust/useAddTransadjust';
import { useUpdateTransadjust } from '../react-query/transadjust/useUpdateTransadjust';
import { useTransadjustDetls } from '../react-query/transadjustdetls/useTransadjustsDetls';
import { useAddTransAdjustDetls } from '../react-query/transadjustdetls/useAddTransAdjustDetls';
import { useDeleteTransAdjustDetls } from '../react-query/transadjustdetls/useDeleteTransAdjustDetls';
import { useTransadjustLot } from '../react-query/transadjlot/useTransadjustLot';
import { useAddTransAdjustLot } from '../react-query/transadjlot/useAddTransadjustLot';
import { useDeleteTransAdjustLot } from '../react-query/transadjlot/useDeleteTransadjustLot';
import { useItems } from '../react-query/items/useItems';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useAddItemsHistory } from '../react-query/itemshistory/useAddItemsHistory';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import { useUpdateItemExpiry } from '../react-query/itemsexpiry/useUpdateItemExpiry';
import SupplierSearchTable from './SupplierSearchTable';
import CustomerSearchTable from './CustomerSearchTable';
import TransAdjustDetlsForm from './TransAdjustDetlsForm';
import TransAdjustDetlsTable from './TransAdjustDetlsTable';
import { useTransadjust } from '../react-query/transadjust/useTransadjust';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';

const initial_batchdetls = {
  tad_id: '',
  tad_batchno: '',
  tad_itemno: '',
  tad_desp: '',
  tad_packing: '',
  tad_qtyonhand: 0,
  tad_qtycount: 0,
  tad_qtyadjust: 0,
  tad_branch: '',
  tad_unit: '',
  tad_trackexpiry: false,
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
};

const TransAdjustForm = () => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_gap = '3';
  const addTransadjust = useAddTransadjust();
  const updateTransadjust = useUpdateTransadjust();
  const addTransadjustDetls = useAddTransAdjustDetls();
  const deleteTransadjustDetls = useDeleteTransAdjustDetls();
  const addTransadjustLot = useAddTransAdjustLot();
  const deleteTransadjustLot = useDeleteTransAdjustLot();
  const addItemsHistory = useAddItemsHistory();
  const { items } = useItems();
  const updateItem = useUpdateItem();
  const { itemsexpiry, setItemExpId } = useItemsExpiry();
  const updateItemExpiry = useUpdateItemExpiry();
  const { tranadjust } = useTransadjust();
  const { tranadjustdetls } = useTransadjustDetls();
  const { tranadjustlot } = useTransadjustLot();
  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState([]);
  const [singlebatchlotsstate, setSingleBatchLotsState] = useState([]);
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  const [batch, setBatch] = useRecoilState(tranadjustState);
  const [batchdetls, setBatchdetls] = useRecoilState(tranadjustdetlsState);
  const [batchlots, setBatchlots] = useRecoilState(tranadjustlotState);
  const [editBatchId, setEditBatchId] = useRecoilState(editTranadjustIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editTranadjustDetlsIdState
  );

  const [doclayout, setDocLayout] = useState(editBatchId.layout);

  const [lock, setLock] = useState(batch.ta_post);

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
    isOpen: isSuppSearchOpen,
    onOpen: onSuppSearchOpen,
    onClose: onSuppSearchClose,
  } = useDisclosure();

  const {
    isOpen: isCustSearchOpen,
    onOpen: onCustSearchOpen,
    onClose: onCustSearchClose,
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
    const { ta_batchno } = data;
    addTransadjust(data);
    //add details
    batchdetls.forEach(rec => {
      const { tad_id, ...fields } = rec;
      addTransadjustDetls({ ...fields, tad_batchno: ta_batchno });
    });
    batchlots.forEach(rec => {
      const { tal_id, ...fields } = rec;
      addTransadjustLot({ ...fields, tal_batchno: ta_batchno });
    });
  };

  const update_Batch = data => {
    const { ta_id, ta_batchno } = data;
    // delete old details
    tranadjustdetls
      .filter(r => r.tad_batchno === ta_batchno)
      .forEach(rec => {
        deleteTransadjustDetls(rec);
      });
    const lotitems = tranadjustlot.filter(r => r.tal_batchno === ta_batchno);
    lotitems.length > 0 &&
      lotitems.forEach(rec => {
        deleteTransadjustLot(rec);
      });

    // update header
    updateTransadjust(data);
    //add details
    batchdetls.forEach(rec => {
      const { tad_id, ...fields } = rec;
      addTransadjustDetls({ ...fields, tad_batchno: ta_batchno });
    });
    batchlots.forEach(rec => {
      const { tal_id, ...fields } = rec;
      addTransadjustLot({ ...fields, tal_batchno: ta_batchno });
    });
  };

  const update_SuppDetls = data => {
    const { s_suppno, s_supp } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          ta_scno: s_suppno,
          ta_sc: s_supp,
        })
    );
    setValue('ta_scno', s_suppno);
    setValue('ta_sc', s_supp);
  };

  const handleOnSubmit = values => {
    onSubmit(values);
    navigate(-1);
  };

  const onSubmit = values => {
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
        al_module: 'Adjustment',
        al_action: 'Edit',
        al_record: values.ta_batchno,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
      const newData = { ...values, ta_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      var nexttranno = 0;
      // const docno = doc_despatch;
      const docabbre = 'ADJ';
      const year = dayjs().year().toString().substring(2);

      //get next sample no
      const transarray = tranadjust
        .filter(
          r =>
            r.ta_batchno.substring(0, 5) ===
            docabbre + dayjs().year().toString().substring(2)
        )
        .sort((a, b) => (a.ta_batchno > b.ta_batchno ? 1 : -1));

      if (transarray.length > 0) {
        nexttranno =
          10000001 +
          parseInt(
            transarray[transarray.length - 1].ta_batchno.substring(6, 13)
          );
      } else {
        nexttranno = 10000001;
      }
      const newdocno = docabbre + year + nexttranno.toString().substring(1);
      const newdata = { ...values, ta_batchno: newdocno };

      add_Batch(newdata);
      //add to auditlog
      const auditdata = {
        al_userid: localuser.userid,
        al_user: localuser.name,
        al_date: dayjs().format('YYYY-MM-DD'),
        al_time: dayjs().format('HHmmss'),
        al_timestr: dayjs().format('HH:mm:ss'),
        al_module: 'Adjustment',
        al_action: 'Add',
        al_record: newdocno,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
    }
  };

  const handlePost = () => {
    var qtyonhand = 0;

    var cost = 0;
    var suppno = '';
    var supp = '';
    const data = getValues();
    const newData = { ...data, ta_post: '1' };
    console.log('post', newData);
    onSubmit(newData);

    if (batchdetls.length > 0) {
      console.log('post batchdetls');
      batchdetls.forEach(rec => {
        // get itemonhand details
        const itemonhandrec = items
          .filter(r => r.item_no === rec.tad_itemno)
          .map(item => {
            return { ...item };
          });
        const extvalue = round(
          itemonhandrec[0].item_cost * rec.tad_qtyadjust,
          2
        );
        const detlsdata = {
          ...initial_it,
          it_transno: data.ta_batchno,
          it_itemno: rec.tad_itemno,
          it_transdate: data.ta_date,
          it_qty: rec.tad_qtyadjust,
          it_value: itemonhandrec[0].item_cost,
          it_disc: 0,
          it_netvalue: itemonhandrec[0].item_cost,
          it_extvalue: extvalue,
          it_pfactor: itemonhandrec[0].item_pfactor,
          it_transtype: 'Adjustment',
          it_scno: '',
          it_sc: '',
          it_branch: '',
          it_postdate: null,
          it_remark: '',
          it_desp: rec.tad_desp,
          it_packing: rec.tad_packing,
        };
        addItemsHistory(detlsdata);

        //update item onhand
        if (itemonhandrec.length > 0) {
          switch (data.ta_type) {
            case 'Purchase':
              qtyonhand = itemonhandrec[0].item_qtyonhand + rec.tl_qty;
              cost = rec.tl_ucost;
              suppno = rec.tl_scno;
              supp = rec.tl_sc;
              console.log(
                'PO here',
                qtyonhand,
                itemonhandrec[0].item_qtyonhand
              );
              break;
            case 'Dispatch':
              qtyonhand = itemonhandrec[0].item_qtyonhand - rec.tl_qty;
              cost = itemonhandrec[0].item_cost;
              suppno = itemonhandrec[0].item_suppno;
              supp = itemonhandrec[0].item_supplier;
              break;
            case 'Adjustment':
              qtyonhand = itemonhandrec[0].item_qtyonhand + rec.tad_qtyadjust;
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

          updateItem(newData);
        }
      });
      //batch lots
      if (batchlots.length > 0) {
        batchlots.forEach(rec => {
          const { tal_itemno, tal_pono, tal_qtyadjust } = rec;
          // get expiry log details
          const itemexpiryrec = itemsexpiry
            .filter(r => r.ie_itemno === tal_itemno && r.ie_pono === tal_pono)
            .map(rec => {
              const qtybal = rec.ie_qtyonhand + tal_qtyadjust;
              const post = qtybal > 0 ? '0' : '1';
              return { ...rec, ie_qtyonhand: qtybal, ie_post: post };
            });
          console.log('itemexpiryrec', itemexpiryrec);

          updateItemExpiry(itemexpiryrec[0]);
        });
      }
      //add to auditlog
      const auditdata = {
        al_userid: localuser.userid,
        al_user: localuser.name,
        al_date: dayjs().format('YYYY-MM-DD'),
        al_time: dayjs().format('HHmmss'),
        al_timestr: dayjs().format('HH:mm:ss'),
        al_module: 'Adjustment',
        al_action: 'Post',
        al_record: data.ta_batchno,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
    }
    //navigate
    navigate(-1);
  };

  const handlePrint = () => {
    // add auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Adjustment',
      al_action: 'Print',
      al_record: batch.t_no,
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // print
    navigate('/adjustmentprint');
  };

  const handleExit = () => {
    navigate(-1);
  };

  const handleEditBatchDetls = row => {
    const { original } = row;
    console.log('edit', original);
    const lotdata = batchlots
      .filter(r => r.tal_itemno === original.tad_itemno)
      .map(rec => {
        return { ...rec };
      });
    setStatusType(prev => (prev = 'edit'));
    setEditBatchdetlsId(
      prev =>
        (prev = { id: original.tad_id, no: original.tad_itemno, type: 'edit' })
    );
    setSingleBatchDetlsState(original);
    setSingleBatchLotsState(prev => [...lotdata]);
    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
  };

  const handleDeleteBatchDetls = row => {
    const { original } = row;
    const { tad_id } = original;
    setEditBatchdetlsId(prev => (prev = { id: tad_id }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    const data = {
      ...initial_batchdetls,
      tad_id: nanoid(),
      tad_branch: '',
      tad_batchno: editBatchId.no,
    };
    setSingleBatchDetlsState(data);
    setSingleBatchLotsState(
      prev => (prev = tranadjustlot.filter(r => r.tal_batchno === ''))
    );
    setEditBatchdetlsId(prev => (prev = { id: '', no: '', type: 'add' }));
    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
  };

  const add_BatchDetls = data => {
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
    const oldData = batchdetls.filter(r => r.tad_id !== data.tad_id);
    setBatchdetls([...oldData, dataUpdate]);
    setIsCalc(true);
  };

  const add_BatchLots = data => {
    console.log('adddata lot data', data);
    const newData = [...batchlots, ...data];

    setBatchlots(newData);
  };

  const update_BatchLots = data => {
    console.log('editdata lot', data);

    const oldData = batchlots
      .filter(r => r.tal_itemno !== editBatchdetlsId.no)
      .map(rec => {
        return { ...rec };
      });
    console.log('editdata lot olddata', oldData);
    setBatchlots([...oldData, ...data]);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.tad_id !== id);
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setIsCalc(true);
  };

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
        //align="left"
        //alignItems="flex-start"
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

              <GridItem colSpan={6}>
                <VStack alignItems={'flex-start'} px={1}>
                  <Heading size="lg">Adjustment Form</Heading>
                  <Divider border="2px solid teal" w={300} />
                </VStack>
              </GridItem>

              <GridItem colSpan={5}>
                <Flex>
                  <HStack mr={5}>
                    <Group>
                      <Box>
                        {lock === '1' && <IconLock size={42} color="red" />}
                        {lock === 'D' && <IconTrash size={42} color="red" />}
                      </Box>
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
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        variant={'outline'}
                        size="lg"
                        onClick={handlePost}
                        isDisabled={
                          isFetching ||
                          editBatchId.status === 'add' ||
                          lock !== '0'
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
            templateColumns={'repeat(6,1fr)'}
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
                <GridItem colSpan={2} mt={field_gap} w="100%">
                  <FormControl>
                    <Controller
                      control={control}
                      name="ta_batchno"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Batch No
                          </Text>
                          <Input
                            name="ta_batchno"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            ref={ref}
                            placeholder="batch no"
                            //="100"
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
                      name="ta_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Batch Date
                          </Text>

                          <Input
                            name="ta_date"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            ref={ref}
                            placeholder="batch date"
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
                      name="ta_type"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Doc Type
                          </Text>
                          <Select
                            name="ta_type"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            ref={ref}
                          >
                            <option value="Adjustment">Adjustment</option>
                          </Select>
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>

                <GridItem colSpan={6} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="ta_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="ta_remark"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            ref={ref}
                            placeholder="remark"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={6} w={'100%'}>
              <Divider borderWidth={1} borderColor="teal" />
            </GridItem>
            <GridItem colSpan={6}>
              <TransAdjustDetlsTable
                batchdetlsstate={batchdetls}
                setBatchDetlsState={setBatchdetls}
                batchlotsstate={batchlots}
                setBatchLotsState={setBatchlots}
                handleAddBatchDetls={handleAddBatchDetls}
                handleEditBatchDetls={handleEditBatchDetls}
                handleDeleteBatchDetls={handleDeleteBatchDetls}
              />
            </GridItem>
          </Grid>
        </form>
      </VStack>
      <Modal opened={isBatchDetlsOpen} onClose={onBatchDetlsClose} size="2xl">
        <TransAdjustDetlsForm
          state={singlebatchdetlsstate}
          setState={setSingleBatchDetlsState}
          lotsstate={singlebatchlotsstate}
          setLotsState={setSingleBatchLotsState}
          add_Item={add_BatchDetls}
          update_Item={update_BatchDetls}
          add_LotItem={add_BatchLots}
          update_LotItem={update_BatchLots}
          onItemClose={onBatchDetlsClose}
        />
      </Modal>
      <Modal opened={isSuppSearchOpen} onClose={onSuppSearchClose} size="4x1">
        <SupplierSearchTable
          update_Item={update_SuppDetls}
          onSupplierSearchClose={onSuppSearchClose}
        />
      </Modal>
      <Modal opened={isCustSearchOpen} onClose={onCustSearchClose} size="4x1">
        <CustomerSearchTable
          update_Item={update_SuppDetls}
          onSupplierSearchClose={onCustSearchClose}
        />
      </Modal>

      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDelBatchDetlsConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Item"
      >
        <Heading size="md">Are you sure you want to delete this item?</Heading>
      </AlertDialogBox>
    </Box>
  );
};

export default TransAdjustForm;
