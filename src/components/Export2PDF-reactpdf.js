import React from 'react';
import currency from 'currency.js';
import {
  Canvas,
  Text,
  View,
  Page,
  Document,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { TiArrowBack } from 'react-icons/ti';
import invoice from '../data/invoice';
import logo from '../assets/logo.png';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { useSetup } from '../react-query/setup/useSetup';
import { reportheaderState, reportdetailsState } from '../data/atomdata';

const borderColor = 'white';
const agingborderColor = 'black';
//const borderColor = '#90e5fc';
const tableRowsCount = 16;

const InvoiceHeader = ({ comp, add1, add2, add3 }) => (
  <View style={{ marginTop: 5 }}>
    <View style={{ flexDirection: 'row' }}>
      <Text style={compstyles.compStyle}>{comp}</Text>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <Text style={compstyles.addressStyle}>{add1}</Text>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <Text style={compstyles.addressStyle}>{add2}</Text>
    </View>
    <View style={{ flexDirection: 'row' }}>
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
const BillTo = ({ doc, pageno, totalpage, statementdate }) => (
  <View style={headerstyles.colContainer}>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtolabel}>To: </Text>
      <Text style={headerstyles.doclabel}></Text>
      <Text style={headerstyles.docfield}></Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtolabel}>{doc.ar_cust}</Text>
      <Text style={headerstyles.doclabel}>Cust No:</Text>
      <Text style={headerstyles.docfield}>{doc.ar_custno}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{doc.ar_add1}</Text>
      <Text style={headerstyles.doclabel}>Date:</Text>
      <Text style={headerstyles.docfield}>
        {dayjs(statementdate).format('DD-MMM-YYYY')}
      </Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{doc.ar_add2}</Text>
      <Text style={headerstyles.doclabel}>Area:</Text>
      <Text style={headerstyles.docfield}>{doc.ar_area}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{doc.ar_add3}</Text>
      <Text style={headerstyles.doclabel}>Page No:</Text>
      <Text style={headerstyles.docfield}>
        {pageno} / {totalpage}
      </Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{doc.ar_tel}</Text>
      {/* <Text style={headerstyles.doclabel}>Page No:</Text>
      <Text style={headerstyles.docfield}>
        {pageno} / {totalpage}
      </Text> */}
    </View>
  </View>
);

const TableHeader = ({ headers }) => (
  <View style={tablestyles.container}>
    <Text style={tablestyles.invno}>Invoice No</Text>
    <Text style={tablestyles.date}>Invoice Date</Text>
    <Text style={tablestyles.type}>Doc Type</Text>
    <Text style={tablestyles.amount}>Debit</Text>
    <Text style={tablestyles.amount}>Credit</Text>
    <Text style={tablestyles.balance}>Balance</Text>
  </View>
);

const TableRow = ({ items, totals }) => {
  const { lastbfbal } = totals;
  let sum = lastbfbal;
  let runningbal = [];
  items.forEach(rec => {
    if (rec.ar_doctype !== 'Receipt' && rec.ar_doctype !== 'Credit') {
      sum = sum + rec.ar_total;
    } else {
      sum = sum - rec.ar_total;
    }
    runningbal.push(sum);
  });
  console.log('running total', runningbal);
  const bfrow = (
    <View style={tablerowstyles.row}>
      <Text style={tablerowstyles.invno}>Balance B/F:</Text>
      <Text style={tablerowstyles.date}></Text>
      <Text style={tablerowstyles.type}></Text>
      <Text style={tablerowstyles.debit}></Text>
      <Text style={tablerowstyles.credit}></Text>
      <Text style={tablerowstyles.balance}>{currency(lastbfbal).format()}</Text>
    </View>
  );
  const rows = items.map((item, index) => (
    <View style={tablerowstyles.row} key={index}>
      <Text
        style={tablerowstyles.invno}
        break={index % 16 === 0 ? true : false}
      >
        {item.ar_docno}
      </Text>
      <Text style={tablerowstyles.date}>{item.ar_date}</Text>
      <Text style={tablerowstyles.type}>{item.ar_doctype}</Text>
      <Text style={tablerowstyles.debit}>
        {item.ar_doctype !== 'Receipt' && item.ar_doctype !== 'Credit'
          ? currency(item.ar_total).format()
          : null}
      </Text>
      <Text style={tablerowstyles.credit}>
        {item.ar_doctype === 'Receipt' || item.ar_doctype === 'Credit'
          ? currency(item.ar_total).format()
          : null}
      </Text>
      <Text style={tablerowstyles.balance}>
        {currency(runningbal[index]).format()}
      </Text>
    </View>
  ));
  return (
    <>
      {bfrow}
      {rows}
    </>
  );
};

