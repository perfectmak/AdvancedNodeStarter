const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');

module.exports = (user) => {
  const sessionObject = { passport : {
    user: user._id.toString()
  }};
  const session = Buffer.from(JSON.stringify(sessionObject))
    .toString('base64');

  
  const keygrip = Keygrip([keys.cookieKey]);
  const sig = keygrip.sign(`session=${session}`);

  return { session, sig };
}