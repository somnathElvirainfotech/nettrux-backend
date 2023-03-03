const router = require('express').Router();
const {check, validationResult} = require ('express-validator');

///// multer midleware   ///////
const upload = require ('../middleware/upload');
var imgOptions = [{name: 'logo', maxCount: 1},{name:"hero_image",maxCount:1}];
/////  multer midleware  ///////

const {test}=require("../api/test");
const {getAllCountry,getAllState,getAllCity,getOneState,getOneCity} =require("../api/country-state-city")
const {login,register,sendEmailVarificationCode,confirmEmailVarificationCode,getUserOne,forgetPasswordEmailSend,accountVerify,changePassword}=require("../api/user");




////// Routes ////////

router.get("/test",test);

router.get("/country",getAllCountry);
router.get("/state",getAllState);
router.get("/city",getAllCity);
router.get("/state/:id",getOneState);
router.get("/city/:id",getOneCity);

router.post('/register',[
    check('firstname').not().isEmpty().withMessage('Firstname should not be blank'),
    check('lastname').not().isEmpty().withMessage('Lastname should not be blank'),
    check('email').not().isEmpty().withMessage('Email should not be blank').isEmail().withMessage('Enter valid Email Id'),
    check('password', 'Password should not be blank').not().isEmpty(),
    check('confirm_password', 'Confirm Password should not be blank').not().isEmpty(),
    check('country').not().isEmpty().withMessage('Country should not be blank'),
    check('address').not().isEmpty().withMessage('Address should not be blank'),
    check('phone').not().isEmpty().withMessage('Phone No should not be blank').matches(/\d/).withMessage('must contain a number').isLength({ min: 10, max: 10 })
    .withMessage("phone number have length must 10"),
    check('no_shipment').not().isEmpty().withMessage('No of shipment should not be blank').matches(/\d/).withMessage('must contain a number'),
]
,register);


router.post('/login',[
    check('email').not().isEmpty().withMessage('Email should not be blank').isEmail().withMessage('Enter valid Email Id'),
    check('password', 'Password should not be blank').not().isEmpty(),
],login);

router.post('/send-email-varification-code',[
    check('email').not().isEmpty().withMessage('Email should not be blank').isEmail().withMessage('Enter valid Email Id'),
],sendEmailVarificationCode);

router.post('/confirm-email-varification-code',[
    check('email').not().isEmpty().withMessage('Email should not be blank').isEmail().withMessage('Enter valid Email Id'),
    check('code').not().isEmpty().withMessage('code should not be blank').matches(/\d/).withMessage('must contain a number').isLength({ min: 6, max: 6 })
    .withMessage("your code should have length must 6"),
],confirmEmailVarificationCode);

router.post('/get-one-use',[
    check('email').not().isEmpty().withMessage('Email should not be blank').isEmail().withMessage('Enter valid Email Id'),
],getUserOne);

router.post('/forget-password-email-send',[
    check('email').not().isEmpty().withMessage('Email should not be blank').isEmail().withMessage('Enter valid Email Id'),
],forgetPasswordEmailSend);

router.post('/account-verify',[
    check('activecode').not().isEmpty().withMessage('Activecode should not be blank'),
    check('email').not().isEmpty().withMessage('Email should not be blank'),
],accountVerify);



router.post('/change-password',[
    check('email').not().isEmpty().withMessage('Email should not be blank').isEmail().withMessage('Enter valid Email Id'),
    check('password', 'Password should not be blank').not().isEmpty(),
    check('confirm_password', 'Confirm Password should not be blank').not().isEmpty(),
],changePassword);







module.exports=router;