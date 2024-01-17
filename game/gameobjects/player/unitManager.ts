import { UNIT_TYPE } from "@/game/enums/keys/unitType";
import Unit from "../units/unit";
import GamePlayer from "./gamePlayer";

export default class UnitManager{
    /**
     * Reference to parent 
     */
    private player:GamePlayer
    
    /**
     * List of followers under the player's control
     */
    private activeUnits:Unit[];

    /**
     * List of heroes under the player's control
     */
    private activeChampions:Unit[];

    private graveyard:Unit[];

    /**
     * @param player Reference to parent
     */
    constructor(player:GamePlayer){
        this.player=player;
        this.activeUnits=[];
        this.activeChampions=[];
        this.graveyard=[];
    }

    /**
     * Adds a unit to this player's control
     * @param unit unit to add to this player's control
     */
    register(unit: Unit){
        if (unit.unitType === UNIT_TYPE.hero) this.activeChampions=[...this.activeChampions,unit];
        else this.activeUnits=[...this.activeUnits,unit];
    }

    /**
     * @returns list of active units and heroes under the player's control
     */
    getAllActiveUnits(){
        return [...this.activeUnits, ...this.activeChampions];
    }

    /**
     * @returns list of heroes under the player's control
     */
    getActiveChampions(){
        return [...this.activeChampions];
    }
    
    /**
     * @returns number of followers under the player's control that died
     */
    getCasualties():number{
        return this.graveyard.length;
    }

    /**
     * Moves a unit/hero from the active lists to the player's graveyard
     * @param unit Unit that was killed
     */
    moveUnitToGraveyard(unit:Unit){
        if (unit.unitType === UNIT_TYPE.unit)
            this.activeUnits = this.activeUnits
                    .filter(activeUnit => activeUnit != unit);
        else 
            this.activeChampions = this.activeChampions
                    .filter(activeChampion => activeChampion != unit);

        this.graveyard.push(unit);
    }
}