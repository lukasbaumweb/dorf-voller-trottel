export class Map {
  name = "No name";
  tiles = [];

  constructor({ name }) {
    if (name) this.name = name;
  }
}
