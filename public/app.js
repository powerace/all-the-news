$('#scrape').on("click", function(){
	$.post("/scrape").done(function(){
		$('#tModal').modal();
		// $.get("/articles", function(data){
		// 	// loadArticlesOnPage(data);
		// 	console.log("loading article data");
		// });
	});
});

// function loadArticlesOnPage(data){

// 	  for (var i = 0; i < data.length; i++) {
// 	    // Display the appropiate information on the page

//     	var articleDiv = "<div class=\"col-sm-3\">";
//     	articleDiv += "<a href=\"" + data[i].link + "\">";
//     	articleDiv += "<img src=\"" + data[i].image + "\"/>";
//     	articleDiv += "<p class=\"category\">" + data[i].category + "</p>";
//     	articleDiv += "<p class=\"title\">" + data[i].title + "</p>";
//     	articleDiv += "</a></div>";

// 	    $(".articles").append(articleDiv);

// 	    console.log("test");
// 	  }

// }
