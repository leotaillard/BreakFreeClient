/*
Auteur: Léo Taillard
Project: BreakFree
Usage: Paléo festival stand COMEM
*/
var mySwiper;
$(document).ready(function() {
	setHeight();
	$("#hook").hook({
		reloadPage: false,
		reloadEl: function(){
		  getPartieEnCours();
		},
		dynamic:true,
		swipeDistance:100
		
	});
	
	
	$("#partie-cours").css('display','block');
	$("#questions").css('display','none');
	
	getPartieEnCours();
	
	$(function(){
		mySwiper = $('.swiper-container').swiper({
			mode:'horizontal',
			onSlideChangeEnd: function(index, elem) {
			    if (mySwiper.previousIndex > mySwiper.activeIndex) {
			       //backwards
			       retirePoints(mySwiper.activeIndex);
			       console.log("let's go back");
			    }else{
			       //forwards
					console.log("let's go forward");	
					sendPoints(mySwiper.activeIndex);
			    }
			}
		});
	})
	
	$(document).on( 'click', '#showEgalite', function () {
		$(this).toggle();
		$("#egalite").toggle();
	});
	$(document).on( 'click', '#endPartie', function () {
		endPartie();
	});
	$(document).on( 'click', '.checkbox', function () {
		$(this).parent().toggleClass("checked");
	} );
	
});

/*
Fonction permettant de lister les parties en cours
*/
function getPartieEnCours() {

	var req = config.serverUrl + "partie/partieEnCours";

	$.ajax({
		type:'GET',
		url:req,
		success:function(data) {
			$("#parties").empty();
			if(data != 0){
				
				$(data).each(function(index, e) {
					
					var newA = $("<a/>",{
						href:"#",
						text:"partie numéro "+data[index].id+" | "+formatDate(new Date(e.date), '%H:%m:%s'),
						class:"partie",
						id:"partie-"+data[index].id,
						click:function() {
							getSlideForPartie(data[index].id);
							$("#loading").css('display','block');
							$("#partie-cours").css('display','none');
							$("#questions").attr('data-partieId', data[index].id);
							return false;
						}
						});
					
					newA.attr('data-partieId', data[index].id);
					
					var newADel = $("<a/>",{
						href:"#",
						text:"",
						class:"endPartie",
						click:function() {
							endPartie(data[index].id);
							return false;
						}
						});
						
					newADel.attr('data-partieId', data[index].id);
					var newSection = $("<section/>").append(newA).append(newADel);
					$("#parties").append(newSection);
					
				});//fin du each
				
				}//fin du if
				else {
					$("nav#parties").html("<p>il n'y a pas de parties en cours</p>");
				}// fin du else
				//$("#partie-cours").css('display','block');
				$("#loading").css('display','none');
			}// fin du success
		});//fin de la requete ajax
}

