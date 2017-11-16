var githubIcon = document.getElementById('github-icon');
githubIcon.onmouseover = function(){
	if(githubIcon.getAttribute('src') !== '/assets/image/common/github-click.png')
		githubIcon.setAttribute('src', '/assets/image/common/github-click.png');
}
githubIcon.onmouseout = function(){
	if(githubIcon.getAttribute('src') !== '/assets/image/common/github.png')
		githubIcon.setAttribute('src', '/assets/image/common/github.png');	
}

var gmailIcon = document.getElementById('gmail-icon');
gmailIcon.onmouseover = function(){
	if(gmailIcon.getAttribute('src') !== '/assets/image/common/gmail-click.png')
		gmailIcon.setAttribute('src', '/assets/image/common/gmail-click.png');
}
gmailIcon.onmouseout = function(){
	if(gmailIcon.getAttribute('src') !== '/assets/image/common/gmail.png')
		gmailIcon.setAttribute('src', '/assets/image/common/gmail.png');	
}

var rssIcon = document.getElementById('rss-icon');
rssIcon.onmouseover = function(){
	if(rssIcon.getAttribute('src') !== '/assets/image/common/rss-click.png')
		rssIcon.setAttribute('src', '/assets/image/common/rss-click.png');
}
rssIcon.onmouseout = function(){
	if(rssIcon.getAttribute('src') !== '/assets/image/common/rss.png')
		rssIcon.setAttribute('src', '/assets/image/common/rss.png');	
}