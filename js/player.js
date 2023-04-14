import DynamicSprite from "./dynamic_sprite.js";
import Keyboard from "./keyboard.js";
import {norm} from "./vector_func.js";

export default class Player extends DynamicSprite {
    constructor(x, y, groups, collision_group) {
        super(x, y, ["idle", "walk", "fall", "idle_flip", "walk_flip", "fall_flip"],
            groups);

        // Initialize the idle data
        this.load_image("data/red");
        
        //this.load_animation("walk", "data/miner/walk", 0, 1, 1);
        //this.load_animation("fall", "data/miner/fall", 0, 1, 1);

        // Initialize the flipped animations
        //this.load_animation("idle_flip", "data/miner/idle_flip", 6, 13, 4);
        //this.load_animation("walk_flip", "data/miner/walk_flip", 0, 7, 4);
        //this.load_animation("fall_flip", "data/miner/fall_flip", 13, 18, 4);

        this.collision_group = collision_group;

        this.layer = 1;
        this.is_facing_left = false;
        this.speed = 100;
        this.jump = 250; 
        this.gravity = 500;
        this.glow_radius = 100;
        this.is_ground = false
        this.current_animation = "idle";

        // Triggers and timeouts
        this.falling_timer = Date.now();
        this.falling_timeout = 50;

        this.remaining_oil = 100;
        this.oil_drop_rate = 15;

        this.keyboard = new Keyboard();
        this.kind = "player";
    }

    update_status() {
        // Check the timeout on the falling before activating the real falling event
        var is_ground = this.is_ground;
        if (!is_ground) {
            is_ground = Date.now() - this.falling_timer < this.falling_timeout;
        }

        if (is_ground && this.velocity.x == 0)
            this.current_animation = "idle";
        else if(is_ground) 
            this.current_animation = "idle"; // Walk
        else
            this.current_animation = "idle"; // Fall

        // Flip the animation if necessary
        //if (this.is_facing_left)
        //    this.current_animation += "_flip";
    }

    update_controls() {
        //console.log(this.keyboard.keys);
        if (this.keyboard.keys["ArrowRight"]) {
            this.velocity.x = this.speed;
            this.is_facing_left = false;
        } 
        if (this.keyboard.keys["ArrowLeft"]) {
            this.velocity.x = -this.speed;
            this.is_facing_left = true;
        }

        if (!this.keyboard.keys["ArrowLeft"] && !this.keyboard.keys["ArrowRight"])
            this.velocity.x = 0;

        if (this.keyboard.keys[" "] && this.is_ground) {
            this.velocity.y = - this.jump;
        }
    }

    update(delta, dt) {
        // Call the update of the upper function
        super.update(delta, dt);

        this.update_oil(dt);

        this.update_controls();

        // Apply the horizontal moovement
        this.x += this.velocity.x * dt;
        this.update_collision(true);

        // Apply the vertical moovement
        this.y += this.velocity.y * dt;
        this.update_collision(false);

        // Change the animation to be played
        this.update_status();
    }

    update_collision(left_right = true) {
        let colliders = this.collision_group.sprites;
        var is_ground = false;
        //console.log("Colliders: ", this.collision_group.sprites);
        for (var i = 0; i < colliders.length; ++i) {
            let sprite =  colliders[i];
            if (sprite.collidewith(this)) {
                // Check for the horizontal direction
                if (left_right) {
                    if (this.velocity.x > 0) {
                        this.x = sprite.x - this.image.width;
                    } else if (this.velocity.x < 0) {
                        this.x = sprite.x + sprite.image.width;
                    }
                    this.velocity.x = 0;
                }
                else {
                    // Check for the vertical direction
                    if (this.velocity.y > 0) {
                        this.y = sprite.y - this.image.height;
                        is_ground = true;
                    } else if (this.velocity.y < 0) {
                        this.y = sprite.y + sprite.image.height;
                    }
                    this.velocity.y = 0;
                }
            }
        }

        if (this.is_ground && !is_ground) {
            this.is_ground = false;
            this.falling_timer = Date.now();
        } else {
            this.is_ground = is_ground;
        }
    }
}