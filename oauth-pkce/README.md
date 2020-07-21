# OAUTH PKCE code_verifier and code_challenge

Spec [https://tools.ietf.org/html/rfc7636#section-4.1](https://tools.ietf.org/html/rfc7636#section-4.1)

A small front-end helper function for generating a high-entropy cryptographic random **"code_verifier"** using [crypto-js](https://www.npmjs.com/package/crypto-js) and its **"code_challenge"** based on the formula `BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))` from the [spec](https://tools.ietf.org/html/rfc7636#section-4.1).

## Usage

```javasript

``

## Browser Compatibility

see [crypto-js](https://www.npmjs.com/package/crypto-js)
```
