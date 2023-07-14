$(document).ready(function(){
  $.getJSON('/products/fetch_product_type',function(data){
    var data = data.data
    data.map((item)=>{
        $('#producttypeid').append($('<option>').text(item.producttypename).val(item.producttypeid))
    })
   
  })
  $('#producttypeid').change(function(){
    $.getJSON('/products/fetch_product_category',{typeid:$('#producttypeid').val()},function(data){
        var data = data.data
        $('#productcatid').empty()
        $('#productcatid').append
        ($('<option>').text('-select category--'))
        data.map((item,i)=>{
            // alert(item.productcatname)
            $('#productcatid').append($('<option>').text(item.productcatname).val(item.productcatid))
        })
       
      })
  })
})