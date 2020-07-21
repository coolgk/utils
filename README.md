# Helper Functions

## [OAUTH PKCE code_verifier and code_challenge Generator for IE 11 and Modern Browsers](./oauth-pkce)

A small (409-Byte gzipped) zero-dependency helper function for generating a high-entropy cryptographic random **"code_verifier"** (using [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)) and its **"code_challenge"** based on [RFC 7636](https://tools.ietf.org/html/rfc7636#section-4.1). (i.e. `BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))`)
