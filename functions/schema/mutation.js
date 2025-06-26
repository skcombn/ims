const graphql = require("graphql");
const db = require("../pgAdaptor").db;
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
} = graphql;
const {
  ItemType,
  ItemOnhandType,
  ItemHistoryType,
  ItemExpiryType,
  ItemSerialType,
  TransType,
  TransItemsType,
  TranserialType,
  TranslotType,
  TranadjType,
  TranadjdetlsType,
  TranadjlotType,
  UserType,
  GroupType,
  CustomerType,
  SupplierType,
  SalesType,
  SalesDetlsType,
  ReceivableType,
  PurchaseType,
  PurchaseDetlsType,
  PayableType,
  PaymentType,
  PaymentDetlsType,
  ReceiptType,
  ReceiptDetlsType,
  DocumentNoType,
  AuditlogType,
} = require("./types");
const { DateScalar } = require("graphql-date-scalars");

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  type: "Mutation",
  fields: {
    addItem: {
      type: ItemType,
      args: {
        item_no: { type: GraphQLString },
        item_desp: { type: GraphQLString },
        item_pack: { type: GraphQLString },
        item_group: { type: GraphQLString },
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
        item_condition: { type: GraphQLString },
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_items(item_no, item_desp,item_pack,item_group, item_unit, item_price,
                       item_cost, item_qtyonhand, item_minlvl, item_pfactor, item_brand, item_manufacturer,
                       item_lotno, item_grade, item_location, item_size, item_suppno, item_supplier, item_type,
                       item_trackexpiry, item_trackserial, item_remark, item_productno, item_inactive, item_cat) VALUES (
                       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25) RETURNING item_no`;
        const values = [
          args.item_no,
          args.item_desp,
          args.item_pack,
          args.item_group,
          args.item_unit,
          args.item_price,
          args.item_cost,
          args.item_qtyonhand,
          args.item_minlvl,
          args.item_pfactor,
          args.item_brand,
          args.item_manufacturer,
          args.item_lotno,
          args.item_grade,
          args.item_location,
          args.item_size,
          args.item_suppno,
          args.item_supplier,
          args.item_type,
          args.item_trackexpiry,
          args.item_trackserial,
          args.item_remark,
          args.item_productno,
          args.item_inactive,
          args.item_cat,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateItem: {
      type: ItemType,
      args: {
        item_id: { type: GraphQLID },
        item_no: { type: GraphQLString },
        item_desp: { type: GraphQLString },
        item_pack: { type: GraphQLString },
        item_group: { type: GraphQLString },
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
        item_condition: { type: GraphQLString },
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_items SET item_no=$2, item_desp=$3,item_pack=$4,
        item_group=$5, item_unit=$6, item_price=$7, item_cost=$8, item_qtyonhand=$9,
        item_minlvl=$10, item_pfactor=$11, item_brand=$12, item_manufacturer=$13, item_lotno=$14, 
        item_grade=$15, item_location=$16,item_size=$17, item_suppno=$18,item_supplier=$19,
        item_type=$20, item_trackexpiry=$21, item_trackserial=$22, item_remark=$23, item_productno=$24,
        item_inactive=$25, item_cat=$26 WHERE item_id=$1 RETURNING item_no`;
        const values = [
          args.item_id,
          args.item_no,
          args.item_desp,
          args.item_pack,
          args.item_group,
          args.item_unit,
          args.item_price,
          args.item_cost,
          args.item_qtyonhand,
          args.item_minlvl,
          args.item_pfactor,
          args.item_brand,
          args.item_manufacturer,
          args.item_lotno,
          args.item_grade,
          args.item_location,
          args.item_size,
          args.item_suppno,
          args.item_supplier,
          args.item_type,
          args.item_trackexpiry,
          args.item_trackserial,
          args.item_remark,
          args.item_productno,
          args.item_inactive,
          args.item_cat,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteItem: {
      type: ItemType,
      args: { item_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_items where item_id=$1 RETURNING item_id`;
        const values = [args.item_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addItemOnhand: {
      type: ItemOnhandType,
      args: {
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
        item_coolprice_pc: { type: GraphQLFloat },
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_itemsonhand(item_no, item_branch,item_qoh_pc,item_qoh_ctn, item_ucost_pc, item_ucost_ctn, item_onorder_pc,
          item_uprice_pc, item_uprice_ctn, item_remark, item_pfactor, item_outlet_pc, item_outlet_ctn, item_offerprice, 
          item_coolprice_pc, item_minlvlqty, item_suppno, item_supplier, item_openqty, item_openamt, item_updated, item_lastsalesdate, 
          item_lastpodate, item_lastpoqty, item_lastsalesqty, item_inactive, item_olducost, item_memuprice, item_allowposaddon)
          VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30) RETURNING item_no`;
        const values = [
          args.item_no,
          args.item_branch,
          args.item_qoh_pc,
          args.item_qoh_ctn,
          args.item_ucost_pc,
          args.item_ucost_ctn,
          args.item_onorder_pc,
          args.item_onorder_ctn,
          args.item_uprice_pc,
          args.item_uprice_ctn,
          args.item_remark,
          args.item_pfactor,
          args.item_outlet_pc,
          args.item_outlet_ctn,
          args.item_offerprice,
          args.item_coolprice_pc,
          args.item_minlvlqty,
          args.item_suppno,
          args.item_supplier,
          args.item_openqty,
          args.item_openamt,
          args.item_updated,
          args.item_lastsalesdate,
          args.item_lastpodate,
          args.item_lastpoqty,
          args.item_lastsalesqty,
          args.item_inactive,
          args.item_olducost,
          args.item_memuprice,
          args.item_allowposaddon,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateItemOnhand: {
      type: ItemOnhandType,
      args: {
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
        item_coolprice_pc: { type: GraphQLFloat },
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_itemsonhand SET item_no=$2, item_branch=$3,item_qoh_pc=$4,item_qoh_ctn=$5,
        item_ucost_pc=$6, item_ucost_ctn=$7, item_onorder_pc=$8, item_onorder_ctn=$9, item_uprice_pc=$10,
        item_uprice_ctn=$11, item_remark=$12, item_pfactor=$13, item_outlet_pc=$14, item_outlet_ctn=$15, 
        item_offerprice=$16,item_coolprice=$17, item_minlvlqty=$18, item_suppno=$19, item_supplier=$20, 
        item_last_openqty=$21, item_openamt=$22, item_updated=$23, item_lastsalesdate=$24, item_lastpodate=$25, 
        item_poqty=$26, item_lastsalesqty=$27, item_inactive=$28, item_olducost=$29, item_memuprice=$30, item_allowposaddon=$31   
        WHERE item_id=$1 RETURNING item_no`;
        const values = [
          args.item_id,
          args.item_no,
          args.item_branch,
          args.item_qoh_pc,
          args.item_qoh_ctn,
          args.item_ucost_pc,
          args.item_ucost_ctn,
          args.item_onorder_pc,
          args.item_onorder_ctn,
          args.item_uprice_pc,
          args.item_uprice_ctn,
          args.item_remark,
          args.item_pfactor,
          args.item_outlet_pc,
          args.item_outlet_ctn,
          args.item_offerprice,
          args.item_coolprice_pc,
          args.item_minlvlqty,
          args.item_suppno,
          args.item_supplier,
          args.item_openqty,
          args.item_openamt,
          args.item_updated,
          args.item_lastsalesdate,
          args.item_lastpodate,
          args.item_lastpoqty,
          args.item_lastsalesqty,
          args.item_inactive,
          args.item_olducost,
          args.item_memuprice,
          args.item_allowposaddon,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteItemOnhand: {
      type: ItemOnhandType,
      args: { item_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_itemsonhand where item_id=$1 RETURNING item_id`;
        const values = [args.item_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addItemHistory: {
      type: ItemHistoryType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_items_history(it_transno, it_itemno, it_transdate, it_qty, it_value, it_disc,
          it_netvalue, it_extvalue, it_pfactor, it_transtype, it_scno, it_sc, it_branch, it_postdate, it_remark,
          it_desp, it_packing, it_lotno)
          VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16,$17,$18) RETURNING it_transno`;
        const values = [
          args.it_transno,
          args.it_itemno,
          args.it_transdate,
          args.it_qty,
          args.it_value,
          args.it_disc,
          args.it_netvalue,
          args.it_extvalue,
          args.it_pfactor,
          args.it_transtype,
          args.it_scno,
          args.it_sc,
          args.it_branch,
          args.it_postdate,
          args.it_remark,
          args.it_desp,
          args.it_packing,
          args.it_lotno,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateItemHistory: {
      type: ItemHistoryType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_items_history SET it_transno=$2, it_itemno=$3, it_transdate=$4, it_qty=$5, it_value=$6, 
                       it_disc=$7, it_netvalue = $8, it_extvalue=$9, it_pfactor=$10, it_transtype=$11, it_scno=$12, 
                       it_sc=$13, it_branch=$14, it_postdate=$15, it_remark=$16, it_desp=$17, it_packing=$18,
                       it_lotno=$19 WHERE it_id=$1 RETURNING it_transno`;
        const values = [
          args.it_id,
          args.it_transno,
          args.it_itemno,
          args.it_transdate,
          args.it_qty,
          args.it_value,
          args.it_disc,
          args.it_netvalue,
          args.it_extvalue,
          args.it_pfactor,
          args.it_transtype,
          args.it_scno,
          args.it_sc,
          args.it_branch,
          args.it_postdate,
          args.it_remark,
          args.it_desp,
          args.it_packing,
          args.it_lotno,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteItemHistory: {
      type: ItemHistoryType,
      args: { it_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_items_history where it_id=$1 RETURNING it_id`;
        const values = [args.it_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addItemExpiry: {
      type: ItemExpiryType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_items_expiry(ie_itemno, ie_lotno, ie_datereceived,
                       ie_location, ie_dateexpiry, ie_pono, ie_podate, ie_qtyonhand,
                       ie_qtyreceived, ie_ucost, ie_post) VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING ie_id`;
        const values = [
          args.ie_itemno,
          args.ie_lotno,
          args.ie_datereceived,
          args.ie_location,
          args.ie_dateexpiry,
          args.ie_pono,
          args.ie_podate,
          args.ie_qtyonhand,
          args.ie_qtyreceived,
          args.ie_ucost,
          args.ie_post,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateItemExpiry: {
      type: ItemExpiryType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_items_expiry SET ie_itemno=$2, ie_lotno=$3, ie_datereceived=$4, 
                       ie_location=$5, ie_dateexpiry=$6, ie_pono=$7, ie_podate = $8, ie_qtyonhand=$9,
                       ie_qtyreceived=$10, ie_ucost=$11, ie_post=$12 WHERE ie_id=$1 RETURNING ie_id`;
        const values = [
          args.ie_id,
          args.ie_itemno,
          args.ie_lotno,
          args.ie_datereceived,
          args.ie_location,
          args.ie_dateexpiry,
          args.ie_pono,
          args.ie_podate,
          args.ie_qtyonhand,
          args.ie_qtyreceived,
          args.ie_ucost,
          args.ie_post,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteItemExpiry: {
      type: ItemExpiryType,
      args: { ie_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_items_expiry where ie_id=$1 RETURNING ie_id`;
        const values = [args.ie_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addItemSerial: {
      type: ItemSerialType,
      args: {
        is_itemno: { type: GraphQLString },
        is_pono: { type: GraphQLString },
        is_podate: { type: DateScalar },
        is_serialno: { type: GraphQLString },
        is_post: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_items_serial(is_itemno, is_pono, is_podate,
                       is_serialno, is_post) VALUES ($1,$2, $3, $4, $5) RETURNING is_id`;
        const values = [
          args.is_itemno,
          args.is_pono,
          args.is_podate,
          args.is_serialno,
          args.is_post,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateItemSerial: {
      type: ItemSerialType,
      args: {
        is_id: { type: GraphQLID },
        is_itemno: { type: GraphQLString },
        is_pono: { type: GraphQLString },
        is_podate: { type: DateScalar },
        is_serialno: { type: GraphQLString },
        is_post: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_items_serial SET is_itemno=$2, is_pono=$3, is_podate=$4, 
                       is_serialno=$5, is_post=$6 WHERE is_id=$1 RETURNING is_id`;
        const values = [
          args.is_id,
          args.is_itemno,
          args.is_pono,
          args.is_podate,
          args.is_serialno,
          args.is_post,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteItemSerial: {
      type: ItemSerialType,
      args: { is_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_items_serial where is_id=$1 RETURNING is_id`;
        const values = [args.is_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addTran: {
      type: TransType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_trans(t_no, t_date, t_type,t_docno,t_docdate, t_scno, t_sc,
                       t_add1, t_add2, t_add3, t_add4, t_term, t_branch, t_remark, t_post,
                       t_print, t_subtotal, t_disc, t_nettotal, t_layout, t_postdate,
                       t_glcode, t_recdate, t_createdby, t_updby, t_createddate, t_createdtime,
                       t_upddate, t_updtime, t_dono, t_name, t_section, t_dodate) VALUES ($1,$2,
                       $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
                       $23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33) RETURNING t_id`;
        const values = [
          args.t_no,
          args.t_date,
          args.t_type,
          args.t_docno,
          args.t_docdate,
          args.t_scno,
          args.t_sc,
          args.t_add1,
          args.t_add2,
          args.t_add3,
          args.t_add4,
          args.t_term,
          args.t_branch,
          args.t_remark,
          args.t_post,
          args.t_print,
          args.t_subtotal,
          args.t_disc,
          args.t_nettotal,
          args.t_layout,
          args.t_postdate,
          args.t_glcode,
          args.t_recdate,
          args.t_createdby,
          args.t_updby,
          args.t_createddate,
          args.t_createdtime,
          args.t_upddate,
          args.t_updtime,
          args.t_dono,
          args.t_name,
          args.t_section,
          args.t_dodate,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateTran: {
      type: TransType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_trans SET t_no=$2, t_date=$3, t_type=$4,t_docno=$5,
                       t_docdate=$6, t_scno=$7, t_sc=$8, t_add1=$9, t_add2=$10,t_add3=$11,
                       t_add4=$12, t_term=$13, t_branch=$14, t_remark=$15, t_post=$16,
                       t_print=$17, t_subtotal=$18, t_disc=$19, t_nettotal=$20, t_layout=$21,
                       t_postdate=$22, t_glcode=$23, t_recdate=$24, t_createdby=$25, t_updby=$26,
                       t_createddate=$27, t_createdtime=$28, t_upddate=$29, t_updtime=$30,
                       t_dono=$31, t_name=$32, t_section=$33, t_dodate=$34 WHERE t_id=$1 RETURNING t_id`;
        const values = [
          args.t_id,
          args.t_no,
          args.t_date,
          args.t_type,
          args.t_docno,
          args.t_docdate,
          args.t_scno,
          args.t_sc,
          args.t_add1,
          args.t_add2,
          args.t_add3,
          args.t_add4,
          args.t_term,
          args.t_branch,
          args.t_remark,
          args.t_post,
          args.t_print,
          args.t_subtotal,
          args.t_disc,
          args.t_nettotal,
          args.t_layout,
          args.t_postdate,
          args.t_glcode,
          args.t_recdate,
          args.t_createdby,
          args.t_updby,
          args.t_createddate,
          args.t_createdtime,
          args.t_upddate,
          args.t_updtime,
          args.t_dono,
          args.t_name,
          args.t_section,
          args.t_dodate,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteTran: {
      type: TransType,
      args: { t_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_trans where t_id=$1 RETURNING t_id`;
        const values = [args.t_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addTranItem: {
      type: TransItemsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_transitems(tl_tranno, tl_type, tl_itemno,tl_qty, tl_ucost,tl_unit,
                       tl_desp, tl_packing,tl_pfactor, tl_netucost, tl_disc, tl_amount,tl_remark,tl_order,
                       tl_branch, tl_lotno, tl_dateexpiry, tl_trackexpiry, tl_uprice, tl_location,
                       tl_uoldcost, tl_brand, tl_trantype, tl_post, tl_trandate, tl_trackserial) VALUES ($1,$2,
                       $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
                       $23,$24,$25,$26) RETURNING tl_id`;
        const values = [
          args.tl_tranno,
          args.tl_type,
          args.tl_itemno,
          args.tl_qty,
          args.tl_ucost,
          args.tl_unit,
          args.tl_desp,
          args.tl_packing,
          args.tl_pfactor,
          args.tl_netucost,
          args.tl_disc,
          args.tl_amount,
          args.tl_remark,
          args.tl_order,
          args.tl_branch,
          args.tl_lotno,
          args.tl_dateexpiry,
          args.tl_trackexpiry,
          args.tl_uprice,
          args.tl_location,
          args.tl_uoldcost,
          args.tl_brand,
          args.tl_trantype,
          args.tl_post,
          args.tl_trandate,
          args.tl_trackserial,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateTranItem: {
      type: TransItemsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_transitems SET tl_tranno=$2, tl_type=$3, tl_itemno=$4,tl_qty=$5,
                       tl_ucost=$6, tl_unit=$7, tl_desp=$8, tl_packing=$9, tl_pfactor=$10,tl_netucost=$11,
                       tl_disc=$12, tl_amount=$13, tl_remark=$14, tl_order=$15, tl_branch=$16,
                       tl_lotno=$17, tl_dateexpiry=$18,tl_trackexpiry=$19, tl_uprice=$20, tl_location=$21,
                       tl_uoldcost=$22, tl_brand=$23, tl_trantype=$24, tl_post=$25, tl_trandate=$26,
                       tl_trackserial=$27 WHERE tl_id=$1 RETURNING tl_id`;
        const values = [
          args.tl_id,
          args.tl_tranno,
          args.tl_type,
          args.tl_itemno,
          args.tl_qty,
          args.tl_ucost,
          args.tl_unit,
          args.tl_desp,
          args.tl_packing,
          args.tl_pfactor,
          args.tl_netucost,
          args.tl_disc,
          args.tl_amount,
          args.tl_remark,
          args.tl_order,
          args.tl_branch,
          args.tl_lotno,
          args.tl_dateexpiry,
          args.tl_trackexpiry,
          args.tl_uprice,
          args.tl_location,
          args.tl_uoldcost,
          args.tl_brand,
          args.tl_trantype,
          args.tl_post,
          args.tl_trandate,
          args.tl_trackserial,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteTranItem: {
      type: TransItemsType,
      args: { tl_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_transitems where tl_id=$1 RETURNING tl_id`;
        const values = [args.tl_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addTranserial: {
      type: TranserialType,
      args: {
        ts_tranno: { type: GraphQLString },
        ts_serialno: { type: GraphQLString },
        ts_pono: { type: GraphQLString },
        ts_invno: { type: GraphQLString },
        ts_podate: { type: DateScalar },
        ts_invdate: { type: DateScalar },
        ts_post: { type: GraphQLString },
        ts_trantype: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_transerial(ts_tranno, ts_serialno, ts_pono,ts_invno, ts_podate,ts_invdate,
                       ts_post, ts_trantype) VALUES ($1,$2,$3, $4, $5,$6,$7,$8) RETURNING ts_id`;
        const values = [
          args.ts_tranno,
          args.ts_serialno,
          args.ts_podate,
          args.ts_invno,
          args.ts_podate,
          args.ts_invdate,
          args.ts_post,
          args.ts_trantype,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateTranserial: {
      type: TranserialType,
      args: {
        ts_id: { type: GraphQLID },
        ts_tranno: { type: GraphQLString },
        ts_serialno: { type: GraphQLString },
        ts_pono: { type: GraphQLString },
        ts_invno: { type: GraphQLString },
        ts_podate: { type: DateScalar },
        ts_invdate: { type: DateScalar },
        ts_post: { type: GraphQLString },
        ts_trantype: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_transerial SET ts_tranno=$2, ts_serialno=$3, ts_pono=$4,ts_invno=$5,
                       ts_podate=$6, ts_invdate=$7, ts_post=$8, ts_trantype=$9 WHERE ts_id=$1 RETURNING ts_id`;
        const values = [
          args.ts_id,
          args.ts_tranno,
          args.ts_serialno,
          args.ts_podate,
          args.ts_invno,
          args.ts_podate,
          args.ts_invdate,
          args.ts_post,
          args.ts_trantype,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteTranserial: {
      type: TranserialType,
      args: { ts_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_transerial where ts_id=$1 RETURNING ts_id`;
        const values = [args.ts_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addTranslot: {
      type: TranslotType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_translot( tl_tranno,  tl_type, tl_itemno, tl_lotno, tl_datereceived,
                       tl_location,  tl_dateexpiry,  tl_pono,  tl_podate,  tl_qtyonhand,  tl_qtyreceived,
                       tl_ucost,  tl_post,  tl_qty,  tl_trantype) VALUES ($1,$2,$3, $4, $5,$6,$7,$8,$9,$10,$11,
                       $12, $13, $14, $15) RETURNING tl_id`;
        const values = [
          args.tl_tranno,
          args.tl_type,
          args.tl_itemno,
          args.tl_lotno,
          args.tl_datereceived,
          args.tl_location,
          args.tl_dateexpiry,
          args.tl_pono,
          args.tl_podate,
          args.tl_qtyonhand,
          args.tl_qtyreceived,
          args.tl_ucost,
          args.tl_post,
          args.tl_qty,
          args.tl_trantype,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateTranslot: {
      type: TranslotType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_translot SET tl_tranno=$2, tl_type=$3, tl_itemno=$4, tl_lotno=$5,
                       tl_datereceived=$6,  tl_location=$7,  tl_dateexpiry=$8,  tl_pono=$9,  tl_podate=$10,
                       tl_qtyonhand=$11,  tl_qtyreceived=$12,  tl_ucost=$13,  tl_post=$14,  tl_qty=$15,
                       tl_trantype=$16 WHERE tl_id=$1 RETURNING tl_id`;
        const values = [
          args.tl_id,
          args.tl_tranno,
          args.tl_type,
          args.tl_itemno,
          args.tl_lotno,
          args.tl_datereceived,
          args.tl_location,
          args.tl_dateexpiry,
          args.tl_pono,
          args.tl_podate,
          args.tl_qtyonhand,
          args.tl_qtyreceived,
          args.tl_ucost,
          args.tl_post,
          args.tl_qty,
          args.tl_trantype,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteTranslot: {
      type: TranslotType,
      args: { tl_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_translot where tl_id=$1 RETURNING tl_id`;
        const values = [args.tl_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addTranadj: {
      type: TranadjType,
      args: {
        ta_batchno: { type: GraphQLString },
        ta_date: { type: DateScalar },
        ta_userid: { type: GraphQLString },
        ta_remark: { type: GraphQLString },
        ta_post: { type: GraphQLString },
        ta_branch: { type: GraphQLString },
        ta_type: { type: GraphQLString },
        ta_user: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_tranadj( ta_batchno,  ta_date, ta_userid, ta_remark, ta_post,
                       ta_branch,  ta_type,  ta_user) VALUES ($1,$2,$3, $4, $5,$6,$7,$8) RETURNING ta_id`;
        const values = [
          args.ta_batchno,
          args.ta_date,
          args.ta_userid,
          args.ta_remark,
          args.ta_post,
          args.ta_branch,
          args.ta_type,
          args.ta_user,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateTranadj: {
      type: TranadjType,
      args: {
        ta_id: { type: GraphQLID },
        ta_batchno: { type: GraphQLString },
        ta_date: { type: DateScalar },
        ta_userid: { type: GraphQLString },
        ta_remark: { type: GraphQLString },
        ta_post: { type: GraphQLString },
        ta_branch: { type: GraphQLString },
        ta_type: { type: GraphQLString },
        ta_user: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_tranadj SET ta_batchno=$2, ta_date=$3, ta_userid=$4, ta_remark=$5,
                       ta_post=$6,  ta_branch=$7,  ta_type=$8,  ta_user=$9 WHERE ta_id=$1 RETURNING ta_id`;
        const values = [
          args.ta_id,
          args.ta_batchno,
          args.ta_date,
          args.ta_userid,
          args.ta_remark,
          args.ta_post,
          args.ta_branch,
          args.ta_type,
          args.ta_user,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteTranadj: {
      type: TranadjType,
      args: { ta_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_tranadj where ta_id=$1 RETURNING ta_id`;
        const values = [args.ta_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addTranadjdetls: {
      type: TranadjdetlsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_tranadjdetls( tad_batchno,  tad_itemno, tad_desp, tad_packing, tad_qtyonhand,
                       tad_qtycount,  tad_qtyadjust,  tad_branch, tad_unit, tad_trackexpiry) VALUES ($1,$2,$3, $4, 
                       $5,$6,$7,$8,$9,$10) RETURNING tad_id`;
        const values = [
          args.tad_batchno,
          args.tad_itemno,
          args.tad_desp,
          args.tad_packing,
          args.tad_qtyonhand,
          args.tad_qtycount,
          args.tad_qtyadjust,
          args.tad_branch,
          args.tad_unit,
          args.tad_trackexpiry,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateTranadjdetls: {
      type: TranadjdetlsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_tranadjdetls SET tad_batchno=$2, tad_itemno=$3, tad_desp=$4, tad_packing=$5,
                       tad_qtyonhand=$6,  tad_qtycount=$7,  tad_qtyadjust=$8,  tad_branch=$9, tad_unit=$10,
                       tad_trackexpiry=$11 WHERE tad_id=$1 RETURNING tad_id`;
        const values = [
          args.tad_id,
          args.tad_batchno,
          args.tad_itemno,
          args.tad_desp,
          args.tad_packing,
          args.tad_qtyonhand,
          args.tad_qtycount,
          args.tad_qtyadjust,
          args.tad_branch,
          args.tad_unit,
          args.tad_trackexpiry,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteTranadjdetls: {
      type: TranadjdetlsType,
      args: { tad_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_tranadjdetls where tad_id=$1 RETURNING tad_id`;
        const values = [args.tad_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addTranadjlot: {
      type: TranadjlotType,
      args: {
        tal_batchno: { type: GraphQLString },
        tal_itemno: { type: GraphQLString },
        tal_lotno: { type: GraphQLString },
        tal_pono: { type: GraphQLString },
        tal_expirydate: { type: DateScalar },
        tal_qtyonhand: { type: GraphQLFloat },
        tal_qtycount: { type: GraphQLFloat },
        tal_qtyadjust: { type: GraphQLFloat },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_tranadjlot( tal_batchno,  tal_itemno, tal_lotno, tal_pono, tal_expirydate,
                       tal_qtyonhand,  tal_qtycount,  tal_qtyadjust) VALUES ($1,$2,$3, $4, $5,$6,$7,$8) RETURNING tal_id`;
        const values = [
          args.tal_batchno,
          args.tal_itemno,
          args.tal_lotno,
          args.tal_pono,
          args.tal_expirydate,
          args.tal_qtyonhand,
          args.tal_qtycount,
          args.tal_qtyadjust,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateTranadjlot: {
      type: TranadjlotType,
      args: {
        tal_id: { type: GraphQLID },
        tal_batchno: { type: GraphQLString },
        tal_itemno: { type: GraphQLString },
        tal_lotno: { type: GraphQLString },
        tal_pono: { type: GraphQLString },
        tal_expirydate: { type: DateScalar },
        tal_qtyonhand: { type: GraphQLFloat },
        tal_qtycount: { type: GraphQLFloat },
        tal_qtyadjust: { type: GraphQLFloat },
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_tranadjlot SET tal_batchno=$2, tal_itemno=$3, tal_lotno=$4, tal_pono=$5,
                       tal_expirydate=$6,  tal_qtyonhand=$7,  tal_qtycount=$8,  tal_qtyadjust=$9 WHERE tal_id=$1 RETURNING tal_id`;
        const values = [
          args.tal_id,
          args.tal_batchno,
          args.tal_itemno,
          args.tal_lotno,
          args.tal_pono,
          args.tal_expirydate,
          args.tal_qtyonhand,
          args.tal_qtycount,
          args.tal_qtyadjust,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteTranadjlot: {
      type: TranadjlotType,
      args: { tal_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_tranadjlot where tal_id=$1 RETURNING tal_id`;
        const values = [args.tal_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addUser: {
      type: UserType,
      args: {
        u_userid: { type: GraphQLString },
        u_name: { type: GraphQLString },
        u_email: { type: GraphQLString },
        u_password: { type: GraphQLString },
        u_level: { type: GraphQLString },
        u_lastlogindate: { type: DateScalar },
        u_usergroup: { type: GraphQLString },
        u_jobtitle: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_users(u_userid, u_name, u_email,u_password, u_level, u_lastlogindate, u_usergroup, u_jobtitle) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING u_userid`;
        const values = [
          args.u_userid,
          args.u_name,
          args.u_email,
          args.u_password,
          args.u_level,
          args.u_lastlogindate,
          args.u_usergroup,
          args.u_jobtitle,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        u_id: { type: GraphQLID },
        u_userid: { type: GraphQLString },
        u_name: { type: GraphQLString },
        u_email: { type: GraphQLString },
        u_password: { type: GraphQLString },
        u_level: { type: GraphQLString },
        u_lastlogindate: { type: DateScalar },
        u_usergroup: { type: GraphQLString },
        u_jobtitle: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_users SET u_userid = $2, u_name = $3 , u_email= $4, u_password=$5, u_level=$6, u_lastlogindate = $7, u_usergroup=$8, u_jobtitle=$9  WHERE id=$1 RETURNING u_id`;
        const values = [
          args.u_id,
          args.u_userid,
          args.u_name,
          args.u_email,
          args.u_password,
          args.u_level,
          args.u_lastlogindate,
          args.u_usergroup,
          args.u_jobtitle,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteUser: {
      type: UserType,
      args: { u_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_users where u_id=$1 RETURNING u_id`;
        const values = [args.u_id];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addCustomer: {
      type: CustomerType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_customers(c_custno, c_cust, c_add1, c_add2, c_add3,c_add4, c_phone, c_fax, c_email,
                       c_crlimit, c_terms, c_contact, c_post, c_glcode, c_branch,c_area, c_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14,$15,$16,$17) RETURNING c_custno`;
        const values = [
          args.c_custno,
          args.c_cust,
          args.c_add1,
          args.c_add2,
          args.c_add3,
          args.c_add4,
          args.c_phone,
          args.c_fax,
          args.c_email,
          args.c_crlimit,
          args.c_terms,
          args.c_contact,
          args.c_post,
          args.c_glcode,
          args.c_branch,
          args.c_area,
          args.c_type,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateCustomer: {
      type: CustomerType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_customers SET c_custno = $2, c_cust = $3, c_add1 = $4 , c_add2= $5, c_add3 = $6, c_add4 = $7,
                       c_phone=$8, c_fax=$9, c_email=$10, c_crlimit=$11, c_terms=$12, c_contact=$13, c_post=$14, c_glcode=$15,
                       c_branch=$16, c_area=$17, c_type=$18 WHERE c_id=$1 RETURNING c_custno`;
        const values = [
          args.c_id,
          args.c_custno,
          args.c_cust,
          args.c_add1,
          args.c_add2,
          args.c_add3,
          args.c_add4,
          args.c_phone,
          args.c_fax,
          args.c_email,
          args.c_crlimit,
          args.c_terms,
          args.c_contact,
          args.c_post,
          args.c_glcode,
          args.c_branch,
          args.c_area,
          args.c_type,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteCustomer: {
      type: CustomerType,
      args: { c_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_customers where c_id=$1 RETURNING c_id`;
        const values = [args.c_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addSupplier: {
      type: SupplierType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_suppliers(s_suppno, s_supp, s_add1, s_add2, s_add3, s_add4, s_phone,
                       s_email, s_fax, s_contact, s_crlimit, s_terms, s_glcode, s_branch, s_bankname, 
                       s_bankacno) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15,
                       $16) RETURNING s_suppno`;
        const values = [
          args.s_suppno,
          args.s_supp,
          args.s_add1,
          args.s_add2,
          args.s_add3,
          args.s_add4,
          args.s_phone,
          args.s_email,
          args.s_fax,
          args.s_contact,
          args.s_crlimit,
          args.s_terms,
          args.s_glcode,
          args.s_branch,
          args.s_bankname,
          args.s_bankacno,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateSupplier: {
      type: SupplierType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_suppliers SET s_suppno = $2, s_supp = $3, s_add1 = $4 , s_add2= $5,
                       s_add3 = $6, s_add4 = $7, s_phone = $8, s_email=$9, s_fax=$10, s_contact=$11,
                       s_crlimit=$12, s_terms=$13, s_glcode=$14, s_branch=$15, s_bankname=$16, 
                       s_bankacno=$17 WHERE s_id=$1 RETURNING s_suppno`;
        const values = [
          args.s_id,
          args.s_suppno,
          args.s_supp,
          args.s_add1,
          args.s_add2,
          args.s_add3,
          args.s_add4,
          args.s_phone,
          args.s_email,
          args.s_fax,
          args.s_contact,
          args.s_crlimit,
          args.s_terms,
          args.s_glcode,
          args.s_branch,
          args.s_bankname,
          args.s_bankacno,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteSupplier: {
      type: SupplierType,
      args: { s_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_suppliers where s_id=$1 RETURNING s_id`;
        const values = [args.s_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addSales: {
      type: SalesType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_sales(sls_no, sls_so, sls_date, sls_term, sls_duedate, sls_custno, sls_cust, 
                       sls_add1, sls_add2, sls_add3, sls_add4, sls_remark, sls_oref, sls_yref, sls_smno, sls_area, sls_tax_perc,
                       sls_tax, sls_freight, sls_subtotal, sls_disc, sls_total, sls_post, sls_bank, sls_check, sls_received,
                       sls_type, sls_shipfrom, sls_shipmenttype, sls_postdate, sls_layout, sls_glcode, sls_branch, sls_createdby,
                       sls_updby, sls_createddate, sls_createdtime, sls_upddate, sls_updtime) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11,$12,$13, $14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,
                        $25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39)
                       RETURNING sls_no`;
        const values = [
          args.sls_no,
          args.sls_so,
          args.sls_date,
          args.sls_term,
          args.sls_duedate,
          args.sls_custno,
          args.sls_cust,
          args.sls_add1,
          args.sls_add2,
          args.sls_add3,
          args.sls_add4,
          args.sls_remark,
          args.sls_oref,
          args.sls_yref,
          args.sls_smno,
          args.sls_area,
          args.sls_tax_perc,
          args.sls_tax,
          args.sls_freight,
          args.sls_subtotal,
          args.sls_disc,
          args.sls_total,
          args.sls_post,
          args.sls_bank,
          args.sls_check,
          args.sls_received,
          args.sls_type,
          args.sls_shipfrom,
          args.sls_shipmenttype,
          args.sls_postdate,
          args.sls_layout,
          args.sls_glcode,
          args.sls_branch,
          args.sls_createdby,
          args.sls_updby,
          args.sls_createddate,
          args.sls_createdtime,
          args.sls_upddate,
          args.sls_updtime,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateSales: {
      type: SalesType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_sales SET sls_no=$2, sls_so=$3, sls_date=$4, sls_term=$5, sls_duedate=$6, sls_custno=$7, sls_cust=$8, 
                       sls_add1=$9, sls_add2=$10, sls_add3=$11, sls_add4=$12, sls_remark=$13, sls_oref=$14, sls_yref=$15, sls_smno=$16, sls_area=$17, sls_tax_perc=$18,
                       sls_tax=$19, sls_freight=$20, sls_subtotal=$21, sls_disc=$22, sls_total=$23, sls_post=$24, sls_bank=$25, sls_check=$26, sls_received=$27,
                       sls_type=$28, sls_shipfrom=$29, sls_shipmenttype=$30, sls_postdate=$31, sls_layout=$32, sls_glcode=$33, sls_branch=$34, sls_createdby=$35,
                       sls_updby=$36, sls_createddate=$37, sls_createdtime=$38, sls_upddate=$39, sls_updtime=$40
                       WHERE sls_id=$1 RETURNING sls_id`;
        const values = [
          args.sls_id,
          args.sls_no,
          args.sls_so,
          args.sls_date,
          args.sls_term,
          args.sls_duedate,
          args.sls_custno,
          args.sls_cust,
          args.sls_add1,
          args.sls_add2,
          args.sls_add3,
          args.sls_add4,
          args.sls_remark,
          args.sls_oref,
          args.sls_yref,
          args.sls_smno,
          args.sls_area,
          args.sls_tax_perc,
          args.sls_tax,
          args.sls_freight,
          args.sls_subtotal,
          args.sls_disc,
          args.sls_total,
          args.sls_post,
          args.sls_bank,
          args.sls_check,
          args.sls_received,
          args.sls_type,
          args.sls_shipfrom,
          args.sls_shipmenttype,
          args.sls_postdate,
          args.sls_layout,
          args.sls_glcode,
          args.sls_branch,
          args.sls_createdby,
          args.sls_updby,
          args.sls_createddate,
          args.sls_createdtime,
          args.sls_upddate,
          args.sls_updtime,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteSales: {
      type: SalesType,
      args: { sls_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_sales where sls_id=$1 RETURNING sls_id`;
        const values = [args.sls_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addSalesDetls: {
      type: SalesDetlsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_sales_detls(sld_no, sld_itemno, sld_desp, sld_brand,sld_packing,sld_pfactor, 
                       sld_unit, sld_qty, sld_price, sld_total, sld_acc, sld_order, sld_sitemno, sld_branch, sld_ucost,
                       sld_itemtype, sld_error) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11,$12,$13, $14,$15,$16,$17)
                       RETURNING sld_no`;
        const values = [
          args.sld_no,
          args.sld_itemno,
          args.sld_desp,
          args.sld_brand,
          args.sld_packing,
          args.sld_pfactor,
          args.sld_unit,
          args.sld_qty,
          args.sld_price,
          args.sld_total,
          args.sld_acc,
          args.sld_order,
          args.sld_sitemno,
          args.sld_branch,
          args.sld_ucost,
          args.sld_itemtype,
          args.sld_error,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateSalesDetls: {
      type: SalesDetlsType,
      args: {
        sld_id: { type: GraphQLID },
        sld_no: { type: GraphQLString },
        sld_type: { type: GraphQLString },
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_sales_detls SET sld_no=$2, sld_type=$3, sld_itemno=$4, sld_desp=$5, sld_brand=$6, sld_packing=$7, sld_pfactor=$8, 
                       sld_unit=$0, sld_qty=$10, sld_price=$11, sld_total=$12, sld_acc=$13, sld_order=$14, sld_sitemno=$15, sld_branch=$16, sld_ucost=$17,
                       sld_itemtype=$18, sld_error=$19 WHERE sld_id=$1 RETURNING sld_id`;
        const values = [
          args.sld_id,
          args.sld_no,
          args.sld_type,
          args.sld_itemno,
          args.sld_desp,
          args.sld_brand,
          args.sld_packing,
          args.sld_pfactor,
          args.sld_unit,
          args.sld_qty,
          args.sld_price,
          args.sld_total,
          args.sld_acc,
          args.sld_order,
          args.sld_sitemno,
          args.sld_branch,
          args.sld_ucost,
          args.sld_itemtype,
          args.sld_error,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteSalesDetls: {
      type: SalesDetlsType,
      args: { sld_no: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_sales_detls where sld_no=$1 RETURNING sld_no`;
        const values = [args.sld_no];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addReceivable: {
      type: ReceivableType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_ar(ar_invno, ar_date, ar_custno, ar_cust, ar_type, ar_subtotal, 
                       ar_paid_amt,ar_disc_amt,ar_disc_taken, ar_balance, ar_total, ar_branch, ar_paid, 
                       ar_glcode, ar_paid_disc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11,$12,$13, $14,$15)
                       RETURNING ar_invno`;
        const values = [
          args.ar_invno,
          args.ar_date,
          args.ar_custno,
          args.ar_cust,
          args.ar_type,
          args.ar_subtotal,
          args.ar_paid_amt,
          args.ar_disc_amt,
          args.ar_disc_taken,
          args.ar_balance,
          args.ar_total,
          args.ar_branch,
          args.ar_paid,
          args.ar_glcode,
          args.ar_paid_disc,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateReceivable: {
      type: ReceivableType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_ar SET ar_invno=$2, ar_date=$3, ar_custno=$4, ar_cust=$5, ar_type=$6, ar_subtotal=$7, ar_paid_amt=$8, 
                       ar_disc_amt=$9, ar_disc_taken=$10, ar_balance=$11, ar_total=$12, ar_branch=$13, ar_paid=$14, ar_glcode=$15, ar_paid_disc=$16
                       WHERE ar_id=$1 RETURNING ar_id`;
        const values = [
          args.ar_id,
          args.ar_invno,
          args.ar_date,
          args.ar_custno,
          args.ar_cust,
          args.ar_type,
          args.ar_subtotal,
          args.ar_paid_amt,
          args.ar_disc_amt,
          args.ar_disc_taken,
          args.ar_balance,
          args.ar_total,
          args.ar_branch,
          args.ar_paid,
          args.ar_glcode,
          args.ar_paid_disc,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteReceivable: {
      type: ReceivableType,
      args: { ar_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_ar where ar_id=$1 RETURNING ar_id`;
        const values = [args.ar_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addPurchase: {
      type: PurchaseType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_po(po_no, po_date, po_type, po_suppno, po_supp,po_add1, po_add2, po_add3, po_add4,
                       po_term, po_invno, po_branch,po_remark, po_post, po_print, po_subtotal, po_disc, po_nettotal, 
                       po_layout, po_postdate, po_glcode, po_dodate, po_invdate, po_recdate, po_sono, po_createdby, 
                       po_updby, po_createddate, po_createdtime, po_upddate, po_updtime) VALUES ($1, $2, $3, $4, $5, 
                       $6, $7, $8, $9,$10, $11,$12,$13,$14,$15,$16,$17,$18,$19,$20, $21,$22, $23, $24, $25, $26, $27,
                       $28, $29, $30, $31) RETURNING po_no`;
        const values = [
          args.po_no,
          args.po_date,
          args.po_type,
          args.po_suppno,
          args.po_supp,
          args.po_add1,
          args.po_add2,
          args.po_add3,
          args.po_add4,
          args.po_term,
          args.po_invno,
          args.po_branch,
          args.po_remark,
          args.po_post,
          args.po_print,
          args.po_subtotal,
          args.po_disc,
          args.po_nettotal,
          args.po_layout,
          args.po_postdate,
          args.po_glcode,
          args.po_dodate,
          args.po_invdate,
          args.po_recdate,
          args.po_sono,
          args.po_createdby,
          args.po_updby,
          args.po_createddate,
          args.po_createdtime,
          args.po_upddate,
          args.po_updtime,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updatePurchase: {
      type: PurchaseType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_po SET po_no = $2, po_date = $3, po_type = $4 , po_suppno = $5, po_supp= $6, 
                       po_add1 = $7, po_add2=$8, po_add3=$9, po_add4=$10, po_term = $11, po_invno = $12, po_branch=$13, 
                       po_remark=$14, po_post=$15, po_print = $16, po_subtotal=$17, po_disc=$18, po_nettotal=$19, 
                       po_layout=$20, po_postdate=$21, po_glcode=$22, po_dodate=$23, po_invdate=$24, po_recdate=$25,
                       po_sono=$26, po_createdby=$27, po_updby=$28, po_createddate=$29, po_createdtime=$30, 
                       po_upddate=$31, po_updtime=$32 WHERE po_id=$1 RETURNING po_id`;
        const values = [
          args.po_id,
          args.po_no,
          args.po_date,
          args.po_type,
          args.po_suppno,
          args.po_supp,
          args.po_add1,
          args.po_add2,
          args.po_add3,
          args.po_add4,
          args.po_term,
          args.po_invno,
          args.po_branch,
          args.po_remark,
          args.po_post,
          args.po_print,
          args.po_subtotal,
          args.po_disc,
          args.po_nettotal,
          args.po_layout,
          args.po_postdate,
          args.po_glcode,
          args.po_dodate,
          args.po_invdate,
          args.po_recdate,
          args.po_sono,
          args.po_createdby,
          args.po_updby,
          args.po_createddate,
          args.po_createdtime,
          args.po_upddate,
          args.po_updtime,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deletePurchase: {
      type: PurchaseType,
      args: { po_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_po where po_id=$1 RETURNING po_id`;
        const values = [args.po_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addPurchaseDetls: {
      type: PurchaseDetlsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_poitems(pl_pono,pl_type, pl_itemno, pl_desp, pl_brand, pl_packing,pl_pfactor,pl_unit, 
                       pl_qty, pl_ucost, pl_netucost, pl_disc, pl_excost, pl_remark, pl_order,pl_branch,pl_uoldcost
                       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11,$12,$13,$14,$15,$16,$17) RETURNING pl_pono`;
        const values = [
          args.pl_pono,
          args.pl_type,
          args.pl_itemno,
          args.pl_desp,
          args.pl_brand,
          args.pl_packing,
          args.pl_pfactor,
          args.pl_unit,
          args.pl_qty,
          args.pl_ucost,
          args.pl_netucost,
          args.pl_disc,
          args.pl_excost,
          args.pl_remark,
          args.pl_order,
          args.pl_branch,
          args.pl_uoldcost,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updatePurchaseDetls: {
      type: PurchaseDetlsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_poitems SET pl_pono = $2, pl_type = $3, pl_itemno = $4 , pl_desp = $5, pl_brand= $6, 
                       pl_packing = $7, pl_pfactor = $8, pl_unit=$9, pl_qty=$10, pl_ucost=$11, pl_netucost = $12,
                       pl_disc=$13, pl_excost=$14, pl_remark=$15, pl_order=$16, pl_branch=$17, pl_uoldcost=$18
                       WHERE pl_id=$1 RETURNING pl_id`;
        const values = [
          args.pl_id,
          args.pl_pono,
          args.pl_type,
          args.pl_itemno,
          args.pl_desp,
          args.pl_brand,
          args.pl_packing,
          args.pl_pfactor,
          args.pl_unit,
          args.pl_qty,
          args.pl_ucost,
          args.pl_netucost,
          args.pl_disc,
          args.pl_excost,
          args.pl_remark,
          args.pl_order,
          args.pl_branch,
          args.pl_uoldcost,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deletePurchaseDetls: {
      type: PurchaseDetlsType,
      args: { pl_pono: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_poitems where pl_pono=$1 RETURNING pl_pono`;
        const values = [args.pl_pono];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addPayable: {
      type: PayableType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_ap(ap_pono, ap_podate, ap_invno, ap_invdate,ap_recdate, 
                       ap_suppno, ap_supplier, ap_type, ap_subtotal_amt, ap_nettotal_amt, ap_paid_amt,
                       ap_disc_amt,ap_disc_taken, ap_dc, ap_acc, ap_paid, ap_balance, ap_branch, ap_glcode, ap_paid_disc) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11,$12,$13, $14,$15,$16,$17,$18,$19,$20)
                       RETURNING ap_pono`;
        const values = [
          args.ap_pono,
          args.ap_podate,
          args.ap_invno,
          args.ap_invdate,
          args.ap_recdate,
          args.ap_suppno,
          args.ap_supplier,
          args.ap_type,
          args.ap_subtotal_amt,
          args.ap_nettotal_amt,
          args.ap_paid_amt,
          args.ap_disc_amt,
          args.ap_disc_taken,
          args.ap_dc,
          args.ap_acc,
          args.ap_paid,
          args.ap_balance,
          args.ap_branch,
          args.ap_glcode,
          args.ap_paid_disc,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updatePayable: {
      type: PayableType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_ap SET ap_pono=$2, ap_podate=$3, ap_invno=$4, ap_invdate=$5, ap_recdate=$6, 
                       ap_suppno=$7, ap_supplier=$8, ap_type=$9, ap_subtotal_amt=$10, ap_nettotal_amt=$11, ap_paid_amt=$12, 
                       ap_disc_amt=$13, ap_disc_taken=$14, ap_dc=$15, ap_acc=$16, ap_paid=$17,  ap_balance=$18, ap_branch=$19, 
                       ap_glcode=$20, ap_paid_disc=$21  WHERE ap_id=$1 RETURNING ap_id`;
        const values = [
          args.ap_id,
          args.ap_pono,
          args.ap_podate,
          args.ap_invno,
          args.ap_invdate,
          args.ap_recdate,
          args.ap_suppno,
          args.ap_supplier,
          args.ap_type,
          args.ap_subtotal_amt,
          args.ap_nettotal_amt,
          args.ap_paid_amt,
          args.ap_disc_amt,
          args.ap_disc_taken,
          args.ap_dc,
          args.ap_acc,
          args.ap_paid,
          args.ap_balance,
          args.ap_branch,
          args.ap_glcode,
          args.ap_paid_disc,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deletePayable: {
      type: PayableType,
      args: { ap_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_ap where ap_id=$1 RETURNING ap_id`;
        const values = [args.ap_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addReceipt: {
      type: ReceiptType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_receipt(rcp_no, rcp_date, rcp_bank, rcp_refno, rcp_remark,
                       rcp_custno, rcp_customer, rcp_total, rcp_disc, rcp_nettotal, rcp_post,
                       rcp_branch) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11,$12)
                       RETURNING rcp_no`;
        const values = [
          args.rcp_no,
          args.rcp_date,
          args.rcp_bank,
          args.rcp_refno,
          args.rcp_remark,
          args.rcp_custno,
          args.rcp_customer,
          args.rcp_total,
          args.rcp_disc,
          args.rcp_nettotal,
          args.rcp_post,
          args.rcp_branch,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateReceipt: {
      type: ReceiptType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_receipt SET rcp_no=$2, rcp_date=$3, rcp_bank=$4, rcp_refno=$5, rcp_remark=$6, 
                       rcp_custno=$7, rcp_customer=$8, rcp_total=$9, rcp_disc=$10, rcp_nettotal=$11, rcp_post=$12, 
                       rcp_branch=$13  WHERE rcp_id=$1 RETURNING rcp_id`;
        const values = [
          args.rcp_id,
          args.rcp_no,
          args.rcp_date,
          args.rcp_bank,
          args.rcp_refno,
          args.rcp_remark,
          args.rcp_custno,
          args.rcp_customer,
          args.rcp_total,
          args.rcp_disc,
          args.rcp_nettotal,
          args.rcp_post,
          args.rcp_branch,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteReceipt: {
      type: ReceiptType,
      args: { rcp_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_receipt where rcp_id=$1 RETURNING rcp_id`;
        const values = [args.rcp_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addReceiptsDetls: {
      type: ReceiptDetlsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_receipt_detls(rcpd_no, rcpd_invno, rcpd_invdate, rcpd_invamt, rcpd_last_bal,
                       rcpd_disc, rcpd_amt, rcpd_arid, rcpd_branch, rcpd_recdate) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
                       RETURNING rcpd_no`;
        const values = [
          args.rcpd_no,
          args.rcpd_invno,
          args.rcpd_invdate,
          args.rcpd_invamt,
          args.rcpd_last_bal,
          args.rcpd_disc,
          args.rcpd_amt,
          args.rcpd_arid,
          args.rcpd_branch,
          args.rcpd_recdate,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateReceiptsDetls: {
      type: ReceiptDetlsType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_receipt_detls SET rcpd_no=$2, rcpd_invno=$3, rcpd_invdate=$4, rcpd_invamt=$5, rcpd_last_bal=$6, 
                       rcpd_disc=$7, rcpd_amt=$8, rcpd_arid=$9, rcpd_branch=$10, rcpd_recdate=$11 WHERE rcpd_id=$1 RETURNING rcpd_id`;
        const values = [
          args.rcpd_id,
          args.rcpd_no,
          args.rcpd_invno,
          args.rcpd_invdate,
          args.rcpd_invamt,
          args.rcpd_last_bal,
          args.rcpd_disc,
          args.rcpd_amt,
          args.rcpd_arid,
          args.rcpd_branch,
          args.rcpd_recdate,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteReceiptsDetls: {
      type: ReceiptDetlsType,
      args: { rcpd_no: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_receipt_detls where rcpd_no=$1 RETURNING rcpd_no`;
        const values = [args.rcpd_no];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addPayment: {
      type: PaymentType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_payment(pay_no, pay_date, pay_bank, pay_refno, pay_remark,
                       pay_suppno, pay_supplier, pay_total, pay_disc, pay_nettotal, pay_post,
                       pay_glcode, pay_branch) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11,$12,$13)
                       RETURNING pay_no`;
        const values = [
          args.pay_no,
          args.pay_date,
          args.pay_bank,
          args.pay_refno,
          args.pay_remark,
          args.pay_suppno,
          args.pay_supplier,
          args.pay_total,
          args.pay_disc,
          args.pay_nettotal,
          args.pay_post,
          args.pay_glcode,
          args.pay_branch,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updatePayment: {
      type: PaymentType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_payment SET pay_no=$2, pay_date=$3, pay_bank=$4, pay_refno=$5, pay_remark=$5, 
                       pay_suppno=$7, pay_supplier=$8, pay_total=$9, pay_disc=$10, pay_nettotal=$11, pay_post=$12, 
                       pay_glcode=$13, pay_branch=$14  WHERE pay_id=$1 RETURNING pay_id`;
        const values = [
          args.pay_id,
          args.pay_no,
          args.pay_date,
          args.pay_bank,
          args.pay_refno,
          args.pay_remark,
          args.pay_suppno,
          args.pay_supplier,
          args.pay_total,
          args.pay_disc,
          args.pay_nettotal,
          args.pay_post,
          args.pay_glcode,
          args.pay_branch,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deletePayment: {
      type: PaymentType,
      args: { pay_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_payment where pay_id=$1 RETURNING pay_id`;
        const values = [args.pay_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addPaymentDetls: {
      type: PaymentDetlsType,
      args: {
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
        payd_branch: { type: GraphQLString },
        payd_paydate: { type: DateScalar },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_payment_detls(payd_no, payd_invno, payd_invdate,payd_pono, 
                       payd_podate, payd_invamt, payd_last_bal, payd_disc, payd_amt, payd_apid, 
                       payd_recdate, payd_branch, payd_paydate) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                       RETURNING payd_no`;
        const values = [
          args.payd_no,
          args.payd_invno,
          args.payd_invdate,
          args.payd_pono,
          args.payd_podate,
          args.payd_invamt,
          args.payd_last_bal,
          args.payd_disc,
          args.payd_amt,
          args.payd_apid,
          args.payd_recdate,
          args.payd_branch,
          args.payd_paydate,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updatePaymentDetls: {
      type: PaymentDetlsType,
      args: {
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
        payd_branch: { type: GraphQLString },
        payd_paydate: { type: DateScalar },
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_payment_detls SET payd_no=$2, payd_invno=$3, payd_invdate=$4, payd_pono=$5, 
                       payd_podate=$6, payd_invamt=$7, payd_last_bal=$8, payd_disc=$9, payd_amt=$10, payd_apid=$11,
                       payd_recdate=$12, payd_branch=$13, payd_paydate=$14 WHERE payd_id=$1 RETURNING payd_id`;
        const values = [
          args.payd_id,
          args.payd_no,
          args.payd_invno,
          args.payd_invdate,
          args.payd_pono,
          args.payd_podate,
          args.payd_invamt,
          args.payd_last_bal,
          args.payd_disc,
          args.payd_amt,
          args.payd_apid,
          args.payd_recdate,
          args.payd_branch,
          args.payd_paydate,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deletePaymentDetls: {
      type: PaymentDetlsType,
      args: { payd_no: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_payment_detls where payd_no=$1 RETURNING payd_no`;
        const values = [args.payd_no];

        return db
          .many(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateDocumentno: {
      type: DocumentNoType,
      args: {
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
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_documentno SET doc_invoice = $2, doc_purchase = $3, doc_despatch = $4 , doc_receipt= $5, 
                       doc_payment = $6, doc_trans = $7, doc_branch=$8, doc_stktake=$9, doc_stkadjust = $10, doc_prefix=$11,
                       doc_abbre=$12 WHERE doc_id=$1 RETURNING doc_id`;
        const values = [
          args.doc_id,
          args.doc_invoice,
          args.doc_purchase,
          args.doc_despatch,
          args.doc_receipt,
          args.doc_payment,
          args.doc_trans,
          args.doc_branch,
          args.doc_stktake,
          args.doc_stkadjust,
          args.doc_prefix,
          args.doc_abbre,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addGroup: {
      type: GroupType,
      args: {
        group_desp: { type: GraphQLString },
        group_category: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_groups(group_desp, group_category) VALUES ($1, $2) RETURNING group_desp`;
        const values = [args.group_desp, args.group_category];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateGroup: {
      type: GroupType,
      args: {
        group_id: { type: GraphQLID },
        group_desp: { type: GraphQLString },
        group_category: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_groups SET group_desp = $2, group_category = $3 WHERE group_id=$1 RETURNING group_id`;
        const values = [args.group_id, args.group_desp, args.group_category];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteGroup: {
      type: GroupType,
      args: { group_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_groups where group_id=$1 RETURNING group_id`;
        const values = [args.group_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addAuditlog: {
      type: AuditlogType,
      args: {
        at_userid: { type: GraphQLString },
        at_user: { type: GraphQLString },
        at_date: { type: DateScalar },
        at_time: { type: GraphQLString },
        at_module: { type: GraphQLString },
        at_record: { type: GraphQLString },
        at_remark: { type: GraphQLString },
        at_timestr: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO dbo_auditlog(at_userid, at_user, at_date, at_time, at_module,at_record, at_remark,at_timestr) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING at_id`;
        const values = [
          args.at_userid,
          args.at_user,
          args.at_date,
          args.at_time,
          args.at_module,
          args.at_record,
          args.at_remark,
          args.at_timestr,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateAuditlog: {
      type: AuditlogType,
      args: {
        at_id: { type: GraphQLID },
        at_userid: { type: GraphQLString },
        at_user: { type: GraphQLString },
        at_date: { type: DateScalar },
        at_time: { type: GraphQLString },
        at_module: { type: GraphQLString },
        at_record: { type: GraphQLString },
        at_remark: { type: GraphQLString },
        at_timestr: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `UPDATE dbo_auditlog SET at_userid = $2, at_user = $3, at_date=$4, at_time=$5, at_module=$6, at_record=$7, at_remark=$8, at_timestr=$9 WHERE at_id=$1 RETURNING at_id`;
        const values = [
          args.at_id,
          args.at_userid,
          args.at_user,
          args.at_date,
          args.at_time,
          args.at_module,
          args.at_record,
          args.at_remark,
          args.at_timestr,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteAuditlog: {
      type: AuditlogType,
      args: { at_id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `DELETE from dbo_auditlog where at_id=$1 RETURNING at_id`;
        const values = [args.at_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
  },
});

exports.mutation = RootMutation;
