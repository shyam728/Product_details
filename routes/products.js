var express = require('express');
var router = express.Router();
var pool = require('./pool')
var fs = require('fs')
var upload = require('./multer')

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/productinterface', function(req, res, next) {
  try{
    var admin = JSON.parse(localStorage.getItem ('ADMIN'))
    console.log("admin",admin);
    if(admin==null){
      res.render('loginpage', { message: '' });
    }else{
      res.render('productinterface', { message: '' });
    }
   
  }catch(e){
    res.render('loginpage', { message: '' });
  }
  
 
});


router.post('/productsubmit', upload.single('picture'), function(req, res, next) {
try{
  console.log("data:",req.body);
  console.log('file',req.file);
  pool.query("insert into product(producttypeid, productcatid, description, price, offer, quantity, quanitytype, productpicture, productname) values(?,?,?,?,?,?,?,?,?)",[req.body.producttypeid, req.body.productcatid, req.body.description, req.body.price, req.body.offer, req.body.quantity, req.body.quanitytype, req.file.filename, req.body.productname], function(error,result){
if(error){
  console.log("D error",error);

  res.render('productinterface',{message:"database error"})

}else{
  res.render('productinterface',{message:"product submitted sucessfully"})

}
  } )
}
catch(e){
  console.log("error " ,e);
res.render('productinterface',{message:"server side error"})
}
});


router.get('/fetch_product_type', function(req, res, next) {
  try{
    var admin = JSON.parse(localStorage.getItem ('ADMIN'))
    console.log("admin",admin);
    if(admin==null){
      res.render('loginpage', { message: '' });
    }else{
      pool.query("select * from product_type", function(error,result){
        if(error){
          console.log("D error",error);
        
         res.status(200).json([])
        
        }else{
          res.status(200).json({data:result})
      
        
        }
          } )
    }






 
  }
  catch(e){
    console.log("error " ,e);
    res.render('loginpage', { message: '' });
  }
});




router.get('/fetch_product_category', function(req, res, next) {
  try{
    
    pool.query("select * from productcat where producttypeid=?",[req.query.typeid], function(error,result){
  if(error){
    console.log("D error",error);
  
   res.status(200).json([])
  
  }else{
    res.status(200).json({data:result})

  
  }
    } )
  }
  catch(e){
    console.log("error " ,e);
  res.render('productinterface',{message:"server side error"})
  }
});




router.get('/fetch_all_product', function(req, res, next) {
  try{
    var admin = JSON.parse(localStorage.getItem ('ADMIN'))
    console.log("admin",admin);
    if(admin==null){
      res.render('loginpage', { message: '' });
    }else{
      pool.query("select P.*,(select PT.producttypename from product_type PT where PT.producttypeid=P.producttypeid) as producttypename,(select PC.productcatname from productcat PC where PC.productcatid=P.productcatid) as productcatname from product P ",function (error, result) {

        // pool.query("select p. *,(select pt.producttypename from product_type pt where pt.producttypeid=pt.producttypeid)as producttypename  from  product p", function(error,result){
      if(error){
        console.log("D error",error);
      
       res.render("displayallproducts",{data:[],message:"database error"})
      
      }else{
        res.render("displayallproducts",{data:result, message:"sucess"})
    
      
      }
        } )
      }
    }
   
  catch(e){
    console.log("error " ,e);
    res.render('loginpage', { data:[], message: '' });
  }
});




router.get("/displayforedit", function(req, res, next) {
  try{
    
    pool.query("select P.*,(select PT.producttypename from product_type PT where PT.producttypeid=P.producttypeid) as producttypename,(select PC.productcatname from productcat PC where PC.productcatid=P.productcatid) as productcatname from product P where P.productid=?", [req.query.productid],function (error, result) {

    // pool.query("select p. *,(select pt.producttypename from product_type pt where pt.producttypeid=pt.producttypeid)as producttypename  from  product p", function(error,result){
  if(error){
    console.log("D error",error);
  
   res.render("displayforedits",{data:[],message:"database error"})
  
  }else{

    res.render("displayforedits",{data:result[0], message:"sucess"})

  
  }
    } )
  }
  catch(e){
    console.log("error " ,e);
  res.render('displayforedits',{data:[],message:"server side error"})
  }
});




// router.put("/displayforedit/:id/:name", function(req, res, next) {
//   try{
    
//     pool.query("select P.*,(select PT.producttypename from product_type PT where PT.producttypeid=P.producttypeid) as producttypename,(select PC.productcatname from productcat PC where PC.productcatid=P.productcatid) as productcatname from product P where P.productid=?", [req.query.productid],function (error, result) {

//     // pool.query("select p. *,(select pt.producttypename from product_type pt where pt.producttypeid=pt.producttypeid)as producttypename  from  product p", function(error,result){
//   if(error){
//     console.log("D error",error);
  
//    res.render("displayforedits",{data:[],message:"database error"})
  
//   }else{

//     res.render("displayforedits",{data:result[0], message:"sucess"})

  
//   }
//     } )
//   }
//   catch(e){
//     console.log("error " ,e);
//   res.render('displayforedits',{data:[],message:"server side error"})
//   }
// });



router.post('/edit_product',function(req,res){
  try{
   if(req.body.btn =="Edit"){
    
   pool.query('update product set producttypeid=?, productcatid=?, description=?, price=?, offer=?, quantity=?, quanitytype=?,productname=? where productid=?',
   [req.body.producttypeid, req.body.productcatid, req.body.description, req.body.price, req.body.offer, req.body.quantity, req.body.quanitytype, req.body.productname ,req.body.productid], function(error,result){
    if(error){
      console.log("D error",error);
    
      res.redirect('/products/fetch_all_product')
    
    }else{
      res.redirect('/products/fetch_all_product') 
    
    }
   })
  }else{
   pool.query('delete from product where productid=?',[req.body.productid],function(error,result){
    if(error){
      console.log("D error",error);
    
      res.redirect('/products/fetch_all_product')
    
    }else{
      res.redirect('/products/fetch_all_product') 
    
    }
   })
  
  }
  }catch(e){
    console.log('server side error in edit',e)
    res.redirect('/products/fetch_all_product')
  }
})





router.get("/displaypictureforedit", function(req, res, next) {
 res.render("displaypictureforedit",{data:req.query})
});












router.post("/edit_picture",upload.single('productpicture'), function(req,res){
try{
  pool.query('update product set productpicture=? where productid=?',[req.file.filename,req.body.productid],function(error,result){
    if(error){
      console.log("D error",error);
    
      res.redirect('/products/fetch_all_product')
    
    }else{
      fs.unlinkSync(`D:/sandeepsirproject/product_details/public/images/${req.body.oldfilename}`)
      
      res.redirect('/products/fetch_all_product') 
    
    }
  })
}catch(e){
  res.redirect('/products/fetch_all_product') 
}
})











module.exports = router;
