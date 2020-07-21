// import { expect } from 'chai';

// import base64 from 'crypto-js/enc-base64';
// import sha256 from 'crypto-js/sha256';
// import hex from 'crypto-js/enc-hex';

// import getPkce from 'src/index';

// describe('PKCE', () => {
//   context('given no params passed to getPkce()', () => {
//     context('when getPkce() is called', () => {
//       it('should generate a code verifier of 44 characters', (done) => {
//         getPkce(undefined, (error, { verifier, challenge }) => {
//           expect(verifier).to.have.lengthOf(44);
//           expect(challenge).to.equal(sha256(hex.parse(verifier)).toString(base64));
//           done(error);
//         });
//       });
//     });
//   });

//   context('when getPkce(70) is called', () => {
//     it('should generate a code verifier of 70 characters', (done) => {
//       getPkce(undefined, (error, { verifier, challenge }) => {
//         expect(verifier).to.have.lengthOf(70);
//         expect(challenge).to.equal(sha256(hex.parse(verifier)).toString(base64));
//         done(error);
//       });
//     });
//   });
// });
