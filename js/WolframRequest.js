function Req_send(query)
{
  console.log(query);

  var req = "http://api.wolframalpha.com/v2/query?input=" + query + "&appid=464R2R-2T6U338YAW&output=json";


  var xhr  = new XMLHttpRequest();

  var input;
  var inputsrc;
  var output;
  var outputsrc;

  xhr.open('GET', req, true);

  xhr.onload = function () {
	var ans = JSON.parse(xhr.responseText);
  console.log(ans);
  input = ans.queryresult.pods[0].subpods[0].plaintext;
  inputsrc = ans.queryresult.pods[0].subpods[0].img.src;
  output = ans.queryresult.pods[1].subpods[0].plaintext;
  outputsrc = ans.queryresult.pods[1].subpods[0].img.src;

  if(output == ""){
    var result = StringTokenizer4Result(input);
    Result_getter(result);
  }else{
      Result_getter(output);
  }

  /*
  FIX PARTS
  */
  //Send Result to DOM
  // document.getElementById("answerbutton").value = output;
  // document.getElementById("answer").src = outputsrc;
  //
  /*
  FIX PARTS END
  */
	if (xhr.readyState == 4 && xhr.status == "200") {
		console.table(ans);
	} else {
		console.error(ans);
	}
}
xhr.send(null);
}
