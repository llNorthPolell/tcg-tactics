import { TileStatus } from "../tileStatus";

export const TILE_COLORS = Object.freeze({
    success: 0x00FFF0,
    warning: 0xFFFF00,
    danger: 0xFF0000
})

export function getColorByStatus(status:TileStatus){
    switch (status){
        case TileStatus.SUCCESS:
            return TILE_COLORS.success;
        case TileStatus.WARNING:
            return TILE_COLORS.warning;
        case TileStatus.DANGER:
            return TILE_COLORS.danger;
    }
}