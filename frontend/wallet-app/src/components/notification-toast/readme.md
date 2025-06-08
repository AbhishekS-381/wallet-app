# notification-toast

## Properties

| Property   | Attribute  | Description | Type                   | Default     |
| ---------- | ---------- | ----------- | ---------------------- | ----------- |
| `duration` | `duration` |             | `number`               | `3000`      |
| `message`  | `message`  |             | `string`               | `''`        |
| `type`     | `type`     |             | `"error" \| "success"` | `'success'` |


## Dependencies

### Used by

 - [wallet-app-root](../wallet-app-root)

### Graph
```mermaid
graph TD;
  wallet-app-root --> notification-toast
  style notification-toast fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
