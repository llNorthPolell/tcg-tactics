import DeckStatDisplay from "../view/deckStatDisplay";

export default class DeckStatDisplayController{

    constructor(
        private readonly ui : DeckStatDisplay
    ){}

    setDeckCount(count:number){
        this.ui.setDeckCount(count);
    }

    setDeathCount(count:number){
        this.ui.setDeathCount(count);
    }
}