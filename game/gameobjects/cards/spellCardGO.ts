import SpellCardData from "@/game/data/cards/spellCardData";
import CardGO from "./cardGO";
import SpellCard from "./spellCard";

export default class SpellCardGO extends CardGO<SpellCardData>{
    constructor(scene : Phaser.Scene, card:SpellCard){
        super(scene,card);

        this.renderContents();
    }

    renderContents(){
    }
}