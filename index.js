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

//handle timer
(function($){
    $("#timer").stopwatch().click(function(){ 
        $("#timer").stopwatch("toggle");
    });
})(jQuery);



    let revealedTiles = 0;
    let trackMoves = 0;
    let pairsFound = 0;

    let firstTileClicked;
    let firstTileImage;
    let firstTileId;

    let secondTileClicked;
    let secondTileImage;
    let secondTileId;

//CLICK TO START GAME
$("#start-game").click(function() {
    
    shuffleArray(gamePieces);
    assignGamePieces(gameSpaces, gamePieces);

    $("#timer").stopwatch("reset");
    $("#timer").stopwatch("start");
    
    $(".cover-tiles").addClass("hidethis");
    $(".win-text").removeClass("hidethis");
    $(".dead").addClass("game-tile");
    $(".game-tile").removeClass("dead").addClass("showbackface").addClass("clicky");
    $(".win").text("Board " + " " + " started!");

    $("#plant-list").empty();

     revealedTiles = 0;
     trackMoves = 0;
     pairsFound = 0;

});



    // CLICK A TILE
    $(".game-tile").click(function() {
        revealedTiles ++;
        trackMoves ++;
        //console.log("revealed tiles: " + revealedTiles);
        $(this).removeClass("showbackface")
        let currentTile = this;

        //is it the first or second tile this round?
        if (revealedTiles === 1){
            firstTileClicked = $(this).html();
            firstTileImage = getImgNoByHTML(firstTileClicked);
            firstTileId = currentTile.id;
            //console.log(firstTileId + " => " + firstTileClicked + " => " + firstTileImage);

        } else if (revealedTiles === 2){
            secondTileClicked = $(this).html();
            secondTileImage = getImgNoByHTML(secondTileClicked);
            secondTileId = currentTile.id;
            //console.log(secondTileId + " => " + secondTileClicked + " => " + secondTileImage);
            revealedTiles = 0;


            //do the tiles match?
            if (firstTileImage === secondTileImage) {
                pairsFound++;
                //console.log("Pairs found: " + pairsFound);
                $("#" + firstTileId).animate({opacity: '0.3'}).animate({opacity: '1'}).removeClass().addClass("dead");
                $("#" + secondTileId).animate({opacity: '0.3'}).animate({opacity: '1'}).removeClass().addClass("dead");

                //which plant?
                switch (secondTileImage) {
                    case "01": $("#plant-list").append('<li>wild carrot</li>')
                        $(".win").text("You discovered wild carrot!")
                        break;
                    case "02": $("#plant-list").append('<li>chicory</li>')
                        $(".win").text("You discovered chicory!")
                        break;
                    case "03": $("#plant-list").append('<li>bluebell</li>')
                        $(".win").text("You discovered bluebells!")
                        break;
                    case "04": $("#plant-list").append('<li>goatsbeard</li>')
                        $(".win").text("You discovered goatsbeard!")
                        break;
                    case "05": $("#plant-list").append('<li>teasel</li>')
                        $(".win").text("You discovered teasel!")
                        break;
                    case "06": $("#plant-list").append('<li>forget-me-not</li>')
                        $(".win").text("You discovered forget-me-nots!")
                        break;
                }

                //6 pairs? win!
                if (pairsFound >= 6){
                    $(".win").text("Board finished in " + " " + trackMoves + " " + " moves!");
                    $("#timer").stopwatch("stop")

                    setTimeout(function() {
                        $(".cover-tiles").removeClass("hidethis");
                    }, 3000);
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

//display or hide "about"
const dialog = document.querySelector("dialog");
const openDialogBtn = document.getElementById("link-to-about");
const closeDialogBtn = document.getElementById("close_dialog");

const elements = dialog.querySelectorAll(
  'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
);
const firstElement = elements[0];
const lastElement = elements[elements.length - 1];

const trapFocus = (e) => {
  if (e.key === "Tab") {
    const tabForwards = !e.shiftKey && document.activeElement === lastElement;
    const tabBackwards = e.shiftKey && document.activeElement === firstElement;
    if (tabForwards) {
      // only TAB is pressed, not SHIFT simultaneously
      // Prevent default behavior of keydown on TAB (i.e. focus next element)
      e.preventDefault();
      firstElement.focus();
    } else if (tabBackwards) {
      // TAB and SHIFT are pressed simultaneously
      e.preventDefault();
      lastElement.focus();
    }
  }
};

const openDialog = () => {
  dialog.showModal();
  dialog.addEventListener("keydown", trapFocus);
};

const closeDialog = (e) => {
  e.preventDefault();
  dialog.close();
  dialog.removeEventListener("keydown", trapFocus);
  openDialogBtn.focus();
};

openDialogBtn.addEventListener("click", openDialog);
closeDialogBtn.addEventListener("click", closeDialog);
