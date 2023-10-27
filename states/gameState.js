import { FighterId } from "../constants/fighter.js";
import { createFighterState } from "./fighterState.js";

export const gameState = {
    fighters: [
        createFighterState(FighterId.RYU),
        createFighterState(FighterId.KEN),
    ],
};