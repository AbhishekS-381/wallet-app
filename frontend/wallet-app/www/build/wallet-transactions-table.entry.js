import { r as registerInstance, h } from './index-BPmV3ait.js';
import { A as API_BASE_URL } from './config-C9HfB2Xj.js';

const walletTransactionsTableCss = ":host{display:flex;flex-direction:column;align-items:center;min-height:100vh;background:#f7f9fb;font-family:'Inter', 'Segoe UI', Arial, sans-serif}.transactions-container{background:#fff;border-radius:18px;box-shadow:0 2px 16px rgba(0,0,0,0.07);padding:2rem 2rem 1.5rem 2rem;margin:1.5rem auto 0 auto;width:100%;max-width:900px;min-width:320px;box-sizing:border-box;display:flex;flex-direction:column;align-items:flex-start}.top-bar{display:flex;align-items:center;gap:2rem;margin-bottom:1.5rem;background:none;border-radius:0;box-shadow:none;padding:0}.top-bar .back-btn{background:#f7f9fb;color:#2563eb;border:1.5px solid #2563eb;font-weight:600;border-radius:8px;padding:0.45rem 1.1rem;font-size:1rem;transition:background 0.2s, color 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.03);margin-right:1.5rem}.top-bar .back-btn:hover{background:#2563eb;color:#fff}.top-bar h2{margin:0;font-size:2rem;font-weight:700;color:#22223b}.export-btn{background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:1.1rem;padding:0.7rem 2rem;margin-bottom:1.2rem;margin-top:0.5rem;transition:background 0.2s}.export-btn:hover{background:#1d4ed8}.table-container{width:100%;overflow-x:auto;margin-top:1.5rem;background:none}.transactions-table{width:100%;border-collapse:collapse;background:#f7f9fb;font-size:1rem;min-width:600px}.transactions-table thead,.transactions-table tbody{display:table;width:100%;table-layout:fixed}.transactions-table th,.transactions-table td{padding:0.9rem 1.1rem;text-align:left}.transactions-table th{background:#f1f5f9;font-weight:600;color:#22223b;font-size:1.05rem}.transactions-table tr{background:#fff;border-bottom:1px solid #e5e7eb}.transactions-table tr:last-child{border-bottom:none}.transactions-table tr:nth-child(even) td{background:#fff}.pagination{display:flex;gap:1.2rem;margin-bottom:0.5rem}.pagination button{background:#e5edfa;color:#22223b;border:none;border-radius:8px;font-weight:600;font-size:1.1rem;padding:0.7rem 1.5rem;transition:background 0.2s}.pagination button:disabled{background:#f1f5f9;color:#b0b7c3;cursor:not-allowed}.pagination button:hover:not(:disabled){background:#c7d7f7}.error{color:#e11d48;background:#fef2f2;border-radius:8px;padding:1rem;margin-top:2rem;font-size:1.05rem;border:1px solid #fecaca}@media (max-width: 900px){.transactions-table{font-size:0.95rem;min-width:480px}.transactions-table th,.transactions-table td{padding:0.7rem 0.7rem}}@media (max-width: 700px){.transactions-container{max-width:98vw;min-width:0;padding:1rem 0.3rem 0.7rem 0.3rem}.transactions-table{font-size:0.95rem;display:block;overflow-x:auto}.transactions-table th,.transactions-table td{padding:0.4rem 0.3rem;font-size:0.95rem;white-space:normal;word-break:break-word;overflow-wrap:break-word}}@media (max-width: 600px){.table-container{margin-top:0.7rem}.transactions-table{font-size:0.9rem;min-width:350px}.transactions-table th,.transactions-table td{padding:0.5rem 0.4rem}}@media (max-width: 500px){.transactions-container{padding:0.7rem 0.1rem 0.7rem 0.1rem}.transactions-table th,.transactions-table td{font-size:0.92rem;padding:0.3rem 0.2rem}}";