const TableBlankSpace = ({ rowsCount }) => {
  const blankRows = Array(rowsCount).fill(0);
  const rows = blankRows.map((x, i) => (
    <View style={tablerowblankstyles.row} key={`BR${i}`}>
      <Text style={tablerowblankstyles.itemno}>-</Text>
      <Text style={tablerowblankstyles.description}>-</Text>
      <Text style={tablerowblankstyles.qty}>-</Text>
      <Text style={tablerowblankstyles.rate}>-</Text>
      <Text style={tablerowblankstyles.amount}>-</Text>
    </View>
  ));
  return <>{rows}</>;
};

const TableFooter = ({ totals }) => {
  /*  const total = items
    .map(item => item.ar_balance)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0); */
  return (
    <View style={tablefooterstyles.row}>
      <Text style={tablefooterstyles.description}>TOTAL</Text>
      <Text style={tablefooterstyles.total}>
        {currency(totals.totbal).format()}
      </Text>
    </View>
  );
};

const ItemsTable = ({ headers, items, lastpage }) => (
  <View style={itemsstyles.tableContainer}>
    <TableHeader headers={headers} />
    {/* <InvoiceTableRow items={items} totals={totals} />
    <InvoiceTableBlankSpace rowsCount={tableRowsCount - items.length} />
    {lastpage ? <InvoiceTableFooter totals={totals} /> : null} */}
  </View>
);

const BlankItemsTable = ({ items, total, lastpage, totals }) => (
  <View style={itemsstyles.tableContainer}>
    <TableHeader />
    <TableRow items={items} totals={totals} />
    <TableBlankSpace rowsCount={tableRowsCount - items.length} />
    {lastpage ? <TableFooter totals={totals} /> : null}
  </View>
);

const ThankYouMsg = () => (
  <View style={msgstyles.titleContainer}>
    <Text style={msgstyles.reportTitle}>Thank you for your business</Text>
  </View>
);

const Footer = () => (
  <View>
    {/* <View style={footerstyles.lineContainer}>
      <Text style={footerstyles.leftText}>______________________</Text>
      <Text style={footerstyles.rightText}>_____________________</Text>
    </View> */}
    <View style={footerstyles.titleContainer}>
      <Text style={footerstyles.textLine}>
        This Statement is a copy of your account in our books and show
        transactions only up to the last day of the month.
      </Text>
    </View>
    <View style={footerstyles.textLineContainer}>
      <Text style={footerstyles.textLine}>
        Any subsequent payment will appear in next month's Statement. Unless we
        hear from you to the contrary within seven
      </Text>
    </View>
    <View style={footerstyles.textLineContainer}>
      <Text style={footerstyles.textLine}>
        days, we shall persume that this Statement is correct in all respects.
      </Text>
    </View>
    {/*  <View style={footerstyles.titleContainer}>
      <Text style={footerstyles.leftText}>ISSUED BY</Text>
      <Text style={footerstyles.rightText}>RECEIVED BY</Text>
    </View> */}
  </View>
);

const AgingTable = ({ totals }) => (
  <View style={itemsstyles.tableContainer}>
    <AgingTableHeader />
    <AgingTableRow totals={totals} />
  </View>
);

const AgingTableHeader = () => (
  <View style={agingstyles.container}>
    <Text style={agingstyles.days90}>Over 90 Days</Text>
    <Text style={agingstyles.days60}>61 - 90 Days</Text>
    <Text style={agingstyles.days30}>31 - 60 Days</Text>
    <Text style={agingstyles.current}>Current</Text>
    <Text style={agingstyles.total}>Total Due</Text>
  </View>
);

