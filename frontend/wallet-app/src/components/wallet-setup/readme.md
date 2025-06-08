# wallet-setup

## Events

| Event                | Description | Type                                                            |
| -------------------- | ----------- | --------------------------------------------------------------- |
| `notificationChange` |             | `CustomEvent<{ message: string; type: "error" \| "success"; }>` |
| `walletCreated`      |             | `CustomEvent<{ walletId: string; }>`                            |


## Dependencies

### Used by

 - [wallet-app-root](../wallet-app-root)

### Graph
```mermaid
graph TD;
  wallet-app-root --> wallet-setup
  style wallet-setup fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
