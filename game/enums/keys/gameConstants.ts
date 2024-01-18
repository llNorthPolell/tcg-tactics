export const GAME_CONSTANT = Object.freeze({
    /**
     * Maximum hand size. Once hand size reaches this value, the discard window will 
     * open whenever the user obtains another card (either from drawing or from effects).
     */
    MAX_HAND_SIZE: 9,

    /**
     * Maximum range from the nearest controlled hero that the player can play their spell
     * cards. 
     */
    MAX_SPELL_RANGE: 2,

    /**
     * The resource limit. Players cannot store more than this amount at any time.
     */
    RESOURCE_LIMIT: 10,


    /**
     * Number of turns to capture a capturable landmark.
     */
    LANDMARK_CAPTURE_TURNS: 3,

});