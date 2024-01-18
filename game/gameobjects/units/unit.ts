import Effect from "@/game/skillEffects/effect";
import GameObject from "../common/gameObject";
import GamePlayer from "../player/gamePlayer";
import PositionController from "./positionController";
import { UnitStats } from "../../data/types/unitStats";
import { UnitStatuses } from "@/game/data/types/unitStatuses";
import CardContent from "../common/cardContent";
import CombatController from "./combatController";

export default class Unit implements CardContent{
    /**
     * Id of the unit
     */
    readonly id: string;

    /**
     * Name of the unit
     */
    readonly name: string;

    /**
     * Base stats (values shown on the card)
     */
    readonly base: UnitStats;

    /**
     * Id of this unit's card
     */
    readonly cardId: string;

    /**
     * Class of this unit (i.e. Soldier, Ranger, Mage, etc.)
     */
    readonly unitClass :string;

    /**
     * Hero or Unit?
     */
    readonly unitType:string;

    /**
     * Current Stats (values after damage, buffs and debuffs)
     */
    private current: UnitStats;

    /**
     * Unit statuses for behavioural effects (i.e. stuns, rush, etc.)
     */
    private status: UnitStatuses;

    /**
     * Effects casted by this unit
     */
    private effects:Effect[];

    /**
     * Reference to physicalization of the unit rendered on screen
     */
    private gameObject?:GameObject;

    /**
     * Reference to Move controller object to move unit. Call renderGameObject() to initialize.
     */
    private positionController?:PositionController;

    /**
     * Reference to Combat controller object to handle unit combat functions.
     */
    readonly combat:CombatController
    
    /**
     * If true, unit can move and attack
     */
    private active:boolean;


    /**
     * Player who controls this unit
     */
    private owner?:GamePlayer;

    /**
     * 
     * @param id Id of the unit
     * @param cardId Id of this unit's card
     * @param owner Owner of this unit
     * @param unitClass Class of this unit (i.e. Soldier, Ranger, Mage, etc.)
     * @param stats Base stats (values shown on the card)
     * @param unitType Hero or Unit?
     */
    constructor(id:string,name:string,cardId:string,unitClass:string,unitType:string,stats:UnitStats,effects:Effect[]){
        this.id=id; 
        this.name=name;
        this.cardId=cardId;
        this.unitClass=unitClass;
        this.unitType=unitType;
        this.base=stats;
        this.effects=effects;
        this.current=stats;
        this.active=false;

        this.status = {
            isFrozen:false,
            isSleeping:false,
            isStunned:false,
            rush:false
        }
        this.combat = new CombatController(this);
    }

    getCurrentStats():UnitStats{
        return this.current;
    }

    getStatus():UnitStatuses{
        return this.status;
    }

    getEffects():Effect[]{
        return this.effects;
    }

    setOwner(owner:GamePlayer):void{
        this.owner = owner;
    }

    getOwner():GamePlayer | undefined{
        return this.owner;
    }
    
    linkGameObject(gameObject:GameObject):void{
        this.gameObject=gameObject;
        this.positionController=new PositionController(this,{x:-10,y:-10});
    }

    getGameObject() : GameObject | undefined{
        return this.gameObject;
    }

    position():PositionController | undefined{
        return this.positionController;
    }

    setActive(active:boolean):void{
        this.active=active;
    }

    isActive():boolean{
        return this.active;
    }
}