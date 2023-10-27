import { Camera } from "../engine/Camera.js";
import { Ken } from "../fighters/Ken.js";
import { Ryu } from "../fighters/Ryu.js";
import { Shadow } from "../constants/Shadow.js";
import { KenStage } from "../stages/Ken.js";
import { StatusBar } from "../HUD/StatusBar.js";
import { FpsCounter } from "../config/FpsCounter.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "../constants/stage.js";
import { gameState } from "../states/gameState.js";
import { FighterAttackBaseData, FighterAttackStrength, FighterId } from "../constants/fighter.js";
import { LightHitSplash, MediumHitSplash, HeavyHitSplash } from "../fighters/shared/index.js";

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

    getFighterEntityClass(id) {
        switch(id) {
            case FighterId.RYU:
                return Ryu;
            case FighterId.KEN:
                return Ken;
            default:
                throw new Error('Unimplemented fighter entity request!');
        }
    }

    getFighterEntity(fighterState, index) {
        const FighterEntityClass = this.getFighterEntityClass(fighterState.id);

        return new FighterEntityClass(index, this.handleAttackHit.bind(this));
    }

    getFightersEntities() {
        const fighterEntities = gameState.fighters.map(this.getFighterEntity.bind(this));
        
        fighterEntities[0].opponent = fighterEntities[1];
        fighterEntities[1].opponent = fighterEntities[0];
    
        return fighterEntities;
    }

    getHitSplahClass(strength) {
        switch (strength) {
            case FighterAttackStrength.LIGHT:
                return LightHitSplash;
            case FighterAttackStrength.MEDIUM:
                return MediumHitSplash;
            case FighterAttackStrength.HEAVY:
                return HeavyHitSplash;
            default:
                throw new Error('Unknown strength requested!');
        }
    }

    addEntity(EntityClass, ...args) {
        this.entities.push(new EntityClass(...args, this.removeEntity.bind(this)));
    }

    removeEntity(entity) {
        this.entities = this.entities.filter((thisEntity) => thisEntity !== entity);
    }

    handleAttackHit(playerId, opponentId, position, strength) {
        gameState.fighters[playerId].score += FighterAttackBaseData[strength].score;
        gameState.fighters[opponentId].hitPoints -= FighterAttackBaseData[strength].damage;

        this.addEntity(this.getHitSplahClass(strength), position.x, position.y, playerId);
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