import { scenePokemons } from '../data/scenePokemons.js';

export function BackgroundScene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-gradient scene-gradient-blue" />
      <div className="scene-gradient scene-gradient-sky" />
      <div className="scene-grid" />
      <div className="scene-wave scene-wave-top" />
      <div className="scene-wave scene-wave-bottom" />
      <div className="scene-outline scene-outline-left" />
      <div className="scene-outline scene-outline-right" />

      {scenePokemons.map((pokemon) => (
        <img
          key={pokemon.name}
          src={pokemon.image}
          alt=""
          className={`scene-pokemon ${pokemon.className}`}
        />
      ))}
    </div>
  );
}
