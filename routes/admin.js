var express = require('express');
var router = express.Router();
var pool = require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/adminlogin', function(req, res, next) {
  res.render('loginpage',{message:''});
});


router.post('/check_admin_login', function(req, res, next) {
    try{
    pool.query('select * from admins where (emailid=? or mobileno=? ) and password=?',[req.body.emailid, req.body.emailid, req.body.password], function(error,result){
        if(error){
            res.render('loginpage',{message:'Server Error'});
        }else{
            if(result.length==1){
                localStorage.setItem('ADMIN',JSON.stringify(result))
                res.render('dashboard',{data:result[0],   message:''});
            }else{
                res.render('loginpage',{message:'Invaild EmailId/Mobileno and Password'});
            }

        }
    })
    }catch(e){
        res.render('loginpage',{message:''});
    }
 
});


router.get('/logout', function(req, res, next) {
    localStorage.clear()
    res.render('loginpage',{message:''});
  });



module.exports = router;
