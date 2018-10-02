class Hex {
    type : number;
    x : number;
    y : number;
    active: boolean;
    selected: boolean;
    highlighted: boolean;
    hovered: boolean;
    colorKey: string;

    constructor(type: number, x: number, y : number, inGame :boolean) {
        this.type = type;
        this.x = x;
        this.y = y;

        this.active = this.selected = this.highlighted = this.hovered = false;

        while(true)
        {
            const colorKey = getRandomColor();
            if (!colorsHash[colorKey]) {
               colorsHash[colorKey] = this;
               this.colorKey = colorKey;
               break;
            }
        }

        hexCounter[this.type]++;
        hexMap[this.x][this.y] = this;
        hexes.push(this);
    }

    update () {
        this.updateActive();
    }

    updateActive() {
        //wrong metallevel
        if(this.type > 5 && this.type < 12 && (this.type - 6 != metalLevel))
        {
            this.active = false;
            return;
        }
        var x, y, count = 0;
        for(var i = 0; i < 8; i++)
        {
            //going around
            x = xInDirection(this.x, this.y, i % 6);
            y = yInDirection(this.y, i % 6);

            if(hexMap[x][y]) {
                count = 0;
            }
            else {
                count++;
            }
            if (count == 3) {
                this.active = true;
                return;
            }
        }
        this.active = false;
    }

    draw() {
        
        if(this.selected) {
            drawHex(this.x, this.y, this.type + 100, 1);
            drawHexSelection(this.x, this.y, this.hovered ? 0.8 : 1);
        }
        else if(this.highlighted) {
            drawHex(this.x, this.y, this.type + 100, this.active ? 1 : 0.3);
            drawHexSelection(this.x, this.y, 0.6);
        }
        else {
            drawHex(this.x, this.y, this.type + ((this.hovered && this.active) ? 100 : 0), this.active ? 1 : this.hovered ? 0.4 : 0.3);
        }
    }

    drawHit() {
        drawHitHex(HexToCanvasX(this.x,this.y), HexToCanvasY(this.y), 34, this.colorKey);
    }

    select() {
        if(!this.active)
            return;

        //if it's gold, go for it
        if(this.type == 11) {
            this.commitSudoku();
            DeSelectAll();
            updateGame();
            return;
        }

        //if self is selected, just deselect
        if(this.selected) {
            this.deSelect();
            if(this.type == 14) {
                DeSelectAll();
            }
            return;
        }

        //if nothing is selected, just select
        if(selectedHexes.length == 0) {
            this.setSelected();
            return;
        }
        
        //if exactly one thing is selected
        if(selectedHexes.length == 1) {
            //quintessence special
            if(this.type == 14) {
                if(!(selectedHexes[0].type > 0 && selectedHexes[0].type < 5)) {
                    selectedHexes[0].deSelect();
                }
                this.setSelected();
                return;
            }

            if(selectedHexes[0].type == 14) {
                if(!(this.type > 0 && this.type < 5)) {
                    selectedHexes[0].deSelect();
                }
                this.setSelected();
                return;
            }

            if(CanHexesBePaired(this,selectedHexes[0])) {
                if((this.type > 5 && this.type < 12)
                        || (selectedHexes[0].type > 5 && selectedHexes[0].type < 12)) {
                    metalLevel++;
                }

                selectedHexes[0].commitSudoku();
                this.commitSudoku();
                DeSelectAll();
                updateGame();
                return;
            }
            else {
                selectedHexes[0].deSelect();
                this.setSelected();
            }
            return;
        }

        //more than 1 hexes selected, so quintessential is already selected

        if(!(this.type > 0 && this.type < 5 || this.type == 14)) {
            DeSelectAll();
            this.setSelected();
            return;
        }

        var selectedHexesTypes = new Array();
        selectedHexes.forEach(element => {
            selectedHexesTypes.push(element.type);
        });

        //already contains this kind, just change to this
        if(selectedHexesTypes.includes(this.type)) {
            selectedHexes[selectedHexesTypes.indexOf(this.type)].deSelect();
        }

        this.setSelected();

        selectedHexes.forEach(element => {
            selectedHexesTypes.push(element.type);
        });

        if(selectedHexesTypes.includes(1)
        && selectedHexesTypes.includes(2)
        && selectedHexesTypes.includes(3)
        && selectedHexesTypes.includes(4)
        && selectedHexesTypes.includes(14)) {
            selectedHexes.forEach(element => {
                element.commitSudoku();
            });
            DeSelectAll();
            updateGame();
        }
    }

    setSelected() {
        this.selected = true;
        selectedHexes.push(this);
    }

    deSelect() {
        this.selected = false;
        selectedHexes.splice(selectedHexes.indexOf(this),1);
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

    commitSudoku() {
        hexCounter[this.type]--;
        hexMap[this.x][this.y] = undefined;
        hexes.splice(hexes.indexOf(this),1);
        colorsHash[this.colorKey] = undefined;
    }
}