// src/components/InvoicePDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register a custom font
Font.register({
  family: 'Lato',
  src: 'https://fonts.gstatic.com/s/lato/v17/S6uyw4BMUTPHjx4wWw.ttf',
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Lato' },
  header: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 20, padding: 10 },
  companyInfo: { fontSize: 12 },
  invoiceTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  horizontalLine: { borderBottom: '3px solid #90EE90', marginBottom: 20 },
  invoiceInfoContainer: { position: 'absolute', top: 50, right: 0, width:200, height:70, backgroundColor: '#d3d3d3', padding: 10, marginTop: 10 },
  invoiceInfo: { fontSize: 12,  marginLeft: 20 },
  address: { fontSize: 12, marginBottom: 20, marginTop:30, padding: 10 },
  itemsTable: { marginBottom: 20, borderTop: '2px solid #90EE90' },
  itemsTableHeader: { display: 'flex', flexDirection: 'row', borderBottom: '1px solid #000', backgroundColor: '#f5f5f5' },
  itemsTableRow: { display: 'flex', flexDirection: 'row', borderBottom: '1px solid #000' },
  itemsTableHeaderCol: { flex: 1, textAlign: 'left', padding: 5, fontSize:14 },
  itemsTableCol: { flex: 1, textAlign: 'left', padding: 5, fontSize:10 },
  itemsTableHeaderColRight: { flex: 1, textAlign: 'right', padding: 5 },
  itemsTableColRight: { flex: 1, textAlign: 'right', padding: 5, fontSize:10 },
  subtotal: {fontSize:18, textAlign: 'right', marginBottom: 20, marginTop:20, padding: 10, color: '#90EE90' },
  footer: { fontSize: 12, textAlign: 'left', backgroundColor: '#f5f5f5', padding: 10, marginTop:10, },
});

const formatDate = (date) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const InvoicePDF = ({ invoiceDate, invoiceNumber, recipientAddress, items, bankDetails }) => {
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.invoiceTitle}>Invoice</Text>
        <View style={styles.horizontalLine} />
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={{ fontSize:18 }}>XP House Cleaning Service</Text>
            <Text>HA0 3LT</Text>
            <Text>Email: xphousecleaning@gmail.com</Text>
          </View>
          <View style={styles.invoiceInfoContainer}>
            <View style={styles.invoiceInfo}>
              <Text style={{ fontSize:14 }}>Invoice Date: {formatDate(invoiceDate)}</Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={{ fontSize:14 }}>Invoice Number: {invoiceNumber}</Text>
            </View>
          </View>
        </View>
        <View style={styles.address}>
          <Text style={{ fontSize:14 }}>To:</Text>
          <Text>{recipientAddress}</Text>
        </View>
        <View style={styles.itemsTable}>
          <View style={styles.itemsTableHeader}>
            <Text style={styles.itemsTableHeaderCol}>Description</Text>
            <Text style={styles.itemsTableHeaderColRight}>Qty</Text>
            <Text style={styles.itemsTableHeaderColRight}>Unit</Text>
            <Text style={styles.itemsTableHeaderColRight}>Total</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.itemsTableRow}>
              <Text style={styles.itemsTableCol}>{item.description}</Text>
              <Text style={styles.itemsTableColRight}>{item.quantity}</Text>
              <Text style={styles.itemsTableColRight}>£{item.unitPrice}</Text>
              <Text style={styles.itemsTableColRight}>£{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.subtotal}>
          <Text>Total: £{subtotal.toFixed(2)}</Text>
        </View>
        {bankDetails && (
          <View style={styles.footer}>
            <Text>Bank Details:</Text>
            <Text>{bankDetails}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
