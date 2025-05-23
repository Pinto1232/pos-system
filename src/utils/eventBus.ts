type EventCallback<T = unknown> = (data: T) => void;

interface EventBus {
  on<T = unknown>(event: string, callback: EventCallback<T>): void;
  off<T = unknown>(event: string, callback: EventCallback<T>): void;
  emit<T = unknown>(event: string, data?: T): void;
}

class EventBusImpl implements EventBus {
  private events: Record<string, EventCallback<unknown>[]> = {};

  on<T = unknown>(event: string, callback: EventCallback<T>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback as EventCallback<unknown>);
  }

  off<T = unknown>(event: string, callback: EventCallback<T>): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit<T = unknown>(event: string, data?: T): void {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(
          `Error in event handler for ${event}:`,
          JSON.stringify(error, null, 2)
        );
      }
    });
  }
}

const eventBus = new EventBusImpl();

export const UI_EVENTS = {
  CUSTOMIZATION_UPDATED: 'customization:updated',
};

export default eventBus;
