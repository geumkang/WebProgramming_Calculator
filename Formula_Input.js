var SectionList = new Array();

var lastX = new Array();
var unit = 20;				// Formula Size Base Unit

var boundaryTimer;
var borderLineMoved = false;
var boundaryIdx = 0;
var DoShiftLine = false;

var totalNum = 0;				// Section Constructor index
var GuideLineType;

var g_current_section_start;


// Canvas related Variable
var canvas = new Array();
var chart = new Array();
var context;
var context2;

var backup = new Array();

//////////////////////////////////////////////////
//
// Section Related Function, Class
//
//////////////////////////////////////////////////

// Section Class
function Section(X, Y, W, H, isEditable){
	this.idx = totalNum++;						// 인덱스
	this.X = X;							// X 좌표(시작점)
	this.Y = Y;							// Y 좌표(시작점)
	this.W = W;							// 너비
	this.H = H;							// 높이
	this.isEditable = isEditable;		// 필기 가능 여부
}


// Check which Section the current cursor is in
function findSection(startX, startY){
	//console.log(startX + " " + startY);
	//console.log(SectionList[0].X + " " + SectionList[0].Y + " " + SectionList[0].W + " " + SectionList[0].H + " " );
	for(var i = SectionList.length-1; i >= 0 ; i--){
		if(SectionList[i].X < startX && SectionList[i].X + SectionList[i].W > startX
			&& SectionList[i].Y < startY && SectionList[i].Y + SectionList[i].H > startY){
			return SectionList[i].idx;
		}
		else{

		}
	}
	return -1;
}

//////////////////////////////////////////////////
//
// Resize Boundary of Formula  ~>  Mouse Down Event
//
//////////////////////////////////////////////////

// Is Cursor on the Boundary?
function isOnBoundary(){
	for(var i = 0; i < lastX.length; i++){
		if(event.clientX > lastX[i] - 10 && event.clientX < lastX[i] + 10) return i;
	}
	return -1;
}

// Draw Green Box on the Boundary
function holding(i){
	if(boundaryTimer)
		clearTimeout(boundaryTimer);
	if(borderLineMoved){
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = "rgb(0,255,0)"
		context.strokeRect(lastX[boundaryIdx] - 3, SectionList[i].Y, 6, SectionList[i].H);
		context.stroke();
		DoShiftLine = true;
	}

}


//////////////////////////////////////////////////
//
// Mouse event related functions
//
//////////////////////////////////////////////////


// When 'Mouse-Down' Event Occur
function registerDrawingMode(event) {
	// Boundary Clicked? 0.1s
	boundaryIdx = isOnBoundary();
	if(boundaryIdx != -1){
		borderLineMoved = true;
		boundaryTimer = setTimeout(function(){holding(findSection(event.clientX - 10, event.clientY));}, 100);
	}
	//Drag Event handler
	g_current_section_start = findSection(event.clientX, event.clientY);
}



// When 'Mouse-Up' Event Occur
function releaseDrawingMode() {

	if(!DoShiftLine){
		// //Drag Event handler
		var current_section_end = findSection(event.clientX, event.clientY);
		var common_parent = search_common_parent(g_current_section_start, current_section_end);
		//console.log(g_current_section_start + "  " + current_section_end + "  " + common_parent.index);

		var type = get_button_type();
		//console.log(type);

		insert_operation(type, common_parent, totalNum);
		//console.log(calculate_tree_toString(root_node));

		// context2.beginPath();
		// context2.lineWidth = 1;
		// context2.setLineDash([3,1]);
		// context2.strokeStyle = "rgb(255,0,0)"

		// var X = lastX[lastX.length - 1];
		// var Y = SectionList[common_parent.index].Y + (SectionList[common_parent.index].H / 2);

		// var Symbol = new Section(X, Y - (unit*1), (unit*2), (unit*2), false);	// 더하기
		// var NDSection  = new Section(X + (unit*2), Y - (canvas[0].height/2), (unit*12), canvas[0].height, true);	// 더하기 옆 공간

		// SectionList.push(Symbol);
		// SectionList.push(NDSection);

		if(tree_search(root_node, g_current_section_start).type != "Arithmetic"){
			drawFormulaRoot(g_current_section_start, current_section_end);
		}
		// context2.strokeRect(X, Y - (unit*1), (unit*2), (unit*2));
		// context2.strokeRect(X + (unit*2), Y - (canvas[0].height/2), (unit*12), canvas[0].height);

		// lastX.push(lastX[lastX.length-1] + unit*14);

		// context2.stroke();
		// context2.setLineDash([0]);

		borderLineMoved = false;
	}
	// 가이드라인 위치 변경 중
	else{
		refreshGuideLine();
		DoShiftLine = false;
	}

	backup.push(SectionList.slice());
}

