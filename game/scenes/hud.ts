import { CANVAS_SIZE, HAND_UI_SIZE, HUD_BUTTON_SIZE } from "../config";
import { EVENTS } from "../enums/keys/events";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import { UI_COLORS } from "../enums/keys/uiColors";
import GamePlayer from "../gameobjects/player/gamePlayer";
import Button from "../gameobjects/ui/view/button";
import DeckStatDisplay from "../gameobjects/ui/view/deckStatDisplay";
import { EventEmitter } from "../scripts/events";



export default class HUD extends Phaser.Scene{
    private rightPanel? :Phaser.GameObjects.Container;
    private bottomPanel? : Phaser.GameObjects.Container;
    private deckStatDisplay?: DeckStatDisplay;

    constructor(){
        super({
            key: SCENES.HUD
        });
    }

    preload(){}

    create(){
        const turn = this.game.registry.get(GAME_STATE.turnController);
             
        this.bottomPanel = this.add.container(0,CANVAS_SIZE.height*0.8);
        this.rightPanel = this.add.container(CANVAS_SIZE.width*0.87,0);

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
        const handUIObject = this.game.registry.get(GAME_STATE.handUIObject);
        this.bottomPanel.add(handUIObject);

        const endTurnButton = this.game.registry.get(GAME_STATE.endTurnButton);
        this.bottomPanel.add(endTurnButton);

        
        //      unit display 
        const unitStatDisplay = this.game.registry.get(GAME_STATE.unitStatDisplay);
        this.bottomPanel.add(unitStatDisplay);

        const unitControlsPanel = this.game.registry.get(GAME_STATE.unitControlsPanel);
        unitStatDisplay.add(unitControlsPanel);
        

        unitStatDisplay.hide();
  
 
        // right panel
        const resourceDisplay = this.game.registry.get(GAME_STATE.resourceDisplay);
        this.rightPanel.add(resourceDisplay);       


        EventEmitter
        .on(
            EVENTS.cardEvent.SELECT,
            ()=>{
                //cardDetails.hide();

                //cardDetails.show(card);
            }
        )
        .on(
            EVENTS.uiEvent.UPDATE_UNIT_STAT_DISPLAY,
            ()=>{
                if (unitStatDisplay.visible)
                    unitStatDisplay.update();
            }
        )



       



        /*// Card Details
        const cardDetails = new CardDetailsDisplay(this);
        cardDetails.hide();
        this.add.existing(cardDetails);

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
*/
    }
}