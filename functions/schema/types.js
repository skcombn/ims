const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;
const { DateScalar } = require("graphql-date-scalars");

const UserType = new GraphQLObjectType({
  name: "User",
  type: "Query",
  fields: () => ({
    u_id: { type: GraphQLID },
    u_userid: { type: GraphQLString },
    u_name: { type: GraphQLString },
    u_email: { type: GraphQLString },
    u_password: { type: GraphQLString },
    u_level: { type: GraphQLString },
    u_lastlogindate: { type: DateScalar },
    u_usergroup: { type: GraphQLString },
    u_jobtitle: { type: GraphQLString },
  }),
});

const ItemType = new GraphQLObjectType({
  name: "Item",
  type: "Query",
  fields: () => ({
    item_id: { type: GraphQLID },
    item_no: { type: GraphQLString },
    item_desp: { type: GraphQLString },
    item_pack: { type: GraphQLString },
    item_unit: { type: GraphQLString },
    item_price: { type: GraphQLFloat },
    item_cost: { type: GraphQLFloat },
    item_qtyonhand: { type: GraphQLFloat },
    item_minlvl: { type: GraphQLFloat },
    item_pfactor: { type: GraphQLFloat },
    item_brand: { type: GraphQLString },
    item_manufacturer: { type: GraphQLString },
    item_lotno: { type: GraphQLString },
    item_grade: { type: GraphQLString },
    item_location: { type: GraphQLString },
    item_size: { type: GraphQLString },
    item_suppno: { type: GraphQLString },
    item_supplier: { type: GraphQLString },
    item_type: { type: GraphQLString },
    item_trackexpiry: { type: GraphQLBoolean },
    item_trackserial: { type: GraphQLBoolean },
    item_remark: { type: GraphQLString },
    item_productno: { type: GraphQLString },
    item_inactive: { type: GraphQLBoolean },
    item_cat: { type: GraphQLString },
  }),
});

const ItemOnhandType = new GraphQLObjectType({
  name: "ItemOnhand",
  type: "Query",
  fields: () => ({
    item_id: { type: GraphQLID },
    item_no: { type: GraphQLString },
    item_branch: { type: GraphQLString },
    item_qoh_pc: { type: GraphQLFloat },
    item_qoh_ctn: { type: GraphQLFloat },
    item_ucost_pc: { type: GraphQLFloat },
    item_ucost_ctn: { type: GraphQLFloat },
    item_onorder_pc: { type: GraphQLFloat },
    item_onorder_ctn: { type: GraphQLFloat },
    item_uprice_pc: { type: GraphQLFloat },
    item_uprice_ctn: { type: GraphQLFloat },
    item_remark: { type: GraphQLString },
    item_pfactor: { type: GraphQLFloat },
    item_outlet_pc: { type: GraphQLFloat },
    item_outlet_ctn: { type: GraphQLFloat },
    item_offerprice: { type: GraphQLFloat },
    item_cooluprice: { type: GraphQLFloat },
    item_minlvlqty: { type: GraphQLFloat },
    item_suppno: { type: GraphQLString },
    item_supplier: { type: GraphQLString },
    item_openqty: { type: GraphQLFloat },
    item_openamt: { type: GraphQLFloat },
    item_updated: { type: DateScalar },
    item_lastsalesdate: { type: DateScalar },
    item_lastpodate: { type: DateScalar },
    item_lastpoqty: { type: GraphQLFloat },
    item_lastsalesqty: { type: GraphQLFloat },
    item_inactive: { type: GraphQLBoolean },
    item_olducost: { type: GraphQLFloat },
    item_memuprice: { type: GraphQLFloat },
    item_allowposaddon: { type: GraphQLBoolean },
  }),
});

