import React, { useEffect, useState } from 'react';
import './Pokecard.css';

const POKE_API_IMAGE = 'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/';
const POKE_API_DATA = 'https://pokeapi.co/api/v2/pokemon/';
const padToThree = (number) => (number <= 999 ? `00${number}`.slice(-3) : number);

const typeColors = {
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  normal: '#A8A878'
};

const typeIcons = {
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  grass: "🌿",
  psychic: "🔮",
  bug: "🐛",
  poison: "☠️",
  normal: "🔘",
  flying: "🕊️",
  rock: "🪨",
  ground: "🌍",
  ghost: "👻",
  ice: "❄️",
  dragon: "🐉",
  dark: "🌑",
  steel: "⚙️",
  fairy: "✨",
  fighting: "🥊"
};

function Pokecard({ id, name, type, exp }) {
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    async function fetchAbilitiesWithDescriptions() {
      try {
        const res = await fetch(`${POKE_API_DATA}${id}`);
        const data = await res.json();

        const abilityPromises = data.abilities.map(async (abilityObj) => {
          const abilityRes = await fetch(abilityObj.ability.url);
          const abilityData = await abilityRes.json();
          const englishEntry = abilityData.effect_entries.find(
            entry => entry.language.name === 'en'
          );

          return {
            name: abilityObj.ability.name,
            description: englishEntry ? englishEntry.short_effect : 'No description available.'
          };
        });

        const abilitiesDetailed = await Promise.all(abilityPromises);
        setAbilities(abilitiesDetailed);
      } catch (error) {
        console.error('Error fetching abilities:', error);
      }
    }

    fetchAbilitiesWithDescriptions();
  }, [id]);

  const imgSrc = `${POKE_API_IMAGE}${padToThree(id)}.png`;
  const backgroundColor = typeColors[type] || '#ddd';
  const typeIcon = typeIcons[type] || "❔";

  return (
    <div className="Pokecard" style={{ backgroundColor }}>
      <div className="Pokecard-header">
        <span className="Pokecard-name">{name}</span>
        <div className="Pokecard-hp-type">
            <span className="Pokecard-hp">HP {exp}</span>
            <span className="Pokecard-type-icon">{typeIcon}</span>
        </div>
       </div>
      <img src={imgSrc} alt={name} />
      <div className="Pokecard-data">Type: {type}</div>
      <div className="Pokecard-data">EXP: {exp}</div>

      <div className="Pokecard-abilities">
        <h3 className="Pokecard-abilities-title">Abilities:</h3>
        {abilities.length === 0 ? (
          <p className="Pokecard-ability">Loading...</p>
        ) : (
          abilities.slice(0, 2).map((a, i) => (
            <div className="Pokecard-ability" key={i}>
              <div className="ability-name">{a.name}</div>
              <div className="ability-desc">{a.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Pokecard;
