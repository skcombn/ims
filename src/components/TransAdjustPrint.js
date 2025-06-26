import React from "react";
import currency from "currency.js";
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
import { tranadjustState, tranadjustdetlsState } from "../data/atomdata";
import { useSetup } from "../react-query/setup/useSetup";

const borderColor = "white";
//const borderColor = '#90e5fc';
const tableRowsCount = 22;

const InvoiceHeader = ({ comp, add1, add2, add3 }) => (
  <View style={{ marginTop: 5 }}>
    <View style={{ flexDirection: "row" }}>
      <Text style={compstyles.compStyle}>{comp}</Text>
    </View>
    {/*  <View style={{ flexDirection: "row" }}>
      <Text style={compstyles.addressStyle}>{add1}</Text>
    </View> */}
    {/*  <View style={{ flexDirection: "row" }}>
      <Text style={compstyles.addressStyle}>{add2}</Text>
    </View> */}
    {/*  <View style={{ flexDirection: "row" }}>
      <Text style={compstyles.addressStyle}>{add3}</Text>
    </View> */}
  </View>
);

const InvoiceTitle = ({ title }) => (
  <View style={titlestyles.titleContainer}>
    <Text style={titlestyles.reportTitle}>{title}</Text>
  </View>
);
const BillTo = ({ invoice, pageno, totalpage }) => (
  <View style={headerstyles.colContainer}>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtolabel}></Text>
      <Text style={headerstyles.doclabel}>Batch No:</Text>
      <Text style={headerstyles.docfield}>{invoice.ta_batchno}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}></Text>
      <Text style={headerstyles.doclabel}>Batch Date:</Text>
      <Text style={headerstyles.docfield}>{invoice.ta_date}</Text>
    </View>

    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}></Text>
      <Text style={headerstyles.doclabel}>Page No:</Text>
      <Text style={headerstyles.docfield}>
        {pageno} / {totalpage}
      </Text>
    </View>
    <Text style={headerstyles.billtofield}></Text>
  </View>
);

const InvoiceTableHeader = () => (
  <View style={tablestyles.container}>
    <Text style={tablestyles.itemno}>Item No</Text>
    <Text style={tablestyles.description}>Description</Text>
    <Text style={tablestyles.packing}>Packing</Text>
    <Text style={tablestyles.qtyonhand}>Onhand</Text>
    <Text style={tablestyles.qtycount}>Count</Text>
    <Text style={tablestyles.qtyadjust}>Adjust</Text>
    <Text style={tablestyles.unit}>Unit</Text>
    <Text style={tablestyles.remark}>Remark</Text>
  </View>
);

