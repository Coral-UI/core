// Queue system for deferred actions that need to run after the element tree is built
type DeferredAction = () => void

class DeferredActionsQueue {
  private queue: DeferredAction[] = []

  add(action: DeferredAction) {
    this.queue.push(action)
  }

  executeAll() {
    while (this.queue.length > 0) {
      const action = this.queue.shift()
      if (action) {
        try {
          action()
        } catch (error) {
          console.error('Error executing deferred action:', error)
        }
      }
    }
  }

  clear() {
    this.queue = []
  }

  get size() {
    return this.queue.length
  }
}

// Global queue instance
export const deferredActionsQueue = new DeferredActionsQueue()
