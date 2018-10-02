class HexIndicator {
    type: number;
    hovered: boolean;
    colorKey: string;

    constructor(type: number) {
        this.type = type;
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
    
    draw() {
        //self
        drawIndicatorHex(78 + this.type * (difficulty > 1 ? 46 : 49), 798, this.type + (this.hovered ? 100 : 0 ), hexCounter[this.type] == 0 ? 0.3 : 1)
        //text
        objectCtx.font = "bold " + 15 + "px Arial";
        if(this.type < 6 || this.type > 11)
        {
            if(this.type > 0 && this.type < 5 && hexCounter[this.type] % 2 == 1) {
                objectCtx.fillStyle = "red";
            }
            else {
                objectCtx.fillStyle = "white";
            }
            objectCtx.fillText(hexCounter[this.type].toString(),113 + this.type * (difficulty > 1 ? 46 : 49), 853);
        }
    }

    drawHit() {
        drawHitHex(78 + this.type * (difficulty > 1 ? 46 : 49) + 21.5,798 + 24,24, this.colorKey);
    }

    select() {
    }

    hover() {
        if(hoveredObject != this) {
            if(hoveredObject) {
                hoveredObject.unhover();
            }
            hoveredObject = this;
            this.hovered = true;

            hexes.forEach(hex => {
                if(hex.type == this.type)
                    hex.highlighted = true;
            });

        }
    }

    unhover() {
        hexes.forEach(hex => {
            if(hex.type == this.type)
                hex.highlighted = false;
        });
        this.hovered = false;
    }

}