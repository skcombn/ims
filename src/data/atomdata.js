import { atom } from 'recoil';
import dayjs from 'dayjs';

export const searchCustState = atom({
  key: 'searchCust',
  default: {
    c_custno: '',
    c_cust: '',
    c_add1: '',
    c_add2: '',
    c_add3: '',
    c_tel1: '',
    c_tel2: '',
    c_fax: '',
    c_email: '',
    c_contact: '',
    c_area: '',
  },
});

export const searchitemState = atom({
  key: 'searchitem',
  default: {
    item_id: '',
    item_code: '',
    item_desp: '',
    item_pack: '',
    item_unit: '',
    item_cat: '',
    item_brand: '',
    item_wsp: 0,
  },
});

export const salesState = atom({
  key: 'sales',
  default: {
    sls_id: '',
    sls_no: '',
    sls_date: null,
    sls_so: '',
    sls_remark: '',
    sls_term: '',
    sls_duedate: null,
    sls_custno: '',
    sls_cust: '',
    sls_add1: '',
    sls_add2: '',
    sls_add3: '',
    sls_tel1: '',
    sls_tel2: '',
    sls_subtotal: 0,
    sls_disc: 0,
    sls_freight: 0,
    sls_total: 0,
    sls_post: '0',
    sls_bank: '',
    sls_check: '',
    sls_received: '',
    sls_type: '',
    sls_shipfrom: '',
    sls_shipmenttype: '',
    sls_postdate: null,
    sls_layout: '',
    sls_glcode: '',
    sls_createdby: '',
    sls_updby: '',
    sls_createddate: null,
    sls_createdtime: '',
    sls_upddate: null,
    sls_updtime: '',
    sls_oref: '',
    sls_yref: '',
    sls_loc: '',
    sls_smno: '',
    sls_age: 0,
    sls_area: '',
    sls_print: 0,
  },
});

export const salesdetlsState = atom({
  key: 'salesdetls',
  default: {
    sld_id: '',
    sld_no: '',
    sld_itemno: '',
    sld_desp: '',
    sld_pack: '',
    sld_pfactor: 0,
    sld_qty: 0,
    sld_unit: '',
    sld_price: 0,
    sld_total: 0,
    sld_acc: '',
    sld_order: 0,
    sld_sitemno: '',
    sld_ucost: 0,
    sld_itemtype: '',
    sld_type: '',
    sld_brand: '',
    sld_store: '',
    sld_custno: '',
    sld_ctype: '',
    sld_tqty: '',
    sld_error: false,
    sld_upd: false,
    sld_date: null,
  },
});

export const editSalesIdState = atom({
  key: 'editSalesState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editSalesDetlsIdState = atom({
  key: 'editSalesDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const purchaseState = atom({
  key: 'purchase',
  default: {
    po_id: '',
    po_no: '',
    po_date: '',
    po_type: '',
    po_suppno: '',
    po_supp: '',
    po_add1: '',
    po_add2: '',
    po_add3: '',
    po_add4: '',
    po_term: '',
    po_invno: '',
    po_branch: '',
    po_remark: '',
    po_post: '',
    po_print: '',
    po_subtotal: 0,
    po_disc: 0,
    po_nettotal: 0,
    po_layout: '',
    po_postdate: '',
    po_glcode: '',
    po_dodate: '',
    po_invdate: '',
    po_recdate: '',
    po_sono: '',
    po_createdby: '',
    po_updby: '',
    po_createddate: '',
    po_createdtime: '',
    po_upddate: '',
    po_updtime: '',
  },
});

export const purchasedetlsState = atom({
  key: 'purchasedetls',
  default: {
    pl_id: '',
    pl_pono: '',
    pl_type: '',
    pl_itemno: '',
    pl_desp: '',
    pl_pack: '',
    pl_qty: 0,
    pl_ucost: 0,
    pl_unit: '',
    pl_pfactor: 1,
    pl_netucost: 0,
    pl_disc: 0,
    pl_excost: 0,
    pl_remark: '',
    pl_order: 0,
    pl_uoldcost: 0,
    pl_brand: '',
    pl_store: '',
    pl_upd: false,
    pl_podate: null,
  },
});

