import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { API_BASE_URL } from '../../config';

@Component({
  tag: 'wallet-dashboard',
  styleUrl: 'wallet-dashboard.css',
  shadow: true,
})
export class WalletDashboard {
  @Prop() walletId: string;
  @Event() showTransactions: EventEmitter<void>;
  @Event() notificationChange: EventEmitter<{ message: string; type: 'success' | 'error' }>;

  @State() wallet: any = null;
  @State() amount: string = '';
  @State() description: string = '';
  @State() isCredit: boolean = true;
  @State() loading: boolean = false;
  @State() loadingWallet: boolean = false;

  async componentWillLoad() {
    if (this.walletId) {
      return this.fetchWallet();
    }
  }

  @Watch('walletId')
  async walletIdChanged(newValue: string, oldValue: string) {
    if (newValue && newValue !== oldValue) {
      await this.fetchWallet();
    }
  }

  async fetchWallet() {
    if (!this.walletId) return;
    
    this.loadingWallet = true;
    try {
      const res = await fetch(`${API_BASE_URL}/wallet/${this.walletId}`);
      if (!res.ok) {
        throw new Error(await res.text() || 'Network error');
      }
      const wallet = await res.json();
      this.wallet = {
        id: wallet.id || wallet._id,
        balance: wallet.balance,
        name: wallet.name,
        date: wallet.date ? new Date(wallet.date) : undefined,
      };
    } catch (err) {
      console.error('Wallet fetch error:', err);
      this.notificationChange.emit({ 
        message: err instanceof Error ? err.message : 'Error loading wallet', 
        type: 'error' 
      });
      this.wallet = null;
    } finally {
      this.loadingWallet = false;
    }
  }

  async handleTransaction(e: Event) {
    e.preventDefault();
    if (!this.amount) {
      this.notificationChange.emit({ message: 'Amount is required', type: 'error' });
      return;
    }
    // Require amount > 0
    if (parseFloat(this.amount) <= 0) {
      this.notificationChange.emit({ message: 'Amount must be greater than 0', type: 'error' });
      return;
    }
    this.loading = true;
    try {
      const amt = parseFloat(this.amount) * (this.isCredit ? 1 : -1);
      const res = await fetch(`${API_BASE_URL}/transact/${this.walletId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, description: this.description }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        this.notificationChange.emit({ message: data.error || 'Transaction failed', type: 'error' });
        return;
      }
      // Update wallet balance from response
      if (this.wallet) {
        this.wallet.balance = data.balance;
      }
      this.amount = '';
      this.description = '';
      this.notificationChange.emit({ message: 'Transaction successful!', type: 'success' });
    } catch (err) {
      this.notificationChange.emit({ message: 'Error processing transaction', type: 'error' });
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loadingWallet) {
      return (
        <div class="wallet-card loading">
          <div class="loading-spinner"></div>
          <p>Loading wallet details...</p>
        </div>
      );
    }

    if (!this.wallet) {
      return (
        <div class="wallet-card error">
          <p>Could not load wallet details. Please try again.</p>
        </div>
      );
    }
    
    return (
      <div class="wallet-card">
        <h2>Welcome, <span>{this.wallet.name}</span></h2>
        <div class="balance-box">Balance: {this.wallet.balance.toFixed(4)}</div>
        <form onSubmit={e => this.handleTransaction(e)}>
          <input 
            type="number" 
            step="0.0001" 
            min="0.0001"
            pattern="^\\d*\\.?\\d{0,4}$"
            onInput={e => {
              const value = (e.target as HTMLInputElement).value;
              const parts = value.split('.');
              if (parts[1] && parts[1].length > 4) {
                (e.target as HTMLInputElement).value = `${parts[0]}.${parts[1].slice(0, 4)}`;
              }
              this.amount = (e.target as HTMLInputElement).value;
            }}
            value={this.amount} 
            placeholder="Amount" 
            required 
          />
          <input 
            type="text" 
            value={this.description} 
            onInput={e => this.description = (e.target as HTMLInputElement).value} 
            placeholder="Description" 
          />
          <div class="toggle-row">
            <span class="toggle-info">Select transaction type</span>
            <label class="toggle-switch">
              <input type="checkbox" checked={this.isCredit} onChange={() => this.isCredit = !this.isCredit} />
              <span class="toggle-slider"></span>
            </label>
            <span class={"toggle-label " + (this.isCredit ? "credit" : "debit")}>
              {this.isCredit ? 'Credit' : 'Debit'}
            </span>
          </div>
          <button class="submit-btn" type="submit" disabled={this.loading}>
            {this.loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        <button 
          class="view-transactions-btn" 
          onClick={() => this.showTransactions.emit()}>
          View Transactions
        </button>
      </div>
    );
  }
}
