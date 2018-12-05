var SectionList = new Array();
var mouseSection = -1;
// true = always, false = optional
var GuideLineMode = true;
var DashColor = "rgb(255,0,0)"
var DragStartNode;
//////////////////////////////////////////////////
//
// Section Related Function, Class
//
//////////////////////////////////////////////////

// Section Class
function Section(X, Y, W, H, isEditable, node){
	this.X = X;							// X 좌표(시작점)
	this.Y = Y;							// Y 좌표(시작점)
	this.W = W;							// 너비
	this.H = H;							// 높이
	this.isEditable = isEditable;		// 드롭 가능 여부
	this.node = node;
}

// Check which Section the current cursor is in
function findSectionNode(startX, startY){
	//console.log(startX + " " + startY);
	//console.log(SectionList[0].X + " " + SectionList[0].Y + " " + SectionList[0].W + " " + SectionList[0].H + " " );
	for(var i = SectionList.length-1; i >= 0 ; i--){
		if(SectionList[i].X < startX && SectionList[i].X + SectionList[i].W > startX
			&& SectionList[i].Y < startY && SectionList[i].Y + SectionList[i].H > startY){
			return SectionList[i].node;
		}
		else{

		}
	}
	return -1;
}

function findSection(startX, startY){
	for(var i = SectionList.length-1; i >= 0 ; i--){
		if(SectionList[i].X < startX && SectionList[i].X + SectionList[i].W > startX
			&& SectionList[i].Y < startY && SectionList[i].Y + SectionList[i].H > startY){
			return SectionList[i];
		}
		else{

		}
	}
	return -1;
}


//////////////////////////////////////////////////
//
// Guide Line Related Function
//
//////////////////////////////////////////////////

function traverse(node, section){
	var size = getSize(node);
	if(node){
		// console.log("node : " + node.nodelist);
		// console.log("SectionX : " + section.X);
		// console.log("SectionY : " + section.Y);
		// console.log("SectionW : " + section.W);
		// console.log("SectionH : " + section.H);
		console.log(node.type);
		if(node.value == "sigma"){
			var max = 0;
			var temp, temp2;
			size = section.H*0.3;
			temp = traverse(node.nodelist[0], new Section(section.X, section.Y + section.H/2 + size/2, size, section.H/2 - size/2));
			temp2 = traverse(node.nodelist[1], new Section(section.X, section.Y, size, section.H/2 - size/2));
			drawGuideLine(section.X, section.Y + section.H/2 - size/2, size, size, node);
			if(max < size - temp.W)
				max = size - temp.W;
			if(max < size - temp2.W)
				max = size - temp2.W;
			if(max < size)
				max = size;
			section = traverse(node.nodelist[2], new Section(section.X + max, section.Y, section.W - max, section.H));	
		}
		else if(node.value == "integral"){
			var max = 0;
			var temp, temp2;
			section = drawGuideLine(section.X, section.Y, section.W, section.H, node);
			temp = traverse(node.nodelist[0], new Section(section.X, section.Y+section.H/2+section.H/4, size, section.H/4));
			temp2 = traverse(node.nodelist[1], new Section(section.X, section.Y, size, section.H/4));
			if(max < size - temp.W)
				max = size - temp.W;
			if(max < size - temp2.W)
				max = size - temp2.W;
			section = traverse(node.nodelist[2], new Section(section.X+max, section.Y, section.W-max, section.H));
		}
		else if(node.type == UPPERNODE){
			section = drawGuideLine(section.X, section.Y, section.W, section.H, "(");
			section = traverse(node.nodelist[0], new Section(section.X, section.Y, section.W, section.H));
			section = drawGuideLine(section.X, section.Y, section.W, section.H, ")");
			section = drawGuideLine(section.X, section.Y, section.W, section.H/2, node.nodelist[1]);
		}

		else{
			section = traverse(node.nodelist[0], section);
			section = drawGuideLine(section.X, section.Y, section.W, section.H, node);
			section = traverse(node.nodelist[1], section);
		}
	}
	return section;
}


function drawGuideLine(X, Y, W, H, node){
	var type = node.type;
	var value = node.value;
	var size = getSize(node);
	if(value == "sigma") size = W;

	contextDash.strokeStyle = DashColor;
	if(GuideLineMode) contextDash.strokeRect(X,Y,size,H);
	SectionList.push(new Section(X,Y,size,H, true, node));

	if(node == "(" || node == ")"){
		context.fillText(node, X, Y + H/2, size, H);
	}
	else if(value == "sigma"){
		var img = new Image();
		img.src = document.getElementById("sigma").src;
		context.drawImage(img, 0, 0, img.width, img.height, X, Y, W, H);
	}	
	else if(value == "integral"){
		var img = new Image();
		img.src = document.getElementById("integral").src;
		context.drawImage(img, 0, 0, img.width, img.height, X, Y+10, size, H-20);
	}
	else if(type == UPPERNODE){
		//context.fillText(node.value, X, Y + H/2, size, H);
	}
	else{
		context.fillText(node.value, X, Y + H/2, size, H);
	}

	return new Section(X+size, Y, W-size, H);
}


