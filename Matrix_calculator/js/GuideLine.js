
var isButtonPressed = false;
var whichButton = 0;  // 0 - left / 1 - right
var oldX = 0;
var oldY = 0;
var SectionList = new Array();

var isDrawing = false;
var idx = 0;
var currentSectionIdx = 0;
var myTimer;
var TimerOn = false;	// 타이머 작동 여부 체크 변수
var selectSection = false;	// 정해진 섹터 안에서만 그리기 변수
var GuideLineMode;

function Section(idx, X, Y, W, H, isEditable){
	this.idx = idx;
	this.X = X;
	this.Y = Y;
	this.W = W;
	this.H = H;
	this.isEditable = isEditable;
}



// 컨텍스트 얻기
var canvas = new Array();
var chart = new Array();
var context;
var context2;


function GuideLineModeChanged(){
	context.clearRect(0, 0, canvas[0].width, canvas[0].height);
	context2.clearRect(0, 0, canvas[0].width, canvas[0].height);
	Init();
	console.log("enter Change" + GuideLineMode);
	if(GuideLineMode == 1){
		SectionList = [];
		DrawGuideLineMatrix();
	}
}

function DrawGuideLineMatrix(){
	var target = document.getElementById("MatrixRowSelectBox");
	var RowCount = target.options[target.selectedIndex].value;
	target = document.getElementById("MatrixColSelectBox");
	var ColCount = target.options[target.selectedIndex].value;

	console.log(RowCount + " " + ColCount);

	context2.beginPath();
	context2.lineWidth = 1;
	context2.setLineDash([3,1]);
	context2.strokeStyle = "rgb(255,0,0)"

	var canvasW = canvas[0].width;
	var canvasH = canvas[0].height;

	if(RowCount == 1 && ColCount == 1){
		var temp = new Section(idx, 0, 0, canvasW, canvasH, true);
		idx++;
		SectionList.push(temp);
	}
	else{
		for(var j = 1; j <= RowCount; j++){
			for(var i = 1; i <= ColCount; i++){
				console.log(RowCount + " " + ColCount);
				if(j == 1 && i < ColCount){
					context2.moveTo(canvasW / ColCount * i, 0);
					context2.lineTo(canvasW / ColCount * i, canvasH);
				}
				if(i == 1 && j < RowCount){
					context2.moveTo(0, canvasH / RowCount * j);
					context2.lineTo(canvasW, canvasH / RowCount * j);
				}
				var temp = new Section(idx + 1, canvasW / ColCount * (i-1), canvasH / RowCount * (j-1), canvasW / ColCount, canvasH / RowCount, true);
				SectionList.push(temp);
				console.log(idx + " : " + SectionList[idx-1].X + " " + SectionList[idx-1].Y + " " + SectionList[idx-1].W + " " + SectionList[idx-1].H);
				idx++;

			}
		}
	}
	console.log("SectionList 개수 : " + SectionList.length);
	context2.stroke();

	context2.setLineDash([0]);
}

// 창 열리자마자 작동
window.onload = function() {
	Init();
}

// 초기 설정
function Init(){

	// 일반 or 행렬 어느 수식인지 확인
	var target = document.getElementById("GuideLineModeSelectBox");
	GuideLineMode = target.options[target.selectedIndex].value;
	if(GuideLineMode == 0){
		document.getElementById("MatrixRowSelectBox").disabled = true;
		document.getElementById("MatrixColSelectBox").disabled = true;
	}
	else{
		document.getElementById("MatrixRowSelectBox").disabled = false;
		document.getElementById("MatrixColSelectBox").disabled = false;
	}

	// 변수 초기화
	SectionList = new Array();
	idx = 0;

	for(var i = 0;i < 10; i++){
		chart[i] = 'chart' + i;
		canvas[i] = document.getElementById(chart[i]);
	}

	var firstPos = new Section(idx, 0, 0, canvas[0].width, canvas[0].height, true);
	SectionList.push(firstPos);
	idx++;

	context2 = canvas[0].getContext('2d');
	context = canvas[1].getContext('2d');
}

