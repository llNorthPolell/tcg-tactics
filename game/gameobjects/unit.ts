
import { TILESIZE } from "../config";
import { CardData } from "../data/cardData";
import HeroCardData from "../data/cards/heroCardData";
import UnitCardData from "../data/cards/unitCardData";
import { Position } from "../data/types/position";
import UnitData from "../data/unitData";
import { EVENTS } from "../enums/keys/events";
import { TARGET_TYPES } from "../enums/keys/targetTypes";
import { UI_COLORS } from "../enums/keys/uiColors";
import { EventEmitter } from "../scripts/events";
import AreaOfEffect from "../scripts/skillEffects/areaOfEffect";
import SkillEffect from "../scripts/skillEffects/skillEffect";
import { inRange } from "../scripts/util";
import { Card } from "./cards/card";
import HeroCard from "./cards/heroCard";
import SpellCard from "./cards/spellCard";
import UnitCard from "./cards/unitCard";
import GamePlayer from "./gamePlayer";
import UnitGO from "./unitGO";

export default class Unit {
    readonly id: string;
    readonly card: UnitCardData;
    private unitData: UnitData;
    private location: Position;
    private pixelPosition: Position;
    private owner: GamePlayer;
    private active: boolean;

    private gameObject?: UnitGO;

    private buffs: SkillEffect[];
    private debuffs: SkillEffect[];

    private destination?: Position;

    constructor(id:string,location:Position,card:UnitCardData, owner: GamePlayer){
        this.id=id;
        this.card = card;
        this.unitData=new UnitData(card);
        this.location=location;
        this.pixelPosition = {x:location.x * TILESIZE.width, y:location.y * TILESIZE.height};
        this.owner = owner;

        this.active=this.unitData.rush;

        this.buffs=[];
        this.debuffs=[];
    }

