var root_node;


var identifier = 0;

/*TYPEDEF*/
const ARITHMETIC      =   1001;
const NONARITHMETIC   =   1002;
const UPPERNODE       =   1003;
const NOTDEFINED      =   1004;
const ROOTNODE        =   1005;

function init_tree()
{
  root_node = new calculate_tree_root();
  push_to_nodelist(root_node, new calculate_tree(NOTDEFINED, "Drag Here!", root_node));

  return root_node;
}

function calculate_tree_root()
{
    this.parent_node = null;
		this.type = ROOTNODE;
		this.nodelist = new Array();
    this.value = null;

    this.id = identifier++;
}

function calculate_tree(type, value, parent_node)
{
    this.parent_node = parent_node;
		this.type = type;
		this.nodelist = new Array();
    this.value = value;

    this.id = identifier++;
}

function insert(current_node, type, value)
{
  var _value = StringTokenizerForExpr(value);
  var nodeptr = current_node;
  var target_node = new calculate_tree(type, value, null);

  //upernode 전처리
  if(type == UPPERNODE){
    insert_node(current_node, target_node);
    return;
  }

  //sigma / integral 전처리
  else if(type == NONARITHMETIC && ( value == "sigma" || value == "integral")){
    push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "Drag Here!", target_node));
    push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "Drag Here!", target_node));
    push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "Drag Here!", target_node));
    insert_node(current_node, target_node);
    return;
  }
  //복합사칙연
  else if(type == NONARITHMETIC){
    for(var i = 0; i < _value.length; i++){
      if(_value[i] == "+" || _value[i] == "-" || _value[i] == "*" || _value[i] == "/"){
        if(_value[i] == "+")
          var typevalue = "plus";
        else if(_value[i] == "-")
          var typevalue = "minus";
        else if(_value[i] == "*")
          var typevalue = "multiply";
        else if(_value[i] == "/")
          var typevalue = "divide";
        var res = insert_node(nodeptr, new calculate_tree(ARITHMETIC, typevalue, null));
        if(res == 0) return;
        nodeptr = nodeptr.parent_node.nodelist[1];
      }
      else if(_value[i] != ""){
        var res = insert_node(nodeptr, new calculate_tree(NONARITHMETIC, _value[i], null));
        if(res == 0) return;
      }
    }
  }
}

/*
current_node : currently clicked node
target_node : node to insert
*/
function insert_node(current_node, target_node)
{
  //Validation

  if(target_node.type == UPPERNODE){
    __insert_ANY2UN(current_node, target_node);
    return 1;
  }

  else if(current_node.type == ARITHMETIC
    || ( current_node.type == NONARITHMETIC && target_node.type == NONARITHMETIC ) ){

    return 0;
  }

  else if(current_node.type == NONARITHMETIC && target_node.type == ARITHMETIC){

    __insert_NA2A(current_node, target_node);

    return 1;
  }

  else if(current_node.type == NOTDEFINED && target_node.type == NONARITHMETIC){

    __insert_ND2NA(current_node, target_node);

    return 1;
  }

  return 0;
}

//DEAD FUNCTION
function __insert_NA2A(source_node, target_node)
{
  var parent_node = source_node.parent_node;

  for(var i = 0; i < parent_node.nodelist.length; i++){
    if(parent_node.nodelist[i].id == source_node.id){
      parent_node.nodelist[i] = target_node;
      target_node.parent_node = parent_node;
      source_node.parent_node = target_node;
      push_to_nodelist(target_node, source_node);
      push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "Drag Here!", target_node));

      break;
    }
  }
}

function __insert_ND2NA(source_node, target_node)
{
  source_node.type = NONARITHMETIC;
  source_node.value = target_node.value;
  source_node.nodelist = target_node.nodelist;
  target_node.parent_node = source_node;
}

function __insert_ANY2UN(source_node, target_node)
{
  var parent_node = source_node.parent_node;

  for(var i = 0; i < parent_node.nodelist.length; i++){
    if(parent_node.nodelist[i].id == source_node.id){
      parent_node.nodelist[i] = target_node;
      target_node.parent_node = parent_node;
      source_node.parent_node = target_node;
      push_to_nodelist(target_node, source_node);
      push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "Drag Here!", target_node));

      break;
    }
  }
}

function search_common_parent(start_node, end_node)
{
  var start_parent_array = new Array();

  for(var elem = start_node; elem.id != 0; elem = elem.parent_node)
  {
    start_parent_array.push(elem.id);
  }

  console.log("STARTNODE: ", start_node);
  console.log("SPA: ", start_parent_array);
  console.log("END: ", end_node);

  for(var elem = end_node; elem.id != 0; elem = elem.parent_node)
  {
    console.log("TAR: ", elem.id);
    if(start_parent_array.includes(elem.id))
      return elem;
  }
}



function push_to_nodelist(current_node, child_node)
{
  current_node.nodelist.push(child_node);
}

function get_root_node()
{
  return root_node;
}

function get_total_expr()
{
  console.log(calculate_tree_toString(root_node));

  Req_send(calculate_tree_toString(root_node));

  return calculate_tree_toString(root_node);
}



function calculate_tree_toString(node)
{
	var math_expr = "";

  switch(node.type){
      case ROOTNODE:
        return calculate_tree_toString(node.nodelist[0]);
        break;

      case ARITHMETIC:
        math_expr =
        calculate_tree_toString(node.nodelist[0]) + " " +
        node.value + " " +
        calculate_tree_toString(node.nodelist[1]);
        break;

      case NONARITHMETIC:
        if(node.value == "sigma" || node.value == "integral"){
          math_expr =
          node.value + " " +
          calculate_tree_toString(node.nodelist[2]) + " " +
          "from " + calculate_tree_toString(node.nodelist[0]) + " " +
          "to " + calculate_tree_toString(node.nodelist[1]);
        }
        else{
          math_expr = node.value;
        }

        break;

      case UPPERNODE:
        math_expr = node.value + "("+ calculate_tree_toString(node.nodelist[0])+ "," +calculate_tree_toString(node.nodelist[1]) + ")";
        break;

      case NOTDEFINED:
        math_expr = "ND";
        break;

        default:
        console.log("Error Detected : ", node);
          break;
  }

  return "(" + math_expr + ")";
}


/*
지옥의무간도 절대안쓸거
*/
//CAUTION!!! Construct 2!!!! node.
function insert_operation(type, target_node, index)
{
  var current_node = target_node;
  var parent_node = current_node.parent_node;
  var insert_node = new calculate_tree(index, type, parent_node);
  push_to_nodelist(insert_node, current_node);
  push_to_nodelist(insert_node, new calculate_tree(index+1, "ND", insert_node));
  current_node.parent_node = insert_node;

  for(var i = 0; i < parent_node.nodelist.length; i++)
  {
    if(parent_node.nodelist[i].index == current_node.index)
      parent_node.nodelist[i] = insert_node;
  }
}

function tree_search(node, index)
{
  if(node.index == index)
    return node;

  for(var i = 0; i < node.nodelist.length; i++)
  {
    if(tree_search(node.nodelist[i], index) != null)
      return tree_search(node.nodelist[i], index);
  }
  return null;
}
