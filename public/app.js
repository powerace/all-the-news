// $(document).ready(function(){
// 	$.post("/scrape");
// 	console.log('scrape');
// });

$('#scrape').on("click", function(){
	$.post("/scrape").done(function(data){
		console.log(data);
		$('#tModal').modal();
		// $('#tModal').on('shown.bs.modal', function() {
		// 	$('.artNum').text(data.length);
		// });
	});
});

$('.close').on("click", function(){
	window.location.href = "/";
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

$('.add-note').on("click", function(){
	var index = $(this).attr("id").split('-')[1];
	$('#tModal-' + index).modal();
});

// $('.save-note').on("click", function(){
// 	var index = $(this).attr("id").split('-')[1];
// 	$.post("/saved-articles/note/" + index);
// });