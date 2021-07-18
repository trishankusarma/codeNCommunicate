const multer = require('multer')

const upload = multer({
    
    limits: {
      fileSize: 1000000,
    },
    
    fileFilter(req, file, cb) {
    
      if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG)$/)) {

        return cb("Please provide an image!",false)
      }
    
      cb(undefined, true)
    }
})

module.exports = upload