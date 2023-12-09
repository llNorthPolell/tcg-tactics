export const PLAYER_TINTS = Object.freeze({
    PLAYER1: 0x0000ff,
    PLAYER2: 0xff0000,
    PLAYER3: 0x00BCAC,
    PLAYER4: 0xffff00,
    NEUTRAL: 0x000000
})

export function getPlayerColor(index:number):number{
    switch (index){
        case 1:
            return PLAYER_TINTS.PLAYER1;
        case 2:
            return PLAYER_TINTS.PLAYER2;
        case 3:
            return PLAYER_TINTS.PLAYER3;
        case 4:
            return PLAYER_TINTS.PLAYER4;
        default:
            return PLAYER_TINTS.NEUTRAL;
    }

}