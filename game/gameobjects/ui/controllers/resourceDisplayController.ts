import ResourceDisplay from "../view/resourceDisplay";

export default class ResourceDisplayController{
    constructor(
        private readonly ui:ResourceDisplay
    ){}

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