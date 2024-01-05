
import { TILESIZE } from "../config";
import { CardData } from "../data/cardData";
import HeroCardData from "../data/cards/heroCardData";
import UnitCardData from "../data/cards/unitCardData";
import { Position } from "../data/types/position";
import UnitData from "../data/unitData";
import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
import { TARGET_TYPES } from "../enums/keys/targetTypes";
import { EventEmitter } from "../scripts/events";
import { loadImage } from "../scripts/imageLoader";
import SkillEffect from "../scripts/skillEffects/skillEffect";
import { inRange } from "../scripts/util";
import AttackSelector from "./attackSelector";
import { Card } from "./cards/card";
import HeroCard from "./cards/heroCard";
import SpellCard from "./cards/spellCard";
import UnitCard from "./cards/unitCard";
import GamePlayer from "./gamePlayer";
import SpellSelector from "./spellSelector";

export default class Unit {
    readonly id: string;
    readonly card: UnitCardData;
    private unitData: UnitData;
    private location: Position;
    private pixelPosition?: Position;
    private owner: GamePlayer;
    private activeColor: number;
    private inactiveColor:number;
    private active: boolean;

    private container?: Phaser.GameObjects.Container;
    private image?: Phaser.GameObjects.Sprite;
    readonly imageAssetName: string;

    private attackSelector?: AttackSelector;
    private spellSelector?: SpellSelector; 

    private buffs: SkillEffect[];
    private debuffs: SkillEffect[];



    private targetLocation?: Position;
    private path: Position[];


    constructor(id:string,location:Position,card:UnitCardData, owner: GamePlayer){
        this.id=id;
        this.card = card;
        this.unitData=new UnitData(card);
        this.location=location;
        this.owner = owner;
        this.active=false;
        this.activeColor=this.owner.color;
        const darkColor = Phaser.Display.Color.ValueToColor(this.owner.color).darken(80);
        this.inactiveColor= darkColor.color;
        this.imageAssetName = `${ASSETS.PORTRAIT}_${this.getUnitType()}_${this.card.id}`;

        this.path = [];

        this.buffs=[];
        this.debuffs=[];
    }

    getUnitData(){
        return this.unitData;
    }

    setLocation(location:Position){
        this.location=location;
        const pixelX = location.x * TILESIZE.width;
        const pixelY = location.y * TILESIZE.height;
        this.pixelPosition = {x:pixelX, y:pixelY};
        this.container?.setPosition(pixelX,pixelY);
    }

    getLocation(){
        return this.location;
    }
    
    getPixelPosition(){
        return this.pixelPosition;
    }

    getTargetLocation(){
        return this.targetLocation;
    }

    render(scene:Phaser.Scene){
        this.setLocation(this.location);

        if(!this.container)
            this.container = scene.add.container(this.pixelPosition!.x,this.pixelPosition!.y);

        const bg = scene.add.rectangle(
            0,
            0,
            TILESIZE.width,
            TILESIZE.height,
            (this.active)?this.activeColor: this.inactiveColor
        ).setOrigin(0);
        this.container?.add(bg);

        this.image = scene.add.sprite(TILESIZE.width*0.5,TILESIZE.height*0.5,this.imageAssetName)
            .setOrigin(0.5)
            .setDisplaySize(TILESIZE.width*0.9, TILESIZE.height*0.9);

        if (!scene.textures.exists(this.imageAssetName)){
            loadImage(scene, 
                this.image, 
                this.getUnitType(), 
                this.card.id,
                TILESIZE.width*0.9, 
                TILESIZE.height*0.9);
        }
        this.container.add(this.image);

        if (this.active)
            this.image.setAlpha(1);
        else
            this.image.setAlpha(0.7);

        this.attackSelector = new AttackSelector(scene,this);
        this.container.add(this.attackSelector);

        this.spellSelector = new SpellSelector(scene,this);
        this.container.add(this.spellSelector);

        this.container.setInteractive(bg,Phaser.Geom.Rectangle.Contains)
        .on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                EventEmitter.emit(EVENTS.unitEvent.SELECT,this);
            }
        )

        EventEmitter
        .on(
            EVENTS.unitEvent.SELECT,
            (unit:Unit)=>{
                if(unit==this) return;
                if (unit.owner.getTeam() != this.owner.getTeam() 
                    && inRange(unit.getLocation(),this.getLocation(),unit.unitData.currRng))
                    this.attackSelector?.show(unit);
                else
                    this.attackSelector?.hide();
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
                    this.attackSelector?.show(unit);
                else    
                    this.attackSelector?.hide();
            }
        )
        .on(
            EVENTS.unitEvent.CANCEL,
            ()=>{
                if (this.attackSelector?.visible)
                    this.attackSelector?.hide();
            }
        )
        .on(
            EVENTS.unitEvent.WAIT,
            ()=>{
                if (this.attackSelector?.visible)
                    this.attackSelector?.hide();
            }
        )
        .on(
            EVENTS.cardEvent.SELECT,
            (card : Card<CardData>)=>{
                if (this.spellSelector?.visible)
                    this.spellSelector?.hide();
                
                if (card instanceof UnitCard || card instanceof HeroCard)
                    return;
                
                const spellCard = (card as SpellCard);
                const targetType = spellCard.data.targetType;

                if(targetType!==TARGET_TYPES.none)
                    this.spellSelector?.show(spellCard);
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                if (this.attackSelector?.visible)
                    this.attackSelector?.hide();
                if (this.spellSelector?.visible)
                    this.spellSelector?.hide();
            }
        );
        

    }

    isActive(){
        return this.active;
    }
    
    wake(){
        this.image!.setAlpha(1);
        this.active=true;
    };

    sleep(){
        this.image!.setAlpha(0.7);
        this.active=false;
    }

    move(targetLocation: Position){
        this.targetLocation = targetLocation;
        this.container?.setPosition(targetLocation.x * TILESIZE.width, targetLocation.y * TILESIZE.height);
    }

    confirmMove(){
        if (this.targetLocation){
            this.location = this.targetLocation;
            this.targetLocation=undefined;
        }
        this.container?.setPosition(this.location.x * TILESIZE.width, this.location.y * TILESIZE.height);
        this.sleep();
    }

    cancelMove(){
        this.targetLocation=undefined;
        this.container?.setPosition(this.location.x* TILESIZE.width, this.location.y * TILESIZE.height);
    }

    // TODO: Slide unit along path
    updateMove(){
        if (this.path.length===0) return;
        const nextTile = this.path[0];
        if(nextTile.x - (this.container!.x/TILESIZE.width) > 0)
            this.container!.body!.velocity.x=5;
        else if (nextTile.x - (this.container!.x/TILESIZE.width) < 0)
            this.container!.body!.velocity.x=-5;
        else 
            this.container!.body!.velocity.x=0;

        if(nextTile.y - (this.container!.y/TILESIZE.height) > 0)
            this.container!.body!.velocity.y=5;
        else if (nextTile.y - (this.container!.y/TILESIZE.height) < 0)
            this.container!.body!.velocity.y=-5;
        else 
            this.container!.body!.velocity.y=0;

        this.path = this.path.splice(0,1);
    }

    getUnitType(){
        return (this.card instanceof HeroCardData)? "heroes":"units";
    }

    getOwner(){
        return this.owner;
    }
    
    update(){
        this.updateMove();
    }

    killUnit(){
        console.log(`${this.id} has been slain...`);
        this.active = false;
        this.container!.setVisible(false);
        EventEmitter.emit(EVENTS.unitEvent.DEATH, this);
    }
}