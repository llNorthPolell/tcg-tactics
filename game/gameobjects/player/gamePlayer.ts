import Player from "@/game/data/playerData";
import ResourceManager from "./resourceManager";
import UnitManager from "./unitManager";
import LandmarkManager from "./landmarkManager";
import CardManager from "./cardManager";
import Deck from "../cards/deck";

export default class GamePlayer{
    /**
     * Name of this player
     */
    readonly name: string;

    /**
     * Resource manager for access to generate and spend resources, and get resources on hand
     */
    readonly resources:ResourceManager;

    /**
     * Unit manager for access to active units, heroes, and the player's graveyard
     */
    readonly units:UnitManager;

    /**
     * Landmark manager for access to owned landmarks
     */
    readonly landmarks:LandmarkManager;

    /**
     * Card manager for access to deck and hand
     */
    readonly cards: CardManager;

    constructor(
        /**
         * Id of this player (in game)
         */
        readonly id : number,
        playerInfo:Player, 
        /**
         * Color representing player's team
         */
        readonly color: number, 
        /**
         * Number representing which team this player is on
         */
        private team: number,
        deck:Deck, 
        /**
         * If true, UI will update accordingly with this player's information
         */
        readonly isDevicePlayer:boolean=false
    ){
        this.name=playerInfo.name;

        this.resources=new ResourceManager(this);
        this.units=new UnitManager(this);
        this.landmarks=new LandmarkManager(this);
        this.cards=new CardManager(this,deck);

        deck.getCards().forEach(
            card=>{
                card.setOwner(this);
            }
        );

        deck.getLeader().setOwner(this);
    }

    /**
     * Sets the player's team number
     * @param team Number representing which team this player is on
     */
    setTeam(team:number){
        this.team=team;
    }

    /**
     * @returns Number representing which team this player is on
     */
    getTeam():number{
        return this.team;
    }
}