const ItemMasterType = new GraphQLObjectType({
  name: "ItemMaster",
  type: "Query",
  fields: () => ({
    item_no: { type: GraphQLString },
    item_group: { type: GraphQLString },
    item_desp: { type: GraphQLString },
    item_packing: { type: GraphQLString },
    item_unit: { type: GraphQLString },
    item_branch: { type: GraphQLString },
    item_qoh_pc: { type: GraphQLFloat },
    item_qoh_ctn: { type: GraphQLFloat },
    item_ucost_pc: { type: GraphQLFloat },
    item_ucost_ctn: { type: GraphQLFloat },
    item_uprice_pc: { type: GraphQLFloat },
    item_uprice_ctn: { type: GraphQLFloat },
    item_remark: { type: GraphQLString },
    item_pfactor: { type: GraphQLFloat },
    item_category: { type: GraphQLString },
    item_brand: { type: GraphQLString },
    item_dept: { type: GraphQLString },
    item_qtyhand: { type: GraphQLFloat },
    item_outlet_pc: { type: GraphQLFloat },
    item_outlet_ctn: { type: GraphQLFloat },
    item_offerprice: { type: GraphQLFloat },
    item_memuprice: { type: GraphQLFloat },
    item_supplier: { type: GraphQLString },
    item_suppno: { type: GraphQLString },
    item_openqty: { type: GraphQLFloat },
    item_openvalue: { type: GraphQLFloat },
    item_groupname: { type: GraphQLString },
    item_lastsalesdate: { type: DateScalar },
    item_lastsalesqty: { type: GraphQLFloat },
    item_lastpoqty: { type: GraphQLFloat },
    item_inactive: { type: GraphQLBoolean },
    item_type: { type: GraphQLString },
    item_minlvlqty: { type: GraphQLFloat },
    item_onorder_pc: { type: GraphQLFloat },
    item_smcode: { type: GraphQLString },
    item_olducost: { type: GraphQLFloat },
    item_allowposaddon: { type: GraphQLBoolean },
  }),
});
const ItemHistoryType = new GraphQLObjectType({
  name: "ItemHistory",
  type: "Query",
  fields: () => ({
    it_id: { type: GraphQLID },
    it_transno: { type: GraphQLString },
    it_itemno: { type: GraphQLString },
    it_transdate: { type: DateScalar },
    it_qty: { type: GraphQLFloat },
    it_value: { type: GraphQLFloat },
    it_disc: { type: GraphQLFloat },
    it_netvalue: { type: GraphQLFloat },
    it_extvalue: { type: GraphQLFloat },
    it_pfactor: { type: GraphQLFloat },
    it_transtype: { type: GraphQLString },
    it_scno: { type: GraphQLString },
    it_sc: { type: GraphQLString },
    it_branch: { type: GraphQLString },
    it_postdate: { type: DateScalar },
    it_remark: { type: GraphQLString },
    it_desp: { type: GraphQLString },
    it_packing: { type: GraphQLString },
    it_lotno: { type: GraphQLString },
  }),
});

const ItemExpiryType = new GraphQLObjectType({
  name: "ItemExpiry",
  type: "Query",
  fields: () => ({
    ie_id: { type: GraphQLID },
    ie_itemno: { type: GraphQLString },
    ie_lotno: { type: GraphQLString },
    ie_datereceived: { type: DateScalar },
    ie_location: { type: GraphQLString },
    ie_dateexpiry: { type: DateScalar },
    ie_pono: { type: GraphQLString },
    ie_podate: { type: DateScalar },
    ie_qtyonhand: { type: GraphQLFloat },
    ie_qtyreceived: { type: GraphQLFloat },
    ie_ucost: { type: GraphQLFloat },
    ie_post: { type: GraphQLString },
  }),
});

const ItemSerialType = new GraphQLObjectType({
  name: "ItemSerial",
  type: "Query",
  fields: () => ({
    is_id: { type: GraphQLID },
    is_itemno: { type: GraphQLString },
    is_pono: { type: GraphQLString },
    is_podate: { type: DateScalar },
    is_serialno: { type: GraphQLString },
    is_post: { type: GraphQLString },
  }),
});

