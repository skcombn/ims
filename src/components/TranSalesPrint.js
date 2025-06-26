import React from "react";
import {
  Canvas,
  Text,
  View,
  Page,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import _ from "lodash";
import currency from "currency.js";
import { useNavigate } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import { TiArrowBack } from "react-icons/ti";
import invoice from "../data/invoice";
import logo from "../assets/logo.png";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { tranState, trandetlsState } from "../data/atomdata";
import { useSetup } from "../react-query/setup/useSetup";

const borderColor = "white";
//const borderColor = '#90e5fc';
const tableRowsCount = 14;

const InvoiceHeader = ({ comp, add1, add2, add3 }) => (
  <View style={{ marginTop: 5 }}>
    <View style={{ flexDirection: "row" }}>
      <Text style={compstyles.compStyle}>{comp}</Text>
    </View>
    <View style={{ flexDirection: "row" }}>
      <Text style={compstyles.addressStyle}>{add1}</Text>
    </View>
    <View style={{ flexDirection: "row" }}>
      <Text style={compstyles.addressStyle}>{add2}</Text>
    </View>
    <View style={{ flexDirection: "row" }}>
      <Text style={compstyles.addressStyle}>{add3}</Text>
    </View>
  </View>
);

const InvoiceTitle = ({ title }) => (
  <View style={titlestyles.titleContainer}>
    <Text style={titlestyles.reportTitle}>{title}</Text>
  </View>
);

const InvoiceNo = ({ invoice }) => (
  <>
    <View style={docnostyles.invoiceNoContainer}>
      <Text style={docnostyles.label}>Invoice No:</Text>
      <Text style={docnostyles.invoiceDate}>{invoice.invoice_no}</Text>
    </View>
    <View style={docnostyles.invoiceDateContainer}>
      <Text style={docnostyles.label}>Date: </Text>
      <Text>{invoice.trans_date}</Text>
    </View>
  </>
);
const BillTo = ({ invoice, pageno, totalpage }) => (
  <View style={headerstyles.colContainer}>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtolabel}>Bill To:</Text>
      <Text style={headerstyles.doclabel}>Invoice No:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_no}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.t_sc}</Text>
      <Text style={headerstyles.doclabel}>Invoice Date:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_date}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.t_add1}</Text>
      <Text style={headerstyles.doclabel}>Your Ref No:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_yref}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.t_add2}</Text>
      <Text style={headerstyles.doclabel}>Our Ref No:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_oref}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.t_add3}</Text>
      <Text style={headerstyles.doclabel}>Terms:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_term} days</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>Tel: {invoice.t_tel}</Text>
      <Text style={headerstyles.doclabel}>Page No:</Text>
      <Text style={headerstyles.docfield}>
        {pageno} / {totalpage}
      </Text>
    </View>
    <Text style={headerstyles.billtofield}>{invoice.t_add4}</Text>
  </View>
);

const InvoiceTableHeader = () => (
  <View style={tablestyles.container}>
    <Text style={tablestyles.itemno}>Item No</Text>
    <Text style={tablestyles.description}>Description</Text>
    <Text style={tablestyles.packing}>Packing</Text>
    <Text style={tablestyles.qty}>Qty</Text>
    <Text style={tablestyles.rate}>Price</Text>
    <Text style={tablestyles.unit}>Unit</Text>
    <Text style={tablestyles.amount}>Amount</Text>
  </View>
);

const InvoiceTableRow = ({ items }) => {
  const rows = items.map((item, index) => (
    <View style={tablerowstyles.row} key={item.tl_id.toString()}>
      <Text
        style={tablerowstyles.itemno}
        break={index % 15 === 0 ? true : false}
      >
        {item.tl_itemno}
      </Text>
      <Text style={tablerowstyles.description}>{item.tl_desp}</Text>
      <Text style={tablerowstyles.packing}>{item.tl_packing}</Text>
      <Text style={tablerowstyles.qty}>{item.tl_qty.toFixed(3)}</Text>
      <Text style={tablerowstyles.rate}>
        {currency(item.tl_price).format()}
      </Text>
      <Text style={tablerowstyles.unit}>{item.tl_unit}</Text>
      <Text style={tablerowstyles.amount}>
        {currency(item.tl_amount).format()}
      </Text>
    </View>
  ));
  return <>{rows}</>;
};

const InvoiceTableBlankSpace = ({ rowsCount }) => {
  const blankRows = Array(rowsCount).fill(0);
  const rows = blankRows.map((x, i) => (
    <View style={tablerowblankstyles.row} key={`BR${i}`}>
      <Text style={tablerowblankstyles.itemno}>-</Text>
      <Text style={tablerowblankstyles.description}>-</Text>
      <Text style={tablerowblankstyles.packing}>-</Text>
      <Text style={tablerowblankstyles.qty}>-</Text>
      <Text style={tablerowblankstyles.rate}>-</Text>
      <Text style={tablerowblankstyles.unit}>-</Text>
      <Text style={tablerowblankstyles.amount}>-</Text>
    </View>
  ));
  return <>{rows}</>;
};

