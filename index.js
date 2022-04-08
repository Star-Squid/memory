const gameSpaces = ["#tile-01", "#tile-02", "#tile-03", "#tile-04", "#tile-05", "#tile-06", "#tile-07", "#tile-08", "#tile-09", "#tile-10", "#tile-11", "#tile-12"];
const gamePieces = ["flw-01", "lef-01", "flw-02", "lef-02", "flw-03", "lef-03", "flw-04", "lef-04", "flw-05", "lef-05", "flw-06", "lef-06"];

//reduce <img src="images/flw-01.png"> into just 01
function getImgNoByHTML(html){
    let htmlSplit = html.split("/");
    let htmlSplitTwice = htmlSplit[1].split(".");
    let imageName = htmlSplitTwice[0];
    let imageNo = imageName.split("-");
    return imageNo[1];
}

//change tile image by tile id: example input "#tile-01", "flw-01"
function changeImage(tileID, imageName){
    $(tileID).html('<img src="images/' + imageName + '.png">');
}

//shuffle game pieces
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

//assign game pieces to spaces
function assignGamePieces(spaces, pieces){
    for (let i = 0; i < spaces.length; i++){
        changeImage(spaces[i], pieces[i])
    }
};

//display or hide "about"
$(".link-to-about").mousedown(function() {
    //$("#about").toggleClass("hidethis");    
    $("#about").slideToggle("slow"); 
    //$("#about").toggle("slide", { direction: "left" }, 20000);   
});

//handle timer
 (function($){
         $("#timer, #start-game").stopwatch().click(function(){ 
             $("#timer").stopwatch("toggle");
         });
 })(jQuery);

//CLICK "NEW GAME" TO START GAME
$("#start-game").mousedown(function() {
    
    shuffleArray(gamePieces);
    assignGamePieces(gameSpaces, gamePieces);
    
    $(".win-text").removeClass("invisible");
    $(".dead").addClass("game-tile");
    $(".game-tile").removeClass("dead").addClass("clicky").addClass("showbackface");
    $(".win").text("Board " + " " + " started!");

    let revealedTiles = 0;
    let trackMoves = 0;
    let pairsFound = 0;

    let firstTileClicked;
    let firstTileImage;
    let firstTileId;

    let secondTileClicked;
    let secondTileImage;
    let secondTileId;

    // CLICK A TILE
    $(".clicky").mousedown(function() {
        revealedTiles ++;
        trackMoves ++;
        console.log("revealed tiles: " + revealedTiles);
        $(this).removeClass("showbackface")
        let currentTile = this;

        //is it the first or second tile this round?
        if (revealedTiles === 1){
            firstTileClicked = $(this).html();
            firstTileImage = getImgNoByHTML(firstTileClicked);
            firstTileId = currentTile.id;
            console.log(firstTileId + " => " + firstTileClicked + " => " + firstTileImage);

        } else if (revealedTiles === 2){
            secondTileClicked = $(this).html();
            secondTileImage = getImgNoByHTML(secondTileClicked);
            secondTileId = currentTile.id;
            console.log(secondTileId + " => " + secondTileClicked + " => " + secondTileImage);
            revealedTiles = 0;


            //do the tiles match?
            if (firstTileImage === secondTileImage) {
                pairsFound++;
                console.log("Pairs found: " + pairsFound);
                $("#" + firstTileId).animate({opacity: '0.3'}).animate({opacity: '1'}).removeClass().addClass("dead");
                $("#" + secondTileId).animate({opacity: '0.3'}).animate({opacity: '1'}).removeClass().addClass("dead");

                //6 pairs? win!
                if (pairsFound >= 6){
                    $(".win").text("Board finished in " + " " + trackMoves + " " + " moves!");
                    $("#timer").stopwatch("stop")
                } 

            } else {
                $(".game-tile").addClass("dead")
                setTimeout(function() {
                    $(".game-tile").removeClass("dead")
                    .addClass("showbackface");
                }, 3000);
            }

        } else {console.log("The pairs counter doesn't work correctly")}
    });
});