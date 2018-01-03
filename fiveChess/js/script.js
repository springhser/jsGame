//
var chessBoard = new Array();
for(var m = 0;m<15;m++){
	chessBoard[m] = new Array();
	for(var n = 0;n < 15;n++){
		chessBoard[m][n] = 0;
	}
}
//轮到我下时为true
var me = true;
//游戏结束
var over = false;

//赢法数组(注意数组的声明和初始化)
var wins = [];
//赢法数组初始化
for(var i=0; i<15; i++){
	wins[i] = [];
	for(var j=0; j<15; j++){
		wins[i][j] = [];
	}
}
//统计所有赢法的情况
var count = 0;
//分别给横、竖、斜、反斜赢法赋值
for(var i=0; i<15; i++){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
for(var i=0; i<11; i++){
	for(var j=0; j<15; j++){
		for(var k=0; k<5; k++){
			wins[i+k][j][count] = true;
		}
		count++;
	}
}
for(var i=0; i<11; i++){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
for(var i=14; i>3; i--){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[i-k][j+k][count] = true;
		}
		count++;
	}
}
console.log(count);
// window.alert(count);
//赢法统计数组
var myWin = [];
var computerWin = [];
for(var i=0; i<count; i++){
	myWin[i] = 0;
	computerWin[i] = 0;
}

var chess = document.getElementById("chess");
var context = chess.getContext("2d");

var bgImage = new Image();
bgImage.src = "images/bg.jpg";
bgImage.onload = function(){
	context.drawImage(bgImage,0,0,450,450);
	drawChessBoard();
}

var drawChessBoard = function(){
	context.strokeStyle = "#999";
	for(var i = 0;i < 15;i++){
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30,435);
		context.stroke();
		context.moveTo(15, 15 + i*30);
		context.lineTo(435,15 + i*30);
		context.stroke();
	}
}

var oneStep = function(i,j,me){
	var gr = context.createRadialGradient(15 + i*30-2,15 + j*30-2,2,15 + i*30-2,15 + j*30-2,13);
	if(me){
		gr.addColorStop(0,"#787878");
		gr.addColorStop(1,"#010101");
	}else{
		gr.addColorStop(0,"#EFEFEF");
		gr.addColorStop(1,"#C8C8C8");
	}
	
	context.fillStyle = gr;
	context.beginPath();
	context.arc(15 + i*30,15 + j*30,13,0,Math.PI * 2);
	context.closePath();
	context.fill();
}

chess.onclick = function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}

	var x = e.offsetX;
	var y = e.offsetY;

	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);

	if(chessBoard[i][j] == 0){
		oneStep(i,j,me);
		
		// if(me){
		chessBoard[i][j] = 1;
		// }else{
		// 	chessBoard[i][j] = 2;
		// }
		

		for(var k=0; k<count; k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k] = 6;
				if(myWin[k] == 5){
					window.alert("YOU WIN");
					over = true;
				}
			}
		}

		if(!over){
			me = !me;
			computerAI();
		}
	}
}

var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;//记录最高分数
	var u = 0, v = 0;//记录分数最高点的坐标

	for(var i=0; i<15; i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j=0; j<15; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}

	for(var i=0; i<15; i++){
		for(var j=0; j<15; j++){
			if(chessBoard[i][j] == 0){
				for(var k=0; k<count; k++){
					if(wins[i][j][k]){
						if(myWin[k] == 1){
							myScore[i][j] += 200;
						}else if(myWin[k] == 2){
							myScore[i][j] += 400;
						}else if(myWin[k] == 3){
							myScore[i][j] += 2000;
						}else if(myWin[k] == 4){
							myScore[i][j] += 10000;
						}

						if(computerWin[k] == 1){
							computerScore[i][j] += 220;
						}else if(computerWin[k] == 2){
							computerScore[i][j] += 450;
						}else if(computerWin[k] == 3){
							computerScore[i][j] += 2300;
						}else if(computerWin[k] == 4){
							computerScore[i][j] += 20000;
						}
					}
				}

				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}

	oneStep(u,v,false);
	chessBoard[u][v] = 2;

	for(var k=0; k<count; k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k] = 6;	
			if(computerWin[k] == 5){
				window.alert("COMPUTER WIN");
				over = true;
			}	
		}		
	}
	if(!over){
		me = !me;
	}
}