const InvoiceTableFooter = ({ total }) => {
  // const total = items
  //   .map(item => item.sld_total)
  //   .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={tablefooterstyles.row}>
      <Text style={tablefooterstyles.description}>TOTAL</Text>
      <Text style={tablefooterstyles.total}>{currency(total).format()}</Text>
    </View>
  );
};

const InvoiceItemsTable = ({ items, total, lastpage }) => (
  <View style={itemsstyles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow items={items} />
    <InvoiceTableBlankSpace rowsCount={tableRowsCount - items.length} />
    {lastpage ? <InvoiceTableFooter total={total} /> : null}
  </View>
);

const InvoiceRemark = () => (
  <>
    <View style={msgstyles.titleContainer}>
      <Text style={msgstyles.reportTitle}>GOODS SOLD ARE NOT RETURNABLE</Text>
    </View>
  </>
);

const InvoiceFooter = () => (
  <View>
    <View style={footerstyles.lineContainer}>
      <Text style={footerstyles.leftText}>
        _________________________________
      </Text>
      <Text style={footerstyles.centerText}>________________</Text>
      <Text style={footerstyles.rightText}>
        ______________________________________
      </Text>
    </View>
    <View style={footerstyles.titleContainer}>
      <Text style={footerstyles.leftText}>
        Authorised Signature and Company Chop
      </Text>
      <Text style={footerstyles.centerText}>Date</Text>
      <Text style={footerstyles.rightText}>for Digital Dreams</Text>
    </View>
  </View>
);

const TranSalesPrint = () => {
  const navigate = useNavigate();
  const { setup } = useSetup();
  const [batch, setBatch] = useRecoilState(tranState);
  const [batchdetls, setBatchdetls] = useRecoilState(trandetlsState);

  const detlsdata = _.chunk(batchdetls, tableRowsCount);
  const comp = setup
    .filter((r) => r.s_code === "company")
    .map((rec) => {
      return rec.s_value;
    });
  const add1 = setup
    .filter((r) => r.s_code === "address1")
    .map((rec) => {
      return rec.s_value;
    });
  const add2 = setup
    .filter((r) => r.s_code === "address2")
    .map((rec) => {
      return rec.s_value;
    });
  const add3 = setup
    .filter((r) => r.s_code === "address3")
    .map((rec) => {
      return rec.s_value;
    });

  return (
    <Box
      h={{ base: "auto", md: "auto" }}
      py={[0, 0, 0]}
      direction={{ base: "column-reverse", md: "row" }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: "auto", md: "full" }}
        h={{ base: "auto", md: "full" }}
        p="2"
        spacing="10"
        //align="left"
        //alignItems="flex-start"
      >
        <HStack py={2} spacing="3">
          <Grid templateColumns={"repeat(12,1fr)"} columnGap={3}>
            <GridItem colSpan={1}>
              <Button
                leftIcon={<TiArrowBack size={30} />}
                onClick={() => navigate(-1)}
                colorScheme="teal"
                variant={"outline"}
                size="lg"
              >
                Back
              </Button>
            </GridItem>
          </Grid>
        </HStack>
        <PDFViewer
          width="98%"
          height="800"
          style={{ display: "table", margin: "0 auto" }}
        >
          <Document>
            {detlsdata.length > 0 ? (
              detlsdata.map((x, index) => {
                //console.log('chunk print', index, detlsdata.length);
                return (
                  <Page size="A4" style={docstyles.page} key={index}>
                    <Image style={docstyles.logo} src={logo} />
                    <InvoiceHeader
                      comp={comp[0]}
                      add1={add1[0]}
                      add2={add2[0]}
                      add3={add3[0]}
                    />
                    <InvoiceTitle
                      title={
                        batch.t_type === "Sales" ? "INVOICE" : batch.t_type
                      }
                    />
                    <BillTo
                      invoice={batch}
                      pageno={index + 1}
                      totalpage={detlsdata.length}
                    />

                    <InvoiceItemsTable
                      items={x}
                      total={batch.t_nettotal}
                      lastpage={detlsdata.length - 1 === index}
                    />

                    {detlsdata.length - 1 === index ? <InvoiceRemark /> : null}
                    {detlsdata.length - 1 === index ? <InvoiceFooter /> : null}
                  </Page>
                );
              })
            ) : (
              <Page size="A4" style={docstyles.page}>
                <Image style={docstyles.logo} src={logo} />
                <InvoiceHeader
                  comp={comp[0]}
                  add1={add1[0]}
                  add2={add2[0]}
                  add3={add3[0]}
                />
                <InvoiceTitle
                  title={batch.t_type === "Sales" ? "INVOICE" : batch.t_type}
                />
                <BillTo
                  invoice={batch}
                  pageno={1}
                  totalpage={detlsdata.length}
                />

                <InvoiceItemsTable
                  items={[]}
                  total={batch.t_nettotal}
                  lastpage={1}
                />

                {detlsdata.length - 1 === 1 ? <InvoiceRemark /> : null}
                {detlsdata.length - 1 === 1 ? <InvoiceFooter /> : null}
              </Page>
            )}
            )
          </Document>
        </PDFViewer>
      </VStack>
    </Box>
  );
};

const docstyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: "auto",
    marginRight: "auto",
  },
});

const compstyles = StyleSheet.create({
  compStyle: {
    //color: '#61dafb',
    flexDirection: "row",
    color: "black",
    letterSpacing: 4,
    fontSize: 16,
    fontWeight: "blod",
    textAlign: "center",
    textTransform: "uppercase",
    width: "100%",
    //borderWidth: '1px solid black',
    paddingTop: "10",
    paddingBottom: "0",
    fontFamily: "Helvetica-Bold",
  },
  addressStyle: {
    //color: '#61dafb',
    flexDirection: "row",
    color: "black",
    letterSpacing: 4,
    fontSize: 8,
    //fontWeight: 'blod',
    textAlign: "center",
    //textTransform: 'uppercase',
    width: "100%",
    //borderWidth: '1px solid black',
    paddingTop: "1",
    paddingBottom: "0",
    fontFamily: "Helvetica",
  },
});

const titlestyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 10,
    //marginRight: 20,

    justifyContent: "flex-end",
  },

  reportTitle: {
    //color: '#61dafb',
    color: "black",
    letterSpacing: 4,
    fontSize: 25,
    fontWeight: "blod",
    textAlign: "center",
    textTransform: "uppercase",
    width: "40%",
    //borderWidth: '1px solid black',
    paddingTop: "10",
    paddingBottom: "0",
    fontFamily: "Helvetica-Bold",
  },
  blankfield: {
    width: "65%",
  },
});

const docnostyles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: "row",
    marginTop: 23,
    justifyContent: "flex-end",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 60,
  },
});

const billtostyles = StyleSheet.create({
  headerContainer: {
    marginTop: 36,
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
});

const headerstyles = StyleSheet.create({
  colContainer: {
    marginTop: 5,
  },
  rowContainer: {
    flexDirection: "row",
  },
  invoiceNoContainer: {
    flexDirection: "row",
    //marginTop: 26,
    justifyContent: "flex-end",
  },
  billtolabel: {
    fontWeight: "blod",
    width: "65%",
  },
  billtofield: {
    width: "65%",
  },
  doclabel: {
    fontWeight: "blod",
    width: "15%",
  },
  docfield: {
    width: "20%",
  },
});

const itemsstyles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#bff0fd",
  },
});

const tablestyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopColor: "grey",
    borderTopWidth: 1,
    //borderBottomColor: '#bff0fd',
    borderBottomColor: "grey",
    //backgroundColor: '#bff0fd',
    backgroundColor: "lightgrey",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontStyle: "bold",
    fontSize: "10",
    flexGrow: 1,
  },
  itemno: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
  },
  description: {
    width: "33%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
  },
  packing: {
    width: "19%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  rate: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  unit: {
    width: "8%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },

  amount: {
    width: "10%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const tablerowstyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    //borderBottomColor: '#bff0fd',
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  itemno: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
  },
  description: {
    width: "33%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    flexWrap: true,
  },
  packing: {
    width: "19%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  rate: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  unit: {
    width: "8%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },

  amount: {
    width: "10%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const tablerowblankstyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    //borderBottomColor: '#bff0fd',
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
    color: "white",
  },
  itemno: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  description: {
    width: "33%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  packing: {
    width: "19%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  unit: {
    width: "8%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },

  amount: {
    width: "10%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const tablefooterstyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderTopColor: "grey",
    borderTopWidth: 2,
    //borderBottomColor: '#bff0fd',
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    alignItems: "center",
    height: 24,
    fontSize: 12,
    fontStyle: "bold",
    paddingTop: 2,
  },
  description: {
    width: "85%",
    textAlign: "right",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const msgstyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 1,
  },
  reportTitle: {
    fontSize: 10,
    textAlign: "left",
    textTransform: "uppercase",
  },
});

const footerstyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  lineContainer: {
    flexDirection: "row",
    marginTop: 60,
  },
  line: {
    fontSize: 10,
    textAlign: "center",
  },
  leftText: {
    fontSize: 10,
    textAlign: "left",
    //textTransform: 'uppercase',
    justifyContent: "flex-start",
    width: "35%",
  },
  centerText: {
    fontSize: 10,
    textAlign: "center",
    //textTransform: 'uppercase',
    justifyContent: "flex-start",
    width: "25%",
  },
  rightText: {
    fontSize: 10,
    textAlign: "left",
    //textTransform: 'uppercase',
    //justifyContent: 'flex-end',
    width: "40%",
  },
  blankText: {
    fontSize: 10,
    textAlign: "left",
    //textTransform: 'uppercase',
    //justifyContent: 'flex-end',
    width: "10%",
  },
});

export default TranSalesPrint;