const TransType = new GraphQLObjectType({
  name: "Trans",
  type: "Query",
  fields: () => ({
    t_id: { type: GraphQLID },
    t_no: { type: GraphQLString },
    t_date: { type: DateScalar },
    t_type: { type: GraphQLString },
    t_docno: { type: GraphQLString },
    t_docdate: { type: DateScalar },
    t_scno: { type: GraphQLString },
    t_sc: { type: GraphQLString },
    t_add1: { type: GraphQLString },
    t_add2: { type: GraphQLString },
    t_add3: { type: GraphQLString },
    t_add4: { type: GraphQLString },
    t_term: { type: GraphQLInt },
    t_branch: { type: GraphQLString },
    t_remark: { type: GraphQLString },
    t_post: { type: GraphQLString },
    t_print: { type: GraphQLString },
    t_subtotal: { type: GraphQLFloat },
    t_disc: { type: GraphQLFloat },
    t_nettotal: { type: GraphQLFloat },
    t_layout: { type: GraphQLString },
    t_postdate: { type: DateScalar },
    t_glcode: { type: GraphQLString },
    t_recdate: { type: DateScalar },
    t_createdby: { type: GraphQLString },
    t_updby: { type: GraphQLString },
    t_createddate: { type: DateScalar },
    t_createdtime: { type: GraphQLString },
    t_upddate: { type: DateScalar },
    t_updtime: { type: GraphQLString },
    t_dono: { type: GraphQLString },
    t_name: { type: GraphQLString },
    t_section: { type: GraphQLString },
    t_dodate: { type: DateScalar },
  }),
});

const TransItemsType = new GraphQLObjectType({
  name: "TransItems",
  type: "Query",
  fields: () => ({
    tl_id: { type: GraphQLID },
    tl_tranno: { type: GraphQLString },
    tl_type: { type: GraphQLString },
    tl_itemno: { type: GraphQLString },
    tl_qty: { type: GraphQLFloat },
    tl_ucost: { type: GraphQLFloat },
    tl_unit: { type: GraphQLString },
    tl_desp: { type: GraphQLString },
    tl_packing: { type: GraphQLString },
    tl_pfactor: { type: GraphQLFloat },
    tl_netucost: { type: GraphQLFloat },
    tl_disc: { type: GraphQLFloat },
    tl_amount: { type: GraphQLFloat },
    tl_remark: { type: GraphQLString },
    tl_order: { type: GraphQLInt },
    tl_branch: { type: GraphQLString },
    tl_lotno: { type: GraphQLString },
    tl_dateexpiry: { type: DateScalar },
    tl_trackexpiry: { type: GraphQLBoolean },
    tl_uprice: { type: GraphQLFloat },
    tl_location: { type: GraphQLString },
    tl_uoldcost: { type: GraphQLFloat },
    tl_brand: { type: GraphQLString },
    tl_trantype: { type: GraphQLString },
    tl_post: { type: GraphQLString },
    tl_trandate: { type: DateScalar },
    tl_trackserial: { type: GraphQLBoolean },
  }),
});

const TranslotType = new GraphQLObjectType({
  name: "Translot",
  type: "Query",
  fields: () => ({
    tl_id: { type: GraphQLID },
    tl_tranno: { type: GraphQLString },
    tl_type: { type: GraphQLString },
    tl_itemno: { type: GraphQLString },
    tl_lotno: { type: GraphQLString },
    tl_datereceived: { type: DateScalar },
    tl_location: { type: GraphQLString },
    tl_dateexpiry: { type: DateScalar },
    tl_pono: { type: GraphQLString },
    tl_podate: { type: DateScalar },
    tl_qtyonhand: { type: GraphQLFloat },
    tl_qtyreceived: { type: GraphQLFloat },
    tl_ucost: { type: GraphQLFloat },
    tl_post: { type: GraphQLString },
    tl_qty: { type: GraphQLFloat },
    tl_trantype: { type: GraphQLString },
  }),
});

