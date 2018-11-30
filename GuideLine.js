var SectionList = new Array();

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
	this.isEditable = isEditable;		// 필기 가능 여부
	this.node = node;
}

// Check which Section the current cursor is in
function findSection(startX, startY){
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


//////////////////////////////////////////////////
//
// Guide Line Related Function
//
//////////////////////////////////////////////////

function traverse(node, section){
	if(node){
		console.log("node : " + node.nodelist);
		console.log("SectionX : " + section.X);
		console.log("SectionY : " + section.Y);
		console.log("SectionW : " + section.W);
		console.log("SectionH : " + section.H);

		if(node.value == "sigma"){
			console.log(getSize(node));
			traverse(node.nodelist[0], new Section(section.X, section.H/2 + getSize(node)/2, getSize(node), section.H/2 - getSize(node)/2));
			traverse(node.nodelist[1], new Section(section.X, section.Y, getSize(node), section.H/2 - getSize(node)/2));
			section = drawGuideLine(section.X, section.Y, section.W, section.H, node);
			traverse(node.nodelist[2], section);
		}
		else if(node.value == "integral"){
			section = drawGuideLine(section.X, section.Y, section.W, section.H, node);
			traverse(node.nodelist[0], new Section(section.X, section.Y+section.H/2, getSize(node), section.H/2));
			traverse(node.nodelist[1], new Section(section.X, section.Y, getSize(node), section.H/2));
			traverse(node.nodelist[2], new Section(section.X+getSize(node.nodelist[2]), section.Y, section.W-getSize(node), section.H));
		}
		else if(node.type == ONLYDRAWABLE){
			/* 루트 */
		}

		else{
			traverse(node.nodelist[0], section);
			console.log("드러옴");
			section = drawGuideLine(section.X, section.Y, section.W, section.H, node);
			traverse(node.nodelist[1], section);
		}
	}
	return;
}


function drawGuideLine(X, Y, W, H, node){
	var type = node.type;
	var value = node.value;

	context.beginPath();
	context.lineWidth = 1;
	context.setLineDash([3,1]);
	context.strokeStyle = "rgb(255,0,0)";
	console.log(getSize(node) + "~!~!~");
	context.strokeRect(X,Y,getSize(node),H);
	SectionList.push(new Section(X,Y,getSize(node),H, node.NDtype, node));

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
		context.fillText(node.value, X, Y, getSize(node), H);
	}

	
	

	context.stroke();
	context.setLineDash([0]);

	return new Section(X+getSize(node), Y, W-getSize(node), H);
}


function getSize(node){
	var type = node.type;
	var value = node.value;
	var unit = 50;

	if(type == NOTDEFINED){
		return unit*2;
	}
	else if(type == ARITHMETIC){	// + - * /
		return unit;
	}
	else if(value == "sigma"){
		return unit * 3;
	}
	else if(value == "integral"){
		return unit;
	}
	else if(type == NONARITHMETIC){
		return node.value.length / 2 * unit;
	}
	else{
		console.log("Size Error : Unknown Type", node);
	}
}


//////////////////////////////////////////////////
//
// Mouse event related functions
//
//////////////////////////////////////////////////

function allowDrop(ev)
{
	ev.preventDefault();
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
	context.clearRect(0, 0, canvas.width, canvas.height);

	var exprType = ev.dataTransfer.getData("text");
	var node = findSection(event.clientX, event.clientY);
	if(node != -1){
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
		traverse(root_node.nodelist[0], new Section(0,0,canvas.width,canvas.height));
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
	// Check General or Matrix
	// var target = document.getElementById("FormulaSelectBox");
	// GuideLineType = target.options[target.selectedIndex].value;
	// if(GuideLineType == 0){
	// 	document.getElementById("MatrixRowSelectBox").disabled = true;
	// 	document.getElementById("MatrixColSelectBox").disabled = true;
	// }
	// else{
	// 	document.getElementById("MatrixRowSelectBox").disabled = false;
	// 	document.getElementById("MatrixColSelectBox").disabled = false;
	// }
	canvas = document.getElementById("chart");
	context = canvas.getContext('2d');
	console.log("width: " + canvas.width + "  height: " + canvas.height);
	// Initialize SectionList
	SectionList = new Array();
	SectionList.push(new Section(0,0,canvas.width, canvas.height, true, root_node.nodelist[0]));
}


