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
            experimentOneResults: [],
            experimentTwoResults: [],
            experimentTwo: {},
            sounds: [],
            running: false,
            experimentOneDone: false,
            experimentTowDone: false,
        };
        this.start = this.start.bind(this);
        this.experimentOneSetup = this.experimentOneSetup.bind(this);
        this.advanceExperimentOne = this.advanceExperimentOne.bind(this);
        this.pressBButton = this.pressBButton.bind(this);
        this.pressPButton = this.pressPButton.bind(this);


    }

    getAssets() {
        let sounds = [];

        let num = Number(this.state.numSounds) + 1;
        for (let i = 1; i < num; i++) {
            let a = document.createElement('audio');
            a.src = './wavs/' + this.state.soundPrefix + i + '.wav';
            a.id = this.state.soundPrefix+i;
            a.load();


            sounds.push(a);
        }

        this.setState({sounds: sounds});

    }

    bButton() {
        var self = this;
        return (
            <button className="btn btn-info" id="b" onClick={self.pressBButton}>/b/</button>
        )
    }

    pButton() {
        var self = this;
        return (
            <button className="btn btn-info" id="p" onClick={self.pressPButton}>/p/</button>
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
        if (!this.state.experimentOneDone) {
            this.setState({running: true});
            this.experimentOneSetup();
        } else {

        }

        // console.log(this.createPermutations(this.state.sounds, self.createPairs));
        // console.log(self.createPairs(this.createPermutations(this.state.sounds)));


    }

    experimentOneSetup() {
        let self = this;
        let array = [];
        let sounds = this.state.sounds;
        let repetitions = this.props.experimentOneRepetitions || 1
        for (var i = 0; i < repetitions; i++) {
            for (var x = 0; x < sounds.length; x++) {
                array.push(sounds[x]);
            }
        }
        App.shuffle(array, function (ret) {
            self.setState({experimentOne: ret, question: 0}, function () {
                self.runExperimentOne();
            })
        });


        console.log('run');

    }

    pressBButton() {
        this.advanceExperimentOne("/b/");
    }

    pressPButton() {
        this.advanceExperimentOne("/p/");
    }

    advanceExperimentOne(answer) {
        let current = this.state.experimentOneResults;
        let obj = current[this.state.question];
        obj.answer = answer;
        current[this.state.question] = obj;
        this.setState({experimentOneResults: current, question: this.state.question + 1}, function () {
            this.runExperimentOne();
        });

    }

    runExperimentOne() {
        let question = this.state.question || 0;
        if (question < this.state.experimentOne.length) {
            this.experimentOnePlay(question);

        } else {
            this.setState({running: false}, function () {

                console.log(this.state.experimentOneResults);

            });


            //End
        }

    }

    experimentOnePlay(question) {
        console.log('experiment1');
        let audio = this.state.experimentOne[question];
        let audio2 = null;
        //TODO: add ended event
        if (question + 2 < this.state.experimentOne.length) {
            audio2 = this.state.experimentOne[question + 2]
        } else {
            let question2 = this.state.experimentOne.length - question;
            audio2 = this.state.experimentOne[question2];
        }
        let answerObj = {"sound1": audio.id, "sound2": audio2.id}
        let results = this.state.experimentOneResults;
        results[question] = answerObj;

        this.setState({experimentOneResults: results}, function () {
            audio.onended = function () {
                audio2.onended = function () {
                    audio.onend = null;
                    audio2.onend = null;
                }
                audio2.play();
            };
            audio.play();
        });



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
        for (var obj in array) {

            for (let i = 0; i < 10; i++) {
                obj.sound2 = self.state.sounds[i].src;

                newArray.push(obj);

                // console.log(obj);
            }
        }
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
                return obj;
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

    static shuffle(array, cb) {
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
            <div className="App container">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Jongman Categorical Perception Experiment</h2>
                </div>
                <div className="App-intro container">
                    <h1>Experiment One - Identification</h1>
                    <p>In this first experiment, you will hear a and array of stimuli in two sequence pairs. Once you've
                        heard both sounds in a pair, simply choose the one that sounds closest to the phoneme /p/. The
                        experiment will automatically advanced to the next set of stimuli. </p>
                    Click 'Start' to begin the first experiment.
                    <br />
                    <button className="btn btn-primary" onClick={this.start}>Start The Identification Experiment
                    </button>
                    <h1>Experiment Two - Discrimination</h1>
                    <p>In this section you will hear two stimuli back to back and you are you to determine whether or
                        not they sound the 'same' or 'different.'</p>
                    <br />
                    <button className="btn btn-primary" onClick={this.start}>Start the Discrimination Experiment
                    </button>
                </div>

                <br />
                {buttons}
            </div>
        );
    }
}

export default App;
