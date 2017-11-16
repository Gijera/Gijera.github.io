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
var todayYear = date.getFullYear();
var todayMonth = date.getMonth();
var todayDate = date.getDate();
showCalendar(date);

//左键点击
var timeLeft = document.getElementById('time-left');
timeLeft.onclick=function(){
    date.setMonth(date.getMonth()-1);
    showCalendar(date);
}
//右键点击
var timeRight = document.getElementById('time-right');
timeRight.onclick=function(){
    date.setMonth(date.getMonth()+1);
    showCalendar(date);
}

function showCalendar(showDate){
    //获取对象
    var timeHeader = document.getElementById('time-header');
    var timeBody = document.getElementById('time-body');
    //定义日历数组
    var calendarArray = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];
    //显示日历头部
    timeHeader.innerHTML = monthArray[showDate.getMonth()] + ' ' + showDate.getFullYear();
    //得到日历数组
    showDate.setDate(1);
    var cycleFlag = 0;
    var weekFlag = showDate.getDay();
    for(i = 0; i < getMonthDay(showDate.getMonth(), showDate.getFullYear()); i++){
        calendarArray[cycleFlag][weekFlag++] = i+1;
        if(weekFlag > 6){
            weekFlag = 0;
            cycleFlag++;
        }
        if(cycleFlag > 5){
            cycleFlag = 0;
        }
    }
    //获得日历体部
    var timeBodyHtml = '';
    var tableHeaderHtml = "<tr>";
    for(i = 0; i < weekArray.length; i++){
        tableHeaderHtml += "<th>"+weekArray[i]+"</th>";
    }
    tableHeaderHtml += "</tr>";
    timeBodyHtml += tableHeaderHtml;

    var tableBodyHtml = '';
    for(i = 0; i < calendarArray.length; i++){
        if(i != 0 && calendarArray[i][0] === 0)
            break;
        tableBodyHtml += "<tr>";
        for(j = 0; j < calendarArray[i].length; j++){
            tableBodyHtml += "<td ";
            if(calendarArray[i][j] !== 0){
                tableBodyHtml += "class='time-element";
                if((showDate.getFullYear() === todayYear) && (showDate.getMonth() === todayMonth) && (calendarArray[i][j] === todayDate)){
                    tableBodyHtml += " time-today";
                }
                tableBodyHtml += "'>";
                tableBodyHtml += calendarArray[i][j];
            }else
                tableBodyHtml += ">";
            tableBodyHtml += "</td>";
        }
        tableBodyHtml += "</tr>";
    }
    timeBodyHtml += tableBodyHtml;
    //显示日历体部
    timeBody.innerHTML = timeBodyHtml;
}