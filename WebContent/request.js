$(window).ready(function() {
  localStorage.clear();
  $.getJSON("students.json", function(result) {
     var records = result.students;
    for (var i = 0; i < records.length; i++) {
      localStorage.setItem(i, JSON.stringify(records[i]));
    }
    
    printTable(10);
  });
});

function empty() {
  $("input").val("");
}

function addNew() {
  var hasEmpty = false;
  //detect empty blanks
  $("input.addForm").each(function(){
    if ($(this).val().length === 0) {
      hasEmpty = true;
    }
  });
  if (hasEmpty) {
    alert("Please fill out all fields");
  } else {
    //add new record to localStorage
    var location = $("#location").val().split(",");
    var newStudent = JSON.parse(
      '{ '+
      '"firstname":"' + $("#firstname").val() + '", ' +
      '"lastname": "' + $("#lastname").val() + '", ' +
      '"email": "' + $("#email").val() + '", ' +
      '"location": "' + location + '", ' +
      '"phone": "' + $("#phone").val() + '", ' +
      '"batch": "' + $("#batch").val() + '", ' +
      '"address":  {' + 
        '"communication": "' + $("#communication").val() + '",' +
        '"permanent": "' + $("#permanent").val() + '"' +
      '}, ' +
      '"previous_employer": {} '+
      ' }'
    );
    var index;
    for (var i = 0; i < localStorage.length; i++) {
      index = localStorage.key(i);
    }
    index += '1';
    localStorage.setItem(index, JSON.stringify(newStudent));
    alert("New student record added");
    empty();
  }
}

function countRecords() {
  alert(localStorage.length + ' records in total');
}

function spawn() {
  var student = localStorage.getItem(0);
  var index = localStorage.length;
  for (var i = 0; i < 100; i++) {
    localStorage.setItem(index + i, student);
  }
  alert("100 records added");
}


//Search
function search() {
  if ($("#searchContent").val().length === 0) {
    alert("Fill search keyword");
    return;
  } 
  var searchBy = $("#searchBy").val();
  var studentAttr;
  var student;
  var resultList = [];
  for (var i = 0; i < localStorage.length; i++) {
    student = JSON.parse(localStorage.getItem(i));
    if (searchBy == "firstname") {
      studentAttr = student.firstname;
    } else if (searchBy == "lastname") {
      studentAttr = student.lastname;
    } else if (searchBy == "email") {
      studentAttr = student.email;
    } else if (searchBy == "phone") {
      studentAttr = student.phone;
    } else if (searchBy == "location") {
      for (var l = 0; l < student.location.length; l++) {
        studentAttr = student.location[l].toLowerCase();
        if (studentAttr == $("#searchContent").val().toLowerCase()) {
          //add to resultList
          resultList.push(JSON.stringify(student));
        }
      }
    }
    if (studentAttr == $("#searchContent").val()) {
      //add to resultList
      resultList.push(JSON.stringify(student));
    }
  }
  if (resultList.length === 0) {
    alert("No Student Match");
  } else {
    printTh();
    printTr(resultList);
    $("#scrollHint").text("No more records");
    $(window).unbind("scroll");
  }
}
function printTh() {
  $("#table").html(
    '<tr><th></th><th>firstname</th><th>lastname</th><th>email</th>' + 
    "<th>location</th><th>phone</th><th>batch</th>" +
    "<th>communication</th><th>permanent</th>" + 
    '<th>previous_employer</th><th width="80px"></th></tr>'
    );
}
function printTr(resultList) {
  var record;
  for (i = 0; i < resultList.length; i++) {
    record = JSON.parse(resultList[i]);
    var list = JSON.stringify(record.previous_employer).split(",");
    var previous_employer = '<pre style="font-family:Times New Roman">';
    for (var id in list) {
      var reg = new RegExp('["{}]',"g");
      previous_employer += list[id].replace(reg,' ')+'<br>';
    }
    previous_employer += '</pre>';
    $("#table").append(
    "<tr>" + 
      '<td>' + (i+1) + "</td>" + 
      "<td>" + record.firstname + "</td>" + 
      "<td>" + record.lastname + "</td>" + 
      '<td class="editable">' + record.email + "</td>" + 
      '<td class="editable">' + record.location + "</td>" + 
      '<td class="editable">' + record.phone + "</td>" + 
      '<td class="editable">' + record.batch + "</td>" + 
      '<td class="editable">' + record.address.communication + "</td>" + 
      '<td class="editable">' + record.address.permanent + "</td>" + 
      '<td class="moredetails">show details' +
      '<div hidden>' + previous_employer + '</div>' +
      '</td>' + 
      '<td><button style="width:80px" class="delete">delete</button><br>' +
      '<button style="width:80px" class="edit">edit</button></td>' + 
    "</tr>"
    );
  }
  $("tr:odd").attr("style", "background-color:rgba(119,136,153,0.3)");
  actMoredetails();
  actDelete();
  actEdit();
  
}

