use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

/// Outputs a JSON with this schema:
/// ```json
/// {
///     "blockdevices": [
///        {
///           "name": "/dev/sda",
///           "size": "894,3G"
///        }
///     ]
///  }
/// ```
#[tauri::command]
async fn get_blockdevices() -> String {
    let output = Command::new("lsblk")
        .arg("-p")
        .arg("-n")
        .arg("--json")
        .arg("--filter='TYPE == \"disk\"'")
        .arg("-o")
        .arg("NAME,SIZE")
        .output()
        .expect("failed to fetch disks")
        .stdout;
    let output_str = String::from_utf8(output).expect("failed to parse output as UTF-8");
    return dbg!(output_str);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_blockdevices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
