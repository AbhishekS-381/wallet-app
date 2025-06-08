import { r as registerInstance, d as createEvent, h } from './index-BPmV3ait.js';
import { A as API_BASE_URL } from './config-C9HfB2Xj.js';

const walletTransactionsCss = ":host{display:flex;flex-direction:column;align-items:center;min-height:100vh;background:#f7f9fb;font-family:'Inter', 'Segoe UI', Arial, sans-serif}.transactions-container{background:#fff;border-radius:18px;box-shadow:0 2px 16px rgba(0,0,0,0.07);padding:2rem 2rem 1.5rem 2rem;margin:1.5rem auto 0 auto;width:100%;max-width:900px;min-width:0;box-sizing:border-box;display:flex;flex-direction:column;align-items:flex-start}.top-bar{display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:1.5rem;background:none;border-radius:0;box-shadow:none;padding:0}.left-section{display:flex;align-items:center;gap:2rem}.top-bar .back-btn{background:#f7f9fb;color:#2563eb;border:1.5px solid #2563eb;font-weight:600;border-radius:8px;padding:0.45rem 1.1rem;font-size:1rem;transition:background 0.2s, color 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.03);margin-right:0}.top-bar .back-btn:hover{background:#2563eb;color:#fff}.top-bar h2{margin:0;font-size:2.2rem;font-weight:700;color:#111827;flex:1;text-align:center}.export-btn{background:#2563eb;color:white;border:none;font-weight:600;border-radius:8px;padding:0.45rem 1.1rem;font-size:1rem;transition:background 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.03);cursor:pointer;margin-left:0}.export-btn:hover{background:#1d4ed8}.transactions-table{width:100%;border-collapse:separate;border-spacing:0;background:#f8fafc;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.04);overflow-x:auto;margin-bottom:1.2rem;display:block}.transactions-table thead,.transactions-table tbody{display:table;width:100%;table-layout:fixed}.transactions-table th,.transactions-table td{padding:0.5rem 0.7rem;text-align:left;white-space:normal;word-break:break-word;overflow-wrap:break-word}.transactions-table th{background:#f1f5f9;color:#334155;font-weight:600;font-size:1rem;border-bottom:1px solid #e2e8f0;cursor:pointer}.transactions-table td{color:#22223b;font-size:0.98rem;border-bottom:1px solid #f1f5f9}.transactions-table tr:last-child td{border-bottom:none}.transactions-table tr:nth-child(even) td{background:#fff}.pagination{display:flex;gap:1.2rem;margin-bottom:0.5rem}.pagination button{background:#e5edfa;color:#22223b;border:none;border-radius:8px;font-weight:600;font-size:1.1rem;padding:0.7rem 1.5rem;transition:background 0.2s}.pagination button:disabled{background:#f1f5f9;color:#b0b7c3;cursor:not-allowed}.pagination button:hover:not(:disabled){background:#c7d7f7}.error{color:#e11d48;background:#fef2f2;border-radius:8px;padding:1rem;margin-top:2rem;font-size:1.05rem;border:1px solid #fecaca}@media (max-width: 900px){.transactions-container{max-width:98vw;padding:1.2rem 0.5rem 1rem 0.5rem}.top-bar h2{font-size:1.3rem}}@media (max-width: 700px){.transactions-container{max-width:98vw;min-width:0;padding:1rem 0.3rem 0.7rem 0.3rem}.transactions-table{font-size:0.95rem;display:block;overflow-x:auto}.transactions-table th,.transactions-table td{padding:0.4rem 0.3rem;font-size:0.95rem;white-space:normal;word-break:break-word;overflow-wrap:break-word}}@media (max-width: 600px){.transactions-container{padding:0.7rem 0.2rem 0.7rem 0.2rem;min-width:0}.top-bar{flex-direction:column;align-items:stretch;gap:0.7rem}.top-bar h2{font-size:1.1rem;text-align:left}.export-btn,.back-btn{width:100%;font-size:0.95rem;padding:0.7rem 0.7rem}}@media (max-width: 500px){.transactions-container{padding:0.7rem 0.1rem 0.7rem 0.1rem}.transactions-table th,.transactions-table td{font-size:0.92rem;padding:0.3rem 0.2rem}}";

const WalletTransactions = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.back = createEvent(this, "back", 7);
        this.notificationChange = createEvent(this, "notificationChange", 7);
    }
    walletId;
    back;
    notificationChange;
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
            }
            catch (walletErr) {
                console.warn('Failed to fetch wallet name, using default:', walletErr);
            }
            const headers = ['Date', 'Amount', 'Description', 'Type', 'Balance'];
            const rows = data.map((transaction) => [
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
            csvContent += rows.map(r => r.map(field => '"' + (field != null ? String(field).replace(/"/g, '""').replace(/\n/g, ' ') : '').trim() + '"').join(',')).join('\n');
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
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
        }
        catch (err) {
            console.error('Export failed:', err);
            this.notificationChange.emit({
                message: err instanceof Error ? err.message : 'Failed to export transactions',
                type: 'error'
            });
        }
    }
    render() {
        return (h("div", { key: '5bd2360b890076e33ab2f9a5713191171d1441af', class: "transactions-container" }, h("div", { key: '62bbc4f2620d94f57d4bd44e0d4c6c2ba8dffebd', class: "top-bar" }, h("button", { key: '99ac9c37883170ab9a6438b7b4c2ead069e14c42', class: "back-btn", onClick: () => this.back.emit() }, "\u2190 Back"), h("h2", { key: 'c525d2c0e683d8e927b597e8ed1b47d61ebebd73' }, "Transactions"), h("button", { key: '3252dcc97c2c6b8d0d7e548b81885bb187336d11', class: "export-btn", onClick: () => this.handleExportCSV() }, "Export CSV")), h("wallet-transactions-table", { key: 'a2c0dafec2c6ddf7fc4f0894ca3bb7014efffb3b', "wallet-id": this.walletId })));
    }
};
WalletTransactions.style = walletTransactionsCss;

export { WalletTransactions as wallet_transactions };
//# sourceMappingURL=wallet-transactions.entry.esm.js.map

//# sourceMappingURL=wallet-transactions.entry.js.map