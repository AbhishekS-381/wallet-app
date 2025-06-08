import { Component, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'notification-toast',
  styleUrl: 'notification-toast.css',
  shadow: true,
})
export class NotificationToast {
  @Prop() message: string = '';
  @Prop() type: 'success' | 'error' = 'success';
  @Prop() duration: number = 3000;
  @State() visible: boolean = false;

  private hideTimeout?: number;

  disconnectedCallback() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  @Watch('message')
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
    return (
      <div
        class={{
          'toast': true,
          'show': this.visible && Boolean(this.message),
          'success': this.type === 'success',
          'error': this.type === 'error',
        }}
      >
        {this.message}
      </div>
    );
  }
}
