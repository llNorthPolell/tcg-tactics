import { CARD_SIZE } from "@/game/config";
import SpellCardData from "../../data/cards/spellCardData";
import SkillEffect from "../../scripts/skillEffects/skillEffect";
import { Card } from "./card";

export default class SpellCard implements Card{
    readonly id: string;
    readonly data: SpellCardData;

    private container?:Phaser.GameObjects.Container;
    private skillEffects: SkillEffect[];

    private x: number;
    private y: number;

    constructor(id:string, data:SpellCardData, skillEffects:SkillEffect[]){
        this.id=id;
        this.data=data;
        this.skillEffects=skillEffects;

        this.x=0;
        this.y=0;
    }

    
    setPosition (x: number, y: number){
        this.x=x;
        this.y=y;
    }


    play () :SkillEffect[]{
        return this.skillEffects;
    };
    
    render(scene:Phaser.Scene){
        this.container=scene.add.container(this.x,this.y);
        const bg = scene.add.rectangle(0,0,CARD_SIZE.width, CARD_SIZE.height,0x000077)
            .setOrigin(0,0)
            .setStrokeStyle(1,0x000000);

        this.container?.add(bg);
        this.container.add(
            scene.add.text(
                CARD_SIZE.width*0.1,CARD_SIZE.height*0.5,this.data.name
            )
        );
        this.container.setInteractive(bg,Phaser.Geom.Rectangle.Contains).on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                console.log(`Viewing card#${this.id}`);
            }
        );

        return this.container;
    }
}