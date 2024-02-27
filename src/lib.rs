mod cube;
mod moves;
mod utils;

use crate::cube::{facelet::FaceletCube, solvers::pochmann::solve, sub::SubCube};
use std::collections::HashMap;
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
    validate_cube(&cube)?;
    match solve(&SubCube::from(cube.parse::<FaceletCube>()?)) {
        Some(solution) => Ok(solution
            .into_iter()
            .map(|mv| JsValue::from_str(&format!("{}", mv)))
            .collect::<js_sys::Array>()),
        None => Err(JsValue::from_str("Cube is unsolveable")),
    }
}

fn validate_cube(cube: &str) -> Result<(), JsValue> {
    // Validate the cube string
    if cube.len() != 54 {
        return Err(JsValue::from_str("Cube must be 54 characters long"));
    }

    // Validate the cube string contains only valid characters
    for (idx, c) in cube.chars().enumerate() {
        if !matches!(c, 'W' | 'R' | 'G' | 'Y' | 'O' | 'B') {
            return Err(JsValue::from_str(&format!(
                "Cube must only at {} index, not '{}' contain W, R, G, Y, O, B",
                idx, c
            )));
        }
    }

    // Validate the cube string contains 9 of each color
    let mut counter = HashMap::with_capacity(6);

    cube.chars()
        .fold(&mut counter, |acc, c| {
            *acc.entry(c).or_insert(0) += 1;
            acc
        })
        .values()
        .all(|&v| v == 9)
        .then_some(Ok(()))
        .unwrap_or_else(|| Err(JsValue::from_str("Cube must contain 9 of each color")))
}
