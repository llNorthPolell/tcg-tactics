import { CARD_SIZE } from "@/game/config";
import SpellCardData from "../../data/cards/spellCardData";
import SkillEffect from "../../scripts/skillEffects/skillEffect";
import { Card } from "./card";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";

export default class SpellCard extends Card<SpellCardData>{
    private skillEffects: SkillEffect[];

    constructor(id:string,data:SpellCardData,skillEffects:SkillEffect[]){
        super(id,data);
        this.skillEffects=skillEffects;
    }
    
    play(){

        EventEmitter.emit(EVENTS.fieldEvent.CAST_SPELL);
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x000077);
    }
}