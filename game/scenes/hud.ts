import { CANVAS_SIZE, HAND_UI_SIZE } from "../config";
import { CardData } from "../data/cardData";
import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import { UI_COLORS } from "../enums/keys/uiColors";
import { Card } from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/gamePlayer";
import Button from "../gameobjects/ui/button";
import DeckStatDisplay from "../gameobjects/ui/deckStatDisplay";
import HandUIObject from "../gameobjects/ui/handUIObject";
import ResourceDisplay from "../gameobjects/ui/resourceDisplay";
import UnitStatDisplay from "../gameobjects/ui/unitStatDisplay";
import Unit from "../gameobjects/unit";
import CardManager from "../scripts/cardManager";
import { EventEmitter } from "../scripts/events";

const HUD_BUTTON_SIZE = {
    width:200,
    height:50
}

export default class HUD extends Phaser.Scene{
    private rightPanel? :Phaser.GameObjects.Container;
    private bottomPanel? : Phaser.GameObjects.Container;
    private resourceDisplay? : ResourceDisplay;
    private deckStatDisplay?: DeckStatDisplay;

    private player?: GamePlayer;

    private cardManager? : CardManager;
    private isPlayerTurn:boolean;

    constructor(){
        super({
            key: SCENES.HUD
        });
        this.isPlayerTurn=false;
    }

    preload(){}

    create(){
        const player = this.game.registry.get(GAME_STATE.player) as GamePlayer;
        this.player = player;
        
        this.bottomPanel = this.add.container(0,CANVAS_SIZE.height*0.8);
        this.rightPanel = this.add.container(CANVAS_SIZE.width*0.87,0);

        this.cardManager = new CardManager(player);
        
        // bottom panel
        const bg = this.add.rectangle(
            0,
            0,
            HAND_UI_SIZE.width, 
            HAND_UI_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);
        this.bottomPanel.add(bg);
        
        //      hand 
        const handUIObject = new HandUIObject(this);
        this.add.existing(handUIObject);
        this.bottomPanel.add(handUIObject);

        const cancelCardButton = new Button(
            this,
            "cancelCardButton",
            "Cancel",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.5},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.cancel,
            ()=>{cancelCardButton?.bg.setFillStyle(UI_COLORS.cancelLight)},
            ()=>{
                cancelCardButton?.bg.setFillStyle(UI_COLORS.cancel);
                EventEmitter.emit(EVENTS.cardEvent.CANCEL);
            });
        handUIObject.add(cancelCardButton);
        cancelCardButton.hide();

        const endTurnButton = new Button(
            this,
            "endTurnButton",
            "End Turn",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.1},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.action,
            ()=>{endTurnButton?.bg.setFillStyle(UI_COLORS.actionLight)},
            ()=>{
                endTurnButton?.bg.setFillStyle(UI_COLORS.action);
                EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
            });
        handUIObject.add(endTurnButton);

        //      unit display 
        const unitStatDisplay = new UnitStatDisplay(this);
        this.add.existing(unitStatDisplay);
        this.bottomPanel.add(unitStatDisplay);

        const cancelUnitSelectionButton = new Button(
            this,
            "cancelUnitButton",
            "Cancel",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.5},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.cancel,
            ()=>{cancelCardButton?.bg.setFillStyle(UI_COLORS.cancelLight)},
            ()=>{
                cancelCardButton?.bg.setFillStyle(UI_COLORS.cancel);
                EventEmitter.emit(EVENTS.unitEvent.CANCEL);
            });
        unitStatDisplay.add(cancelUnitSelectionButton);

        const waitButton = new Button(
            this,
            "waitButton",
            "Wait",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.1},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.action,
            ()=>{waitButton?.bg.setFillStyle(UI_COLORS.actionLight)},
            ()=>{
                waitButton?.bg.setFillStyle(UI_COLORS.action);
                EventEmitter.emit(EVENTS.unitEvent.WAIT);
            });
        unitStatDisplay.add(waitButton);

        unitStatDisplay.hide();

        // right panel
        this.resourceDisplay = new ResourceDisplay(
            this, 
            {x:0,y:CANVAS_SIZE.height*0.39}
        );

        this.rightPanel.add(this.resourceDisplay);

        this.deckStatDisplay = new DeckStatDisplay(
            this,
            {x:0,y:CANVAS_SIZE.height*0.15}
        )

        this.rightPanel.add(this.deckStatDisplay);

        EventEmitter
        .on(
            EVENTS.cardEvent.SELECT,
            ()=>{
                cancelCardButton.show();
                if(this.isPlayerTurn) 
                    endTurnButton.hide();
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                cancelCardButton.hide();
                if(this.isPlayerTurn) 
                    endTurnButton.show();
            }
        )
        .on(
            EVENTS.uiEvent.UPDATE_HAND,
            (hand:Card<CardData>[])=>{
                handUIObject.render(hand);
            }
        )
        .on(
            EVENTS.unitEvent.SELECT,
            (unit:Unit)=>{
                EventEmitter.emit(EVENTS.cardEvent.CANCEL);
                handUIObject.setVisible(false);
                unitStatDisplay.show(unit);

                if (!unit.isActive() || unit.getOwner() != this.player)
                    waitButton.hide();
                else    
                    waitButton.show();
            }
        )
        .on(
            EVENTS.uiEvent.UPDATE_UNIT_STAT_DISPLAY,
            ()=>{
                unitStatDisplay.update();
            }
        )
        .on(
            EVENTS.unitEvent.CANCEL,
            ()=>{
                handUIObject.setVisible(true);
                unitStatDisplay.hide();
            }
        )
        .on(
            EVENTS.unitEvent.WAIT,
            ()=>{
                handUIObject.setVisible(true);
                unitStatDisplay.hide();
            }
        )
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (_playerId: number, _activePlayerIndex:number, isDevicePlayerTurn: boolean)=>{
                if (!isDevicePlayerTurn) return;
                this.wake();
                endTurnButton.setVisible(true);
            }
        )
        .on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                this.sleep();
                endTurnButton.setVisible(false);
            }
        );

        // TODO: This is a temporary place to draw cards. Should trigger an event somewhere to initialize drawing cards and choosing redraws when game starts.
        this.cardManager.drawCard();
        this.cardManager.drawCard();
        this.cardManager.drawCard();
    }

    sleep(){
        this.isPlayerTurn=false;
    }

    wake(){
        this.isPlayerTurn=true;
    }
    
    update(){

    }
}