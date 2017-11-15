//定义数组和函数
var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aguest', 'September', 'Octorber', 'November', 'December'];
var weekArray = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
var monthDayArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeap(year){
	if(year % 400 === 0)
		return true;
	if(year % 100 === 0)
		return false;
	if(year % 4 === 0)
		return true;
	return false;
}
function getMonthDay(month, year){
	if(month !== 1){
		return monthDayArray[month];
	}
	if(isLeap(year))
		return 29;
	else
		return 28;
}

//定义变量
var date = new Date();
var yearFlag = date.getFullYear();
var monthFlag = date.getMonth();
var calendarFlag = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

//获取对象
var timeHeader = document.getElementById('time-header');
var timeBody = document.getElementById('time-body');

//显示日期
timeHeader.innerHTML = monthArray[monthFlag] + ' ' + yearFlag;
date.setDate(1);
var cycleFlag = 0;
var weekFlag = date.getDay();
for(i = 0; i < getMonthDay(monthFlag, yearFlag); i++){
    calendarFlag[cycleFlag][weekFlag++] = i+1;
    if(weekFlag > 6){
        weekFlag = 0;
        cycleFlag++;
    }
}

//表格插入
var timeBodyHtml = '';
var tableHeaderHtml = "<tr>";
for(i = 0; i < weekArray.length; i++){
    tableHeaderHtml += "<th>"+weekArray[i]+"</th>";
}
tableHeaderHtml += "</tr>";
timeBodyHtml += tableHeaderHtml;

var tableBodyHtml = '';
for(i = 0; i < calendarFlag.length; i++){
    tableBodyHtml += "<tr>";
    for(j = 0; j < calendarFlag[i].length; j++){
        tableBodyHtml += "<td>";
        tableBodyHtml += calendarFlag[i][j];
        tableBodyHtml += "</td>";
    }
    tableBodyHtml += "</tr>";
}
timeBodyHtml += tableBodyHtml;
timeBody.innerHTML = timeBodyHtml;