export const editPurchaseIdState = atom({
  key: 'editPurchaseIdState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editPurchaseDetlsIdState = atom({
  key: 'editPurchaseDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const paymentState = atom({
  key: 'payment',
  default: {
    pay_id: '',
    pay_no: '',
    pay_date: null,
    pay_bank: '',
    pay_refno: '',
    pay_remark: '',
    pay_suppno: '',
    pay_supplier: '',
    pay_total: 0,
    pay_disc: 0,
    pay_nettotal: 0,
    pay_post: '0',
    pay_glcode: '',
    pay_glname: '',
    pay_payno: '',
    pay_chkno: '',
    pay_chkno2: '',
    pay_age: 0,
    pay_bfbal: 0,
    pay_balcurr: 0,
    pay_bal30: 0,
    pay_bal60: 0,
    pay_bal90: 0,
    pay_totbal: 0,
  },
});

export const paymentdetlsState = atom({
  key: 'paymentdetls',
  default: {
    payd_id: '',
    payd_no: '',
    payd_invno: '',
    payd_invdate: null,
    payd_pono: '',
    payd_podate: null,
    payd_invamt: 0,
    payd_last_bal: 0,
    payd_disc: 0,
    payd_amt: 0,
    payd_apid: 0,
    payd_recdate: null,
    payd_branch: '',
    payd_paydate: null,
  },
});

export const editPaymentIdState = atom({
  key: 'editPaymentState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editPaymentDetlsIdState = atom({
  key: 'editPaymentDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const receiptState = atom({
  key: 'receipt',
  default: {
    rcp_id: '',
    rcp_no: '',
    rcp_date: null,
    rcp_bank: '',
    rcp_refno: '',
    rcp_remark: '',
    rcp_custno: '',
    rcp_customer: '',
    rcp_total: 0,
    rcp_disc: 0,
    rcp_nettotal: 0,
    rcp_post: '0',
    rcp_branch: 'HQ',
  },
});

export const receiptdetlsState = atom({
  key: 'receiptdetls',
  default: {
    rcpd_id: '',
    rcpd_no: '',
    rcpd_invno: '',
    rcpd_invdate: null,
    rcpd_invamt: 0,
    rcpd_last_bal: 0,
    rcpd_disc: 0,
    rcpd_amt: 0,
    rcpd_arid: 0,
    rcpd_branch: '',
    rcpd_recdate: null,
  },
});

export const editReceiptIdState = atom({
  key: 'editReceiptState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editReceiptDetlsIdState = atom({
  key: 'editReceiptDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const arStatementState = atom({
  key: 'arStatementState',
  default: {
    ar_custno: '',
    ar_cust: '',
    ar_add1: '',
    ar_add2: '',
    ar_add3: '',
    ar_tel: '',
  },
});

export const arStatementDetlsState = atom({
  key: 'arStatementDetlsState',
  default: {
    ar_invno: '',
    ar_invdate: '',
    ar_custno: '',
    ar_type: '',
    ar_total: 0,
    ar_paid_amt: 0,
    ar_balance: 0,
    ar_paid: false,
    ar_branch: '',
  },
});

export const editARStatementIdState = atom({
  key: 'editARStatementIdState',
  default: {
    id: '',
    no: '',
    totals: [],
  },
});

export const arStatementRptState = atom({
  key: 'arStatementRptState',
  default: {
    ar_custno: '',
    ar_cust: '',
    ar_add1: '',
    ar_add2: '',
    ar_add3: '',
    ar_tel: '',
  },
});

export const arStatementDetlsRptState = atom({
  key: 'arStatementDetlsRptState',
  default: {
    ar_invno: '',
    ar_invdate: '',
    ar_custno: '',
    ar_type: '',
    ar_total: 0,
    ar_paid_amt: 0,
    ar_balance: 0,
    ar_paid: false,
    ar_branch: '',
  },
});

export const editARStatementRptIdState = atom({
  key: 'editARStatementRptIdState',
  default: {
    id: '',
    no: '',
    totals: [],
  },
});

