'use static';

const path = require('path');
const fs = require('fs');

const checkDependencies = (data) =>{
	if(data.match(/require\(/)) {
 		return data.match(/require.*\)/g);
 	}
 	return [];
}

/**
* Remove the require word and extra characteres
*/
const removeJunkPart = (dep) => {
	return dep.map(e => e.replace(/\'/g,'').replace("require(",'').replace(')',''));
}

/*
* Read all the requires from one file and return and array with all the dependencies
*/
const fileReader = (dirPath, filePath,moduleRoot) => {
	const fileContent = fs.readFileSync(filePath, "utf8");
	let requiredFiles = [];
	let dependencies = checkDependencies(fileContent);
	if(dependencies.length > 0){
		requiredFiles = removeJunkPart(dependencies)
		 					.map(pathRequired => (pathRequired.match(/@/)) ? pathRequired : path.resolve(dirPath, pathRequired).match('\/'+moduleRoot+'*.+')[0]	);
	}
	return requiredFiles;
}

/*
* Print the dependencie tree in the output file given 
*/
const printInOutputFile = (p,f, outputfile, moduleRoot) => {
  f.forEach(ele => {
    let thingToPrint = `"${p.match('\/'+moduleRoot+'*.+')}" -> { "${ele} "}`;
    fs.appendFile(path.join(__dirname,outputfile), thingToPrint+'\n', (err) => {
      if (err) return console.error(err);
    });
  });
};

/*
* Get the list of files
*/
const getListOfFiles = (dir, moduleRoot, outputfile) => {
	var files = fs.readdirSync(dir);
  var filelist = [];
  files.forEach(function(file) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        getListOfFiles(path.join(dir, file), outputfile);
      }
      else {
    		let wholeFilePath = path.join(dir, file);
       	let fileDependencies= fileReader(dir, wholeFilePath, moduleRoot);
       	filelist.push({[wholeFilePath]: fileDependencies});
       	printInOutputFile(path.join(dir, file),fileDependencies, outputfile, moduleRoot);
      }
  });
}

class CreateTree {
	constructor(startmodule, moduleRoot, outputfile) {
    this.startmodule = startmodule;
    this.outputfile = outputfile;
    this.moduleRoot = moduleRoot;
  }
  init() {
  	getListOfFiles(this.startmodule, this.moduleRoot, this.outputfile); //path where all the files are
  }
}

module.exports = CreateTree;
