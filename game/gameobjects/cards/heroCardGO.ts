import HeroCard from "./heroCard";
import UnitCardGO from "./unitCardGO";

export default class HeroCardGO extends UnitCardGO{
    constructor(scene : Phaser.Scene, card:HeroCard){
        super(scene,card);

        this.renderContents();
    }

}