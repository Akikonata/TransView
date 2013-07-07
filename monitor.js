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

      var hour_dist = data.user_dist.hour_dist;
        // for(var i = hour_dist.length-1; i>0; i--){
        //   if(hour_dist[i]!=0){
        //     hour_dist = hour_dist.slice(0,i+1);
        //     break;
        //   }
        // }
        T_dist_data.data_hour = hour_dist;
        var source_dist = data.user_dist.source_dist;
        var comment_hotwords = data.user_dist.comments_stat.hotwords;
        var repost_hotwords = data.user_dist.reposts_stat.hotwords;
        var comments_gender_dist = data.user_dist.comments_stat.gender_dist;
        var comments_verify_dist = data.user_dist.comments_stat.verify_dist;
        var comments_location_dist = data.user_dist.comments_stat.location_dist;

        var reposts_gender_dist = data.user_dist.reposts_stat.gender_dist;
        var reposts_verify_dist = data.user_dist.reposts_stat.verify_dist;
        var reposts_location_dist = data.user_dist.reposts_stat.location_dist;

        var createDate = Date.parse(data.created_at);
        T_dist_data.created_at = createDate;

        //compute T_dist_data.data_day
        T_dist_data.data_day = [];
        var dCount = 0;

        var user = data.user;
        reposts_count = data.reposts_count;
        comments_count = data.comments_count;
          
          var column_Configs = {
            colors: ['#FEB800', '#00A3E8', '#714286', '#EA5503'],
            chart:{
              type:"column",
              renderTo:"",
            },
            title:{
              text:"",
            },
            series: [],
            xAxis: {
              categories:[],
              labels: {
                align:"right",
                rotation: -60
              }
            },
            yAxis: {
              title:"",
              min:0
            },
            exporting:{
              enabled: false
            },
            credits:{
              enabled:false
            }
          }

          //render source_tend
          var source_dist = _.pairs(source_dist);
              source_dist = _.sortBy(source_dist,function(o){return -o[1]});

          var xAxis_source = [],yVal_source=[];

          for(var cur = 0;cur<20;cur++){
            if(source_dist[cur]){
              xAxis_source.push(source_dist[cur][0]);
              yVal_source.push(source_dist[cur][1]);
            }
            else break;
          }

          column_Configs.series.push({
              name: "来源分布",
              data: yVal_source
          });
          column_Configs.xAxis.categories = xAxis_source;
          $("#source-tend").highcharts(column_Configs);

          var pie_Configs = {
            colors: ['#4BAA00', '#1C77C1', '#E04200', '#FEB800', '#00A3E8', '#714286', '#EA5503'],
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                renderTo : "",
                height:"400",
                margin:[60,100,60,60]
            },
            title: {
                text: ''
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage}%</b>',
              percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(1) +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '比例',
            }],
            exporting:{
              enabled: false
            },
            credits:{
              enabled:false
            }
          }
          //render comments_gender_dist
          pie_Configs.series[0].data = [
            ["男",comments_gender_dist["m"]],
            ["女",comments_gender_dist["f"]]
          ];
          $("#comments-gender-dist").highcharts(pie_Configs);
          //render comments_verify_dist
          pie_Configs.series[0].data = _.pairs(comments_verify_dist);
          $("#comments-verify-dist").highcharts(pie_Configs);

    });

    CRMModel.getMNTransmission(weibo_id,function(data){
      $("#travel-path").replaceWith($("#travelpath-tpl").html());
      var travel_map = $("#travel-path");
      travel_map.drawTravelPath(data);
    });
  });
})();