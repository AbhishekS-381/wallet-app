import { r as registerInstance, a as getElement, h } from './index-BPmV3ait.js';
import { A as API_BASE_URL } from './config-C9HfB2Xj.js';

const walletAppRootCss = ":host{display:block;min-height:100vh;background:#f7f9fb;font-family:'Inter', 'Segoe UI', Arial, sans-serif;box-sizing:border-box;width:100%;max-width:100vw;overflow-x:hidden}html,body{overflow-x:hidden !important;overflow-y:auto !important;width:100%;max-width:100vw;height:100vh;margin:0;padding:0;position:fixed;box-sizing:border-box}header{position:relative;left:0;right:0;width:100vw;max-width:100vw;min-width:0;overflow-x:hidden;background:#2563eb;color:#fff;padding:1.5rem 0;text-align:center;margin-bottom:2rem;box-shadow:0 2px 8px rgba(0,0,0,0.04);z-index:100}header h1{font-size:2.1rem;font-weight:700;letter-spacing:0.01em;margin:0;width:100%;box-sizing:border-box;overflow-wrap:break-word;white-space:normal}main{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80%;width:100vw;box-sizing:border-box;margin:0;padding:0 1rem}@media (max-width: 900px){header h1{font-size:1.5rem}main{padding:0 0.5rem}}@media (max-width: 600px){header{padding:1rem 0.2rem;font-size:1.3rem}header h1{font-size:1.1rem}main{padding:0 0.2rem}}:host,.theme-light{--bg:#f7f9fb;--text:#111827;--header-bg:#2563eb;--header-text:#fff;--card-bg:#fff;--card-shadow:0 2px 16px rgba(37,99,235,0.08);--input-bg:#fff;--input-border:#cbd5e1;--input-focus:#2563eb;--primary:#2563eb;--primary-hover:#1d4ed8;--danger:#e11d48;--card-radius:18px}.theme-dark{--bg:#181a1b;--text:#f3f4f6;--header-bg:#2563eb;--header-text:#e0e7ef;--card-bg:#23272f;--card-shadow:0 2px 16px rgba(0,0,0,0.25);--input-bg:#23272f;--input-border:#374151;--input-focus:#2563eb;--primary:#2563eb;--primary-hover:#1d4ed8;--danger:#e11d48;--card-radius:18px}:host,body,html{background:var(--bg) !important;color:var(--text)}header{background:var(--header-bg);color:var(--header-text)}.wallet-card,.card,.transactions-container{background:var(--card-bg);box-shadow:var(--card-shadow);color:var(--text)}input[type=\"number\"],input[type=\"text\"]{background:var(--input-bg);border:1.5px solid var(--input-border);color:var(--text)}input[type=\"number\"]:focus,input[type=\"text\"]:focus{border-color:var(--input-focus);box-shadow:0 0 0 3px rgba(37,99,235,0.12)}.submit-btn{background:var(--primary);color:#fff}.submit-btn:hover{background:var(--primary-hover)}.view-transactions-btn{border:1.5px solid var(--primary);color:var(--primary)}.view-transactions-btn:hover{background:#eff6ff}.error{color:var(--danger)}";

const WalletAppRoot = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    get el() { return getElement(this); }
    page = 'setup';
    walletId = '';
    theme = 'light';
    notification = { message: '', type: 'success' };
    config = {
        apiBaseUrl: API_BASE_URL,
        notificationDuration: 3000,
    };
    notificationTimeout;
    mediaQuery;
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
    setupThemeDetection() {
        try {
            this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.theme = this.mediaQuery.matches ? 'dark' : 'light';
            if (this.mediaQuery.addEventListener) {
                this.mediaQuery.addEventListener('change', this.handleThemeChange);
            }
        }
        catch (error) {
            console.error('Failed to setup theme detection:', error);
            this.theme = 'light';
        }
    }
    handleThemeChange(e) {
        this.theme = e.matches ? 'dark' : 'light';
    }
    async loadSavedWallet() {
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
        }
        catch (error) {
            console.error('Failed to load wallet:', error);
            this.showNotification(error.message === 'Failed to fetch'
                ? 'Unable to connect to backend.'
                : 'Wallet does not exist in the system. Please create a new wallet.', 'error');
            localStorage.removeItem('walletId');
            this.walletId = '';
            this.page = 'setup';
        }
    }
    showNotification = (message, type = 'success') => {
        if (this.notificationTimeout) {
            window.clearTimeout(this.notificationTimeout);
        }
        this.notification = { message, type };
        this.notificationTimeout = window.setTimeout(() => {
            this.notification = { message: '', type: 'success' };
        }, this.config.notificationDuration);
    };
    handleWalletCreated = async (event) => {
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
            }
            catch (error) {
                console.error('Error verifying wallet:', error);
                this.showNotification('Error loading wallet details', 'error');
                localStorage.removeItem('walletId');
                this.walletId = '';
                this.page = 'setup';
            }
        }
    };
    handleShowTransactions = () => {
        if (this.walletId) {
            this.page = 'transactions';
        }
    };
    handleBack = () => {
        this.page = 'dashboard';
    };
    handleNotificationChange = (event) => {
        if (event.detail.message) {
            this.showNotification(event.detail.message, event.detail.type);
        }
    };
    render() {
        const commonProps = {
            'api-base-url': this.config.apiBaseUrl,
            onNotificationChange: this.handleNotificationChange,
        };
        return (h("div", { key: 'a9c81d61cb67090bc4691f50fc21e456e4809d33', class: `theme-${this.theme}` }, h("header", { key: '10c413430dcc863a1af6691b8bbfc70daec1c892' }, h("h1", { key: '45aec37785d5f52c5cd624bbd66e35ca8169aa19' }, "Wallet App")), h("main", { key: '28da01ce7b7bfca2593fd3f8ef71e8cffe4f3ca2' }, this.page === 'setup' && (h("wallet-setup", { key: '216838a7991448b45d64f23f03fe840c8b95b695', ...commonProps, onWalletCreated: this.handleWalletCreated })), this.page === 'dashboard' && this.walletId && (h("wallet-dashboard", { key: 'd4f5fe5b790810980dbdbab69f20b4cd520c9f16', ...commonProps, "wallet-id": this.walletId, onShowTransactions: this.handleShowTransactions })), this.page === 'transactions' && this.walletId && (h("wallet-transactions", { key: 'a423a1501f92be89f35ae61fc72f01031e607a98', ...commonProps, "wallet-id": this.walletId, onBack: this.handleBack }))), h("notification-toast", { key: 'cc1ec8ba9357b7d8a6b5b37747da2381f73eeacb', message: this.notification.message, type: this.notification.type })));
    }
};
WalletAppRoot.style = walletAppRootCss;

export { WalletAppRoot as wallet_app_root };
//# sourceMappingURL=wallet-app-root.entry.esm.js.map

//# sourceMappingURL=wallet-app-root.entry.js.map