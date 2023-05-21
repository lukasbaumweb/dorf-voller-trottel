import { World } from "./entities/World";
import "./style.css";

(async () => {
  const world = new World();
  world.debug = true;
  await world.init(document);
})();
