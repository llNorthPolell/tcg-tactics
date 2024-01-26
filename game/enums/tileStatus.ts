import { AMITY_COLORS } from "./keys/amityColors";

export enum TileStatus{
    SUCCESS,
    WARNING,
    DANGER
}


export function getColorByTileStatus(status:TileStatus){
    switch (status){
        case TileStatus.SUCCESS:
            return AMITY_COLORS.success;
        case TileStatus.WARNING:
            return AMITY_COLORS.warning;
        case TileStatus.DANGER:
            return AMITY_COLORS.danger;
        default:
            return AMITY_COLORS.none;
    }
}