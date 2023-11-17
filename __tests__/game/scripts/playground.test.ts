
it("jest should work", ()=>{
    console.log("hello world");

    const expected = "hello world";
    const actual = "hello world";

    expect(expected).toBe(actual);
});