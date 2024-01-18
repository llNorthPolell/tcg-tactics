import GameObject from "../common/gameObject";
import CardContent from "../common/cardContent";
import Unit from "../units/unit";
import Effect from "@/game/skillEffects/effect";


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
    private contents:Unit|Effect[];

    /**
     * Reference to physicalization of the card rendered on screen
     */
    private gameObject?:GameObject;


    constructor(id:string,name:string,cardType:string,cost:number,contents:Unit|Effect[]){
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

}