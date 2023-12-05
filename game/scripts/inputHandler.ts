export default function setupMouseInputs(
    input: Phaser.Input.InputPlugin,
    camera: Phaser.Cameras.Scene2D.Camera) {

    input
    .on(
        Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE,
        (pointer: Phaser.Input.Pointer) => {
            if (!pointer.isDown) return;

            camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
            camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
        }
    )
    /*.on(
        Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
        (pointer: Phaser.Input.Pointer,objects:Phaser.GameObjects.GameObject)=>{    
            console.log(JSON.stringify(objects));
        }
    )*/
}