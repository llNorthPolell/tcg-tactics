import { CardData } from "../cardData";

export interface SpellEffectData {
	name?: string,
	targetType: string,
	effectType: string,
	childEffects?: SpellEffectData[],
    amount?:number,
    valueType?: string,
    stat?: string,
    duration?:number,
    overTime?:boolean,
    isDelayed?:boolean,
    isRemovable?:boolean
}

export default class SpellCardData implements CardData{
    readonly id:string;
    readonly name:string;
    readonly cost:number;
    readonly description:string;
    readonly effectData:SpellEffectData;
    readonly targetType:string;

    // TODO: create skill effect objects with undefined targets
    constructor(id:string, name:string, targetType: string, cost:number,description: string,effectData:SpellEffectData){
        this.id=id;
        this.name=name;
        this.cost=cost;
        this.description=description;
        this.effectData=effectData;
        this.targetType = targetType;
    }
}