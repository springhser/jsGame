/**
 * Created by c on 2016/5/26.
 */

function Circle(x,y,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
}
function Line(startPoint,endPoint,thickness){
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.thickness = thickness;
}

var CanvarGame = {
    circles:[],
    thinLineThickness:1,
    boldLineThickness:5,
    lines:[],
    currentLevel:0,
    progressPercentage:0
};

CanvarGame.levels =
    [
        {
            "level" : 0,
            "circles" : [{"x" : 400, "y" : 156},
                {"x" : 381, "y" : 241},
                {"x" : 84, "y" : 233},
                {"x" : 88, "y" : 73}],
            "relationship" : {
                "0" : {"connectedPoints" : [1,2]},
                "1" : {"connectedPoints" : [0,3]},
                "2" : {"connectedPoints" : [0,3]},
                "3" : {"connectedPoints" : [1,2]}
            }
        },
        {
            "level" : 1,
            "circles" : [{"x" : 401, "y" : 73},
                {"x" : 400, "y" : 240},
                {"x" : 88, "y" : 241},
                {"x" : 84, "y" : 72}],
            "relationship" : {
                "0" : {"connectedPoints" : [1,2,3]},
                "1" : {"connectedPoints" : [0,2,3]},
                "2" : {"connectedPoints" : [0,1,3]},
                "3" : {"connectedPoints" : [0,1,2]}
            }
        },
        {
            "level" : 2,
            "circles" : [{"x" : 92, "y" : 85},
                {"x" : 253, "y" : 13},
                {"x" : 393, "y" : 86},
                {"x" : 390, "y" : 214},
                {"x" : 248, "y" : 275},
                {"x" : 95, "y" : 216}],
            "relationship" : {
                "0" : {"connectedPoints" : [2,3,4]},
                "1" : {"connectedPoints" : [3,5]},
                "2" : {"connectedPoints" : [0,4,5]},
                "3" : {"connectedPoints" : [0,1,5]},
                "4" : {"connectedPoints" : [0,2]},
                "5" : {"connectedPoints" : [1,2,3]}
            }
        },
        {
            "level" : 3,
            "circles" : [{"x" : 92, "y" : 85},
                {"x" : 253, "y" : 13},
                {"x" : 393, "y" : 86},
                {"x" : 390, "y" : 214},
                {"x" : 248, "y" : 275},
                {"x" : 95, "y" : 216},
                {"x" : 79, "y" : 379},
                {"x" : 57, "y" : 315}],
            "relationship" : {
                "0" : {"connectedPoints" : [1,2]},
                "1" : {"connectedPoints" : [2,3]},
                "2" : {"connectedPoints" : [3,4]},
                "3" : {"connectedPoints" : [4,5]},
                "4" : {"connectedPoints" : [5,6]},
                "5" : {"connectedPoints" : [6,7]},
                "6" : {"connectedPoints" : [7,0]},
                "7" : {"connectedPoints" : [0,1]}
            }
        }
    ];

function drawLine(ctx,x1,y1,x2,y2,thickness){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.closePath();
    ctx.lineWidth = thickness;
    ctx.strokeStyle = "#cfc";
    ctx.stroke();
}

function drawCircle(ctx,x,y,radius){
    //ctx.fillStyle = "rgba(0,200,100,0.9)";
    var circle_gradient = ctx.createRadialGradient(x-3,y-3,1,x,y,radius);
    circle_gradient.addColorStop(0,"#fff");
    circle_gradient.addColorStop(1,"#cc0");
    ctx.fillStyle = circle_gradient;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2);
    //ctx.closePath();
    ctx.fill();
}

$(function(){
    var canvas = document.getElementById("canvasgame");
    var ctx = canvas.getContext("2d");
        //var circleRadius = 5;
    //var width = canvas.width;
    //var height = canvas.height;
    //
    //var circleCount = 5;
    //for(var i = 0; i < circleCount; i++){
    //    var x = width*Math.random();
    //    var y = height * Math.random();
    //    drawCircle(ctx,x,y,circleRadius);
    //    CanvarGame.circles.push(new Circle(x,y,circleRadius));
    //}
    //connectCircles();
    //updateLineIntersection();
    var bg_gradient = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
    bg_gradient.addColorStop(0,"#000000");
    bg_gradient.addColorStop(1,"#555555");
    ctx.fillStyle = bg_gradient;
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

    ctx.font = "26px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Canvas Game",ctx.canvas.width/2,50);

    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("Game: "+ CanvarGame.currentLevel + ",Completeness: "+
        +CanvarGame.progressPercentage + "%" ,20,ctx.canvas.height - 5);

    CanvarGame.background = new Image();
    CanvarGame.background.onload = function(){
        //设置游戏主循环的循环间隔
        setInterval(gameloop,30);
    }
    CanvarGame.background.onerror = function(){
        console.log("Error loading the image");
    }
    CanvarGame.background.src = "images/beauty.jpg";

    setupCurrentLevel();
    updateLevelProgress();
    //给canvas添加鼠标事件监听器
    //检查按下鼠标的位置是否在任何一个圆之上
    //并设置那个圆为拖拽目标小圆球
    $("#canvasgame").mousedown(function(e){
        var canvasPositon = $(this).offset();
        var mouseX = (e.pageX - canvasPositon.left) || 0;
        var mouseY = (e.pageY - canvasPositon.top) || 0;

        for(var i = 0; i<CanvarGame.circles.length; i++){
            var circleX = CanvarGame.circles[i].x;
            var circleY = CanvarGame.circles[i].y;
            var radius = CanvarGame.circles[i].radius;
            if(Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) < Math.pow(radius,2)){
                CanvarGame.targetCircle = i;
                break;
            }
        }
    });

    $("#canvasgame").mousemove(function(e){
        if(CanvarGame.targetCircle != undefined){
            var canvasPositon = $(this).offset();
            var mouseX = (e.pageX - canvasPositon.left) || 0;
            var mouseY = (e.pageY - canvasPositon.top) || 0;

            var radius = CanvarGame.circles[CanvarGame.targetCircle].radius;
            CanvarGame.circles[CanvarGame.targetCircle] = new Circle(mouseX,mouseY,radius);
        }
        connectCircles();
        updateLineIntersection();
        updateLevelProgress();
    });

    $("#canvasgame").mouseup(function(e){
        CanvarGame.targetCircle = undefined;
        checkLevelCompleteness();
    });

});
function setupCurrentLevel(){
    CanvarGame.circles = [];
    var level = CanvarGame.levels[CanvarGame.currentLevel];
    for(var i=0; i<level.circles.length; i++){
        CanvarGame.circles.push(new Circle(level.circles[i].x,level.circles[i].y,10));
    }

    connectCircles();
    updateLineIntersection();
}