/////////////////////////////////////////////////////////////////////////////////////////

// 위에서 그린 가이드라인 안에다가 입력받은 글자 넣기
// void drawMatrixValue(var inputValue){
// 	// 1. 입력받은 식이 선택한 행과 열과 맞는가 검사
// 	//
//
// 	// 2. 맞다면 숫자를 그린다
// 	// for(var row = 0 ~ size)
// 	// 	for(var col = 0 ~ size)
// 	// 		calculatePosAndDraw(row, col, value[row*col])
// }
//
// void calculatePosAndDraw(var row, var col, var value){
// 	// canvas 각 섹터 위치
// 	/*
// 	1. 구역 위치 계산
// 	X = 캔버스 높이 / row
// 	Y = 캔버스 너비 / col
// 	---> 해당 섹터 위치 => startX = row * X, startY = col * Y
//
// 	2. 글자 위치 계산
// 	글자 시작 위치 = X + row/2, Y + col/2 - (글자 길이 / 2)
//
// 	3. 글자 그리기
// 	fillText 함수
// 	*/
// }
//
//
///////////////////////////////////////////////////////////////////////////////////////
//이벤트 발생 함수
// function drawMatrixValue(inputValue){
// 	current = findSection(event.offsetX, event.offsetY);
//
// 	if(mouseSection == -1){
// 		if(!GuideLineMode)
// 			contextDash.clearRect(0, 0, canvas.width, canvas.height);
// 		contextDash.strokeStyle = DashColor;
// 		contextDash.strokeRect(current.X,current.Y,current.W,current.H);
// 		mouseSection = current;
// 	}
// 	else{
// 		if(mouseSection != current){
// 			if(!GuideLineMode)
// 				contextDash.clearRect(0, 0, canvas.width, canvas.height);
// 			contextDash.strokeStyle = DashColor;
// 			contextDash.strokeRect(current.X,current.Y,current.W,current.H);
// 			mouseSection = current;
// 		}
// 	}
//
// }
//
// function dragStart(ev){
// 	DashColor = "rgb(0,0,255)"
// 	contextDash.strokeStyle = DashColor;
// 	var node = findSectionNode(event.offsetX, event.offsetY);
// 	var section = findSection(event.offsetX, event.offsetY);
// 	DragStartNode = node;
// 	console.log(node.parent_node);
// 	for(var i = SectionList.length - 1; i > -1; i--){
// 		if(search_common_parent(node,SectionList[i].node) == node){
// 			contextDash.strokeRect(SectionList[i].X,SectionList[i].Y,SectionList[i].W,SectionList[i].H);
// 		}
// 	}
// }
//
// function dragEnd(ev){
// 	DashColor = "rgb(255,0,0)";
// 	contextDash.strokeStyle = DashColor;
// 	if(GuideLineMode){
// 		contextDash.clearRect(0, 0, canvas.width, canvas.height);
// 		for(var i = SectionList.length - 1; i > -1; i--){
// 			contextDash.strokeRect(SectionList[i].X,SectionList[i].Y,SectionList[i].W,SectionList[i].H);
// 		}
// 	}
//
// 	var Endnode = findSectionNode(event.offsetX, event.offsetY);
// 	var CommonParentNode = search_common_parent(DragStartNode, Endnode);
// 	console.log("StartParent + ", DragStartNode.parent_node);
// 	//console.log("End + ", Endnode);
// 	insert(CommonParentNode, UPPERNODE, "pow");
//
// 	context.clearRect(0, 0, canvas.width, canvas.height);
// 	contextDash.clearRect(0, 0, canvas.width, canvas.height);
// 	SectionList = new Array();
// 	traverse(root_node.nodelist[0], new Section(0,0,canvas.width,canvas.height));
//
// }
