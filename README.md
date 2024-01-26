# TCG Tactics
A trading card tactics game created using PhaserJS. 

### Disclaimer
I do not own most of the artwork in this project. The artwork in this project is meant to allow me to temporarily work on the game logic. Reusing the artwork directly from this project is strictly prohibited. Please support the original creators:

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
    - 1 healing light spell (restores 5 hp to the allied target, up to base HP)
    - 1 fireball spell (deals 2 damage to an enemy target and inflicts "burn", which will further deal 1 damage per turn for the next 3 turns)
    - 1 magic bomb spell (deals 2 damage to enemies within 1 tile)
    - 1 nature's blessing spell (restores 2 hp to all allied targets within 2 tiles)
    - 1 mage hero (ranged, moves 2 tiles and hits targets 2 tiles away), who is a deck leader (players start with the deck leader on the field)

2. Can capture landmarks by standing on them with the same unit for 3 turns
    - Strongholds 
        - starting building
        - generates 2 resources per turn
        - capturing strongholds also capture the surrounding rally points
        - grants ally occupant +2 PWR/DEF and restores 2hp at the start of each turn
        - normally capturing the opponent's stronghold should result in the occupying team winning the game. However, this is not implemented yet.

    - Outposts
        - generates 1 resource per turn
        - capturing outposts also capture the surrounding rally points
        - grants ally occupant +1 PWR/DEF and restores 1hp at the start of each turn

    - Resource Nodes
        - generates 1 resource per turn
    

3. Enemy 
    - has no decks at the moment, but they have a ranged class deck leader
    - AI will now capture the resource node to the east and then move south the turn after. AI will then pass for the rest of the game.


4. If the hand reaches the hand size limit of 9 cards, any new cards will automatically be discarded. However, if the new card is a hero card,
a window will popup prompting the user to discard a card from their hand to make room for the hero card. The user will be unable to act until
a card is discarded and the OK button is pressed.