function checkLevelCompleteness(){
    if($("#progress").html() == "100"){
        if(CanvarGame.currentLevel+1 < CanvarGame.levels.length){
            CanvarGame.currentLevel++;
        }else{
            window.alert("You win .Congratulation!");
            CanvarGame.currentLevel = 0;
        }
        //console.log(CanvarGame.currentLevel);
        setupCurrentLevel();
    }
}

function gameloop(){
    var canvas = document.getElementById('canvasgame');
    var ctx = canvas.getContext('2d');

    clear(ctx);

    ctx.drawImage(CanvarGame.background,0,0);


    //绘制所有保存的线

    for(var i=0; i<CanvarGame.lines.length; i++){
        var line = CanvarGame.lines[i];
        var startPoint = line.startPoint;
        var endPoint = line.endPoint;
        var thickness = line.thickness;
        drawLine(ctx,startPoint.x,startPoint.y,endPoint.x,endPoint.y,thickness);
    }
    //绘制所有保存的圆

    for(var i=0; i<CanvarGame.circles.length; i++){
        var circle = CanvarGame.circles[i];
        drawCircle(ctx,circle.x,circle.y,circle.radius);
    }

}

function connectCircles(){
    var level = CanvarGame.levels[CanvarGame.currentLevel];
    CanvarGame.lines.length = 0;
    for(var i in level.relationship){
        var connectedPoint = level.relationship[i].connectedPoints;
        //console.log();
        var startPoint = CanvarGame.circles[i];
        for(var j in connectedPoint){
            var endPoint = CanvarGame.circles[connectedPoint[j]];
            //drawLine(ctx,startPoint.x,startPoint.y,endPoint.x,endPoint.y,1);
            CanvarGame.lines.push(new Line(startPoint,endPoint,CanvarGame.thinLineThickness));
        }
    }
}

function updateLevelProgress(){
    var progress = 0;
    for(var i=0; i<CanvarGame.lines.length; i++){
        if(CanvarGame.lines[i].thickness == CanvarGame.thinLineThickness){
            progress++;
        }
    }
    CanvarGame.progressPercentage = Math.floor(progress/CanvarGame.lines.length*100);
    $("#progress").html(CanvarGame.progressPercentage);
    $("#level").html(CanvarGame.currentLevel);
}
function clear(ctx){
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

function isIntersect(line1,line2){
    var a1 = line1.endPoint.y - line1.startPoint.y;
    var b1 = line1.startPoint.x - line1.endPoint.x;
    var c1 = a1*line1.startPoint.x + b1*line1.startPoint.y;

    var a2 = line2.endPoint.y - line2.startPoint.y;
    var b2 = line2.startPoint.x - line2.endPoint.x;
    var c2 = a2*line2.startPoint.x + b2*line2.startPoint.y;

    var d = a1*b2 - a2*b1;

    if(d == 0){
        return false;
    }else{
        var x = (b2*c1 - b1*c2)/d;
        var y = (a1*c2 - a2*c1)/d;

        if((isInBetween(line1.startPoint.x,x,line1.endPoint.x)||
            isInBetween(line1.startPoint.y,y,line1.endPoint.y))&&
            (isInBetween(line2.startPoint.x,x,line2.endPoint.x)||
            isInBetween(line2.startPoint.y,y,line2.endPoint.y))){
            return true ;
        }
    }
    return false;
}

function isInBetween(a,b,c){
    if(Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001){
        return false;
    }

    return (a < b && b < c) || (c < b && b < a);
}

function updateLineIntersection(){
    for(var i=0; i<CanvarGame.lines.length; i++){
        var line1 = CanvarGame.lines[i];
        line1.thickness = CanvarGame.thinLineThickness;
        for(var j=0; j<i; j++){
            var line2 = CanvarGame.lines[j];

            if(isIntersect(line1,line2)){
                line1.thickness = CanvarGame.boldLineThickness;
                line2.thickness = CanvarGame.boldLineThickness;
            }
        }
    }
}