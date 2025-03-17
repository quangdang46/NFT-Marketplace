export interface UserClient {
  findOrCreateUser(address: string): Promise<any>;
}
