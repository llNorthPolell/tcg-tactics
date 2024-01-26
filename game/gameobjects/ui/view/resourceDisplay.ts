import { CANVAS_SIZE } from "@/game/config";
import { ASSETS } from "@/game/enums/keys/assets";
import { UI_COLORS } from "@/game/enums/keys/uiColors";


const RESOURCE_DISPLAY_SIZE = {
    width:  CANVAS_SIZE.width*0.12,
    height: CANVAS_SIZE.height*0.4,
}

export default class ResourceDisplay extends Phaser.GameObjects.Container{
    private readonly currentText:Phaser.GameObjects.Text;
    private readonly maxText:Phaser.GameObjects.Text;
    private readonly incomeText:Phaser.GameObjects.Text;

    constructor(        
        scene:Phaser.Scene){
        super(scene,0,CANVAS_SIZE.height*0.39);
        const bg = scene.add.rectangle(
            0,
            0,
            RESOURCE_DISPLAY_SIZE.width,
            RESOURCE_DISPLAY_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);
        
        this.currentText = scene.add.text(
            RESOURCE_DISPLAY_SIZE.width*0.2,
            RESOURCE_DISPLAY_SIZE.height*0.2,
            "0",
            {
                fontSize:50
            }
        )

        const line = scene.add.line(
            0,
            RESOURCE_DISPLAY_SIZE.height*0.25,
            RESOURCE_DISPLAY_SIZE.height*0.1,
            RESOURCE_DISPLAY_SIZE.height*0.4,
            RESOURCE_DISPLAY_SIZE.width*0.8,
            -RESOURCE_DISPLAY_SIZE.height*0.05,
            0xFFFFFF
        )
        .setLineWidth(3)
        .setOrigin(0);

        this.maxText = scene.add.text(
            RESOURCE_DISPLAY_SIZE.width*0.55,
            RESOURCE_DISPLAY_SIZE.height*0.5,
            "0",
            {
                fontSize:50
            }
        )

        const incomeRateIcon = scene.add.image(
            RESOURCE_DISPLAY_SIZE.width*0.3,
            RESOURCE_DISPLAY_SIZE.height*0.8,
            ASSETS.INCOME_RATE
        ).setOrigin(0.5);

        this.incomeText = scene.add.text(
            RESOURCE_DISPLAY_SIZE.width*0.5,
            RESOURCE_DISPLAY_SIZE.height*0.8,
            "X 0",
            {
                fontSize:20
            }
        );

        this.add(bg);
        this.add(this.currentText);
        this.add(line);
        this.add(this.maxText);
        this.add(incomeRateIcon);
        this.add(this.incomeText);
    }


    setCurrent(current:number){
        this.currentText.setText(String(current));
    }

    setMax(max:number){
        this.maxText.setText(String(max));
    }

    setIncome(income:number){
        this.incomeText.setText(`X ${income}`);
    }
}