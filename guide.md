## Overview
The code is a Chrome extension that allows users to search for and highlight words on a webpage. It provides a user interface (UI) for adding custom words, organizing them into folders, and performing searches. The extension also includes features such as importing/exporting settings, selecting/unselecting words, and navigating through the occurrences of a word on the page.

## popup.js

### Overview
The `popup.js` file contains the JavaScript code that handles the functionality and interactivity of the extension's popup user interface. It includes event listeners, function definitions, and interactions with Chrome's storage and messaging APIs.

### Event Listeners
- `DOMContentLoaded`: Listens for the DOM content to be loaded and triggers the initialization of the popup.
- `addWordButton.click`: Listens for the click event on the "Add Word" button and triggers the `addWord` function.
- `mainSearchBtn.click`: Listens for the click event on the "Main Search" button and triggers the `performMainSearch` function.
- `hamburgerMenu.click`: Listens for the click event on the hamburger menu and triggers the `openFolderList` function.
- `folderSearchBtn.click`: Listens for the click event on the "Folder Search" button and triggers the `performMainSearch` function.
- `importButton.click`: Listens for the click event on the "Import" button and triggers the `importSettings` function.
- `exportButton.click`: Listens for the click event on the "Export" button and triggers the `exportSettings` function.
- `clearAllBtn.click`: Listens for the click event on the "Clear All" button and triggers the `clearAll` function.
- `mainSearch.input`: Listens for the input event on the main search input and triggers the `saveSearchInput` function.
- `mainSearch.keydown`: Listens for the keydown event on the main search input and triggers the `performMainSearch` function if the Enter key is pressed.
- `wordSearchInput.input`: Listens for the input event on the word search input and triggers the `searchWords` function.
- `selectAllButton.click`: Listens for the click event on the "Select All" button and triggers the `handleSelectAllClick` function.
- `clearSelectedButton.click`: Listens for the click event on the "Clear Selected" button and triggers the `handleClearSelectedClick` function.

### Functions

#### `saveSearchInput()`
- Role: Saves the search input value to Chrome's local storage.
- Description: This function retrieves the value of the main search input and saves it to Chrome's local storage using the `chrome.storage.local.set` method.

#### `openFolderList()`
- Role: Opens the folder list and toggles the visibility of the main content and folder list.
- Description: This function toggles the visibility of the main content, folder list, import/export buttons, and updates the hamburger menu rotation based on the current state.

#### `closeFolderList()`
- Role: Closes the folder list and shows the main content.
- Description: This function hides the folder list, shows the main content, hides the import/export buttons, and resets the hamburger menu rotation.

#### `loadWordsAndNotes()`
- Role: Loads the saved words and notes from Chrome's local storage and displays them in the UI.
- Description: This function retrieves the saved words, notes, and selected words from Chrome's local storage using the `chrome.storage.local.get` method and calls the `displayWords` function to update the UI.

#### `createSidebar(matches)`
- Role: Creates a sidebar displaying the highlighted words and their counts.
- Parameters:
  - `matches`: An array of objects representing the matched words, their colors, and counts.
- Description: This function creates a sidebar element, populates it with the matched words and their counts, and appends it to the document body.

#### `toggleSelectedWord(wordListItem, word, color)`
- Role: Toggles the selection state of a word and updates the selected words input field.
- Parameters:
  - `wordListItem`: The list item element representing the word.
  - `word`: The word text.
  - `color`: The color of the word.
- Description: This function toggles the selection state of a word by adding or removing it from the selected words array, updates the selected words input field, and saves the selected words to Chrome's local storage.

#### `clearAll()`
- Role: Clears all search inputs, selected words, and performs a search with an empty query to clear the highlights.
- Description: This function clears the main search input, selected words input, unchecks all word checkboxes, and calls the `performMainSearch` function with an empty query to clear the highlights.

#### `addWord()`
- Role: Adds a new word with color and folder to Chrome's local storage.
- Description: This function retrieves the values from the word input, color input, color hex input, and folder input fields. It checks if the word already exists in any folder and shows a notification if it does. If the word doesn't exist, it adds the word to the specified folder in Chrome's local storage, updates the UI by calling the `loadWordsAndNotes` function, and clears the input fields.

#### `removeWord(folder, wordToRemove)`
- Role: Removes a word from a specific folder in Chrome's local storage.
- Parameters:
  - `folder`: The folder name.
  - `wordToRemove`: The word to be removed.
- Description: This function retrieves the saved words from Chrome's local storage, removes the specified word from the specified folder, and updates Chrome's local storage and the UI by calling the `loadWordsAndNotes` function.

#### `searchAndHighlight()`
- Role: Performs a search and sends a message to the content script to highlight the words on the current tab.
- Description: This function retrieves the selected words from the UI, sends a message to the content script of the active tab to highlight the words, and displays an alert based on the response.

