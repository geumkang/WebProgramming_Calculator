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

function traverse(node, Section){
	if(node){
		if(node.value == "Sigma" || node.value == "Integral"){
			traverse(node.nodelist[0], new Section(Section.X, Section.H/2 + getSize(node), Section.W, Section.H/2 - getSize(node)));
			traverse(node.nodelist[1], new Section(Section.X, Section.Y, Section.W, Section.H/2 - getSize(node)));
			Section = drawGuideLine(Section.W, Section.Y, Section.W, Section.H, node);
			traverse(node.nodelist[2], Section);
		}
		else if(node.type == ONLYDRAWABLE){
			/* 루트 */
		}

		else{
			traverse(node.nodelist[0], Section);
			Section = drawGuideLine(Section.W, Section.Y, Section.W, Section.H, node);
			traverse(node.nodelist[1], Section);
		}
	}
	return;
}


function drawGuideLine(X, Y, W, H, node){
	//context.clearRect(0, 0, canvas.width, canvas.height);

	context.beginPath();
	context.lineWidth = 1;
	context.setLineDash([3,1]);
	context.strokeStyle = "rgb(255,0,0)";

	context.strokeRect(X,Y,getSize(node),H);
	//context.fillText(node.value, X, Y + H / 2);

	SectionList.push(new Section(X,Y,getSize(node),H, node.NDtype, node));

	context.stroke();
	context.setLineDash([0]);

	return new Section(X+getSize(node), Y, W-getSize(node), H);
}


function getSize(node){
	var type = node.type;
	var value = node.value;
	var unit = 20;

	if(type == NOTDEFINED){
		return unit;
	}
	else if(type == ARITHMETIC){	// + - * /
		return unit;
	}
	else if(value == "Sigma" || value == "Integral"){
		return unit * 1.5;
	}
	else if(type == NONARITHMETIC){
		return node.value.length / 5 * unit;
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

var node = findSection(event.clientX, event.clientY);

	// 트리에 노드 추가
	insert(node, NONARITHMETIC, exprType);
	traverse(root_node.nodelist[0],new Section(0,0,canvas.width,canvas.height))
	//type = MathTree 참고
	//value = sigma, integral, 4, 5..



	console.log(exprType);
	console.log(root_node);
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
	// Initialize SectionList
	SectionList = new Array();
	SectionList.push(new Section(0,0,canvas.width, canvas.height, true, root_node.nodelist[0]));

}

function allowDrop(ev)
{
	ev.preventDefault();
}
