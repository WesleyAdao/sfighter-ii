import { Ken } from "./../fighters/ken.js";
import { Ryu } from "./../fighters/ryu.js";
import { KenStage } from "./../stages/ken.js";
import { FpsCounter } from "./../config/fpsCounter.js";
import { STAGE_FLOOR } from "./../constants/stage.js";
import { FighterDirection } from "./../constants/fighter.js";

export class StreetFighterGame {
    constructor() {
        this.context = this.getContext();
        this.fighters = [
            new Ryu(104, STAGE_FLOOR, FighterDirection.RIGHT),
            new Ken(280, STAGE_FLOOR, FighterDirection.LEFT),
        ];
    
        this.entities = [
            new KenStage(),
            ...this.fighters,
            new FpsCounter(),
        ];
    
        this.frameTime = {
            secondsPassed: 0,
            previous: 0,
        };
    }

    getContext() {
        const canvasEl = document.querySelector('canvas');
        const context = canvasEl.getContext('2d');

        context.imageSmoothingEnabled = false;

        return context;
    }

    update() {
        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context);
        }
    }

    draw() {
        for (const entity of this.entities) {
            entity.draw(this.context);
        }
    }

    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
            secondsPassed: (time - this.frameTime.previous) / 1000,
            previous: time,
        }

        this.update();
        this.draw();
    }

    start() {
        window.requestAnimationFrame(this.frame.bind(this));
    }
}