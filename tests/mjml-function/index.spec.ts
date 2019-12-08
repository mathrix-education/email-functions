import faker from 'faker';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { MailEvent } from '../../src/common/interfaces/mail-event';
import { MJMLMailEvent } from '../../src/common/interfaces/mjml-mail-event';
import { main } from '../../src/mjml-function';

async function loadSample(name): Promise<string> {
  return (await fs.readFile(resolve(__dirname, 'samples', name))).toString();
}

function makeEvent(partial: Partial<MJMLMailEvent | MailEvent>): MailEvent {
  const fakeEvent = {
    from: `${faker.name.findName()} <${faker.internet.email()}>`,
    to: faker.internet.email(),
    subject: faker.hacker.noun(),
    text: faker.lorem.paragraphs(5),
    html: faker.lorem.paragraphs(5),
  };

  return { ...fakeEvent, ...partial };
}

jest.mock('@google-cloud/pubsub', () => {
  return {
    'PubSub': jest.fn(() => {
      return {
        'topic': jest.fn(() => {
          return {
            'publishJSON': jest.fn(),
          };
        }),
      };
    }),
  };
});

describe('mjml-function', () => {
  it('should throw validation error', async () => {
    const event = makeEvent({ html: await loadSample('invalid.mjml') });
    console.log(event);
    expect(() => main(event)).toThrowError(SyntaxError);
  });

  it('should not throw validation error', async () => {
    const event = makeEvent({ html: await loadSample('valid.mjml') });
    expect(await main(event)).toBe(0);
  });
});
