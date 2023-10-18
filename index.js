import { Ken } from "./fighters/ken.js";
import { Ryu } from "./fighters/ryu.js";
import { KenStage } from "./stages/ken.js";
import { FpsCounter } from "./config/fpsCounter.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection } from "./constants/fighter.js";

window.addEventListener('load', function() {
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    context.imageSmoothingEnabled = false;

    const entities = [
        new KenStage(),
        new FpsCounter(),
        new Ryu(280, STAGE_FLOOR, FighterDirection.RIGHT),
        new Ken(104, STAGE_FLOOR, FighterDirection.LEFT),
    ];

    let frameTime = {
        secondsPassed: 0,
        previous: 0,
    }

    function frame(time) {
        window.requestAnimationFrame(frame);

        frameTime = {
            secondsPassed: (time - frameTime.previous) / 1000,
            previous: time,
        }

        for (const entity of entities) {
            entity.update(frameTime, context);
        }

        for (const entity of entities) {
            entity.draw(context);
        }
    }

    window.requestAnimationFrame(frame);
});