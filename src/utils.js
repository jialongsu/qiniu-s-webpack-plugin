const chalk = require('chalk');

exports.log = (text, color='green') => {
  console.log(chalk[color](text));
}