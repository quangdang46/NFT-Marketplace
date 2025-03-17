export abstract class BaseEvent {
  constructor(public readonly timestamp: Date = new Date()) {}
}
