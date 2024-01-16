import { CANVAS_SIZE, HAND_UI_SIZE } from "../config";
import { CardData } from "../data/cardData";
import { EVENTS } from "../enums/keys/events";
import { GAME_CONSTANT } from "../enums/keys/gameConstants";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import { UI_COLORS } from "../enums/keys/uiColors";
import { Card } from "../gameobjects/cards/card";
import HeroCard from "../gameobjects/cards/heroCard";
import GamePlayer from "../gameobjects/gamePlayer";
import Button from "../gameobjects/ui/button";
import CardDetailsDisplay from "../gameobjects/ui/cardDetailsDisplay";
import DeckStatDisplay from "../gameobjects/ui/deckStatDisplay";
import DiscardWindow from "../gameobjects/ui/discardWindow";
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

        // Card Details
        const cardDetails = new CardDetailsDisplay(this);
        cardDetails.hide();
        this.add.existing(cardDetails);

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

        const discardWindow = new DiscardWindow(this);
        this.add.existing(discardWindow);
        discardWindow.hide();

        EventEmitter
        .on(
            EVENTS.cardEvent.SELECT,
            (card:Card<CardData>)=>{
                cardDetails.hide();
                cancelCardButton.show();
                if(this.isPlayerTurn) 
                    endTurnButton.hide();
                cardDetails.show(card);
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                cancelCardButton.hide();
                if(this.isPlayerTurn) 
                    endTurnButton.show();
                cardDetails.hide();
            }
        )
        .on(
            EVENTS.cardEvent.CONFIRM_DISCARD,
            ()=>{
                endTurnButton.show();
                handUIObject.setDiscardMode(false);
            }
        )
        .on(
            EVENTS.uiEvent.UPDATE_HAND,
            (hand:Card<CardData>[], heroCard:HeroCard)=>{
                if (heroCard && hand.length === GAME_CONSTANT.MAX_HAND_SIZE) 
                    handUIObject.setDiscardMode(true);
                else
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
                if (unitStatDisplay.visible)
                    unitStatDisplay.update();
            }
        )
        .on(
            EVENTS.uiEvent.SHOW_DISCARD_WINDOW,
            (heroCard:HeroCard)=>{
                if (!heroCard)return;

                discardWindow!.show(heroCard);
                endTurnButton.hide();

                console.log(`End Turn button visible = ${endTurnButton.visible}`);
            }
        )
        .on(
            EVENTS.unitEvent.CANCEL,
            ()=>{
                console.log(`Cancel`);
                handUIObject.setVisible(true);
                unitStatDisplay.hide();
            }
        )
        .on(
            EVENTS.unitEvent.WAIT,
            ()=>{
                console.log(`Wait`);
                handUIObject.setVisible(true);
                unitStatDisplay.hide();
            }
        )
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (_playerId: number, _activePlayerIndex:number, isDevicePlayerTurn: boolean)=>{
                if (!isDevicePlayerTurn) return;
                this.wake();
                if (!handUIObject.getDiscardMode())
                    endTurnButton.show();
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