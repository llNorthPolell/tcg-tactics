import Unit from "../unit";

export default interface Landmark{
    /**
     * id for landmark (in type_x_y format)
     */
    readonly id:string;

    /**
     * x value (in tiles)
     */
    readonly x:number;

    /**
     * y value (in tiles)
     */
    readonly y:number;

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

    /**
     * Called when unit enters a landmark and stays. Applies skill effects and sets occupant to unit.
     */
    enter(unit:Unit):void;

    /**
     * Called when unit leaves a landmark. Removes skill effects.
     */
    leave():void;
}