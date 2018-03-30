if(document.URL.indexOf("videolezioni") != -1){
		var completed = 0;
		var errors = 0;
		
		var lessons = (document.URL.indexOf("elearning") != -1) 
									? document.getElementsByClassName("lezioni")[1].querySelectorAll("a")
									: document.getElementsByClassName("h5") ;
									
		var div = document.createElement("div");
		div.setAttribute("style","width:100%");
		
		var button = document.createElement("h2");
		button.setAttribute("style","display: inline-block; margin-right:5px");
		button.innerHTML = "Scarica Tutte";
		button.id = "ScaricaTutto";

		var percent = document.createElement("h2");
		percent.setAttribute("style","display: none");
		
		var bar = document.createElement("div");
		bar.setAttribute("style", "display:none");
		
		var innerBar = document.createElement("div");
		innerBar.setAttribute("style", "height:100%; width:0%; background: #337ab7");
		bar.appendChild(innerBar);
		
		var errTitle = document.createElement("span");
		errTitle.setAttribute("style", "color:red");
		
		var errList = document.createElement("div");
		
		div.appendChild(button);
		div.appendChild(percent);
		div.appendChild(bar);
		div.appendChild(errTitle);
		div.appendChild(errList);
		
		document.getElementById("lessonList").insertBefore(div,document.getElementById("lessonList").childNodes[0]);

		chrome.runtime.onMessage.addListener(function(arg){
			if(arg.sender == "slave"){
				if(typeof arg.content.state !== 'undefined')
					if(arg.content.state.current == "complete"){
						completed++;
						percent.innerHTML = "("+(completed)+"/"+lessons.length+")";
						innerBar.setAttribute("style", "height:100%; width:"+(((completed)*100)/lessons.length)+"%; background: #337ab7");
						
					} else if(arg.content.state.current == "interrupted"){
						
						errTitle.innerHTML = ++errors + " Lezion"+((errors == 1)?"e":"i")+ " non scaricat"+((errors == 1)?"a":"e");
						errList.innerHTML=errList.innerHTML+
							'<li class="h6">'+
								'<a style="color:red;" href = "'	+	arg.lesson.url	+	'">'+
									'Lezione '	+	arg.lesson.filename.split("/")[1].split(".")[0].split("_")[ arg.lesson.filename.split("/")[1].split(".")[0].split("_").length - 1 ]+
								'</a>'+
							'</li>';
					}
			}
			console.log(arg);
		});

		document.getElementById("ScaricaTutto").addEventListener('click', tmpFunction = function(){ 
			
			document.getElementById("ScaricaTutto").removeEventListener("click", tmpFunction);
			frame1 = document.createElement("iframe");
		
			bar.setAttribute("style","display:inline-block; height:20px; width:100%; overflow:hidden; border: 1px solid #e3e3e3;border-radius: 4px;background: #FAFAFA; ");
			button.innerHTML = "Completati";
			percent.innerHTML = "(0/"+lessons.length+")";
			percent.setAttribute("style","display:inline-block;");
			
			var index = 0;
			frame1.id = "myframe";
			frame1.setAttribute("style","display:none");
			document.body.appendChild(frame1);
			
			frame1.addEventListener('load',function(){
				var filename = frame1.contentDocument.getElementById("aflowplayer").getAttribute("href").split("/")[frame1.contentDocument.getElementById("aflowplayer").getAttribute("href").split("/").length - 1];
				chrome.runtime.sendMessage({sender: "main", content:{
					url: frame1.contentDocument.getElementById("aflowplayer").getAttribute("href"),
					filename: filename.split("_lez_")[0]+"/"+filename,
					conflictAction: "prompt",
					saveAs: false
					}
				});
				
					
					if( index < lessons.length){
					index++;
					frame1.src = (document.URL.indexOf("elearning") != -1)
												? lessons[index].getAttribute("href")
												: lessons[index].firstElementChild.getAttribute("href");
					}
			});
			frame1.src = (document.URL.indexOf("elearning") != -1)
												? lessons[index].getAttribute("href")
												: lessons[index].firstElementChild.getAttribute("href");
		});
}
