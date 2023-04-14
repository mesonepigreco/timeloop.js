import DynamicSprite from "./dynamic_sprite.js";

export default class StaticSprite extends DynamicSprite {
    constructor(x, y, groups) {
        super(x, y, ["idle"], groups);
        this.kind = "static";
        this.original_pos = {
            x : x,
            y : y
        }
    }

    load_image(path) {
        var self = this;
        function check_loaded() {
            self.is_loaded = true;
            self.image = self.animations["idle"][0];
        }

        this.load_frame(check_loaded, path, "idle");
    }

    update(time, dt) {
        //super.update(time, dt);
        //this.image = self.animations["idle"][0];

        // Reset the initial position
        //this.x = this.original_pos.x;
        //this.y = this.original_pos.y;
    }
}