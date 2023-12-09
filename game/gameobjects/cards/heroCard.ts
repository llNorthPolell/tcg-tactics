import HeroCardData from "../../data/cards/heroCardData";
import { Card } from "./card";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/position";
import GamePlayer from "../gamePlayer";

export default class HeroCard extends Card<HeroCardData>{
    constructor(id:string,data:HeroCardData,owner:GamePlayer){
        super(id,data,owner);
    }
    
    play(location:Position){
        EventEmitter.emit(EVENTS.fieldEvent.SUMMON_UNIT,location,this.data,this.owner);
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x770000,"heroes");
    }
}
