/*global jQuery $*/

import React, {Component} from 'react';
// import logo from './logo.svg';

import '../node_modules/jquery/dist/jquery.min';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Text} from 'recharts';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            soundPrefix: props.soundPrefix,
            numSounds: props.numSounds,
            canRun: false,
            question: null,
            questionObj: null,
            experimentOne: [],
            experimentOneResults: [],
            experimentTwoResults: [],
            experimentTwoPairs:[],
            experimentTwo: {},
            sounds: [],
            running: false,
            experimentOneDone: false, //reset to false
            experimentTwoDone: false,
            experimentTwoArray: [],

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

        var self = this;
        let num = Number(this.state.numSounds) + 1;
        for (let i = 1; i < num; i++) {
            self.setState({canRun: false});
            let a = document.createElement('audio');
            a.src = './wavs/' + this.state.soundPrefix + i + '.wav';
            a.addEventListener('canplaythrough', function() {
                self.setState({canRun: true});

            });
            a.id = this.state.soundPrefix + i;
            a.load();


            sounds.push(a);
        }

        this.setState({sounds: sounds}, function () {

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
            console.log(obj);
            let id = obj.id;
            let ret = {}
            return ret[id] = 0;

        });


        this.state.experimentOneResults.map(function (obj) {
            console.log(obj.answer);
            let ret = {};

            if (obj.answer === "/b/") {
                console.log("Got a b response");

                for (let i in d) {
                    console.log(d[i]);
                    if (d[i].hasOwnProperty(obj.sound1.id)) {
                        console.log("Incrementing");
                        d[i][obj.sound1.id] += 1;
                    }
                }

                let vot = obj.sound1;
                vot = vot.replace("/", "");
                vot = vot.replace("pi", "");
                // ret.vot = Number(vot) * 100;
                console.log(vot);

                d[Number(vot) - 1]++;
                return vot
            } else {
                console.log("Got a p response");

            }

        });
        let data = d.map(function (obj, index) {


            // return {answer: (Number(d[obj]/self.props.experimentOneRepetitions) * 100), vot: Number(index + 1) * 10, label: (Number(index) + 1) * 10}
            return {answer: (Number(d[obj]/self.props.experimentOneRepetitions) * 100), vot: Number(index + 1), label: (Number(index) + 1) * 10}
        });
        console.log(data);
        return (<div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 text-center">

                <LineChart width={400} height={400} data={data}>
                    <Line type="monotone" dataKey="answer" stroke="#8884d8"/>
                    <CartesianGrid stroke="#ccc"/>
                    <XAxis dataKey="vot" label="VOT" name="VOT"  domain={[0,10]}/>

                    <YAxis dataKey="answer" label="Number of /pi/ responses" domain={[0,100]}/>
                </LineChart>
                <span className="pull-left vertical-text">Percentage of /b/ responses</span>
                <br />
                <span className="center">Stimulus member</span>

            </div>
        )
    }

    experimentTwoChart() {
        let self = this;
        let final = this.state.experimentTwoArray.map(function(num, index) {
            console.log(num);
           let obj = {};
           obj.pair = index+1;
           obj.data = (num / self.props.experimentTwoRepetitions) * 100;
           return obj;
        });
        return (<div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 text-center">

            <LineChart width={400} height={400} data={final}>
                <Line type="monotone" dataKey="data" stroke="#8884d8"/>
                <CartesianGrid stroke="#ccc"/>
                <XAxis dataKey="pair" label="Pair" name="Pair" type="number" domain={[1,8]} tickCount="8"/>
                <YAxis dataKey="data" type="number" label="data" domain={[0,100]}/>
            </LineChart>
            <span className="pull-left vertical-text">percentage of correct discrimination</span>
            <br />
            {/*<p className="vertical-text">*/}
                {/*Percentage of correct discrimination*/}
            {/*</p>*/}
            <span className="center">Stimulus pair</span>




        </div>)

    }

    experimentOneSetup() {
        $('.experimentTwo').hide();
        let self = this;
        let array = [];
        let sounds = this.state.sounds;
        let repetitions = this.props.experimentOneRepetitions || 1;
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


    }

    experimentTwoSetup() {
        var self = this;

        /*
         Two stimuli, click 'same' or 'different', always separated by one vot
         EG: 1:3, 2:4, etc.
         separated by 250ms,
         5 repetisions of each pair

         */
        let pairs = self.createPairs(this.state.sounds);
        console.log("Pairs");
        console.log(pairs);
        let array = [];
        let repetitions = this.props.experimentTwoRepetitions || 1;
        for(let i =0; i < repetitions; i++) {
            for (let x = 0; x < pairs.length; x++) {
                array.push(pairs[x]);
            }
        }
        array = App.shuffle(array);
        this.setState({experimentTwo: array, question: 0}, function () {
            self.runExperimentTwo()
        });

    }

    pressBButton() {
        this.advanceExperimentOne("/b/");
    }

    pressPButton() {
        this.advanceExperimentOne("/p/");
    }

    pressSameButton() {
        this.advanceExperimentTwo(0);
    }

    pressDifferentButton() {
        this.advanceExperimentTwo(1);

    }

    advanceExperimentTwo(answer) {
        console.log("advancing");
        $(".choiceButton").hide();
        let current = this.state.experimentTwoResults;
        let obj = current[this.state.question];
        console.log(obj);
        let currentArray = this.state.experimentTwoArray;

        if(answer != null) {
            console.log(obj);
            try {
                let ans = currentArray[Number(obj.pair) - 1] || 0;
                ans+=answer;
                currentArray[Number(obj.pair) - 1] = ans;
                this.setState({experimentTwoArray: currentArray});
                obj.answer = answer;
                current[this.state.question] = obj;
                this.setState({experimentTwoResults: current, question: this.state.question + 1}, function () {
                    this.runExperimentTwo();
                })
            } catch (e) {
                console.log(e);
            }

        }



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

    /**
     * Single stimulus
     * @param question
     */
    experimentOnePlay(question) {

        $(".choiceButton").hide();
        let obj = this.state.experimentOne[question];
        console.log(obj);
        let audio = obj;

        // console.log(audio);
        let answerObj = {"sound1": obj.id}
        let results = this.state.experimentOneResults;

        results[question] = answerObj;

        this.setState({experimentOneResults: results});

        audio.onended = function () {

                $(".choiceButton").show();


        };

        audio.play();
        setTimeout(function() {
            $(".choiceButton").show();
        },500);

    }

    /**
     * Two Stimulus, separated by 250msec
     * @param question
     */
    experimentTwoPlay(question) {
        console.log("experimentTwoPlay");
        $(".choiceButton").hide();
        let current = this.state.experimentTwo[question];
        this.setState({questionObj: current});
        let audio = this.state.experimentTwo[question].sound1;
        console.log(audio);
        let audio2 =this.state.experimentTwo[question].sound2;


        let answerObj = {"sound1": audio.id, "sound2": audio2.id, "pair": this.state.experimentTwo[question].pair}

        let results = this.state.experimentTwo;
        results[question] = answerObj;

        this.setState({experimentTwoResults: results});
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
            setTimeout(function() {
            audio2.play();
            }, 250);
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



    /**
     * Creates pairs of +1 VOT, so 1:3, 2:4, etc. up until 8,
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
            if(Number(obj) + 2 > array.length-1) {
                continue;
            }

            //Always tries to find +1 VOT
            if (Number(obj) + 2 > array.length - 1) {
                newObj.sound2 = self.state.sounds[Number(obj) + 1]
            } else {
                newObj.sound2 = self.state.sounds[Number(obj) + 2]
            }

            newObj.pair = Number(obj) +1;
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

                buttons = [self.experimentTwoChart()]
            }
        }

        let experimentOneShow = !this.state.experimentOneDone ? [<div className="jumbotron experimentOne">
                <h1>Experiment One - Identification</h1>
                <p>
                    In this first experiment, you will hear a number of speech sounds. On each trial, please indicate whether you think the sound you heard sounds more like 'p' or more like 'b'. When in doubt, please guess. After each decision, the experiment will automatically advance to the next trial.


                </p>
                Click 'Start' to begin the first experiment.
                <br />
                {this.state.canRun ?
                    <button className="btn btn-primary startButton" onClick={this.start}>Start The Identification
                        Experiment
                    </button> :
                    null
                }
            </div>] : null;
        let experimentTwoShow = (this.state.experimentOneDone && !this.state.experimentTwoDone) ? [<div
                className="jumbotron experimentTwo">
                <h1>Experiment Two - Discrimination</h1>
                <p>
                    In this second experiment, you will hear two sounds on each trial. Your task is to indicate if the two sounds are the same or different. After each decision, the experiment will automatically advance to the next trial.Click 'Start' to begin the second experiment.

                </p>
                <br />
                {this.state.canRun ?
                <button className="btn btn-primary startButton" onClick={this.start}>Start the Discrimination Experiment
                </button>
                    : null
                }
            </div>] : null;
        let finished = (this.state.experimentOneDone && this.state.experimentTwoDone) ? [
                <div className="jumbotron">
                    <h2>Experiment Results</h2>
                    {this.experimentOneChart()}
                    {this.experimentTwoChart()}


                </div>


            ] : null;
        return (

                <div className="container-fluid">
                    <div className="App-header">

                        <h2><img src="./logo.svg" className="App-logo" alt="logo"/> Jongman Categorical Perception Experiment</h2>
                    </div>
                    <div className="App-intro container">
                        {experimentOneShow}

                        {experimentTwoShow}

                        {finished}
                        <div className="text-center">
                        {buttons}
                        </div>

                    </div>

                    <br />


                {this.footer()}
            </div>
        );
    }
}

export default App;

