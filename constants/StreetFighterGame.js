import { Ken } from "../fighters/Ken.js";
import { Ryu } from "../fighters/Ryu.js";
import { KenStage } from "../stages/Ken.js";
import { FpsCounter } from "../config/FpsCounter.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "./../constants/stage.js";
import { pollGamepads, registerGamePadEvents, registerKeyboardEvents } from "../engine/inputHandler.js";
import { Shadow } from "./shadow.js";
import { StatusBar } from "../HUD/StatusBar.js";
import { Camera } from "../engine/Camera.js";
import { getContext } from "../utils/context.js";

export class StreetFighterGame {
    constructor() {
        this.context = getContext();
        this.fighters = [new Ryu(0), new Ken(1)];
        this.stage = new KenStage();

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];
    
        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - (this.context.canvas.width / 2), 16, this.fighters);

        this.entities = [
            ...this.fighters.map(fighter => new Shadow(fighter)),
            ...this.fighters,
        ];

        this.overlays = [
            new StatusBar(this.fighters),
            new FpsCounter(),
        ]
    
        this.frameTime = {
            secondsPassed: 0,
            previous: 0,
        };
    }

    update() {
        this.camera.update(this.frameTime, this.context);
        this.stage.update(this.frameTime, this.context);

        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context, this.camera);
        }

        for (const overlay of this.overlays) {
            overlay.update(this.frameTime, this.context, this.camera);
        }
    }

    draw() {
        this.stage.drawBackground(this.context, this.camera);

        for (const entity of this.entities) {
            entity.draw(this.context, this.camera);
        }

        this.stage.drawForeground(this.context, this.camera);

        for (const overlay of this.overlays) {
            overlay.draw(this.context, this.camera);
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