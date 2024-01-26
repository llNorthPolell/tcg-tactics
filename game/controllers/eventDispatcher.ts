import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import Unit from "../gameobjects/units/unit";
import { Position } from "../data/types/position";
import GamePlayer from "../gameobjects/player/gamePlayer";
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
        this.handleUIEvents();
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
            EVENTS.cardEvent.DRAW,
            (card:Card)=>{
                // TODO: This will be called if opponent draws cards...
                this.ui.handleDrawCard(card);
            }
        )
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
        .on(
            EVENTS.cardEvent.PLAY,
            (target:Unit|Position)=>{
                try{
                    this.main.playCard(target);
                    this.ui.handlePlayCard();
                }
                catch(error){
                    console.log((error as Error).message);
                    return false;
                }
            }
        )
    }


    handleUnitEvents(){
        EventEmitter
        .on(
            EVENTS.unitEvent.SELECT,
            (unit:Unit)=>{
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
        .on(
            EVENTS.unitEvent.ATTACK,
            (defender:Unit)=>{
                this.main.attackUnit(defender);
                this.ui.handleDeselectUnit();
            }
        )
        .on(
            EVENTS.unitEvent.DEATH,
            (unit:Unit)=>{
                this.main.killUnit(unit);
                this.ui.handleKillUnit(unit);
            }
        )
    }

    handleUIEvents(){
        EventEmitter
        .on(
            EVENTS.uiEvent.HANDLE_DISCARD,
            (heroCard:Card)=>{
                this.ui.setDiscardMode(heroCard);
            }
        )
        .on(
            EVENTS.cardEvent.SELECT_DISCARD,
            (discard:Card)=>{
                this.ui.handleSelectDiscard(discard);
            }
        )
        .on(
            EVENTS.cardEvent.CONFIRM_DISCARD,
            (heroCard:Card,discard:Card)=>{
                this.main.confirmDiscard(heroCard,discard);
                this.ui.handleConfirmDiscard(heroCard,discard);
            }
        )
    }
}