/**
 * Created by c on 2016/5/27.
 */
var audiogame={

};

$(function(){
    audiogame.musicplay = document.getElementById("musicplay");
    audiogame.musicplay.volume = 0.3;
    //$("a[href='#game']").hover(function(){
    //    audiogame.musicplay.currentTime = 0;
    //    audiogame.musicplay.play();
    //},function(){
    //    audiogame.musicplay.pause();
    //});
    $("a[href='#game']").click(function(){
        audiogame.musicplay.play();
        $("a[href='#game']").attr('href','#game1');
        return false;
    });
    //$(".stop").click(function(){
    //    audiogame.musicplay.pause();
    //})
    //$("a[href='#game1']").click(function(){
    //    audiogame.musicplay.pause();
    //    $("a[href='#game1']").attr('href','#game');
    //    return false;
    //});
    drawBackground();
});

function drawBackground(){
    var bgGame = document.getElementById("game-background-canvas");
    var ctx = bgGame.getContext('2d');

    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000";
    ctx.center = bgGame.width/2;

    ctx.beginPath();
    ctx.moveTo(center-100,50);
    ctx.lineTo(center-100,bgGame.height - 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(center,50);
    ctx.lineTo(center,bgGame.height - 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(center+100,50);
    ctx.lineTo(center+100,bgGame.height - 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(center-150,bgGame.height-50);
    ctx.lineTo(center+150,bgGame.height-50);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(50,50,50,8)";
    ctx.stroke();
}