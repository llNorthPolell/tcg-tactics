import { Position } from "@/game/data/types/position";
import Unit from "../units/unit";
import { LandmarkType } from "@/game/enums/landmarkType";
import Capturable from "./capturable";
import EffectProvider from "./effectProvider";

export default class Landmark{
    /**
     * True for capturable landmarks. Used for checking if landmark is a capturable-type
     */
    readonly capturable?:Capturable;

    /**
     * 
     */
    readonly effects?: EffectProvider;

    /**
     * The unit that is standing on this landmark
     */
    occupant?:Unit;

    constructor(    
        /**
            * Id for landmark (in type_x_y format)
            */
        public readonly id:string, 
        /**
         * Type of landmark (Stronghold, Outpost, Resource Node, etc.)
         */
        public readonly type:LandmarkType, 
        /**
         * Location of this landmark on the map (in tiles)
         */
        public readonly position:Position, 
        /**
         * Phaser.Tilemaps.Tile object from the landmark layer
         */
        public readonly tile: Phaser.Tilemaps.Tile, 
        capturable:boolean, 
        directCapturable:boolean=true
    ){
        this.capturable=(capturable)? new Capturable(this,directCapturable):undefined;

        if ([LandmarkType.STRONGHOLD, LandmarkType.OUTPOST, LandmarkType.CAMP].includes(type))
            this.effects=new EffectProvider(this);
    }
}