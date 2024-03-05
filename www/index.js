import * as wasm from "wasm-rubiks-cube-solver";

let solved = wasm.solve_cube("OGOYWWWWYRBYRRRORRORBYGGWOBBWYBYYRWWWBBGOOGORGOGBBYGGY");
let solved_text = JSON.stringify(solved);
console.log(solved_text);
// alert(solved_text);
