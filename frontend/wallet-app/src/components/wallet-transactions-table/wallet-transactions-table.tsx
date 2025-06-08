import { Component, h, Prop, State, Watch } from '@stencil/core';
import { API_BASE_URL } from '../../config';

@Component({
  tag: 'wallet-transactions-table',
  styleUrl: 'wallet-transactions-table.css',
  shadow: false
})
export class WalletTransactionsTable {
  @Prop() walletId: string;

  @State() transactions: any[] = [];
  @State() total: number = 0;
  @State() skip: number = 0;
  @State() limit: number = 5;
  @State() loading: boolean = false;
  @State() error: string = '';
  @State() sortBy: string = 'transaction_time_stamp';
  @State() sortDir: 'asc' | 'desc' = 'desc';

  private cachedData: string = '';

  componentWillLoad() {
    this.fetchTransactions();
  }

  private shouldFetchData() {
    const newData = JSON.stringify({
      walletId: this.walletId,
      skip: this.skip,
      limit: this.limit,
      sortBy: this.sortBy,
      sortDir: this.sortDir
    });
    if (newData !== this.cachedData) {
      this.cachedData = newData;
      return true;
    }
    return false;
  }

  async fetchTransactions() {
    if (!this.shouldFetchData()) return;

    try {
      this.loading = true;

      const res = await fetch(`${API_BASE_URL}/transactions?walletId=${this.walletId}&skip=${this.skip}&limit=${this.limit}&sortBy=${this.sortBy}&sortDir=${this.sortDir}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();

      const countRes = await fetch(`${API_BASE_URL}/transactions/count?walletId=${this.walletId}`);
      if (!countRes.ok) throw new Error('Failed to fetch transaction count');
      const countData = await countRes.json();

      this.transactions = data;
      this.total = countData.total;
      this.error = '';
    } catch (err) {
      this.error = (err as Error).message;
    } finally {
      this.loading = false;
    }
  }

  @Watch('walletId')
  walletIdChanged() {
    this.fetchTransactions();
  }

  private handleSort = (field: string) => {
    const newDir = this.sortBy === field ? (this.sortDir === 'asc' ? 'desc' : 'asc') : 'desc';
    this.sortBy = field;
    this.sortDir = newDir;
    this.fetchTransactions();
  };

  private handlePaginate = (skip: number) => {
    this.skip = skip;
    this.fetchTransactions();
  };

  private arrow = (field: string) => {
    if (this.sortBy !== field) return <span style={{ opacity: '0.3' }}>↑↓</span>;
    return this.sortDir === 'asc' ? <b>↑</b> : <b>↓</b>;
  };

  render() {
    const isFirstPage = this.skip === 0;
    const isLastPage = this.skip + this.limit >= this.total;
    return (
      <div class="table-container" style={{ position: 'relative' }}>
        <table class="transactions-table" style={{ position: 'relative' }}>
          <thead>
            <tr>
              <th onClick={() => this.handleSort('transaction_time_stamp')} style={{ cursor: 'pointer' }}>
                Date {this.arrow('transaction_time_stamp')}
              </th>
              <th onClick={() => this.handleSort('amount')} style={{ cursor: 'pointer' }}>
                Amount {this.arrow('amount')}
              </th>
              <th>Description</th>
              <th>Type</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {this.transactions.map(transaction => (
              <tr>
                <td>{transaction.date ? new Date(transaction.date).toLocaleString() : ''}</td>
                <td>{typeof transaction.amount === 'number' ? transaction.amount.toFixed(4) : ''}</td>
                <td>{transaction.description || ''}</td>
                <td>{transaction.type ? (transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1).toLowerCase()) : ''}</td>
                <td>{typeof transaction.balance === 'number' ? transaction.balance.toFixed(4) : ''}</td>
              </tr>
            ))}
            {this.transactions.length === 0 && !this.loading && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div class="pagination">
          <button disabled={isFirstPage || this.loading}
            onClick={() => this.handlePaginate(Math.max(0, this.skip - this.limit))}>
            Prev
          </button>
          <button disabled={isLastPage || this.loading}
            onClick={() => this.handlePaginate(this.skip + this.limit)}>
            Next
          </button>
        </div>
        {this.error && <div class="error">{this.error}</div>}
      </div>
    );
  }
}
