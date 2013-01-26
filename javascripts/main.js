$(document).ready(function() {
	
	if (window.innerWidth <= 320) {
		setupMobile();
	} else {
		setupDesktop();
	}

});

function setupDesktop() {
	function layoutActive(element) {
		transform(element, "translate(0px, -550px)");
	}
	
	function layoutDock(element) {
		var rotation = 0;
		switch (element.attr("id")) {
			case "about":
				rotation = 15;
				break;
			case "contact":
				rotation = -15;
				break;
		}
		transform(element, "rotate(" + rotation + "deg)");
	}
	
	function ensureOnlyActive(element) {
		$(".card").each(function(i) {
			var card = $(this);
			if (card != element) {
				layoutDock(card);
				card.removeClass("active");
			}
		});
	}
	
	var prefixes = ["webkit","moz","ms","o"];
	
	function transform(element, transformation) {
		for (var i = 0; i < prefixes.length; i++) {
			var prefix = prefixes[i];
			element.css("-" + prefix + "-transform", transformation);
		}
	}
	
	$("#logo").click(function() {
			$(".card").each(function(i) {
				var card = $(this);
				layoutDock(card);
				card.removeClass("active");
			});
	});
	
	$("#menu a").each(function(i) {
		$(this).click(function() {
			var card = null;
			switch (i) {
				case 0:
					card = $("#about");
					break;
				case 1:
					card = $("#projects");
					break;
				case 2:
					card = $("#contact");
					break;
			}
			if (card != null) {
				ensureOnlyActive(card);
				card.toggleClass("active");
				if (card.hasClass("active")) {
					layoutActive(card);
				} else {
					layoutDock(card);
				}
				
			}
		});
	});
		
	$(".card").each(function(i) {
		var card = $(this);
		card.click(function() {
			ensureOnlyActive(card);
			card.toggleClass("active");
			if (card.hasClass("active")) {
				layoutActive(card);
			} else {
				layoutDock(card);
			}
		});
	});
	
	layoutActive($("#about"));
}

function setupMobile() {
	
	var swipeOptions = {
		triggerOnTouchEnd : true,	
		swipeStatus : swipeStatus,
		allowPageScroll: "vertical",
		threshold: 160
	}
	
	var currentPage = 0;
	var pages = $("#main");
	var PAGE_WIDTH = 320;
	var speed = 400;
	
	pages.css("-webkit-transform", "translate(0px,0px)");
	
	pages.swipe(swipeOptions);
	
	// hide the addressbar
	window.scrollTo(0, 1);
	
	function swipeStatus(event, phase, direction, distance) {
		if( phase=="move" && (direction=="left" || direction=="right") ) {
			var duration=0;
			
			if (direction == "left") {
				scrollPages((PAGE_WIDTH * currentPage) + distance, duration);
			} else if (direction == "right") {
				scrollPages((PAGE_WIDTH * currentPage) - distance, duration);
			} 
			
		} else if ( phase == "cancel") {
			scrollPages(PAGE_WIDTH * currentPage, speed);
		} else if ( phase =="end" ) {
			if (direction == "right") {
				previousPage();
			} else if (direction == "left") {
				nextPage()
			}
		}
	}
	
	function scrollPages(distance, duration) {
		pages.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
		pages.css("-webkit-transform", "translate("+value +"px,0px)");
	}
	
	function nextPage() {
		currentPage = Math.min(currentPage+1, 2);
		scrollPages(PAGE_WIDTH * currentPage, 400);
	}
	
	function previousPage() {
		currentPage = Math.max(currentPage-1, 0);
		scrollPages(PAGE_WIDTH * currentPage, 400);
	}
}