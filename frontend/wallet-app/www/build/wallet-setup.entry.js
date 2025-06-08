import { r as registerInstance, d as createEvent, h } from './index-BPmV3ait.js';
import { A as API_BASE_URL } from './config-C9HfB2Xj.js';

const walletSetupCss = ".card{background:#fff;border-radius:1.25rem;box-shadow:0 2px 16px 0 rgba(37,99,235,0.08);padding:2rem 1.5rem;margin:0 auto;max-width:400px;width:100%;min-width:360px;box-sizing:border-box}@media (max-width: 500px){.card{padding:1.5rem 0.5rem;max-width:100vw;min-width:0}}h2{font-size:2rem;font-weight:700;margin-bottom:1.2rem;margin-top:0;letter-spacing:0.01em;color:#2563eb;text-align:center}form{width:100%;display:flex;flex-direction:column;gap:1.1rem;margin-bottom:1.2rem}input[type=\"number\"],input[type=\"text\"]{padding:0.6rem 0.8rem;border:1.5px solid #cbd5e1;border-radius:7px;font-size:1rem;background:#f8fafc;color:#22223b;margin-bottom:0.2rem}input[type=\"number\"]::-webkit-inner-spin-button,input[type=\"number\"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.submit-btn{width:100%;padding:0.7rem 0;background:#2563eb;color:#fff;border:none;border-radius:7px;font-weight:600;font-size:1.1rem;margin-top:0.5rem;margin-bottom:0.7rem;transition:background 0.2s}.submit-btn:disabled{background:#cbd5e1;color:#64748b;cursor:not-allowed}.submit-btn:hover:not(:disabled){background:#1d4ed8}.error{color:#e11d48;background:#fef2f2;border-radius:8px;padding:0.7rem 1rem;margin-top:1rem;font-size:1.05rem;border:1px solid #fecaca}";

const WalletSetup = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.walletCreated = createEvent(this, "walletCreated", 7);
        this.notificationChange = createEvent(this, "notificationChange", 7);
    }
    walletCreated;
    notificationChange;
    name = '';
    balance = '';
    loading = false;
    error = '';
    async handleSubmit(e) {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
            this.notificationChange.emit({
                message: errorMessage,
                type: 'error'
            });
        }
        finally {
            this.loading = false;
        }
    }
    handleBalanceInput = (e) => {
        const input = e.target;
        const value = input.value;
        const parts = value.split('.');
        if (parts[1] && parts[1].length > 4) {
            input.value = `${parts[0]}.${parts[1].slice(0, 4)}`;
        }
        this.balance = input.value;
    };
    render() {
        return (h("div", { key: '88181e79ed180558d4df91d7ff1b3fec25b6f986', class: "card" }, h("h2", { key: '912b87228fb1620129971a36f031c018064b2894' }, "Setup Wallet"), h("form", { key: '60384c38091b61acdc1a37e942b3a9ca7fd64033', onSubmit: e => this.handleSubmit(e) }, h("input", { key: '24bf22ddc26fd92f29728b9e238ecd5c023171e7', type: "text", value: this.name, onInput: e => this.name = e.target.value, placeholder: "Name", required: true }), h("input", { key: '4fb155755499bc1f7d4bfebfabe091aeb8ef195c', type: "number", step: "0.0001", min: "0.0001", pattern: "^\\\\d*\\\\.?\\\\d{0,4}$", onInput: this.handleBalanceInput, value: this.balance, placeholder: "Initial Balance", required: true }), h("button", { key: '0f36dbda93680ad100a390e05fe09b3ab93a2020', class: "submit-btn", type: "submit", disabled: this.loading }, this.loading ? 'Creating...' : 'Create Wallet'))));
    }
};
WalletSetup.style = walletSetupCss;

export { WalletSetup as wallet_setup };
//# sourceMappingURL=wallet-setup.entry.esm.js.map

//# sourceMappingURL=wallet-setup.entry.js.map