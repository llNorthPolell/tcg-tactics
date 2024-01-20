import { CANVAS_SIZE, HAND_UI_SIZE } from "../config";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import { UI_COLORS } from "../enums/keys/uiColors";



export default class HUD extends Phaser.Scene{
    private rightPanel? :Phaser.GameObjects.Container;
    private bottomPanel? : Phaser.GameObjects.Container;

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

        const deckStatDisplay = this.game.registry.get(GAME_STATE.deckStatDisplay);
        this.rightPanel.add(deckStatDisplay);

        const cardDetails = this.game.registry.get(GAME_STATE.cardDetailsDisplay);
        this.add.existing(cardDetails);

        /*
        const discardWindow = new DiscardWindow(this);
        this.add.existing(discardWindow);
        discardWindow.hide();

        EventEmitter
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
            EVENTS.uiEvent.SHOW_DISCARD_WINDOW,
            (heroCard:HeroCard)=>{
                if (!heroCard)return;

                discardWindow!.show(heroCard);
                endTurnButton.hide();

                console.log(`End Turn button visible = ${endTurnButton.visible}`);
            }
        )
    }*/
    }
}