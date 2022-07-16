const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

function enter() {
    return prompt("[ENTER]");
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

let a = [1,2,3, [4,5,6]];
let b = [1,2,3];
let c = [[4,5,6]];

// console.log(arrayEquals(a,b));
// console.log(arrayEquals(a,c));
console.log(a.includes([4,5,6]));
