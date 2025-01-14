import React, {forwardRef, useImperativeHandle, useState} from 'react';
import '../../App.css';
import { useSpring, animated } from 'react-spring';
import {charToMorse, morseToChar} from "./charMorseConv";
import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import useSound from 'use-sound';
import dashSound from '../Assets/Sounds/dash.mp3';
import dotSound from '../Assets/Sounds/dot.mp3';
import {initial, Buttons, resetInputTime, resetInputLength, BackButton} from "./Common/Functions";
import spacebar from '../Assets/Images/spacebar.png';
import enterButton from '../Assets/Images/enterButton.png';
import {useHistory} from "react-router-dom";
import { Transition } from 'react-spring/renderprops';
import sounds from './NumberSounds';
import correctFX from "../Assets/Sounds/correct.mp3"


/*
* Game that teaches the numbers in Morse Code
*
* 
* Created : 10/20/2020
* Modified: 3/15/2021
*/


var t; //timeout
var list = "0123456789"; //list that you go through
var textIndex = 0;
var promptsCheck = true;
var orderedList = "0123456789";

function buttonClick (clicked, notClicked){
    document.getElementById(clicked).style.fontSize = '5vh';
    document.getElementById(clicked).style.backgroundColor = 'White';
    document.getElementById(clicked).style.outlineColor = 'Red';
    document.getElementById(notClicked).style.outlineColor = "Grey";
    document.getElementById(notClicked).style.fontSize = '4vh';
    document.getElementById(notClicked).style.backgroundColor = 'Grey';
}

function scramble (){
    var currentChar= "";
    var tempList = orderedList;
    var result = [];
    while(tempList != ""){
        currentChar = tempList.charAt(Math.floor(Math.random() * tempList.length));
        tempList = tempList.replace(currentChar,'');
        result += currentChar;
    }
list= result;
}
function inOrder (){
list= orderedList;
}
function showImage() {
    var x = document.getElementById("tutorialImage");
    if(x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.displau = "none";
    }
}

//each textIndex is a "slide" in the tutorial
function updateTutorial() {
    var space = document.getElementById('spaceImage');
    var enter = document.getElementById('enterImage');

    if (textIndex == 0) {
        document.getElementById('tutorialText').innerHTML = 'This game consists of two buttons at the bottom of the page';
        textIndex++;
    } else if (textIndex == 1) {
        document.getElementById('tutorialText').innerHTML = 'This button is used for the dots and can be accessed through the space button or by clicking here!';
        document.getElementById('dotButton').style.backgroundColor = "yellow";
        space.style.display = "block";
        textIndex++;
    } else if (textIndex == 2) {
        document.getElementById('dotButton').style.backgroundColor = document.getElementById('dashButton').style.backgroundColor;
        document.getElementById('tutorialText').innerHTML = 'This button is used for the dashes and can be accessed through the enter button or by clicking here!';
        document.getElementById('dashButton').style.backgroundColor = "yellow";
        space.style.display = "none";
        enter.style.display = "block";
        textIndex++;
    } else if (textIndex == 3) {
        document.getElementById('dashButton').style.backgroundColor = document.getElementById('dotButton').style.backgroundColor;
        document.getElementById('tutorialText').innerHTML = 'Enter the correct Morse Code shown here!';
        document.getElementById('sampleMorseCode').style.color = document.getElementById('dotButton').style.backgroundColor;
        enter.style.display = "none";
        textIndex++;
    } else if (textIndex == 4) {
        // change this in your tutorials to change the color of the divs
        document.getElementById('sampleMorseCode').style.color = document.getElementById('dotButton').style.color;
        document.getElementById('tutorialText').innerHTML = 'Enter the correct code and move onto the next number. Have Fun Learning Morse Numbers!';
        textIndex++;
        // change color back to regular
    } else if (textIndex == 5) {
        // changes smaple morse back to normal color
        document.getElementById('sampleMorse').style.color = document.getElementById('dashButton').style.backgroundColor;
        textIndex = 0;
        document.getElementById("tutorialMenu").onMouseDown();
    }
}