const TranserialType = new GraphQLObjectType({
  name: "Transerial",
  type: "Query",
  fields: () => ({
    ts_id: { type: GraphQLID },
    ts_tranno: { type: GraphQLString },
    ts_serialno: { type: GraphQLString },
    ts_pono: { type: GraphQLString },
    ts_invno: { type: GraphQLString },
    ts_podate: { type: DateScalar },
    ts_invdate: { type: DateScalar },
    ts_post: { type: GraphQLString },
    ts_trantype: { type: GraphQLString },
  }),
});

const TranadjType = new GraphQLObjectType({
  name: "Tranadj",
  type: "Query",
  fields: () => ({
    ta_id: { type: GraphQLID },
    ta_batchno: { type: GraphQLString },
    ta_date: { type: DateScalar },
    ta_userid: { type: GraphQLString },
    ta_remark: { type: GraphQLString },
    ta_post: { type: GraphQLString },
    ta_branch: { type: GraphQLString },
    ta_type: { type: GraphQLString },
    ta_user: { type: GraphQLString },
  }),
});

const TranadjdetlsType = new GraphQLObjectType({
  name: "Tranadjdetls",
  type: "Query",
  fields: () => ({
    tad_id: { type: GraphQLID },
    tad_batchno: { type: GraphQLString },
    tad_itemno: { type: GraphQLString },
    tad_desp: { type: GraphQLString },
    tad_packing: { type: GraphQLString },
    tad_qtyonhand: { type: GraphQLFloat },
    tad_qtycount: { type: GraphQLFloat },
    tad_qtyadjust: { type: GraphQLFloat },
    tad_branch: { type: GraphQLString },
    tad_unit: { type: GraphQLString },
    tad_trackexpiry: { type: GraphQLBoolean },
  }),
});

const TranadjlotType = new GraphQLObjectType({
  name: "Tranadjlot",
  type: "Query",
  fields: () => ({
    tal_id: { type: GraphQLID },
    tal_batchno: { type: GraphQLString },
    tal_itemno: { type: GraphQLString },
    tal_lotno: { type: GraphQLString },
    tal_pono: { type: GraphQLString },
    tal_expirydate: { type: DateScalar },
    tal_qtyonhand: { type: GraphQLFloat },
    tal_qtycount: { type: GraphQLFloat },
    tal_qtyadjust: { type: GraphQLFloat },
  }),
});

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  type: "Query",
  fields: () => ({
    c_id: { type: GraphQLID },
    c_custno: { type: GraphQLString },
    c_cust: { type: GraphQLString },
    c_add1: { type: GraphQLString },
    c_add2: { type: GraphQLString },
    c_add3: { type: GraphQLString },
    c_add4: { type: GraphQLString },
    c_phone: { type: GraphQLString },
    c_fax: { type: GraphQLString },
    c_email: { type: GraphQLString },
    c_crlimit: { type: GraphQLFloat },
    c_terms: { type: GraphQLInt },
    c_contact: { type: GraphQLString },
    c_post: { type: GraphQLString },
    c_glcode: { type: GraphQLString },
    c_branch: { type: GraphQLString },
    c_area: { type: GraphQLString },
    c_type: { type: GraphQLString },
  }),
});

const SupplierType = new GraphQLObjectType({
  name: "Supplier",
  type: "Query",
  fields: () => ({
    s_id: { type: GraphQLID },
    s_suppno: { type: GraphQLString },
    s_supp: { type: GraphQLString },
    s_add1: { type: GraphQLString },
    s_add2: { type: GraphQLString },
    s_add3: { type: GraphQLString },
    s_add4: { type: GraphQLString },
    s_phone: { type: GraphQLString },
    s_email: { type: GraphQLString },
    s_fax: { type: GraphQLString },
    s_contact: { type: GraphQLString },
    s_crlimit: { type: GraphQLFloat },
    s_terms: { type: GraphQLInt },
    s_glcode: { type: GraphQLString },
    s_branch: { type: GraphQLString },
    s_bankname: { type: GraphQLString },
    s_bankacno: { type: GraphQLString },
  }),
});

