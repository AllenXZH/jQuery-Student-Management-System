var records;
$(document).ready(function() {
  records = $("#table").load(student.json);
});

$("#dropdown").change(function(){
  if ($("#dropdown").val() === 'ten') {
    printTable(10);
    alert("10");
  }
  if ($("#dropdown").val() === 'twenty') {
    printTable(20);
    alert("20");
  }
  if ($("#dropdown").val() === 'fifty') {
    printTable(50);
    alert("50");
  }
  if ($("#dropdown").val() === 'hundred') {
    printTable(100);
    alert("100");
  }
});

function printTable(num) {
  $("#table").text(num);
}