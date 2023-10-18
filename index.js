import { Ken } from "./fighters/ken.js";
import { Ryu } from "./fighters/ryu.js";
import { KenStage } from "./stages/ken.js";
import { FpsCounter } from "./config/fpsCounter.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection, FighterState } from "./constants/fighter.js";

function populateMoveDropdown() {
    const dropdown = document.getElementById('state-dropdown');

    Object.entries(FighterState).forEach(([, value]) => {
        const option = document.createElement('option');
        option.setAttribute('value', value);
        option.innerText = value;
        dropdown.appendChild(option);
    });
}

function handleFormSubmit(event, fighters) {
    event.preventDefault();

    const selectedCheckboxes = Array.
    from(event.target.querySelectorAll('input:checked'))
    .map(checkbox => checkbox.value);

    const options = event.target.querySelector('select');

    fighters.forEach(fighter => {
        if (selectedCheckboxes.includes(fighter.name)) {
            fighter.changeState(options.value);
        }
    })
}

window.addEventListener('load', function() {
    populateMoveDropdown();
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    context.imageSmoothingEnabled = false;

    const fighters = [
        new Ryu(104, STAGE_FLOOR, FighterDirection.RIGHT),
        new Ken(280, STAGE_FLOOR, FighterDirection.LEFT),
    ];

    const entities = [
        new KenStage(),
        new FpsCounter(),
        ...fighters,
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

    this.document.addEventListener('submit', (event) => handleFormSubmit(event, fighters));

    window.requestAnimationFrame(frame);
});