var root_node;


var identifier = 0;

/*TYPEDEF*/
const ARITHMETIC      =   1001;
const NONARITHMETIC   =   1002;
const ONLYDRAWABLE    =   1003;
const NOTDEFINED      =   1004;
const ROOTNODE        =   1005;

function init_tree()
{
  root_node = new calculate_tree_root();
  push_to_nodelist(root_node, new calculate_tree(NOTDEFINED, "NOT DEFINED", root_node));

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

  //sigma / integral 전처리
  if(type == NONARITHMETIC && ( value == "sigma" || value == "integral")){
    push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "NOT DEFINED", target_node));
    push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "NOT DEFINED", target_node));
    push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "NOT DEFINED", target_node));
    insert_node(current_node, target_node);
  }
  //복합사칙연산
  else if(type == NONARITHMETIC){
    for(var i = 0; i < _value.length; i++){
      if(_value[i] == "+" || _value[i] == "-" || _value[i] == "*" || _value[i] == "/"){
        insert(nodeptr, new calculate_tree(ARITHMETIC, _value[i], nodeptr.parent_node));
        nodeptr = nodeptr.nodelist[1];
      }
      else{
        insert(nodeptr, new calculate_tree(NONARITHMETIC, _value[i], nodeptr.parent_node));
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
  if(current_node.type == ARITHMETIC
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
}

function calculate_tree_toString(node)
{
  var math_expr = "";

  //console.log(node.type);

  if(node.type == "ND" && node.nodelist.length == 0)
    return "ND";

  if(node.type == "root" || node.type == "ND")
  {
    return calculate_tree_toString(node.nodelist[0]);
  }

  //X, x, 1, 234 ... plain text.
  // if(node.type == "plain_text")
  //  math_expr = node.nodelist[0];

  //regex => type list[0] from list[1] to list[2]
  //Typelist : Sigma, Integral, Lim
  else if(node.type == "Sigma" || node.type == "Integral")
  {
    math_expr = "("
    + node.type + " "
    + calculate_tree_toString(node.nodelist[0])
    + " from "
    + calculate_tree_toString(node.nodelist[1])
    + " to "
    + calculate_tree_toString(node.nodelist[2])
    + ")"
  }

  //regx => list[0] type list[1]
  //Typelist : Plus, Minus, Multiply, Divide, Equal
  else if(node.type == "Arithmetic")
  {
    for(var i = 0; i < node.nodelist.length; i++)
    {
      math_expr += node.nodelist[i].value;
    }
  }

  else if(node.type == "plain_text")
  {
    math_expr = node.value;
  }

  else
  {
    math_expr = node.type;
  }
  return math_expr;
}

//DEAD FUNCTION
function __insert_NA2A(source_node, target_node)
{
  var parent_node = source_node.parent_node;

  for(var i = 0; i < parent_node.nodelist.size(); i++){
    if(parent_node.nodelist[i].id == source_node.id){
      parent_node.nodelist[i] = target_node;
      target_node.parent_node = parent_node;
      source_node.parent_node = target_node;
      push_to_nodelist(target_node, source_node);
      push_to_nodelist(target_node, new calculate_tree(NOTDEFINED, "NOT DEFINED", target_node));

      break;
    }
  }
}

function __insert_ND2NA(source_node, target_node)
{
  source_node.type = NONARITHMETIC;
  source_node.value = target_node.value;
  source_node.nodelist = target_node.nodelist;
}

function search_common_parent(start_node, end_node)
{
  var start_parent_array = new Array();

  for(var elem = start_node; elem.parent_node != null; elem = elem.parent_node)
  {
    start_parent_array.push(elem.id);
  }

  for(var elem = end_node; elem.parent_node != null; elem = elem.parent_node)
  {
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

      case ONLYDRAWABLE:
        math_expr = node.value + "("+ calculate_tree_toString(node.nodelist[0]) +")";
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
