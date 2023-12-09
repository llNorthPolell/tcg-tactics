import Landmark from "./landmark";
import RallyPoint from "./rallyPoint";

export default interface ParentLandmark extends Landmark {
    linkRallyPoints(rallyPoints:RallyPoint[]):void;
    getRallyPoints():RallyPoint[];
}