import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import GameObject from "../common/gameObject";
import GamePlayer from "../player/gamePlayer";
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
     * Card target type
     */
    readonly targetType: string;

    /**
     * Cost to play this card
     */
    readonly cost: number;
    
    /**
     * If linked, the unit that is summoned by playing this card
     */
    private unit?:Unit;

    /**
     * If linked, the effects that are cast by playing this card
     */
    private effects?: Effect[];

    /**
     * If effects linked to this card, this should show what the effects are.
     */
    readonly description?: string;

    /**
     * If linked, the owner of this card
     */
    private owner?:GamePlayer

    /**
     * Reference to physicalization of the card rendered on screen
     */
    private gameObject?:GameObject;

    
    constructor(id:string,name:string,cardType:string,cost:number,description?:string,effects?:Effect[],unit?:Unit,targetType:string=TARGET_TYPES.rallyPoint){
        this.id=id;
        this.name=name;
        this.cardType=cardType;
        this.cost=cost;
        this.effects=(effects)?[...effects]:undefined;
        this.description=(description)?description: (effects)? effects[0].description: undefined;
        this.unit=(unit)? unit: undefined;
        this.targetType=targetType;
    }

    linkGameObject(gameObject:GameObject):void{
        this.gameObject=gameObject;
    }
    
    setOwner(owner:GamePlayer){
        this.owner=owner;
    }

    getGameObject():GameObject|undefined{
        return this.gameObject;
    }

    getUnit() : Unit | undefined{
        return this.unit;
    }

    getEffects():Effect[] | undefined{
        return this.effects;
    }

    getOwner():GamePlayer | undefined{
        return this.owner;
    }
}