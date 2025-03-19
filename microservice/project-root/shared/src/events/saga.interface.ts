export interface Saga {
  execute(): Promise<void>;
  compensate(): Promise<void>;
}
