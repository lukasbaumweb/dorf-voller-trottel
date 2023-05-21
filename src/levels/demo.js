import { asGridCoord, withGrid } from "../utils";

export const demoLevel = {
  id: "DemoRoom",
  lowerSrc: "/assets/DemoLower.png",
  upperSrc: "/assets/DemoUpper.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: withGrid(0),
      y: withGrid(0),
    },
  },
  walls: {
    // [asGridCoord(7, 6)]: true,
    // [asGridCoord(8, 6)]: true,
    // [asGridCoord(7, 7)]: true,
    // [asGridCoord(8, 7)]: true,
    [asGridCoord(6, 5)]: true,
    [asGridCoord(6, 4)]: true,
    [asGridCoord(6, 3)]: true,
    [asGridCoord(6, 2)]: true,
  },
};
