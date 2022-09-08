
/* APP.JS */
import './App.css';
/*DATAS*/
import { wordsList } from './data/words';
/*REACT*/
import { useCallback, useEffect, useState } from 'react';
/*COMPONENTES*/
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'}
];

const guessesQty = 3;


function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

   
  const pickWordAndCategory = useCallback(() => {
    // picking a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    // picking a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  }, [words]);

  // Starting the game

  const startGame = useCallback(() => {

    // clearing all letters

    clearLetterStates();
    const {word, category} = pickWordAndCategory();

    // Crate an array of letters

    let wordLetters = word.split(''); // picking letter by letter
    wordLetters = wordLetters.map((l) => l.toLowerCase()) // pickup letter and pass to lowercase each one

    
    console.log(word, category)
    console.log(wordLetters)

    // Fill states

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters)

    setGameStage(stages[1].name);
    
  }, [pickWordAndCategory]);


  // Process letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been pressed

    if (guessedLetters.includes(normalizedLetter) ||
       wrongLetters.includes(normalizedLetter)
       ) {
        return;
       }
       // push guesses letter or remove a guess

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      
      setGuesses((actualGuesses) => actualGuesses - 1)
    }



  };
    const clearLetterStates = () => {
      setGuessedLetters([]);
      setWrongLetters([]);
    }
 // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {

      //reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    
    }
  }, [guesses])

  // check win condition

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    // win condition

    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore += 100);

      // restart with a new word

      startGame();
     

    }


  }, [guessedLetters, letters, startGame])

  // Recomeçar
  const retryGame = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name)
  };


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter} 
      PickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters} 
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
      {gameStage === 'end' && <GameOver retryGame={retryGame} score={score}/>}
    </div>
  );
}

export default App;
