import UnitControlsPanel from "../view/unitControlsPanel";

export default class UnitControlPanelController{
    private readonly ui:UnitControlsPanel;

    constructor(ui : UnitControlsPanel){
        this.ui=ui;
    }

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