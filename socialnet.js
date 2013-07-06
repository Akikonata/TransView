(function(){
	var account_list = $("#account-list"); 
	var account_pane = $("#account-pane");
	var request_urls = {
    home_statuses:"/home_timeline/statuses/conditions/?",
    mention_statuses:"/mentions_in_statuses/conditions/?",
    mentions_in_comments:"/mentions_in_comments/conditions/?",
    comments_to_me:"/comments_to_me/conditions/?",
    accounts_statuses:"/account/statuses/conditions/?",
    comments_by_me:"/comments_by_me/conditions/?"
  }; 
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

	account_list.on("click",".btn",function(){
		var o = $(this);
		o.siblings().removeClass("active");
		o.addClass("active");
	}); 
})();