//Selector
$("#dropdown").change(function(){
  var num = $("#dropdown").val();
  alert();
  printTable(parseInt(num));
});
function submitRequest() {
  var num = $("#dropdown").val();
  printTable(parseInt(num));
}
//print table
var printNum = 0;
function printTable(num) {
  printNum = num;
  printTh(); //print <th>
  var key;
  var record = [];
  for (i = 0; i < num && i < localStorage.length; i++) {
    key = localStorage.key(i);
    
    record.push(localStorage.getItem(key));
  }
  printTr(record);
  $(window).scroll(scroll);
}

function actMoredetails() {
  $("td.moredetails").one({
    click: function() {
      var str = $(this).parent().children().eq(9).children().first().html();
      $(this).html(str);
      $(this).css("color", "black");
      $(this).css("font-style", "normal");
    }
  });
}
function actDelete(){
  $("button.delete").one({
      click: function(){
        //delete record in localStorage
        var firstname = $(this).parent().parent().children().eq(1).text();
        var lastname = $(this).parent().parent().children().eq(2).text();
        var student;
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          student = JSON.parse(localStorage.getItem(key));
          if (student.firstname == firstname && student.lastname == lastname) {
            localStorage.removeItem(key);
            break;
          }
        }
        var str = '<p style="color:black;font-style:italic">deleted</p>';
        $(this).parent().parent().children().unbind("click");
        $(this).parent().parent().children().html(str);
      }
  });
}
function actEdit() {
  $("button.edit").one({
    click: function() {
      $(this).parent().parent().children().trigger('click');
      $(this).parent().parent().find('.editable').each(function(){
      var html = '<textarea >' + $(this).text() + '</textarea>';
      $(this).html(html);        
      });
      //add save function
      $(this).text('save');
      $(this).on({
        click: function() {
          var firstname = $(this).parent().parent().children().eq(1).text();
          var lastname = $(this).parent().parent().children().eq(2).text();
          var student;
          var key;
          for (var i = 0; i < localStorage.length; i++) {
            key = localStorage.key(i);
            student = JSON.parse(localStorage.getItem(key));
            if (student.firstname == firstname && student.lastname == lastname) {
              
              break;
            }
          }
          student.email = 
          $(this).parent().parent().find('.editable').eq(0).find('textarea').val();
          var val = $(this).parent().parent().find('.editable').eq(1).find('textarea').val();
          var location = val.split(',');
          student.location = location;
          student.phone = 
          $(this).parent().parent().find('.editable').eq(2).find('textarea').val();
          student.batch = 
          $(this).parent().parent().find('.editable').eq(3).find('textarea').val();
          student.address.communication = 
          $(this).parent().parent().find('.editable').eq(4).find('textarea').val();
          student.address.permanent = 
          $(this).parent().parent().find('.editable').eq(5).find('textarea').val();
          localStorage.setItem(key, JSON.stringify(student));
          alert("Changes Saved");
        }
      });
    }
  });
}

//scroll
function scroll() {
  if (printNum === 0) {
    $("#scrollHint").attr("hidden", true);
    return ;
  }
  $("#scrollHint").removeAttr("hidden");
  var totalHeight =  $(window).scrollTop() +  $(window).height();
  if($(document).height() <= totalHeight) { //    
    printTable((printNum + 10));
  }
  if (printNum >= localStorage.length) {
    $("#scrollHint").text("No more records");
    $(window).unbind("scroll");
  } else {
    $("#scrollHint").text("Scroll Down to Load More Records");
  }
}
