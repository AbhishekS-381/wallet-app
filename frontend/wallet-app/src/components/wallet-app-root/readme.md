# wallet-app-root

## Dependencies

### Depends on

- [wallet-setup](../wallet-setup)
- [wallet-dashboard](../wallet-dashboard)
- [wallet-transactions](../wallet-transactions)
- [notification-toast](../notification-toast)

### Graph
```mermaid
graph TD;
  wallet-app-root --> wallet-setup
  wallet-app-root --> wallet-dashboard
  wallet-app-root --> wallet-transactions
  wallet-app-root --> notification-toast
  wallet-transactions --> wallet-transactions-table
  style wallet-app-root fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
