import { EventEmitter } from "@/game/scripts/events";
import LandmarkController from "./landmarkController";
import TurnController from "./turnController";
import UnitController from "./unitController";
import { EVENTS } from "@/game/enums/keys/events";
import Unit from "../gameobjects/units/unit";
import SelectionTileController from "./selectionTileController";
import { Position } from "../data/types/position";
import EffectSystem from "../effectSystem";
import GamePlayer from "../gameobjects/player/gamePlayer";

export default class EventDispatcher {
    private readonly turn : TurnController;
    private readonly landmarks : LandmarkController;
    private readonly units: UnitController;
    private readonly selectionTiles:SelectionTileController;
    private readonly effects : EffectSystem;

    constructor(landmarks:LandmarkController,
                turn:TurnController,
                units:UnitController,
                selectionTiles:SelectionTileController,
                effects : EffectSystem){
        this.landmarks=landmarks;
        this.turn=turn;
        this.units=units;
        this.selectionTiles=selectionTiles;
        this.effects=effects;

        this.handleEvents();
    }


    handleEvents(){
        EventEmitter
        .on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                const activePlayer = this.turn.getActivePlayer();
                    if (activePlayer){
                    // TODO: Ensure unit GO updates when changing active
                    this.units.getUnitsByPlayerId(activePlayer.id)!.forEach(unit=> {
                        if(!unit.isActive()) return;
                        unit.setActive(false);
                        console.log(`${unit.name} has not moved, so it was set to inactive...`);
                    });
                    this.effects.onTurnEnd(activePlayer);
                }
                this.turn.endTurn();
            }
        )
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (activePlayer:GamePlayer)=>{
                this.landmarks.updateLandmarks();
                this.effects.onTurnStart(activePlayer);

                if (!activePlayer.isDevicePlayer)
                    this.turn.pass(activePlayer.id);
            }
        )
        .on(
            EVENTS.unitEvent.SELECT,
            (unit:Unit)=>{
                this.units.selectUnit(unit);
                //this.selectionTiles.show();
            }
        )
        .on(
            EVENTS.unitEvent.MOVE,
            (destination:Position)=>{
                const selected= this.units.getSelected();
                selected?.position()?.moveTo(destination);
            }
        )
        .on(
            EVENTS.unitEvent.WAIT,
            ()=>{
                const selected= this.units.getSelected();
                selected?.position()?.confirm();
                this.selectionTiles.hide();
            }
        )
        .on(
            EVENTS.unitEvent.CANCEL,
            ()=>{
                const selected= this.units.getSelected();
                selected?.position()?.cancel();
                this.selectionTiles.hide();
            }
        )
    }
}