import { EffectData } from "./effectData";
import PlayerData from "../playerData";
import { UnitData } from "./unitData";

export type CardData = {
    /**
     * ID of this card as stored in the database
     */
    id: string;

    /**
     * Name of this card
     */
    name: string;

    /**
     * Spell, Unit or Hero
     */
    cardType: string,

    /**
     * Resources required to play this card
     */
    cost:number,

    /**
     * If effects linked to this card, this should show what the effects are.
     */
    description:string,

    /**
     * A list of effects if this card is a spell card, or a unit if it is a hero or unit card.
     */
    contents: UnitData | EffectData[]

    /**
     * Owner of this card
     */
    owner:PlayerData,

    /**
     * For deck building mechanic; this field determines which followers that can be put into deck.
     */
    followers?: string[]
}