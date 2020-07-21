declare const msCrypto: {
  getRandomValues: (array: Uint8Array) => Uint8Array;
  subtle: {
    digest: {
      (method: string, seed: Uint8Array): typeof CryptoOperation | PromiseLike<ArrayBuffer>;
    };
  };
};

declare const CryptoOperation: {
  [index: string]: unknown;
};

export function getPkce(
  length: number,
  callback: (error: unknown, value?: { verifier: string; challenge: string }) => unknown | void
): void {
  if (!length) length = 44;
  const cryptoLib = msCrypto || crypto;
  const randomNumbers = cryptoLib.getRandomValues(new Uint8Array(length / 2));
  let verifier = '';
  for (let i = 0; i < randomNumbers.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    verifier += ('0' + randomNumbers[i].toString(16)).substr(-2);
  }
  const digest = cryptoLib.subtle.digest('SHA-256', randomNumbers);

  if (CryptoOperation) {
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
      .catch(callback);
  }
}
