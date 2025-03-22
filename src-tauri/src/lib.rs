use zbus::zvariant;


// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
async fn get_blockdevices() -> Vec<String> {
    let connection =  zbus::Connection::system().await.expect("Failure connecting to system dbus");
    let udisks = zbus::Proxy::new(
        &connection, "org.freedesktop.UDisks2", "/org/freedesktop/UDisks2/Manager", "org.freedesktop.UDisks2.Manager").await.expect("Failed getting UDisks DBus interface");
    let block_devices = udisks.call_method("GetBlockDevices", &std::collections::HashMap::<String, zvariant::Value>::new()).await.expect("Failed getting block devices");
    let body = block_devices.body();
    let resp: Vec<zvariant::ObjectPath> = body.deserialize().expect("Failed getting devices from dbus response");
    resp.iter().map(|e| e.to_string()).collect()
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_blockdevices
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}