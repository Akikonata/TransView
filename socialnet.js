(function(){
	var account_list = $("#account-list"); 
	var account_pane = $("#account-pane");
	var weibo_pane = $("#weibo-pane");
	var weibo_list = weibo_pane.find(".weibo-list");
	var timeline_select = $("#timeline-select");
	var startTime = Date.parse(0);
	var endTime = Date.parse(new Date());
  var d_conf = {network_id:network_id,group_id:group_id}; 
	CRMModel.getSNAccounts(function(data){
		console.log(data);
		data.forEach(function(o){
			var _tmp = "<li class='btn account' data-id='" + o._id + "' data-platform='"+o.platform+"'>"+
                      "<img class='avatar' src ='" + o.profile_image_url + "'/>"+
                      "<span>" + o.screen_name + "</span>"+
                      "<img src='icon40_" + o.platform + ".png' class='platform-icon'/>"+
                   "</li>";
            account_list.append($(_tmp));
		});
	});

	//时间线选择器变化时候获取相应微博
	timeline_select.on("change",this,function(){

	});
	//触发获取微博的事件
	account_list.on("click",".btn",function(){
		var o = $(this);
		d_conf.account_id = o.data("id");
		o.siblings().removeClass("active");
		o.addClass("active");
		account_pane.slideUp();
		weibo_pane.slideDown();
		imeline_select.trigger("change");
	}); 
})();