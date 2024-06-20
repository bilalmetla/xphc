// src/App.js
import React, { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePDF from './components/InvoicePDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

import './App.css';  // Import App.css here


const predefinedItems = [
  { label: 'Service A', value: 'Service A', price: 100 },
  { label: 'Service B', value: 'Service B', price: 200 },
  { label: 'Service C', value: 'Service C', price: 300 },
];

function App() {
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [address, setAddress] = useState('');
  const [items, setItems] = useState([]);
  const [bankDetails, setBankDetails] = useState('');



  return (
    <div className="App">
      <h1>Invoice Generator</h1>
      <InvoiceForm
        invoiceDate={invoiceDate}
        setInvoiceDate={setInvoiceDate}
        invoiceNumber={invoiceNumber}
        setInvoiceNumber={setInvoiceNumber}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
        address={address}
        setAddress={setAddress}
        items={items}
        setItems={setItems}
        predefinedItems={predefinedItems}
        bankDetails={bankDetails}
        setBankDetails={setBankDetails}
        // clearForm={clearForm}
      />
      <PDFDownloadLink
        document={<InvoicePDF
          invoiceDate={invoiceDate}
          invoiceNumber={invoiceNumber}
          recipientAddress={recipientAddress}
          address={address}
          items={items}
          bankDetails={bankDetails}
        />}
        fileName={`${invoiceNumber}_invoice.pdf`}
        onClick={() => {
           // Update invoice number in localStorage and state
          localStorage.setItem('invoiceNumber', parseInt(invoiceNumber));
          
        }}
        className="download-link"
      >
        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
        
      </PDFDownloadLink>
    </div>
  );
}

export default App;