export const apStatementState = atom({
  key: 'apStatementState',
  default: {
    ap_suppno: '',
    ap_supplier: '',
    ap_add1: '',
    ap_add2: '',
    ap_add3: '',
    ap_tel: '',
  },
});

export const apStatementDetlsState = atom({
  key: 'apStatementDetlsState',
  default: {
    ap_invno: '',
    ap_invdate: '',
    ap_suppno: '',
    ap_type: '',
    ap_nettotal: 0,
    ap_paid_amt: 0,
    ap_balance: 0,
    ap_paid: false,
    ap_branch: '',
  },
});

export const editAPStatementIdState = atom({
  key: 'editAPStatementIdState',
  default: {
    id: '',
    no: '',
    totals: [],
  },
});

export const itemState = atom({
  key: 'itemState',
  default: {
    item_no: '',
    item_group: '',
    item_desp: '',
    item_pack: '',
    item_unit: '',
    item_pfactor: 1,
    item_suppno: '',
    item_supp: '',
    item_minlvl: 0,
    item_qtyhand: 0,
    item_remark: '',
    item_cat: '',
    item_date: null,
    item_brand: '',
    item_dept: '',
    item_wsp: 0,
    item_qq: 0,
    item_rsp: 0,
    item_cif: 0,
    item_duty: 0,
    item_fob: 0,
    item_bal: 0,
    item_comm: 0,
    item_storea: 0,
    item_storeb: 0,
    item_storef: 0,
    item_lsqty: 0,
    item_lsprice: 0,
    item_lsdate: null,
    item_lpqty: 0,
    item_lpcost: 0,
    item_lpdate: null,
    item_extcost: 0,
    item_fc: 0,
    item_inf: 0,
    item_bc: 0,
    item_tf: 0,
    item_lc: 0,
    item_cnf: 0,
    item_tinqty: 0,
    item_tinamt: 0,
    item_toutqty: 0,
    item_toutamt: 0,
    item_phyqty: 0,
    item_phydat: null,
    item_phystor: 0,
    item_mtdsqty: 0,
    item_mtdsamt: 0,
    item_mtdpqty: 0,
    item_mtdpamt: 0,
    item_lock: false,
    item_nonstock: false,
    item_qty: 0,
    item_inactive: false,
  },
});

export const editItemIdState = atom({
  key: 'editItemIdState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const reportheaderState = atom({
  key: 'reportheaderState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const reportdetailsState = atom({
  key: 'reportdetailsState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const searchStktakeState = atom({
  key: 'searchStktake',
  default: {
    st_batchno: '',
    st_date: dayjs().format('YYYY-MM-DD'),
    st_time: new Date().toLocaleTimeString(),
    st_remark: '',
    st_userid: '',
    st_user: '',
    st_branch: '',
    st_post: '0',
  },
});

export const editStktakeBatchIdState = atom({
  key: 'editStkTakeBatchIdState',
  default: {
    id: '',
    batchno: '',
    status: '',
  },
});

export const editStktakedetlsBatchIdState = atom({
  key: 'editStktakeBatchDetlsIdState',
  default: {
    id: '',
    batchno: '',
  },
});

export const stktakeBatchState = atom({
  key: 'stktakebatchState',
  default: {
    st_batchno: '',
    st_date: null,
    st_remark: '',
    st_userid: '',
    st_user: '',
    st_branch: '',
  },
});

export const stktakedetlsBatchState = atom({
  key: 'stktakedetlsbatchState',
  default: {
    std_batchno: '',
    std_itemno: '',
    std_desp: '',
    std_qty: 0,
  },
});

export const tranadjustState = atom({
  key: 'tranadjustState',
  default: {
    ta_id: '',
    ta_batchno: '',
    ta_date: dayjs().format('YYYY-MM-DD'),
    ta_type: '',
    ta_userid: '',
    ta_user: '',
    ta_remark: '',
    ta_post: '',
    ta_branch: '',
  },
});

export const tranadjustdetlsState = atom({
  key: 'tranadjustdetlsState',
  default: {
    tad_id: '',
    tad_batchno: '',
    tad_itemno: '',
    tad_desp: '',
    tad_packing: '',
    tad_qtyonhand: 1,
    tad_qtycount: 0,
    tad_qtyadjust: 0,
    tad_branch: '',
  },
});

