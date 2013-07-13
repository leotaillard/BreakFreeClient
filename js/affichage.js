/*
Auteur: Léo Taillard
Project: BreakFree
Usage: Paléo festival stand COMEM
*/
var mySwiper;
var partieId;

$(document).ready(function() {



//slide de tie - le nombre ajouté en plus est le nombre de slide en plus des questions
var tie = nbrFacile + nbrMoyen + nbrDiff + 8;

$(function(){
	mySwiper = $('.swiper-container').swiper({
		//Your options here:
		mode:'horizontal',
		simulateTouch:false,
		onSlideChangeStart : function (e) {
			var index = mySwiper.activeIndex;
//			$("input").hide();
//			$(".swiper-slide:nth-child("+(index+1)+") input").show();
		}
		
		//etc..
	});
	$('input').hide();
	
$(document).keydown(function(e){
    if (e.keyCode == 37) {
   		var index = mySwiper.activeIndex;
		// permet de defocus les inputs quand on change de slide
		$("input").blur();

		e.preventDefault()
		mySwiper.swipePrev()
       return false;
    }
    if (e.keyCode == 39) {
   		var index = mySwiper.activeIndex;
  		var partieId = $("#partie").attr('data-id');
  		// permet de defocus les inputs quand on change de slide
		$("input").blur();
		
		e.preventDefault();
		mySwiper.swipeNext();
		//LANCE LA VIDEO S'IL Y EN A UNE
		if ($(".swiper-slide:nth-child("+(index+2)+") .video-container video").length) {
			$(".swiper-slide:nth-child("+(index+2)+") .video-container video").get(0).play();
		}
		
		getPlayer(partieId);
		if (index == 2) {
			sendName();
		}
		else if (index == tie || index == (tie+1)) {
			sendEmailFromWinner();
		}
		return false;
    }
    // permet d'ajouter une class a la réponse juste en pressant la barre d'espace et ainsi de montrer la bonne réponse
    if (e.which == 83 && $("input:focus").length == 0) {
        e.stopPropagation(); e.preventDefault();
		var index = mySwiper.activeIndex;
		
    	$(".swiper-slide:nth-child("+(index+1)+") ul").find("li[data-justesse=true]").toggleClass('view-juste');
    	$(".swiper-slide:nth-child("+(index+1)+")").find("#title-reponse-tie").toggle();
    	$(".swiper-slide:nth-child("+(index+1)+")").find("#title-question-tie").toggle();
    		
       return false;
    }
    // permet de seter le timer
	var index = mySwiper.activeIndex;

    if (e.which ==  65 && $("input:focus").length == 0) {

        e.stopPropagation(); e.preventDefault();
		var index = mySwiper.activeIndex;
    	$(".swiper-slide:nth-child("+(index+1)+")").find(".timer").animate({
    		width: '100%'
    	}, 10000);
    		
       return false;
    }
    if (e.which == 68 && $("input:focus").length == 0) {
        e.stopPropagation(); e.preventDefault();
		var partieId = $("#partie").attr('data-id');
		var index = mySwiper.activeIndex;
    	if (index == tie) {
    		getQuestionRandom(partieId);
    	}
       return false;
    }
    
    
});

$(document).on( 'click', '#endPartie', function () {
	endPartie();
} );



$(".logo a.letsgo").click(function() {
	
	var nbrPlayer = $(this).attr('data-nbrPlayer');
	var req = config.serverUrl + "partie?nbrPlayer="+nbrPlayer+"&nbrFacile="+nbrFacile+"&nbrMoyen="+nbrMoyen+"&nbrDiff="+nbrDiff;
	$.ajax({
		type:"POST",
		headers: { 
		    'Accept': 'application/json',
		    'Content-Type': 'application/json' 
		},
		url:req,
		data:'{}',
		dataType:'json',
	    crossDomain: true,
		success:function(data) {
			console.log(data);
			//initialise compteur
			var cpt = 1;
			
			
			$(".logo").css("display", "none");
			$("#partie").css('display', 'block');
			mySwiper.reInit();
			
			// introduit l'id de la partie dans le html
			var partieId= data.id;
			$("#partie").attr('data-id', partieId);
			
			//création du tableau pour les différentes parties
			var positionFacile = nbrFacile-1;
			var positionMoyen = nbrFacile + nbrMoyen-1;
			var positionDiff = nbrFacile + nbrMoyen + nbrDiff-1;
			
			var partie1 = new Array();
			var partie2 = new Array();
			var partie3 = new Array();
			
			for (x in config.ordre) {
				object = config.ordre[x];
				if (x == 1) {
					for (i = 0; i < object.length; i++) {
						if (object[i] == "f") {
							partie1.push(data.questions[positionFacile]);
							positionFacile--;
						} else if (object[i] == "m") {
							partie1.push(data.questions[positionMoyen]);
							positionMoyen--;
						} else if (object[i] == "d") {
							partie1.push(data.questions[positionDiff]);
							positionDiff--;
						} 
					}
				}
				if (x == 2) {
					for (i = 0; i < object.length; i++) {
						if (object[i] == "f") {
							partie2.push(data.questions[positionFacile]);
							positionFacile--;
						} else if (object[i] == "m") {
							partie2.push(data.questions[positionMoyen]);
							positionMoyen--;
						} else if (object[i] == "d") {
							partie2.push(data.questions[positionDiff]);
							positionDiff--;
						} 
					}
				}
				if (x == 3) {
					for (i = 0; i < object.length; i++) {
						if (object[i] == "f") {
							partie3.push(data.questions[positionFacile]);
							positionFacile--;
						} else if (object[i] == "m") {
							partie3.push(data.questions[positionMoyen]);
							positionMoyen--;
						} else if (object[i] == "d") {
							partie3.push(data.questions[positionDiff]);
							positionDiff--;
						} 
					}
				}
				
			}			
			
			//ajout slide player
			var slidePlayer = mySwiper.createSlide("<div class='swiper-slide'><section class='question'><h2>Noms des joueurs</h2></section><section class='players'><ul></ul><div class='clear'></div></section></div>");
			slidePlayer.insertAfter(1);
			//introduit l'id des joueurs dans le html et construit le html pour les noms des joueurs
			$(data.players).each(function(index, e) {
				$(".players ul").append("<li><img src='css/img/player.png'/><input value='joueur "+(index+1)+"' type='text' data-playerId='"+e.id+"' id='player-"+(index+1)+"' name='player-"+(index+1)+"' placeholder='Nom du joueur "+(index+1)+"' /></li>");
			});
			$('.players ul li').css('width', 100/data.players.length+"%");
			
			
			//création des questions
			$(partie1).each(function(i,e) {
				if (i == 0) {
					var slideIntro = mySwiper.createSlide("<section class='video-container'><video><source src='media/AnimationPartie1.mp4' type='video/mp4' /></video></section>");
					slideIntro.append();
				}
				var slideQuestions = mySwiper.createSlide("<div id='question-"+cpt+"'><section class='question'><h2>"+e.title+"</2></section><section class='reponse'><ul class='deux'></ul><div class='clear'></div></section><section class='timer'></section></div>");
				
				slideQuestions.append();
				//mélange des questions
				shuffle(e.reponses);

				$(e.reponses).each(function(i,rep) {
					// création d'un array de 2 réponses dont la juste			
					if (rep.isCorrect) {
						var array = new Array();					
						array.push(rep);
						if (i<3) {
							array.push(e.reponses[i+1]);
						}
						else {
							array.push(e.reponses[i-1]);
						}
						shuffle(array);
					}
					//parcours le tableau array
					$(array).each(function(j, ar) {
							$("#question-"+cpt).find("ul.deux").prepend("<li data-justesse='"+ar.isCorrect+"'>"+ar.title+"</li>");
					});
				});
				
				cpt++;
				if (i == partie2.length-1) {
					var slideRank = mySwiper.createSlide("<section class='question'><h2>Classement intermédiaire</h2></section><section class='ranking'><ul></ul><div class='clear'></div></section>");
					slideRank.append();
					
				}

			});
			//création des questions
			$(partie2).each(function(i,e) {
				if (i == 0) {
					var slideIntro = mySwiper.createSlide("<section class='video-container'><video><source src='media/AnimationPartie2.mp4' type='video/mp4' /></video></section>");
					slideIntro.append();
				}
				var slideQuestions = mySwiper.createSlide("<div id='question-"+cpt+"'><section class='question'><h2>"+e.title+"</2></section><section class='reponse'><ul class='quatre'></ul><div class='clear'></div></section><section class='timer'></section></div>");
				
				slideQuestions.append();
				//on mélange les réponses
				shuffle(e.reponses);
				
				$(e.reponses).each(function(i,rep) {
						$("#question-"+cpt).find("ul.quatre").append("<li data-justesse='"+rep.isCorrect+"'>"+rep.title+"</li>");
				});
				cpt++;
				if (i == partie1.length-1) {
					var slideRank = mySwiper.createSlide("<section class='question'><h2>Classement intermédiaire</h2></section><section class='ranking'><ul></ul><div class='clear'></div></section>");
					slideRank.append();
				}
			});
			//création des questions
			$(partie3).each(function(i,e) {
				if (i == 0) {
					var slideIntro = mySwiper.createSlide("<section class='video-container'><video><source src='media/AnimationPartie3.mp4' type='video/mp4' /></video></section>");
					slideIntro.append();
				}
				var slideQuestions = mySwiper.createSlide("<div id='question-"+cpt+"'><section class='question'><h2>"+e.title+"</2></section><section class='buzzer'></section></div>");
				
				slideQuestions.append();
				cpt++;
				if (i == partie3.length-1) {
					var slideRank = mySwiper.createSlide("<section class='question'><h2>Classement Final</h2></section><section class='ranking'><ul></ul><div class='clear'></div></section>");
					slideRank.append();
					
				}
			});
			
			//création des dernières slides
			var slideTie = mySwiper.createSlide("<div id='question-tie'><section class='question' id='tie'><h2>Mort subite</h2></section><section class='question-tie'><h2 id='title-question-tie'></h2><h2 id='title-reponse-tie'></h2></section></div>");
			slideTie.append();
			
			slideWinner = mySwiper.createSlide("<section class='question'><h2>Le grand gagnant</h2></section><section class='winner'><div class='img-winner'></div><ul class='infos-winner'></ul></section>");
			slideWinner.append();
			
			slideEnd = mySwiper.createSlide("<section class='end'><a href='#' class='letsgo' id='endPartie'>Fin de la partie</a></section>");
			slideEnd.append();
			
		},
		error:function() {
			alert("nope");
		}
		
	});
		
});




//fin dudocument ready

})

setHeight();

});
window.onresize = function() {
	setHeight();
};

