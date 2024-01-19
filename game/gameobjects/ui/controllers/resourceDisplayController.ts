import ResourceDisplay from "../view/resourceDisplay";

export default class ResourceDisplayController{
    private readonly ui:ResourceDisplay;

    constructor(ui:ResourceDisplay){
        this.ui=ui;
    }

    setMax(max:number){
        this.ui.setMax(max);
    }

    setCurrent(current:number){
        this.ui.setCurrent(current);
    }

    setIncome(income:number){
        this.ui.setIncome(income);
    }

}