#### `performMainSearch()`
- Role: Performs the main search based on the search input and selected words.
- Description: This function retrieves the search words from the main search input and folder search input, combines them with the selected words, sorts the words by length in descending order, and sends a message to the content script of the active tab to clear existing highlights and highlight the words. It also displays the search results in the UI by calling the `displayResults` function, saves the current state, and updates the custom scrollbar indicator.

#### `getRandomColor()`
- Role: Generates a random color in hexadecimal format.
- Returns: The generated random color.
- Description: This function generates a random color by concatenating random hexadecimal characters.

#### `handleSelectAllClick()`
- Role: Handles the "Select All" button click event and selects all visible words.
- Description: This function retrieves all visible word items, adds them to the selected words array if they are not already selected, updates the selected words input field, and saves the selected words to Chrome's local storage.

#### `handleClearSelectedClick()`
- Role: Handles the "Clear Selected" button click event and unselects all words.
- Description: This function clears the selected words array, updates the selected words input field, saves the selected words to Chrome's local storage, unchecks all word checkboxes, and updates the "Select All" button text.

#### `displayWords(words, selectedWords)`
- Role: Displays the saved words in the UI.
- Parameters:
  - `words`: An object containing the saved words organized by folders.
  - `selectedWords`: An array of selected words.
- Description: This function creates the HTML elements for each folder and word, populates them with the word details, and appends them to the words container. It also handles the selection state of words based on the `selectedWords` array and adds event listeners for editing and removing words.

#### `openEditWordPopup(folder, wordObj)`
- Role: Opens the edit word popup and populates it with the word details.
- Parameters:
  - `folder`: The folder name.
  - `wordObj`: The word object containing the word, color, tags, and note.
- Description: This function populates the edit word popup with the word details, sets up event listeners for editing the word, and handles saving or canceling the changes.

#### `populateEditFolderDropdown(filter)`
- Role: Populates the folder dropdown in the edit word popup based on the filter.
- Parameters:
  - `filter`: The filter string for matching folder names.
- Description: This function retrieves the saved words from Chrome's local storage, filters the folder names based on the provided filter, and populates the folder dropdown in the edit word popup with the filtered folders.

#### `displayResults(results)`
- Role: Displays the search results in the UI.
- Parameters:
  - `results`: An array of objects representing the search results, containing the word, color, and count.
- Description: This function creates or updates the HTML elements for each search result, populates them with the word details and count, and appends them to the results container. It also adds event listeners for saving words and navigating through occurrences.

#### `isColorCloserToWhite(color)`
- Role: Determines whether a color is closer to white or black.
- Parameters:
  - `color`: The color in hexadecimal format.
- Returns: `true` if the color is closer to white, `false` otherwise.
- Description: This function calculates the luminance of the given color and returns `true` if the luminance is greater than 128 (closer to white) or `false` otherwise.

#### `navigateToWord(word, direction)`
- Role: Sends a message to the content script to navigate to a specific occurrence of a word and optionally select it.
- Parameters:
  - `word`: The word to navigate to.
  - `direction`: The navigation direction (-1 for previous, 1 for next, default is 0 for the first occurrence).
- Description: This function sends a message to the content script of the active tab to navigate to a specific occurrence of the word and optionally select it based on the provided direction.

#### `saveState()`
- Role: Saves the current state of the extension, including search input, search results, folder list visibility, and hamburger menu rotation.
- Description: This function retrieves the current state of the search input, search results, folder list visibility, main content visibility, import/export buttons visibility, and hamburger menu rotation, and saves them to Chrome's local storage.

#### `saveWordToQuickSave(word, color, plusButton)`
- Role: Saves a word to the "Quick save" folder in Chrome's local storage.
- Parameters:
  - `word`: The word to be saved.
  - `color`: The color of the word.
  - `plusButton`: The plus button element.
- Description: This function retrieves the saved words from Chrome's local storage, adds the word to the "Quick save" folder if it doesn't already exist, updates Chrome's local storage, displays a notification, and removes the plus button.

#### `getRandomColor()`
- Role: Generates a random color in hexadecimal format.
- Returns: The generated random color.
- Description: This function generates a random color by concatenating random hexadecimal characters.

#### `showNotification(message)`
- Role: Displays a notification with the specified message.
- Parameters:
  - `message`: The notification message.
- Description: This function creates a notification element, sets its message, appends it to the document body, and removes it after a specified duration.

#### `restoreState()`
- Role: Restores the previous state of the extension, including search input, search results, folder list visibility, and hamburger menu rotation.
- Description: This function retrieves the saved state from Chrome's local storage and restores the search input value, search results, folder list visibility, main content visibility, import/export buttons visibility, and hamburger menu rotation.

#### `navigateToWord(word, direction)`
- Role: Sends a message to the content script to navigate to a specific occurrence of a word.
- Parameters:
  - `word`: The word to navigate to.
  - `direction`: The navigation direction (-1 for previous, 1 for next, default is 0 for the first occurrence).
