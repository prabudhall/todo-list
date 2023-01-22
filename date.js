
// console.log(module);
// can also keep module.exports = getDate; which dictely returns the functions return statement
// where as in below method we need to write the name of the given function(left side) also
module.exports.getDate = getDate;

function getDate() {
  var options = {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
   day: 'numeric'
  };
  const date = new Date();
  // const today = date.getDay();
  var dt = date.toLocaleDateString('en-US', options);

  return dt;
}

// can directly write exports - works in same manner
module.exports.getDay = getDay;
function getDay() {
  var options = {
    weekday: 'long',
   //  year: 'numeric',
   //  month: 'long',
   // day: 'numeric'
  };
  const date = new Date();
  // const today = date.getDay();
  var dt = date.toLocaleDateString('en-US', options);

  return dt;
}

// console.log(module.exports);
