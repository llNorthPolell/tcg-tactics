import Unit from "../unit";

export default interface Landmark{
    readonly id:string;
    readonly x:number;
    readonly y:number;
    occupant?:Unit;
}