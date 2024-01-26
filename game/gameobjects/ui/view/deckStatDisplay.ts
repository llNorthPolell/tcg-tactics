import { CANVAS_SIZE } from "@/game/config";
import { Position } from "@/game/data/types/position";
import { ASSETS } from "@/game/enums/keys/assets";
import { UI_COLORS } from "@/game/enums/keys/uiColors";

const DECK_STAT_DISPLAY_SIZE = {
    width:  CANVAS_SIZE.width*0.12,
    height: CANVAS_SIZE.height*0.2,
}

export default class DeckStatDisplay extends Phaser.GameObjects.Container{
    private readonly deckCountText:Phaser.GameObjects.Text;
    private readonly deathCountText:Phaser.GameObjects.Text;

    constructor(        
        scene:Phaser.Scene){
        super(scene,0,CANVAS_SIZE.height*0.15);
        const bg = scene.add.rectangle(
            0,
            0,
            DECK_STAT_DISPLAY_SIZE.width,
            DECK_STAT_DISPLAY_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);
        
        const deckCountIcon = scene.add.image(
            DECK_STAT_DISPLAY_SIZE.width*0.2,
            DECK_STAT_DISPLAY_SIZE.height*0.3,
            ASSETS.DECK_COUNT
        ).setOrigin(0.5);

       this.deckCountText = scene.add.text(
            DECK_STAT_DISPLAY_SIZE.width*0.4,
            DECK_STAT_DISPLAY_SIZE.height*0.15,
            "X 0",
            {
                fontSize:50
            }
        );

        const deathCountIcon = scene.add.image(
            DECK_STAT_DISPLAY_SIZE.width*0.2,
            DECK_STAT_DISPLAY_SIZE.height*0.7,
            ASSETS.DEATH_COUNT
        ).setOrigin(0.5);

        this.deathCountText = scene.add.text(
            DECK_STAT_DISPLAY_SIZE.width*0.4,
            DECK_STAT_DISPLAY_SIZE.height*0.55,
            "X 0",
            {
                fontSize:50
            }
        );

        this.add(bg);
        this.add(deckCountIcon);
        this.add(this.deckCountText);
        this.add(deathCountIcon);
        this.add(this.deathCountText);
    }

    setDeckCount(count:number){
        this.deckCountText.setText(`X ${count}`);
    }

    setDeathCount(count:number){
        this.deathCountText.setText(`X ${count}`);
    }

}