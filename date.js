//jshint esversion:6
//******************************************************************************
//<<<<<<<<<<<<<code refactoring comments below >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//******************************************************************************
//even shorter way is to remove the 'module.'
//module.exports.getMonth = function() {
exports.getMonth = function() {
  //changing to const
  // let today = new Date();
  // let options = {
  const today = new Date();
  const options = {
    month: "long"
  };

  //remove the 'let day =' and set the return the value as
  //let day = today.toLocaleDateString("en-US", options);
  return today.toLocaleDateString("en-US", options);
};

//******************************************************************************
//******************************************************************************

//annonymous function: not as clean as the refactoring above if it is to be set to a variable...
//removed the function name, made it annonymous, and assigned it to a variable.
//function getDate() {
var getDate = function() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  //remove the 'let day =' and set the return the value as
  //let day = today.toLocaleDateString("en-US", options);
  return today.toLocaleDateString("en-US", options);
};

//module.exports = getDate;
//when there are multiple functions that can be called dotnotation helps to single them out...
module.exports.getDate = getDate;

//******************************************************************************
//******************************************************************************

//for a named function this is okay, but overused 'getDay' not as clean...
//module.exports = getDay;
module.exports.getDay = getDay;

function getDay() {
  const today = new Date();
  const options = {
    weekday: "long"
  };

  //let day = today.toLocaleDateString("en-US", options);
  //return day;
  return today.toLocaleDateString("en-US", options);
}

//the terminal output will show the exportable function names
console.log(module.exports);
