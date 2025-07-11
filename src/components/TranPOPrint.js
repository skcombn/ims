import currency from 'currency.js';
import {
  Text,
  View,
  Page,
  Document,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { TiArrowBack } from 'react-icons/ti';
import logo from '../assets/logo.png';
import { Box, Button, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { tranState, trandetlsState } from '../data/atomdata';
import { useSetup } from '../react-query/setup/useSetup';

const borderColor = 'white';
//const borderColor = '#90e5fc';
const tableRowsCount = 13;

const InvoiceHeader = ({ comp, add1, add2, add3 }) => (
  <View style={{ marginTop: 5 }}>
    <View style={{ flexDirection: 'row' }}>
      <Text style={compstyles.compStyle}>{comp}</Text>
    </View>
  </View>
);

const InvoiceTitle = ({ title }) => {
  var rpttitle = '';
  if (title === 'Purchase') {
    rpttitle = 'Purchase Order';
  }
  return (
    <View style={titlestyles.titleContainer}>
      <Text style={titlestyles.reportTitle}>{rpttitle}</Text>
    </View>
  );
};

const BillTo = ({ invoice, pageno, totalpage }) => (
  <View style={headerstyles.colContainer}>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtolabel}>Ship from:</Text>
      <Text style={headerstyles.doclabel}>Purchase No:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_no}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.t_sc}</Text>
      <Text style={headerstyles.doclabel}>Date:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_date}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.t_add1}</Text>
      <Text style={headerstyles.doclabel}>Term:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_term}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.t_add2}</Text>
      <Text style={headerstyles.doclabel}>Our Ref No:</Text>
      <Text style={headerstyles.docfield}>{invoice.t_oref}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.t_add3}</Text>
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
    <Text style={tablestyles.unit}>Unit</Text>
    <Text style={tablestyles.rate}>Cost</Text>
    <Text style={tablestyles.amount}>Amount</Text>
  </View>
);

const InvoiceTableRow = ({ items }) => {
  const rows = items.map((item, index) => (
    <View style={tablerowstyles.row} key={item.tl_id.toString()}>
      <Text
        style={tablerowstyles.itemno}
        break={index % 12 === 0 ? true : false}
      >
        {item.tl_itemno}
      </Text>
      <Text style={tablerowstyles.description}>{item.tl_desp}</Text>
      <Text style={tablerowstyles.packing}>{item.tl_packing}</Text>
      <Text style={tablerowstyles.qty}>{item.tl_qty.toFixed(3)}</Text>
      <Text style={tablerowstyles.unit}>{item.tl_unit}</Text>
      <Text style={tablerowstyles.rate}>
        {currency(item.tl_netucost).format()}
      </Text>
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
      <Text style={tablerowblankstyles.unit}>-</Text>
      <Text style={tablerowblankstyles.store}>-</Text>
      <Text style={tablerowblankstyles.rate}>-</Text>
      <Text style={tablerowblankstyles.amount}>-</Text>
    </View>
  ));
  return <>{rows}</>;
};

const InvoiceTableFooter = ({ total }) => {
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
    </View>
    <View style={footerstyles.lineContainer}>
      <Text style={footerstyles.leftText}>for Digital Dreams</Text>
    </View>
  </View>
);

const TranPOPrint = () => {
  const navigate = useNavigate();
  const { setup } = useSetup();
  const [batch, setBatch] = useRecoilState(tranState);
  const [batchdetls, setBatchdetls] = useRecoilState(trandetlsState);

  const detlsdata = _.chunk(batchdetls, tableRowsCount);
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
      >
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
          </Grid>
        </HStack>
        <PDFViewer
          width="98%"
          height="800"
          style={{ display: 'table', margin: '0 auto' }}
        >
          <Document>
            {detlsdata.length > 0 ? (
              detlsdata.map((x, index) => {
                return (
                  <Page size="A4" style={docstyles.page} key={index}>
                    <Image style={docstyles.logo} src={logo} />
                    <InvoiceHeader
                      comp={comp[0]}
                      add1={add1[0]}
                      add2={add2[0]}
                      add3={add3[0]}
                    />
                    <InvoiceTitle title={batch.t_type} />
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
                <InvoiceTitle title={batch.t_type} />
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
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  logo: {
    width: 100,
    height: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const compstyles = StyleSheet.create({
  compStyle: {
    flexDirection: 'row',
    color: 'black',
    letterSpacing: 4,
    fontSize: 14,
    fontWeight: 'blod',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%',
    //borderWidth: '1px solid black',
    paddingTop: '5',
    paddingBottom: '0',
    fontFamily: 'Helvetica-Bold',
  },
  addressStyle: {
    flexDirection: 'row',
    color: 'black',
    letterSpacing: 4,
    fontSize: 8,
    textAlign: 'center',
    width: '100%',
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
    letterSpacing: 2,
    fontSize: 14,
    fontWeight: 'blod',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '40%',
    paddingTop: '10',
    paddingBottom: '0',
    fontFamily: 'Helvetica-Bold',
  },
  blankfield: {
    width: '65%',
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
  itemno: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  description: {
    width: '35%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  packing: {
    width: '20%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  unit: {
    width: '5%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  rate: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: {
    width: '10%',
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
  itemno: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  description: {
    width: '35%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  packing: {
    width: '20%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  unit: {
    width: '5%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  store: {
    width: '5%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  rate: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: {
    width: '10%',
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
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  description: {
    width: '35%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  packing: {
    width: '20%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  unit: {
    width: '5%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  rate: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: '10%',
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
    marginTop: 60,
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

export default TranPOPrint;
