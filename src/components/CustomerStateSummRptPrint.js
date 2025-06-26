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
  PDFViewer,
} from '@react-pdf/renderer';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
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
import { RptState, RptDetlsState, editRptIdState } from '../data/atomdata';

const borderColor = 'white';
const agingborderColor = 'black';
//const borderColor = '#90e5fc';
const tableRowsCount = 16;

export const Header = ({ comp, add1, add2, add3 }) => (
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

export const Title = ({ title }) => (
  <View style={titlestyles.titleContainer}>
    <Text style={titlestyles.reportTitle}>{title}</Text>
  </View>
);

export const BillTo = ({ pageno, totalpage }) => (
  <View style={headerstyles.colContainer}>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}></Text>
      <Text style={headerstyles.doclabel}>Page No:</Text>
      <Text style={headerstyles.docfield}>
        {pageno} / {totalpage}
      </Text>
    </View>
  </View>
);

export const TableHeader = () => (
  <View style={tablestyles.container}>
    <Text style={tablestyles.custno}>Cust No</Text>
    <Text style={tablestyles.cust}>Customer</Text>
    <Text style={tablestyles.balbf}>B/F Balance</Text>
    <Text style={tablestyles.balcur}>Current</Text>
    <Text style={tablestyles.bal30}>31 to 60 Days</Text>
    <Text style={tablestyles.bal60}>61 to 90 Days</Text>
    <Text style={tablestyles.bal90}>Over 90 Days</Text>
    <Text style={tablestyles.baltot}>Total Balance</Text>
    <Text style={tablestyles.balytd}>YTD Sales</Text>
  </View>
);

export const TableRow = ({ items, totals }) => {
  const rows = items.map((item, index) => (
    <View style={tablerowstyles.row} key={index}>
      <Text
        style={tablerowstyles.custno}
        break={index % 16 === 0 ? true : false}
      >
        {item.c_custno}
      </Text>
      <Text style={tablerowstyles.cust}>{item.c_cust}</Text>
      <Text style={tablerowstyles.balbf}>
        {currency(item.c_bfbal).format()}
      </Text>
      <Text style={tablerowstyles.balcur}>
        {currency(item.c_balcur).format()}
      </Text>
      <Text style={tablerowstyles.bal30}>
        {currency(item.c_bal30).format()}
      </Text>
      <Text style={tablerowstyles.bal60}>
        {currency(item.c_bal60).format()}
      </Text>
      <Text style={tablerowstyles.bal90}>
        {currency(item.c_bal90).format()}
      </Text>
      <Text style={tablerowstyles.baltot}>
        {currency(item.c_totbal).format()}
      </Text>
      <Text style={tablerowstyles.balytd}>
        {currency(item.c_totsales).format()}
      </Text>
    </View>
  ));
  return <>{rows}</>;
};

const TableBlankSpace = ({ rowsCount }) => {
  const blankRows = Array(rowsCount).fill(0);
  const rows = blankRows.map((x, i) => (
    <View style={tablerowblankstyles.row} key={`BR${i}`}>
      <Text style={tablerowblankstyles.custno}></Text>
      <Text style={tablerowblankstyles.cust}></Text>
      <Text style={tablerowblankstyles.balbf}></Text>
      <Text style={tablerowblankstyles.balcur}></Text>
      <Text style={tablerowblankstyles.bal30}></Text>
      <Text style={tablerowblankstyles.bal60}></Text>
      <Text style={tablerowblankstyles.bal90}></Text>
      <Text style={tablerowblankstyles.baltot}></Text>
      <Text style={tablerowblankstyles.balytd}></Text>
    </View>
  ));
  return <>{rows}</>;
};

const TableFooter = ({ totals, baltotals }) => {
  /*  const total = items
    .map(item => item.ar_balance)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0); */
  return (
    <View style={tablefooterstyles.row}>
      <Text style={tablefooterstyles.custno}></Text>
      <Text style={tablefooterstyles.cust}>TOTAL</Text>
      <Text style={tablefooterstyles.balbf}></Text>
      <Text style={tablefooterstyles.balcur}></Text>
      <Text style={tablefooterstyles.bal30}></Text>
      <Text style={tablefooterstyles.bal60}></Text>
      <Text style={tablefooterstyles.bal90}></Text>
      <Text style={tablefooterstyles.baltot}>
        {currency(baltotals).format()}
      </Text>
      <Text style={tablefooterstyles.balytd}>{currency(totals).format()}</Text>
    </View>
  );
};

