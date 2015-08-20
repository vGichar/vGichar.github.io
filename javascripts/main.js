(function(){

	// Game Options
	var GridSize = 3;
	var GridSizeGrowth = 1;
	var LevelsForGridSizeGrowth = 10;

	var TilesNumber = 3;
	var TilesGrowth = 1;
	var LevelsForTilesGrowth = 3;

	var StartTime = 3200;
	var StartTimeGrowth = -100;
	var LevelsForStartTimeGrowth = 5;

	var DimTimeMinimum = 280;
	var DimTimeMaximum = 560;
	var DimTime = DimTimeMinimum;
	var DimTimeGrowth = 70;
	var LevelsForDimTimeGrowth = 5;


	// UI Helpers
	var HasBorder = true;
	var jContainer = $("#game-container");
	var TileTemplate = HasBorder?'<div class="tile-wrapper"><div class="tile bordered"></div></div>': '<div class="tile-wrapper"><div class="tile"></div></div>';

	// Game Helpers
	var CurrentLevel = 0;
	var IsGameStarted = false;
	var TargetIndices = [];

	var CurrentTilesNumber = TilesNumber;
	var CurrentTime = StartTime;
	var CurrentDimTime = DimTime;
	var CurrentStartTime = StartTime;
	var CurrentGridSize = GridSize;

	var timeIntervalId = 0;

	$(function(){
		if(!HasBorder){
			jContainer.css({
				"border" : "5px solid white",
				"border-radius" : "10px"
			});
		}
		prepareContainer();
	});

	function registerTileHadnlers (jTiles) {
		jTiles.each(function(){
			$(this).on("click", tileOnClick);
			$(this).on("mouseup", tileOnClick);
		})
	}

	function tileOnClick (e) {
		if(!IsGameStarted){
			startGame();
		}
		var jThis = $(this);
		if(!jThis.hasClass("marked")){
			var index = getTiles().index(jThis);

			var targetIndex = TargetIndices.indexOf(index);
			if(targetIndex < 0){
				endGame();
			}else{
				TargetIndices.splice(targetIndex, 1);
				lightTiles(jThis);
				jThis.addClass("marked");
			}

			if(TargetIndices.length == 0){
				levelComplete();
			}
		}
	}

	function prepareContainer (registerTimeout) {
		setCurrentLevel(CurrentLevel);
		setCurrentTime(CurrentTime);

		TargetIndices = generateRandomTileIndices(CurrentTilesNumber, CurrentGridSize * CurrentGridSize);
		jContainer.html('');
		
		for (var i = 0; i < CurrentGridSize * CurrentGridSize; i++) {
			jContainer.append(TileTemplate);
		}

		var jTiles = getTiles();
		var tileSize = jContainer.width() / CurrentGridSize;
		jTiles.parent().css({
			width : tileSize,
			height : tileSize
		});
		var jStartTargetTiles = getTiles(TargetIndices);
		lightTiles(jStartTargetTiles);

		if(registerTimeout == undefined){
			registerTileHadnlers(jTiles);
		}else{
			lightTiles(jTiles);
			setTimeout(function(){
				lightTiles(jStartTargetTiles);
				registerTileHadnlers(jTiles);
			}, registerTimeout);
		}
	}

	function startGame () {
		IsGameStarted = true;
		var startTime = new Date();

		var jTiles = getTiles(TargetIndices);
		dimTiles(jTiles, CurrentDimTime);

		timeIntervalId = setInterval(function(){
			CurrentTime -= new Date() - startTime;
			startTime = new Date();
			setCurrentTime(CurrentTime);
			if(CurrentTime < 0){
				endGame();
			}
		}, 16);
	}

	function endGame () {
		clearInterval(timeIntervalId);

		CurrentLevel = 0;
		IsGameStarted = false;
		TargetIndices = [];

		CurrentTime = StartTime;
		CurrentDimTime = DimTime;
		CurrentStartTime = StartTime;
		CurrentGridSize = GridSize;
		CurrentTilesNumber = TilesNumber;

		setCurrentLevel(CurrentLevel);
		setCurrentTime(CurrentTime);
		prepareContainer(1000);
	}

	function levelComplete () {
		CurrentLevel++;
		clearInterval(timeIntervalId);
		setCurrentLevel(CurrentLevel);

		if(CurrentLevel % LevelsForGridSizeGrowth == 0){
			CurrentGridSize+= GridSizeGrowth;
		}

		if(CurrentLevel % LevelsForTilesGrowth == 0){
			CurrentTilesNumber+= TilesGrowth;
		}

		if(CurrentLevel % LevelsForStartTimeGrowth == 0){
			CurrentStartTime+= StartTimeGrowth;
		}

		if(CurrentLevel % LevelsForDimTimeGrowth == 0){
			CurrentDimTime+=DimTimeGrowth;
			CurrentDimTime = Math.min(Math.max(DimTime, DimTimeMinimum), DimTimeMaximum);
		}

		CurrentTime = CurrentStartTime;

		prepareContainer();
		startGame();
	}

	function generateRandomTileIndices (numOfTileIndices, limit) {
		var indices = [];
		while(numOfTileIndices > 0){
			var index = Math.floor(Math.random() * limit);
			if(indices.indexOf(index) >= 0){
				continue;
			}
			numOfTileIndices--;
			indices.push(index);
		}
		return indices;
	}

	// ***************************************************************
	// UI Helper Functions
	// ***************************************************************
	function getTiles(targetIndices){
		if(targetIndices == undefined){
			return jContainer.find(".tile");
		}

		var result = [];
		var jTiles = jContainer.find(".tile");

		for (var i in targetIndices) {
			result.push($(jTiles.get(targetIndices[i])));
		};
		return $(result).map(function () {return this.toArray(); } );;
	}

	function lightTiles (jTiles) {
		getTiles().css("background-color", "#000");
		jTiles.css("background-color", "#fff");
	}

	function dimTiles (jTiles, dimTime){
		var fullAnimDuration = dimTime;
		var startDate = new Date();
		var intervalId = setInterval(function(){
			dimTime -= new Date() - startDate;
			startDate = new Date();
			var decColor = Math.max(Math.floor(dimTime * 265 / fullAnimDuration), 0);
			var color = decColor.toString(16);
			if(color.length == 1){
				color = "0" + color;
			}
			jTiles.css("background-color", "#" + color + color + color);
			if(dimTime < 0){
				clearInterval(intervalId);
			}
		}, 16);
	}

	function setCurrentTime(time){
		$("#time").html(time);
	}

	function setCurrentLevel(level){
		$("#level").html(level);
	}
})();