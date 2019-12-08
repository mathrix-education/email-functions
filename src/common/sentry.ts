import { RewriteFrames } from '@sentry/integrations';
import * as SentrySDK from '@sentry/node';

/**
 * A small Sentry wrapper.
 */
export class Sentry {
  private readonly enabled: boolean = false;

  /**
   * Initialise the Sentry SDK
   */
  constructor() {
    if (process.env.SENTRY_DSN) {
      /**
       * Initialize Sentry
       * Provide root file integration global variable
       * @link https://docs.sentry.io/platforms/node/typescript/
       */
      SentrySDK.init({
        release: process.env.RELEASE ?? 'unknown',
        dsn: process.env.SENTRY_DSN,
        integrations: [new RewriteFrames({
          root: __dirname || process.cwd(),
        })],
      });

      this.enabled = true;
    }
  }

  /**
   * Handle exceptions with Sentry.
   * @param callback
   */
  public async handler(callback: () => Promise<number>): Promise<number> {
    try {
      return callback();
    } catch (error) {
      if (this.enabled) {
        SentrySDK.captureException(error);
        await SentrySDK.flush(2000);
      }

      throw error; // Rethrow error
    }
  }
}