const SalesType = new GraphQLObjectType({
  name: "Sales",
  type: "Query",
  fields: () => ({
    sls_id: { type: GraphQLID },
    sls_no: { type: GraphQLString },
    sls_so: { type: GraphQLString },
    sls_date: { type: DateScalar },
    sls_term: { type: GraphQLString },
    sls_duedate: { type: DateScalar },
    sls_custno: { type: GraphQLString },
    sls_cust: { type: GraphQLString },
    sls_add1: { type: GraphQLString },
    sls_add2: { type: GraphQLString },
    sls_add3: { type: GraphQLString },
    sls_add4: { type: GraphQLString },
    sls_remark: { type: GraphQLString },
    sls_oref: { type: GraphQLString },
    sls_yref: { type: GraphQLString },
    sls_smno: { type: GraphQLString },
    sls_area: { type: GraphQLString },
    sls_tax_perc: { type: GraphQLFloat },
    sls_tax: { type: GraphQLFloat },
    sls_freight: { type: GraphQLFloat },
    sls_subtotal: { type: GraphQLFloat },
    sls_disc: { type: GraphQLFloat },
    sls_total: { type: GraphQLFloat },
    sls_post: { type: GraphQLString },
    sls_bank: { type: GraphQLString },
    sls_check: { type: GraphQLString },
    sls_received: { type: GraphQLFloat },
    sls_type: { type: GraphQLString },
    sls_shipfrom: { type: GraphQLString },
    sls_shipmenttype: { type: GraphQLString },
    sls_postdate: { type: DateScalar },
    sls_layout: { type: GraphQLString },
    sls_glcode: { type: GraphQLString },
    sls_branch: { type: GraphQLString },
    sls_createdby: { type: GraphQLString },
    sls_updby: { type: GraphQLString },
    sls_createddate: { type: DateScalar },
    sls_createdtime: { type: GraphQLString },
    sls_upddate: { type: DateScalar },
    sls_updtime: { type: GraphQLString },
  }),
});

const SalesDetlsType = new GraphQLObjectType({
  name: "SalesDetls",
  type: "Query",
  fields: () => ({
    sld_id: { type: GraphQLID },
    sld_no: { type: GraphQLString },
    sld_itemno: { type: GraphQLString },
    sld_desp: { type: GraphQLString },
    sld_brand: { type: GraphQLString },
    sld_packing: { type: GraphQLString },
    sld_pfactor: { type: GraphQLFloat },
    sld_unit: { type: GraphQLString },
    sld_qty: { type: GraphQLFloat },
    sld_price: { type: GraphQLFloat },
    sld_total: { type: GraphQLFloat },
    sld_acc: { type: GraphQLString },
    sld_order: { type: GraphQLInt },
    sld_sitemno: { type: GraphQLString },
    sld_branch: { type: GraphQLString },
    sld_ucost: { type: GraphQLFloat },
    sld_itemtype: { type: GraphQLString },
    sld_error: { type: GraphQLBoolean },
  }),
});

const ReceivableType = new GraphQLObjectType({
  name: "Receivable",
  type: "Query",
  fields: () => ({
    ar_id: { type: GraphQLID },
    ar_invno: { type: GraphQLString },
    ar_date: { type: DateScalar },
    ar_custno: { type: GraphQLString },
    ar_cust: { type: GraphQLString },
    ar_type: { type: GraphQLString },
    ar_subtotal: { type: GraphQLFloat },
    ar_paid_amt: { type: GraphQLFloat },
    ar_disc_amt: { type: GraphQLFloat },
    ar_disc_taken: { type: GraphQLFloat },
    ar_balance: { type: GraphQLFloat },
    ar_total: { type: GraphQLFloat },
    ar_branch: { type: GraphQLString },
    ar_paid: { type: GraphQLBoolean },
    ar_glcode: { type: GraphQLString },
    ar_paid_disc: { type: GraphQLFloat },
  }),
});

