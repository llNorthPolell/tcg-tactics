
import { TILESIZE } from "../config";
import HeroCardData from "../data/cards/heroCardData";
import UnitCardData from "../data/cards/unitCardData";
import { Position } from "../data/position";
import UnitData from "../data/unitData";
import { ASSETS } from "../enums/keys/assets";
import GamePlayer from "./gamePlayer";

export default class Unit {
    readonly id: string;
    readonly card: UnitCardData;
    private unitData: UnitData;
    private location: Position;
    private owner: GamePlayer;
    private activeColor: number;
    private inactiveColor:number;
    private active: boolean;

    private container?: Phaser.GameObjects.Container;
    private image?: Phaser.GameObjects.Sprite;
    


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
    }

    getUnitData(){
        return this.unitData;
    }

    setLocation(location:Position){
        this.location=location;
    }

    getLocation(){
        return this.location;
    }

    render(scene:Phaser.Scene){
        const pixelX = this.location.x * TILESIZE.width;
        const pixelY = this.location.y * TILESIZE.height;

        this.container = scene.add.container(pixelX,pixelY);

        const bg = scene.add.rectangle(
            0,
            0,
            TILESIZE.width,
            TILESIZE.height,
            (this.active)?this.activeColor: this.inactiveColor
        ).setOrigin(0);
        this.container.add(bg);
        
        const assetName=`${ASSETS.PORTRAIT}_${(this.card instanceof HeroCardData)? "heroes":"units"}_${this.card.id}`;
        this.image = scene.add.sprite(TILESIZE.width*0.5,TILESIZE.height*0.5,assetName)
            .setOrigin(0.5)
            .setDisplaySize(TILESIZE.width*0.9, TILESIZE.height*0.9);
        this.container.add(this.image);
    }

    wake(){
        this.active=true;
    };

    sleep(){
        this.active=false;
    }
}