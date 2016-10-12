var fs = require('fs');
var path = require('path');

var scrollfinder = {};

scrollfinder.find = function(options) {
	if (!options.rootDirectory) options.rootDirectory = '.';
	if (!options.rootURL) options.rootURL = '';
	if (!options.fileExtension) options.fileExtension = '';
	if (!options.ignore) options.ignore = [];

	options.rootDirectory = path.resolve(options.rootDirectory);

	var scrollList = [];

	var dirQueue = [{ local: options.rootDirectory, url: options.rootURL }];

	while (dirQueue.length > 0) {
		var curDir = dirQueue.shift();
		var curDirList = fs.readdirSync(curDir.local);


		curDirList.forEach(function(fileName, i, arr) {

			var curFileLocal = curDir.local + path.sep + fileName;
			var curFileURL = curDir.url + '/' + fileName;
			var curFileStat = fs.statSync(curFileLocal);
			var curFileExtension = curFileLocal.slice(-options.fileExtension.length).toLowerCase();

			// Add each subdirectory to the processing queue and each matched ending to the include
			if (curFileStat.isDirectory()) {

				if (!options.ignore.includes(fileName) && !options.ignore.includes(curFileLocal))
					dirQueue.push({local: curFileLocal, url: curFileURL});

				// Add each matching file (if not ignored)
			} else if (curFileExtension == options.fileExtension || options.fileExtension == '') {

				var listItem = {};
				if (options.objectForm) listItem[options.objectForm] = curFileURL;
				else listItem = curFileURL;

				if (!options.ignore.includes(fileName) && !options.ignore.includes(curFileLocal)) {
					scrollList.push(listItem);
					options.ignore.push(curFileLocal);
				}

			}
		});
	}

	return scrollList;
};

module.exports = scrollfinder;