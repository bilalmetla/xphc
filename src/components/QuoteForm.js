import React, { useState } from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { v4 as uuidv4 } from 'uuid';
import './QuoteForm.css'; // Importing the CSS file

// Define styles for the PDF
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '2px solid lightgreen',
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 50,
  },
  companyDetails: {
    textAlign: 'right',
    fontSize: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'left',
    color: 'darkgreen',
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableCol: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  footer: {
    borderTop: '2px solid lightgreen',
    paddingTop: 10,
    textAlign: 'center',
    marginTop: 20,
  },
});

const QuoteForm = () => {
  const [quoteDetails, setQuoteDetails] = useState({
    clientName: '',
    clientContact: '',
    clientAddress: '',
    quoteNumber: uuidv4(),
    logo: '',
    items: [],
    description: '',
    quantity: '',
    unitPrice: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuoteDetails({ ...quoteDetails, [name]: value });
  };

  const handleAddItem = () => {
    const newItem = {
      description: quoteDetails.description,
      quantity: quoteDetails.quantity ? parseInt(quoteDetails.quantity, 10) : 0,
      unitPrice: quoteDetails.unitPrice ? parseFloat(quoteDetails.unitPrice) : 0,
    };

    setQuoteDetails({
      ...quoteDetails,
      items: [...quoteDetails.items, newItem],
      description: '',
      quantity: '',
      unitPrice: '',
    });
  };

  return (
    <div className="quote-container">
      <h1 className="quote-title">Quote Estimation Form</h1>
      <div className="quote-form">
        <label>
          Client Name:
          <input
            type="text"
            name="clientName"
            value={quoteDetails.clientName}
            onChange={handleInputChange}
            className="quote-input"
          />
        </label>
        <label>
          Client Contact:
          <input
            type="text"
            name="clientContact"
            value={quoteDetails.clientContact}
            onChange={handleInputChange}
            className="quote-input"
          />
        </label>
        <label>
          Client Address:
          <input
            type="text"
            name="clientAddress"
            value={quoteDetails.clientAddress}
            onChange={handleInputChange}
            className="quote-input"
          />
        </label>
        
        <div className="item-form">
          <label>
            Item Description:
            <textarea
              type="text"
              name="description"
              value={quoteDetails.description}
              onChange={handleInputChange}
              className="quote-input"
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={quoteDetails.quantity}
              onChange={handleInputChange}
              className="quote-input"
            />
          </label>
          <label>
            Unit Price (£):
            <input
              type="number"
              step="0.01"
              name="unitPrice"
              value={quoteDetails.unitPrice}
              onChange={handleInputChange}
              className="quote-input"
            />
          </label>
          <button onClick={handleAddItem} className="add-item-button">Add Item</button>
        </div>
      </div>

      <PDFViewer width="100%" height="800" className="pdf-viewer">
        <Document>
          <Page size="A4" style={pdfStyles.page}>
            {/* Header Section */}
            <View style={pdfStyles.header}>
              <Text style={pdfStyles.title}>Quote</Text>
              <View style={pdfStyles.companyDetails}>
                <Text>XP HOUSE CLEANING LTD</Text>
                <Text>3 Hill Court Hanger Lane,</Text>
                <Text>Hanger Lane, London, England, W5 3DF</Text>
                <Text>Email: xphousecleaning@gmail.com</Text>
              </View>
            </View>

            {/* Client Information */}
            <View style={pdfStyles.section}>
               <Text>Client Name: {quoteDetails.clientName}</Text>
              <Text>Client Contact: {quoteDetails.clientContact}</Text>
              <Text>Client Address: {quoteDetails.clientContact} {quoteDetails.clientAddress}</Text>
              <Text>Quote Date: {new Date().toLocaleDateString('en-GB')}</Text>
              <Text>Valid Until: {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}</Text>
              <Text>Quote Number: {quoteDetails.quoteNumber}</Text>
            </View>

            {/* Quote Items Table */}
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                <Text style={pdfStyles.tableCol}>Item Description</Text>
                <Text style={pdfStyles.tableCol}>Quantity</Text>
                <Text style={pdfStyles.tableCol}>Unit Price (£)</Text>
                <Text style={pdfStyles.tableCol}>Total (£)</Text>
              </View>
              {quoteDetails.items.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index}>
                  <Text style={pdfStyles.tableCol}>{item.description}</Text>
                  <Text style={pdfStyles.tableCol}>{item.quantity}</Text>
                  <Text style={pdfStyles.tableCol}>{item.unitPrice.toFixed(2)}</Text>
                  <Text style={pdfStyles.tableCol}>
                    {(item.quantity * item.unitPrice).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Total Section */}
            <View style={pdfStyles.section}>
              <Text>
                Total Amount (£):{' '}
                {quoteDetails.items
                  .reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0
                  )
                  .toFixed(2)}
              </Text>
            </View>

            {/* Footer */}
            {/* <View style={pdfStyles.footer}>
              <Text>Registered Address</Text>
              <Text>XP HOUSE CLEANING LTD, 3 Hill Court Hanger Lane, Hanger Lane, London, England, W5 3DF</Text>
            </View> */}
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default QuoteForm;
