// // import * as PIXI from "pixi.js";
// import { sound } from "@pixi/sound";

// export enum Sounds {
//   Bg = "bg",
//   Fail = "fail",
//   LoseScreen = "loseScreen",
//   Win = "win",
//   WinScreen = "winScreen",
// }

// export class AudioManager {
//   static instance: AudioManager;
//   static getAudioManager(): AudioManager {
//     if (!AudioManager.instance) {
//       AudioManager.instance = new AudioManager();
//     }
//     return AudioManager.instance;
//   }

//   public async initAudio(): Promise<boolean> {
//     const ctx = sound.context.audioContext;
//     if (ctx.state === "suspended") {
//       ctx.resume();
//     }

//     sound.add("bg", "/audio/bg-music.mp3");

//     sound.add("fail", "/audio/fail.mp3");
//     sound.add("loseScreen", "/audio/lose_screen.mp3");

//     sound.add("win", "/audio/win.mp3");
//     sound.add("winScreen", "/audio/win_screen.mp3");

//     return true;
//   }

//   public play(name: string, volume = 0.4, loop?: boolean): void {
//     sound.play(name, { loop, volume });
//   }

//   public toggleMuteAll(mute: boolean): void {
//     if (mute) {
//       sound.muteAll();
//     } else {
//       sound.unmuteAll();
//     }
//   }
// }
