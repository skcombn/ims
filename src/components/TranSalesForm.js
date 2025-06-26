import React, { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import currency from 'currency.js';
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
import { Group, Modal, Select } from '@mantine/core';
import { branch } from '../utils/constants';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  LockIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { TiArrowBack, TiPrinter } from 'react-icons/ti';
import { IconTrash, IconLock } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import {
  tranState,
  trandetlsState,
  tranlotsState,
  transerialState,
  editTranIdState,
  editTranDetlsIdState,
  editTranLotsIdState,
  editTranSerialIdState,
} from '../data/atomdata';
//import { usePurchases } from '../react-query/purchases/usePurchases';
import { useItems } from '../react-query/items/useItems';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import { useUpdateItemExpiry } from '../react-query/itemsexpiry/useUpdateItemExpiry';
import { useItemsSerial } from '../react-query/itemsserial/useItemsSerial';
import { useUpdateItemSerial } from '../react-query/itemsserial/useUpdateItemSerial';
import { useTrans } from '../react-query/trans/useTrans';
import { useAddTran } from '../react-query/trans/useAddTran';
import { useUpdateTran } from '../react-query/trans/useUpdateTran';
//import { useDeletePurchase } from '../react-query/purchases/useDeletePurchase';
import { useTransDetls } from '../react-query/transdetls/useTranDetls';
import { useAddTranDetls } from '../react-query/transdetls/useAddTranDetls';
import { useDeleteTranDetls } from '../react-query/transdetls/useDeleteTranDetls';
import { useTranLots } from '../react-query/translots/useTranLots';
import { useAddTranLot } from '../react-query/translots/useAddTranLot';
import { useDeleteTranLot } from '../react-query/translots/useDeleteTranLot';
import { useTranSerial } from '../react-query/transserial/useTranSerial';
import { useAddTranSerial } from '../react-query/transserial/useAddTranSerial';
import { useDeleteTranSerial } from '../react-query/transserial/useDeleteTranSerial';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentno';
//import { useAddPayable } from '../react-query/payable/useAddPayable';
import { useAddItemsHistory } from '../react-query/itemshistory/useAddItemsHistory';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';
import CustomerSearchTable from './CustomerSearchTable';
import TranSalesDetlsForm from './TranSalesDetlsForm';
//import TranDetlsServForm from './PurchaseDetlsServForm';
import TranSalesDetlsTable from './TranSalesDetlsTable';
import { useGroups } from '../react-query/groups/useGroups';
import { useAddGroup } from '../react-query/groups/useAddGroup';
import GroupForm from './GroupForm';
//import StktakeSearchTable from "./StktakeSearchTable";
//import PurchaseDetlsServTable from './PurchaseDetlsServTable';

/* const initial_ap = {
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
}; */

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

const initial_batchlot = {
  tl_id: '',
  tl_tranno: '',
  tl_type: 'Item',
  tl_itemno: '',
  tl_lotno: '',
  tl_datereceived: null,
  tl_location: '',
  tl_dateexpiry: null,
  tl_pono: '',
  tl_podate: null,
  tl_qtyonhand: 0,
  tl_qtyreceived: 0,
  tl_ucost: 0,
  tl_post: '0',
  tl_qty: 0,
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
  it_branch: branch,
  it_postdate: null,
  it_remark: '',
  it_desp: '',
  it_packing: '',
  it_lotno: '',
};

const initial_group = {
  group_desp: '',
  group_category: '',
};

const TranSalesForm = () => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { items } = useItems();
  const updateItem = useUpdateItem();
  const { itemsexpiry, setItemExpId } = useItemsExpiry();
  const updateItemExpiry = useUpdateItemExpiry();
  const { itemsserial, setItemSerialId } = useItemsSerial();
  const updateItemSerial = useUpdateItemSerial();
  const addGroup = useAddGroup();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');
  const [groupstate, setGroupState] = useState('');
  const addTran = useAddTran();
  const updateTran = useUpdateTran();
  const addTranDetls = useAddTranDetls();
  const deleteTranDetls = useDeleteTranDetls();
  const addTranLot = useAddTranLot();
  const deleteTranLot = useDeleteTranLot();
  const addTranSerial = useAddTranSerial();
  const deleteTranSerial = useDeleteTranSerial();
  const addItemsHistory = useAddItemsHistory();
  const { transactions } = useTrans();
  const { transdetls } = useTransDetls();
  const { translots } = useTranLots();
  const { transserial } = useTranSerial();
  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState();
  const [singlebatchlotsstate, setSingleBatchLotsState] = useState();
  const [singlebatchserialstate, setSingleBatchSerialState] = useState();
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('Purchase');
  const [batch, setBatch] = useRecoilState(tranState);
  const [batchdetls, setBatchdetls] = useRecoilState(trandetlsState);
  const [batchlots, setBatchlots] = useRecoilState(tranlotsState);
  const [batchserial, setBatchSerial] = useRecoilState(transerialState);
  const [editBatchId, setEditBatchId] = useRecoilState(editTranIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] =
    useRecoilState(editTranDetlsIdState);
  const [editBatchlotsId, setEditBatchlotsId] =
    useRecoilState(editTranLotsIdState);
  const [editBatchserialId, setEditBatchSerialId] = useRecoilState(
    editTranSerialIdState
  );
  const [doclayout, setDocLayout] = useState(editBatchId.layout);
  const [tranno, setTranno] = useState(batch.t_no);
  const [totamt, setTotAmt] = useState(batch.t_subtotal);
  const [totdisc, setTotDisc] = useState(batch.t_disc);
  const [lock, setLock] = useState(batch.t_post);

  //console.log('batch', batch);
  //console.log('batch detls', batchdetls);
  //console.log('batch lots', batchlots);
  //console.log('batch serial', batchserial);
  //console.log('edit batch', editBatchId);
  //console.log('doc', documentno);
  console.log('transdetls', transdetls);
  console.log('translot', translots);

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
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
  } = useDisclosure();

  const {
    isOpen: isStktakeSearchOpen,
    onOpen: onStktakeSearchOpen,
    onClose: onStktakeSearchClose,
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
      ...batch,
    },
  });

  const add_Batch = data => {
    console.log('add batch', data);
    const { t_no, t_type } = data;
    addTran(data);
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
    batchdetls.forEach(rec => {
      const { tl_id, ...fields } = rec;
      addTranDetls({ ...fields, tl_tranno: t_no });
    });
    batchlots.forEach(rec => {
      const { tl_id, ...fields } = rec;
      addTranLot({ ...fields, tl_tranno: t_no, tl_trantype: t_type });
    });
  };

  const update_Batch = data => {
    console.log('edit batch', data);
    const { id, t_id, t_no, ...fields } = data;

    // delete old details
    const detlsitems = transdetls.filter(r => r.tl_tranno === t_no);
    detlsitems.length > 0 &&
      detlsitems.forEach(rec => {
        deleteTranDetls(rec);
      });

    const lotitems = translots.filter(r => r.tl_tranno === t_no);
    lotitems.length > 0 &&
      lotitems.forEach(rec => {
        deleteTranLot(rec);
      });

    // delete old details
    //deleteTranDetls({ tl_tranno: t_no });
    // update header
    updateTran(data);
    //add details
    batchdetls.forEach(rec => {
      const { tl_id, ...fields } = rec;
      console.log('adddetls', rec);
      addTranDetls({ ...fields, tl_trantype: data.t_type });
    });
    batchlots.forEach(rec => {
      const { tl_id, ...fields } = rec;
      addTranLot({ ...fields, tl_tranno: t_no });
    });
  };

  const handleCalc = () => {
    console.log('calc');
    const totalamt =
      batchdetls &&
      batchdetls.reduce((acc, item) => {
        return acc + item.tl_amount;
      }, 0);
    setValue('t_subtotal', totalamt);
    setValue('t_nettotal', totalamt - totdisc);
  };

  const handleCustomerSearch = () => {
    onSearchOpen();
  };

  const update_CustDetls = data => {
    const { c_custno, c_cust, c_area, c_add1, c_add2, c_add3, c_add4 } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          t_scno: c_custno,
          t_sc: c_cust,
          t_add1: c_add1,
          t_add2: c_add2,
          t_add3: c_add3,
          t_add4: c_add4,
        })
    );
    setValue('t_scno', c_custno);
    setValue('t_sc', c_cust);
  };

  /* const update_SuppDetls = data => {
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
  }; */

  /* const handleSearchSupp = data => {
    const result = suppliers.filter(r => r.s_suppno === data);
    update_SuppDetls(...result);
  }; */

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
        return {
          ...initial_batchdetls,
          tl_tranno: editBatchId.no,
          tl_type: "item",
          tl_itemno: rec.std_itemno,
          tl_desp: itemrec[0].item_desp,
          tl_ucost: itemrec[0].item_cost,
          tl_netucost: itemrec[0].item_cost,
          tl_qty: rec.std_qty,
          tl_trackexpiry: itemrec[0].item_trackexpiry,
          tl_unit: itemrec[0].item_unit,
          tl_excost: Math.round(rec.std_qty * itemrec[0].item_cost),
        };
      });
    var oldData = [];
    if (batchdetls.length > 0) {
      oldData = batchdetls;
    }
    console.log("import", oldData, newData);
    setBatchdetls([...oldData, ...newData]);
    setIsCalc(true);
  }; */

  const handlePost = () => {
    var doctype = '';
    var qtyonhand = 0;
    var price = 0;
    var cost = 0;
    var suppno = '';
    var supp = '';
    const data = getValues();
    const newData = { ...data, t_post: '1' };
    onSubmit(newData);

    // console.log('post batchlots', batchlots);

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
          it_value: rec.tl_uprice,
          it_disc: rec.tl_disc,
          it_netvalue: rec.tl_uprice,
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
        //update item onhand
        if (itemonhandrec.length > 0) {
          switch (data.t_type) {
            case 'Sales Returns':
              qtyonhand = itemonhandrec[0].item_qtyonhand + rec.tl_qty;
              cost = rec.tl_ucost;
              suppno = rec.tl_scno;
              supp = rec.tl_sc;

              break;
            case 'Sales':
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
          //console.log('Sales item update', newData);
          //console.log('Sales onhandrec', itemonhandrec);
          updateItem(newData);
        }
      });
      //batch lots
      if (batchlots.length > 0) {
        batchlots.forEach(rec => {
          const { tl_itemno, tl_pono, tl_qty } = rec;
          // get expiry log details
          const itemexpiryrec = itemsexpiry
            .filter(r => r.ie_itemno === tl_itemno && r.ie_pono === tl_pono)
            .map(rec => {
              const qtybal = rec.ie_qtyonhand - tl_qty;
              const post = qtybal > 0 ? '0' : '1';
              return { ...rec, ie_qtyonhand: qtybal, ie_post: post };
            });
          console.log('itemexpiryrec', itemexpiryrec);

          updateItemExpiry(itemexpiryrec[0]);
        });
      }
      //add to auditlog
      console.log('post audilot');
      const auditdata = {
        al_userid: localuser.userid,
        al_user: localuser.name,
        al_date: dayjs().format('YYYY-MM-DD'),
        al_time: dayjs().format('HHmmss'),
        al_timestr: dayjs().format('HH:mm:ss'),
        al_module: 'Sales',
        al_action: 'Post',
        al_record: data.t_no,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
    }
    //navigate
    navigate(-1);
  };

  const handleOnSubmit = values => {
    onSubmit(values);
    navigate(-1);
  };

  const onSubmit = values => {
    var nexttranno = 0;
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
        al_module: 'Sales',
        al_action: 'Edit',
        al_record: values.t_no,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
      const newData = { ...values, t_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      // const { doc_purchase, doc_despatch, doc_abbre } = documentno[0] || 0;

      // const docno = doc_despatch;
      const docabbre = 'INV';
      const year = dayjs().year().toString().substring(2);

      //get next sample no
      const transarray = transactions
        .filter(
          r =>
            r.t_type === 'Sales' &&
            r.t_no.substring(0, 5) ===
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

      // const newno = docno + 1;
      // const newstrno = (10000000 + newno).toString().substring(1);
      // const year = dayjs().year().toString().substring(2);
      // const newdocno = docabbre + year + newstrno + doc_abbre;
      // updateDocumentno({ ...documentno[0], doc_despatch: newno });
      console.log('nexttranno', nexttranno);
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
        al_module: 'Sales',
        al_action: 'Add',
        al_record: newdocno,
        al_remark: 'Successful',
      };
      addAuditlog(auditdata);
    }
  };

  const handleExit = () => {
    // navigate
    navigate(-1);
  };

  const handleEditBatchDetls = row => {
    const { original } = row;
    const lotdata = batchlots
      .filter(r => r.tl_itemno === original.tl_itemno)
      .map(rec => {
        return { ...rec };
      });
    console.log('lot edit', lotdata);
    const serialdata = batchserial
      .filter(r => r.ts_itemno === original.tl_itemno)
      .map(rec => {
        return { ...rec };
      });
    console.log('serial edit', serialdata);
    setEditBatchdetlsId(
      prev =>
        (prev = { id: original.tl_id, no: original.tl_itemno, type: 'edit' })
    );
    //setStatusType(prev => (prev = 'edit'));
    setSingleBatchDetlsState(prev => original);
    setSingleBatchLotsState(prev => [...lotdata]);
    setSingleBatchSerialState(prev => [...serialdata]);
    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
  };

  const handleDeleteBatchDetls = row => {
    const { original } = row;
    const { tl_id, tl_itemno } = original;
    setEditBatchdetlsId(prev => (prev = { id: tl_id, no: tl_itemno }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    //setStatusType(prev => (prev = 'add'));
    const doctype = getValues('t_type');
    setEditBatchdetlsId(prev => (prev = { id: '', no: '', type: 'add' }));
    const data = {
      ...initial_batchdetls,
      tl_id: nanoid(),
      tl_tranno: editBatchId.no,
      tl_type: 'Item',
      tl_trantype: doctype,
    };
    setSingleBatchDetlsState(data);
    /*  const lotdata = {
      ...initial_batchlot,
      tl_id: nanoid(),
      tl_tranno: editBatchId.no,
      tl_type: 'Item',
    };
    setSingleBatchLotsState(lotdata); */
    setSingleBatchLotsState(
      prev => (prev = translots.filter(r => r.tl_tranno === ''))
    );
    setSingleBatchSerialState(
      prev => (prev = transserial.filter(r => r.ts_itemno === ''))
    );
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
    const oldData = batchdetls.filter(r => r.tl_id !== data.tl_id);
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
      .filter(r => r.tl_itemno !== editBatchdetlsId.no)
      .map(rec => {
        return { ...rec };
      });
    console.log('editdata lot olddata', oldData);
    setBatchlots([...oldData, ...data]);
    //setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    const { id, no } = editBatchdetlsId;
    console.log('deldata', no);
    const newData = batchdetls.filter(r => r.tl_id !== id);
    const newLotData = batchlots
      .filter(r => r.tl_itemno !== no)
      .map(rec => {
        return { ...rec };
      });
    const newSerialData = batchserial
      .filter(r => r.ts_itemno !== no)
      .map(rec => {
        return { ...rec };
      });
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setBatchlots([...newLotData]);
    setBatchSerial([...newSerialData]);
    setIsCalc(true);
  };

  const handleOnDelBatchLotsConfirm = () => {
    //console.log("deldata", data)
    const { id } = editBatchlotsId;
    const newData = batchlots.filter(r => r.tl_id !== id);
    console.log('delete', newData);
    setBatchlots([...newData]);
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
      al_module: 'Sales',
      al_action: 'Print',
      al_record: batch.t_no,
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // print
    navigate('/transalesprint');
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
        //align="left"
        //alignItems="flex-start"
      >
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <form>
          <HStack py={2} spacing="3">
            <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
              <GridItem colSpan={1}>
                <Button
                  leftIcon={<TiArrowBack size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                  variant="outline"
                  size="lg"
                >
                  Back
                </Button>
              </GridItem>
              <GridItem colSpan={3}>
                <VStack alignItems={'flex-start'} px={1}>
                  <Heading size="lg">Sales Form</Heading>
                  <Divider border="2px solid teal" w={300} />
                </VStack>
              </GridItem>
              <GridItem colSpan={3}></GridItem>
              {/* <GridItem colSpan={1}>
                {lock === '1' && <IconLock size={42} color="red" />}
                {lock === 'D' && <IconTrash size={42} color="red" />}
              </GridItem> */}
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
                        variant="outline"
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
                        variant="outline"
                        size="lg"
                        onClick={handlePrint}
                        isDisabled={isFetching}
                      >
                        Print
                      </Button>
                      <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        variant="outline"
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
                        variant="outline"
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
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Cust No
                            </Text>
                            <Input
                              name="t_scno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="customer no"
                              minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleCustomerSearch()}
                        icon={<SearchIcon />}
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
                            Customer
                          </Text>
                          <Input
                            name="t_sc"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="customer"
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
                            Invoice No
                          </Text>
                          <Input
                            name="t_no"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="invoice no"
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
                            Invoice Date
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
                            placeholder="invoice date"
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
                          {/*  <Input
                            name="t_type"
                            value={value || ""}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="type"
                            minWidth="100"
                            readOnly
                          /> */}
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
                              { value: 'Sales', label: 'Sales' },
                              {
                                value: 'Sales Returns',
                                label: 'Sales Returns',
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
                            DO No
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
                            placeholder="delivery no"
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
                            DO Date
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
                            placeholder="delivery date"
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
                </GridItem>
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
                <TranSalesDetlsTable
                  batchdetlsstate={batchdetls}
                  setBatchDetlsState={setBatchdetls}
                  batchlotsstate={batchlots}
                  setBatchLotsState={setBatchlots}
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
      <Modal opened={isBatchDetlsOpen} onClose={onBatchDetlsClose} size="auto">
        <TranSalesDetlsForm
          state={singlebatchdetlsstate}
          setState={setSingleBatchDetlsState}
          lotstate={singlebatchlotsstate}
          setLotState={setSingleBatchLotsState}
          serialstate={singlebatchserialstate}
          setSerialState={setSingleBatchSerialState}
          add_Item={add_BatchDetls}
          update_Item={update_BatchDetls}
          add_LotItem={add_BatchLots}
          update_LotItem={update_BatchLots}
          //statustype={statustype}
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
        <CustomerSearchTable
          //state={state}
          //setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_CustDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onCustomerSearchClose={onSearchClose}
        />
      </Modal>
      <Modal opened={isGroupOpen} onClose={onGroupClose} size="4xl">
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

export default TranSalesForm;
