import { Resources } from "@/game/data/types/resources";
import GamePlayer from "./gamePlayer";
import { LandmarkType } from "@/game/enums/landmarkType";
import { GAME_CONSTANT } from "@/game/enums/keys/gameConstants";

export default class ResourceManager{
    /**
     * Current resources on hand
     */
    private currResource: number;

    /**
     * Maximum resources player can hold on hand
     */
    private maxResource:number;

    constructor(
        /**
         * Reference to parent
         */
        public readonly player:GamePlayer
    ){
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
        const strongholds = this.player.landmarks.get(LandmarkType.STRONGHOLD)!.length;
        const outposts = this.player.landmarks.get(LandmarkType.OUTPOST)!.length;
        const resourceNodes = this.player.landmarks.get(LandmarkType.RESOURCE_NODE)!.length
        console.log(`${this.player.name} owns: {Strongholds:${strongholds}, Outposts = ${outposts}, resource nodes = ${resourceNodes}}`)
        return (strongholds * 2) +
            outposts +
            resourceNodes;
    }
}