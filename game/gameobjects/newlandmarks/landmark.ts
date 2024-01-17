import { Position } from "@/game/data/types/position";
import Unit from "../units/unit";
import { LandmarkType } from "@/game/enums/landmarkType";

export default class Landmark{
    /**
     * Id for landmark (in type_x_y format)
     */
    readonly id:string;

    /**
     * Location of this landmark on the map (in tiles)
     */
    readonly position:Position;

    /**
     * Type of landmark (Stronghold, Outpost, Resource Node, etc.)
     */
    readonly type:LandmarkType;

    /**
     * Phaser.Tilemaps.Tile object from the landmark layer
     */
    readonly tile: Phaser.Tilemaps.Tile;

    /**
     * True for capturable landmarks. Used for checking if landmark is a capturable-type
     */
    readonly capturable:boolean;

    /**
     * The unit that is standing on this landmark
     */
    occupant?:Unit;

    constructor(id:string, type:LandmarkType, position:Position, tile:Phaser.Tilemaps.Tile, capturable:boolean){
        this.id=id;
        this.type=type;
        this.position=position
        this.tile=tile;
        this.capturable=capturable;

    }
}