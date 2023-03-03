var dbcon = require('../server');
var mysql=require('mysql');

module.exports={

    getAllCountry:(req,res)=>{

        var sql=`select * from countries `;
        dbcon.db.query(sql,(err,result)=>{
            if(err) throw err;
            res.json({
                status:true,
                error: {},
                data:result,
                msg:"all countries get"
                })
        })
    },

    getOneCountry:(req,res)=>{

        const {id}=req.params;

        if(id)
        {
        var sql=`select * from countries where id=${mysql.escape(id)}`;
        dbcon.db.query(sql,(err,result)=>{
            if(err) throw err;
            res.json({
                status:true,
                error: {},
                data:result,
                msg:"all countries get"
                })
        })
        }
        else{

            res.json({
                status:false,
                error: {},
                data:{},
                msg:"countri id required!"
                })
        }
    },

    getAllState:(req,res)=>{

        var sql=`select * from states `;
        dbcon.db.query(sql,(err,result)=>{
            if(err) throw err;
            res.json({
                status:true,
                error: {},
                data:result,
                msg:"all states get"
                })
        })
    },

    getOneState:(req,res)=>{

        const {id}=req.params;

        if(id)
        {
        var sql=`select * from states where country_code=${mysql.escape(id)}`;
        dbcon.db.query(sql,(err,result)=>{
            if(err) throw err;
            res.json({
                status:true,
                error: {},
                data:result,
                msg:"all states get"
                })
        })
        }
        else{

            res.json({
                status:false,
                error: {},
                data:{},
                msg:"states id required!"
                })
        }
    },


    getAllCity:(req,res)=>{

        var sql=`select * from cities `;
        dbcon.db.query(sql,(err,result)=>{
            if(err) throw err;
            res.json({
                status:true,
                error: {},
                data:result,
                msg:"all cities get"
                })
        })
    },

    getOneCity:(req,res)=>{

        const {id}=req.params;

        if(id)
        {
        var sql=`select * from cities where state_code=${mysql.escape(id)}`;
        dbcon.db.query(sql,(err,result)=>{
            if(err) throw err;
            res.json({
                status:true,
                error: {},
                data:result,
                msg:"all cities get"
                })
        })
        }
        else{

            res.json({
                status:false,
                error: {},
                data:{},
                msg:"cities id required!"
                })
        }
    },


}