
//scrape articles when nav button clicked
$('#scrape').on("click", function(){
	$.post("/scrape").done(function(data){
		$('#tModal').modal();
	});
});

//refresh page after modal closed
$('.close').on("click", function(){
	window.location.href = "/";
});

//save article event handler
$('.save').on("click", function(e){
	e.preventDefault();
	$.post("/saved-articles",{
        category: $(this).parent().find('.category').text(),
        title: $(this).parent().find(".title").text(),
        link: $(this).parent().attr("href"),
        image: $(this).parent().find("img").attr("src")
    },
    function(data, status){
  });
});

//add note event handler
$('.add-note').on("click", function(){
	var index = $(this).attr("id").split('-')[1];
	$('#tModal-' + index).modal();
});

//delete note event handler
$('.delete-note').on("click", function(){
	 var btn = $(this);
	$.get("/delete/note/" + btn.attr("data-id"),function(){
		btn.parent().remove();
	});
});

//delete article event handler
$('.delete-article').on("click", function(){
	var btn = $(this);
	$.get("/saved-articles/delete/" + btn.attr("data-id"),function(){
		btn.parents('.col-sm-3').remove();
	});
});

