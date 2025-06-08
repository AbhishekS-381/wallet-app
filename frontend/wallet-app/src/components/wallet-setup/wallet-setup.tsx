import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { API_BASE_URL } from '../../config';

@Component({
  tag: 'wallet-setup',
  styleUrl: 'wallet-setup.css',
  shadow: true,
})
export class WalletSetup {
  @Event() walletCreated: EventEmitter<{ walletId: string }>;
  @Event() notificationChange: EventEmitter<{ message: string; type: 'success' | 'error' }>;
  @State() name: string = '';
  @State() balance: string = '';
  @State() loading: boolean = false;
  @State() error: string = '';

  async handleSubmit(e: Event) {
    e.preventDefault();
    this.error = '';
    if (!this.name || !this.balance) {
      this.notificationChange.emit({ message: 'Name and balance are required', type: 'error' });
      return;
    }
    // Require balance > 0
    if (Number(this.balance) < 0) {
      this.notificationChange.emit({ message: 'Initial balance must be greater than 0', type: 'error' });
      return;
    }

    this.loading = true;
    try {
      const res = await fetch(`${API_BASE_URL}/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: this.name, balance: Number(this.balance) }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create wallet');
      }

      const data = await res.json();
      
      // First notify about successful creation
      this.notificationChange.emit({ 
        message: 'Wallet created successfully!', 
        type: 'success' 
      });

      // Clear form
      this.name = '';
      this.balance = '';
      
      // Then emit wallet created event to trigger navigation
      this.walletCreated.emit({ walletId: data.id });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      this.notificationChange.emit({ 
        message: errorMessage,
        type: 'error' 
      });
    } finally {
      this.loading = false;
    }
  }

  private handleBalanceInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    const parts = value.split('.');
    if (parts[1] && parts[1].length > 4) {
      input.value = `${parts[0]}.${parts[1].slice(0, 4)}`;
    }
    this.balance = input.value;
  };

  render() {
    return (
      <div class="card">
        <h2>Setup Wallet</h2>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text" value={this.name} onInput={e => this.name = (e.target as HTMLInputElement).value} placeholder="Name" required />
          <input
            type="number"
            step="0.0001"
            min="0.0001"
            pattern="^\\d*\\.?\\d{0,4}$"
            onInput={this.handleBalanceInput}
            value={this.balance}
            placeholder="Initial Balance"
            required
          />
          <button class="submit-btn" type="submit" disabled={this.loading}>{this.loading ? 'Creating...' : 'Create Wallet'}</button>
        </form>
      </div>
    );
  }
}