const ReceiptType = new GraphQLObjectType({
  name: "Receipt",
  type: "Query",
  fields: () => ({
    rcp_id: { type: GraphQLID },
    rcp_no: { type: GraphQLString },
    rcp_date: { type: DateScalar },
    rcp_bank: { type: GraphQLString },
    rcp_refno: { type: GraphQLString },
    rcp_remark: { type: GraphQLString },
    rcp_custno: { type: GraphQLString },
    rcp_customer: { type: GraphQLString },
    rcp_total: { type: GraphQLFloat },
    rcp_disc: { type: GraphQLFloat },
    rcp_nettotal: { type: GraphQLFloat },
    rcp_post: { type: GraphQLString },
    rcp_branch: { type: GraphQLString },
  }),
});

const ReceiptDetlsType = new GraphQLObjectType({
  name: "ReceiptDetls",
  type: "Query",
  fields: () => ({
    rcpd_id: { type: GraphQLID },
    rcpd_no: { type: GraphQLString },
    rcpd_invno: { type: GraphQLString },
    rcpd_invdate: { type: DateScalar },
    rcpd_invamt: { type: GraphQLFloat },
    rcpd_last_bal: { type: GraphQLFloat },
    rcpd_disc: { type: GraphQLFloat },
    rcpd_amt: { type: GraphQLFloat },
    rcpd_arid: { type: GraphQLString },
    rcpd_branch: { type: GraphQLString },
    rcpd_recdate: { type: DateScalar },
  }),
});

const PurchaseType = new GraphQLObjectType({
  name: "Purchase",
  type: "Query",
  fields: () => ({
    po_id: { type: GraphQLID },
    po_no: { type: GraphQLString },
    po_date: { type: DateScalar },
    po_type: { type: GraphQLString },
    po_suppno: { type: GraphQLString },
    po_supp: { type: GraphQLString },
    po_add1: { type: GraphQLString },
    po_add2: { type: GraphQLString },
    po_add3: { type: GraphQLString },
    po_add4: { type: GraphQLString },
    po_term: { type: GraphQLString },
    po_invno: { type: GraphQLString },
    po_branch: { type: GraphQLString },
    po_remark: { type: GraphQLString },
    po_post: { type: GraphQLString },
    po_print: { type: GraphQLString },
    po_subtotal: { type: GraphQLFloat },
    po_disc: { type: GraphQLFloat },
    po_nettotal: { type: GraphQLFloat },
    po_layout: { type: GraphQLString },
    po_postdate: { type: DateScalar },
    po_glcode: { type: GraphQLString },
    po_dodate: { type: DateScalar },
    po_invdate: { type: DateScalar },
    po_recdate: { type: DateScalar },
    po_sono: { type: GraphQLString },
    po_createdby: { type: GraphQLString },
    po_updby: { type: GraphQLString },
    po_createddate: { type: DateScalar },
    po_createdtime: { type: GraphQLString },
    po_upddate: { type: DateScalar },
    po_updtime: { type: GraphQLString },
  }),
});

