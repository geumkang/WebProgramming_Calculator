var root_node;

//Typelist : Sigma, Integral, Plus, Minus ... etc
//Integral : integrate sin x dx from x=0 to pi
//Sigma : sigma k^2 from k=1 to 10
//plain numeric : 1, 2, 3 ... etc(plain_text)
//ND = Not defined
function init_tree()
{
  root_node = new calculate_tree_root("root", null);
  push_to_nodelist(root_node, new calculate_tree(0, "ND", root_node));
  console.log("fine");
}

//1. Make Sections
//2. Make calculate_tree with type and parent_node
//3. Add child node with calculate_tree_i.nodelist.push();
//4. Repeat 3 until all child node is added.
function calculate_tree_root(type, parent_node)
{
    this.index = -1;
    this.parent_node = parent_node;
    this.type = type;
    this.nodelist = new Array();
    this.value = 0;
    if(type == "plain_text")
      this.nodelist.push(type);
}

function calculate_tree(index, type, parent_node)
{
    this.index = index;
    this.parent_node = parent_node;
    this.type = type;
    this.nodelist = new Array();
}

//DEAD FUNCTION
function node_replace(source_node, target_node)
{
  var temp_index = source_node.index;
  var temp_parent = source_node.parent_node;

  for(var i = 0; i < temp_parent.nodelist.length; i++)
  {
    if(temp_parent.nodelist[i].index == target_node.index)
      temp_parent.nodelist[i] = target_node;
  }

  target_node.parent_node = temp_parent;
  target_node.index = temp_index;
}

function search_common_parent(start_node_index, end_node_index)
{
  var start_parent_array = new Array();
  var start_node = tree_search(root_node, start_node_index);
  var end_node = tree_search(root_node, end_node_index);

  for(var elem = start_node; elem.parent_node != null; elem = elem.parent_node)
  {
    start_parent_array.push(elem.index);
  }

  for(var elem = end_node; elem.parent_node != null; elem = elem.parent_node)
  {
    if(start_parent_array.includes(elem.index))
      return tree_search(root_node, elem.index);
  }
}

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
    console.log(node.nodelist[0].index);
    if(tree_search(node.nodelist[i], index) != null)
      return tree_search(node.nodelist[i], index);
  }
  return null;
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

  //console.log(node.type);

  if(node.type == "ND" && node.nodelist.length == 0)
    return "ND";

  if(node.type == "root" || node.type == "ND")
    return calculate_tree_toString(node.nodelist[0]);

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
  else if(node.type == "Plus" || node.type == "Minus" || node.type == "Multiply" || node.type == "Divide" || node.type == "Equal")
  {
    math_expr = "( "
    + calculate_tree_toString(node.nodelist[0])
    +" "+node.type+" "
    + calculate_tree_toString(node.nodelist[1])
    + " )"
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