import Tile from "./tiles.js";
import Player from "./player.js";
import * as GROUP from "./sprite_group.js";


function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

export default class World {
    constructor() {
        // Load everything
        this.player = null;
        this.tile_size = 16;

        this.camera = {
            x : 0,
            y : 0
        };

        this.camera_limits = {
            x_min : 50,
            x_max : 150,
            y_min : 50,
            y_max : 100
        };

        // Load the background
        this.background_loaded = false;
        let self = this;
        this.background_image = new Image();
        this.background_image.src = "data/background.png"
        this.background_image.addEventListener("load", function() {
            self.background_loaded = true;
        }, false);
        this.distance_factor = 0.3

        this.base_darkness = 50;
        this.paused = false;
        this.death = false;

        // Here the sprite group
        this.visible_sprites = new GROUP.LayerGroup();
        this.collision_sprites = new GROUP.Group();
        this.collectable_sprites = new GROUP.Group();

        // Load the font
        this.font_loaded = false;
        this.font = new FontFace("PressStart", "    url(data/PressStart2P-Regular.ttf)");
        this.font.load().then(function(font) {
            self.font_loaded = true;
            document.fonts.add(font);
        })



        // Load world assets
        this.sprite_size = 16;
        this.tiles_counter = 0;
        this.grounds = {
            "inner" :  new Image(),
            "left" : new Image(),
            "right" : new Image(),
            "leftright" : new Image(),
            "lefttopright" : new Image(),
            "top": new Image(),
            "topleft" : new Image(),
            "topright" : new Image()
        };

        let keys = Object.keys(this.grounds);
        this.tiles_tot = keys.length;
        for (var i = 0; i < keys.length; ++i) {
            let key = keys[i];
            this.grounds[key].src = "data/tiles/ground_" + key + ".png";
            this.grounds[key].addEventListener("load", function () {
                self.tiles_counter++;
            })
        }
        this.initialized = false;
    }

    init() {
        if (!this.initialized) {
            this.initialized = true;
            this.update_tiles_images();
        }
    }

    check_loaded() {
        if (!this.font_loaded) return false;
        if (!this.background_loaded) return false;
        if (!this.player) return false;
        if (!this.player.is_loaded) return false;

        for (var i = 0; i < this.visible_sprites.length; ++i) {
            if (!this.visible_sprites.sprites[i].is_loaded){
                return false;
            } 
        }

        // Check the tiles
        if (this.tiles_counter != this.tiles_tot) return false;

        return true;
    }

    check_death(context, canvas) {
        /*if (this.player.remaining_oil <= 0) {
            this.player.remaining_oil = 0;

            // Write the you lost at the center of the screen
            this.death = true;
            
            this.paused = true;

            console.log("DEATH!");
        }*/
    }
    init_music() {
        /*if (!this.music_playing) {
            this.music_playing = true;
            this.music.play();
        }*/
    }

    update(time, dt) {
        // Check if we need to initialize the music
        this.init_music();

        // Update everything
        if (!this.paused) {
            this.visible_sprites.update(time, dt);
            //this.player.update(time, dt);

            // Update the collectables
            this.update_collectable();

            // Update the camera
            this.update_camera();
        }

        this.check_death();
    }

    update_collectable() {
        let remove_sprite = null;
        for (var i = 0; i < this.collectable_sprites.sprites.length; ++i) {
            let sprite = this.collectable_sprites.sprites[i];
            if (sprite.collidewith(this.player)) {
                // Update the player oil
                //this.player.remaining_oil += sprite.oil;
                //this.collect_audio.play();
                sprite.kill();
            }
        }
    }

    update_camera() {
        var deltax = this.player.x - this.camera.x;
        var deltay = this.player.y - this.camera.y;
        if (deltax > this.camera_limits.x_max) {
            this.camera.x = this.player.x - this.camera_limits.x_max;
        }
        else if  (deltax < this.camera_limits.x_min) {
            this.camera.x = this.player.x - this.camera_limits.x_min;
        }


        if (deltay > this.camera_limits.y_max) {
            this.camera.y = this.player.y - this.camera_limits.y_max;
        }
        else if  (deltay < this.camera_limits.y_min) {
            this.camera.y = this.player.y - this.camera_limits.y_min;
        }
    }

    draw_text(context, text, x, y, size = "16px", text_align = "center", color = "#ffffff") {
        context.font = size + " PressStart";
        context.textAlign = text_align;
        context.fillStyle = color;
        context.fillText(text, x, y);
    }

    draw_background(context, canvas) {
        let bkg_width = this.background_image.width;
        let bkg_height = this.background_image.height;

        var ox = -this.camera.x * this.distance_factor;
        var oy =  -this.camera.y * this.distance_factor;
        ox = ox % bkg_width - bkg_width;
        oy = oy % bkg_height - bkg_height;

        var sx = ox;

        while (sx < canvas.width) {
            var sy = oy;
            while(sy < canvas.width) {
                context.drawImage(this.background_image, Math.floor(sx), Math.floor(sy));
                sy += bkg_height;
            }
            sx += bkg_width;
        }
    }

