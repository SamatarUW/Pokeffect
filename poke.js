
$(document).ready(function() {
	function toTitleCase(str) {
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	function newType(name,weak,resist,immune) {  //NEEDS CASE FOR NO EFFECT

		var type = {};
		type.name = name;
		type.weaknesses = weak;
		type.resistances = resist;
		type.immune = immune;
		type.isweak = function(AttackType){

			if ($.inArray(AttackType,type.weaknesses) > -1) {

				return("weak");

			} else  if ($.inArray(AttackType,type.resistances) > -1) {

				return("resists");

			} else {

				return("normal");

			}

		}

		return type;

	}


	function PokemonWeakness(Pokemon) {

		$.getJSON("https://pokeapi.co/api/v2/pokemon/"+Pokemon.toLowerCase(),function(poke) {

			$("#statlist").empty();
			$("#ablist").empty();

			if ($("#pokepic")) {$("#pokepic").remove();}
			if ($("#tp1")) {$("#tp1").empty();}
			if ($("#tp2")) {$("#tp2").empty();}

			var img = document.createElement("img");
			img.id = "pokepic";
			img.src = poke.sprites.front_default;
			img.height = "230";
			img.width = "230";
			img.margin = "0 auto";
			document.getElementById("pokebox").appendChild(img);			

			var type1 = document.createElement("div");
			type1.style.width = "80px";
			type1.style.height = "30px";
			type1.style.background = "#FE2525";
			type1.style.color = "white";
			type1.style.fontSize = "110%";
			type1.style.borderRadius = "10px";
			type1.style.lineHeight = "30px";
			type1.style.textAlign = "center";
			type1.style.paddingBottom = "4px";
			type1.style.position = "relative";
			type1.style.left = "160px";
			type1.innerHTML = toTitleCase(poke.types[0].type.name);
			document.getElementById("tp1").appendChild(type1);

			if (poke.types.length === 2) { 
				var type2 = document.createElement("div");
				type2.style.width = "80px";
				type2.style.height = "30px";
				type2.style.background = "#FE2525";
				type2.style.color = "white";
				type2.style.fontSize = "110%";
				type2.style.borderRadius = "10px";
				type2.style.lineHeight = "30px";
				type2.style.textAlign = "center";
				type2.style.paddingBottom = "4px";
				type1.style.left = "80px";
				type2.style.position = 'relative';
				type2.style.left = "60px";
				type2.innerHTML = toTitleCase(poke.types[1].type.name);
				document.getElementById("tp2").appendChild(type2);
			}

			var abilities = [];
			var base = [];

			var alen = poke.abilities.length;
			var abilityurl = '';

			for(var i = 0; i < alen; i++) {
			    var a = poke.abilities[i].ability;
			    abilities.push(a.name);
			    abilityurl = a.url;
			    $.getJSON(abilityurl,function(ab) {	
				    $("#ablist").append(toTitleCase(ab.name + ":"));
				    $("#ablist").append("<br>");
				    $("#ablist").append(ab.effect_entries[0].short_effect);
				    $("#ablist").append("<br>");
				    $("#ablist").append("<br>");
			    })
			    
			}

			for(var i = poke.stats.length -1; i >= 0 ; i--) {
			    var s = poke.stats[i];
			    base.push(s.stat.name + " " + s.base_stat);
			    if (s.stat.name != 'speed') {  
				    $("#statlist").append(toTitleCase(s.stat.name + " " + s.base_stat));
				    $("#statlist").append("<br>");
				    $("#statlist").append("<br>");
				} else {
					$("#statlist").append(toTitleCase(s.stat.name + " " + s.base_stat));
				}
			}


			if (poke.types.length === 1) { 		

				$("#weak").empty();
				$("#res").empty();
				$("#norm").empty();
				$("#imm").empty();

				var allTypes = ["normal","fire","fighting","water","flying","grass","poison","electric",
						"ground","psychic","rock","ice","bug","dragon","ghost","dark","steel","fairy"]

				var typename = poke.types[0].type.name;
				var typeurl = poke.types[0].type.url;

				$.getJSON(typeurl,function(data) {

					var w = [];
					var r = [];
					var imm = '';
					
					if (data.damage_relations.no_damage_from.length > 0) {
						imm = data.damage_relations.no_damage_from[0].name;
						allTypes.pop
						$("#imm").append(toTitleCase(imm));
						$("#imm").append("<br>");
					}

					for(var i = 0; i < data.damage_relations.half_damage_from.length; i++) {
					    var resists =  data.damage_relations.half_damage_from[i];
						if (resists != imm) {  
						    r.push(resists.name);
						    $("#res").append(toTitleCase(resists.name)+" X2");
						    $("#res").append("<br>");
						}
					}

					for(var i = 0; i < data.damage_relations.double_damage_from.length; i++) {
					    var weak =  data.damage_relations.double_damage_from[i];
					    if (weak != imm) { 
					    	w.push(weak.name);
					    	$("#weak").append(toTitleCase(weak.name)+" X2");
					    	$("#weak").append("<br>");
					    }
					}

					for(var i = 0; i < allTypes.length; i++) {

						if ((w.indexOf(allTypes[i]) === -1) && (r.indexOf(allTypes[i]) === -1) && (allTypes[i] != imm)){
							$("#norm").append(toTitleCase(allTypes[i]));
					    	$("#norm").append("<br>");
						} 

					}

					var type = newType(typename,w,r,imm);

				});

			} else {

				$("#imm").empty();

				var type1name = poke.types[0].type.name;
				var type1url = poke.types[0].type.url;

				var type2name = poke.types[1].type.name;
				var type2url = poke.types[1].type.url;

				$.getJSON(type1url,function(t1) {

					$.getJSON(type2url,function(t2) {

						var w1 = [];
						var r1 = [];
						var imm1 = '';

						if (t1.damage_relations.no_damage_from.length > 0) {
							imm1 = t1.damage_relations.no_damage_from[0].name;
							$("#imm").append(toTitleCase(imm1));
							$("#imm").append("<br>");
						}

						var w2 = [];
						var r2 = [];
						var imm2 = '';

						if (t2.damage_relations.no_damage_from.length > 0) {
							imm2 = t2.damage_relations.no_damage_from[0].name;
							$("#imm").append(toTitleCase(imm2));
							$("#imm").append("<br>");
						}

						for(var i = 0; i < t1.damage_relations.half_damage_from.length; i++) {
						    var resists =  t1.damage_relations.half_damage_from[i];
						    r1.push(resists.name);
						}

						for(var i = 0; i < t1.damage_relations.double_damage_from.length; i++) {
						    var weak =  t1.damage_relations.double_damage_from[i];
						    w1.push(weak.name);
						}

						for(var i = 0; i < t2.damage_relations.half_damage_from.length; i++) {
						    var resists =  t2.damage_relations.half_damage_from[i];
						    r2.push(resists.name);
						}

						for(var i = 0; i < t2.damage_relations.double_damage_from.length; i++) {
						    var weak =  t2.damage_relations.double_damage_from[i];
						    w2.push(weak.name);
						}

						var type1 = newType(type1name,w1,r1,imm1);
						var type2 = newType(type2name,w2,r2,imm2);

						doubleType(type1,type2);
					});

				});

			}

		});

	}


	function doubleType(type1,type2) {  //NEEDS CASE FOR NO EFFECT
		//Sets variables for if type1 or type2 is weak to the attack
		var allTypes = ["normal","fire","fighting","water","flying","grass","poison","electric",
						"ground","psychic","rock","ice","bug","dragon","ghost","dark","steel","fairy"]

		var numtypes = allTypes.length;

		var weakx4 = [];
		var weakx2 = [];
		var normal = [];
		var halfresist = [];
		var quarterresist = [];

		$("#weak").empty();
		$("#res").empty();
		$("#norm").empty();

		for (var i = 0; i < numtypes; i++) { 

			var AttackType = allTypes[i];

			var t1status = type1.isweak(AttackType);

			var t2status = type2.isweak(AttackType); 

			var imm1 = type1.immune;
			var imm2 = type2.immune; 

			if (AttackType === imm1 || AttackType === imm2) {continue;}
			if ((type1.name === "ghost" || type2.name === "ghost") && AttackType === "fighting") {
				$("#imm").append(toTitleCase(AttackType));
				continue;
			}

			if (t1status == "weak" && t2status == "weak" ) {

				weakx4.push(AttackType);
				$("#weak").append(toTitleCase(AttackType) + " X4" + "<br>");

			} else if (t1status == "weak" && t2status == "normal"){

				weakx2.push(AttackType);
				$("#weak").append(toTitleCase(AttackType) + " X2" + "<br>");

			} else if (t1status == "normal" && t2status == "weak"){

				weakx2.push(AttackType);
				$("#weak").append(toTitleCase(AttackType) + " X2" + "<br>");

			} else if (t1status == "normal" && t2status == "normal"){

				normal.push(AttackType);
				$("#norm").append(toTitleCase(AttackType) + "<br>");

			} else if (t1status == "resists" && t2status == "weak"){

				normal.push(AttackType);
				$("#norm").append(toTitleCase(AttackType) + "<br>");

			} else if (t1status == "weak" && t2status == "resists"){

				normal.push(AttackType);
				$("#norm").append(toTitleCase(AttackType) + "<br>");

			} else if (t1status == "resists" && t2status == "normal"){

				halfresist.push(AttackType);
				$("#res").append(toTitleCase(AttackType) + " X2" + "<br>");

			} else if (t1status == "normal" && t2status == "resists"){

				halfresist.push(AttackType);
				$("#res").append(toTitleCase(AttackType) + " X2" + "<br>");

			} else if (t1status == "resists" && t2status == "resists"){

				quarterresist.push(AttackType);
				$("#res").append(toTitleCase(AttackType) + " X4" + "<br>");

			}
		}

	}

	$("#searchimg").click(function() {

		var p = $("#searchbar").val();
		PokemonWeakness(p);

	});

	$("#searchbar").on("keypress", function(e) {

		if (e.which === 13) { 
			var p = $("#searchbar").val();
			PokemonWeakness(p);
		}

	});
});