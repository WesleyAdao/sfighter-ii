import { Camera } from "../engine/Camera.js";
import { Ken } from "../fighters/Ken.js";
import { Ryu } from "../fighters/Ryu.js";
import { Shadow } from "../constants/Shadow.js";
import { KenStage } from "../stages/Ken.js";
import { StatusBar } from "../HUD/StatusBar.js";
import { FpsCounter } from "../config/FpsCounter.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "../constants/stage.js";

export class BattleScene {
    fighters = [];
    camera = undefined;
    shadows = [];
    entities = [];

    constructor() {
        this.stage = new KenStage();

        this.fighters = this.getFightersEntities();
        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - 192, 16, this.fighters);
        this.shadows = this.fighters.map(fighter => new Shadow(fighter));
        
        this.overlays = [
            new StatusBar(this.fighters),
            new FpsCounter(),
        ];
    }

    getFightersEntities() {
        const fighterEntities = [new Ryu(0), new Ken(1)];
        
        fighterEntities[0].opponent = fighterEntities[1];
        fighterEntities[1].opponent = fighterEntities[0];
    
        return fighterEntities;
    }

    updateFighters(time, context) {
        for (const fighter of this.fighters) {
            fighter.update(time, context, this.camera);
        }
    }

    updateShadows(time, context) {
        for (const shadow of this.shadows) {
            shadow.update(time, context, this.camera);
        }
    }

    updateEntities(time, context) {
        for (const entity of this.entities) {
            entity.update(time, context, this.camera);
        }
    }

    updateOverlays(time, context) {
        for (const overlay of this.overlays) {
            overlay.update(time, context, this.camera);
        }
    }

    update(time, context) {
        this.updateFighters(time, context);
        this.updateShadows(time, context);
        this.stage.update(time);
        this.updateEntities(time, context);
        this.camera.update(time, context);
        this.updateOverlays(time, context);
    }

    drawFighters(context) {
        for (const fighter of this.fighters) {
            fighter.draw(context, this.camera);
        }
    }

    drawShadows(context) {
        for (const shadow of this.shadows) {
            shadow.draw(context, this.camera);
        }
    }

    drawEntities(context) {
        for (const entity of this.entities) {
            entity.draw(context, this.camera);
        }
    }

    drawOverlays(context) {
        for (const overlay of this.overlays) {
            overlay.draw(context, this.camera);
        }
    }

    draw(context) {
        this.stage.drawBackground(context, this.camera);
        this.drawShadows(context);
        this.drawFighters(context);
        this.drawEntities(context);
        this.stage.drawForeground(context, this.camera);
        this.drawOverlays(context);
    }
}