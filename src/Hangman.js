import React, { Component } from 'react';
import { randomWord } from './words';
import './Hangman.css';
import img0 from './0.jpg';
import img1 from './1.jpg';
import img2 from './2.jpg';
import img3 from './3.jpg';
import img4 from './4.jpg';
import img5 from './5.jpg';
import img6 from './6.jpg';

class Hangman extends Component {
  /** by default, allow 6 guesses and use provided gallows images. */
  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6],
  };

  constructor(props) {
    super(props);
    this.state = { nWrong: 0, guessed: new Set(), answer: randomWord() };
    this.handleGuess = this.handleGuess.bind(this);
    this.reset = this.reset.bind(this);
  }

  /** isGameOver: return true when player run out game lives */
  isGameOver() {
    return this.state.nWrong >= this.props.maxWrong;
  }

  /** reset: restart the game:
    - pick a new random word
    - reset the guessed list
    - reset the number of wrong guesses
   */
  reset() {
    this.setState({
      nWrong: 0,
      guessed: new Set(),
      answer: randomWord(),
    });
  }

  /** guessedWord: show current-state of word:
    if guessed letters are {a,p,e}, show "app_e" for "apple"
  */
  guessedWord() {
    return this.state.answer
      .split('')
      .map((ltr) => (this.state.guessed.has(ltr) ? ltr : '_'));
  }

  /** handleGuest: handle a guessed letter:
    - add to guessed letters
    - if not in answer, increase number-wrong guesses
  */
  handleGuess(evt) {
    let ltr = evt.target.value;
    this.setState((st) => ({
      guessed: st.guessed.add(ltr),
      nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1),
    }));
  }

  /** generateButtons: return array of letter buttons to render */
  generateButtons() {
    return 'abcdefghijklmnopqrstuvwxyz'.split('').map((ltr) => (
      <button
        value={ltr}
        key={ltr}
        onClick={this.handleGuess}
        disabled={this.state.guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  }

  /** generateGameState: return game state:
    - display buttons if it is still playing
    - hidden buttons:
      - if player lose (run out allowed wrongs)
      - if player win (guessed the word) 
   */
  generateGameState() {
    const isWinner = this.guessedWord().join('') === this.state.answer;
    let gameState = this.generateButtons();
    if (isWinner) gameState = 'You Win!';
    if (this.isGameOver()) gameState = 'You Lose!';

    return gameState;
  }

  /** render: render game */
  render() {
    const altText = `${this.state.nWrong}/${this.props.maxWrong} guesses`;

    return (
      <div className="Hangman">
        <h1>Hangman</h1>
        <img src={this.props.images[this.state.nWrong]} alt={altText} />
        <p>Guessed Wrong: {this.state.nWrong}</p>
        <p className="Hangman-word">
          {!this.isGameOver() ? this.guessedWord() : this.state.answer}
        </p>
        <p className="Hangman-btns">{this.generateGameState()}</p>
        <button id="reset" onClick={this.reset}>
          Restart?
        </button>
      </div>
    );
  }
}

export default Hangman;
