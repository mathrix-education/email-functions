import { MailEvent } from './mail-event';
import { MJMLParsingOpts } from './mjml-parsing-opts';

export interface MJMLMailEvent extends MailEvent {
  mjmlOptions?: MJMLParsingOpts;
}
