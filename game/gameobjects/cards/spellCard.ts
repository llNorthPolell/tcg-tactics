import SpellCardData from "../../data/cards/spellCardData";
import SkillEffect from "../../scripts/skillEffects/skillEffect";
import { Card } from "./card";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/position";
import DealDamage from "@/game/scripts/skillEffects/dealDamage";
import { ValueType } from "@/game/enums/valueType";
import Player from "@/game/data/player";

export default class SpellCard extends Card<SpellCardData>{
    private skillEffects: SkillEffect[];

    constructor(id:string,data:SpellCardData,owner:Player){
        super(id,data,owner);
        this.skillEffects=[];
        this.parseSkillEffects(data.effectCode);
    }
    
    private parseSkillEffects(effectCode:string){

        // TODO: This is a placeholder. Make a skillEffect factory. 
        this.skillEffects = [...this.skillEffects,
            new DealDamage(
                'Burn',
                100,
                ValueType.VALUE,
                3,
                true
            )
        ]
    }

    play(location:Position){
        EventEmitter.emit(EVENTS.fieldEvent.CAST_SPELL,location);
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x000077,"spells");
    }
}