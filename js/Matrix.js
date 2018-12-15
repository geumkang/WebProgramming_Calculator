

var FormulaMode ;
var matrix = new Array();
var RowCount = 1;
var ColCount = 1;




function MatrixSizeChanged(){
	Init_matrix();
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

	context_matrix.beginPath();
	context_matrix.lineWidth = 1;
	context_matrix.setLineDash([3,1]);
	context_matrix.strokeStyle = "rgb(255,0,0)"

	var canvasW = canvas.width;
	var canvasH = canvas.height;

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
					context_matrix.moveTo(canvasW / ColCount * i, 0);
					context_matrix.lineTo(canvasW / ColCount * i, canvasH);
				}
				if(i == 1 && j < RowCount){
					context_matrix.moveTo(0, canvasH / RowCount * j);
					context_matrix.lineTo(canvasW, canvasH / RowCount * j);
				}
				// var temp = new Section(idx + 1, canvasW / ColCount * (i-1), canvasH / RowCount * (j-1), canvasW / ColCount, canvasH / RowCount, true);
				// SectionList.push(temp);
				// console.log(idx + " : " + SectionList[idx-1].X + " " + SectionList[idx-1].Y + " " + SectionList[idx-1].W + " " + SectionList[idx-1].H);
				// idx++;

			}
		}
	}
//	console.log("SectionList 개수 : " + SectionList.length);
	context_matrix.stroke();

	context_matrix.setLineDash([0]);
}


// 초기 설정
function Init_matrix(){
	matrix = new Array();
	matrix_string = "";

	document.getElementById("plain_text2").value = "";




	// 변수 초기화
	SectionList = new Array();

	canvas_matrix = document.getElementById("chart3");

	context_matrix = canvas_matrix.getContext('2d');
	context_matrix.font = "20px Georgia";
	context_matrix.setLineDash([3, 1]);
	context_matrix.clearRect(0, 0, canvas_matrix.width, canvas_matrix.height);
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
	var X = 1200;
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

			context_matrix.fillText(value, charX, charY);
			console.log("숫자 그림");
			_x+=1;
		}_y+=1;
	}
}


///////////////////////////////////////////////////////////////////////////////////////


function allowDrop_Matrix(ev){
	ev.preventDefault();
console.log("canvas이동!");}

function dragStart_Matrix(ev){
	ev.dataTransfer.setData("text", ev.target.id);
	StoreMatrix();
	console.log("드래그 시작" + ev.target.id);
}

function drop_Matrix(ev) {
	 ev.preventDefault();
	 //var c = ev.dataTransfer.getData("text");
	 console.log("확인?");
	 drawMatrixValue();
 	console.log("확인?");
	 //ev.target.appendChild(document.getElementById(c));
 }



///////////////////////////////////////////////////////////////////////////////////

//울프람알파로 보낼때 호출하기
function StoreMatrix() {
	var matrix_string = "";
	var output_string ="";
    var txtBox = document.getElementById("plain_text2");
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

function menu_select(click_id){
	context.clearRect(0, 0, canvas.width, canvas.height);
	contextDash.clearRect(0, 0, canvas.width, canvas.height);

	if(click_id == "general"){
		FormulaMode = 0;
		document.getElementById('matrix_input_button').style.display = "none";
		document.getElementById('general_input_button').style.display = "block";
		document.getElementById('chart').style.display = "block";
		document.getElementById('chart2').style.display = "block";
		document.getElementById('chart3').style.display = "none";

		Init();
		console.log(FormulaMode);
	}
	else{
		FormulaMode = 1;
		document.getElementById('general_input_button').style.display = "none";
		document.getElementById('matrix_input_button').style.display = "block";
		document.getElementById('chart').style.display = "none";
		document.getElementById('chart2').style.display = "none";
		document.getElementById('chart3').style.display = "block";

		document.getElementById("MatrixRowSelectBox").value = 1;
		document.getElementById("MatrixColSelectBox").value = 1;

		MatrixSizeChanged();
		context_matrix.clearRect(0, 0, canvas.width, canvas.height);
		console.log(FormulaMode);
	}


}
