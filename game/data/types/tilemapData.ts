export type TilemapData = {
    map: Phaser.Tilemaps.Tilemap,
    layers:{
        ground: Phaser.Tilemaps.TilemapLayer,
        decoration: Phaser.Tilemaps.TilemapLayer,
        obstacle: Phaser.Tilemaps.TilemapLayer,
        landmarks:Phaser.Tilemaps.TilemapLayer,
        playerStarts: Phaser.Tilemaps.ObjectLayer
    }
}