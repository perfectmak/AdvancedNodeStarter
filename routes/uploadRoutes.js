const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  region: 'eu-west-2'
});

module.exports = app => {
  app.get('/api/upload', requireLogin, async (req, res) => {
    const key = `${req.user.id}/${uuid()}.png`;

    s3.getSignedUrl('putObject', {
      Bucket: 'sample-node-bucket-123',
      ContentType: 'image/png',
      Key: key
    }, (err, url) => {
      res.send({ key, url });
    });
  });
}