const WalletTransactionsTable = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    walletId;
    transactions = [];
    total = 0;
    skip = 0;
    limit = 5;
    loading = false;
    error = '';
    sortBy = 'transaction_time_stamp';
    sortDir = 'desc';
    cachedData = '';
    componentWillLoad() {
        this.fetchTransactions();
    }
    shouldFetchData() {
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
        if (!this.shouldFetchData())
            return;
        try {
            this.loading = true;
            const res = await fetch(`${API_BASE_URL}/transactions?walletId=${this.walletId}&skip=${this.skip}&limit=${this.limit}&sortBy=${this.sortBy}&sortDir=${this.sortDir}`);
            if (!res.ok)
                throw new Error('Failed to fetch transactions');
            const data = await res.json();
            const countRes = await fetch(`${API_BASE_URL}/transactions/count?walletId=${this.walletId}`);
            if (!countRes.ok)
                throw new Error('Failed to fetch transaction count');
            const countData = await countRes.json();
            this.transactions = data;
            this.total = countData.total;
            this.error = '';
        }
        catch (err) {
            this.error = err.message;
        }
        finally {
            this.loading = false;
        }
    }
    walletIdChanged() {
        this.fetchTransactions();
    }
    handleSort = (field) => {
        const newDir = this.sortBy === field ? (this.sortDir === 'asc' ? 'desc' : 'asc') : 'desc';
        this.sortBy = field;
        this.sortDir = newDir;
        this.fetchTransactions();
    };
    handlePaginate = (skip) => {
        this.skip = skip;
        this.fetchTransactions();
    };
    arrow = (field) => {
        if (this.sortBy !== field)
            return h("span", { style: { opacity: '0.3' } }, "\u2191\u2193");
        return this.sortDir === 'asc' ? h("b", null, "\u2191") : h("b", null, "\u2193");
    };
    render() {
        const isFirstPage = this.skip === 0;
        const isLastPage = this.skip + this.limit >= this.total;
        return (h("div", { key: '4ad92fca9a98220c84bb98aeb68429cf77aeb696', class: "table-container", style: { position: 'relative' } }, h("table", { key: '0728bd42d17128cf1b10f227fc7852c05b42455e', class: "transactions-table", style: { position: 'relative' } }, h("thead", { key: '08f9620435856d714a2ec0a6c89fa1c47b5614bf' }, h("tr", { key: '628897c36e51e489c742979fbc0b0516a8d2f892' }, h("th", { key: '2a693be8855ecccf8ea1ba6135534978baec38b5', onClick: () => this.handleSort('transaction_time_stamp'), style: { cursor: 'pointer' } }, "Date ", this.arrow('transaction_time_stamp')), h("th", { key: 'c6c316ad0dcdc6b63dfdd72c7d6d68e082b242c3', onClick: () => this.handleSort('amount'), style: { cursor: 'pointer' } }, "Amount ", this.arrow('amount')), h("th", { key: '0a1b9fda9c09cd72cb552e41bd78032b45bc2d2a' }, "Description"), h("th", { key: 'bd47f5bfca4be52fbce8b71163891c5ae8e19735' }, "Type"), h("th", { key: 'ab384b8ed510b5ba252608d460ddc7c1e33cdac7' }, "Balance"))), h("tbody", { key: '159fbddc79d0e2bf9f8057993b987098b0adddd5' }, this.transactions.map(transaction => (h("tr", null, h("td", null, transaction.date ? new Date(transaction.date).toLocaleString() : ''), h("td", null, typeof transaction.amount === 'number' ? transaction.amount.toFixed(4) : ''), h("td", null, transaction.description || ''), h("td", null, transaction.type ? (transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1).toLowerCase()) : ''), h("td", null, typeof transaction.balance === 'number' ? transaction.balance.toFixed(4) : '')))), this.transactions.length === 0 && !this.loading && (h("tr", { key: 'b3dac9576f9034ca276e95b7a1176fb2c1f7e9a2' }, h("td", { key: 'b692b74676c67e6be6a7f7bc49a724d2f9580c48', colSpan: 5, style: { textAlign: 'center', padding: '2rem' } }, "No transactions found"))))), h("div", { key: '123038a76042a5a8b5c780dcf6afc2db764f26dc', class: "pagination" }, h("button", { key: '55da99df5fc766d633387357e6f0cefbafec0d48', disabled: isFirstPage || this.loading, onClick: () => this.handlePaginate(Math.max(0, this.skip - this.limit)) }, "Prev"), h("button", { key: 'bcc9b09e54e79bd59d1901ae6ba080aee1a8e8a8', disabled: isLastPage || this.loading, onClick: () => this.handlePaginate(this.skip + this.limit) }, "Next")), this.error && h("div", { key: '371d610559fe03874d0de7599be7b09ac729f690', class: "error" }, this.error)));
    }
    static get watchers() { return {
        "walletId": ["walletIdChanged"]
    }; }
};
WalletTransactionsTable.style = walletTransactionsTableCss;

export { WalletTransactionsTable as wallet_transactions_table };
//# sourceMappingURL=wallet-transactions-table.entry.esm.js.map

//# sourceMappingURL=wallet-transactions-table.entry.js.map