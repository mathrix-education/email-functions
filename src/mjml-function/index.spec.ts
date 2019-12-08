import { parse } from './index';

describe('parse', () => {
  it('should throw validation error', () => {
    expect(() => parse('<m5jml>Malformed test mjml body</m5jml>')).toThrowError(SyntaxError);
  });

  it('should not throw validation error', () => {
    expect(() => parse('<mjml>Malformed test mjml body</mjml>')).toBeTruthy();
  });
});
