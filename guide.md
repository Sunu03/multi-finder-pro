## Overview
The code is a Chrome extension that allows users to search for and highlight words on a webpage. It provides a user interface (UI) for adding custom words, organizing them into folders, and performing searches. The extension also includes features such as importing/exporting settings, selecting/unselecting words, and navigating through the occurrences of a word on the page.

## Event Listeners
The code sets up several event listeners when the DOM content is loaded:
- `addWordButton`: Listens for a click event to add a new word.
- `mainSearchBtn`: Listens for a click event to perform the main search.
- `hamburgerMenu`: Listens for a click event to open/close the folder list.
- `folderSearchBtn`: Listens for a click event to perform the folder search.
- `importButton`: Listens for a click event to import settings.
- `exportButton`: Listens for a click event to export settings.
- `clearAllBtn`: Listens for a click event to clear all search inputs and selected words.
- `mainSearch`: Listens for input events to save the search input value and performs the main search when the Enter key is pressed.
- `wordSearchInput`: Listens for input events to search words based on the entered value.
- `folderInput` and `folderDropdown`: Listens for click and input events to populate the folder dropdown.
- `selectAllButton`: Listens for a click event to select all visible words.
- `clearSelectedButton`: Listens for a click event to unselect all words.

## Functions

### `saveSearchInput()`
- Role: Saves the search input value to Chrome's local storage.
- Variables:
  - `searchInput`: The search input element.

### `openFolderList()`
- Role: Opens the folder list and toggles the visibility of the main content and folder list.
- Variables:
  - `mainContent`: The main content element.
  - `folderList`: The folder list element.
  - `importExportButtons`: The import/export buttons element.
  - `hamburgerMenu`: The hamburger menu element.

### `closeFolderList()`
- Role: Closes the folder list and shows the main content.

### `loadWordsAndNotes()`
- Role: Loads the saved words and notes from Chrome's local storage and displays them in the UI.
- Variables:
  - `words`: An object containing the saved words organized by folders.
  - `notes`: The saved notes.
  - `selectedWords`: An array of selected words.

### `createSidebar(matches)`
- Role: Creates a sidebar displaying the highlighted words and their counts.
- Variables:
  - `matches`: An array of objects representing the matched words, their colors, and counts.

### `toggleSelectedWord(wordListItem, word, color)`
- Role: Toggles the selection state of a word and updates the selected words input field.
- Variables:
  - `wordListItem`: The list item element representing the word.
  - `word`: The word text.
  - `color`: The color of the word.
  - `selectedWordsInput`: The selected words input element.
  - `selectedWords`: An array of selected words.

### `clearAll()`
- Role: Clears all search inputs, selected words, and performs a search with an empty query to clear the highlights.
- Variables:
  - `mainSearchInput`: The main search input element.
  - `selectedWordsInput`: The selected words input element.
  - `wordCheckboxes`: An array of word checkbox elements.

### `addWord()`
- Role: Adds a new word with color and folder to Chrome's local storage.
- Variables:
  - `wordInput`: The word input element.
  - `colorInput`: The color input element.
  - `colorHexInput`: The color hex input element.
  - `folderInput`: The folder input element.
  - `word`: The entered word.
  - `color`: The selected color.
  - `colorHex`: The selected color hex value.
  - `folder`: The selected folder.
  - `words`: An object containing the saved words organized by folders.

### `removeWord(folder, wordToRemove)`
- Role: Removes a word from a specific folder in Chrome's local storage.
- Variables:
  - `folder`: The folder name.
  - `wordToRemove`: The word to be removed.
  - `words`: An object containing the saved words organized by folders.

### `searchAndHighlight()`
- Role: Performs a search and sends a message to the content script to highlight the words on the current tab.
- Variables:
  - `words`: An object containing the saved words organized by folders.
  - `selectedWords`: An array of selected words.
  - `wordsToHighlight`: An array of words to be highlighted.

### `performMainSearch()`
- Role: Performs the main search based on the search input and selected words.
- Variables:
  - `mainSearchInput`: The main search input element.
  - `searchWords`: An array of words entered in the main search input.
  - `folderSearchInput`: The folder search input element.
  - `folderSearchWords`: An array of words entered in the folder search input.
  - `selectedWords`: An array of selected words.
  - `allWords`: An array combining the search words, folder search words, and selected words.
  - `savedWords`: An object containing the saved words organized by folders.
  - `uniqueSavedWords`: A set of unique saved words.
  - `classicColors`: An array of predefined classic highlighter colors.
  - `colorIndex`: The index of the current color in the `classicColors` array.
  - `wordsToHighlight`: An array of words to be highlighted, along with their colors.

