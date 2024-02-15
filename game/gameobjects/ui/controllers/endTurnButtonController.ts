import EndTurnButton from "../view/endTurnButton";

export default class EndTurnButtonController{

    constructor(
        private readonly ui:EndTurnButton
    ){}

    show(){
        this.ui.show();
    }

    hide(){
        this.ui.hide();
    }
}