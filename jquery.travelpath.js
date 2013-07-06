(function(){
      $.fn.drawTravelPath = function(data){
      var ctx = $(this);
      var canvasBg = ctx.find(".canvas-bg")[0],
          canvasLines = ctx.find(".canvas-lines")[0],
          canvasPoints = ctx.find(".canvas-points")[0],
          canvasHighlight = ctx.find(".canvas-highlight")[0],
          ctxBg = canvasBg.getContext("2d"),
          ctxLines = canvasLines.getContext("2d"),
          ctxPoints = canvasPoints.getContext("2d"),
          ctxHighlight = canvasHighlight.getContext("2d");  
      var labelPoints = $("#label-points"),
            labelHighlight = $("#label-highlight"),
            tmplHtml = "<div style='position: absolute; left: $x; top: $y;''>$name 转发:$count</div>",
            cacheHtmlArr = [],
            cachePointArr = [];//cachePointArr[depth] is array, for quick search

        var radius = 200,
            radiusStep = 100,
            pointR2 = 1,
            pointHighlightInc = 2,
            pointHighlightR = pointR2 + pointHighlightInc,
            postCount = [0,50,100,300,700],
            width = (ctx.width()),
            height = width,
            centerX = width / 2,
            centerY = height / 2;
        canvasBg.width = width;
        canvasBg.height = height;
        canvasLines.width = width;
        canvasLines.height = height;
        canvasPoints.width = width;
        canvasPoints.height = height;
        canvasHighlight.width = width;
        canvasHighlight.height = height;
        
        var judgeLevel = function(count){
          if(count === 0){
            return 1;
          }
          else if(count < postCount[1]){
            return 2;
          }
          else if (count < postCount[2]){
            return 3;
          }
          else if(count < postCount[3]){
            return 4;
          }
          else if(count < postCount[4]){
            return 5;
          }
          else{
            return 6
          }
        }  
        //context 再canvas设置了width，height之后生效
        //ctxBg
        ctxBg.lineWidth = 1;
        ctxBg.strokeStyle = "rgb(235, 235, 235)";//#ebebeb
        //ctxLines
        ctxLines.lineWidth = 1;
        ctxLines.strokeStyle = "rgb(213, 222, 228)";//#d5dee4
        //ctxPoints
        ctxPoints.lineWidth = 0;
        ctxPoints.fillStyle = "rgb(93, 156, 57)";//#5d9c39
        //ctxHighlight
        ctxHighlight.lineWidth = 1;
        ctxHighlight.strokeStyle = "rgb(3, 50, 200)";//#5d9c39

        function getRadianFromAngle(angle) {
            return (angle / 180) * Math.PI;
        }

        function getAngleFromRadian(radian) {
            return (radian / Math.PI) * 180;
        }

        function drawBg(x, y, radius) {//global var ctxBg
            ctxBg.beginPath();
            ctxBg.arc(x, y, radius, 0, Math.PI * 2, false);
            ctxBg.closePath();
            ctxBg.stroke();
        }

        function drawLine(x0, y0, x1, y1) {//global var ctxLines
            ctxLines.beginPath();
            ctxLines.moveTo(x0, y0);
            ctxLines.lineTo(x1, y1);
            ctxLines.closePath();
            ctxLines.stroke();
        }

        function drawPoint(x, y, radius) {//global var ctxPoints
            ctxPoints.beginPath();
            ctxPoints.arc(x, y, radius, 0, Math.PI * 2, false);
            ctxPoints.closePath();
            ctxPoints.fill();
        }
        
        function drawHighlightMark(x, y, radius) {
            ctxHighlight.clearRect(0, 0, width, height);
            ctxHighlight.beginPath();
            ctxHighlight.arc(x, y, radius, 0, Math.PI * 2, false);
            ctxHighlight.closePath();
            ctxHighlight.stroke();
        }

        function drawHighlightLabel(obj) {//global var labelHighlight, tmplHtml
            var tempHtml = tmplHtml.replace(/\$x/g, (obj.x + pointHighlightInc) + "px").replace(/\$y/g, (obj.y + pointHighlightInc) + "px").replace(/\$name/g, obj.n).replace(/\$count/g, obj.c);
            labelHighlight.html(tempHtml);
        }
        
        function drawPointLabel(x, y, name, count) {//global var labelPoints, tmplHtml

            if(count >= postCount) {
                // var tempHtml = tmplHtml.replace(/\$x/g, (x + pointHighlightInc) + "px").replace(/\$y/g, (y + pointHighlightInc) + "px").replace(/\$name/g, name).replace(/\$count/g, count);
                // cacheHtmlArr.push(tempHtml);
                // return true;
            }
            return false;
            //labelPoints.html(cachePointArr.join("\n"));
        }

        function cachePoint(x, y, depth, name, count) {//global var cachePointArr
            var tp = {"x" : x, "y": y, "n" : name, "c" : count};//object not array, array is not understand well
            cachePointArr[depth].push(tp);
        }

        //所有的点平均分布在360度的圆周上，中心远点及其360度点
        function drawFullArc(centerX, centerY, radius, radiusStep, data, depthArr) {//no global var
            if(!data) {
                return;
            }
            var i , tempArr = data[4], arrI = [], count = tempArr ? tempArr.length : 0;

            drawPoint(centerX, centerY, pointR2 * 3);
            cachePoint(centerX, centerY, 0,  data[0], data[3]);
            drawPointLabel(centerX, centerY, data[0], data[3]);

            var countStep = (function(){
              var count = 0;
              for (var i=0;i<tempArr.length;i++){
                count += judgeLevel(tempArr[i][3]);
              }
              return count;
            })();
            countStep = 360/countStep;
            var curAngle = 0;
            for(i = 0; i < count; i++) {
                arrI = tempArr[i];
                var curR = judgeLevel(arrI[3]);
                    curAngle += countStep * curR / 2;
                var curRadian =  getRadianFromAngle(curAngle),
                    curX = centerX + Math.cos(curRadian) * radius,
                    curY = centerY + Math.sin(curRadian) * radius;
                drawLine(centerX, centerY, curX, curY);

                
                // if(arrI[3]>postCount) drawPoint(curX, curY, pointR2 * 3);
                // else drawPoint(curX, curY, pointR2);
                drawPoint(curX, curY, curR);
                cachePoint(curX, curY, 1, arrI[0], arrI[3]);
                drawPointLabel(curX, curY, arrI[0], arrI[3]);
                drawPartArc(curX, curY, curAngle, radius, 1, radiusStep, arrI[4], depthArr);
                curAngle += countStep * curR / 2;
            }
        }
        //所有的点平均分布在指定度数度的圆周上
        function drawPartArc(parentX, parentY, parentAngle, parentRadius, parentDepth, radiusStep, data, depthArr) {//no global var
            if(!data||data.length === 0) {
                return;
            }
            var countStep = (function(){
              var count = 0;
              for (var i=0;i<data.length;i++){
                count += judgeLevel(data[i][3]);
              }
              return count;
            })();

            var curRadius = parentRadius + radiusStep,
                curDepth = parentDepth + 1,
                arrI = [],
                count = data ? data.length : 0,
                countArcAngle = countStep,
                cosArcAngle = getAngleFromRadian(Math.acos(parentRadius / (parentRadius + radiusStep))) * 2,
                arcAngle = (countArcAngle > cosArcAngle) ? cosArcAngle: countArcAngle,
                halfArcAngle = arcAngle / 2,
                fromArcAngle = parentAngle - halfArcAngle,
                i = 0, iStep = arcAngle / countStep;
            var curAngle = fromArcAngle;
            for(i = 0; i < count; i++) {
                arrI = data[i];
                curAngle = curAngle + iStep * judgeLevel(arrI[3])/2;
                var curRadian =  getRadianFromAngle(curAngle),
                    curX = centerX + Math.cos(curRadian) * curRadius,
                    curY = centerY + Math.sin(curRadian) * curRadius;
                drawLine(parentX, parentY, curX, curY);
                if(arrI[3] > postCount) drawPoint(curX, curY, pointR2*3);
                else drawPoint(curX, curY, pointR2);
                cachePoint(curX, curY, curDepth, arrI[0], arrI[3]);
                drawPointLabel(curX, curY, arrI[0], arrI[3]);
                drawPartArc(curX, curY, curAngle, curRadius, curDepth, radiusStep, arrI[4], depthArr);
                curAngle = curAngle + iStep * judgeLevel(arrI[3])/2;
            }
        }


        var drawData = function(data) {
            $("#loading").text("rending data...");
            var depthCountArr = data[3];
            radius = radiusStep = width/((depthCountArr.length - 1) * 2);
            var depthCount = depthCountArr ? depthCountArr.length : 0;
            //绘制背景园环
            for(var d = 0; d < depthCount; d++) {
                if(d!=depthCount - 1 )drawBg(centerX, centerY, radius + d * radiusStep); 
                cachePointArr[d] = []; //初始化缓存
            }

            drawFullArc(centerX, centerY, radius, radiusStep, data[2], depthCountArr);
            labelPoints.html(cacheHtmlArr.join("\n"));
            $("#loading").text("loading data...").hide();

            function isPointInDepth(cx, cy, pointR, depthCount) {//global centerX centerY radius radiusStep
                var realR = Math.sqrt(Math.pow((centerX - cx + 1), 2) + Math.pow((centerY - cy + 1), 2)),
                    radiusFrom = 0,
                    radiusTo = 0,
                    d = 0;
                for(d = 0; d < depthCount; d++) {
                    if(d !== 0) {
                        radiusFrom = radius + radiusStep * (d - 1);
                        radiusTo = radiusFrom + pointR;
                        if(realR >= radiusFrom && realR <= radiusTo) {
                            return d;
                        }
                    } else {
                        if(realR <= (pointR - 0)) {
                            return d;
                        }
                    }
                }
                return -1; 
            }

            function getPointInDepth(cx, cy, pointR, depth, cachePointArr) {//no global var
                var curDepthArr = cachePointArr[depth],
                    curPointObj = {},
                    len = curDepthArr.length,
                    realR = 0,
                    i = 0;
                for(i = 0; i < len; i++) {
                    curPointObj = curDepthArr[i];
                    realR = Math.sqrt(Math.pow((curPointObj.x - cx + 1), 2) + Math.pow((curPointObj.y - cy + 1), 2));
                    if(realR <= pointR) {
                        return curPointObj;
                    }
                }
                return null;
            }

            var timeoutId;
            canvasHighlight.addEventListener("mousemove", function(e){
                if(timeoutId) {
                   clearTimeout(timeoutId);
                }
                timeoutId =  setTimeout(function() {
                    var x = e.layerX, y = e.layerY,
                        d = isPointInDepth(x, y, pointR2, depthCount),
                        o = {};
                    if(d >= 0) {
                        o = getPointInDepth(x, y, pointR2, d, cachePointArr);
                        if(o) {
                            drawHighlightLabel(o);
                            drawHighlightMark(o.x, o.y, pointHighlightR);
                        }
                    }
                }, 0);
            }, false);

        }//getJSON end 

        drawData(data);     
    }
})()