const InvoiceTableRow = ({ items }) => {
  const rows = items.map((item, index) => (
    <View style={tablerowstyles.row} key={item.tad_id.toString()}>
      <Text
        style={tablerowstyles.itemno}
        break={index % 12 === 0 ? true : false}
      >
        {item.tad_itemno}
      </Text>
      <Text style={tablerowstyles.description}>{item.tad_desp}</Text>
      <Text style={tablerowstyles.packing}>{item.tad_packing}</Text>
      <Text style={tablerowstyles.qtyonhand}>
        {item.tad_qtyonhand.toFixed(3)}
      </Text>
      <Text style={tablerowstyles.qtycount}>
        {item.tad_qtycount.toFixed(3)}
      </Text>
      <Text style={tablerowstyles.qtyadjust}>
        {item.tad_qtyadjust.toFixed(3)}
      </Text>
      <Text style={tablerowstyles.unit}>{item.tad_unit}</Text>
      <Text style={tablerowstyles.remark}>{item.tad_remark}</Text>
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
      <Text style={tablerowblankstyles.qtyonhand}>-</Text>
      <Text style={tablerowblankstyles.qtycount}>-</Text>
      <Text style={tablerowblankstyles.qtyadjust}>-</Text>
      <Text style={tablerowblankstyles.unit}>-</Text>
      <Text style={tablerowblankstyles.remark}>-</Text>
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
    {/* {lastpage ? <InvoiceTableFooter total={total} /> : null} */}
  </View>
);

const InvoiceThankYouMsg = () => (
  <View style={msgstyles.titleContainer}>
    <Text style={msgstyles.reportTitle}>Thank you for your business</Text>
  </View>
);

const InvoiceFooter = () => (
  <View style={{ marginTop: 15 }}>
    <View style={footerstyles.lineContainer}>
      <Text style={footerstyles.leftText}>Issued and Approved By</Text>
    </View>
    <View style={footerstyles.titleContainer}>
      <Text style={footerstyles.leftText}>
        ______________________________________
      </Text>
      {/*   <Text style={footerstyles.centerText}></Text>
       <Text style={footerstyles.rightText}>
         ______________________________________
       </Text> */}
    </View>
    <View style={footerstyles.lineContainer}>
      <Text style={footerstyles.leftText}>for Digital Dreams</Text>
      {/*  <Text style={footerstyles.centerText}></Text>
       <Text style={footerstyles.rightText}>
         for PERNIAGAAN SINAR BAHAGIA SDN BHD
       </Text> */}
    </View>
  </View>
);

const TransAdjustPrint = () => {
  const navigate = useNavigate();
  const { setup } = useSetup();
  const [batch, setBatch] = useRecoilState(tranadjustState);
  const [batchdetls, setBatchdetls] = useRecoilState(tranadjustdetlsState);

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

  console.log("batch po print", batch);
  console.log("batchdetls po print", batchdetls);
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
                //console.log("chunk print", index, detlsdata.length);
                return (
                  <Page size="A4" style={docstyles.page} key={index}>
                    <Image style={docstyles.logo} src={logo} />
                    <InvoiceHeader
                      comp={comp[0]}
                      add1={add1[0]}
                      add2={add2[0]}
                      add3={add3[0]}
                    />
                    <InvoiceTitle title="Items Adjustments" />
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

                    {/* {detlsdata.length - 1 === index ? <InvoiceFooter /> : null} */}
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
                <InvoiceTitle title={batch.t_type} />
                {/*   <BillTo
                   invoice={batch}
                   pageno={1}
                   totalpage={detlsdata.length}
                 /> */}

                <InvoiceItemsTable
                  items={[]}
                  total={batch.t_nettotal}
                  lastpage={1}
                />

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
    width: 100,
    height: 80,
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
    fontSize: 14,
    fontWeight: "blod",
    textAlign: "center",
    textTransform: "uppercase",
    width: "100%",
    //borderWidth: '1px solid black',
    paddingTop: "5",
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
    marginTop: 20,
    //marginRight: 20,
    justifyContent: "flex-end",
  },
  reportTitle: {
    //color: '#61dafb',
    color: "black",
    letterSpacing: 2,
    fontSize: 14,
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
    marginTop: 10,
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
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
  },
  packing: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
  },
  qtyonhand: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  qtycount: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  qtyadjust: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  unit: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  remark: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
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
    width: "25%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  packing: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
  },
  qtyonhand: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  qtycount: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  qtyadjust: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  unit: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  remark: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
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
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  packing: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
  },
  qtyonhand: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qtycount: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qtyadjust: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  unit: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  remark: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
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
    marginTop: 12,
  },
  reportTitle: {
    fontSize: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

const footerstyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 60,
  },
  lineContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  textLineContainer: {
    flexDirection: "row",
    marginTop: 0,
  },
  line: {
    fontSize: 12,
    textAlign: "center",
  },
  textLine: {
    fontSize: 11,
    textAlign: "left",
    justifyContent: "flex-start",
  },
  leftText: {
    fontSize: 12,
    textAlign: "left",
    textTransform: "uppercase",
    justifyContent: "flex-start",
    width: "60%",
  },
  rightText: {
    fontSize: 12,
    textAlign: "left",
    textTransform: "uppercase",
    //justifyContent: 'flex-end',
    width: "30%",
  },
});

export default TransAdjustPrint;
