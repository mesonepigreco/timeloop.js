export class Group {
    constructor() {
        this.sprites = [];
    }

    add(sprite) {
        this.sprites.push(sprite);
    }

    get length() {
        return this.sprites.length;
    }

    draw(context, camera) {
        for (var i = 0; i < this.sprites.length; ++i) {
            let sprite = this.sprites[i];
            sprite.draw(context, camera);
        }
    }

    update(time, dt) {
        for (var i = 0; i < this.sprites.length; ++i) {
            let sprite = this.sprites[i];
            sprite.update(time, dt);
        }
    }
}

export class LayerGroup extends Group {
    constructor() {
        super();
    }

    draw(context, camera) {
        // Sort the sprites by the layer
        function sort_by_layer(a, b) {
            if (a.layer < b.layer) return -1;
            if (a.layer > b.layer) return 1;
            return 0;
        };
        this.sprites.sort(sort_by_layer);

        super.draw(context, camera);
    }
}