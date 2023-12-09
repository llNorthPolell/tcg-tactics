import { CardData } from "../cardData";

export default class SpellCardData implements CardData{
    readonly id:string;
    readonly name:string;
    readonly cost:number;
    readonly description:string;
    readonly effectCode:string;

    // TODO: create skill effect objects with undefined targets
    constructor(id:string, name:string, cost:number,description: string,effectCode:string){
        this.id=id;
        this.name=name;
        this.cost=cost;
        this.description=description;
        this.effectCode=effectCode;
    }
}