(function(){
  var status_select = $("#status-select");
  var trans_detail = $("#trans-detail");
  CRMModel.getMNWeibo(function(data){
    var data_list = data.data_list;
        status_select.empty();
        data_list.forEach(function(o){
          status_select.append("<option value='"+o.status_id+"'>"+o.status_name+"</option>");
        });   
    status_select.trigger("change");
  });
  status_select.on("change",this,function(){
    var o = $(this);
    var weibo_id = o.val();
    CRMModel.getMNWeiboDetail(weibo_id,function(data){
      console.log(data);

    });
  });
})();