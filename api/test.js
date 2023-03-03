
module.exports={

    test:(req,res)=>{
        res.json({
            status:true,
            data:[],
            msg:"connection ok!"
        })
    }
}