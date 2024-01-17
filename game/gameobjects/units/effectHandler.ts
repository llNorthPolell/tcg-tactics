import Effect from "@/game/skillEffects/effect";

export default class EffectHandler{
    /**
     * Benevolent effects on this unit
     */
    private buffs: Effect[];

    /**
     * Malicious effects on this unit
     */
    private debuffs: Effect[];

    constructor(){
        this.buffs= [];
        this.debuffs=[];
    }

    insertBuff(effect:Effect){
        this.buffs = [...this.buffs,effect];
    }

    insertDebuff(effect:Effect){
        this.debuffs = [...this.debuffs,effect];
    }

    removeBuff(effect:Effect){
        if(!effect.isRemovable) return;
        this.buffs = this.buffs.filter(buff=> buff != effect);
        effect.remove();
    }

    forceRemovebuff(effect:Effect){
        this.buffs = this.buffs.filter(buff=> buff != effect);
        effect.forceRemove();
    }

    removeDebuff(effect:Effect){
        if(!effect.isRemovable) return;
        this.debuffs = this.debuffs.filter(debuff=> debuff != effect);
        effect.remove();
    }
    
    forceRemoveDebuff(effect:Effect){
        this.debuffs = this.debuffs.filter(debuff=> debuff != effect);
        effect.forceRemove();
    }

    updateEffects(){
        this.buffs.forEach(buff=>{
            buff.apply();
        });

        this.debuffs.forEach(debuff=>{
            debuff.apply();
        });
    }

    clearInactiveEffects(){
        this.buffs = this.buffs.filter(buff=> buff.isActive());
        this.debuffs = this.debuffs.filter(debuff=> debuff.isActive());
    }
}