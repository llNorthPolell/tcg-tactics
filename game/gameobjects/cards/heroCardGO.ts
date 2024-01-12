import HeroCardData from "@/game/data/cards/heroCardData";
import HeroCard from "./heroCard";
import UnitCardGO from "./unitCardGO";

export default class HeroCardGO extends UnitCardGO<HeroCardData>{
    constructor(scene : Phaser.Scene, card:HeroCard){
        super(scene,card);

        this.renderContents();
    }

}