    handleEvents(){
        EventEmitter
        .on(
            EVENTS.unitEvent.SELECT,
            (unit:Unit)=>{
                if(unit==this) return;
                if (unit.owner.getTeam() != this.owner.getTeam() 
                    && inRange(unit.getLocation(),this.getLocation(),unit.unitData.currRng))
                    this.gameObject?.attackSelector.show(unit);
                else
                    this.gameObject?.attackSelector.hide();
            }
        )
        .on(
            EVENTS.unitEvent.MOVE,
            (unit:Unit,targetPosition:Position)=>{
                if (unit == this){
                    console.log(`Move ${this.unitData.name} to (${targetPosition.x},${targetPosition.y})`);
                    this.move(targetPosition);
                    return;
                }

                if (unit.owner.getTeam() != this.owner.getTeam() 
                    && inRange(targetPosition,this.getLocation(),unit.unitData.currRng))
                    this.gameObject?.attackSelector.show(unit);
                else    
                    this.gameObject?.attackSelector.hide();
            }
        )
        .on(
            EVENTS.unitEvent.CANCEL,
            ()=>{
                if (this.gameObject?.attackSelector.visible)
                    this.gameObject?.attackSelector.hide();
            }
        )
        .on(
            EVENTS.unitEvent.WAIT,
            ()=>{
                if (this.gameObject?.attackSelector.visible)
                    this.gameObject?.attackSelector.hide();
            }
        )
        .on(
            EVENTS.cardEvent.SELECT,
            (card : Card<CardData>)=>{
                if (this.gameObject?.spellSelector.visible)
                    this.gameObject?.spellSelector.hide();

                if (card instanceof UnitCard || card instanceof HeroCard)
                    return;
                
                const spellCard = (card as SpellCard);
                const targetType = spellCard.data.targetType;
                
                const player = spellCard.getOwner();
                const activeHeroes = player!.getActiveChampions();

                let nearAHero = false;
                activeHeroes.forEach(hero=>{
                    nearAHero = nearAHero || (inRange(this.location,hero.getLocation(),2));
                })
                if(targetType!==TARGET_TYPES.none && nearAHero) 
                    this.gameObject?.spellSelector.show(spellCard);
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                if (this.gameObject?.attackSelector.visible)
                    this.gameObject?.attackSelector.hide();
                if (this.gameObject?.spellSelector.visible)
                    this.gameObject?.spellSelector.hide();
            }
        )
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (playerId:number)=>{
                if (playerId != this.owner.id) return;
                this.wake();    
            }
        )
        .on(
            EVENTS.uiEvent.PLAY_FLOATING_TEXT,
            (unit:Unit,text:string,color:number)=>{
                if(unit !== this) return;
                
                this.gameObject?.floatingText.play(text,color);
            }
        )
        .on(
            EVENTS.fieldEvent.AREA_OF_EFFECT,
            (effect:AreaOfEffect)=>{
                const target = effect.getTarget();
                const caster = effect.getCaster();
                
                if (!target || !caster) return;

                const isInRange = inRange((target instanceof Unit)?target.getLocation():target,this.getLocation(),effect.range);
                const isAllied = (caster instanceof Unit)? caster.getOwner() == this.owner : caster == this.owner;
                if (isInRange){
                    const effectsToApply = effect.createEffects();
                    effectsToApply.forEach(
                        childEffect=>{
                            if (isAllied && childEffect.targetType === TARGET_TYPES.enemy) return;
                            if (!isAllied && childEffect.targetType === TARGET_TYPES.ally) return;
                            childEffect.setCaster(caster);
                            childEffect.setTarget(this);

                            // TODO: It is assumed that child effect is instant (0 duration)
                            childEffect.apply();
                        }
                    )
                }
            }
        );
    }

    getUnitData(){
        return this.unitData;
    }

    setLocation(location:Position){
        this.location=location;
        this.pixelPosition = {x:location.x * TILESIZE.width, y:location.y * TILESIZE.height};
        this.gameObject?.setPosition(this.pixelPosition.x,this.pixelPosition.y);
    }

    getLocation(){
        return this.location;
    }
    
    getPixelPosition(){
        return this.pixelPosition;
    }

    getDestination(){
        return this.destination;
    }

    render(scene:Phaser.Scene){
        this.setLocation(this.location);
        
        if(!this.gameObject){
            this.setLocation(this.getLocation());
            this.gameObject=new UnitGO(scene,this);
            this.handleEvents();
        }
    }

    isActive(){
        return this.active;
    }
    
    wake(){
        this.gameObject?.getImage().setAlpha(1);
        this.active=true;
        this.updateEffects();
        this.clearInactiveEffects();
    };

    sleep(){
        this.gameObject?.getImage().setAlpha(0.7);
        this.active=false;
    }

    move(destination: Position){
        this.destination = destination;
        this.gameObject?.setPosition(destination.x * TILESIZE.width, destination.y * TILESIZE.height);
    }

    confirmMove(){
        if (this.destination){
            this.location = this.destination;
            this.destination=undefined;
        }
        this.gameObject?.setPosition(this.location.x * TILESIZE.width, this.location.y * TILESIZE.height);
        this.sleep();
    }

    cancelMove(){
        this.destination=undefined;
        this.gameObject?.setPosition(this.location.x* TILESIZE.width, this.location.y * TILESIZE.height);
    }

    getUnitType(){
        return (this.card instanceof HeroCardData)? "heroes":"units";
    }

    getOwner(){
        return this.owner;
    }

    getGameObject(){
        return this.gameObject;
    }

    killUnit(){
        console.log(`${this.id} has been slain...`);
        this.active = false;
        this.gameObject?.setVisible(false);
        EventEmitter.emit(EVENTS.unitEvent.DEATH, this);
    }

    insertBuff(skillEffect:SkillEffect){
        skillEffect.setTarget(this);
        this.buffs = [...this.buffs,skillEffect];
    }

    insertDebuff(skillEffect:SkillEffect){
        skillEffect.setTarget(this);
        this.debuffs = [...this.debuffs,skillEffect];
    }

    removeBuff(skillEffect:SkillEffect){
        this.buffs = this.buffs.filter(buff=> buff != skillEffect);
    }

    removeDebuff(skillEffect:SkillEffect){
        this.debuffs = this.debuffs.filter(debuff=> debuff != skillEffect);
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

    takeDamage(damage:number){
        this.unitData.currHp -= damage;
        console.log(`${this.unitData.name} takes ${damage} damage!`);

        this.getGameObject()?.updateHpText();
        
        if (this.unitData.currHp <=0) 
            this.killUnit();

        EventEmitter.emit(EVENTS.uiEvent.PLAY_FLOATING_TEXT,this,-damage,UI_COLORS.damage);    
    }

    heal(amount:number){
        this.unitData.currHp += amount;

        if (this.unitData.currHp >= this.unitData.maxHP) 
            this.unitData.currHp = this.unitData.maxHP;
        
        this.getGameObject()?.updateHpText();
        console.log(`${this.unitData.name} heals ${amount} hp!`);
        EventEmitter.emit(EVENTS.uiEvent.PLAY_FLOATING_TEXT,this,amount,UI_COLORS.heal);
    }

    update(){

    }
}