const router = require('express').Router();
const {check, validationResult} = require ('express-validator');

///// multer midleware   ///////
const upload = require ('../middleware/upload');
var imgOptions = [{name: 'logo', maxCount: 1},{name:"hero_image",maxCount:1}];
/////  multer midleware  ///////


const{test,flash}=require("../admin/controllers/test");



////// Routes ////////

router.get ('/', test);
router.get ('/flash', flash);


module.exports=router;