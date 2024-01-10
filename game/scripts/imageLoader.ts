import { ASSETS } from "../enums/keys/assets";

export function loadImage(scene:Phaser.Scene, 
    imageObj: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image,
    cardType:string, 
    cardId: string,
    width:number,
    height:number
    ){
    const assetName=`${ASSETS.PORTRAIT}_${cardType}_${cardId}`;
    scene.load.image(assetName, `assets/portraits/${cardType.toLowerCase()}/${cardId}.png`);
    scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
        imageObj?.setTexture(assetName)
        .setOrigin(0.5)
        .setDisplaySize(width,height);
    });
    scene.load.start();

}