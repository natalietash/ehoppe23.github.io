/**
 * Looks through all the files in the 'Images' directory
 * Generate a .json file that contains relavent information for LearnWord Game
 * Each data will have a unique id
 * 
 * Author: Huy Nguyen
 * Created: 9/30/2020
 * Modified: 9/30/2020
 */

generateData();

function generateData () {
    //File system module
    var fs = require('fs');
    var path = require('path');

    //Get JSON file
    const myData = [];

    //Read the images in the directory 'Images'
    var images = fs.readdirSync('./Images', (err) => {
        if (err) throw err;
    });

     /**
     * Loop through all the images
     * push the correct image data to the 
     */
    images.forEach(image => {
         //Check that file is an image
        if(path.parse(image).ext.localeCompare('.png') === 0 || path.parse(image).ext.localeCompare('.jpg') === 0) {
            //Variable to store all necessary information from each image
            let imageData = {
                 name: path.parse(image).name.toUpperCase(),
                imagePath: './Images/' + image
            };
            //Push data to json obj
            myData.push(imageData);
        }
    });
    console.log(myData);
    //Write the data created to WordGameData.json
    fs.writeFile('./WordGameData.json', JSON.stringify(myData), err => {
        //Check for errors
        if (err) throw err;
    })
}

//export default generateData;