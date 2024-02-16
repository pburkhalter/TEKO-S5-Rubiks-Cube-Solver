mod utils;
mod cube;
mod cubie_cube;
mod facelet_cube;
mod moves;
mod pochmann_solver;


use crate::cubie_cube::CubieCube;
use crate::facelet_cube::FaceletCube;

use crate::pochmann_solver::solve;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, rubiks-cube-solver!");
}

#[wasm_bindgen]
pub fn solve_cube(cube: String) -> Result<js_sys::Array, JsValue> {
    match solve(&CubieCube::from(cube.parse::<FaceletCube>()?)) {
        Some(solution) => Ok(solution
            .into_iter()
            .map(|mv| JsValue::from_str(&format!("{}", mv)))
            .collect::<js_sys::Array>()),
        None => Err(JsValue::from_str("Cube is unsolveable")),
    }
}