/*
Fonction permettant de remplir le slider avec l'ensemble des questions de la partie
*/
function getSlideForPartie(numPartie) {
	if (numPartie == null) {
		alert("Problem");
	}
	$(".swiper-wrapper").empty();
	
	var req = config.serverUrl+"partie/"+numPartie;
	$.ajax({
		type:'GET',
		url:req,
		success:function(data) {
				console.log(data);
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
				//création du tableau pour les différentes parties
				var questionsInOrder = new Array();
				
				for (var i = 0; i < partie1.length; i++) {
					questionsInOrder.push(partie1[i]);
				}
				for (var i = 0; i < partie2.length; i++) {
					questionsInOrder.push(partie2[i]);
				}
				for (var i = 0; i < partie3.length; i++) {
					questionsInOrder.push(partie3[i]);
				}

				$(questionsInOrder).each(function(i,e) {
				$(".swiper-wrapper").append("<div class='swiper-slide' id='question-"+(i+1)+"'><div class='question-reponse'><h2 class='titre-question'>"+e.title+"</h2><h2 class='titre-reponse'></h2><div class='clear'></div></div><ul class='reponses'><div class='clear'></div></ul></div>");
				
				});
				$("#question-"+(questionsInOrder.length)).after("<div class='swiper-slide' id='question-13'><section class='recolte-end'><a href='#' class='letsgo' id='showEgalite'>Egalite ?</a></section><section id='egalite'><div class='question-reponse'><h2>Egalité</h2><div class='clear'></div></div><ul class='reponses'><div class='clear'></div></ul></section></div><div class='swiper-slide'><section class='recolte-end'><a href='#' class='letsgo' id='endPartie'>Fin de la partie</a></section></div>");
				
				$(data.players).each(function(j,pla) {
					//affichage de la récolte des questions
					$("ul.reponses").append("<li class='reponse' id='player"+(j+1)+"' data-playerId='"+pla.id+"'><h3>"+pla.name+"</h3><div class='reponses-player'><label class='juste'><input data-points='1' type='checkbox' class='checkbox' name='player-"+(j+1)+"' id='player-"+(j+1)+"' value='true'/></label></div></li>");
				});
				
				$("ul.reponses li").css('width', 100/data.players.length+"%")
				$(questionsInOrder).each(function(index, e) {
					// ajoute le nombre de points à chaque span de réponse juste
					$("#question-"+(index+1)+" .juste").each(function() {
						$(this).attr('data-points', e.rank);
					});
						$(e.reponses).each(function(i, rep) {
							// affichage de la réponse
							if (rep.isCorrect) {
								$("#question-"+(index+1)).find(".titre-reponse").text(rep.title);
							}
						});
				});//fin du each
				$("#question-13 .juste").each(function() {
					$(this).attr('data-points', 1);
				});
				//$("#partie-cours").css('display','block');
				$("#loading").css('display','none');
				$("#questions").css('display','block');
				mySwiper.reInit()
				
			}// fin du success
		});//fin de la requete ajax
}
function sendPoints(slideIndex) {
		var req = config.serverUrl + "player/";
		$("#question-"+(slideIndex)+" .juste input[type=checkbox]:checked").each(function() {
			var points = $(this).parent().attr('data-points');
			var playerId =$(this).parent().parent().parent().attr('data-playerId');
			$.ajax({
				type:'PUT',
				dataType:"json",
				url:req+playerId+"?nbrPoints="+points,
				data:{},
				contentType: 'application/json',
				header:{
					'Content-Type': 'application/json',
					'Accept':'application/json'
					},
				success:function(data) {
					console.log("Le joueurs a recu des points");
				}
			});
		});
}
function retirePoints(slideIndex) {
		var req = config.serverUrl + "player/";
		
		
		$("#question-"+(slideIndex+1)+" .juste input[type=checkbox]:checked").each(function() {
			
			var points = $(this).parent().attr('data-points');
			points = points * -1;
			var playerId =$(this).parent().parent().parent().attr('data-playerId');
			
			$.ajax({
				type:'PUT',
				dataType:"json",
				url:req+playerId+"?nbrPoints="+points,
				data:{},
				contentType: 'application/json',
				header:{
					'Content-Type': 'application/json',
					'Accept':'application/json'
					},
				success:function(data) {
					console.log("le joueur a perdu des points");
				}
			});
			
		});
}
/*
fonction qui met fin à la partie (change isOver en true)
*/
function endPartie(id) {
	if (id==null) {
		id = $("#questions").attr('data-partieId');
	}
	var req = config.serverUrl + "partie/"+id+"/terminePartie";
	var answer = confirm("voulez-vous vraiment terminer la partie ?");
	if (answer) {
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
//				document.location.href='recolte.html';
				getPartieEnCours();
				$("#partie-cours").css('display','block');
				$("#questions").css('display','none');
				mySwiper.swipeTo(0);
			}
		});
	}
	else {
	}
}
function formatDate(date, fmt) {
    function pad(value) {
        return (value.toString().length < 2) ? '0' + value : value;
    }
    return fmt.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
        switch (fmtCode) {
        case 'Y':
            return date.getFullYear();
        case 'M':
            return pad(date.getMonth() + 1);
        case 'd':
            return pad(date.getDate());
        case 'H':
            return pad(date.getHours());
        case 'm':
            return pad(date.getMinutes());
        case 's':
            return pad(date.getSeconds());
        default:
            throw new Error('Unsupported format code: ' + fmtCode);
        }
    });
}
function setHeight(){
	var heightWindow = $(window).height();
	$("#questions").css('height', heightWindow);
		$(".swiper-container").css('height', heightWindow);
		$(".swiper-wrapper").css('height', heightWindow);
	
}



