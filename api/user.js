var dbcon = require('../server');
var base64 = require('base-64');
var md5 = require('md5');
var moment = require('moment');
var fs = require('fs');
const { validationResult } = require('express-validator');
const mysql=require("mysql");
const jwt = require("jsonwebtoken");
const {numberGenerator}=require("../common/common");
const common = require('../common/common');

module.exports={

    register:async(req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            //console.log(errors.mapped());
            res.json({
                status:false,
                error: errors.mapped(),
                data:[],
                msg:"All fields required"
            });
                
        }else{

            const {firstname,lastname,email,phone,country,address,no_shipment,password,confirm_password}=req.body;



            var sql=`select * from users where email=${mysql.escape(email)}`;

            const email_exits=await new Promise((resolve,reject)=>{
                dbcon.db.query(sql,(err,result)=>{
                    if(err) throw err;
                    if(result.length >0 )
                    resolve(true)
                    else
                    resolve(false)
                })
            })


            if(!email_exits)
            {

                if(password===confirm_password)
                {
                    var sql=`INSERT INTO users set 
                    firstname=${mysql.escape(firstname)},
                    lastname=${mysql.escape(lastname)},
                    email=${mysql.escape(email)},
                    phone=${mysql.escape(phone)},
                    country=${mysql.escape(country)},
                    address=${mysql.escape(address)},
                    no_shipment=${mysql.escape(no_shipment)},
                    password=${mysql.escape(md5(base64.encode(password)))},
                    created_at=NOW() `;

                    dbcon.db.query(sql,(err,result)=>{
                        if(err) throw err;
                        res.json({
                            status:true,
                            error: {},
                            data:[],
                            msg:"Sign up successfull"
                            })
                    })

                }else{

                    res.json({
                        status:false,
                        error: {},
                        data:[],
                        msg:"password and confirm password do not match!"
                        })

                }

                


            }else{
                res.json({
                status:false,
                error: {},
                data:[],
                msg:"Email allready exits!"
                })
            }


        }

    },

    login:async(req,res)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            //console.log(errors.mapped());
            res.json({
                status:false,
                error: errors.mapped(),
                data:[],
                msg:"All fields required"
            });
                
        }
        else{

            const {email,password}=req.body;
            console.log(password);
            var npassword = md5(base64.encode(password));

            var sql=`select * from users where email=${mysql.escape(email)} AND password=${mysql.escape(npassword)} `;

            

            dbcon.db.query(sql,(err,result)=>{
                if(err) throw err;
                if(result.length >0 )
               {

                const token = jwt.sign(
                    {
                      id: result[0].id,
                      email: result[0].email,
                    },
                    process.env.jwt_secret_key,
                    { expiresIn: "5d" }
                  );

                res.json({
                    status:true,
                    error: {},
                    data:[{
                        firstname:result[0].firstname,
                        lastname:result[0].lastname,
                        email:result[0].email,
                        phone:result[0].phone,
                        country:result[0].country,
                        address:result[0].address,
                        email_verification_status:result[0].email_verification_status,
                        status:result[0].status
                    }],
                    msg:"Login successfull",
                    token:token
                });
               }
                else
               {
                res.json({
                    status:false,
                    error: {},
                    data:[],
                    msg:"Invalid user!",
                   
                });
               }
            })


        }
    },

    sendEmailVarificationCode:(req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            //console.log(errors.mapped());
            res.json({
                status:false,
                error: errors.mapped(),
                data:[],
                msg:"All fields required"
            });
                
        }else{

            const {email}=req.body;
            var code = numberGenerator(6);
            var sql=`update users set email_verification_code=${mysql.escape(code)},updated_at=NOW() where email=${mysql.escape(email)} `;

            dbcon.db.query(sql,(err,result)=>{
                if(err) throw err;


                var mailOptions = {
                    from: 'noreply@elvirainfotech.org',
                    to: email,
                    subject: 'Nettrux Email Verification Code',
                    html: `<head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="x-apple-disable-message-reformatting">
                    <title></title>
                
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
                
                    <style>
                        html,
                        body {
                            font-family: 'Roboto', sans-serif;
                            margin: 0 auto !important;
                            padding: 0 !important;
                            height: 100% !important;
                            width: 100% !important;
                            background: #f1f1f1;
                        }
                        
                        * {
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                        }
                        
                        div[style*="margin: 16px 0"] {
                            margin: 0 !important;
                        }
                        
                        table,
                        td {
                            mso-table-lspace: 0pt !important;
                            mso-table-rspace: 0pt !important;
                        }
                        
                        table {
                            border-spacing: 0 !important;
                            border-collapse: collapse !important;
                            table-layout: fixed !important;
                            margin: 0 auto !important;
                        }
                        
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                        
                        a {
                            text-decoration: none;
                        }
                        
                        *[x-apple-data-detectors],
                        .unstyle-auto-detected-links *,
                        .aBn {
                            border-bottom: 0 !important;
                            cursor: default !important;
                            color: inherit !important;
                            text-decoration: none !important;
                            font-size: inherit !important;
                            font-family: inherit !important;
                            font-weight: inherit !important;
                            line-height: inherit !important;
                        }
                        
                        .a6S {
                            display: none !important;
                            opacity: 0.01 !important;
                        }
                        
                        .im {
                            color: inherit !important;
                        }
                        
                        img.g-img + div {
                            display: none !important;
                        }
                        
                        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                            u ~ div .email-container {
                                min-width: 320px !important;
                            }
                        }
                        
                        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                            u ~ div .email-container {
                                min-width: 375px !important;
                            }
                        }
                        
                        @media only screen and (min-device-width: 414px) {
                            u ~ div .email-container {
                                min-width: 414px !important;
                            }
                        }
                    </style>
                
                    <style>
                        .primary {
                            background: #f3a333;
                        }
                        
                        .bg_white {
                            background: #ffffff;
                        }
                        
                        .bg_light {
                            background: #fafafa;
                        }
                        
                        .bg_black {
                            background: #000000;
                        }
                        
                        .bg_dark {
                            background: rgba(0, 0, 0, .8);
                        }
                        
                        .email-section {
                            /*padding: 2.5em;*/
                        }
                        
                        .btn {
                            padding: 10px 15px;
                        }
                        
                        .btn.btn-primary {
                            border-radius: 0;
                            background: #630c0d;
                            color: #ffffff;
                        }
                        
                        h1,
                        h2,
                        h3,
                        h4,
                        h5,
                        h6 {
                            font-family: 'Playfair Display', serif;
                            color: #000000;
                            margin-top: 0;
                        }
                        
                        body {
                            font-family: 'Montserrat', sans-serif;
                            font-weight: 400;
                            font-size: 15px;
                            line-height: 1.8;
                            color: rgba(0, 0, 0, .4);
                        }
                        
                        a {
                            color: #1155cc;
                        }
                        
                        table {}
                        /*LOGO*/
                        
                        .logo h1 {
                            margin: 0;
                        }
                        
                        .logo h1 a {
                            color: #000;
                            font-size: 20px;
                            font-weight: 700;
                            text-transform: uppercase;
                            font-family: 'Montserrat', sans-serif;
                        }
                        
                        .hero {
                            position: relative;
                        }
                        
                        .hero img {}
                        
                        .hero .text {
                            color: rgba(255, 255, 255, .8);
                        }
                        
                        .hero .text h2 {
                            color: #ffffff;
                            font-size: 26px;
                            margin-bottom: 0;
                            line-height:30px;
                        }
                        
                        .heading-section {}
                        
                        .heading-section h2 {
                            color: #000000;
                            font-size: 28px;
                            margin-top: 0;
                            line-height: 1.4;
                        }
                        
                        .heading-section .subheading {
                            margin-bottom: 20px !important;
                            display: inline-block;
                            font-size: 13px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            color: rgb(99, 12, 13);
                            position: relative;
                        }
                        
                        .heading-section .subheading::after {
                            position: absolute;
                            left: 0;
                            right: 0;
                            bottom: -10px;
                            content: '';
                            width: 100%;
                            height: 2px;
                            background: #630c0d;
                            margin: 0 auto;
                        }
                        
                        .heading-section-white {
                            color: rgba(255, 255, 255, .8);
                        }
                        
                        .heading-section-white h2 {
                            font-size: 28px;
                            font-family: line-height: 1;
                            padding-bottom: 0;
                        }
                        
                        .heading-section-white h2 {
                            color: #ffffff;
                        }
                        
                        .heading-section-white .subheading {
                            margin-bottom: 0;
                            display: inline-block;
                            font-size: 13px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            color: rgba(255, 255, 255, .4);
                        }
                        
                        .icon {
                            text-align: center;
                        }
                        
                        .icon img {}
                        
                        .text-services {
                            padding: 10px 10px 0;
                            text-align: center;
                        }
                        
                        .text-services h3 {
                            font-size: 20px;
                        }
                        
                        .text-services .meta {
                            text-transform: uppercase;
                            font-size: 14px;
                        }
                        
                        .text-testimony .name {
                            margin: 0;
                        }
                        
                        .text-testimony .position {
                            color: rgba(0, 0, 0, .3);
                        }
                        
                        .img {
                            width: 100%;
                            height: auto;
                            position: relative;
                        }
                        
                        .img .icon {
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin-top: -25px;
                        }
                        
                        .img .icon a {
                            display: block;
                            width: 60px;
                            position: absolute;
                            top: 0;
                            left: 50%;
                            margin-left: -25px;
                        }
                        
                        .counter-text {
                            text-align: center;
                        }
                        
                        .counter-text .num {
                            display: block;
                            color: #ffffff;
                            font-size: 34px;
                            font-weight: 700;
                        }
                        
                        .counter-text .name {
                            display: block;
                            color: rgba(255, 255, 255, .9);
                            font-size: 13px;
                        }
                        
                        .footer {
                            color: rgba(255, 255, 255, .5);
                        }
                        
                        .footer .heading {
                            color: #ffffff;
                            font-size: 20px;
                        }
                        
                        .footer ul {
                            margin: 0;
                            padding: 0;
                        }
                        
                        .footer ul li {
                            list-style: none;
                            margin-bottom: 10px;
                        }
                        
                        .footer ul li a {
                            color: rgba(255, 255, 255, 1);
                        }
                        
                        @media screen and (max-width: 500px) {
                            .icon {
                                text-align: left;
                            }
                            .text-services {
                                padding-left: 0;
                                padding-right: 20px;
                                text-align: left;
                            }
                        }
                    </style>
                </head>
                
                <body width="100%" style="background:#fff; margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
                    <center style="width: 100%; background-color: #f1f1f1;">
                        <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                        </div>
                        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
                            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                                <tr>
                                    <td class="bg_white logo" style="padding: 1em 2.5em 0; text-align: center">
                                        <h1><a href="#"><img src="https://nettruxbackend.elvirainfotech.org/logo/blue-logo.svg" alt="" style="width:210px"></a></h1>
                                    </td>
                                </tr>
                                <tr style="background:#fff;">
                                    <td valign="middle" class="hero" style="background:#a9c6dd;  border-radius:30px 30px 0 0;">
                                        <a href="#" style="display: block; padding:20px 0;">
                                            <table>
                                                <tr>
                                                    <td>
                                                        <div class="text" style="padding:0; text-align: center;">
                                                            <h2 style="font-weight:bold;color:'#fff'">Welcome to Nettrux</h2>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                
                                    <td class="bg_white" style="text-align:left; width:100%; padding:20px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding:0 20px; text-align:center;">
                                                    <p style="color:#000; font-size:16px; margin:0 0 10px 0;"><strong><i>WE CONNECT FOR A REASON</i></strong></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 20px; text-align:center;">
                                                    <p style="color:#000; font-size:16px; margin:0 0 0px 0;"><strong>Your verification code is.</strong></p>
                                                </td>
                                            </tr>

                                            <tr>
                                            <td style="padding:0 20px; text-align:center;">
                                                <p style="color:#000; font-size:16px; margin:0 0 0px 0;"><strong>Verification Code: </strong>${code}</p>
                                            </td>
                                            </tr>
                                           
                                            
                                            
                                        </table>
                                    </td>
                                
                                </tr>
                                <tr style="background:#fff;">
                                    <td valign="middle" class="hero" style="background:#a9c6dd;  border-radius:0 0 30px 30px;">
                                        <a href="#" style="display: block; padding:20px 0;">
                                            <table>
                                                <tr>
                                                    <td>
                                                        <div class="text" style="padding:0; text-align: center; height:20px;">
                                                            
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </center>
                </body>`,
                };

                dbcon.transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });



                res.json({
                    status:true,
                    error: {},
                    data:[{"code":code}],
                    msg:"code send your email "
                    })
            })


        }

        

    },

    confirmEmailVarificationCode:async(req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            //console.log(errors.mapped());
            res.json({
                status:false,
                error: errors.mapped(),
                data:[],
                msg:"All fields required"
            });
                
        }else{

            const {email,code}=req.body;

            var sql=`select * from users where email=${mysql.escape(email)} and email_verification_code=${mysql.escape(code)}`;

            var VarificationCodeStatus=await new Promise((resolve,reject)=>{
                dbcon.db.query(sql,(err,result)=>{
                    if(err) throw err;
                    if(result.length>0)
                    resolve(true)
                    else
                    resolve(false)
                })
            })

            if(VarificationCodeStatus)
            {
                var sql=`update users set email_verification_status='1',updated_at=NOW() where email=${mysql.escape(email)} `;

                dbcon.db.query(sql,(err,result)=>{
                    if(err) throw err;
                    res.json({
                        status:true,
                        error: {},
                        data:[],
                        msg:"email verification successfully"
                        })
                })
            }else{

                res.json({
                    status:false,
                    error: {},
                    data:[],
                    msg:"code not match!"
                    })

            }
            
            


        }

        

    },

    getUserOne:(req,res)=>{

        const {email}=req.body;

        var sql=`select * from users where email=${mysql.escape(email)}`;

        dbcon.db.query(sql,(err,result)=>{
            if(err) throw err;
            if(result.length >0 )
           {
            res.json({
                status:true,
                error: {},
                data:result,
                msg:"record found"
            });
           }
            else
            {
                res.json({
                    status:false,
                    error: {},
                    data:[],
                    msg:"record not found"
                });
            }
        })
    },

    

    forgetPasswordEmailSend:async(req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            //console.log(errors.mapped());
            res.json({
                status:false,
                error: errors.mapped(),
                data:[],
                msg:"All fields required"
            });
                
        }else{
            const {email}=req.body;

            var sql=`select * from users where email=${mysql.escape(email)}`;

            var email_verification_status=await new Promise((resolve,reject)=>{
                dbcon.db.query(sql,(err,result)=>{
                    if(err) throw err;
                    if(result.length>0)
                    {
                        if(result[0].email_verification_status==1)
                        {
                            resolve(true)
                        }else{
                            resolve(false)
                        }
                    }
                    else
                    {
                        resolve(false)
                    }
                })
            });

            if(email_verification_status)
            {

                var verficationcode = md5(base64.encode(email));

                var sql=`update users set user_verification_code=${mysql.escape(verficationcode)},user_verification_time=NOW() where email=${mysql.escape(email)}`;

                dbcon.db.query(sql,(err,result)=>{
                    if(err) throw err;

                    var linkset = base64.encode(email);
                    var mailOptions = {
                        from: 'noreply@elvirainfotech.org',
                        to: email,
                        subject: 'Nettrux Forget Password Link',
                        html: `<head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="x-apple-disable-message-reformatting">
                        <title></title>
                    
                        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
                    
                        <style>
                            html,
                            body {
                                font-family: 'Roboto', sans-serif;
                                margin: 0 auto !important;
                                padding: 0 !important;
                                height: 100% !important;
                                width: 100% !important;
                                background: #f1f1f1;
                            }
                            
                            * {
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                            }
                            
                            div[style*="margin: 16px 0"] {
                                margin: 0 !important;
                            }
                            
                            table,
                            td {
                                mso-table-lspace: 0pt !important;
                                mso-table-rspace: 0pt !important;
                            }
                            
                            table {
                                border-spacing: 0 !important;
                                border-collapse: collapse !important;
                                table-layout: fixed !important;
                                margin: 0 auto !important;
                            }
                            
                            img {
                                -ms-interpolation-mode: bicubic;
                            }
                            
                            a {
                                text-decoration: none;
                            }
                            
                            *[x-apple-data-detectors],
                            .unstyle-auto-detected-links *,
                            .aBn {
                                border-bottom: 0 !important;
                                cursor: default !important;
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }
                            
                            .a6S {
                                display: none !important;
                                opacity: 0.01 !important;
                            }
                            
                            .im {
                                color: inherit !important;
                            }
                            
                            img.g-img + div {
                                display: none !important;
                            }
                            
                            @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                                u ~ div .email-container {
                                    min-width: 320px !important;
                                }
                            }
                            
                            @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                                u ~ div .email-container {
                                    min-width: 375px !important;
                                }
                            }
                            
                            @media only screen and (min-device-width: 414px) {
                                u ~ div .email-container {
                                    min-width: 414px !important;
                                }
                            }
                        </style>
                    
                        <style>
                            .primary {
                                background: #f3a333;
                            }
                            
                            .bg_white {
                                background: #ffffff;
                            }
                            
                            .bg_light {
                                background: #fafafa;
                            }
                            
                            .bg_black {
                                background: #000000;
                            }
                            
                            .bg_dark {
                                background: rgba(0, 0, 0, .8);
                            }
                            
                            .email-section {
                                /*padding: 2.5em;*/
                            }
                            
                            .btn {
                                padding: 10px 15px;
                            }
                            
                            .btn.btn-primary {
                                border-radius: 0;
                                background: #630c0d;
                                color: #ffffff;
                            }
                            
                            h1,
                            h2,
                            h3,
                            h4,
                            h5,
                            h6 {
                                font-family: 'Playfair Display', serif;
                                color: #000000;
                                margin-top: 0;
                            }
                            
                            body {
                                font-family: 'Montserrat', sans-serif;
                                font-weight: 400;
                                font-size: 15px;
                                line-height: 1.8;
                                color: rgba(0, 0, 0, .4);
                            }
                            
                            a {
                                color: #1155cc;
                            }
                            
                            table {}
                            /*LOGO*/
                            
                            .logo h1 {
                                margin: 0;
                            }
                            
                            .logo h1 a {
                                color: #000;
                                font-size: 20px;
                                font-weight: 700;
                                text-transform: uppercase;
                                font-family: 'Montserrat', sans-serif;
                            }
                            
                            .hero {
                                position: relative;
                            }
                            
                            .hero img {}
                            
                            .hero .text {
                                color: rgba(255, 255, 255, .8);
                            }
                            
                            .hero .text h2 {
                                color: #ffffff;
                                font-size: 26px;
                                margin-bottom: 0;
                                line-height:30px;
                            }
                            
                            .heading-section {}
                            
                            .heading-section h2 {
                                color: #000000;
                                font-size: 28px;
                                margin-top: 0;
                                line-height: 1.4;
                            }
                            
                            .heading-section .subheading {
                                margin-bottom: 20px !important;
                                display: inline-block;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 2px;
                                color: rgb(99, 12, 13);
                                position: relative;
                            }
                            
                            .heading-section .subheading::after {
                                position: absolute;
                                left: 0;
                                right: 0;
                                bottom: -10px;
                                content: '';
                                width: 100%;
                                height: 2px;
                                background: #630c0d;
                                margin: 0 auto;
                            }
                            
                            .heading-section-white {
                                color: rgba(255, 255, 255, .8);
                            }
                            
                            .heading-section-white h2 {
                                font-size: 28px;
                                font-family: line-height: 1;
                                padding-bottom: 0;
                            }
                            
                            .heading-section-white h2 {
                                color: #ffffff;
                            }
                            
                            .heading-section-white .subheading {
                                margin-bottom: 0;
                                display: inline-block;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 2px;
                                color: rgba(255, 255, 255, .4);
                            }
                            
                            .icon {
                                text-align: center;
                            }
                            
                            .icon img {}
                            
                            .text-services {
                                padding: 10px 10px 0;
                                text-align: center;
                            }
                            
                            .text-services h3 {
                                font-size: 20px;
                            }
                            
                            .text-services .meta {
                                text-transform: uppercase;
                                font-size: 14px;
                            }
                            
                            .text-testimony .name {
                                margin: 0;
                            }
                            
                            .text-testimony .position {
                                color: rgba(0, 0, 0, .3);
                            }
                            
                            .img {
                                width: 100%;
                                height: auto;
                                position: relative;
                            }
                            
                            .img .icon {
                                position: absolute;
                                top: 50%;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                margin-top: -25px;
                            }
                            
                            .img .icon a {
                                display: block;
                                width: 60px;
                                position: absolute;
                                top: 0;
                                left: 50%;
                                margin-left: -25px;
                            }
                            
                            .counter-text {
                                text-align: center;
                            }
                            
                            .counter-text .num {
                                display: block;
                                color: #ffffff;
                                font-size: 34px;
                                font-weight: 700;
                            }
                            
                            .counter-text .name {
                                display: block;
                                color: rgba(255, 255, 255, .9);
                                font-size: 13px;
                            }
                            
                            .footer {
                                color: rgba(255, 255, 255, .5);
                            }
                            
                            .footer .heading {
                                color: #ffffff;
                                font-size: 20px;
                            }
                            
                            .footer ul {
                                margin: 0;
                                padding: 0;
                            }
                            
                            .footer ul li {
                                list-style: none;
                                margin-bottom: 10px;
                            }
                            
                            .footer ul li a {
                                color: rgba(255, 255, 255, 1);
                            }
                            
                            @media screen and (max-width: 500px) {
                                .icon {
                                    text-align: left;
                                }
                                .text-services {
                                    padding-left: 0;
                                    padding-right: 20px;
                                    text-align: left;
                                }
                            }
                        </style>
                    </head>
                    
                    <body width="100%" style="background:#fff; margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
                        <center style="width: 100%; background-color: #f1f1f1;">
                            <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                                &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                            </div>
                            <div style="max-width: 600px; margin: 0 auto;" class="email-container">
                                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                                    <tr>
                                        <td class="bg_white logo" style="padding: 1em 2.5em 0; text-align: center">
                                            <h1><a href="#"><img src="https://nettruxbackend.elvirainfotech.org/logo/blue-logo.svg" alt="" style="width:210px"></a></h1>
                                        </td>
                                    </tr>
                                    <tr style="background:#fff;">
                                        <td valign="middle" class="hero" style="background:#a9c6dd;  border-radius:30px 30px 0 0;">
                                            <a href="#" style="display: block; padding:20px 0;">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <div class="text" style="padding:0; text-align: center;">
                                                                <h2 style="font-weight:bold;color:'#fff'">Welcome to Nettrux</h2>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                    
                                        <td class="bg_white" style="text-align:left; width:100%; padding:20px 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="padding:0 20px; text-align:center;">
                                                        <p style="color:#000; font-size:16px; margin:0 0 10px 0;"><strong><i>WE CONNECT FOR A REASON</i></strong></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 20px; text-align:center;">
                                                        <p style="color:#000; font-size:16px; margin:0 0 0px 0;"><strong>Click below to change your account password.</strong></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                <td style="padding:0 20px; text-align:center;">
                                                    <p style="color:#000; font-size:16px; margin:0 0 0px 0;"><strong>Link valid for 24 hours.</strong></p>
                                                </td>
                                            </tr>
                                                <tr>
                                                    <td style="padding:10px 20px 20px; text-align:center;">
                                                        <a href="${process.env.font_url}/${verficationcode}/${linkset}" style="display:inline-block; background:#1155cc; font-size:14px; line-height:16px; font-weight:bold; color:#fff;padding:8px 25px; border-radius:30px; ">Active Now</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 20px; text-align:center;">
                                                        <a href="${process.env.font_url}/${verficationcode}/${linkset}" style="color:#1155cc; display:inline-block; font-size:20px; line-height:22px;">${process.env.font_url}/${verficationcode}/${linkset}</a>
                                                    </td>
                                                </tr>
                                                
                                            </table>
                                        </td>
                                    
                                    </tr>
                                    <tr style="background:#fff;">
                                        <td valign="middle" class="hero" style="background:#a9c6dd;  border-radius:0 0 30px 30px;">
                                            <a href="#" style="display: block; padding:20px 0;">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <div class="text" style="padding:0; text-align: center; height:20px;">
                                                                
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </center>
                    </body>`,
                    };

                    dbcon.transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    res.json({
                        status:true,
                        error: {},
                        data:[],
                        msg:"Link send to email "
                    });

                    })
            }else{
                res.json({
                    status:false,
                    error: {},
                    data:[],
                    msg:"Email not verified!"
                });
            }

        }
    },


    accountVerify: (req, res) => {

        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            //console.log(errors.mapped());
            res.json({
                status:false,
                error: errors.mapped(),
                data:[],
                msg:"All fields required"
            });
                
        }
        else{

        var code = req.body.activecode;
        var user = req.body.email;
        if((code != '') && (user != ""))
        {
            var getemail = base64.decode(user);

            let checksql = "SELECT * from `users` where email = '"+getemail+"' AND user_verification_code = '"+code+"' ";

               

            dbcon.db.query(checksql, (err, checkresult) => {
                if(err) throw err;
                if(checkresult.length > 0)
                {


                    var timestring1 = checkresult[0].user_verification_time;
                    var currentTimestamp = moment.utc();
                    var startdate = moment(timestring1);
                    var expected_enddate = startdate.add(moment.duration(24, 'hours'));
                    var time_status=false;

                    if( currentTimestamp <= expected_enddate)
                    {
                        time_status=true;
                    }
                    

                    if(time_status)
                    {

                        res.json({
                            status:true,
                            error: {},
                            data:[],
                            msg:"Account verify"
                            })

                    }else{


                        let updatever = "UPDATE `users` set user_verification_code = NULL,user_verification_time=NULL  where email = '"+getemail+"' ";
                        dbcon.db.query(updatever, (err, updres) => {
                            if(err) throw err;
    
                            res.json({
                                status:false,
                                error: {},
                                data:[],
                                msg:"Sorry! Link is Expired..."
                                })
                        });

                      
                    }

                }else{
                   

                    res.json({
                        status:false,
                        error: {},
                        data:[],
                        msg:"Sorry! Link is Expired..."
                        })
                }
            });

        }else{
          

            res.json({
                status:false,
                error: {},
                data:[],
                msg:"Sorry! Something went wrong..."
                })
        }
     }
    },

    changePassword:(req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            //console.log(errors.mapped());
            res.json({
                status:false,
                error: errors.mapped(),
                data:[],
                msg:"All fields required"
            });
                
        }else{
            const {password,confirm_password,email} =req.body;

            if(password===confirm_password)
            {
               var npassword = md5(base64.encode(password));

               var sql=`update users set password=${mysql.escape(npassword)},updated_at=NOW() where email=${mysql.escape(email)}`;

               dbcon.db.query(sql,(err,result)=>{
                    if(err) throw err;

                    res.json({
                        status:true,
                        error: {},
                        data:[],
                        msg:"password change successfull"
                    });
               })

            }else{

                res.json({
                    status:false,
                    error: {},
                    data:[],
                    msg:"password not match"
                });
            }
        }

    }


    

} 