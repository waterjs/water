import { transform } from '@babel/core';
import { resolve } from 'path';
import fs from 'fs-extra';
import requireFromString from 'require-from-string';
import water from '../src';

const SAMPLES_PATH = resolve(__dirname, './samples');

describe('parser', () => {
  const setupDOM = code => `
    const { JSDOM } = require('jsdom');
    global.document = (new JSDOM('')).window.document;

    ${code}
  `;

  function getAllSamples () {
    return fs.readdirSync(SAMPLES_PATH).map(name => ({
      name,
      codePath: resolve(SAMPLES_PATH, name, 'code.js'),
      propsPath: resolve(SAMPLES_PATH, name, 'props.js'),
      errorPath: resolve(SAMPLES_PATH, name, 'error.js'),
      expectPath: resolve(SAMPLES_PATH, name, 'expect.js'),
    }));
  }

  function transformString(input) {
    const { code } = transform(input, {
      plugins: [ water ],
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current',
          },
        }],
      ],
      babelrc: false,
    });
    console.log(code);
    return code;
  }

  getAllSamples().forEach(({ name, codePath, propsPath, expectPath, errorPath }) => {
    it(`should parse ${name}`, async () => {
      const input = await fs.readFile(codePath);
      const props = await fs.exists(propsPath) ? require(propsPath).default : {};
      const error = await fs.exists(errorPath) && require(errorPath).default;
      if (error) {
        expect(() => transformString(input)).toThrow(error(props));
      } else {
        const code = transformString(input);
        const parsed = requireFromString(setupDOM(code));
        require(expectPath).default(parsed.default(props), props);
      }
    });
  });
});
