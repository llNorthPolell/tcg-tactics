
import UnitCardData from "../data/cards/unitCardData";
import UnitData from "../data/unitData";

export default class Unit{
    readonly id: string;
    private data: UnitData;

    constructor(id:string,card:UnitCardData){
        this.id=id;
        this.data=new UnitData(card);
    }

    getData(){
        return this.data;
    }
}