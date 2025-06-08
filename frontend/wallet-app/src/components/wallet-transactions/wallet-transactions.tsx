import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { API_BASE_URL } from '../../config';

@Component({
  tag: 'wallet-transactions',
  styleUrl: 'wallet-transactions.css',
  shadow: true,
})
export class WalletTransactions {
  @Prop() walletId: string;
  @Event() back: EventEmitter<void>;
  @Event() notificationChange: EventEmitter<{ message: string; type: 'success' | 'error' }>;

  async handleExportCSV() {
    try {
      const transactionRes = await fetch(`${API_BASE_URL}/transactions?walletId=${this.walletId}&skip=0&limit=10000`);
      if (!transactionRes.ok) {
        throw new Error(`Failed to fetch transactions: ${transactionRes.statusText}`);
      }
      const data = await transactionRes.json();

      let username = 'wallet';
      try {
        const walletRes = await fetch(`${API_BASE_URL}/wallet/${this.walletId}`);
        if (!walletRes.ok) {
          throw new Error(`Failed to fetch wallet: ${walletRes.statusText}`);
        }
        const wallet = await walletRes.json();
        username = wallet.name || 'wallet';
      } catch (walletErr) {
        console.warn('Failed to fetch wallet name, using default:', walletErr);
      }

      const headers = ['Date', 'Amount', 'Description', 'Type', 'Balance'];
      const rows = data.map((transaction: any) => [
        transaction.date
          ? new Date(transaction.date).toLocaleString()
          : (transaction.transaction_time_stamp
              ? new Date(transaction.transaction_time_stamp).toLocaleString()
              : ''),
        transaction.amount?.toFixed(4) ?? '',
        transaction.description || '',
        transaction.type ? (transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1).toLowerCase()) : '',
        transaction.balance?.toFixed(4) ?? ''
      ]);

      let csvContent = headers.join(',') + '\n';
      csvContent += rows.map(r => r.map(field => 
        '"' + (field != null ? String(field).replace(/"/g, '""').replace(/\n/g, ' ') : '').trim() + '"'
      ).join(',')).join('\n');

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      const safeUsername = username.replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `${safeUsername}_transactions_${dateStr}.csv`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      this.notificationChange.emit({ message: 'Transactions exported successfully', type: 'success' });
    } catch (err) {
      console.error('Export failed:', err);
      this.notificationChange.emit({ 
        message: err instanceof Error ? err.message : 'Failed to export transactions', 
        type: 'error' 
      });
    }
  }

  render() {
    return (
      <div class="transactions-container">
        <div class="top-bar">
          <button class="back-btn" onClick={() => this.back.emit()}>&larr; Back</button>
          <h2>Transactions</h2>
          <button class="export-btn" onClick={() => this.handleExportCSV()}>Export CSV</button>
        </div>
        <wallet-transactions-table wallet-id={this.walletId} />
      </div>
    );
  }
}
