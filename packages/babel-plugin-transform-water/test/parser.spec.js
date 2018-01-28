import { transform, version } from '@babel/core';
import { resolve } from 'path';
import fs from 'fs-extra';
import requireFromString from 'require-from-string';
import water from '../';

describe('parser', () => {
  const setupDOM = code => `
    const { JSDOM } = require('jsdom');
    global.document = (new JSDOM('')).window.document;
    ${code}
  `;

  it('should parse element', async () => {
    const filename = './samples/element.js';
    const input = await fs.readFile(resolve(__dirname, filename));
    const { code } = transform(input, { plugins: [ water ], presets: [ '@babel/preset-env' ] });
    const parsed = requireFromString(setupDOM(code));
    const target = parsed.default();
    expect(target.tagName).toBe('DIV');
  });
});
