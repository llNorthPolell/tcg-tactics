# TCG Tactics
A trading card tactics game created using PhaserJS. 

### Disclaimer
I do not own the artwork in this project. The artwork in this project is meant to allow me to temporarily work on the game logic. Reusing the artwork directly from this project is strictly prohibited. Please support the original creators:

- Tilemaps - IrishTorch (https://opengameart.org/content/16x16-pixel-art-tiles)
- Class Icons - Clint Bellanger (https://opengameart.org/content/powers-icons) 
- Misc Icons - Lorc / Slipyx (https://opengameart.org/content/700-rpg-icons)
- Spell Cards Images - eleazzaar / Manveru (https://opengameart.org/content/attack-icons-wesnoth)
- Portraits 
    - Corax Digital Art (https://coraxdigitalart.itch.io/500-fantasy-character-portraits-realistic-human-heroes)
    - jacksonnevins (https://jacksonnevins.itch.io/rpg-character-portraits-megapack-1)



**Images Created By Me:**
- Tower class icon 
- Your Turn / Opponent's Turn transition images 
- Landmarks



## Live Demo
A live demo can be found in the following link on Github Pages:
https://llnorthpolell.github.io/tcg-tactics/ 

### Features
1. Play with a fixed deck containing
    - a soldier class hero card (currently does not do anything unique yet)
    - 3 soldier class unit cards (melee, moves 3 tiles)
    - 2 archer class unit cards (ranged, moves 2 tiles and hits targets 3 tiles away)
    - 1 guardian class unit card (melee tanks, moves 1 space, takes 20% less damage)
    - 1 healing spell (heals 10 hp, up to a unit's starting HP)
    - 1 burn spell (deals 1 damage to the target every turn for the next 3 turns)
    - 1 mage hero (ranged, moves 2 tiles and hits targets 2 tiles away), who is a deck leader (players start with the deck leader on the field)

2. Can capture landmarks by standing on them with the same unit for 3 turns
    - Strongholds 
        - starting building
        - generates 2 resources per turn
        - capturing strongholds also capture the surrounding rally points

    - Outposts
        - generates 1 resource per turn
        - capturing outposts also capture the surrounding rally points

    - Resource Nodes
        - generates 1 resource per turn
    

3. Enemy 
    - has no decks at the moment, but they have a ranged class deck leader
    - will automatically pass for now (AI in progress once more game mechanics in place)
