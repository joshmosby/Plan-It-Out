var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/uploads/')
        },
        filename: function(req, file, cb) { cb(null, file.originalname) }
    })
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/index', { title: 'Express' });
});

router.post('/', upload.any(), function(req, res, next) {
    //console.log(req.files);
    res.redirect('/uploaded');

});

router.get('/uploads', function(req, res, next) {
    res.redirect('/uploaded');
});

router.get('/uploads', function(req, res, next) {
    res.render('index', { title: 'File Uploaded!' });
});


module.exports = router;