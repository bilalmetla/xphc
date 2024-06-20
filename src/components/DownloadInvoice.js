import React, { useState } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoicePDF from './InvoicePDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

const predefinedItems = [
  { label: 'Service A', value: 'Service A', price: 100 },
  { label: 'Service B', value: 'Service B', price: 200 },
  { label: 'Service C', value: 'Service C', price: 300 },
];

function DownloadInvoice() {
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [address, setAddress] = useState('');
  const [items, setItems] = useState([]);
  const [bankDetails, setBankDetails] = useState('');

  const [currentView, setCurrentView] = useState('invoice'); // State to manage current view

  return (
   
        <div>
            <h1>Generate Invoice</h1>
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

export default DownloadInvoice;
