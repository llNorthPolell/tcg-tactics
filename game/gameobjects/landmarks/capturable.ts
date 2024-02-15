import { GAME_CONSTANT } from "@/game/enums/keys/gameConstants";
import GamePlayer from "../player/gamePlayer";
import Landmark from "./landmark";
import { LandmarkType } from "@/game/enums/landmarkType";

export default class Capturable{

    /**
     * Capturing this landmark will capture linked landmarks.
     * Mainly used for linking Strongholds/Outposts to rally points. 
     */
    readonly linkedLandmarks:Landmark[]

    /**
     * Player who controls this landmark
     */
    private owner?:GamePlayer;

    /**
     * Keeps track of number of turns in attempting to capture a landmark.
     */
    private captureTick:number;

    constructor(
        /**
         * Reference to parent
         */
        private readonly landmark:Landmark,
        /**
         * If true, landmark can be captured normally by a unit waiting on it for 3 turns. 
         * In the case of a rally point, this value is false as unit must capture nearby stronghold/outpost.
         */
        private directCapture:boolean=true
    ){
        this.captureTick=0;
        this.linkedLandmarks=[];

        this.directCapture=directCapture;
    }

    /**
     * Sets the owner of this landmark
     * @param owner Owner of this landmark
     */
    setOwner(owner:GamePlayer){
        this.owner=owner;
    }

    /**
     * @returns Owner of this landmark
     */
    getOwner(){
        return this.owner;
    }

    /**
     * Links the provided rally points to this landmark.
     * @param landmark A capturable landmark
     */
    linkRallyPoints(rallyPoints:Landmark[]){
        rallyPoints.forEach(
            rallyPoint=>{
                if (rallyPoint.type !== LandmarkType.RALLY_POINT) 
                    throw new Error(`Failed to link rally point;${rallyPoint.id} is not a rally point.`);
                this.linkedLandmarks.push(rallyPoint);
            }
        );   
    }

    /**
     * @returns List of landmarks linked to this one
     */
    getLinkedLandmarks(){
        return this.linkedLandmarks;
    }

    /**
     * Will increment captureTick. If captureTick reaches the limit, the landmark will be transfered to the occupant's owner.
     * @returns True when the landmark has been captured. False if the unit has 
     * not taken 3 turns to capture this landmark yet.
     */
    attemptCapture():boolean{
        if(!this.directCapture) return false;

        const occupant = this.landmark.occupant;
        if(!occupant) return false;

        const unitOwner = occupant.getOwner();
        if(!unitOwner) return false;
        if(unitOwner == this.owner) return false;

        this.captureTick++;
        if (this.captureTick < GAME_CONSTANT.LANDMARK_CAPTURE_TURNS){
            console.log(`${occupant.name} has attempted to capture ${this.landmark.id}. 
                ${GAME_CONSTANT.LANDMARK_CAPTURE_TURNS-this.captureTick} turns until capture...`);
            return false;
        }

        this.capture(unitOwner);
        return true;
    }

    /**
     * Gives control of this landmark and its linked landmarks to the specified player. Bypasses need to wait
     * 3 turns if calling this function directly (for rally points and story events).
     * @param owner Player who has gained control of this landmark
     */
    capture(owner:GamePlayer){
        this.setOwner(owner);
        this.landmark.tile.tint = owner.color;
        this.linkedLandmarks.forEach(
            linkedLandmark=> {
                linkedLandmark.capturable!.capture(owner);
            }
        );
    }

    /**
     * Resets captureTick to 0
     */
    resetCapture(){
        if(!this.directCapture) return false;
        this.captureTick=0;
    }
}