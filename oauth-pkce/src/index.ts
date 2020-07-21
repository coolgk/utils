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
          (method: string, seed: Uint8Array): typeof CryptoOperation | PromiseLike<ArrayBuffer>;
          // (method: string, seed: Uint8Array): ;
        };
      };
    };
    CryptoOperation: unknown;
  }
}

declare const CryptoOperation: {
  [index: string]: unknown;
};

export default function getPkce(
  length: number | undefined,
  callback: (error: Error | null, value: { verifier: string; challenge: string }) => void
): void {
  if (!length) length = 44;
  const cryptoLib = window.msCrypto || window.crypto;
  // const randomNumbers = cryptoLib.getRandomValues(new Uint8Array(length / 2));

  const randomString = btoa(
    Array.prototype.map
      .call(cryptoLib.getRandomValues(new Uint8Array(length)), function (number) {
        return String.fromCharCode(number);
      })
      .join('')
  )
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .substring(0, length);

  const randomArray = new Uint16Array(new ArrayBuffer(randomString.length * 2));
  for (let i = 0; i < randomString.length; i++) {
    randomArray[i] = randomString.charCodeAt(i);
  }

  let verifier = '';
  for (let i = 0; i < randomNumbers.length; i++) {
    verifier += ('0' + randomNumbers[i].toString(16)).substr(-2);
  }
  const digest = cryptoLib.subtle.digest('SHA-256', randomNumbers);

  if (window.CryptoOperation) {
    (digest as typeof CryptoOperation).onerror = callback;
    (digest as typeof CryptoOperation).oncomplete = function (event: { target: { result: ArrayBuffer } }) {
      callback(null, {
        verifier: verifier,
        challenge: btoa(String.fromCharCode.apply(null, (new Uint8Array(event.target.result) as unknown) as number[]))
      });
    };
  } else {
    (digest as Promise<ArrayBuffer>)
      .then(function (digest) {
        callback(null, {
          verifier: verifier,
          challenge: btoa(String.fromCharCode.apply(null, (new Uint8Array(digest) as unknown) as number[]))
        });
      })
      //@ts-ignore
      .catch(callback);
  }
}
