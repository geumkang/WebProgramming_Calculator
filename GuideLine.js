var SectionList = new Array();
var mouseSection = -1;
var GuideLineMode = true;
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
	if(node){
		// console.log("node : " + node.nodelist);
		// console.log("SectionX : " + section.X);
		// console.log("SectionY : " + section.Y);
		// console.log("SectionW : " + section.W);
		// console.log("SectionH : " + section.H);

		if(node.value == "sigma"){
			var max = 0;
			var temp, temp2;
			console.log(getSize(node));
			temp = traverse(node.nodelist[0], new Section(section.X, section.H/2 + getSize(node)/2, getSize(node), section.H/2 - getSize(node)/2));
			temp2 = traverse(node.nodelist[1], new Section(section.X, section.Y, getSize(node), section.H/2 - getSize(node)/2));
			drawGuideLine(section.X, section.Y+section.H/2-getSize(node)/2, section.W, getSize(node), node);
			if(max < getSize(node) - temp.W)
				max = getSize(node) - temp.W;
			if(max < getSize(node) - temp2.W)
				max = getSize(node) - temp2.W;
			if(max < getSize(node))
				max = getSize(node);
			section = traverse(node.nodelist[2], new Section(section.X + max, section.Y, section.W - max, section.H));
			
		}
		else if(node.value == "integral"){
			var max = 0;
			var temp, temp2;
			section = drawGuideLine(section.X, section.Y, section.W, section.H, node);
			temp = traverse(node.nodelist[0], new Section(section.X, section.Y+section.H/2, getSize(node), section.H/2));
			temp2 = traverse(node.nodelist[1], new Section(section.X, section.Y, getSize(node), section.H/2));
			if(max < getSize(node) - temp.W)
				max = getSize(node) - temp.W;
			if(max < getSize(node) - temp2.W)
				max = getSize(node) - temp2.W;
			section = traverse(node.nodelist[2], new Section(section.X+max, section.Y, section.W-max, section.H));
		}
		else if(node.type == ONLYDRAWABLE){
			/* 루트 */
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

	contextDash.strokeStyle = "rgb(255,0,0)";
	if(GuideLineMode) contextDash.strokeRect(X,Y,getSize(node),H);
	SectionList.push(new Section(X,Y,getSize(node),H, true, node));

	if(value == "sigma"){
		var img = new Image();
		img.src = document.getElementById("sigma").src;
		context.drawImage(img, 0, 0, img.width, img.height, X, Y + H/2 - getSize(node)/2, getSize(node), getSize(node));
	}
	else if(value == "integral"){
		var img = new Image();
		img.src = document.getElementById("integral").src;
		context.drawImage(img, 0, 0, img.width, img.height, X, Y+10, getSize(node), H-20);
	}
	else{
		context.fillText(node.value, X, Y + H/2, getSize(node), H);
	}

	return new Section(X+getSize(node), Y, W-getSize(node), H);
}


function getSize(node){
	if(node){
		var type = node.type;
		var value = node.value;
		var unit = 50;

		if(type == NOTDEFINED){
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

function mouseMove(ev){
	if(!GuideLineMode){
		current = findSection(event.offsetX, event.offsetY);
		
		if(mouseSection == -1){
			contextDash.clearRect(0, 0, canvas.width, canvas.height);
			contextDash.strokeStyle = "rgb(255,0,0)";
			contextDash.strokeRect(current.X,current.Y,current.W,current.H);
			mouseSection = current;
		}
		else{
			if(mouseSection != current){
				contextDash.clearRect(0, 0, canvas.width, canvas.height);
				contextDash.strokeStyle = "rgb(255,0,0)";
				contextDash.strokeRect(current.X,current.Y,current.W,current.H);
				mouseSection = current;
			}
		}
	}
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
		contextDash.strokeStyle = "rgb(255,0,0)";
		for(var i = 0; i < SectionList.length; i++){
			contextDash.strokeRect(SectionList[i].X,SectionList[i].Y,SectionList[i].W,SectionList[i].H);
		}
	}
	GuideLineMode = !GuideLineMode;
}


