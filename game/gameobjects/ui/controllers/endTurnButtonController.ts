import EndTurnButton from "../view/endTurnButton";

export default class EndTurnButtonController{
    private readonly ui:EndTurnButton;

    constructor(ui:EndTurnButton){
        this.ui=ui;
    }

    show(){
        this.ui.show();
    }

    hide(){
        this.ui.hide();
    }
}