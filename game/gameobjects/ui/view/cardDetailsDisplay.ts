import { CANVAS_SIZE } from "@/game/config";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { FONT } from "@/game/enums/keys/font";
import { Position } from "@/game/data/types/position";
import Card from "../../cards/card";
import { CARD_TYPE } from "@/game/enums/keys/cardType";

const CARD_DETAILS_SIZE = {
    width:CANVAS_SIZE.width*0.2,
    height:CANVAS_SIZE.height*0.5
}

const TEXT_START_X = CARD_DETAILS_SIZE.width*0.05;

export default class CardDetailsDisplay extends Phaser.GameObjects.Container{
    private readonly cardName:Phaser.GameObjects.Text;
    private readonly cardType:Phaser.GameObjects.Text;
    private readonly spellEffects:Phaser.GameObjects.Container;
    private readonly spellEffectsDesc:Phaser.GameObjects.Text;
    private readonly leaderSkill:Phaser.GameObjects.Container;
    private readonly leaderDesc:Phaser.GameObjects.Text;
    private readonly passiveSkill:Phaser.GameObjects.Container;
    private readonly passiveDesc:Phaser.GameObjects.Text;
    private readonly activeSkill:Phaser.GameObjects.Container;
    private readonly activeDesc:Phaser.GameObjects.Text;

    constructor(scene:Phaser.Scene){
        super(scene,CANVAS_SIZE.width * 0.66, CANVAS_SIZE.height *0.29);

        ({cardName:this.cardName,cardType:this.cardType} = this.setupBase(scene));

        ({container:this.spellEffects,desc:this.spellEffectsDesc} = 
            this.setupDescBox(
                scene,
                "Spell Effect",
                {x:TEXT_START_X,y:CARD_DETAILS_SIZE.height*0.2}, 
                CARD_DETAILS_SIZE.width*0.9,
                CARD_DETAILS_SIZE.height*0.7
            )
        );

        ({container:this.leaderSkill,desc:this.leaderDesc} = 
            this.setupDescBox(
                scene,
                "Leader Skill",
                {x:TEXT_START_X,y:CARD_DETAILS_SIZE.height*0.18}, 
                CARD_DETAILS_SIZE.width*0.9,
                CARD_DETAILS_SIZE.height*0.15
            )
        );

        ({container:this.passiveSkill,desc:this.passiveDesc} = 
            this.setupDescBox(
                scene,
                "Passive Skill",
                {x:TEXT_START_X,y:CARD_DETAILS_SIZE.height*0.4}, 
                CARD_DETAILS_SIZE.width*0.9,
                CARD_DETAILS_SIZE.height*0.15
            )
        );

        ({container:this.activeSkill,desc:this.activeDesc} = 
            this.setupDescBox(
                scene,
                "Active Skill",
                {x:TEXT_START_X,y:CARD_DETAILS_SIZE.height*0.62}, 
                CARD_DETAILS_SIZE.width*0.9,
                CARD_DETAILS_SIZE.height*0.3
            )
        );

        this.hide();
    }


    private setupBase(scene:Phaser.Scene){
        const bg = scene.add.rectangle(
            0,
            0,
            CARD_DETAILS_SIZE.width,
            CARD_DETAILS_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);
        this.add(bg);

        const cardName = scene.add.text(
            TEXT_START_X,0,"",{
                fontFamily:FONT.main,
                fontSize:24
            }
        );
        this.add(cardName);

        const cardType = scene.add.text(
            TEXT_START_X,CANVAS_SIZE.height*0.05,"",{
                fontFamily: FONT.secondary,
                fontSize:16
            }
        );
        this.add(cardType);

        return {cardName,cardType};
    }

    private setupDescBox (scene:Phaser.Scene, heading:string, position:Position, width:number,height:number){
        const container = scene.add.container(position.x,position.y);

        const headingBorder = scene.add.rectangle(
            0,0,CARD_DETAILS_SIZE.width*0.4,CARD_DETAILS_SIZE.height*0.05)
            .setStrokeStyle(1,0xFFFFFF)
            .setOrigin(0);

        const headingText = scene.add.text(
            0,0,heading,{
                fontFamily: FONT.main,
                fontSize:16,
                wordWrap: { width: CARD_DETAILS_SIZE.width*0.9 }
            }
        )

        const bg = scene.add.rectangle(
            0,
            CARD_DETAILS_SIZE.height*0.06,
            width,
            height,
            0)
            .setOrigin(0)
            .setStrokeStyle(1,0xFFFFFF);

        const desc = scene.add.text(
            0,CARD_DETAILS_SIZE.height*0.06,"",{
                fontFamily: FONT.main,
                fontSize:18,
                wordWrap: { width: CARD_DETAILS_SIZE.width*0.9 }
            })
            .setOrigin(0);

        container.add(headingBorder);
        container.add(headingText);    
        container.add(bg);
        container.add(desc);
        this.add(container);
        container.setVisible(false);
        
        return {container, desc};
    }

    show(){
        this.setVisible(true);

        if (this.spellEffectsDesc.text !== "")
            this.spellEffects.setVisible(true);

        if (this.leaderDesc.text !== "")
            this.spellEffects.setVisible(true);     

        if (this.passiveDesc.text !== "")
            this.spellEffects.setVisible(true);

        if (this.activeDesc.text !== "")
            this.spellEffects.setVisible(true);
    }

    hide(){
        this.setVisible(false);
    }

    reset(){
        this.cardName.setText("");
        this.cardType.setText("");
        this.spellEffectsDesc.setText("");
        this.spellEffects.setVisible(false);
        this.leaderDesc.setText("");
        this.leaderSkill.setVisible(false);
        this.passiveDesc.setText("");
        this.passiveSkill.setVisible(false);
        this.activeDesc.setText("");
        this.activeSkill.setVisible(false);

    }

    setCardName(name:string){
        this.cardName.setText(name);
    }

    setCardType(cardType:string){
        this.cardType.setText(cardType);
    }

    setEffects(){
        throw new Error("Not implemented yet");
    }

    /*sshow(card:Card){
        this.cardName.setText(card.name);
        this.cardType.setText(card.cardType);

        if (card.cardType === CARD_TYPE.spell){
            this.spellEffects.setVisible(true);
            const effects = card.getEffects();
            if (!effects) 
                throw new Error(`Failed to display spell details; ${card.name} does not have effects defined...`)
            const descriptions : string[] = effects.map(content=> content.description);
            this.spellEffectsDesc.setText(descriptions);
        }
        /*if (card.cardType === CARD_TYPE.hero) {
            this.leaderSkill.setVisible(true);
            const contents = card.getContents() as UnitData;
            this.leaderDesc.setText(contents.effects?);
        }

        if (card instanceof UnitCard  || card instanceof HeroCard){
            if (card.data.passiveSkillDesc){
                this.passiveSkill.setVisible(true);
                this.passiveDesc.setText(card.data.passiveSkillDesc);
            }
            if (card.data.activeSkillDesc){
                this.activeSkill.setVisible(true);
                this.activeDesc.setText(card.data.activeSkillDesc);
            }
        }*/
        /*this.setVisible(true);
    }*/

}