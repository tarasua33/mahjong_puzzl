// import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
// import { StandardContainer } from "../libs/gameObjects/StandardContainer";
// import { AudioManager } from "../libs/utils/AudioManager";
// import { MuteButton } from "../view/ui/MuteButton";

// interface IBuildConfig {
//   parent: StandardContainer;
// }

// export class MuteButtonFactory extends AbstractStandardFactory<MuteButton> {
//   public buildUi({ parent }: IBuildConfig): MuteButton {
//     const assetsLoader = this._assetsLoader;

//     const button = new MuteButton({
//       visible: true,
//       x: 50,
//       y: 50,
//       muteConfig: {
//         texture: assetsLoader.getTexture("ui/silent"),
//         anchor: { x: 0.5, y: 0.5 },
//       },
//       unmuteConfig: {
//         texture: assetsLoader.getTexture("ui/volume"),
//         anchor: { x: 0.5, y: 0.5 },
//       },
//       audio: AudioManager.getAudioManager(),
//     });

//     button.build();
//     parent.addChild(button);

//     return button;
//   }
// }