### `getRandomColor()`
- Role: Generates a random color in hexadecimal format.
- Variables:
  - `letters`: A string containing hexadecimal characters.
  - `color`: The generated random color.

### `handleSelectAllClick()`
- Role: Handles the "Select All" button click event and selects all visible words.
- Variables:
  - `wordsContainer`: The container element for the displayed words.
  - `visibleWordItems`: An array of visible word items.
  - `selectedWordsInput`: The selected words input element.
  - `selectedWords`: An array of selected words.

### `handleClearSelectedClick()`
- Role: Handles the "Clear Selected" button click event and unselects all words.
- Variables:
  - `selectedWordsInput`: The selected words input element.
  - `selectedWords`: An array of selected words.
  - `wordsContainer`: The container element for the displayed words.
  - `wordCheckboxes`: An array of word checkbox elements.
  - `selectAllButton`: The "Select All" button element.

### `displayWords(words, selectedWords)`
- Role: Displays the saved words in the UI.
- Variables:
  - `words`: An object containing the saved words organized by folders.
  - `selectedWords`: An array of selected words.
  - `wordsContainer`: The container element for the displayed words.
  - `folderDiv`: The folder container element.
  - `folderTitle`: The folder title element.
  - `folderCheckbox`: The folder checkbox element.
  - `wordListItem`: The list item element representing a word.
  - `checkboxContainer`: The container element for the word checkbox.
  - `checkbox`: The word checkbox element.
  - `wordSpan`: The span element displaying the word text.
  - `buttonContainer`: The container element for the edit and remove buttons.
  - `editButton`: The edit button element.
  - `removeButton`: The remove button element.
  - `editTagsInput`: The tags input element for editing.
  - `noteContainer`: The container element for displaying the note.
  - `noteSpan`: The span element displaying the note text.

### `openEditWordPopup(folder, wordObj)`
- Role: Opens the edit word popup and populates it with the word details.
- Variables:
  - `folder`: The folder name.
  - `wordObj`: The word object containing the word, color, tags, and note.
  - `editWordPopup`: The edit word popup element.
  - `editWordInput`: The input element for editing the word.
  - `editColorInput`: The input element for editing the color.
  - `editFolderInput`: The input element for editing the folder.
  - `editFolderDropdown`: The dropdown element for selecting the folder.
  - `editTagsInput`: The input element for editing the tags.
  - `editNoteInput`: The textarea element for editing the note.
  - `saveEditButton`: The save button element in the edit popup.
  - `cancelEditButton`: The cancel button element in the edit popup.

### `populateEditFolderDropdown(filter)`
- Role: Populates the folder dropdown in the edit word popup based on the filter.
- Variables:
  - `filter`: The filter string for matching folder names.
  - `editFolderDropdown`: The dropdown element for selecting the folder.
  - `words`: An object containing the saved words organized by folders.
  - `folders`: An array of folder names.
  - `filteredFolders`: An array of folder names filtered based on the filter string.

### `displayResults(results)`
- Role: Displays the search results in the UI.
- Variables:
  - `results`: An array of objects representing the search results, containing the word, color, and count.
  - `resultsContainer`: The container element for displaying the search results.
  - `card`: The card element representing a search result.
  - `existingCard`: The existing card element for a word, if any.
  - `countElement`: The element displaying the count of occurrences.
  - `textContainer`: The container element for the word text and count.
  - `wordText`: The span element displaying the word text.
  - `resultText`: The span element displaying the count of occurrences.
  - `buttonContainer`: The container element for the plus button and navigation arrows.
  - `plusButton`: The plus button element for saving the word.
  - `upArrow`: The up arrow button element for navigating to the previous occurrence.
  - `downArrow`: The down arrow button element for navigating to the next occurrence.

### `isColorCloserToWhite(color)`
- Role: Determines whether a color is closer to white or black.
- Variables:
  - `color`: The color in hexadecimal format.
  - `rgb`: The color converted to an RGB integer.
  - `r`: The red component of the color.
  - `g`: The green component of the color.
  - `b`: The blue component of the color.
  - `luminance`: The calculated luminance value.

### `navigateToWord(word, direction)`
- Role: Sends a message to the content script to navigate to a specific occurrence of a word and optionally select it.
- Variables:
  - `word`: The word to navigate to.
  - `direction`: The navigation direction (-1 for previous, 1 for next, default is 0 for the first occurrence).

