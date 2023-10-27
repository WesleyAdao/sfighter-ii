import { pollGamepads, registerGamePadEvents, registerKeyboardEvents } from "../engine/inputHandler.js";
import { getContext } from "../utils/context.js";
import { BattleScene } from "../scenes/BattleScene.js";

export class StreetFighterGame {
    context = getContext();
        
    frameTime = {
        secondsPassed: 0,
        previous: 0,
    };

    constructor() {
        this.scene = new BattleScene();
    }

    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
            secondsPassed: (time - this.frameTime.previous) / 1000,
            previous: time,
        };

        pollGamepads();
        this.scene.update(this.frameTime, this.context);
        this.scene.draw(this.context);
    }

    start() {
        registerKeyboardEvents();
        registerGamePadEvents();

        window.requestAnimationFrame(this.frame.bind(this));
    }
}