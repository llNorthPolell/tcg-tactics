
import { TILESIZE } from "../config";
import { CardData } from "../data/cardData";
import HeroCardData from "../data/cards/heroCardData";
import UnitCardData from "../data/cards/unitCardData";
import { Position } from "../data/position";
import UnitData from "../data/unitData";
import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
import { EventEmitter } from "../scripts/events";
import AttackSelector from "./attackSelector";
import { Card } from "./cards/card";
import HeroCard from "./cards/heroCard";
import UnitCard from "./cards/unitCard";
import GamePlayer from "./gamePlayer";

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
        this.imageAssetName = `${ASSETS.PORTRAIT}_${(this.card instanceof HeroCardData)? "heroes":"units"}_${this.card.id}`;
        
        EventEmitter.on(
            EVENTS.cardEvent.SELECT,
            (card : Card<CardData>)=>{
                if (card instanceof UnitCard || card instanceof HeroCard)
                    EventEmitter.emit(EVENTS.unitEvent.CHECK_STANDING_ON_RALLY,this);
            }
        )
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

        
            
        this.container.add(this.image);

        if (this.active)
            this.image.setAlpha(1);
        else
            this.image.setAlpha(0.7);

        this.attackSelector = new AttackSelector(scene,this);
        this.container.add(this.attackSelector);
        this.container.setInteractive(bg,Phaser.Geom.Rectangle.Contains)
        .on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                EventEmitter.emit(EVENTS.unitEvent.SELECT,this);
            }
        )

    }

    isActive(){
        return this.active;
    }
    
    wake(){
        this.active=true;
        this.image!.setAlpha(1);
    };

    sleep(){
        this.active=false;
        this.image!.setAlpha(0.7);
    }
}