const AgingTableRow = ({ totals }) => (
  <View style={agingrowstyles.container}>
    <Text style={agingrowstyles.days90}>{currency(totals.bal90).format()}</Text>
    <Text style={agingrowstyles.days60}>{currency(totals.bal60).format()}</Text>
    <Text style={agingrowstyles.days30}>{currency(totals.bal30).format()}</Text>
    <Text style={agingrowstyles.current}>
      {currency(totals.balcurr).format()}
    </Text>
    <Text style={agingrowstyles.total}>{currency(totals.totbal).format()}</Text>
  </View>
);

const Export2PDF = () => {
  const navigate = useNavigate();
  const [batch, setBatch] = useRecoilState(reportheaderState);
  const [batchdetls, setBatchdetls] = useRecoilState(reportdetailsState);
  const { setup } = useSetup();
  const detlsdata = _.chunk(batchdetls, tableRowsCount);

  console.log('reportdetails', batchdetls);
  console.log('reportheader', batch);

  const comp = setup
    .filter(r => r.s_code === 'company')
    .map(rec => {
      return rec.s_value;
    });
  const add1 = setup
    .filter(r => r.s_code === 'address1')
    .map(rec => {
      return rec.s_value;
    });
  const add2 = setup
    .filter(r => r.s_code === 'address2')
    .map(rec => {
      return rec.s_value;
    });
  const add3 = setup
    .filter(r => r.s_code === 'address3')
    .map(rec => {
      return rec.s_value;
    });

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
        <HStack py={2} spacing="3">
          <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
            <GridItem colSpan={1}>
              <Button
                pl={10}
                leftIcon={<TiArrowBack size={30} />}
                onClick={() => navigate(-1)}
                colorScheme="teal"
                variant={'outline'}
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
          style={{ display: 'table', margin: '0 auto' }}
        >
          <Document>
            {/*  <Page size="A4" style={docstyles.page}> 
              <Image style={docstyles.logo} src={logo} />
              <InvoiceTitle title="Statement Of Account" />
              <BillTo
                doc={batch}
                //pageno={index + 1}
                //totalpage={detlsdata.length}
              />

              <InvoiceItemsTable
                items={batchdetls}
                //total={batch.sls_total}
                //lastpage={detlsdata.length - 1 === index}
              />
              <InvoiceThankYouMsg />
               <InvoiceFooter />
            </Page>  */}
            {batchdetls.length > 1 ? (
              detlsdata.map((x, index) => {
                console.log('chunk print', index, detlsdata.length);
                return (
                  <Page size="A4" style={docstyles.page} key={index}>
                    <InvoiceHeader
                      comp={comp[0]}
                      add1={add1[0]}
                      add2={add2[0]}
                      add3={add3[0]}
                    />

                    <ItemsTable
                      headers={batch}
                      items={x}
                      lastpage={detlsdata.length - 1 === index}
                      //totals={editaridstate.totals}
                    />

                    {/*    {detlsdata.length - 1 === index ? (
                      <InvoiceThankYouMsg />
                    ) : null} */}
                  </Page>
                );
              })
            ) : (
              <Page size="A4" style={docstyles.page}>
                <InvoiceHeader
                  comp={comp[0]}
                  add1={add1[0]}
                  add2={add2[0]}
                  add3={add3[0]}
                />
              </Page>
            )}
          </Document>
        </PDFViewer>
      </VStack>
    </Box>
  );
};

const docstyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const compstyles = StyleSheet.create({
  compStyle: {
    //color: '#61dafb',
    flexDirection: 'row',
    color: 'black',
    letterSpacing: 4,
    fontSize: 16,
    fontWeight: 'blod',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%',
    //borderWidth: '1px solid black',
    paddingTop: '10',
    paddingBottom: '0',
    fontFamily: 'Helvetica-Bold',
  },
  addressStyle: {
    //color: '#61dafb',
    flexDirection: 'row',
    color: 'black',
    letterSpacing: 4,
    fontSize: 8,
    //fontWeight: 'blod',
    textAlign: 'center',
    //textTransform: 'uppercase',
    width: '100%',
    //borderWidth: '1px solid black',
    paddingTop: '1',
    paddingBottom: '0',
    fontFamily: 'Helvetica',
  },
});

const titlestyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    //marginRight: 20,

    justifyContent: 'flex-end',
  },
  reportTitle: {
    //color: '#61dafb',
    color: 'black',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: 'blod',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '40%',
    //borderWidth: '1px solid black',
    paddingTop: '10',
    paddingBottom: '0',
    fontFamily: 'Helvetica-Bold',
  },
  blankfield: {
    width: '65%',
  },
});

const docnostyles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: 'row',
    marginTop: 23,
    justifyContent: 'flex-end',
  },
  invoiceDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: 'bold',
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
    fontFamily: 'Helvetica-Oblique',
  },
});

const headerstyles = StyleSheet.create({
  colContainer: {
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  invoiceNoContainer: {
    flexDirection: 'row',
    //marginTop: 26,
    justifyContent: 'flex-end',
  },
  billtolabel: {
    fontWeight: 'blod',
    width: '65%',
  },
  billtofield: {
    width: '65%',
  },
  doclabel: {
    fontWeight: 'blod',
    width: '15%',
  },
  docfield: {
    width: '20%',
  },
});

const itemsstyles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#bff0fd',
  },
});

const tablestyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopColor: 'grey',
    borderTopWidth: 1,
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'grey',
    //backgroundColor: '#bff0fd',
    backgroundColor: 'lightgrey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  invno: {
    width: '30%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  date: {
    width: '25%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  paidamt: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  type: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balance: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

const tablerowstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
  },
  invno: {
    width: '30%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  date: {
    width: '25%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  paidamt: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  type: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balance: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  debit: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  credit: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

const tablerowblankstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
    color: 'white',
  },
  itemno: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  description: {
    width: '45%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: '15%',
  },
});

const tablefooterstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderTopColor: 'grey',
    borderTopWidth: 2,
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    alignItems: 'center',
    height: 24,
    fontSize: 12,
    fontStyle: 'bold',
    paddingTop: 2,
  },
  description: {
    width: '85%',
    textAlign: 'right',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

const agingstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopColor: 'black',
    borderTopWidth: 1,
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'black',
    //backgroundColor: '#bff0fd',
    //backgroundColor: 'lightgrey',
    borderBottomWidth: 1,
    paddingTop: 1,
    alignItems: 'center',
    height: 20,
    textAlign: 'center',
    fontWeight: 'extrabold',
    flexGrow: 1,
    //border: '1px solid black',
    //borderRadius: 3,
  },

  days90: {
    width: '20%',
    borderRightColor: agingborderColor,
    borderRightWidth: 1,
    textAlign: 'center',
    paddingLeft: 0,
  },
  days60: {
    width: '20%',
    borderRightColor: agingborderColor,
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },
  days30: {
    width: '20%',
    borderRightColor: agingborderColor,
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },
  current: {
    width: '20%',
    borderRightColor: agingborderColor,
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },
  total: {
    width: '20%',
    // borderRightColor: agingborderColor,
    // borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },
});

const agingrowstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopColor: 'black',
    borderTopWidth: 1,
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'black',
    //backgroundColor: '#bff0fd',
    //backgroundColor: 'lightgrey',
    borderBottomWidth: 1,
    paddingTop: 1,
    alignItems: 'center',
    height: 20,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    //border: '1px solid black',
    //borderRadius: 3,
  },

  days90: {
    width: '20%',
    borderRightColor: agingborderColor,
    borderRightWidth: 1,
    textAlign: 'center',
    paddingLeft: 0,
  },
  days60: {
    width: '20%',
    borderRightColor: agingborderColor,
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },
  days30: {
    width: '20%',
    borderRightColor: agingborderColor,
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },
  current: {
    width: '20%',
    borderRightColor: agingborderColor,
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },
  total: {
    width: '20%',
    // borderRightColor: agingborderColor,
    // borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },
});

const msgstyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  reportTitle: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

const footerstyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  lineContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  textLineContainer: {
    flexDirection: 'row',
    marginTop: 0,
  },
  line: {
    fontSize: 12,
    textAlign: 'center',
  },
  textLine: {
    fontSize: 11,
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  leftText: {
    fontSize: 12,
    textAlign: 'left',
    textTransform: 'uppercase',
    justifyContent: 'flex-start',
    width: '60%',
  },
  rightText: {
    fontSize: 12,
    textAlign: 'left',
    textTransform: 'uppercase',
    //justifyContent: 'flex-end',
    width: '30%',
  },
});

export default Export2PDF;