function drawFormulaRoot(startIndex, endIndex){
	var X = SectionList[startIndex].X;
	var Y = SectionList[startIndex].Y;
	var img = new Image();
	img.src = "./Formula_Root.png";
	context2.drawImage(img, 0, 0, img.width, img.height, X, Y + (SectionList[startIndex].H/3), img.width/2, SectionList[startIndex].H/3);
	
	var dragRange = SectionList[endIndex].X + SectionList[endIndex].W - SectionList[startIndex].X;
	var img2 = new Image();
	img2.src = "./Formula_Bar.png";
	console.log(img2.width);
	for(var i = img.width/2; i < dragRange - img2.width; i = i + img2.width){
		context2.drawImage(img2, 0, 0, img2.width, img2.height, X+i, Y + (SectionList[startIndex].H/3), img2.width, SectionList[startIndex].H/3);
	}		
}

// Redraw GuideLine When Formula Resized  ~>  Mouse Up Event
function refreshGuideLine(){
	var shiftRange = event.clientX - lastX[boundaryIdx];
	for(var i = 0; i < SectionList.length; i++){
		if(SectionList[i].X + SectionList[i].W > lastX[boundaryIdx] - 5 && SectionList[i].X < lastX[boundaryIdx] - 5){
			SectionList[i].W = SectionList[i].W + shiftRange;
		}
		else if(SectionList[i].X >= lastX[boundaryIdx]){
			SectionList[i].X = SectionList[i].X + shiftRange;
		}
	}
	for(var i = boundaryIdx; i < lastX.length; i++){
		lastX[i] = lastX[i] + shiftRange;
	}
	drawGuideLine();
}

function drawGuideLine(){
	context2.clearRect(0, 0, canvas[0].width, canvas[0].height);

	context2.beginPath();
	context2.lineWidth = 1;
	context2.setLineDash([3,1]);
	context2.strokeStyle = "rgb(255,0,0)";
	for(var i = 1; i < SectionList.length; i++){
		context2.strokeRect(SectionList[i].X, SectionList[i].Y, SectionList[i].W, SectionList[i].H);
		var currentNode = tree_search(root_node, i);
		if(currentNode.type == "Sigma"){
			var img = new Image();
			img.src = document.getElementById("Sigma").src;
			context2.drawImage(img, 0, 0, img.width, img.height, SectionList[i].X, SectionList[i].Y, SectionList[i].W, SectionList[i].H);
		}
		else if(currentNode.type == "Integral"){
			var img = new Image();
			img.src = document.getElementById("Integral").src;
			context2.drawImage(img, 0, 0, img.width, img.height, SectionList[i].X, SectionList[i].Y, SectionList[i].W, SectionList[i].H);
		}
		else if(currentNode.type == "Arithmetic"){
			var img = new Image();
			if(currentNode.value == "Plus")
				img.src = document.getElementById("Plus").src;
			else if(currentNode.value == "Minus")
				img.src = document.getElementById("Minus").src;
			else if(currentNode.value == "Multiply")
				img.src = document.getElementById("Multiply").src;
			else if(currentNode.value == "Divide")
				img.src = document.getElementById("Divide").src;
			context2.drawImage(img, 0, 0, img.width, img.height, SectionList[i].X, SectionList[i].Y, SectionList[i].W, SectionList[i].H);
		}
		if(currentNode.type == "Root"){
			var img = new Image();
			// var topLeftNode = currentNode.nodeList[0];
			// var topRightNode = currentNode.nodeList[topRightNode.nodelist.length-1];
			// while(topLeftNode.nodelist.length != 0)
			// 	topLeftNode = topLeftNode.nodelist[0];
			// while(topRightNode.nodelist.length != 0)
			// 	topRightNode = topRightNode.nodelist[topRightNode.nodelist.length-1];
			//drawFormulaRoot(topLeftNode.index, topRightNode.index);	
		}
	}
	context2.stroke();
	context2.setLineDash([0]);


	context.clearRect(0, 0, canvas[0].width, canvas[0].height);
}

// When 'Mouse-Move' Event Occur
function drawPath(event) {
	if(!DoShiftLine){
		if(borderLineMoved == true){
			if(event.clientX > lastX[boundaryIdx] - 10 && event.clientX < lastX[boundaryIdx] + 10){}
			else borderLineMoved = false;
		}
	}
	else{
		var i = findSection(event.clientX, event.clientY);
		context.clearRect(0, 0, canvas[0].width, canvas[0].height);
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = "rgb(0,255,0)"
		context.strokeRect(event.clientX, SectionList[i].Y, 6, SectionList[i].H);
		context.stroke();
	}
}

