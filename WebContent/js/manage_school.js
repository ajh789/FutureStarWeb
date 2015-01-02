function on_button_create()
{
  document.getElementById("span_content").innerHTML = "<b>新建学校</b><br/>" +
    "<form action='do_create_school' method='post'>" + 
    "学校名称：<input type='text' name='school_name'>" +
    "<input type='submit' value='创建'>" +
    "</form>";
}

function on_button_search()
{
  document.getElementById("span_content").innerHTML="<b>My First JavaScript Function</b>";
}