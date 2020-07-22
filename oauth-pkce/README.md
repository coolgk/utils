# OAUTH PKCE code_verifier and code_challenge Generator for IE 11 and Modern Browsers

[Proof Key for Code Exchange Spec](https://tools.ietf.org/html/rfc7636#section-4.1)

A small (409-Byte gzipped) zero-dependency helper function for generating a high-entropy cryptographic random **"code_verifier"** (using [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)) and its **"code_challenge"** based on [RFC 7636](https://tools.ietf.org/html/rfc7636#section-4.1). (i.e. `BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))`)

_This package does NOT use [Math.random()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) which does not provide cryptographically secure random numbers, and should not use them for anything related to security._

## Browser ONLY

This package is for browsers only (including IE 11), it uses [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) for generating random strings and SHA-256 hashing.

## CDN

https://cdn.jsdelivr.net/npm/oauth-pkce@latest/dist/oauth-pkce.min.js

or with version

https://cdn.jsdelivr.net/npm/oauth-pkce@0.0.2/dist/oauth-pkce.min.js

## Usage

`npm i oauth-pkce`

Typescript Ready

```javascript
import getPkce from 'oauth-pkce';

// create a verifier of 43 characters long
getPkce(43, (error, { verifier, challenge }) => {
  if (!error) {
    console.log({ verifier, challenge });
  }
});

// { verifier: "uxr7S_52pCoOPFpPPYWNvdw76k3ZnSN-J0PvD0iPL9B", challenge: "8L_tpjLD-Vcc3-G6ea2ifym8AQrushivXHMib5zPp1A" }
```

Use directly from CDN

```javascript
<script src="https://cdn.jsdelivr.net/npm/oauth-pkce@0.0.2/dist/oauth-pkce.min.js" async defer></script>;

getPkce(43, (error, { verifier, challenge }) => {
  if (!error) {
    console.log({ verifier, challenge });
  }
});
```

React

```javascript
import React, { useEffect, useState } from 'react';
import getPkce from 'oauth-pkce';

function Pkce() {
  const { pkce, setPkce } = useState({});

  useEffect(() => {
    // getPkce relies on the window object for its crypto api
    // put in in useEffect
    getPkce(50, (error, { verifier, challenge }) => {
      setPkce({ verifier, challenge });
    });
  }, []);

  return (
    <div>
      {pkce.verifier} | {pkce.challenge}
    </div>
  );
}
```

This package uses callback style for minimising code size and compatibility with IE 11. Wrapp it in a Promise if you prefer async await style.

```javascript
const { verifier, challenge } = await new Promise((resolve) => {
  getPkce(43, (error, { verifier, challenge }) => {
    if (error) throw error;
    resolve({ verifier, challenge });
  });
});
```

### Server Side code_verifier Verification

For node environment, use [crypto module](https://nodejs.org/api/crypto.html) natively from node.

```javascript
import crypto from 'crypto';

const base64 = crypto.createHash('sha256').update(code_verifier).digest('base64');
const base64UriEncoded = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const isValid = base64UriEncoded === code_challenge;
```

code_challenge is a Base64URL encoded string ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5)). To verify the `code_verifier` you need to convert the base64 value of `crypto.createHash('sha256').update(code_verifier).digest('base64')` to a **base64url** encoded string.

_In `getPkce()`, base64url removes the pad characters "=" from code_challenge_

## API

```typescript
getPkce(
  codeVerifierLength: number = 43,
  callback: (error: Error | null, value: { verifier: string; challenge: string })
)
```