// Release Drop Event  ~> DragOver Event
function allowDrop(ev)
{
	ev.preventDefault();

	var i = findSection(event.clientX, event.clientY);

	//console.log(i);
}

// 현재 Drag대상 Img의 id를 ev.dataTransfer에 저장  ~>  DragStart Event
function dragStart(ev)
{
	ev.dataTransfer.setData("text", ev.target.id);
}

// Drop 이벤트시 호출. Drag대상의 Img id를 바탕으로 src추적, 해당 이미지로 변환 (canvas 한정)
// 현재 canvas를 tracing
// When 'Mouse Drop' Event Occur
function dropEnd(ev)
{
	ev.preventDefault();

	var exprType = ev.dataTransfer.getData("text");
	var i = findSection(event.clientX, event.clientY);

	console.log(exprType);

	drawLineAndExpr(i, exprType);
}

// Check new Formula Overlapped
// function isDrawable(i, X, Y){
// 	var compare = findSection(X, Y);
// 	if(compare == i || compare == 0)
// 		return true;
// 	else
// 		return false;
// }

// Draw Line And Expr
function drawLineAndExpr(i, exprType)
{
	//Try Catcher
	if(!SectionList[i].isEditable)
	{
		return -1;
	}

	// // Can't Draw by Overlapping
	// if((isDrawable(X, Y - (unit*3)) && isDrawable(X, Y + (unit*7)) &&
	// 		isDrawable(X + (unit*12), Y - (unit*3)) && isDrawable(X + (unit*12), Y + (unit*7))) == false){
	// 	return -1;
	// }

	if(exprType == "Sigma")
	{
		if(i == 0){
			var X = lastX[lastX.length - 1];
			var limitX = unit*12;
		}
		else{
			var X = SectionList[i].X;
			var limitX = SectionList[i].W - (unit*4);
			//console.log(X + " asdad " + limitX);
		}
		var Y = SectionList[i].Y + (SectionList[i].H / 2);

		var Symbol = new Section(X, Y - (unit*2), (unit*4), (unit*4), false);								// Sigma
		var Inner  = new Section(X + (unit*4), Y - SectionList[i].H/2, limitX, SectionList[i].H, true);		// 시그마 옆
		var From = new Section(X, Y + (unit*2), (unit*4), (unit*3), true);									// From
		var To = new Section(X, Y - (unit*5), (unit*4), (unit*3), true);									// To

		SectionList.push(Symbol);
		SectionList.push(Inner);
		SectionList.push(From);
		SectionList.push(To);

		if(i == 0) lastX.push(lastX[lastX.length-1] + unit*16);

		//Tree procedure
		var current_node = tree_search(root_node, i);
		var insert_node = new calculate_tree(totalNum-4, exprType, current_node);

		push_to_nodelist(insert_node, new calculate_tree(totalNum-3, "ND", insert_node));
		push_to_nodelist(insert_node, new calculate_tree(totalNum-2, "ND", insert_node)); //from
		push_to_nodelist(insert_node, new calculate_tree(totalNum-1, "ND", insert_node)); //to

		push_to_nodelist(current_node, insert_node);

		console.log(get_total_expr());
	}

	else if(exprType == "Integral")
	{
		if(i == 0){
			var X = lastX[lastX.length - 1];
			var limitX = unit*10;
		}
		else{
			var X = SectionList[i].X;
			var limitX = SectionList[i].W - (unit*6);
			//console.log(X + " asdad " + limitX);
		}
		var Y = SectionList[i].Y + (SectionList[i].H / 2);

		var Symbol = new Section(X, Y - (unit*5), (unit*3), (unit*10), false);								// Integral
		var Inner  = new Section(X + (unit*6), Y - SectionList[i].H/2, limitX, SectionList[i].H, true);		// 인테그럴 옆
		var From = new Section(X + (unit*3), Y - (unit*5), (unit*3), (unit*5), true);						// 인테그럴 아래
		var To = new Section(X + (unit*3), Y, (unit*3), (unit*5), true);									// 인테그럴 위

		SectionList.push(Symbol);
		SectionList.push(Inner);
		SectionList.push(From);
		SectionList.push(To);

		if(i == 0) lastX.push(lastX[lastX.length-1] + unit*16);

		//Tree procedure
		var current_node = tree_search(root_node, i);
		var insert_node = new calculate_tree(totalNum-4, exprType, current_node);

		push_to_nodelist(insert_node, new calculate_tree(totalNum-3, "ND", insert_node));
		push_to_nodelist(insert_node, new calculate_tree(totalNum-2, "ND", insert_node));//from
		push_to_nodelist(insert_node, new calculate_tree(totalNum-1, "ND", insert_node));//to

		push_to_nodelist(current_node, insert_node);

		console.log(get_total_expr());
	}
	else if(exprType == "plain_text")
	{
		var current_node = tree_search(root_node, i);

		console.log(current_node);

		current_node.type = "plain_text";
		current_node.value = document.getElementById(exprType).value;
		console.log(current_node.value);

		//Position NOT DEFINED NOW!! FIXES NEEDED!

		context2.font = "20px Georgia";
		context2.fillText(current_node.value,SectionList[i].X, SectionList[i].Y + SectionList[i].H/2);

		console.log(get_total_expr());
	}
	else if(false)
	{

	}
	else if(false)
	{

	}
	else
	{
		var current_node = tree_search(root_node, i);
		current_node.type = exprType;
		console.log(get_total_expr());
	}

	drawGuideLine();

	backup.push(SectionList.slice());
}
function undo(){
	backup.pop();
	context2.clearRect(0, 0, canvas[0].width, canvas[0].height);
	SectionList = backup[backup.length - 1].slice();

	context2.beginPath();
	context2.lineWidth = 1;
	context2.setLineDash([3,1]);
	context2.strokeStyle = "rgb(255,0,0)"

	for(var i = 0; i < SectionList.length; i++){
		context2.strokeRect(SectionList[i].X, SectionList[i].Y, SectionList[i].W, SectionList[i].H);
	}

	context2.stroke();
	context2.setLineDash([0]);
	context.clearRect(0, 0, canvas[0].width, canvas[0].height);


}

