import { invoke } from "@tauri-apps/api/core";
import { Terminal } from "@xterm/xterm";

// // Make the terminal fit all the window size
// export async function fitTerminal() {
//   fitAddon.fit();
//   void invoke<string>("async_resize_pty", {
//     rows: term.rows,
//     cols: term.cols,
//   });
// }

// Write data from pty into the terminal
export function writeToTerminal(term: Terminal, data: string) {
  return new Promise<void>((r) => {
    term.write(data, () => r());
  });
}

// Write data from the terminal to the pty
export function writeToPty(data: string) {
  void invoke("async_write_to_pty", {
    data,
  });
}
export function initShell() {
  invoke("async_create_shell").catch((error: any) => {
    // on linux it seem to to "Operation not permitted (os error 1)" but it still works because echo $SHELL give /bin/bash
    console.error("Error creating shell:", error);
  });
}

export async function readFromPty(term: Terminal) {
  const data = await invoke<string>("async_read_from_pty");

  console.log(data)

  if (data) {
    await writeToTerminal(term,data);
  }

  window.requestAnimationFrame(() =>readFromPty(term));
}

