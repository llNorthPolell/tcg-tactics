'use client';

import React, {useEffect, useRef} from 'react';

export default function GameCanvas(){
    const gameRef = useRef<Phaser.Game|null>(null);
    useEffect(() => {
        if (gameRef.current) return;
        import("./run").then( game=>
            gameRef.current = game.default()
        );
        return ()=>{
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    },[]);

    return (
        <div id="game"></div>
    )
}