const LearnNumbers = forwardRef((props, ref) => {

    const history = useHistory();
    function backToGames() {
        history.push("/GamesLetters");
    }

    var [index, setIndex] = useState(0);
    //var [index, setIndex] = useState(0); //hooks: everytime you change a hook the page reloads
    var currentNumber = list[index];
    // if (index < list.length) {
    //     currentNumber = list[index];
    // } else { //once they finish the all the number, it randomly selects another number
    //     currentNumber = list[randomNumber];
    // }
    var currentMorse = charToMorse(currentNumber);
    var [input, setInput] = useState('');
    var output = morseToChar(input);
    const [anim, setAnim] = useState(true);

    //setting stuff
    const [volume, setVolume] = useState(() => initial('volume'));
    const [size, setSize] = useState(() => initial('size'));
    const [speed, setSpeed] = useState(() => initial('speed'));
    const [backgroundColor, setBackgroundColor] = useState(() => initial('backgroundColor'));
    const [dashButtonColor, setdashButtonColor] = useState(() => initial('dashButtonColor'));
    const [dotButtonColor, setdotButtonColor] = useState(() => initial('dotButtonColor'));
    const [fontColor, setFontColor] = useState(() => initial('fontColor'));
    const resetTimer = speed * 1000; //reset timer in milliseconds
    const fSize = size + 'vh';
    const sfSize = size / 3 + 'vh';

    //sounds of buttons
    const [playDash] = useSound(
        dashSound,
        {volume: volume / 100}
    );
    const [playDot] = useSound(
        dotSound,
        {volume: volume / 100}
    );
    //number sound
    var soundSrc = sounds[currentNumber];
    const [playCurrentNumberSound] = useSound(
        soundSrc,
        { volume: volume / 100 }
    );

    const [playCorrectSoundFX] = useSound(
        correctFX,
        {volume: volume / 100}
    )

    var [startScreen, setStartScreen] = useState(true);
    var [endScreen, setEndScreen] = useState(false);

    
    //resets the length of the input if its too long
    resetInputLength(input, setInput); 
    //clears the timeout function
    clearTimeout(t);
    //resets the input from the user after time
    t = resetInputTime(t, input, setInput, resetTimer);


    React.useEffect(() => {
        if (input === currentMorse) {
            clearTimeout(t);
            playCorrectSoundFX();
            setTimeout(() => {
                clearTimeout(t);
                playCurrentNumberSound();
                setTimeout(() => {
                    clearTimeout(t);
                    setInput('');
                    setAnim(!anim);
                    if (index != list.length - 1) {
                        setIndex(prevState => prevState + 1);
                    } else {
                        setIndex(0);
                        setEndScreen(true);
                    }
                }, resetTimer)
            }, resetTimer)
        }
    }, [input])


    // tracks keycodes for space button and enter button input 
    const [handleKeyDown, setHandleKeyDown] = useState(true);
    document.onkeydown = function (evt) {
        if (!handleKeyDown) return;
        setHandleKeyDown(false);
        evt = evt || window.event;
        if (evt.keyCode === 32) {
            if(startScreen){

            } else if(endScreen) {
                backToGames();
            } else {
                setInput(input + '•');
                playDot();
                document.getElementById('dotButton').focus();
                clearTimeout(t);
                t = resetInputTime(t, input, setInput, resetTimer);
            }
        } else if (evt.keyCode === 13) {
            if (startScreen) {
                setStartScreen(false);
            } else if (endScreen) {
                setEndScreen(false);
            } else {
                setInput(input + '-');
                playDash();
                document.getElementById('dashButton').focus();
                clearTimeout(t);
                t = resetInputTime(t, input, setInput, resetTimer);
            }
        }
    };
    document.onkeyup = function (evt) {
        setHandleKeyDown(true);
        document.activeElement.blur();
    };

    //takes 2 sec for the animation to delete 
    var d = 2000;
    //if not, then it will set the animation to 0 and doesnt do anything, doesnt animate 
    //when its not suppose to be animating
    //animation for the number displayed
    if (!anim) {
        d = 0;
        t = setTimeout(function () {
            setAnim(!anim)
        }, 100);
    }
    //the animation itself
    var {x} = useSpring({from: {x: 0}, x: anim ? 1 : 0, config: {duration: d}})

    //sets all the settings the user wants
    useImperativeHandle(
        ref,
        () => ({
            update() {
                setVolume(initial('volume'));
                setSize(initial('size'));
                setSpeed(initial('speed'));
                setBackgroundColor(initial('backgroundColor'));
                setdashButtonColor(initial('dashButtonColor'));
                setdotButtonColor(initial('dotButtonColor'));
                setFontColor(initial('fontColor'));
            }
        }),
    )
    //styling of the page
    return (
        <div style={{
            backgroundColor: backgroundColor,
            height: '90vh',
            width: '100vw',
            display: 'grid',
            gridTemplate: '8fr 8fr / 1fr',
            gridTemplateAreas: '"top" "middle" "bottom'
        }}>
            <Transition
                items={startScreen}
                duration={500}
                from={{ opacity: 0 }}
                enter={{ opacity: 1 }}
                leave={{ opacity: 0 }}>
                {toggle =>
                    toggle
                        ? props => <div style={{
                            position: 'absolute',
                            width: '100vw',
                            height: '90vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                            ...props
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'black',
                                opacity: 0.7
                            }} />
                            <Grid container direction='column' justify='center' alignItems='center' style={{ height: '100%', width: '100%', zIndex: 1 }}>
                                <Grid item style={{ userSelect: 'none', cursor: 'default' }}>
                                    <Card>
                                        <h1 style={{
                                            marginBottom: '0vh',
                                            fontSize: '8vh'
                                        }}>Learn Morse Numbers
                                        </h1>
                                        <br />
                                        <p id= "instructions" style={{
                                            marginTop: '0vh',
                                            paddingLeft: '2vw',
                                            paddingRight: '2vw',
                                            fontSize: '4vh',
                                            display: 'none'
                                        }}>Look for the dot ('space') and dash ('enter') patterns to make a number
                                        </p>
                                    </Card>
                                </Grid>
                                <br />
                                    <Grid id= "pr" container direction = 'row' justify='center' alignItems='center'>
                                        <h1 style={{
                                            fontSize: '4vh',
                                            backgroundColor: 'white'
                                        }}>Morse Prompts:
                                        </h1> 
                                        <Grid> 
                                            <button id = "yesPrompts" style={{ border: 'none','margin-left':'30px','margin-right':'30px', fontSize: '5vh', cursor: 'pointer', 'outline-style':'solid','outline-width':'thick'}} 
                                            onMouseDown={function () {
                                                promptsCheck = true;
                                                buttonClick("yesPrompts","noPrompts");
                                                }}>
                                                Yes                  
                                            </button>

                                            <button id = "noPrompts" style={{ border: 'none',fontSize: '5vh', cursor: 'pointer', 'outline-style':'solid', 'outline-width':'thick'}} onMouseDown={function () {
                                                promptsCheck = false;
                                                buttonClick("noPrompts","yesPrompts");
                                                }}>
                                                No                   
                                            </button> 
                                        </Grid>
                                    </Grid>
                                    <Grid id= "sc" container direction = 'row' justify='center' alignItems='center'>
                                        <h1 style={{
                                            fontSize: '4vh',
                                            backgroundColor: 'white'
                                        }}>Randomize Letter Order:
                                        </h1> 
                                        <Grid> 
                                            <button id = "yesScramble" style={{ border: 'none','margin-left':'30px','margin-right':'30px', fontSize: '5vh', cursor: 'pointer', 'outline-style':'solid', 'outline-width':'thick' }} 
                                            onMouseDown={function () {
                                                buttonClick("yesScramble","noScramble");
                                                scramble();
                                            }}>
                                            Yes                 
                                            </button>
                                            <button id = "noScramble" style={{border: 'none', fontSize: '5vh', cursor: 'pointer', 'outline-style':'solid', 'outline-width':'thick'}} onMouseDown={function () {
                                                buttonClick("noScramble","yesScramble");
                                                inOrder();
                                            }}>
                                            No                   
                                            </button>
                                        </Grid>
                                    </Grid>
                                <br />    
                                <Grid item style={{ userSelect: 'none' }}>
                                <Card>
                                    <button id = "doneOptions" style={{ fontSize: '8vh', height: '100%', width: '100%', cursor: 'pointer' }}
                                            onMouseDown={function () {
                                                var start = document.getElementById("start");
                                                start.style.display = "block";
                                                var done = document.getElementById("doneOptions");
                                                done.style.display = "none";
                                                var instructions = document.getElementById("instructions");
                                                instructions.style.display = "block";
                                                var scramb = document.getElementById("sc");
                                                scramb.style.display = "none";
                                                var prom = document.getElementById("pr");
                                                prom.style.display = "none";
                                            }}>
                                            Done
                                        </button>
                                        </Card>
                                    <Card>
                                        <button id = "start" style={{display: 'none', fontSize: '8vh', height: '100%', width: '100%', cursor: 'pointer' }}
                                            onMouseDown={function () {
                                                if (startScreen) {
                                                    setStartScreen(false);
                                                }
                                            }}>
                                            Press Enter ('dash') to Start
                                        </button>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                        : props => <div />
                }
            </Transition>
            <Transition
                items={endScreen}
                duration={500}
                from={{ opacity: 0 }}
                enter={{ opacity: 1 }}
                leave={{ opacity: 0 }}>
                {toggle =>
                    toggle
                        ? props => <div style={{
                            position: 'absolute',
                            width: '100vw',
                            height: '90vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                            ...props
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'black',
                                opacity: 0.7
                            }} />
                            <Grid container justify='center' alignItems='center' style={{ height: '100%', width: '100%', zIndex: 1 }}>
                                <Grid item xs={9} style={{ userSelect: 'none', color: fontColor }}>
                                    <Card>
                                        <h1 style={{
                                            marginBottom: '0vh',
                                            fontSize: '8vh'
                                        }}>Yay!
                                        </h1>
                                        <br />
                                        <p style={{
                                            marginTop: '0vh',
                                            paddingLeft: '2vw',
                                            paddingRight: '2vw',
                                            fontSize: '8vh',
                                            marginBottom: '0vh'
                                        }}>You have learned the numbers in Morse.
                                        </p>
                                    </Card>
                                </Grid>
                                <Grid item xs={4} style={{ userSelect: 'none' }}>
                                    <Card>
                                        <button style={{ fontSize: '8vh', cursor: 'pointer', height: '100%', width: '100%' }}
                                            onMouseDown={function () {
                                                backToGames();
                                            }}>
                                            Other Games (•)
                                        </button>
                                    </Card>
                                </Grid>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={4} style={{ userSelect: 'none' }}>
                                    <Card>
                                        <button style={{ fontSize: '8vh', cursor: ' pointer', height: '100%', width: '100%' }}
                                            onMouseDown={function () {
                                                setEndScreen(false);
                                            }}>
                                            More Practice (-)
                                        </button>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                        : props => <div />
                }
            </Transition>
            <div style={{gridArea: 'top'}}>
                { <div style={{ position: 'absolute' }}>
                    <Container>
                        <BackButton />
                    </Container>
                </div> }
                <div id="sampleMorse">
                    <animated.h1 style={{
                        lineHeight: 0,
                        color: fontColor,
                        fontSize: fSize,
                        pointer: 'default',
                        userSelect: 'none',
                        opacity: x.interpolate({range: [0, 1], output: [0, 1]})
                    }}>{currentNumber}</animated.h1>
                    <animated.p id="sampleMorseCode" style={{
                        lineHeight: 0,
                        color: fontColor,
                        fontSize: sfSize,
                        pointer: 'default',
                        userSelect: 'none',
                        opacity: x.interpolate({range: [0, 1], output: [0, 1]})
                    }}>{promptsCheck ? currentMorse : ""}</animated.p>
                </div>
            </div>
            <div style={{ gridArea: 'middle' }}>
                <Container>
                    <Grid container justify='center' spacing={0}>
                        <Grid item xs={1}>
                            <p style={{
                                lineHeight: 0,
                                color: fontColor,
                                fontSize: '10vh',
                                pointer: 'default',
                                userSelect: 'none'
                            }}> &nbsp; </p>
                        </Grid>
                        <Grid item sm={10}>
                            <p style={{
                                lineHeight: 0,
                                color: fontColor,
                                fontSize: '10vh',
                                textAlign: 'center',
                                pointer: 'default',
                                userSelect: 'none'
                            }}>{input}</p>
                        </Grid>
                        <Grid item xs={1}>
                            <p style={{
                                lineHeight: 0,
                                color: fontColor,
                                fontSize: '10vh',
                                pointer: 'default',
                                userSelect: 'none'
                            }}> &nbsp; </p>
                        </Grid>
                    </Grid>
                    <Grid container justify='center' spacing={2}>
                        <Grid item xs={4}>
                            <Card>
                                {/* button updates */}
                                <CardActionArea>
                                    <button id="dotButton" style={{
                                        backgroundColor: dotButtonColor,
                                        width: '100%',
                                        height: '20vh',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        fontSize: '35vh',
                                        color: fontColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} onMouseDown={function () {
                                        setInput(input + '•');
                                        playDot();
                                        clearTimeout(t);
                                        t = resetInputTime(t, input, setInput, resetTimer);
                                    }}>
                                        <span
                                        >•
                                        </span>
                                    </button>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card>
                                <CardActionArea>
                                    <button id="dashButton" style={{
                                        backgroundColor: dashButtonColor,
                                        width: '100%',
                                        height: '20vh',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        fontSize: '35vh',
                                        color: fontColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} onMouseDown={function () {
                                        setInput(input + '-');
                                        playDash();
                                        clearTimeout(t);
                                        t = resetInputTime(t, input, setInput, resetTimer);
                                    }}>
                                        -
                                    </button>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </div>
    );
})

const Radio =() => {
    const [isToggled, setToggle] = useState(false);
    const menubg = useSpring({ background: isToggled ? "#6ce2ff" : "#ebebeb" });
    const { y } = useSpring({
        y: isToggled ? 180 :0
    });
    const menuAppear = useSpring({
        transform: isToggled ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
        opacity: isToggled ? 1 : 0
    });
    return (
        <div style={{ position: "relative", width: "300px", margin: "0 auto" }}>
            <animated.button
                style={menubg}
                value="!toggled"
                className="radiowrapper"
                onMouseDown={() => setToggle(!isToggled)}
                id="tutorialMenu"
            >
                <div className="radio">
                    <p>Tutorial</p>
                    <animated.p
                        style={{
                            transform: y.interpolate(y => `rotateX(${y}deg)`)
                        }}
                    >
                        ▼
                    </animated.p>
                </div>
            </animated.button>
            <animated.div style={menuAppear}>
                {isToggled ? <RadioContent /> : null}
            </animated.div>
        </div>
    );
};

// use state object and set it to 0 initially 
const RadioContent = () => {
    return (
        <div className="radiocontent" >
            <a href="#" alt="Home">
            </a>
            <button id='4' onMouseDown={function () {
                updateTutorial();
            }} style={{ fontSize: '5vh' }}>Next</button>
            <p id="tutorialText" value="Change Text">Welcome to the Learn Alphabet Game! This game teaches you the Morse Code Alphabet! </p>
            <img src={spacebar} alt="Spacebar" id="spaceImage" style={{ display: "none" }}></img>
            <img src={enterButton} alt="Enter Button" id="enterImage" style={{ display: "none" }}></img>
        </div>
    );
};

export default LearnNumbers;