import React, { useState, useEffect } from 'react';
import currency from 'currency.js';
import { round } from 'lodash';
import { useIsFetching } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { Controller, useForm } from 'react-hook-form';
import { useCustomToast } from '../helpers/useCustomToast';
import { formatPrice } from '../helpers/utils';
import { FiSave } from 'react-icons/fi';
import { ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  //Container,
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
  Select,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
import { NumberInput, Modal } from '@mantine/core';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  LockIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
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
  editTranadjustLotIdState,
} from '../data/atomdata';
import { useAddTransadjust } from '../react-query/transadjust/useAddTransadjust';
import { useUpdateTransadjust } from '../react-query/transadjust/useUpdateTransadjust';
import { useTransadjustDetls } from '../react-query/transadjustdetls/useTransadjustsDetls';
import { useAddTransAdjustDetls } from '../react-query/transadjustdetls/useAddTransAdjustDetls';
import { useDeleteTransAdjustDetls } from '../react-query/transadjustdetls/useDeleteTransAdjustDetls';
import { useTransadjustLot } from '../react-query/transadjlot/useTransadjustLot';
import { useAddTransAdjustLot } from '../react-query/transadjlot/useAddTransadjustLot';
import { useUpdateTransadjustLot } from '../react-query/transadjlot/useUpdateTransadjustLot';
import { useDeleteTransAdjustLot } from '../react-query/transadjlot/useDeleteTransadjustLot';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentno';
import { useItems } from '../react-query/items/useItems';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useAddItemsHistory } from '../react-query/itemshistory/useAddItemsHistory';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import { useUpdateItemExpiry } from '../react-query/itemsexpiry/useUpdateItemExpiry';
//import { useStktakedetls } from "../react-query/stktakedetls/useStktakedetls";
//import { useItemsOnhand } from '../react-query/itemsonhand/useItemsOnhand';
//import { useUpdateItemsOnhand } from '../react-query/itemsonhand/useUpdateItemsOnhand';
import SupplierSearchTable from './SupplierSearchTable';
import CustomerSearchTable from './CustomerSearchTable';
import TransAdjustDetlsForm from './TransAdjustDetlsForm';
//import TranDetlsServForm from './PurchaseDetlsServForm';
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
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { suppliers } = useSuppliers();
  const addTransadjust = useAddTransadjust();
  const updateTransadjust = useUpdateTransadjust();
  const addTransadjustDetls = useAddTransAdjustDetls();
  const deleteTransadjustDetls = useDeleteTransAdjustDetls();
  const addTransadjustLot = useAddTransAdjustLot();
  const deleteTransadjustLot = useDeleteTransAdjustLot();
  //const addPayable = useAddPayable();
  const addItemsHistory = useAddItemsHistory();
  //const { itemsonhand } = useItemsOnhand();
  //const updateItemOnhand = useUpdateItemsOnhand();
  const { items } = useItems();
  const updateItem = useUpdateItem();
  const { itemsexpiry, setItemExpId } = useItemsExpiry();
  const updateItemExpiry = useUpdateItemExpiry();
  //const { stktakedetls, setBatchDetlsId } = useStktakedetls();
  const { tranadjust } = useTransadjust();
  const { tranadjustdetls } = useTransadjustDetls();
  const { tranadjustlot } = useTransadjustLot();
  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState([]);
  const [singlebatchlotsstate, setSingleBatchLotsState] = useState([]);
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('');
  const [batch, setBatch] = useRecoilState(tranadjustState);
  const [batchdetls, setBatchdetls] = useRecoilState(tranadjustdetlsState);
  const [batchlots, setBatchlots] = useRecoilState(tranadjustlotState);
  //const [batchserial, setBatchSerial] = useRecoilState(transerialState);
  const [editBatchId, setEditBatchId] = useRecoilState(editTranadjustIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editTranadjustDetlsIdState
  );
  const [editBatchlotId, setEditBatchlotId] = useRecoilState(
    editTranadjustLotIdState
  );

  const [doclayout, setDocLayout] = useState(editBatchId.layout);
  const [tranno, setTranno] = useState(batch.ta_batchno);
  const [totamt, setTotAmt] = useState(batch.ta_subtotal);
  const [totdisc, setTotDisc] = useState(batch.ta_disc);
  const [lock, setLock] = useState(batch.ta_post);

  //console.log('transadjdetls', tranadjustdetls);
  //console.log('tranadjlot', tranadjustlot);
  console.log('batchdetls state', batchdetls);
  console.log('batchlots state', batchlots);

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

  /* const {
    isOpen: isStktakeSearchOpen,
    onOpen: onStktakeSearchOpen,
    onClose: onStktakeSearchClose,
  } = useDisclosure(); */

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
      ...batch,
    },
  });

  const add_Batch = data => {
    //console.log('add batch', data);
    const { ta_batchno } = data;
    addTransadjust(data);
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
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
    //console.log('edit batch data', data);
    console.log('update batch lot', batchlots);
    const { ta_id, ta_batchno, ...fields } = data;
    // delete old details
    //deleteTransadjustDetls({ tad_batchno: ta_batchno });
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

  /* const handleCalc = () => {
    console.log("calc");
    const totalamt = batchdetls.reduce((acc, item) => {
      return acc + item.tal_excost;
    }, 0);
    setValue("ta_subtotal", totalamt);
    setValue("ta_nettotal", totalamt - totdisc);
  }; */

  const handleSupplierSearch = () => {
    onSuppSearchOpen();
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

  const handleSearchSupp = data => {
    const result = suppliers.filter(r => r.s_suppno === data);
    update_SuppDetls(...result);
  };

  /* const handleStktakeSearch = () => {
    onStktakeSearchOpen();
  }; */

  /* const update_StktakeDetls = (data) => {
    console.log("stktake", data);
    const { st_batchno } = data;
    const newData = stktakedetls
      .filter((r) => r.std_batchno === st_batchno)
      .map((rec) => {
        const itemno = rec.std_itemno;
        const itemrec = items.filter((r) => r.item_no === itemno);
        const qtyadjust = rec.std_qty - itemrec[0].item_qtyonhand;
        return {
          ...initial_batchdetls,
          tad_batchno: editBatchId.no,
          tad_itemno: rec.std_itemno,
          tad_desp: itemrec[0].item_desp,
          tad_qtyonhand: itemrec[0].item_qtyonhand,
          tad_qtycount: rec.std_qty,
          tad_qtyadjust: qtyadjust,
        };
      });
    var oldData = [];
    if (batchdetls.length > 0) {
      oldData = batchdetls;
    }
    console.log("import", oldData, newData);
    setBatchdetls([...oldData, ...newData]);
    setIsCalc(true);
  };
 */
  const handleCustSearch = () => {
    onCustSearchOpen();
  };

  const update_CustDetls = data => {
    const { c_custno, c_cust } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          ta_scno: c_custno,
          ta_sc: c_cust,
        })
    );
    setValue('ta_scno', c_custno);
    setValue('ta_sc', c_cust);
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
      //addAuditlog(auditdata);
    }

    //console.log('addpurchase', statustype, newstrno, newdata);
    //navigate(-1);
  };

  const handlePost = () => {
    var doctype = '';
    var qtyonhand = 0;
    var price = 0;
    var cost = 0;
    var suppno = '';
    var supp = '';
    const data = getValues();
    const newData = { ...data, ta_post: '1' };
    console.log('post', newData);
    onSubmit(newData);

    /*  const ap = {
      ...initial_ap,
      ap_pono: data.po_no,
      ap_podate: data.po_date,
      ap_invno: data.po_invno,
      ap_invdate: data.po_invdate,
      ap_suppno: data.po_suppno,
      ap_supplier: data.po_supp,
      ap_type: data.po_type,
      ap_subtotal_amt: data.po_subtotal,
      ap_nettotal_amt: data.po_nettotal,
      ap_disc_amt: data.po_disc,
      ap_balance: data.po_nettotal,
    };
    addPayable(ap); */

    /*  switch (trantype) {
      case 'Purchase':
        doctype = 'Purchase';
        break;
      case 'Despatch':
        doctype = 'Despatch';
        break;

      default:
        break;
    } */
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
        //add item expiry table
        /*  if (rec.tl_trackexpiry) {
          const itemexpirydata = {
            ...initial_expiry,
            ie_itemno: rec.tl_itemno,
            ie_lotno: rec.tl_lotno,
            ie_dateexpiry: rec.tl_dateexpiry,
            ie_pono: data.t_no,
            ie_podate: data.t_date,
            ie_datereceived: data.t_date,
            ie_qtyonhand: rec.tl_qty,
            ie_qtyreceived: rec.tl_qty,
            ie_ucost: rec.tl_netucost,
          };
          console.log('expiry', itemexpirydata);
          addItemExpiry(itemexpirydata);
        } */

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
          const { id, item_id, ...fields } = newData;
          updateItem(newData);
        }
      });
      //batch lots
      if (batchlots.length > 0) {
        batchlots.forEach(rec => {
          const { tal_itemno, tal_pono, tal_qtycount, tal_qtyadjust } = rec;
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
    //setStatusType(prev => (prev = 'add'));
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
    //   console.log('newdata', newData);
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
    //   console.log('newdata', newData);
    setBatchlots(newData);
    //setIsCalc(true);
  };

  const update_BatchLots = data => {
    console.log('editdata lot', data);
    //const dataUpdate = { ...data };
    //console.log('editdata lot', dataUpdate);
    const oldData = batchlots
      .filter(r => r.tal_itemno !== editBatchdetlsId.no)
      .map(rec => {
        return { ...rec };
      });
    console.log('editdata lot olddata', oldData);
    setBatchlots([...oldData, ...data]);
    //setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    //console.log("deldata", data)
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.tad_id !== id);
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setIsCalc(true);
  };

  /* useEffect(() => {
    handleCalc();
    setIsCalc(false);
  }, [isCalc, totamt, totdisc]); */

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
              {/*   <GridItem colSpan={1}>
                {lock === '1' && <LockIcon boxSize={8} color="red" />}
              </GridItem> */}
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
                        isDisabled={isFetching}
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
                            //textTransform="capitalize"
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
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="batch date"
                            //minWidth="100"
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
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="category"
                          >
                            <option value="Adjustment">Adjustment</option>
                          </Select>
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                {/*  <GridItem colSpan={2} mt={field_gap}>
                  <HStack>
                    <FormControl>
                      <Controller
                        control={control}
                        name="ta_scno"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              From / To
                            </Text>
                            <Input
                              name="ta_scno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="from / to"
                              //minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        //onClick={() => handleSupplierSearch()}
                        icon={<SearchIcon />}
                        size="md"
                        colorScheme="teal"
                      />
                    </Box>
                  </HStack>
                </GridItem> */}
                {/*   <GridItem colSpan={4} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="ta_sc"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Name
                          </Text>
                          <Input
                            name="ta_sc"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="name"
                            //minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem> */}
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
                            //textTransform="capitalize"
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
          //statustype={statustype}
          onItemClose={onBatchDetlsClose}
        />
      </Modal>
      <Modal opened={isSuppSearchOpen} onClose={onSuppSearchClose} size="4x1">
        <SupplierSearchTable
          update_Item={update_SuppDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onSupplierSearchClose={onSuppSearchClose}
        />
      </Modal>
      <Modal opened={isCustSearchOpen} onClose={onCustSearchClose} size="4x1">
        <CustomerSearchTable
          update_Item={update_SuppDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onSupplierSearchClose={onCustSearchClose}
        />
      </Modal>
      {/* <Modal
        opened={isStktakeSearchOpen}
        onClose={onStktakeSearchClose}
        size="2x1"
      >
        <StktakeSearchTable
          //state={state}
          //setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_StktakeDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onStktakeSearchClose={onStktakeSearchClose}
        />
      </Modal> */}
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
