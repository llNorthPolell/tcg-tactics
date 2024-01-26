import DeckStatDisplay from "../view/deckStatDisplay";

export default class DeckStatDisplayController{
    private readonly ui : DeckStatDisplay;

    constructor(ui:DeckStatDisplay){
        this.ui=ui;
    }

    setDeckCount(count:number){
        this.ui.setDeckCount(count);
    }

    setDeathCount(count:number){
        this.ui.setDeathCount(count);
    }
}