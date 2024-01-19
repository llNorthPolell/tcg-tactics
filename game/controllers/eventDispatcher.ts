import { EventEmitter } from "@/game/scripts/events";
import LandmarkController from "./landmarkController";
import TurnController from "./turnController";
import UnitController from "./unitController";
import { EVENTS } from "@/game/enums/keys/events";
import Unit from "../gameobjects/units/unit";
import SelectionTileController from "./selectionTileController";
import { Position } from "../data/types/position";
import EffectSystem from "../system/effectSystem";
import GamePlayer from "../gameobjects/player/gamePlayer";
import CardController from "./cardController";
import Card from "../gameobjects/cards/card";
import MainGameController from "./mainGameController";
import UIController from "./uiController";

export default class EventDispatcher {
    private readonly main:MainGameController;
    private readonly ui:UIController;

    constructor(scene:Phaser.Scene,
        main:MainGameController,
        ui:UIController){
        this.main = main;
        this.ui= ui;
        this.handleEvents();
    }


    handleEvents(){
        this.handleGameEvents();
        this.handleCardEvents();
        this.handleUnitEvents();
    }


    handleGameEvents(){
        EventEmitter
        .on(
            EVENTS.gameEvent.START_GAME,
            ()=>{
                this.main.startGame();
            }
        )
        .on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                this.main.endTurn();
                this.ui.handleEndTurn();
            }
        )
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (activePlayer:GamePlayer)=>{
                this.main.startTurn(activePlayer);
                this.ui.handlePlayerTurn(activePlayer);
            }
        )
    }

    handleCardEvents(){
        EventEmitter
        .on(
            EVENTS.cardEvent.SELECT,
            (card:Card)=>{
                this.main.selectCard(card);
                this.ui.handleSelectCard(card);
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                this.main.cancelCard();
                this.ui.handleCancelCard();
            }
        )
    }


    handleUnitEvents(){
        EventEmitter
        .on(
            EVENTS.unitEvent.SELECT,
            (unit:Unit)=>{
                this.main.cancelUnitMove();
                this.main.selectUnit(unit);
                this.ui.handleSelectUnit(this.main.getActivePlayer(),unit);
            }
        )
        .on(
            EVENTS.unitEvent.MOVE,
            (destination:Position)=>{
                this.main.moveUnitTo(destination);
            }
        )
        .on(
            EVENTS.unitEvent.WAIT,
            ()=>{
                this.main.waitUnit();
                this.ui.handleDeselectUnit();
            }
        )
        .on(
            EVENTS.unitEvent.CANCEL,
            ()=>{
                this.main.cancelUnitMove();
                this.ui.handleDeselectUnit();
            }
        )
    }


}