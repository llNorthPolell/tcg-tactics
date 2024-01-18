import { EventEmitter } from "@/game/scripts/events";
import LandmarkController from "./landmarkController";
import TurnController from "./turnController";
import UnitController from "./unitController";
import { EVENTS } from "@/game/enums/keys/events";
import Unit from "../gameobjects/units/unit";

export default class EventDispatcher {
    private landmark : LandmarkController;
    private turn : TurnController;
    private units: UnitController;

    constructor(landmark:LandmarkController,turn:TurnController,units:UnitController){
        this.landmark=landmark;
        this.turn=turn;
        this.units=units;

        this.handleEvents();
    }


    handleEvents(){
        EventEmitter
        .on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                this.turn.endTurn();
            }
        )
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            ()=>{
                
            }
        )
        .on(
            EVENTS.unitEvent.SELECT,
            (unit:Unit)=>{
                this.units.selectUnit(unit);
            }
        )
    }
}