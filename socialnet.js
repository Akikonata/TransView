(function(){
	var account_list = $("#account-list"); 
	CRMModel.getSNAccounts(function(data){
		console.log(data);
		data.forEach(function(o){
			var _tmp = "<li class='btn account' data-id='" + o._id + "' data-platform='"+o.platform+"'>"+
                      "<img class='avatar' src ='" + o.profile_image_url + "'/>"+
                      "<span>" + o.screen_name + "</span>"+

                      "<img src='icon16_" + o.platform + ".png' class='platform-icon'/>"+
                   "</li>";
            account_list.prepend($(_tmp));
		});
	});
	
})();