import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            soundPrefix: props.soundPrefix,
            numSounds: props.numSounds,
            question: null,
            experimentOne: [],
            experimentTwo: {},
            sounds: [],
            running: false,
        }
        this.start = this.start.bind(this);
        this.experimentOneSetup = this.experimentOneSetup.bind(this);
        this.advanceExperimentOne = this.advanceExperimentOne.bind(this);


    }

    getAssets() {
        let sounds = [];

        let num = Number(this.state.numSounds) + 1;
        for (let i = 1; i < num; i++) {
            let a = document.createElement('audio');
            a.src = './wavs/' + this.state.soundPrefix + i + '.wav';
            a.load();


            sounds.push(a);
        }

        this.setState({sounds: sounds});

    }

    bButton() {
        return (
            <button onClick={this.advanceExperimentOne}>/b/</button>
        )
    }

    pButton() {
        var self = this;
        return (
            <button onClick={self.advanceExperimentOne}>/p/</button>
        )
    }

    setup() {
        console.log("Setup");
    }

    componentDidMount() {
        this.setup();
    }

    componentWillMount() {
        this.getAssets();
    }

    start() {
        // let self = this;
        this.setState({running: true});

        // console.log(this.createPermutations(this.state.sounds, self.createPairs));
        // console.log(self.createPairs(this.createPermutations(this.state.sounds)));
        this.experimentOneSetup();

    }

    experimentOneSetup() {
        let self = this;
        let array = [];
        let sounds = this.state.sounds;
        for (var i = 0; i < 5; i++) {
            for (var x = 0; x < sounds.length; x++) {
                array.push(sounds[x]);
            }
        }
        array = this.shuffle(array, function (ret) {
            self.setState({experimentOne: ret, question:1}, function () {
                self.runExperimentOne();
            })
        });


        console.log('run');

    }

    advanceExperimentOne() {
        console.log("Advance");
        console.log(this.state.question+1);
        this.setState({question: this.state.question + 1});
        this.runExperimentOne();
    }

    runExperimentOne() {
        let question = this.state.question || 1;

        console.log(this.state.experimentOne);
        console.log(question);
        if (question < this.state.experimentOne.length) {
            this.experimentOnePlay(question);
            console.log('play');
        } else {
            //End
        }

    }

    experimentOnePlay(question) {
        console.log('experiment1');
        let audio = this.state.experimentOne[question - 1];
        console.log(audio.src);
        audio.play();
    }

    experimentTwo() {
        /**
         * Create Random pairs of Stimuli - each stimuli should be repeated 5 times for a total of 50
         * Data Structure:
         * Array of JSON Objects
         * [
         * {firstSound: foo, secondSound: bar}
         * ]
         * First task - create a list of all permutations
         */

    }

    createPairs(array, callback) {
        let self = this;
        let newArray = [];
        array.map(function (obj) {

            for (let i = 0; i < 10; i++) {
                obj.sound2 = self.state.sounds[i].src;
                newArray.push(obj);
                // console.log(obj);
            }
        })
        return newArray;


    }

    createPermutations(array, callback) {
        let returnArray = [];
        array.map(function (obj) {
            let keyValues = [];
            for (var i = 0; i < 5; i++) {
                //Need to programmatically get the second sound
                keyValues.push(
                    {'sound1': obj.src, 'sound2': null}
                )

            }


            keyValues.map(function (obj) {

                returnArray.push(obj);
            })
            return returnArray;

        });
        if (callback) {
            callback(returnArray);
        }
        else {

            return returnArray;
        }
    }

    shuffle(array, cb) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        if (cb) {
            cb(array);
        }


        return array;

    }

    render() {
        let self = this;
        let buttons = (self.state.running) ? [self.pButton(), self.bButton()] : null;
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Categorical Perception Experiment</h2>
                </div>
                <p className="App-intro">
                    Click 'Start' to begin the experiment
                </p>
                <button onClick={this.start}>Start</button>
                <br />
                {buttons}
            </div>
        );
    }
}

export default App;
