import { PubSubEvent } from './interfaces/pubsub-event';

export function parsePubSubEvent<T>(pubSubEvent: PubSubEvent): T {
  return JSON.parse(Buffer.from(pubSubEvent.data, 'base64').toString());
}