function setHeight(){
	var heightWindow = $(window).height();
	$(".swiper-container").css('height', heightWindow);
}



/**
Fonction qui permet de récupérer le classement des joueurs en fonction de l'id d'une partie et de placer les informations dans le html
*/
function getPlayer(partieId) {
	
	var req = config.serverUrl + "partie/"+partieId+"/players";
	$('.ranking ul').empty();
	
	$.ajax({
		type:'GET',
		url:req,
		header:{
			'Content-Type': 'application/json',
			'Accept':'application/json'
			},
		success:function(data) {
					$(data).each(function(i, e) {
						$('.ranking ul').append("<li><span class='points'>"+e.nbrPoints+"</span><span class='name-player'>"+e.name+"</span></li>");						
						});
					// règle la longueur du li en fonction du nombre de joueur
					$('.ranking ul li').css('width', 100/data.length+"%");
		}			
	});
		getWinner(partieId);
}
/*
Fonction qui permet de récupérer le gagnant d'une partie
*/
function getWinner(partieId) {
	var req = config.serverUrl + "partie/"+partieId+"/gagnant";
	
	$.ajax({
		type:'GET',
		url:req,
		header:{
			'Content-Type': 'application/json',
			'Accept':'application/json'
			},
		success:function(data) {
			$(".infos-winner").empty();
			if (data.length > 1) {
				$("#question-tie").parent().css('display', 'block');
				
				$(data).each(function(i, e) {
				
				$(".infos-winner").append("<li><input type='hidden' class='playerId-winner' value='"+e.id+"' /><h2 id='name-winner'>"+e.name+"</h2><h3 id='points-winner'>"+e.nbrPoints+" Points</h3><label for='email-winner'>Email</label><input type='text' tabindex='-1' id='email-winner-"+e.id+"' name='email-winner' /></li>");
				$(".infos-winner li").css('width', 100/data.length+'%');
				});
			}
			else {
//				$("#question-tie").parent().css('display', 'none');
				$(data).each(function(i, e) {
					$(".infos-winner").append("<li><input type='hidden' class='playerId-winner' value='"+e.id+"' /><h2 id='name-winner'>"+e.name+"</h2><h3 id='points-winner'>"+e.nbrPoints+" Points</h3><label for='email-winner'>Email</label><input type='text' id='email-winner' name='email-winner' /></li>");
				});
			}
		}
	});
}
/*
fonction qui permet d'envoyer le nom des joueurs
*/
function sendName() {
	var req = config.serverUrl + "player/";
	
	$(".players ul li").each(function(i,e) {
		
		var playerId = $(this).find('input#player-'+(i+1)).attr('data-playerID');
		var playerName = $(this).find('input#player-'+(i+1)).val();
		
		var myPlayerToSend = new Object();
		myPlayerToSend.id = playerId;
		myPlayerToSend.name = playerName;
		
		var data = JSON.stringify(myPlayerToSend, null, 2);
		
		$.ajax({
			type:'PUT',
			dataType:"json",
			url:req,
			data:data,
			contentType: 'application/json',
			header:{
				'Content-Type': 'application/json',
				'Accept':'application/json'
				},
			success:function(data) {
				console.log("OMG");
			}
		});
	}); 
}
/**
fonction qui permet d'envoyer l'adresse email du vaincqueur
*/
function sendEmailFromWinner() {

	var req = config.serverUrl + "player/";
	$(".infos-winner li").each(function(index,elem) {
		
		var playerId = $(this).find(".playerId-winner").val();
		var playerEmail = $(this).find("input[name=email-winner]").val();
		var playerName = $(this).find("#name-winner").text();
		
		var myPlayerToSend = new Object();
		myPlayerToSend.id = playerId;
		myPlayerToSend.name = playerName;
		myPlayerToSend.email = playerEmail;
		
		var data = JSON.stringify(myPlayerToSend, null, 2);
		console.log(data);
		$.ajax({
			type:'PUT',
			dataType:"json",
			url:req,
			data:data,
			contentType: 'application/json',
			header:{
				'Content-Type': 'application/json',
				'Accept':'application/json'
				},
			success:function(data) {
				console.log("OMG");
			}
		});
		
	
	});
	
}
/*
fonction qui met fin à la partie (change isOver en true)
*/
function endPartie() {
	var partieId = $("#partie").attr('data-id');
	var req = config.serverUrl + "partie/"+partieId+"/terminePartie";
	
	$.ajax({
		type:'PUT',
		dataType:"json",
		url:req,
		contentType: 'application/json',
		header:{
			'Content-Type': 'application/json',
			'Accept':'application/json'
			},
		success:function(data) {
			console.log("Fin de la partie");
		},
		complete:function() {
			document.location.href='index.html';
		}
	});
	
}
/*
fonction qui permet de récuperer une question aléatoire dans la collection de toutes les questions
*/

function getQuestionRandom(partieId) {
	var req = config.serverUrl + "partie/"+partieId+"/questionRandom";

	$.ajax({
		type:'GET',
		url:req,
		header:{
			'Content-Type': 'application/json',
			'Accept':'application/json'
			},
		success:function(data) {
			$("#title-question-tie").clearQueue().height(0).animate({height:450}, 3000).html(data.title);
			console.log(data);
			$(data.reponses).each(function(i, e) {
				if(e.isCorrect)
				$("#title-reponse-tie").html(e.title);
			});
			},
		error: function() {
			$("#title-question-tie").animate({height:450}, 2000).html("il n'y a plus de questions ;)");
			$("#title-reponse-tie").html("et pas de réponses non plus ;)");
			}		
	});
}
/*
Permet de shuffle un array
*/
function shuffle(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
        var k = n + Math.floor(Math.random() * (sourceArray.length - n));

        var temp = sourceArray[k];
        sourceArray[k] = sourceArray[n];
        sourceArray[n] = temp;
    }
}



