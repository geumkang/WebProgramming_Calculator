var current_button_type = "Root";

var circularVal = 0;
var circularNum = 1;
var button_name_list = new Array("Root");
//var button_name_list = new Array("Plus", "Minus", "Multiply", "Divide");

function get_button_type()
{
  return current_button_type;
}

function button_click(event)
{
  if(current_button_type != event.srcElement.name)
    current_button_type = event.srcElement.name;
  current_button_type = null;
}

/* This is high-level function. */
function handle(delta) {
	circularVal++;	
	document.getElementById("Arithmetic").setAttribute("src", "./Formula_" + button_name_list[circularVal % circularNum] + ".png")
	document.getElementById("Arithmetic").setAttribute("name", button_name_list[circularVal % circularNum]);
	current_button_type = button_name_list[circularVal % circularNum];
}


/* Event handler for mouse wheel event. */
var count = 0;
function wheel(event){
	count++;
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta && event.srcElement.id == "Arithmetic") {
		delta = event.wheelDelta/120;
	} 
	else if (event.detail) delta = -event.detail/3;
	if (delta && count % 2 == 0) handle(delta);
}

/* Initialization code. */
if (window.addEventListener)
window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;