(function(){
  var status_select = $("#status-select");
  var trans_detail = $("#trans-detail");
  var T_dist_data = {
    created_at:null,
    data_hour:null,
    data_day:null
  }

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
      var o = data;
      var user_link = CRM_Status.get_user_link(o.platform,o.user.uid);
      var s_link = CRM_Status.get_status_link(o.platform,o.user.uid,o._id);
      var _tmp = CRM_Status.tmp(
            {
              id:o._id,
              is_comment: false,
              u_id : o.user.uid,
              u_link : user_link,
              u_avatar : o.user.profile_image_url,
              u_name: o.user.name,
              u_verify: o.user.isV?o.user.verified_type:-1,
              s_text: o.text,
              s_pic: o.pic,
              s_link: s_link,
              c_date: o.cdate,
              s_source:o.source,
              platform: o.platform,
              action_source:null,
              data_type : null,
              action_send_id : null,
              is_deal:null,
              pan:null,
              logs:o.logs,
              func_config:{
                monitor:null,
                flash:o.flash,
                eyeball:o.eyeball,
                comment:{count:o.comments_count},
                repost:{count:o.reposts_count}
              },
              repost_block:null,
            }
          );
      trans_detail.find(".Status-single").remove();
      trans_detail.prepend(_tmp);
      $("a[data-toggle='tooltip']").tooltip();

      //绘制传播图
      var createDate = Date.parse(data.created_at);
      var hour_dist = data.user_dist.hour_dist;
      var configTend ={
                    colors: ['#1C77C1', '#E04200', '#FEB800', '#00A3E8', '#714286', '#EA5503'],
                    chart: {
                      zoomType: 'x',
                      renderTo:'travel-tend'
                    },
                    title:{
                      text:"",
                    },
                    series: [{
                      name: '转发量',
                      data: null,
                    }],
                    xAxis: {
                      type: 'datetime',
                      maxZoom: 24 * 3600 * 1000,
                      title:{
                        text:null,
                        align:"left"
                      }
                    },
                    yAxis: {
                      title:"",
                      min:0,
                      margin:[0,0,0,-40]
                    },
                    exporting:{
                      enabled: false
                    },
                    credits:{
                      enabled:false
                    }
                };
        var timeLocal = new Date().getTimezoneOffset() * 60 * 1000;
        configTend.series[0].data = hour_dist; 
        configTend.series[0].pointStart = createDate - timeLocal;
        configTend.series[0].pointInterval = 3600 * 1000; // one hour
        configTend.xAxis.title.text = "小时";

        new Highcharts.Chart(configTend);
    });

    CRMModel.getMNTransmission(weibo_id,function(data){
      $("#travel-path").replaceWith($("#travelpath-tpl").html());
      var travel_map = $("#travel-path");
      travel_map.drawTravelPath(data);
    });
  });
})();