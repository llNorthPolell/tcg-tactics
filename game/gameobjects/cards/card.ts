import Unit from "../unit";
import SkillEffect from "../../scripts/skillEffects/skillEffect";

export interface Card {
    readonly id: string;

    setPosition : (x:number,y:number)=>void;

    play: ()=> Unit | SkillEffect[];

    render: (scene:Phaser.Scene)=>Phaser.GameObjects.Container;

}