- Description: This function sends a message to the content script of the active tab to navigate to a specific occurrence of the word based on the provided direction.

#### `populateFolderDropdown()`
- Role: Populates the folder dropdown based on user input and saved folders.
- Description: This function sets up event listeners for the folder input and dropdown, and populates the dropdown options based on the user input and saved folders.

#### `populateDropdownOptions(filter)`
- Role: Populates the folder dropdown options based on the filter string.
- Parameters:
  - `filter`: The filter string for matching folder names.
- Description: This function retrieves the saved words from Chrome's local storage, filters the folder names based on the provided filter, and populates the folder dropdown with the filtered folders.

#### `searchWords(searchTerm)`
- Role: Searches for words based on the given search term and updates the UI accordingly.
- Parameters:
  - `searchTerm`: The search term entered by the user.
- Description: This function retrieves all folder containers and word items, searches for words and tags that match the provided search term, and updates the visibility of folders and word items based on the search results.

#### `importSettings()`
- Role: Imports settings from a JSON file selected by the user.
- Description: This function creates a file input element, listens for the file selection event, reads the selected JSON file, creates a modal for selecting import options and folders, and updates Chrome's local storage and the UI based on the user's import selections.

#### `exportSettings()`
- Role: Exports the current settings to a JSON file.
- Description: This function retrieves the current settings from Chrome's local storage, creates a JSON file with the settings data, and triggers a download of the JSON file.

## Conclusion
The `popup.js` file handles the functionality and interactivity of the extension's popup user interface. It includes event listeners for various user actions, such as adding words, performing searches, navigating through occurrences, managing folders, importing/exporting settings, and more.

The functions in this file interact with Chrome's storage API to store and retrieve data, update the UI based on the saved data, and communicate with the content script to perform actions on the web page.











## content.js

### Overview
The `content.js` file is a content script that runs in the context of web pages visited by the user. It is responsible for performing actions on the web page, such as highlighting words, navigating through occurrences, and communicating with the extension's popup script.

### Variables
- `currentPosition`: An object that keeps track of the current position for each search term.

### Functions

#### `highlightWord(word, color)`
- Role: Highlights occurrences of a word on the web page with the specified color.
- Parameters:
  - `word`: The word to highlight.
  - `color`: The color to use for highlighting.
- Returns: The total count of occurrences of the word.
- Description: This function uses regular expressions to find occurrences of the word on the web page, wraps them in `<multiwordfinder-highlight>` elements, and applies the specified color. It also calculates the vertical position of each highlight as a percentage of the total document height and stores it in a data attribute.

#### `clearHighlights()`
- Role: Clears all the highlighted words on the web page.
- Description: This function removes all the `<multiwordfinder-highlight>` elements from the web page and restores the original text content.

#### `navigateToOccurrence(word, direction = 0)`
- Role: Navigates to a specific occurrence of a word on the web page.
- Parameters:
  - `word`: The word to navigate to.
  - `direction`: The navigation direction (-1 for previous, 1 for next, default is 0 for the first occurrence).
- Description: This function finds all the occurrences of the specified word on the web page, removes the `selected-word` class from all occurrences, and scrolls to the target occurrence based on the direction. It also adds the `selected-word` class to the target occurrence.

#### `selectText(element)`
- Role: Selects the text content of a given element.
- Parameters:
  - `element`: The element whose text content should be selected.
- Description: This function creates a range, selects the text content of the specified element, and adds the range to the selection.

#### `updateCustomScrollbarIndicator()`
- Role: Updates the custom scrollbar indicator on the web page.
- Description: This function creates or updates a custom scrollbar indicator element on the web page. It calculates the position of each highlight as a percentage of the total document height and adds a marker for each highlight to the scrollbar indicator.

#### `getContrastColor(color)`
- Role: Determines the contrast color (black or white) based on the given color.
- Parameters:
  - `color`: The color to determine the contrast color for.
- Returns: The contrast color (black or white).
- Description: This function calculates the luminance of the given color and returns black or white based on the luminance value.

### Event Listeners
- `chrome.runtime.onMessage.addListener`: Listens for messages from the extension's popup script and performs actions based on the message action, such as clearing highlights, navigating to occurrences, or updating the scrollbar indicator.








## background.js

### Overview
The `background.js` file is a background script that runs independently of any particular web page. It is responsible for handling events and communicating with the content script.

### Event Listeners

#### `chrome.action.onClicked.addListener`
- Description: Listens for the extension icon click event and executes the `content.js` script in the active tab.

## Conclusion
The `content.js` file plays a crucial role in interacting with web pages, highlighting words, navigating through occurrences, and providing visual indicators. It communicates with the extension's popup script to perform actions based on user interactions.

The `background.js` file, on the other hand, acts as a background script that listens for events and facilitates communication between different parts of the extension.
