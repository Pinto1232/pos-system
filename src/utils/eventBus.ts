// Simple event bus for global UI updates
type EventCallback = (data: any) => void;

interface EventBus {
  on(
    event: string,
    callback: EventCallback
  ): void;
  off(
    event: string,
    callback: EventCallback
  ): void;
  emit(event: string, data?: any): void;
}

class EventBusImpl implements EventBus {
  private events: Record<
    string,
    EventCallback[]
  > = {};

  on(
    event: string,
    callback: EventCallback
  ): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(
    event: string,
    callback: EventCallback
  ): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[
      event
    ].filter((cb) => cb !== callback);
  }

  emit(event: string, data?: any): void {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(
          `Error in event handler for ${event}:`,
          error
        );
      }
    });
  }
}

// Create a singleton instance
const eventBus = new EventBusImpl();

// Event names constants
export const UI_EVENTS = {
  CUSTOMIZATION_UPDATED: 'customization:updated',
};

export default eventBus;
