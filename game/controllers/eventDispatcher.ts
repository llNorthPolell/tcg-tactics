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
import { CARD_TYPE } from "../enums/keys/cardType";

export default class EventDispatcher {
    private readonly scene: Phaser.Scene;
    private readonly turn : TurnController;
    private readonly landmarks : LandmarkController;
    private readonly units: UnitController;
    private readonly selectionTiles:SelectionTileController;
    private readonly cards: CardController;
    private readonly effects : EffectSystem;

    constructor(scene:Phaser.Scene,
                landmarks:LandmarkController,
                turn:TurnController,
                units:UnitController,
                selectionTiles:SelectionTileController,
                cards:CardController,
                effects : EffectSystem){
        this.scene=scene;
        this.landmarks=landmarks;
        this.turn=turn;
        this.units=units;
        this.selectionTiles=selectionTiles;
        this.cards=cards;
        this.effects=effects;

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
                const playersInGame = this.turn.getPlayersInGame();
                playersInGame.forEach(
                    (player:GamePlayer)=>{
                        for (let i=0;i<2;i++)
                            this.cards.drawCard(player);

                        console.log(`${player.name}: ${JSON.stringify(this.cards.getHand(player).map(card=>card.name))}`);
                    }
                )
                this.turn.endTurn();
            }
        )
        .on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                console.log("End Turn");
                const activePlayer = this.turn.getActivePlayer();

                // TODO: Ensure unit GO updates when changing active
                this.units.getUnitsByPlayerId(activePlayer.id)!.forEach(unit => {
                    if (!unit.isActive()) return;
                    unit.setActive(false);
                    console.log(`${unit.name} has not moved, so it was set to inactive...`);
                });
                this.effects.onTurnEnd(activePlayer);

                this.turn.endTurn();
            }
        )
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (activePlayer:GamePlayer)=>{
                console.log(`${activePlayer.name}'s turn`);
                this.cards.drawCard(activePlayer);
                this.landmarks.updateLandmarks();
                this.effects.onTurnStart(activePlayer);

                if (!activePlayer.isDevicePlayer)
                    // TODO: Currently make other players pass after 3 seconds for testing purposes. Add AI later.
                    this.scene.time.addEvent({
                        delay: 3000, callback: ()=>{
                            this.turn.pass(activePlayer.id);
                        }
                    })
            }
        )
    }

    handleCardEvents(){
        EventEmitter
        .on(
            EVENTS.cardEvent.SELECT,
            (card:Card)=>{
                const activePlayer = this.turn.getActivePlayer();
                this.cards.selectCard(card);
                if (card.cardType!==CARD_TYPE.spell)
                    this.selectionTiles.showRallyPoints(activePlayer);
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                this.cards.deselectCard();
                this.selectionTiles.hide();
            }
        )
    }


    handleUnitEvents(){
        EventEmitter
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