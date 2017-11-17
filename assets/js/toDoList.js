var doingItem = document.getElementById('doing-item');
var doneItem = document.getElementById('done-item');

var doing = document.getElementById('doing');
doing.onclick = function(){
	doingItem.style.display = 'block';
	doneItem.style.display = 'none';
}

var done = document.getElementById('done');
done.onclick = function(){
	doneItem.style.display = 'block';
	doingItem.style.display = 'none';
}