### `saveState()`
- Role: Saves the current state of the extension, including search input, search results, folder list visibility, and hamburger menu rotation.
- Variables:
  - `searchInput`: The search input value.
  - `searchResults`: The HTML content of the search results container.
  - `folderList`: The visibility state of the folder list.
  - `mainContent`: The visibility state of the main content.
  - `importExportButtons`: The visibility state of the import/export buttons.
  - `hamburgerMenuRotated`: The rotation state of the hamburger menu.

### `saveWordToQuickSave(word, color, plusButton)`
- Role: Saves a word to the "Quick save" folder in Chrome's local storage.
- Variables:
  - `word`: The word to be saved.
  - `color`: The color of the word.
  - `plusButton`: The plus button element.
  - `words`: An object containing the saved words organized by folders.
  - `randomColor`: A randomly generated color.

### `getRandomColor()`
- Role: Generates a random color in hexadecimal format.
- Variables:
  - `letters`: A string containing hexadecimal characters.
  - `color`: The generated random color.

### `showNotification(message)`
- Role: Displays a notification with the specified message.
- Variables:
  - `message`: The notification message.
  - `notification`: The notification element.

### `restoreState()`
- Role: Restores the previous state of the extension, including search input, search results, folder list visibility, and hamburger menu rotation.
- Variables:
  - `searchInput`: The search input value.
  - `searchResults`: The HTML content of the search results container.
  - `folderList`: The visibility state of the folder list.
  - `mainContent`: The visibility state of the main content.
  - `importExportButtons`: The visibility state of the import/export buttons.
  - `hamburgerMenuRotated`: The rotation state of the hamburger menu.

### `navigateToWord(word, direction)`
- Role: Sends a message to the content script to navigate to a specific occurrence of a word.
- Variables:
  - `word`: The word to navigate to.
  - `direction`: The navigation direction (-1 for previous, 1 for next, default is 0 for the first occurrence).

### `populateFolderDropdown()`
- Role: Populates the folder dropdown based on user input and saved folders.
- Variables:
  - `folderInput`: The folder input element.
  - `folderDropdown`: The folder dropdown element.
  - `folderInputChange`: The event handler for the folder input change event.
  - `folderInputClick`: The event handler for the folder input click event.
  - `documentClick`: The event handler for the document click event.

### `populateDropdownOptions(filter)`
- Role: Populates the folder dropdown options based on the filter string.
- Variables:
  - `filter`: The filter string for matching folder names.
  - `folderDropdown`: The folder dropdown element.
  - `words`: An object containing the saved words organized by folders.
  - `folders`: An array of folder names.
  - `filteredFolders`: An array of folder names filtered based on the filter string.
  - `uniqueFolders`: An array of unique folder names.

### `searchWords(searchTerm)`
- Role: Searches for words based on the given search term and updates the UI accordingly.
- Variables:
  - `searchTerm`: The search term entered by the user.
  - `wordsContainer`: The container element for the displayed words.
  - `folderDivs`: An array of folder container elements.
  - `foldersWithMatches`: A set of folders that have matching words.
  - `wordItems`: An array of word item elements within a folder.
  - `folderHasMatch`: A flag indicating whether a folder has any matching words.
  - `wordSpan`: The span element displaying the word text.
  - `word`: The word text.
  - `tagsInput`: The tags input element for a word.
  - `tags`: The tags associated with a word.
  - `searchTermLower`: The search term in lowercase.
  - `wordMatch`: A flag indicating whether the word matches the search term.
  - `tagMatch`: A flag indicating whether any tag matches the search term.
  - `noteContainer`: The container element for displaying the note.

### `importSettings()`
- Role: Imports settings from a JSON file selected by the user.
- Variables:
  - `fileInput`: The file input element for selecting the JSON file.
  - `file`: The selected JSON file.
  - `reader`: The FileReader object for reading the JSON file.
  - `importedData`: The imported data parsed from the JSON file.
  - `modal`: The modal element for displaying import options and contents.
  - `importList`: The list element for displaying the folders to import.
  - `confirmImportBtn`: The button element for confirming the import.
  - `cancelImportBtn`: The button element for canceling the import.
  - `importOption`: The selected import option (replace or add).
  - `selectedFolders`: An array of selected folder names to import.
  - `importSettings`: An object containing the settings to import.
  - `currentSettings`: The current settings stored in Chrome's local storage.
  - `updatedSettings`: The updated settings after importing.

### `exportSettings()`
- Role: Exports the current settings to a JSON file.
- Variables:
  - `exportedData`: The current settings data stringified as JSON.
  - `blob`: The Blob object representing the JSON file.
  - `url`: The URL of the JSON file.
  - `link`: The anchor element for downloading the JSON file.

## Conclusion
This documentation