function getSize(node){
	if(node){
		var type = node.type;
		var value = node.value;
		var unit = 50;

		if(node == "(" || node == ")"){
			return unit.length / 5 * unit;
		}
		else if(type == NOTDEFINED){
			return unit*2;
		}
		else if(type == ARITHMETIC){	// + - * /
			return unit / 5;
		}
		else if(value == "sigma"){
			return unit * 3;
		}
		else if(value == "integral"){
			return unit;
		}
		else if(type == NONARITHMETIC){
			return node.value.length / 5 * unit;
		}
		else{
			console.log("Size Error : Unknown Type", node);
		}
	}
	else return 0;
}


//////////////////////////////////////////////////
//
// Mouse event related functions
//
//////////////////////////////////////////////////

function allowDrop(ev)
{
	ev.preventDefault();
	mouseMove(ev);
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
	var node = findSectionNode(event.offsetX, event.offsetY);

	if(node != -1){
		context.clearRect(0, 0, canvas.width, canvas.height);
		contextDash.clearRect(0, 0, canvas.width, canvas.height);
		if(exprType == "plain_text"){
			insert(node, NONARITHMETIC, document.getElementById(exprType).value);	
		}
		else if(exprType == "plus" || exprType == "minus" || exprType == "multiply" || exprType == "divide"){
			insert(node, ARITHMETIC, exprType);	
		}
		else{
			insert(node, NONARITHMETIC, exprType);
		}
		console.log(root_node);
		SectionList = new Array();
		traverse(root_node.nodelist[0], new Section(0,0,canvas.width,canvas.height));
	}
}

// 이동하면서 지나는 구역들에 가이드라인을 그려줌
function mouseMove(ev){
	current = findSection(event.offsetX, event.offsetY);
	
	if(mouseSection == -1){
		if(!GuideLineMode)
			contextDash.clearRect(0, 0, canvas.width, canvas.height);
		contextDash.strokeStyle = DashColor;
		contextDash.strokeRect(current.X,current.Y,current.W,current.H);
		mouseSection = current;
	}
	else{
		if(mouseSection != current){
			if(!GuideLineMode)
				contextDash.clearRect(0, 0, canvas.width, canvas.height);
			contextDash.strokeStyle = DashColor;
			contextDash.strokeRect(current.X,current.Y,current.W,current.H);
			mouseSection = current;
		}
	}
	
}

function drawStart(ev){
	DashColor = "rgb(0,0,255)"
	contextDash.strokeStyle = DashColor;
	var node = findSectionNode(event.offsetX, event.offsetY);
	var section = findSection(event.offsetX, event.offsetY);
	DragStartNode = node;
	console.log(node.parent_node);
	for(var i = SectionList.length - 1; i > -1; i--){
		if(search_common_parent(node,SectionList[i].node) == node){
			contextDash.strokeRect(SectionList[i].X,SectionList[i].Y,SectionList[i].W,SectionList[i].H);
		}
	}
}

function drawEnd(ev){
	DashColor = "rgb(255,0,0)";
	contextDash.strokeStyle = DashColor;
	if(GuideLineMode){
		contextDash.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = SectionList.length - 1; i > -1; i--){
			contextDash.strokeRect(SectionList[i].X,SectionList[i].Y,SectionList[i].W,SectionList[i].H);	
		}		
	}

	var Endnode = findSectionNode(event.offsetX, event.offsetY);
	var CommonParentNode = search_common_parent(DragStartNode, Endnode);
	insert(CommonParentNode, UPPERNODE, "pow");
	
	SectionList = new Array();
	traverse(root_node.nodelist[0], new Section(0,0,canvas.width,canvas.height));
	
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

	init_tree();

	canvas = document.getElementById("chart");
	canvas2 = document.getElementById("chart2");
	
	context = canvas2.getContext('2d');
	context.font = "20px Georgia";

	contextDash = canvas.getContext('2d');
	contextDash.setLineDash([3,1]);
	
	// Initialize SectionList
	SectionList = new Array();
	SectionList.push(new Section(0,0,canvas.width, canvas.height, true, root_node.nodelist[0]));
}

function GuideLineModeChanged(){	
	if(GuideLineMode == true){
		contextDash.clearRect(0, 0, canvas.width, canvas.height);
	}
	else if(GuideLineMode == false){
		contextDash.clearRect(0, 0, canvas.width, canvas.height);
		contextDash.strokeStyle = DashColor;
		for(var i = 0; i < SectionList.length; i++){
			contextDash.strokeRect(SectionList[i].X,SectionList[i].Y,SectionList[i].W,SectionList[i].H);
		}
	}
	GuideLineMode = !GuideLineMode;
}


