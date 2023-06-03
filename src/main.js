import { assetLoader } from "./config";
import { World } from "./entities/World";
import "./style.css";
// install plugins

(async () => {
  const world = new World();
  world.debug = true;

  await assetLoader();
  world.init(document);
})();
