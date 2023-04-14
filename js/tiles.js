import StaticSprite from "./static_sprite.js";

export default class Tile extends StaticSprite{
    constructor(x, y, groups = []) { 
        super(x, y, groups);
        this.is_loaded = true;
        this.kind = "tile"
    }
} 