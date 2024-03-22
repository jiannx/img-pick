// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod image;
pub use crate::image::get_image_base64;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_base64(path: &str, size: u32, quality: u8)-> String {
    // format!("Hello, {}! 23232", name)
    get_image_base64(path, size, quality)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_base64
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