const ItemsTable = ({ items, lastpage, totals, baltotals }) => (
  <View style={itemsstyles.tableContainer}>
    <TableHeader />
    <TableRow items={items} totals={totals} />
    {/* <TableBlankSpace rowsCount={tableRowsCount - items.length} /> */}
    {lastpage ? <TableFooter totals={totals} baltotals={baltotals} /> : null}
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

const Footer = () => (
  <View>
    <Text style={tablefooterstyles.description}>Page </Text>
  </View>
);

const CustomerStateSummRptPrint = () => {
  const navigate = useNavigate();
  const [batch, setBatch] = useRecoilState(RptState);
  const [editaridstate, setARIdState] = useRecoilState(editRptIdState);
  const { setup } = useSetup();
  const detlsdata = _.chunk(batch, tableRowsCount);

  console.log('totals', editaridstate);

  const title = `Customers Statement Aging Summary Listing as at ${dayjs(
    editaridstate.todate
  ).format('DD-MM-YYYY')}`;
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

  const MyDocument = () => (
    <Document>
      {detlsdata.map((x, index) => {
        //console.log('chunk print', index, detlsdata.length);
        return (
          <Page
            size="A4"
            orientation="landscape"
            style={docstyles.page}
            key={index}
          >
            {/* <Image style={docstyles.logo} src={logo} /> */}
            <Header
              comp={comp[0]}
              add1={add1[0]}
              add2={add2[0]}
              add3={add3[0]}
            />
            <Title title={title} />
            <BillTo pageno={index + 1} totalpage={detlsdata.length} />
            <ItemsTable
              items={x}
              totals={editaridstate.totals}
              baltotals={editaridstate.baltotals}
              lastpage={detlsdata.length - 1 === index}
            />

            {/* {detlsdata.length - 1 === index ? <InvoiceThankYouMsg /> : null} */}
            {/* {detlsdata.length - 1 === index ? <Footer /> : null}  */}
          </Page>
        );
      })}
    </Document>
  );

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
          <MyDocument />
        </PDFViewer>
      </VStack>
    </Box>
  );
};

const docstyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
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

    justifyContent: 'center',
  },
  reportTitle: {
    //color: '#61dafb',
    color: 'black',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: 'blod',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '90%',
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
    width: '80%',
  },
  doclabel: {
    fontWeight: 'blod',
    width: '15%',
  },
  docfield: {
    width: '10%',
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
  custno: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  cust: {
    width: '30%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  balbf: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balcur: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal30: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal60: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal90: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  baltot: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balytd: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
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
  custno: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  cust: {
    width: '30%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  balbf: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balcur: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal30: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal60: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal90: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  baltot: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balytd: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
});

const tablerowblankstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    //borderBottomColor: '#bff0fd',
    //borderBottomColor: 'grey',
    //borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
    color: 'white',
  },
  custno: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  cust: {
    width: '30%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  balbf: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balcur: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal30: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal60: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal90: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  baltot: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balytd: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
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
    fontSize: 10,
    fontStyle: 'bold',
    paddingTop: 2,
  },
  custno: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  cust: {
    width: '30%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  balbf: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balcur: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal30: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal60: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  bal90: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  baltot: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  balytd: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  /*  description: {
    width: '40%',
    textAlign: 'right',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  baltotal: {
    width: '50%',
    textAlign: 'right',
    paddingRight: 8,
  },
  total: {
    width: '10%',
    textAlign: 'right',
    paddingRight: 8,
  }, */
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
  pageText: {
    fontSize: 12,
    textAlign: 'right',
    //textTransform: 'uppercase',
    //justifyContent: 'flex-end',
    width: '70%',
  },
});

export default CustomerStateSummRptPrint;
