

var isLeftButtonPressed = false;
var oldX = 0;
var oldY = 0;
var SectionList = new Array();

var isDrawing = false;
var idx = 0;
var currentSectionIdx = 0;

function Section(idx, X, Y, W, H){
	this.idx = idx;
	this.X = X;
	this.Y = Y;
	this.W = W;
	this.H = H;
}



// 컨텍스트 얻기
var canvas = new Array();
var chart = new Array();
var context;
var context2;

function registerDrawingMode(event) {
	var event = event || window.event;
	var button = event.which || event.button;

	var startX = 0;
	var startY = 0;
	var currentSection = 0;

	if (button == 1) {
		isLeftButtonPressed = true;
		oldX = event.clientX;
		oldY = event.clientY;
	} else {
		isLeftButtonPressed = false;
	}
	
	// 그리기 시작한 지점
	if(isDrawing == false){
		startX = event.clientX;
		startY = event.clientY;
		isDrawing = true;
		currentSection = findSection(startX, startY);
		if(currentSection == -1) alert("이상한데 눌러쪄염");
	}
}

// 어느 구역에 있는지 체크
function findSection(startX, startY){
	console.log(startX + " " + startY);
	console.log(SectionList[0].X + " " + SectionList[0].Y + " " + SectionList[0].W + " " + SectionList[0].H + " " );
	for(var i = 0; i < SectionList.length; i++){
		if(SectionList[i].X < startX && SectionList[i].X + SectionList[i].W > startX 
			&& SectionList[i].Y < startY && SectionList[i].Y + SectionList[i].H > startY){
			currentSectionIdx = i;
			return SectionList[i].idx;
		}
		else{

		}
	}
	return -1;
}

function releaseDrawingMode() {
	isLeftButtonPressed = false;
	// alert(canvas.width + " " + canvas.height);
	DrawGuideLine();
	context2.stroke();
	context2.setLineDash([0]);
	isDrawing = false;
}

function DrawGuideLine(){
	context2.beginPath();
	context2.lineWidth = 1;
	context2.setLineDash([3,1]);
	context2.strokeStyle = "rgb(255,0,0)"
	
	var i = currentSectionIdx;

	// for(i = 0; i < SectionList.length; i++){
	// 	if(SectionList[i].idx == currentSection) break;
	// }

	context2.moveTo(SectionList[i].X, SectionList[i].Y + SectionList[i].H/2);
	context2.lineTo(SectionList[i].X + SectionList[i].W, SectionList[i].Y + SectionList[i].H/2);

	var temp1 = new Section(idx + 1, SectionList[i].X, SectionList[i].Y, SectionList[i].W, SectionList[i].H/2);
	var temp2 = new Section(idx + 2, SectionList[i].X, SectionList[i].Y + SectionList[i].H/2,  SectionList[i].W, SectionList[i].H/2);
	idx = idx + 2;

	SectionList.splice(i,1);
	SectionList.push(temp1);
	SectionList.push(temp2);
	
	console.log("SectionList 개수 : " + SectionList.length);
	console.log(SectionList[0].X + " " + SectionList[0].Y + " " + SectionList[0].W + " " + SectionList[0].H);
	console.log(SectionList[1].X + " " + SectionList[1].Y + " " + SectionList[1].W + " " + SectionList[1].H);
		
	
}

function drawPath(event) {
	if (isLeftButtonPressed) {
		
		context.beginPath();
		context.moveTo(oldX, oldY);
		context.lineTo(event.clientX, event.clientY);
		console.log(oldX+':'+oldY+':'+event.clientX+':'+event.clientY);

		oldX = event.clientX;
		oldY = event.clientY;

		context.lineWidth = 2;
		context.strokeStyle = '#FF9933';
		if(SectionList[currentSectionIdx].X < oldX && SectionList[currentSectionIdx].X + SectionList[currentSectionIdx].W > oldX 
			&& SectionList[currentSectionIdx].Y < oldY && SectionList[currentSectionIdx].Y + SectionList[currentSectionIdx].H > oldY){
			context.stroke();
		}
	}
}

window.onload = function() {

	for(var i = 0;i < 10; i++){
		chart[i] = 'chart' + i;
		canvas[i] = document.getElementById(chart[0]);
	}
	// canvas = document.getElementById(chart[0]);
	
	idx = 0;
	
	var firstPos = new Section(idx, 0, 0, canvas[0].width, canvas[0].height);
	SectionList.push(firstPos);
	idx++;
	
	context = canvas[0].getContext('2d');
	context2 = canvas[1].getContext('2d');
	
	// context2.beginPath();
	// context2.moveTo(SectionList[0].X1, SectionList[0].Y1);
	// context2.lineTo(SectionList[0].X2, SectionList[0].Y2);
	// context2.stroke();
}
