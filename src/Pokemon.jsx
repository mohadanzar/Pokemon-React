import { useState, useEffect } from "react";
import "./index.css";
import PokemonCard from "./PokemonCards";

export const Pokemon = () => {  
    const [pokemon, setPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const API = "https://pokeapi.co/api/v2/pokemon?limit=150";

    const fetchPokemon = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API);
            const data = await response.json();

            const detailedPokemonData = data.results.map(async (curPokemon) => { 
                const response = await fetch(curPokemon.url);
                const data = await response.json();
                return data;
            });
                
            const detailedResponses = await Promise.all(detailedPokemonData); 
            setPokemon(detailedResponses);
        } catch (error) {
            console.log(error);
            setError('Failed to load Pokemon');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPokemon();
    }, []);

    const searchData = pokemon.filter((curPokemon) => {
        return curPokemon.name.toLowerCase().includes(search.toLowerCase());
    });

    return ( 
        <>   
        <section className="container">
            <header>
                <h1>Lets Catch Pokemon</h1>
            </header>
            <div className="pokemon-search">
                <input type="text" placeholder="Search Pokemon" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div>
                {error && <p className="error">{error}</p>}
                {isLoading ? (
                    <p>Loading Pokemon...</p>
                ) : (
                    <ul className="cards">
                        {searchData.map((curPokemon) => (
                            <PokemonCard 
                                key={curPokemon.id} 
                                pokemonData={curPokemon}
                            /> 
                        ))}
                    </ul>
                )}
            </div>
        </section>
        </>
    )
}

export default Pokemon;