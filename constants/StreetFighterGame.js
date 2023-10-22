import { Ken } from "../fighters/Ken.js";
import { Ryu } from "../fighters/Ryu.js";
import { KenStage } from "../stages/Ken.js";
import { FpsCounter } from "../config/FpsCounter.js";
import { STAGE_FLOOR } from "./../constants/stage.js";
import { FighterDirection } from "./../constants/fighter.js";
import { pollGamepads, registerGamePadEvents, registerKeyboardEvents } from "../config/inputHandler.js";
import { Shadow } from "./shadow.js";
import { StatusBar } from "../HUD/StatusBar.js";

export class StreetFighterGame {
    constructor() {
        this.context = this.getContext();
        this.fighters = [
            new Ryu(104, STAGE_FLOOR, FighterDirection.RIGHT, 0),
            new Ken(280, STAGE_FLOOR, FighterDirection.LEFT, 1),
        ];

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];
    
        this.entities = [
            new KenStage(),
            ...this.fighters.map(fighter => new Shadow(fighter)),
            ...this.fighters,
            new FpsCounter(),
            new StatusBar(this.fighters),
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

        pollGamepads();
        this.update();
        this.draw();
    }

    start() {
        registerKeyboardEvents();
        registerGamePadEvents();

        window.requestAnimationFrame(this.frame.bind(this));
    }
}