// import { FederatedPointerEvent } from "pixi.js";
// import {
//   StandardContainer,
//   StandardContainerConfig,
// } from "../../libs/gameObjects/StandardContainer";
// import {
//   StandardSprite,
//   StandardSpriteConfig,
// } from "../../libs/gameObjects/StandardSprite";
// import { AudioManager } from "../../libs/utils/AudioManager";
// import { getCircle } from "../../libs/utils/GameHelper";
// import { ViewPort } from "../../libs/gameObjects/IGameObject";
// import { GAME_DIMENSIONS } from "../../Game";

// export interface MuteButtonConfig extends StandardContainerConfig {
//   muteConfig: StandardSpriteConfig;
//   unmuteConfig: StandardSpriteConfig;
//   audio: AudioManager;
// }

// const OFFSET = 75;

// export class MuteButton extends StandardContainer<MuteButtonConfig> {
//   private _mute!: StandardSprite;
//   private _unmute!: StandardSprite;

//   public build(): void {
//     const { muteConfig, unmuteConfig } = this._config;

//     const mute = (this._mute = new StandardSprite(muteConfig));
//     mute.build();
//     mute.visible = false;

//     const unmute = (this._unmute = new StandardSprite(unmuteConfig));
//     unmute.build();

//     const backCircle = getCircle(
//       mute.width * 2 - 2,
//       mute.height * 2 - 2,
//       0xffffff,
//     );
//     backCircle.x = -1;
//     backCircle.y = -1;
//     backCircle.pivot.x = backCircle.width / 2;
//     backCircle.pivot.y = backCircle.height / 2;
//     backCircle.scale.set(0.5);
//     backCircle.interactive = true;
//     backCircle.eventMode = "static";
//     backCircle.alpha = 0.5;
//     backCircle.on("pointerdown", this._switchMute.bind(this));

//     this.addChild(backCircle);
//     this.addChild(mute);
//     this.addChild(unmute);
//   }

//   public _switchMute(event: FederatedPointerEvent): void {
//     event.stopPropagation();
//     event.stopImmediatePropagation();

//     this._mute.visible = !this._mute.visible;
//     this._unmute.visible = !this._unmute.visible;

//     this._config.audio.toggleMuteAll(this._mute.visible);
//   }

//   public resize(viewPort?: ViewPort): void {
//     this.x =
//       GAME_DIMENSIONS.width +
//       (viewPort!.w - GAME_DIMENSIONS.width) / 2 -
//       OFFSET;
//     this.y = -((viewPort!.h - GAME_DIMENSIONS.height) / 2) + OFFSET;

//     console.log(GAME_DIMENSIONS);
//     console.log(viewPort);
//     console.log(this.y);
//   }
// }
