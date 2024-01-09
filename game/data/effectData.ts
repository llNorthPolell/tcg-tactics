export type EffectData = {
	name: string,
	targetType: string,
	effectType: string,
	childEffects?: EffectData[],
    amount?:number,
    valueType?: string,
    stat?: string,
    duration?:number,
    overTime?:boolean,
    isDelayed?:boolean,
    isRemovable?:boolean
}