const PurchaseDetlsType = new GraphQLObjectType({
  name: "PurchaseDetails",
  type: "Query",
  fields: () => ({
    pl_id: { type: GraphQLID },
    pl_pono: { type: GraphQLString },
    pl_type: { type: GraphQLString },
    pl_itemno: { type: GraphQLString },
    pl_desp: { type: GraphQLString },
    pl_brand: { type: GraphQLString },
    pl_packing: { type: GraphQLString },
    pl_pfactor: { type: GraphQLFloat },
    pl_unit: { type: GraphQLString },
    pl_qty: { type: GraphQLFloat },
    pl_ucost: { type: GraphQLFloat },
    pl_netucost: { type: GraphQLFloat },
    pl_disc: { type: GraphQLFloat },
    pl_excost: { type: GraphQLFloat },
    pl_remark: { type: GraphQLString },
    pl_order: { type: GraphQLInt },
    pl_branch: { type: GraphQLString },
    pl_uoldcost: { type: GraphQLFloat },
  }),
});

const PayableType = new GraphQLObjectType({
  name: "Payable",
  type: "Query",
  fields: () => ({
    ap_id: { type: GraphQLID },
    ap_pono: { type: GraphQLString },
    ap_podate: { type: DateScalar },
    ap_invno: { type: GraphQLString },
    ap_invdate: { type: DateScalar },
    ap_recdate: { type: DateScalar },
    ap_suppno: { type: GraphQLString },
    ap_supplier: { type: GraphQLString },
    ap_type: { type: GraphQLString },
    ap_subtotal_amt: { type: GraphQLFloat },
    ap_nettotal_amt: { type: GraphQLFloat },
    ap_paid_amt: { type: GraphQLFloat },
    ap_disc_amt: { type: GraphQLFloat },
    ap_disc_taken: { type: GraphQLFloat },
    ap_dc: { type: GraphQLString },
    ap_acc: { type: GraphQLString },
    ap_paid: { type: GraphQLBoolean },
    ap_balance: { type: GraphQLFloat },
    ap_branch: { type: GraphQLString },
    ap_glcode: { type: GraphQLString },
    ap_paid_disc: { type: GraphQLFloat },
  }),
});

const PaymentType = new GraphQLObjectType({
  name: "Payment",
  type: "Query",
  fields: () => ({
    pay_id: { type: GraphQLID },
    pay_no: { type: GraphQLString },
    pay_date: { type: DateScalar },
    pay_bank: { type: GraphQLString },
    pay_refno: { type: GraphQLString },
    pay_remark: { type: GraphQLString },
    pay_suppno: { type: GraphQLString },
    pay_supplier: { type: GraphQLString },
    pay_total: { type: GraphQLFloat },
    pay_disc: { type: GraphQLFloat },
    pay_nettotal: { type: GraphQLFloat },
    pay_post: { type: GraphQLString },
    pay_glcode: { type: GraphQLString },
    pay_branch: { type: GraphQLString },
  }),
});

const PaymentDetlsType = new GraphQLObjectType({
  name: "PaymentDetls",
  type: "Query",
  fields: () => ({
    payd_id: { type: GraphQLID },
    payd_no: { type: GraphQLString },
    payd_invno: { type: GraphQLString },
    payd_invdate: { type: DateScalar },
    payd_pono: { type: GraphQLString },
    payd_podate: { type: DateScalar },
    payd_invamt: { type: GraphQLFloat },
    payd_last_bal: { type: GraphQLFloat },
    payd_disc: { type: GraphQLFloat },
    payd_amt: { type: GraphQLFloat },
    payd_apid: { type: GraphQLString },
    payd_recdate: { type: DateScalar },
    payd_paydate: { type: DateScalar },
    payd_branch: { type: GraphQLString },
  }),
});

const AccountType = new GraphQLObjectType({
  name: "Account",
  type: "Query",
  fields: () => ({
    acc_id: { type: GraphQLID },
    acc_code: { type: GraphQLString },
    acc_name: { type: GraphQLString },
    acc_cat: { type: GraphQLString },
    acc_type: { type: GraphQLString },
    acc_last_year: { type: GraphQLFloat },
    acc_temp_bal: { type: GraphQLFloat },
    acc_groupitem: { type: GraphQLBoolean },
    acc_class: { type: GraphQLString },
    acc_branch: { type: GraphQLString },
  }),
});

