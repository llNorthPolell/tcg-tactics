import { CANVAS_SIZE, HAND_UI_SIZE } from "../config";
import { DEPENDENCIES } from "../enums/keys/dependencies";
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
        const turn = this.game.registry.get(DEPENDENCIES.turnController);
             
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
        const handUIObject = this.game.registry.get(DEPENDENCIES.handUIObject);
        this.bottomPanel.add(handUIObject);

        const endTurnButton = this.game.registry.get(DEPENDENCIES.endTurnButton);
        this.bottomPanel.add(endTurnButton);

        
        //      unit display 
        const unitStatDisplay = this.game.registry.get(DEPENDENCIES.unitStatDisplay);
        this.bottomPanel.add(unitStatDisplay);

        const unitControlsPanel = this.game.registry.get(DEPENDENCIES.unitControlsPanel);
        unitStatDisplay.add(unitControlsPanel);
        unitStatDisplay.hide();
  
 
        // right panel
        const resourceDisplay = this.game.registry.get(DEPENDENCIES.resourceDisplay);
        this.rightPanel.add(resourceDisplay);       

        const deckStatDisplay = this.game.registry.get(DEPENDENCIES.deckStatDisplay);
        this.rightPanel.add(deckStatDisplay);

        const cardDetails = this.game.registry.get(DEPENDENCIES.cardDetailsDisplay);
        this.add.existing(cardDetails);

        
        // other
        const discardWindow = this.game.registry.get(DEPENDENCIES.discardWindow);
        this.add.existing(discardWindow);
    }
}