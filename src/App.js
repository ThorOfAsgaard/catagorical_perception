/*global jQuery $*/

import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/jquery/dist/jquery.min';
import {LineChart, Line, XAxis, YAxis, CartesianGrid} from 'recharts';

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
            experimentOneDone: false, //reset to false
            experimentTwoDone: false,
        };
        this.start = this.start.bind(this);
        this.experimentOneSetup = this.experimentOneSetup.bind(this);
        this.advanceExperimentOne = this.advanceExperimentOne.bind(this);
        this.pressBButton = this.pressBButton.bind(this);
        this.pressPButton = this.pressPButton.bind(this);
        this.pressSameButton = this.pressSameButton.bind(this);
        this.pressDifferentButton = this.pressDifferentButton.bind(this);
        this.experimentOneChart = this.experimentOneChart.bind(this);
        this.experimentTwoChart = this.experimentTwoChart.bind(this);

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

        this.setState({sounds: sounds}, function () {
            console.log(this.state.sounds);
        });

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
        this.getAssets();
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

        }


    }

    footer() {

        return ( <nav className="navbar navbar-inverse navbar-fixed-bottom">
            <div className="container-fluid ">
                <p className="navbar-text">Question: {this.state.question}</p>
            </div>
        </nav>)
    }

    experimentOneChart() {
        let self = this;
        /**
         * TODO: iterate over each instance,
         * @type {Array}
         */

        let d = this.state.sounds.map(function (obj) {
            let id = obj.id;
            let ret = {}
            return ret[id] = 0;

        });


        this.state.experimentOneResults.map(function (obj) {

            let ret = {};
            if (obj.answer === "/p/") {

                for (let i in d) {
                    if (d[i].hasOwnProperty(obj.sound1.id)) {
                        d[i][obj.sound1.id] += 1;
                    }
                }

                let vot = obj.sound1;
                vot = vot.replace("/", "");
                vot = vot.replace("pi", "");
                // ret.vot = Number(vot) * 100;


                d[Number(vot) - 1]++;
                return vot
            } else {

            }
            console.log("Numbers");
            console.log(d);
        });
        let data = d.map(function (obj, index) {
            console.log(index);

            return {answer: d[obj], vot: Number(index + 1) * 10, label: (Number(index) + 1) * 10}
        });
        return (<div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">

                <LineChart width={400} height={400} data={data}>
                    <Line type="monotone" dataKey="answer" stroke="#8884d8"/>
                    <CartesianGrid stroke="#ccc"/>
                    <XAxis dataKey="vot" label="VOT" name="VOT"/>
                    <YAxis dataKey="answer" label="Number of /pi/ responses"/>
                </LineChart>
                <span className="pull-left vertical-text">Number of /pi/ Responses</span>
                <br />
                <span className="center">VOT (msec)</span>

            </div>
        )
    }

    experimentTwoChart() {

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
        console.log('experimentTwoSetup');
        /*
         Two stimuli, click 'same' or 'different', always separated by one vot
         EG: 1:3, 2:4, etc.
         separated by 250ms,
         5 repetisions of each pair

         */
        let pairs = self.createPairs(this.state.sounds);
        this.setState({experimentTwo: pairs, question: 0}, function () {
            self.runExperimentTwo()
        });
        console.log(pairs);
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

    advanceExperimentTwo(answer) {
        /**
         * Store
         */
        console.log(answer);
        $(".choiceButton").hide();
        let current = this.state.experimentTwoResults;
        let obj = current[this.state.question];
        obj.answer = answer;
        console.log(obj);
        current[this.state.question] = obj;
        this.setState({experimentTwoResults: current, question: this.state.question + 1}, function () {
            this.runExperimentTwo();
        })
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

    runExperimentTwo() {
        $('.experimentOne').hide();
        $('.startButton').hide();
        let question = this.state.question || 0;
        if (question < this.state.experimentTwo.length) {
            this.experimentTwoPlay(question);

        } else {
            this.setState({running: false, experimentTwoDone: true}, function () {
                console.log(this.state.experimentTwoResults);
            })
        }
    }

    runExperimentOne() {
        $('.experimentTwo').hide();
        $('.startButton').hide();

        let question = this.state.question || 0;
        if (question < this.state.experimentOne.length) {
            this.experimentOnePlay(question);

        } else {
            this.setState({running: false, experimentOneDone: true}, function () {

                // console.log(this.state.experimentOneResults);

            });


            //End
        }

    }

    experimentTwoPlay(question) {
        console.log("play")
        $(".choiceButton").hide();
        let obj = this.state.experimentTwo[question];
        console.log(obj);
        let audio = obj.sound1;

        let audio2 = obj.sound2;

        let answerObj = {"sound1": audio.id, "sound2": audio2.id}
        let results = this.state.experimentTwoResults;
        results[question] = answerObj;

        this.setState({experimentTwoResults: results});

        audio.onended = function () {
            audio2.onended = function () {
                audio.onend = null;
                audio2.onend = null;
                $(".choiceButton").show();
            };
            audio2.play();
        };

        audio.play();

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

        this.setState({experimentOneResults: results});
        let endedTimeout = null;
        // audio.onplay = function() {
        //     endedTimeout = setTimeout(function() {
        //         console.log("Timedout");
        //
        //         // audio.onended = null;
        //         audio2.play();
        //     }, 1000)
        // };
        audio.onended = function () {
            clearTimeout(endedTimeout);
            audio2.onended = function () {
                clearTimeout(endedTimeout);
                audio.onended = null;
                audio2.onended = null;
                $(".choiceButton").show();
                console.log("audio2 end");
            };
            audio2.play();
        };
        console.log("play");
        audio.play();
        // audio1timeout = setTimeout(function() {
        //
        //     clearTimeout(audio1timeout);
        //     audio2.play();
        //
        //
        // },250);


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

    /**
     * Creates pairs of +1 VOT, so 1:3, 2:4, etc.
     * @param array
     * @param callback
     * @returns {Array}
     */
    createPairs(array, callback) {
        let self = this;
        let newArray = [];
        for (let obj in array) {
            var newObj = {
                sound1: array[obj]
            };
            console.log(Number(obj) + 2);

            //Always tries to find +1 VOT
            if (Number(obj) + 2 > array.length - 1) {
                newObj.sound2 = self.state.sounds[(Number(obj) + 2) - (array.length - 1)]
            } else {
                newObj.sound2 = self.state.sounds[Number(obj) + 2]
            }

            console.log(newObj);

            newArray.push(newObj);

            // console.log(obj);

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
        let buttons = null;
        if (self.state.running) {
            if (!self.state.experimentOneDone) {
                buttons = [self.pButton(), self.bButton()]
            } else if (self.state.experimentOneDone && !self.state.experimentTwoDone) {
                buttons = [self.sameButton(), self.differentButton()]
            } else {

                buttons = [self.experimentOneChart(), self.experimentTwoChart()]
            }
        }

        let experimentOneShow = !this.state.experimentOneDone ? [<div className="well experimentOne">
                <h1>Experiment One - Identification</h1>
                <p>In this first experiment, you will hear a and array of stimuli in two sequence pairs. Once
                    you've
                    heard both sounds in a pair, click the button the button that corresponds to the first sound you heard..
                    The
                    experiment will automatically advanced to the next set of stimuli. </p>
                Click 'Start' to begin the first experiment.
                <br />
                <button className="btn btn-primary startButton" onClick={this.start}>Start The Identification
                    Experiment
                </button>
            </div>] : null;
        let experimentTwoShow = (this.state.experimentOneDone && !this.state.experimentTwoDone) ? [<div
                className="well experimentTwo">
                <h1>Experiment Two - Discrimination</h1>
                <p>In this section you will hear two stimuli back to back and you are you to determine whether
                    or
                    not they sound the 'same' or 'different.'</p>
                <br />
                <button className="btn btn-primary startButton" onClick={this.start}>Start the Discrimination Experiment
                </button>
            </div>] : null;
        let finished = (this.state.experimentOneDone && this.state.experimentTwoDone) ? [
                <div className="jumbotron">
                    <h2>Experiments complete</h2>
                    {this.experimentOneChart()}
                    {this.experimentTwoChart()}
                    Charts will be here soon

                </div>


            ] : null;
        return (
            <div className="">
                <div className="App container">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h2>Jongman Categorical Perception Experiment</h2>
                    </div>
                    <div className="App-intro container">
                        {experimentOneShow}

                        {experimentTwoShow}

                        {finished}
                    </div>

                    <br />
                    {buttons}

                </div>
                {this.footer()}
            </div>
        );
    }
}

export default App;
