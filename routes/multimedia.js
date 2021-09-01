const path = require('path');
const multer = require('multer');


let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/uploads');
    },
    filename:function(req, file, cb){
        let modifiedName = `redito-${Date.now()+ path.extname(file.originalname)}`
        cb(null, modifiedName);
    }
})


let upload = multer({
    storage:storage,
    fileFilter:function(req, file, cb){
        let fileTypes = /png|jpg|jpeg|svg|gif/;
        let mimeType = fileTypes.test(file.mimetype);
        let extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
        if(mimeType && extname) return cb(null, true);
        cb(`only these ${fileTypes} are accepted `);
    }
});

module.exports = upload;