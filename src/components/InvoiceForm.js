import React, { useState, useEffect } from 'react';

const InvoiceForm = ({
  invoiceDate,
  setInvoiceDate,
  invoiceNumber,
  setInvoiceNumber,
  recipientAddress,
  setRecipientAddress,
  address,
  setAddress,
  items,
  setItems,
  bankDetails,
  setBankDetails,
  clearForm,
}) => {
  const [currentItem, setCurrentItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0,
  });

  const [showBankDetails, setShowBankDetails] = useState(false);

  const [nextInvoiceNumber, setNextInvoiceNumber] = useState(0); // State to track the next invoice number

  const styles = {
    itemDetailsLabel: { fontSize: 12 },
  };

  // Load the invoice number from localStorage on component mount
  useEffect(() => {
    const savedInvoiceNumber = parseInt(localStorage.getItem('invoiceNumber'));
    if (savedInvoiceNumber) {
      setNextInvoiceNumber(savedInvoiceNumber + 1);
      setInvoiceNumber(savedInvoiceNumber + 1);
    } else {
      setInvoiceNumber(0);
    }
  }, [setInvoiceNumber]);

  // Handle clearing the form
  const handleClearForm = () => {
    setCurrentItem({ description: '', quantity: 1, unitPrice: 0, total: 0 });
    setItems([]);
    setInvoiceDate('');
    setInvoiceNumber(nextInvoiceNumber); // Reset invoice number to the next available
    setRecipientAddress('');
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleBankDetailsChange = (e) => {
    setBankDetails(e.target.value);
  };

  const addItem = () => {
    if (currentItem.description && currentItem.unitPrice) {
      const newItem = {
        ...currentItem,
        total: currentItem.quantity * currentItem.unitPrice,
      };
      setItems([...items, newItem]);
      setCurrentItem({ description: '', quantity: 1, unitPrice: 0, total: 0 });
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const editItem = (index) => {
    const item = items[index];
    removeItem(index);
    setCurrentItem(item);
  };

  return (
    <div className="invoice-form-container">
      <div className="invoice-form">
        <div className="form-section">
          <label>Invoice Date:</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => {
              setInvoiceDate(e.target.value);
            }}
          />
        </div>
        <div className="form-section">
          <label>Invoice Number:</label>
          <input
            type="number"
            value={invoiceNumber}
            onChange={(e) => {
              setInvoiceNumber(e.target.value);
              setNextInvoiceNumber(parseInt(e.target.value) + 1);
            }}
          />
        </div>
        <div className="form-section">
          <label>To:</label>
          <textarea
            rows="6"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Item Details:</label>
        </div>

        <div className="item-details-section">
          <label style={styles.itemDetailsLabel}>Description:</label>
          <textarea
            rows="6"
            name="description"
            placeholder="Description"
            value={currentItem.description}
            onChange={handleItemChange}
          />

          <label style={styles.itemDetailsLabel}>Quantity:</label>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={currentItem.quantity}
            onChange={handleItemChange}
          />

          <label style={styles.itemDetailsLabel}>Unit Price:</label>
          <input
            type="number"
            name="unitPrice"
            placeholder="Unit Price"
            value={currentItem.unitPrice}
            onChange={handleItemChange}
          />
          <button onClick={addItem} style={{ marginLeft: '0.5rem', padding: '0.3rem 0.5rem', float:'right' }}>Add Item</button>
        </div>
        <div className="item-details-section">
          <h2>Items:</h2>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.description}: Qty {item.quantity}, Unit £{item.unitPrice}, Total £{item.total.toFixed(2)}
                <button style={{ marginLeft: '0.5rem', padding: '0.3rem 0.5rem' }} onClick={() => editItem(index)}>Edit</button>
                <button style={{ marginLeft: '0.5rem', padding: '0.3rem 0.5rem' }} onClick={() => removeItem(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={showBankDetails}
              onChange={() => {
                setBankDetails(`
                  Name: XP HOUSE CLEANING LTD
                  Account number: 76167761
                  Sort code: 04-00-03
                `);
                setShowBankDetails(!showBankDetails);
              }}
              style={{ transform: 'scale(2.5)', marginLeft: '0' }}
            />
            Show Bank Details
          </label>

          {showBankDetails && (
            <textarea
              rows="5"
              value={bankDetails}
              onChange={handleBankDetailsChange}
            />
          )}
        </div>
        
          <button style={{ padding: '0.5rem 1rem', float:'right' }} onClick={handleClearForm}>Reset Invoice</button>
        
      </div>
    </div>
  );
};

export default InvoiceForm;

