import { PubSub } from '@google-cloud/pubsub';
import mjml2html from 'mjml';
import { MJMLMailEvent } from '../common/interfaces/mjml-mail-event';
import { MJMLParsingOpts } from '../common/interfaces/mjml-parsing-opts';
import { PubSubEvent } from '../common/interfaces/pubsub-event';
import { Sentry } from '../common/sentry';
import { parsePubSubEvent } from '../common/utils';

// Initialize global
const sentry = new Sentry('mjml-function');
const pubSub = new PubSub();

/**
 * Parse HTML using MJML library.
 * @param html
 * @param options
 */
export function parse(html: string, options: Partial<MJMLParsingOpts> = {}): string {
  const defaultMjmlOptions: MJMLParsingOpts = {
    fonts: {
      'Roboto': 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
    },
    keepComments: true,
    beautify: true,
    minify: false,
    validationLevel: 'soft', // strict is not necessary since we handle the error ourselves
  };

  options = { ...defaultMjmlOptions, ...options };
  const result = mjml2html(html, options);

  if (result.errors.length > 0) {
    throw new SyntaxError('MJML Syntax Error\n' + result.errors.map(e => '\t' + e.formattedMessage).join('\n'));
  }

  return result.html;
}

/**
 * Core function body
 * @param data The MJMLMailEvent passed to Google Cloud Function
 */
export async function main(data: MJMLMailEvent): Promise<number> {
  const { mjmlOptions, ...payload } = data;
  payload.html = parse(data.html, mjmlOptions);

  if (data.mjmlOptions) {
    delete data.mjmlOptions;
  }

  await pubSub.topic('email-dispatch').publishJSON(data);

  return 0;
}


/**
 * Sentry wrapper.
 * @param event
 */
exports['mjml-function'] = async (event: PubSubEvent): Promise<number> => {
  return sentry.handler(() => {
    const data = parsePubSubEvent<MJMLMailEvent>(event);
    return main(data);
  });
};
