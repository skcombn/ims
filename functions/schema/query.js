const { db } = require("../pgAdaptor");
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
} = require("graphql");
const {
  DocumentNoType,
  ItemType,
  ItemHistoryType,
  ItemExpiryType,
  ItemSerialType,
  ItemOnhandType,
  ItemMasterType,
  ItemGroupType,
  UserType,
  GroupType,
  TransType,
  TransItemsType,
  TranserialType,
  TranslotType,
  TranadjType,
  TranadjdetlsType,
  TranadjlotType,
  CustomerType,
  SupplierType,
  SalesType,
  SalesDetlsType,
  PurchaseType,
  PurchaseDetlsType,
  ReceivableType,
  PayableType,
  ReceiptType,
  ReceiptDetlsType,
  PaymentType,
  PaymentDetlsType,
  LocationType,
  AuditlogType,
} = require("./types");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  type: "Query",
  fields: {
    documentno: {
      type: new GraphQLList(DocumentNoType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_documentno`;
        const values = [];
        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    items: {
      type: ItemType,
      args: { itemno: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items WHERE item_no=$1`;
        const values = [args.itemno];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItems: {
      type: new GraphQLList(ItemType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    itemsOnhand: {
      type: ItemOnhandType,
      args: {
        itemno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_onhand WHERE item_no=$1 and item_branch=$2`;
        const values = [args.itemno, args.branch];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemsOnhand: {
      type: new GraphQLList(ItemOnhandType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_onhand`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    itemsMaster: {
      type: ItemMasterType,
      args: {
        itemno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_itemmaster WHERE item_no=$1 and item_branch=$2`;
        const values = [args.itemno, args.branch];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemsMasterByBranch: {
      type: new GraphQLList(ItemMasterType),
      args: {
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_itemmaster WHERE item_branch = $1`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemsHistoryByItem: {
      type: new GraphQLList(ItemHistoryType),
      args: {
        itemno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_history WHERE it_itemno=$1 order by it_transdate desc`;
        const values = [args.itemno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemsHistoryByBranch: {
      type: new GraphQLList(ItemHistoryType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_history where it_branch=$1`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemsHistory: {
      type: new GraphQLList(ItemHistoryType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_history order by it_transdate desc`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemExpiry: {
      type: new GraphQLList(ItemExpiryType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_expiry order by ie_itemno`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemExpiryByItemno: {
      type: new GraphQLList(ItemExpiryType),
      args: {
        itemno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_expiry where ie_itemno = $1 order by ie_datereceived`;
        const values = [args.itemno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemSerial: {
      type: new GraphQLList(ItemSerialType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_serial order by is_itemno`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemSerialByItemno: {
      type: new GraphQLList(ItemSerialType),
      args: {
        itemno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_items_serial where is_itemno = $1 order by is_serialno`;
        const values = [args.itemno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    trans: {
      type: TransType,
      args: { tranno: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_trans WHERE t_no=$1`;
        const values = [args.tranno];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    allTrans: {
      type: new GraphQLList(TransType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_trans order by t_no desc`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTransByScno: {
      type: new GraphQLList(TransType),
      args: {
        scno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_trans where t_scno = $1 order by t_no desc`;
        const values = [args.scno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranItems: {
      type: new GraphQLList(TransItemsType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_transitems order by tl_itemno`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranItemsByTranno: {
      type: new GraphQLList(TransItemsType),
      args: {
        tranno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_transitems where tl_no = $1 order by tl_no desc`;
        const values = [args.tranno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranserial: {
      type: new GraphQLList(TranserialType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_transerial order by ts_no`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranserialByTranno: {
      type: new GraphQLList(TranserialType),
      args: {
        tranno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_transerial where ts_no = $1 order by ts_no desc`;
        const values = [args.tranno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranslot: {
      type: new GraphQLList(TranslotType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_translot order by tl_tranno`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranslotByTranno: {
      type: new GraphQLList(TranslotType),
      args: {
        tranno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_translot where tl_tranno = $1 order by tl_itemno`;
        const values = [args.tranno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranadj: {
      type: new GraphQLList(TranadjType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_tranadj order by ta_batchno desc`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranadjByTranno: {
      type: new GraphQLList(TranslotType),
      args: {
        tranno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_tranadj where ta_tranno = $1 order by tl_itemno`;
        const values = [args.tranno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranadjdetls: {
      type: new GraphQLList(TranadjdetlsType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_tranadjdetls order by tad_batchno desc`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranadjdetlsByTranno: {
      type: new GraphQLList(TranadjdetlsType),
      args: {
        tranno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_tranadjdetls where tad_batchno = $1 order by tad_itemno`;
        const values = [args.tranno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranadjlot: {
      type: new GraphQLList(TranadjlotType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_tranadjlot order by tal_batchno desc`;
        const values = [];

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allTranadjlotByTranno: {
      type: new GraphQLList(TranadjlotType),
      args: {
        tranno: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_tranadjlot where tal_batchno = $1 order by tal_itemno`;
        const values = [args.tranno];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    itemgroup: {
      type: ItemGroupType,
      args: { groupcode: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_itemgroups WHERE group_code=$1`;
        const values = [args.groupcode];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allItemGroup: {
      type: new GraphQLList(ItemGroupType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_itemgroups`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allGroups: {
      type: new GraphQLList(GroupType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_groups order by group_desp`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allGroupsByCategory: {
      type: new GraphQLList(GroupType),
      args: { category: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_groups where group_category=$1`;
        const values = [args.category];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    location: {
      type: LocationType,
      args: { locdesp: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_location WHERE loc_desp=$1`;
        const values = [args.locdesp];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allLocations: {
      type: new GraphQLList(LocationType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_location`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    auditlog: {
      type: AuditlogType,
      args: { userid: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_auditlog WHERE at_userid=$1`;
        const values = [args.userid];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allAuditlog: {
      type: new GraphQLList(AuditlogType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_auditlog order by at_date`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    user: {
      type: UserType,
      args: { userid: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_users WHERE u_id=$1`;
        const values = [args.userid];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allUsers: {
      type: new GraphQLList(UserType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_users`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    customer: {
      type: CustomerType,
      args: { custno: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_customers WHERE c_custno=$1`;
        const values = [args.custno];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allCustomers: {
      type: new GraphQLList(CustomerType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_customers`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    supplier: {
      type: SupplierType,
      args: { suppid: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_suppliers WHERE s_suppid=$1`;
        const values = [args.suppid];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allSuppliers: {
      type: new GraphQLList(SupplierType),
      args: {},
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_suppliers`;

        return db
          .many(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    sales: {
      type: SalesType,
      args: { salesno: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_sales WHERE sls_no=$1`;
        const values = [args.salesno];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allSalesByBranch: {
      type: new GraphQLList(SalesType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_sales where sls_branch = $1 order by sls_date desc`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allSalesByCustno: {
      type: new GraphQLList(SalesType),
      args: {
        custno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_sales where sls_custno = $1 and  sls_branch = $2 order by sls_no desc`;
        const values = [args.custno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    allSalesDetlsByBranch: {
      type: new GraphQLList(SalesDetlsType),
      args: {
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_sales_detls where sld_branch =$1 order by sld_itemno`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    allSalesDetlsByInvno: {
      type: new GraphQLList(SalesDetlsType),
      args: {
        invno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_sales_detls where sld_no=$1 and sld_branch =$2 order by sld_itemno`;
        const values = [args.invno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    allReceivableByBranch: {
      type: new GraphQLList(ReceivableType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_ar where ar_branch = $1 order by ar_invno desc`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allReceivableByCustno: {
      type: new GraphQLList(ReceivableType),
      args: {
        custno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_ar where ar_custno = $1 and  ar_branch = $2 order by ar_invno desc`;
        const values = [args.custno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    purchases: {
      type: PurchaseType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_po WHERE po_no=$1`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPurchasesByBranch: {
      type: new GraphQLList(PurchaseType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_po where po_branch=$1 order by po_no desc`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPurchasesBySuppno: {
      type: new GraphQLList(PurchaseType),
      args: {
        suppno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_po where po_suppno=$1 and  po_branch=$2`;
        const values = [args.suppno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPurchasesDetlsByBranch: {
      type: new GraphQLList(PurchaseDetlsType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_poitems where pl_branch=$1`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPurchasesDetlsByPONo: {
      type: new GraphQLList(PurchaseDetlsType),
      args: {
        pono: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_poitems where pl_pono=$1 and pl_branch = $2 order by pl_itemno`;
        const values = [args.pono, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPayableByBranch: {
      type: new GraphQLList(PayableType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_ap where ap_branch = $1 order by ap_invno desc`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPayableBySuppno: {
      type: new GraphQLList(PayableType),
      args: {
        suppno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_ap where ap_suppno = $1 and  ap_branch = $2 order by ap_invno desc`;
        const values = [args.suppno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allReceiptsByBranch: {
      type: new GraphQLList(ReceiptType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_receipt where rcp_branch = $1 order by rcp_no desc`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allReceiptsByCustno: {
      type: new GraphQLList(ReceiptType),
      args: {
        custno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_receipt where rcp_custno = $1 and  rcp_branch = $2 order by rcp_no desc`;
        const values = [args.custno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allReceiptsDetlsByBranch: {
      type: new GraphQLList(ReceiptDetlsType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_receipt_detls where rcpd_branch=$1`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allReceiptsDetlsByPayNo: {
      type: new GraphQLList(ReceiptDetlsType),
      args: {
        payno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_receipt_detls where rcpd_no=$1 and rcpd_branch = $2 order by rcpd_invno`;
        const values = [args.payno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPaymentsByBranch: {
      type: new GraphQLList(PaymentType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_payment where pay_branch = $1 order by pay_no desc`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPaymentsBySuppno: {
      type: new GraphQLList(PaymentType),
      args: {
        suppno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_payment where pay_suppno = $1 and  pay_branch = $2 order by pay_no desc`;
        const values = [args.suppno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPaymentsDetlsByBranch: {
      type: new GraphQLList(PaymentDetlsType),
      args: { branch: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_payment_detls where payd_branch=$1`;
        const values = [args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allPaymentsDetlsByPayNo: {
      type: new GraphQLList(PaymentDetlsType),
      args: {
        payno: { type: GraphQLString },
        branch: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT * FROM dbo_payment_detls where payd_no=$1 and payd_branch = $2 order by payd_invno`;
        const values = [args.payno, args.branch];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
  },
});

exports.query = RootQuery;
