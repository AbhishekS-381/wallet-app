import { Component, Element, h, State, Listen } from '@stencil/core';
import { API_BASE_URL } from '../../config';

interface Config {
  apiBaseUrl: string;
  notificationDuration: number;
}

@Component({
  tag: 'wallet-app-root',
  styleUrl: 'wallet-app-root.css',
  shadow: true,
})
export class WalletAppRoot {
  @Element() el!: HTMLElement;

  @State() page: string = 'setup';
  @State() walletId: string = '';
  @State() theme: 'light' | 'dark' = 'light';
  @State() notification: { message: string; type: 'success' | 'error' } = { message: '', type: 'success' };

  private readonly config: Config = {
    apiBaseUrl: API_BASE_URL,
    notificationDuration: 3000,
  };

  private notificationTimeout?: number;
  private mediaQuery?: MediaQueryList;

  componentWillLoad() {
    this.setupThemeDetection();
    return this.loadSavedWallet();
  }

  disconnectedCallback() {
    if (this.notificationTimeout) {
      window.clearTimeout(this.notificationTimeout);
    }
    if (this.mediaQuery?.removeEventListener) {
      this.mediaQuery.removeEventListener('change', this.handleThemeChange);
    }
  }

  private setupThemeDetection() {
    try {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.theme = this.mediaQuery.matches ? 'dark' : 'light';
      
      if (this.mediaQuery.addEventListener) {
        this.mediaQuery.addEventListener('change', this.handleThemeChange);
      }
    } catch (error) {
      console.error('Failed to setup theme detection:', error);
      this.theme = 'light';
    }
  }
  @Listen('change', { target: 'window' })
  handleThemeChange(e: MediaQueryListEvent) {
    this.theme = e.matches ? 'dark' : 'light';
  }

  private async loadSavedWallet() {
    const savedWalletId = localStorage.getItem('walletId');
    if (!savedWalletId) {
      return;
    }

    try {
      const res = await fetch(`${this.config.apiBaseUrl}/wallet/${savedWalletId}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to load wallet');
      }
      this.walletId = savedWalletId;
      this.page = 'dashboard';
    } catch (error: any) {
      console.error('Failed to load wallet:', error);
      this.showNotification(
        error.message === 'Failed to fetch'
          ? 'Unable to connect to backend.'
          : 'Wallet does not exist in the system. Please create a new wallet.',
        'error'
      );
      localStorage.removeItem('walletId');
      this.walletId = '';
      this.page = 'setup';
    }
  }
  
  private showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    if (this.notificationTimeout) {
      window.clearTimeout(this.notificationTimeout);
    }
    
    this.notification = { message, type };
    this.notificationTimeout = window.setTimeout(() => {
      this.notification = { message: '', type: 'success' };
    }, this.config.notificationDuration);
  };

  private handleWalletCreated = async (event: CustomEvent<{ walletId: string }>) => {
    if (event.detail.walletId) {
      this.walletId = event.detail.walletId;
      localStorage.setItem('walletId', event.detail.walletId);

      try {
        const res = await fetch(`${this.config.apiBaseUrl}/wallet/${event.detail.walletId}`);
        if (!res.ok) {
          throw new Error('Failed to verify wallet');
        }
        await res.json();
        this.page = 'dashboard';
      } catch (error) {
        console.error('Error verifying wallet:', error);
        this.showNotification('Error loading wallet details', 'error');
        localStorage.removeItem('walletId');
        this.walletId = '';
        this.page = 'setup';
      }
    }
  };

  private handleShowTransactions = () => {
    if (this.walletId) {
      this.page = 'transactions';
    }
  };

  private handleBack = () => {
    this.page = 'dashboard';
  };

  private handleNotificationChange = (event: CustomEvent<{ message: string; type: 'success' | 'error' }>) => {
    if (event.detail.message) {
      this.showNotification(event.detail.message, event.detail.type);
    }
  };

  render() {
    const commonProps = {
      'api-base-url': this.config.apiBaseUrl,
      onNotificationChange: this.handleNotificationChange,
    };

    return (
      <div class={`theme-${this.theme}`}>
        <header>
          <h1>Wallet App</h1>
        </header>
        <main>
          {this.page === 'setup' && (
            <wallet-setup 
              {...commonProps}
              onWalletCreated={this.handleWalletCreated}
            />
          )}
          {this.page === 'dashboard' && this.walletId && (
            <wallet-dashboard 
              {...commonProps}
              wallet-id={this.walletId} 
              onShowTransactions={this.handleShowTransactions}
            />
          )}
          {this.page === 'transactions' && this.walletId && (
            <wallet-transactions 
              {...commonProps}
              wallet-id={this.walletId} 
              onBack={this.handleBack}
            />
          )}
        </main>
        <notification-toast 
          message={this.notification.message} 
          type={this.notification.type} 
        />
      </div>
    );
  }
}
