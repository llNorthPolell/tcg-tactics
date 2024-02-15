import UnitControlsPanel from "../view/unitControlsPanel";

export default class UnitControlPanelController{
    constructor(
        private readonly ui:UnitControlsPanel
    ){}

    show(){
        this.ui.show();
    }

    hide(){
        this.ui.hide();
        this.ui.hideWaitButton();
    }

    showWaitButton(){
        this.ui.showWaitButton();
    }

    hideWaitButton(){
        this.ui.hideWaitButton();
    }
}