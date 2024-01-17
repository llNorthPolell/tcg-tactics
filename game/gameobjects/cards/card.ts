import GameObject from "../common/gameObject";
import CardContent from "../common/cardContent";
import { CARD_TYPE } from "@/game/enums/keys/cardType";
import Unit from "../units/unit";
import Effect from "@/game/skillEffects/effect";
import { Position } from "@/game/data/types/position";


export default class Card {
    /**
     * Id of this card in the database
     */
    readonly id: string;

    /**
     * Name of this card
     */
    readonly name: string;

    /**
     * Spell,Hero, or Unit card?
     */
    readonly cardType: string;

    /**
     * Cost to play this card
     */
    readonly cost: number;
    
    /**
     * If linked, the contents of this card (either a unit or effect)
     */
    private contents:CardContent;

    /**
     * Reference to physicalization of the card rendered on screen
     */
    private gameObject?:GameObject;


    constructor(id:string,name:string,cardType:string,cost:number,contents:CardContent){
        this.id=id;
        this.name=name;
        this.cardType=cardType;
        this.cost=cost;
        this.contents=contents;
    }

    linkGameObject(gameObject:GameObject):void{
        this.gameObject=gameObject;
    }
    
    getGameObject():GameObject|undefined{
        return this.gameObject;
    }

    getContents() : CardContent{
        return this.contents;
    }

    play(target?:Unit | Position):void{
        if (this.cardType===CARD_TYPE.spell){
            const effect = this.contents as Effect;
        }
        else {
            const unit = this.contents as Unit;
            const summonLocation = target as Position;
            unit.getPositionController()!.moveTo(summonLocation);
        }
    }
}