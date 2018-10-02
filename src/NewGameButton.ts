class NewGameButton {
    hovered: boolean;
    colorKey: string;

    constructor() {
        this.hovered = false;

        while(true)
        {
            const colorKey = getRandomColor();
            if (!colorsHash[colorKey]) {
               colorsHash[colorKey] = this;
               this.colorKey = colorKey;
               break;
            }
        }
    }

    select() {
        newGame();
    }

    draw() {
        if(this.hovered) {
            drawNewGameSelected();
        }
    }

    drawHit() {
        drawNewGameHit(this.colorKey);
    }

    hover() {
        if(hoveredObject != this) {
            if(hoveredObject) {
                hoveredObject.unhover();
            }
            hoveredObject = this;
            this.hovered = true;
        }
    }

    unhover() {
        this.hovered = false;
    }
}
