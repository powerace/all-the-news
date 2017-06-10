$('#scrape').on("click", function(){
	$.post("/scrape").done(function(){
		$('#tModal').modal();
	});
});

$('.save').on("click", function(e){
	e.preventDefault();
	console.log("save clicked");
	$.post("/saved-articles",{
        category: $(this).parent().find('.category').text(),
        title: $(this).parent().find(".title").text(),
        link: $(this).parent().attr("href"),
        image: $(this).parent().find("img").attr("src")
    },
    function(data, status){
        console.log(data);
  });
});