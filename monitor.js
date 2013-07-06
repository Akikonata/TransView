(function(){
  var status_select = $("#status-select");
  CRMModel.getMNWeibo(function(data){
    console.log(data);
  });
})();