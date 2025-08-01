import React, { useState } from 'react';
import { 
  IoCardOutline,
  IoWalletOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoAddOutline
} from 'react-icons/io5';
import './Payments.css';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('history');

  const paymentMethods = [
    { id: 1, type: 'UPI', number: 'rajesh.kumar@paytm', isDefault: true },
    { id: 2, type: 'Bank Account', number: 'XXXX XXXX 1234', isDefault: false },
  ];

  const paymentHistory = [
    { 
      id: 1, 
      amount: 2500, 
      description: 'Worker Payment - Farm Labor Job', 
      date: '2024-01-08', 
      status: 'Pending',
      type: 'Outgoing'
    },
    { 
      id: 2, 
      amount: 1800, 
      description: 'Worker Payment - Construction Helper', 
      date: '2024-01-05', 
      status: 'Completed',
      type: 'Outgoing'
    },
    { 
      id: 3, 
      amount: 3200, 
      description: 'Worker Payment - Electrician Helper', 
      date: '2024-01-03', 
      status: 'Completed',
      type: 'Outgoing'
    },
    { 
      id: 4, 
      amount: 1500, 
      description: 'Worker Payment - Plumber Helper', 
      date: '2024-01-01', 
      status: 'Completed',
      type: 'Outgoing'
    },
  ];

  const upcomingPayments = paymentHistory.filter(p => p.status === 'Pending');
  const totalDue = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-page">
      <div className="page-header">
        <div>
          <h1>Payments</h1>
          <p>Manage your billing history and payment methods</p>
        </div>
        {totalDue > 0 && (
          <div className="due-badge">
            <span className="due-label">Due:</span>
            <span className="due-amount">₹{totalDue.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            <IoTimeOutline />
          </div>
          <div className="summary-content">
            <div className="summary-label">Pending Payments</div>
            <div className="summary-value">₹{totalDue.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
            <IoCheckmarkCircleOutline />
          </div>
          <div className="summary-content">
            <div className="summary-label">Completed This Month</div>
            <div className="summary-value">₹{paymentHistory.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Payment History
        </button>
        <button 
          className={`tab ${activeTab === 'methods' ? 'active' : ''}`}
          onClick={() => setActiveTab('methods')}
        >
          Payment Methods
        </button>
      </div>

      {/* Payment History */}
      {activeTab === 'history' && (
        <div className="card">
          <div className="card-header">
            <h2>Payment History</h2>
            <select className="filter-select">
              <option>All Payments</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>{new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="description-cell">{payment.description}</td>
                    <td className="amount-cell">₹{payment.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`status-badge ${payment.status.toLowerCase()}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.status === 'Pending' && (
                        <button className="btn-link">Pay Now</button>
                      )}
                      {payment.status === 'Completed' && (
                        <button className="btn-link">View Receipt</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      {activeTab === 'methods' && (
        <div className="card">
          <div className="card-header">
            <h2>Payment Methods</h2>
            <button className="btn btn-primary">
              <IoAddOutline />
              Add Payment Method
            </button>
          </div>
          <div className="payment-methods-list">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-method-card">
                <div className="method-icon">
                  {method.type === 'UPI' ? <IoWalletOutline /> : <IoCardOutline />}
                </div>
                <div className="method-details">
                  <div className="method-header">
                    <span className="method-type">{method.type}</span>
                    {method.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                  <div className="method-number">{method.number}</div>
                </div>
                <div className="method-actions">
                  {!method.isDefault && (
                    <button className="btn-link">Set as Default</button>
                  )}
                  <button className="btn-link delete-link">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;

