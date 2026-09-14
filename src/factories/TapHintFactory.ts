// import { GAME_DIMENSIONS } from "../Game";
// import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
// import { StandardContainer } from "../libs/gameObjects/StandardContainer";
// import { TapHint } from "../view/ui/TapHint";

// interface IBuildConfig {
// 	parent: StandardContainer;
// }

// export class TapHintFactory extends AbstractStandardFactory<TapHint> {
// 	public buildUi({ parent }: IBuildConfig): TapHint {
// 		const hint = new TapHint({
// 			visible: false,
// 			x: GAME_DIMENSIONS.halfWidth,
// 			y: GAME_DIMENSIONS.height - 100,
// 			duration: 1.0,
// 			size: { width: 100, height: 100 },
// 			textConfig: {
// 				text: "TAP TO JUMP",
// 				alpha: 0.75,
// 				anchor: { x: 0.5, y: 0.5 },
// 				y: -100,
// 				styleOptions: {
// 					fontFamily: "Verdana, sans-serif",
// 					fontSize: 30,
// 					align: "center",
// 					fontWeight: "bolder",
// 					fill: 0xffffff,
// 				},
// 			},
// 		});

// 		hint.build();
// 		parent.addChild(hint);

// 		return hint;
// 	}
// }