const DocumentNoType = new GraphQLObjectType({
  name: "DocumentNo",
  type: "Query",
  fields: () => ({
    doc_id: { type: GraphQLID },
    doc_invoice: { type: GraphQLInt },
    doc_purchase: { type: GraphQLInt },
    doc_despatch: { type: GraphQLInt },
    doc_receipt: { type: GraphQLInt },
    doc_payment: { type: GraphQLInt },
    doc_trans: { type: GraphQLInt },
    doc_branch: { type: GraphQLString },
    doc_stktake: { type: GraphQLInt },
    doc_stkadjust: { type: GraphQLInt },
    doc_prefix: { type: GraphQLString },
    doc_abbre: { type: GraphQLString },
  }),
});

const ItemGroupType = new GraphQLObjectType({
  name: "ItemGroup",
  type: "Query",
  fields: () => ({
    group_id: { type: GraphQLID },
    group_code: { type: GraphQLString },
    group_desp: { type: GraphQLString },
    group_buttondesp: { type: GraphQLString },
    group_pos: { type: GraphQLBoolean },
    group_addon: { type: GraphQLBoolean },
  }),
});

const GroupType = new GraphQLObjectType({
  name: "Group",
  type: "Query",
  fields: () => ({
    group_id: { type: GraphQLID },
    group_desp: { type: GraphQLString },
    group_category: { type: GraphQLString },
  }),
});

const LocationType = new GraphQLObjectType({
  name: "Location",
  type: "Query",
  fields: () => ({
    loc_id: { type: GraphQLID },
    loc_desp: { type: GraphQLString },
  }),
});

const AuditlogType = new GraphQLObjectType({
  name: "Auditlog",
  type: "Query",
  fields: () => ({
    at_id: { type: GraphQLID },
    at_userid: { type: GraphQLString },
    at_user: { type: GraphQLString },
    at_date: { type: DateScalar },
    at_time: { type: GraphQLString },
    at_module: { type: GraphQLString },
    at_record: { type: GraphQLString },
    at_remark: { type: GraphQLString },
    at_timestr: { type: GraphQLString },
  }),
});

const SetupType = new GraphQLObjectType({
  name: "SetupNo",
  type: "Query",
  fields: () => ({
    s_id: { type: GraphQLID },
    s_code: { type: GraphQLString },
    s_value: { type: GraphQLString },
  }),
});

exports.DocumentNoType = DocumentNoType;
exports.ItemType = ItemType;
exports.ItemOnhandType = ItemOnhandType;
exports.ItemMasterType = ItemMasterType;
exports.ItemHistoryType = ItemHistoryType;
exports.ItemExpiryType = ItemExpiryType;
exports.ItemSerialType = ItemSerialType;
exports.ItemGroupType = ItemGroupType;
exports.GroupType = GroupType;
exports.UserType = UserType;
exports.CustomerType = CustomerType;
exports.SupplierType = SupplierType;
exports.TransType = TransType;
exports.TransItemsType = TransItemsType;
exports.TranserialType = TranserialType;
exports.TranslotType = TranslotType;
exports.TranadjType = TranadjType;
exports.TranadjdetlsType = TranadjdetlsType;
exports.TranadjlotType = TranadjlotType;
exports.SalesType = SalesType;
exports.SalesDetlsType = SalesDetlsType;
exports.ReceivableType = ReceivableType;
exports.PurchaseType = PurchaseType;
exports.PurchaseDetlsType = PurchaseDetlsType;
exports.PayableType = PayableType;
exports.ReceiptType = ReceiptType;
exports.ReceiptDetlsType = ReceiptDetlsType;
exports.PaymentType = PaymentType;
exports.PaymentDetlsType = PaymentDetlsType;
exports.AccountType = AccountType;
exports.LocationType = LocationType;
exports.SetupType = SetupType;
exports.AuditlogType = AuditlogType;
