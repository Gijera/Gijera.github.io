var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aguest', 'September', 'Octorber', 'November', 'December'];
var weekArray = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
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
    for(var i = 0; i < getMonthDay(showDate.getMonth(), showDate.getFullYear()); i++){
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
    for(var i = 0; i < weekArray.length; i++){
        tableHeaderHtml += "<th>"+weekArray[i]+"</th>";
    }
    tableHeaderHtml += "</tr>";
    timeBodyHtml += tableHeaderHtml;

    var tableBodyHtml = '';
    for(var i = 0; i < calendarArray.length; i++){
        if(i != 0 && calendarArray[i][0] === 0)
            break;
        tableBodyHtml += "<tr>";
        for(var j = 0; j < calendarArray[i].length; j++){
            tableBodyHtml += "<td>";
            if(calendarArray[i][j] !== 0){
                var indexOne = showDate.getFullYear() + '-' + ('0'+(showDate.getMonth()+1)).slice(-2);
                var indexTwo = ('0'+calendarArray[i][j]).slice(-2);
                if(calendarDateUrlArray.hasOwnProperty(indexOne) && calendarDateUrlArray[indexOne].hasOwnProperty(indexTwo)){
                    tableBodyHtml += ("<a href='"+calendarDateUrlArray[indexOne][indexTwo]+"'>");
                    tableBodyHtml += calendarArray[i][j];
                    tableBodyHtml += "</a>";
                }else{
            	   tableBodyHtml += calendarArray[i][j];
                }
           	}
            tableBodyHtml += "</td>";
        }
        tableBodyHtml += "</tr>";
    }
    timeBodyHtml += tableBodyHtml;
    //显示日历体部
    timeBody.innerHTML = timeBodyHtml;

    //添加月历链接
    var calendarLeft = document.getElementById('calendar-left');
    var calendarRight = document.getElementById('calendar-right');
    var leftLink = '';
    var rightLink = '';
    var currentDateString = showDate.getFullYear() + '-' + ('0'+(showDate.getMonth()+1)).slice(-2);
    for(var i = 0; i < calendarDateArray.length; i++){        
        if(currentDateString == calendarDateArray[i]){
            if(i != 0){
                rightLink = '/calendar/'+calendarDateArray[i-1];
            }
            if( i != calendarDateArray.length - 1){
                leftLink = '/calendar/'+calendarDateArray[i+1];
            }
            break;
        }
    }
    calendarLeft.setAttribute('href', leftLink);
    calendarRight.setAttribute('href', rightLink);
}