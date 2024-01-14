import Player from "./player";

export interface CardData {
    readonly id: string;
    readonly name: string;
    readonly cost:number;
    readonly owner:Player;
}