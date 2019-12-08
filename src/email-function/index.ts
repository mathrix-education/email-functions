import { PubSub } from '@google-cloud/pubsub';
import { MailEvent } from '../common/interfaces/mail-event';
import { MJMLMailEvent } from '../common/interfaces/mjml-mail-event';
import { PubSubEvent } from '../common/interfaces/pubsub-event';
import { Sentry } from '../common/sentry';
import { parsePubSubEvent } from '../common/utils';

// Initialize global
export const name = 'email-function';
const sentry = new Sentry(name);
const pubSub = new PubSub();

/**
 * Check if the PubSub event data is an MJML email.
 * @param data
 */
function isMjml(data): boolean {
  return 'mjmlOptions' in data || data?.html.includes('<mj-') || data?.html.includes('<mjml');
}

/**
 * Forward the generic email event to a more specialized topic (either mjml or mailgun).
 * @param data
 */
async function main(data: MailEvent | MJMLMailEvent): Promise<number> {
  const topic = isMjml(data) ? 'mjmj-email-dispatch' : 'mailgun-email-dispatch';
  await pubSub.topic(topic).publishJSON(data);
  return 0;
}

/**
 * Sentry wrapper.
 * @param event
 */
exports[name] = async (event: PubSubEvent): Promise<number> => {
  return sentry.handler(() => {
    const data = parsePubSubEvent<MailEvent | MJMLMailEvent>(event);
    return main(data);
  });
};