//////////////////////////////////////////////////
//
// Enlarge Window On/Off (dblclick Event)
//
//////////////////////////////////////////////////

// Show Enlarge Window  ~>  dblclick event
function enlargeWindowOn(event){
	var i = findSection(event.clientX, event.clientY);
	if(SectionList[i].isEditable == true){
		var cv = document.getElementById("chart2");

		var top = (SectionList[i].Y - 500) + "px";
		var left = (SectionList[i].X + 7) + "px";
		console.log("top = " + top + " left = " + left);

		cv.style.top = top;
		cv.style.left = left;
		cv.style.display = "block";
	}
}

// Hide Enlarge Window  ~>  dblclick event
function enlargeWindowOff(){
	var cv = document.getElementById("chart2");
	cv.style.display = "none";
}


//////////////////////////////////////////////////
//
// General <-> Matrix Convert Functions
//
//////////////////////////////////////////////////

// General Formula  <->  Matrix Formula GuideLine Change Check
function GuideLineTypeChanged(){
	context.clearRect(0, 0, canvas[0].width, canvas[0].height);
	context2.clearRect(0, 0, canvas[0].width, canvas[0].height);
	Init();
	console.log("enter Change" + GuideLineType);
	if(GuideLineType == 1){
		SectionList = [];
		DrawGuideLineMatrix();
	}
}

// Draw Matrix Formula GuideLine
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
		var temp = new Section(0, 0, canvasW, canvasH, true);
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
				var temp = new Section(canvasW / ColCount * (i-1), canvasH / RowCount * (j-1), canvasW / ColCount, canvasH / RowCount, true);
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



//////////////////////////////////////////////////
//
// Initizlize Settings.
//
//////////////////////////////////////////////////

// First Working ..
window.onload = function() {
	Init();
}

// Initial Setting
function Init(){

	// Check General or Matrix
	var target = document.getElementById("FormulaSelectBox");
	GuideLineType = target.options[target.selectedIndex].value;
	if(GuideLineType == 0){
		document.getElementById("MatrixRowSelectBox").disabled = true;
		document.getElementById("MatrixColSelectBox").disabled = true;
	}
	else{
		document.getElementById("MatrixRowSelectBox").disabled = false;
		document.getElementById("MatrixColSelectBox").disabled = false;
	}

	// Initialize SectionList
	SectionList = new Array();
	idx = 0;

	for(var i = 0;i < 3; i++){
		chart[i] = 'chart' + i;
		canvas[i] = document.getElementById(chart[i]);
	}
	// Section[0] = Canvas
	var firstPos = new Section(0, 0, canvas[0].width, canvas[0].height, true);
	SectionList.push(firstPos);
	idx++;

	// canvas[0] = context2 = Background Canvas
	// canvas[1] = context = Foreground Canvas
	context2 = canvas[0].getContext('2d');
	context = canvas[1].getContext('2d');

	// Tree Init
	init_tree();

	// Boundary Init
	lastX.push(0);
}