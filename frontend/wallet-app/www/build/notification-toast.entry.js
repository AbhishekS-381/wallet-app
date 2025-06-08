import { r as registerInstance, h } from './index-BPmV3ait.js';

const notificationToastCss = ":host{position:fixed;left:50%;top:2.5rem;z-index:9999;display:flex;justify-content:center;width:100vw;pointer-events:none;transform:translateX(-50%)}.toast{min-width:220px;max-width:90vw;background:#fff;color:#2563eb;border-radius:12px;box-shadow:0 2px 16px rgba(37,99,235,0.13);padding:1rem 2rem;font-size:1.08rem;font-weight:500;opacity:0;transform:translateY(-40px) scale(0.98);transition:opacity 0.3s, transform 0.3s;pointer-events:auto;border:1.5px solid #2563eb;text-align:center}.toast.success{background:#e0f2fe;color:#2563eb;border-color:#2563eb}.toast.error{background:#fef2f2;color:#e11d48;border-color:#e11d48}.toast.show{opacity:1;transform:translateY(0) scale(1)}@media (max-width: 600px){.toast{padding:0.7rem 1rem;font-size:0.98rem}}";

const NotificationToast = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    message = '';
    type = 'success';
    duration = 3000;
    visible = false;
    hideTimeout;
    disconnectedCallback() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
    }
    onMessageChange() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        this.visible = Boolean(this.message);
        if (this.message) {
            this.hideTimeout = window.setTimeout(() => {
                this.visible = false;
            }, this.duration);
        }
    }
    render() {
        return (h("div", { key: 'ef3069653ee318120a2cfb96df0f81318fa5d85a', class: {
                'toast': true,
                'show': this.visible && Boolean(this.message),
                'success': this.type === 'success',
                'error': this.type === 'error',
            } }, this.message));
    }
    static get watchers() { return {
        "message": ["onMessageChange"]
    }; }
};
NotificationToast.style = notificationToastCss;

export { NotificationToast as notification_toast };
//# sourceMappingURL=notification-toast.entry.esm.js.map

//# sourceMappingURL=notification-toast.entry.js.map