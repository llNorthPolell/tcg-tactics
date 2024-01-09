import { CardData } from "../cardData";
import { EffectData } from "../effectData";

export default class SpellCardData implements CardData{
    readonly id:string;
    readonly name:string;
    readonly cost:number;
    readonly description:string;
    readonly effectData:EffectData;
    readonly targetType:string;

    // TODO: create skill effect objects with undefined targets
    constructor(id:string, name:string, targetType: string, cost:number,description: string,effectData:EffectData){
        this.id=id;
        this.name=name;
        this.cost=cost;
        this.description=description;
        this.effectData=effectData;
        this.targetType = targetType;
    }
}