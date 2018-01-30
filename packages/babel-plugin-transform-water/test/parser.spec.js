import { transform, version } from '@babel/core';
import { resolve } from 'path';
import fs from 'fs-extra';
import requireFromString from 'require-from-string';
import water from '../';

const SAMPLES_PATH = resolve(__dirname, './samples');

describe('parser', () => {
  const setupDOM = code => `
    const { JSDOM } = require('jsdom');
    global.document = (new JSDOM('')).window.document;
    ${code}
  `;

  function getAllSamples() {
    return fs.readdirSync(SAMPLES_PATH).map(name => ({
      name,
      codePath: resolve(SAMPLES_PATH, name, 'code.js'),
      propsPath: resolve(SAMPLES_PATH, name, 'props.js'),
      expectPath: resolve(SAMPLES_PATH, name, 'expect.js'),
    }));
  }

  getAllSamples().forEach(({ name, codePath, propsPath, expectPath }) => {
    it(`should parse ${name}`, async () => {
      const input = await fs.readFile(codePath);
      const { code } = transform(input, { plugins: [ water ], presets: [ '@babel/preset-env' ] });
      const parsed = requireFromString(setupDOM(code));
      const props = await fs.exists(propsPath) ? require(propsPath).default : {};
      require(expectPath).default(parsed.default(props), props);
    });
  })

});
