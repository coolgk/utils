/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * Spec https://tools.ietf.org/html/rfc7636#section-4.1
 */
declare global {
  interface Window {
    msCrypto: {
      getRandomValues: (array: Uint8Array) => Uint8Array;
      subtle: {
        digest: {
          (method: string, seed: unknown): typeof CryptoOperation | PromiseLike<ArrayBuffer>;
        };
      };
    };
    CryptoOperation: unknown;
  }
}

declare const CryptoOperation: {
  [index: string]: unknown;
};

type Callback = (error: Error | null, value: { verifier: string; challenge: string }) => void;

function b64Uri(string: string) {
  // https://tools.ietf.org/html/rfc4648#section-5
  return btoa(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default function getPkce(length: number | undefined, callback: Callback): void {
  if (!length) length = 43;
  const cryptoLib = (typeof window !== 'undefined') && window.msCrypto || crypto;

  const verifier = b64Uri(
    Array.prototype.map
      .call(cryptoLib.getRandomValues(new Uint8Array(length)), function (number) {
        return String.fromCharCode(number);
      })
      .join('')
  ).substring(0, length);

  const randomArray = new Uint8Array(verifier.length);
  for (let i = 0; i < verifier.length; i++) {
    randomArray[i] = verifier.charCodeAt(i);
  }
  const digest = cryptoLib.subtle.digest('SHA-256', randomArray);

  if ((typeof window !== 'undefined') && window.CryptoOperation) {
    (digest as typeof CryptoOperation).onerror = callback;
    (digest as typeof CryptoOperation).oncomplete = function (event: { target: { result: ArrayBuffer } }) {
      runCallback(callback, verifier, event.target.result);
    };
  } else {
    (digest as Promise<ArrayBuffer>)
      .then(function (digest) {
        runCallback(callback, verifier, digest);
      })
      //@ts-ignore
      .catch(callback);
  }
}

function runCallback(callback: Callback, verifier: string, digest: ArrayBuffer): void {
  callback(null, {
    verifier: verifier,
    challenge: b64Uri(String.fromCharCode.apply(null, (new Uint8Array(digest) as unknown) as number[]))
  });
}
