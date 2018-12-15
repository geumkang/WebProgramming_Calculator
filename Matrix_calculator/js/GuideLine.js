
var isButtonPressed = false;
var whichButton = 0;  // 0 - left / 1 - right
var oldX = 0;
var oldY = 0;
var SectionList = new Array();
var mouseSection = -1;
var isDrawing = false;
var idx = 0;
var currentSectionIdx = 0;
var myTimer;
var TimerOn = false;	// 타이머 작동 여부 체크 변수
var selectSection = false;	// 정해진 섹터 안에서만 그리기 변수
var GuideLineMode;


var FormulaMode = 1;
var matrix = new Array();
var RowCount = 1;
var ColCount = 1;


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


function MatrixSizeChanged(){
	context.clearRect(0, 0, canvas[0].width, canvas[0].height);
	context2.clearRect(0, 0, canvas[0].width, canvas[0].height);
	Init();
	console.log("enter Change" + FormulaMode);
	if(FormulaMode == 1){
		SectionList = [];
		DrawGuideLineMatrix();
	}
}

function DrawGuideLineMatrix(){
	var target = document.getElementById("MatrixRowSelectBox");
	RowCount = target.options[target.selectedIndex].value;
	target = document.getElementById("MatrixColSelectBox");
	ColCount = target.options[target.selectedIndex].value;

	console.log(RowCount + " " + ColCount);

	context2.beginPath();
	context2.lineWidth = 1;
	context2.setLineDash([3,1]);
	context2.strokeStyle = "rgb(255,0,0)"

	var canvasW = canvas[0].width;
	var canvasH = canvas[0].height;

	if(RowCount == 1 && ColCount == 1){
		// var temp = new Section(idx, 0, 0, canvasW, canvasH, true);
		// idx++;
		// SectionList.push(temp);
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
				// var temp = new Section(idx + 1, canvasW / ColCount * (i-1), canvasH / RowCount * (j-1), canvasW / ColCount, canvasH / RowCount, true);
				// SectionList.push(temp);
				// console.log(idx + " : " + SectionList[idx-1].X + " " + SectionList[idx-1].Y + " " + SectionList[idx-1].W + " " + SectionList[idx-1].H);
				// idx++;

			}
		}
	}
//	console.log("SectionList 개수 : " + SectionList.length);
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


function drawMatrixValue() {
	console.log(RowCount + " " + ColCount + " " + matrix.length + " " + matrix[0].length);

 	if(RowCount == matrix.length && ColCount == matrix[0].length){
 		console.log(RowCount + "그릴수있어요~ " + ColCount);
 		calculatePosAndDraw();
 	}
}


function calculatePosAndDraw(){

	console.log("canvas 그리기");
	var X = 1000;
	var Y = 500;
	var x = X / ColCount;
	var y = Y / RowCount;

	var startX = 0;
	var startY = 0;
	var charX = 0;
	var charY = 0;

	var _x = 0;
	var _y = 0;

	for (var i = 0; i < RowCount; i++)
	{
		for (var j = 0; j < ColCount; j++)
		{
			var value = matrix[i][j];
			var valueLength = value.toString().length;

			console.log(value);
			console.log(valueLength);

			startX = j * x;
			startY = i * y;

			charX = startX + x/2 - valueLength*10/2;
			charY = startY + y/2; // - (valueLength)/2;

			context.font = "20px Georgia";
			context.fillText(value, charX, charY);
			console.log("숫자 그림");
			_x+=1;
		}_y+=1;
	}
}


///////////////////////////////////////////////////////////////////////////////////////


function allowDrop(ev){
	ev.preventDefault();
console.log("canvas이동!");}

function dragStart(ev){
	ev.dataTransfer.setData("text", ev.target.id);
	StoreMatrix();
	console.log("드래그 시작" + ev.target.id);
}

function drop(ev) {
	 ev.preventDefault();
	 //var c = ev.dataTransfer.getData("text");
	 drawMatrixValue();
 	console.log("확인?");
	 //ev.target.appendChild(document.getElementById(c));
 }



///////////////////////////////////////////////////////////////////////////////////

//울프람알파로 보낼때 호출하기
function StoreMatrix() {
	var matrix_string = "";
	var output_string ="";
    var txtBox = document.getElementById("plain_text");
    var Row = null;
	var A = null;
    Row = txtBox.value.split("\n");

    // 행렬 입력
    matrix_string = matrix_string + "{";
    for (var i = 0; i < Row.length; i++)
    {
        matrix[i] = new Array();
        A = Row[i].split(" ");

        matrix_string = matrix_string + "(";
        for (var j = 0; j < A.length; j++)
        {
           	matrix[i][j] = new Array();
           	console.log(A[j]);
            matrix[i][j] = A[j];
            if(j==A.length-1)
               matrix_string = matrix_string + A[j] + ")";
            else
            matrix_string = matrix_string + A[j] + ",";
        }
        if(i==Row.length-1)
            matrix_string = matrix_string + "}";
        else
            matrix_string = matrix_string + ",";
    }
    console.log(matrix_string);

    // radio button 결합

    if(document.getElementById("det").checked)
       output_string = "det " + matrix_string;

   if(document.getElementById("inverse").checked)
      output_string = "inverse " + matrix_string;

   if(document.getElementById("transpose").checked)
      output_string = "transpose " + matrix_string;

   if(document.getElementById("row_reduce").checked)
      output_string = "row reduce " + matrix_string;

   if(document.getElementById("eigenvalues").checked)
      output_string = "eigenvalues " + matrix_string;

   if(document.getElementById("rank").checked)
      output_string = "rank " + matrix_string;

   console.log(output_string);
}
// Reset button click
function Reset_Click() {
   matrix_string = "";
   document.getElementById("plain_text").value = "";
}
