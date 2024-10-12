import { useEffect, useRef, useState } from 'react';


function App() {
  const [query, setQuery] = useState('');
  const [characters, setCharacters] = useState([]);

  const myRef = useRef();

  useEffect(() => {
    myRef.current.focus()
  }, [])

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCharacters() {
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${query}`, { signal: controller.signal });
        const data = await response.json();
        setCharacters(data.results || []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      }
    }

    if (query) {
      fetchCharacters();
    }

    return () => controller.abort();
  }, [query]);

  const changeHandler = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="bg-black text-white min-h-screen py-8">
      <div className="max-w-3xl mx-auto p-4">
        <input
          type="text"
          placeholder="Search Characters"
          className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
          onChange={changeHandler}
          value={query}
          ref={myRef}
        />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div key={character.id} className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <img src={character.image} alt={character.name} className="w-24 h-24 rounded-full mx-auto border-2 border-indigo-500" />
              <h3 className="text-center text-xl font-bold mt-4 font-sans">{character.name}</h3>
              <p className="text-center text-gray-400 font-light">{character.species}</p>
              <p className={`text-center mt-2 text-sm ${character.status === 'Alive' ? 'text-green-400' : 'text-red-400'}`}>
                {character.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;