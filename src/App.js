/*global jQuery $*/

import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/jquery/dist/jquery.min'
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
            experimentOneDone: true, //reset to false
            experimentTwoDone: false,
        };
        this.start = this.start.bind(this);
        this.experimentOneSetup = this.experimentOneSetup.bind(this);
        this.advanceExperimentOne = this.advanceExperimentOne.bind(this);
        this.pressBButton = this.pressBButton.bind(this);
        this.pressPButton = this.pressPButton.bind(this);
        this.pressSameButton = this.pressSameButton.bind(this);
        this.pressDifferentButton = this.pressDifferentButton.bind(this);


    }

    getAssets() {
        let sounds = [];

        let num = Number(this.state.numSounds) + 1;
        for (let i = 1; i < num; i++) {
            let a = document.createElement('audio');
            a.src = './wavs/' + this.state.soundPrefix + i + '.wav';
            a.id = this.state.soundPrefix + i;
            a.load();


            sounds.push(a);
        }

        this.setState({sounds: sounds});

    }

    bButton() {
        let self = this;
        return (
            <button className="btn btn-info choiceButton" id="b" onClick={self.pressBButton}>/b/</button>
        )
    }

    pButton() {
        let self = this;
        return (
            <button className="btn btn-info choiceButton" id="p" onClick={self.pressPButton}>/p/</button>
        )
    }

    sameButton() {
        let self = this;
        return (
            <button className="btn btn-info choiceButton" id="same" onClick={self.pressSameButton}>Same</button>
        )
    }

    differentButton() {
        let self = this;
        return (
            <button className="btn btn-info choiceButton" id="different" onClick={self.pressDifferentButton}>
                Different</button>
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
        } else if (this.state.experimentOneDone && !this.state.experimentTwoDone) {
            this.setState({running: true});
            this.experimentTwoSetup();
            //Run experiment two

        } else {
            //Show charts
        }


    }

    experimentOneSetup() {
        $('.experimentTwo').hide();
        let self = this;
        let array = [];
        let sounds = this.state.sounds;
        let repetitions = this.props.experimentOneRepetitions || 1
        for (let i = 0; i < repetitions; i++) {
            for (let x = 0; x < sounds.length; x++) {
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

    experimentTwoSetup() {
        var self = this;
        /*
         Two stimuli, click 'same' or 'different', always separated by one vot
         EG: 1:3, 2:4, etc.
         separated by 250ms,
         5 repetisions of each pair

         */
        self.createPairs(this.state.sounds, function(ret) {
            console.log(ret);
        })
    }

    pressBButton() {
        this.advanceExperimentOne("/b/");
    }

    pressPButton() {
        this.advanceExperimentOne("/p/");
    }

    pressSameButton() {
        this.advanceExperimentTwo(true);
    }

    pressDifferentButton() {
        this.advanceExperimentTwo(false);

    }

    advanceExperimentTwo(val) {
        /**
         * Store
         */
    }

    advanceExperimentOne(answer) {
        $(".choiceButton").hide();

        let current = this.state.experimentOneResults;
        let obj = current[this.state.question];
        obj.answer = answer;
        current[this.state.question] = obj;
        this.setState({experimentOneResults: current, question: this.state.question + 1}, function () {
            this.runExperimentOne();
        });

    }

    runExperimentOne() {
        $('.experimentTwo').hide();
        $('.startButton').hide();

        let question = this.state.question || 0;
        if (question < this.state.experimentOne.length) {
            this.experimentOnePlay(question);

        } else {
            this.setState({running: false, experimentOneDone:true}, function () {

                console.log(this.state.experimentOneResults);

            });


            //End
        }

    }

    experimentOnePlay(question) {
        $(".choiceButton").hide();

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
                    $(".choiceButton").show();
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
        for (let obj in array) {

            for (let i = 0; i < this.state.sounds.length; i++) {

                if (i + 2 > this.state.sounds.length) {
                    obj.sound2 = this.state.sounds.length[this.state.sounds.length - i];
                } else {
                    obj.sound2 = self.state.sounds[i].src;
                }


                newArray.push(obj);

                // console.log(obj);
            }
        }
        return newArray;


    }

    charts() {
        //TODO: Install ReCharts
    }

    createPermutations(array, callback) {
        let returnArray = [];
        array.map(function (obj) {
            let keyValues = [];
            for (let i = 0; i < 5; i++) {
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
        let currentIndex = array.length, temporaryValue, randomIndex;

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
        let experimentOneShow = !this.state.experimentOneDone? [  <div className="well experimentOne">
                <h1>Experiment One - Identification</h1>
                <p>In this first experiment, you will hear a and array of stimuli in two sequence pairs. Once
                    you've
                    heard both sounds in a pair, simply choose the one that sounds closest to the phoneme /p/.
                    The
                    experiment will automatically advanced to the next set of stimuli. </p>
                Click 'Start' to begin the first experiment.
                <br />
                <button className="btn btn-primary startButton" onClick={this.start}>Start The Identification
                    Experiment
                </button>
            </div>] : null;
        let experimentTwoShow = this.state.experimentOneDone ? [<div className="well experimentTwo">
                <h1>Experiment Two - Discrimination</h1>
                <p>In this section you will hear two stimuli back to back and you are you to determine whether
                    or
                    not they sound the 'same' or 'different.'</p>
                <br />
                <button className="btn btn-primary" onClick={this.start}>Start the Discrimination Experiment
                </button>
            </div>] : null;
        return (
            <div className="App container">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Jongman Categorical Perception Experiment</h2>
                </div>
                <div className="App-intro container">
                    {experimentOneShow}

                    {experimentTwoShow}

                </div>

                <br />
                {buttons}
            </div>
        );
    }
}

export default App;
