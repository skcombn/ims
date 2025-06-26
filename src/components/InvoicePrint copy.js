import React from 'react';
import {
  Text,
  View,
  Page,
  Document,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import invoice from '../data/invoice'
import logo from '../assets/logo.png'

const borderColor = '#90e5fc';
const tableRowsCount = 11;

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
const BillTo = ({ invoice }) => (
  <View style={billtostyles.headerContainer}>
    <Text style={billtostyles.billTo}>Bill To:</Text>
    <Text>{invoice.company}</Text>
    <Text>{invoice.address}</Text>
    <Text>{invoice.phone}</Text>
    <Text>{invoice.email}</Text>
  </View>
);

const InvoiceTableHeader = () => (
  <View style={tablestyles.container}>
    <Text style={tablestyles.description}>Item Description</Text>
    <Text style={tablestyles.qty}>Qty</Text>
    <Text style={tablestyles.rate}>@</Text>
    <Text style={tablestyles.amount}>Amount</Text>
  </View>
);

const InvoiceTableRow = ({ items }) => {
  const rows = items.map(item => (
    <View style={tablerowstyles.row} key={item.sno.toString()}>
      <Text style={tablerowstyles.description}>{item.desc}</Text>
      <Text style={tablerowstyles.qty}>{item.qty}</Text>
      <Text style={tablerowstyles.rate}>{item.rate}</Text>
      <Text style={tablerowstyles.amount}>{(item.qty * item.rate).toFixed(2)}</Text>
    </View>
  ));
  return <>{rows}</>;
};

const InvoiceTableBlankSpace = ({ rowsCount }) => {
  const blankRows = Array(rowsCount).fill(0);
  const rows = blankRows.map((x, i) => (
    <View style={tablerowblankstyles.row} key={`BR${i}`}>
      <Text style={tablerowblankstyles.description}>-</Text>
      <Text style={tablerowblankstyles.qty}>-</Text>
      <Text style={tablerowblankstyles.rate}>-</Text>
      <Text style={tablerowblankstyles.amount}>-</Text>
    </View>
  ));
  return <>{rows}</>;
};



const InvoiceTableFooter = ({ items }) => {
  const total = items
    .map(item => item.qty * item.rate)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={tablefooterstyles.row}>
      <Text style={tablefooterstyles.description}>TOTAL</Text>
      <Text style={tablefooterstyles.total}>
        {Number.parseFloat(total).toFixed(2)}
      </Text>
    </View>
  );
};

const InvoiceItemsTable = ({ invoice }) => (
  <View style={itemsstyles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow items={invoice.items} />
    <InvoiceTableBlankSpace rowsCount={tableRowsCount - invoice.items.length} />
    <InvoiceTableFooter items={invoice.items} />
  </View>
);

const InvoiceThankYouMsg = () => (
  <View style={msgstyles.titleContainer}>
    <Text style={msgstyles.reportTitle}>Thank you for your business</Text>
  </View>
);
  

// Create Document Component
const InvoicePrint = () => (
  <PDFViewer
    width="1000"
    height="800"
    style={{ display: 'table', margin: '0 auto' }}
  >
    <Document>
      <Page size="A4" style={docstyles.page}>
        <Image style={docstyles.logo} src={logo} />
        <InvoiceTitle title="Invoice" />
        <InvoiceNo invoice={invoice} />
        <BillTo invoice={invoice} />
        <InvoiceItemsTable invoice={invoice} />
        <InvoiceThankYouMsg />
      </Page>
    </Document>
  </PDFViewer>
);

const docstyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
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
const titlestyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  reportTitle: {
    color: '#61dafb',
    letterSpacing: 4,
    fontSize: 25,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

const docnostyles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: 'row',
    marginTop: 36,
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
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  description: {
    width: '60%',
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

const tablerowstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
  },
  description: {
    width: '60%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  rate: {
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

const tablerowblankstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
    color: 'white',
  },
  description: {
    width: '60%',
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
    borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontSize: 12,
    fontStyle: 'bold',
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



export default InvoicePrint;
