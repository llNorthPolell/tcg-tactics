
import UnitCardData from "../data/cards/unitCardData";
import UnitData from "../data/unitData";

export default class Unit{

    private unitData: UnitData;

    constructor(card:UnitCardData){
        this.unitData=new UnitData(card);
    }

}