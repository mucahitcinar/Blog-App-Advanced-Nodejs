const AWS = require('aws-sdk')
const keys = require('../config/keys')
const { v4: uuidv4 } = require('uuid');
const requireLogin = require("./../middlewares/requireLogin")
const s3 = new AWS.S3({
    credentials: {
        accessKeyId: keys.accessKeyId,
        secretAccessKey: keys.secretAccessKey,
    },
    region: 'eu-north-1',
});

module.exports = app => {


    app.get('/api/upload', (req, res) => {

        const key = `${req.user.id}/${uuidv4()}.jpeg`
        s3.getSignedUrl('putObject',
            {
                Bucket: 'my-new-bucket-3131',
                ContentType: 'image/jpeg',
                Key: key
            }, (err, url) => res.send({ key, url }))

    })
}