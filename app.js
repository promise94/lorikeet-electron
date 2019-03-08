"use strict";

const fileSystem = require("./src/fileSystem");
const userInterface = require("./src/userInterface");
const search = require("./src/search");

function main() {
  let folderPath = fileSystem.getUsersHomeFolder();
  userInterface.loadDirectory(folderPath)(window);
  userInterface.bindSearchField(event => {
    const query = event.target.value;
    if (query === "") {
      userInterface.resetFilter();
    } else {
      search.find(query, userInterface.filterResults);
    }
  });
}

window.onload = main;
