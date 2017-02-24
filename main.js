'use static';
/*
* Example to run: node main.js wholePathFromYourMainprojectFolder moduleRoot outPutFile
* initialFolderFromYourIndex i.e: JS/Iframe
*/

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const initialFolder = process.argv[2];
const moduleRoot = process.argv[2].split('/')[0];
const absoltutePath = path.join(__dirname, '../' + initialFolder);//Change this for other folder
const outputFileName = process.argv[3];
const CreateTree = require('./createfile/createdependenciestree');
const port = process.env.port || 4000;

const removeExistFile = (wholepath) => {
  fs.unlink(wholepath, () => {
    return;
  }); 
};

if (process.argv.length === 4){
	const createTree = new CreateTree(absoltutePath,moduleRoot,outputFileName);
  
  removeExistFile(path.join(__dirname, '/createfile/'+outputFileName));
  createTree.init();
} else {
	console.log('Error >>> Example to init: node main.js pathInitialFolder outPutFile');
}

