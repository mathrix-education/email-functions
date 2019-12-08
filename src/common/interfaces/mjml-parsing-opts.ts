/**
 * Exported from
 * @link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mjml/index.d.ts
 */
export interface MJMLParsingOpts {
  fonts?: { [key: string]: string };
  keepComments?: boolean;
  beautify?: boolean;
  minify?: boolean;
  validationLevel?: 'strict' | 'soft' | 'skip';
  filePath?: string;
}
