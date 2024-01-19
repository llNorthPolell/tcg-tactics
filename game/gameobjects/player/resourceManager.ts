import { Resources } from "@/game/data/types/resources";
import GamePlayer from "./gamePlayer";
import { LandmarkType } from "@/game/enums/landmarkType";
import { GAME_CONSTANT } from "@/game/enums/keys/gameConstants";

export default class ResourceManager{
    /**
     * Reference to parent
     */
    readonly player:GamePlayer;

    /**
     * Current resources on hand
     */
    private currResource: number;

    /**
     * Maximum resources player can hold on hand
     */
    private maxResource:number;

    constructor(player:GamePlayer){
        this.player=player;
        this.currResource=0;
        this.maxResource=1;
    }

    /**
     * Gives the player the specified amount of resources
     * @param income Amount of resources to give to this player
     */
    generate(income: number){
        let newCurrentResource = this.currResource + income;
        if (newCurrentResource>this.maxResource)
            newCurrentResource=this.maxResource;

        this.currResource=newCurrentResource;
    }

    /**
     * Increase limit (at the start of every turn, up to 10)
     */
    increaseMax(){
        if (this.maxResource<GAME_CONSTANT.RESOURCE_LIMIT)
            this.maxResource++;
    }

    /**
     * Reduces the number of resources from the player's hand
     * @param cost Amount of resources to consume
     * @throws Error when consuming more resources than on hand
     */
    spend(cost:number) {
        if (cost > this.currResource) 
            throw new Error("Not enough resources");

        this.currResource -= cost;
    }


    /**
     * @returns resources on hand and the maximum resources the player can hold
     */
    get():Resources{
        return {
            current: this.currResource,
            max: this.maxResource
        }
    }

    /**
     * @returns Calculated resource income per turn from landmarks
     */
    calculateIncome(){
        return this.player.landmarks.get(LandmarkType.STRONGHOLD)!.length * 2 +
            this.player.landmarks.get(LandmarkType.OUTPOST)!.length +
            this.player.landmarks.get(LandmarkType.RESOURCE_NODE)!.length;
    }
}