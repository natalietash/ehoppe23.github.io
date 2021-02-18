import React, { forwardRef, useState, useImperativeHandle } from 'react';
import '../App.css';
import morse from '../Components/Assets/Images/morse.png'

function initial(type) {
  if (localStorage.getItem(type) != null) {
    return localStorage.getItem(type);
  }
  if (type === 'backgroundColor') {
    return 'blue';
  } else if (type === 'fontColor') {
    return 'white';
  }
}

const About = forwardRef((props, ref) => {
  const [backgroundColor, setBackgroundColor] = useState(() => initial('backgroundColor'));
  const [fontColor, setFontColor] = useState(() => initial('fontColor'));
  useImperativeHandle(
    ref,
    () => ({
      update() {
        setBackgroundColor(initial('backgroundColor'));
        setFontColor(initial('fontColor'));
      }
    }),
  )
  return (
    <div style={{
      position: 'relative',
      marginTop: '-3vh',
      height: '90vh',
      width: '100vw',
      color: fontColor,
      backgroundColor: 'white'
    }}>
      <h1 style={{ fontWeight: 900 }}>Who We Are</h1>

      <p style={{paddingLeft: "10vw", paddingRight: "10vw"}} >The Community Vision Assitive Technology (AT) Lab is an education and 
      resource center in Portland, Oregon that promotes accessibility & inclusive 
      in our community. We collaborate with people with disabilities, families, 
      caregivers, professionals, and community partners. We want more people to 
      see, access, and feel comfortable with AT. The Lab offers AT Consultations,
      Trainings & Workshops, Social Groups, a free Loan Closet, Equipment, Scholarships
      and more. </p>

      <p style={{ paddingLeft: "10vw", paddingRight: "10vw"}}>To learn more, visit us at: </p>
      <p style={{ paddingLeft: "10vw", paddingRight: "10vw"}}><a href="https://cv-atlab.org/" target="_blank">www.cv-atlab.org</a></p>
      <p style={{ paddingLeft: "10vw", paddingRight: "10vw"}}>or</p>
      <p style={{ paddingLeft: "10vw", paddingRight: "10vw"}}><a href="http://www.facebook.com/CVATLab" target="_blank">www.facebook.com/CVATLab</a></p>

      <h2 style={{ fontWeight: 900 }}>Why Morse?</h2>

      <p style={{paddingLeft: "10vw", paddingRight: "10vw"}}>Morse code represents numbers and letters using dots, dashes, and spaces and
        was invented in the 1800s to use on a telegraph machine. It was later used as a 
        communication method for some people who did not have speech in the early 1970s. 
        The technology begane to improve in the 1990s and is now being used on mobile devices.
        It has even caught the eye of Google in their <u>Hello Morse</u> project.
      </p>

      <img src={morse} alt="Morse" id="morseimage" width="500" height="333"></img>

      <p style={{paddingLeft: "10vw", paddingRight: "10vw"}}>Children are now being included in the Morse conversation. Many children with 
        physical disabilities, especially those who use adaptive switches, have difficulty
        accessing the alphabet and therefore, are not often taught the skills they need to 
        read and write. Morse code offers a quicker way to access the alphabet with the use
        of only 2 switches. A simple 'dot' and 'dash' can open the world of letters and 
        literacy. This website offers games to learn Morse code. Remember, children learn 
        and explore the alphabet when they are very young, so it is never too early to 
        start playing with Morse!</p>
    </div>
  );
})

export default About;