    /*draw_glowing_circle(position, radius, ghost_context) {
        var length = 20;
        var light = 0;

        let self = this; 

        function glowing_color(r) {
            var x = 0;
            if (radius > 0) x = r/radius;
            
            var linear = (1 - x);
            var sqrt = Math.sqrt(1 - x);
            var factor = .7 * linear + .3 * sqrt;
            return self.base_darkness + (255 - self.base_darkness) * factor; 
        }
        
        for ( var i = 0; i < length; ++i) {
            var r = (length - i) * radius / length;
            var color = Math.floor(glowing_color(r));
            //if (color < this.base_darkness) color = this.base_darkness;

            ghost_context.fillStyle = rgb(color, color, color);
            ghost_context.beginPath();
            ghost_context.arc(Math.floor(position.x - this.camera.x), 
                Math.floor(position.y - this.camera.y), Math.floor(r), 0, 2 * Math.PI);
            ghost_context.fill();
        }

    }*/

    /*draw_all_glowing(context, canvas) {

        // Apply the glowing circle to the canvas
        //let ghost_canvas = document.getElementById("ghost");
        let ghost_canvas = this.ghost_canvas;
        ghost_canvas.width = canvas.width;
        ghost_canvas.height = canvas.height;
        const ghost_context = ghost_canvas.getContext("2d");
        ghost_context.fillStyle = rgb(this.base_darkness, this.base_darkness, this.base_darkness); // Fill with dark gray 
        ghost_context.fillRect(0,0, ghost_canvas.width, ghost_canvas.height);

        ghost_context.globalCompositeOperation = "lighten"
        this.draw_glowing_circle(this.player.center, this.glow_oil_factor * this.player.remaining_oil, ghost_context);

        
        for (var i = 0; i < this.collectable_sprites.sprites.length; ++i) {
            let lamp = this.collectable_sprites.sprites[i];
            this.draw_glowing_circle(lamp.center, lamp.oil * this.glow_oil_factor, ghost_context);
        }

        context.globalCompositeOperation = "multiply";
        context.drawImage(ghost_canvas, 0, 0);
        context.globalCompositeOperation = "source-over";
    }*/

    draw(context, canvas) {
       
        // Clear all
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background 
        this.draw_background(context, canvas);



        // Draw everything
        this.visible_sprites.draw(context, this.camera);
        
        //this.draw_all_glowing(context, canvas);

        // Draw the death
        if (this.death) {
            this.draw_text(context, "You lost!", 
                canvas.width / 2, canvas.height / 2);
        }
    }

    update_tiles_images() {
        // Update the images of the tiles to have the correct contours
        for (var i = 0; i < this.collision_sprites.length; ++i) {
            let tile = this.collision_sprites.sprites[i];
            if (tile.kind !== "tile") continue;

            var has_left = false;
            var has_right = false;
            var has_top = false;
            //this.collectable_sprites.length

            for (var j = 0; j  < this.collision_sprites.length; ++j) {
                let secondtile = this.collision_sprites.sprites[j];
                if (secondtile.kind !== "tile") continue;

                var delta_x = tile.x - secondtile.x;
                var delta_y = tile.y - secondtile.y;



                if (delta_x === this.tile_size && delta_y === 0) {
                    has_left = true;
                } else if (delta_x === - this.tile_size && delta_y === 0) {
                    has_right = true;
                }

                if (delta_y === this.tile_size && delta_x === 0) {
                    has_top = true;
                }
                //if (j == 13) {
                //    console.log("TX: ", delta_x, " TY: ", delta_y, " (", tile.x, ",",tile.y,")",  " (", secondtile.x, ",", secondtile.y,")");
                //    console.log("i:", i, "j:", j, "L:", has_left, " T:", has_top, " R :", has_right);
                //}      
            }

            if (has_left && has_right && has_top) 
                tile.image = this.grounds["inner"];
            else if (has_left && has_top)
                tile.image = this.grounds["right"];
            else if (has_right && has_top)
                tile.image = this.grounds["left"];
            else if (has_left && !has_top && !has_right)
                tile.image = this.grounds["topright"];
            else if (has_right && !has_top && !has_left)
                tile.image = this.grounds["topleft"];
            else if (has_top && !has_left && !has_right) 
                tile.image = this.grounds["leftright"];
            else if (!has_top && !has_left && !has_right)
                tile.image = this.grounds["lefttopright"];
            else if (!has_top)
                tile.image = this.grounds["top"];
            else
                tile.image = this.grounds["inner"];
        }
    }

    create_world(level) {
        var textname = "data/world/level_" + level + ".txt";
        console.log("Creating the world!");

        fetch(textname).then(response => response.text()).then(text => {
            console.log("Reading text");

            var row_index = 0;
            var col_index = 0;
            console.log("text lenght:" + text.length)
            for (let total_index = 0; total_index < text.length; total_index++) {
                // Get the map item
                var item_str = text.charAt(total_index);

                // Get the newline
                if (item_str == "\n") {
                    row_index = 0;
                    col_index += 1;
                    continue;
                }

                var x = this.tile_size * row_index;
                var y = this.tile_size * col_index;


                // Analize the map character
                if (item_str === "1") {
                    let tile = new Tile(x, y, [ this.visible_sprites,  this.collision_sprites]);
                } else if (item_str === "P") {
                    this.player = new Player(x, y, [this.visible_sprites], this.collision_sprites);
                } /*else if (item_str === "L") {
                    let lamp = new Lamp(x, y, [this.visible_sprites, this.collectable_sprites]);
                }*/

                row_index++;
            }

            this.player.collision_group = this.collision_sprites;
        });
    }
}