export const tranadjustlotState = atom({
  key: 'tranadjustlotState',
  default: {
    tal_id: '',
    tal_batchno: '',
    tal_itemno: '',
    tal_lotno: '',
    tal_pono: '',
    tal_expirydate: null,
    tal_qtyonhand: 1,
    tal_qtycount: 0,
    tal_qtyadjust: 0,
  },
});

export const editTranadjustIdState = atom({
  key: 'editTranAdjustIdState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editTranadjustDetlsIdState = atom({
  key: 'editTranAdjustDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const editTranadjustLotIdState = atom({
  key: 'editTranAdjustLotIdState',
  default: {
    id: '',
    no: '',
  },
});

export const tranState = atom({
  key: 'transaction',
  default: {
    t_id: '',
    t_no: '',
    t_date: dayjs().format('YYYY-MM-DD'),
    t_type: '',
    t_docno: '',
    t_docdate: dayjs().format('YYYY-MM-DD'),
    t_scno: '',
    t_sc: '',
    t_add1: '',
    t_add2: '',
    t_add3: '',
    t_add4: '',
    t_term: '',
    t_branch: '',
    t_remark: '',
    t_post: '',
    t_print: '',
    t_subtotal: 0,
    t_disc: 0,
    t_nettotal: 0,
    t_layout: '',
    t_postdate: dayjs().format('YYYY-MM-DD'),
    t_glcode: '',
    t_recdate: dayjs().format('YYYY-MM-DD'),
    t_createdby: '',
    t_updby: '',
    t_createddate: dayjs().format('YYYY-MM-DD'),
    t_createdtime: '',
    t_upddate: dayjs().format('YYYY-MM-DD'),
    t_updtime: '',
  },
});

export const trandetlsState = atom({
  key: 'trandetls',
  default: {
    tl_id: '',
    tl_pono: '',
    tl_type: '',
    tl_itemno: '',
    tl_desp: '',
    tl_brand: '',
    tl_packing: '',
    tl_pfactor: 1,
    tl_unit: '',
    tl_qty: 0,
    tl_ucost: 0,
    tl_netucost: 0,
    tl_disc: 0,
    tl_excost: 0,
    tl_remark: '',
    tl_order: 0,
    tl_branch: '',
    tl_uoldcost: 0,
    tl_trackexpiry: false,
    tl_trackserial: false,
  },
});

export const tranlotsState = atom({
  key: 'tranlots',
  default: {
    tl_id: '',
    tl_tranno: '',
    tl_type: '',
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
    tl_qty: '0',
  },
});

export const transerialState = atom({
  key: 'transerial',
  default: {
    ts_id: '',
    ts_tranno: '',
    ts_itemno: '',
    ts_pono: '',
    ts_invno: '',
    ts_podate: null,
    ts_invdate: null,
    ts_post: '0',
  },
});

export const editTranIdState = atom({
  key: 'editTranIdState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editTranDetlsIdState = atom({
  key: 'editTranDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const editTranLotsIdState = atom({
  key: 'editTranLotsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const editTranSerialIdState = atom({
  key: 'editTranSerialIdState',
  default: {
    id: '',
    no: '',
  },
});

export const RptState = atom({
  key: 'RptState',
  default: {
    no: '',
  },
});

export const RptDetlsState = atom({
  key: 'RptDetlsState',
  default: {
    no: '',
  },
});

export const editRptIdState = atom({
  key: 'editRptIdState',
  default: {
    id: '',
    no: '',
    totals: [],
  },
});

export const auditlogState = atom({
  key: 'auditlog',
  default: {
    al_userid: '',
    al_user: '',
    al_date: null,
    al_module: '',
    al_action: '',
    al_record: '',
    al_remark: '',
  },
});

export const searchuserState = atom({
  key: 'searchuser',
  default: {
    u_id: '',
    u_userid: '',
    u_name: '',
    u_email: '',
    u_password: '',
    u_usergroup: '',
    u_level: '',
    u_jobtitle: '',
    u_lastlogindate: null,
  },
});
