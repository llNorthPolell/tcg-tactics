import { Position } from "@/game/data/types/position";
import { inRange } from "@/game/scripts/util";

// TODO: Diagonal range logic

it("Should be in range when range is 5, you are at (0,0), and target is 5 tiles west", ()=>{
    const current: Position = {x:0, y:0};
    const target: Position = {x:-5,y:0};
    const range = 5;

    const result = inRange(current,target, range);

    expect(result).toBe(true);
});

it("Should be in range when range is 5, you are at (0,0), and target is 5 tiles north", ()=>{
    const current: Position = {x:0, y:0};
    const target: Position = {x:0,y:-5};
    const range = 5;

    const result = inRange(current,target, range);

    expect(result).toBe(true);
});

it("Should be in range when range is 5, you are at (0,0), and target is 5 tiles east", ()=>{
    const current: Position = {x:0, y:0};
    const target: Position = {x:5,y:0};
    const range = 5;

    const result = inRange(current,target, range);

    expect(result).toBe(true);
});


it("Should be in range when range is 5, you are at (0,0), and target is 5 tiles south", ()=>{
    const current: Position = {x:0, y:0};
    const target: Position = {x:0,y:5};
    const range = 5;

    const result = inRange(current,target, range);

    expect(result).toBe(true);
});

it("Should be in range when range is 5, you are at (0,0), and target is at (-1,4)", ()=>{
    const current: Position = {x:0, y:0};
    const target: Position = {x:0,y:5};
    const range = 5;

    const result = inRange(current,target, range);

    expect(result).toBe(true);
});

it("Should not be in range when range is 5, you are at (0,0), and target is at (-2,4)", ()=>{
    const current: Position = {x:0, y:0};
    const target: Position = {x:0,y:5};
    const range = 5;

    const result = inRange(current,target, range);

    expect(result).toBe(false);
});
