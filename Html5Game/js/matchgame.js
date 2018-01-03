/**
 * Created by c on 2016/5/25.
 */
var matchingGame = {};

matchingGame.deck = [
    'cardAK', 'cardAK',
    'cardAQ', 'cardAQ',
    'cardAJ', 'cardAJ',
    'cardBK', 'cardBK',
    'cardBQ', 'cardBQ',
    'cardBJ', 'cardBJ',
];
matchingGame.savingObject = {};

matchingGame.savingObject.deck = [];
//该数组保存已移除纸牌的索引
matchingGame.savingObject.removedCards = [];

$(function(){
    //洗牌
    matchingGame.deck.sort(shuffle);

    //重建已保存的纸牌
    var savedObject = savedSavingObject();
    if(savedObject != undefined){
        matchingGame.deck = savedObject.deck;
    }


    //将所有纸牌复制到以保存的对象中
    //slice()函数用于复制原始类型数组元素的简单方式
    matchingGame.savingObject.deck = matchingGame.deck.slice();
    //复制纸牌DOM的12个备份
    for(var i=0;i<11;i++){
        $(".card:first-child").clone().appendTo("#cards");
    }

    $("#cards").children().each(function (index) {
       $(this).css({
           "left":($(this).width() + 20)*(index % 4),
           "top":($(this).height() + 20)*Math.floor(index/4)
       }) ;

        var pattern = matchingGame.deck.pop();

        $(this).find(".back").addClass(pattern);
        //在DOM元素中嵌入图案数据
        $(this).attr("data-pattern",pattern);
        //在DOM元素中保存索引以便让我们知道下一张纸牌是什么
        $(this).attr("data-card-index",index);

        $(this).click(selectCard);
    });

    //移除savedObject中已移除的牌
    if (savedObject != undefined)
    {
        matchingGame.savingObject.removedCards = savedObject.removedCards;
        // find those cards and remove them.
        for(var i in matchingGame.savingObject.removedCards)
        {
            $(".card[data-card-index="+matchingGame.savingObject.removedCards[i]+"]").remove();
        }
    }
    matchingGame.timer = setInterval(countTimer, 1000);
});

function shuffle(){
    return 0.5 - Math.random();
}

function countTimer()
{
    saveSavingObject();
}
function selectCard(){
    if($(".card-flipped").size()>1){
        return;
    }

    $(this).addClass("card-flipped");

    if($(".card-flipped").size() == 2){
        setTimeout(checkPattern,700);
    }
}

function checkPattern(){
    if(isMatchPattern()){
        $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        $(".card-flipped").bind("webkitTransitionEnd",removeTookCards);
    }else{
        $(".card-flipped").removeClass("card-flipped");
    }
}

function isMatchPattern(){
    var cards = $(".card-flipped");
    var pattern = $(cards[0]).data("pattern");
    var pattern2 = $(cards[1]).data("pattern");
    return (pattern == pattern2);
}

function removeTookCards(){

    $(".card-removed").each(function(){
       matchingGame.savingObject.removeCards.push($(this).data("cardIndex"));
        $(this).remove();
    });
    if($(".card").length == 0){
        gameover();
    }
    //$(".card-removed").remove();
}

function gameover(){
    clearInterval(matchingGame.timer);
    //$("#popup").removeClass("hide");
    localStorage.removeItem("savingObject");
}

function saveSavingObject()
{
    // save the encoded saving object into local storage
    localStorage["savingObject"] = JSON.stringify(matchingGame.savingObject);
}

function savedSavingObject(){
    var savingObject = localStorage["savingObject"];
    if(savingObject != undefined){
        //将一个带数据结构的对象解析成一个字符串，但不能传入一个DOM元素，它将删除解析对象的所有方法定义
        savingObject= JSON.parse(savingObject);
    }
    return savingObject;
}