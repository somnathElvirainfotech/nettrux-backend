const {admin_view_path}=require("../../common/common");

module.exports = {

    test:(req,res)=>{
          res.render(admin_view_path+"test.ejs");
    },

    flash:(req, res) => {

        req.flash("success",'wellcome success');
        req.flash("info",'wellcome info');
        req.flash("error",'wellcome error');
        res.redirect("/admin")
    }
}