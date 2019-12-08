import { MailEvent } from '../common/interfaces/mail-event';
import { PubSubEvent } from '../common/interfaces/pubsub-event';
import { Sentry } from '../common/sentry';
import { parsePubSubEvent } from '../common/utils';

// Initialize global
const sentry = new Sentry('mailgun-function');

/**
 * Forward the generic email event to a more specialized topic (either mjml or mailgun).
 * @param data
 */
async function main(data: MailEvent): Promise<number> {
  return 0;
}

/**
 * Sentry wrapper.
 * @param event
 */
exports['email-function'] = async (event: PubSubEvent): Promise<number> => {
  return sentry.handler(() => {
    const data = parsePubSubEvent<MailEvent>(event);
    return main(data);
  });
};
