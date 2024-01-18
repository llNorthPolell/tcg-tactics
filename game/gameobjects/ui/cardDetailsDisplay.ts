import { CANVAS_SIZE } from "@/game/config";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { Card } from "../cards/card";
import { CardData } from "@/game/data/types/cardData";
import SpellCard from "../cards/spellCard";
import { FONT } from "@/game/enums/keys/font";
import HeroCard from "../cards/heroCard";
import { Position } from "@/game/data/types/position";
import UnitCard from "../cards/unitCard";

const CARD_DETAILS_SIZE = {
    width:CANVAS_SIZE.width*0.2,
    height:CANVAS_SIZE.height*0.5
}

const TEXT_START_X = CARD_DETAILS_SIZE.width*0.05;

export default class CardDetailsDisplay extends Phaser.GameObjects.Container{
    private cardName:Phaser.GameObjects.Text;
    private cardType:Phaser.GameObjects.Text;
    private spellEffects:Phaser.GameObjects.Container;
    private spellEffectsDesc:Phaser.GameObjects.Text;
    private leaderSkill:Phaser.GameObjects.Container;
    private leaderDesc:Phaser.GameObjects.Text;
    private passiveSkill:Phaser.GameObjects.Container;
    private passiveDesc:Phaser.GameObjects.Text;
    private activeSkill:Phaser.GameObjects.Container;
    private activeDesc:Phaser.GameObjects.Text;

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

        return {container, desc};
    }

    show(card:Card<CardData>){
        const cardType = (card instanceof SpellCard)? "Spell" : 
            (card instanceof HeroCard)? "Hero" : "Unit";
            
        this.cardName.setText(card.data.name);
        this.cardType.setText(cardType);

        if (card instanceof SpellCard){
            this.spellEffects.setVisible(true);
            this.spellEffectsDesc.setText(card.data.description);
        }
        if (card instanceof HeroCard) {
            this.leaderSkill.setVisible(true);
            this.leaderDesc.setText(card.data.leaderSkillDesc);
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
        }
        this.setVisible(true);
    }

    hide(){
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

        this.setVisible(false);
    }
}