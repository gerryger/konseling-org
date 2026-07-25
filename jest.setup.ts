import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';
import { ReadableStream, TransformStream } from 'node:stream/web';

Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
  ReadableStream,
  TransformStream,
});

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = jest.fn()
}
