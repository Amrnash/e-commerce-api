interface Sender {
  send(to: string, body: string): Promise<void>;
}

export class EmailSender implements Sender {
  async send(to: string, body: string) {}
}
