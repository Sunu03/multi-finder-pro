let results = []; // Declare the results array
let currentPosition = {}; // Declare the currentPosition object

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded called');
  // Load saved words and notes from storage
  loadWordsAndNotes();
  restoreState();
  populateFolderDropdown();

  // Add event listeners for adding words, colors, saving notes, and searching
  document.querySelector('#addWordButton').addEventListener('click', addWord);
  document.querySelector('#mainSearchBtn').addEventListener('click', performMainSearch);
  document.querySelector('#hamburgerMenu').addEventListener('click', openFolderList);
  document.querySelector('#folderSearchBtn').addEventListener('click', performMainSearch);
  document.querySelector('#importButton').addEventListener('click', importSettings);
  document.querySelector('#exportButton').addEventListener('click', exportSettings);
  document.querySelector('#clearAllBtn').addEventListener('click', clearAll);
  document.querySelector('#partialSearchBtn').addEventListener('click', performPartialSearch);
  document.querySelector('#folderClearAllBtn').addEventListener('click', folderClearAll);

  // Focus on the search input field after the popup is loaded and state is restored
  const searchInput = document.querySelector('#mainSearch');
  searchInput.addEventListener('input', saveSearchInput);
  if (searchInput) {
    searchInput.focus();

    // Optional: Place the cursor at the end of the text if there's already text in the input
    const length = searchInput.value.length;
    searchInput.setSelectionRange(length, length);
  }
  if (searchInput) {
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        performMainSearch();
      }
    });
  }
  const wordSearchInput = document.querySelector('#wordSearchInput');
  wordSearchInput.addEventListener('input', (e) => {
    searchWords(e.target.value);
  });

  // Add event listeners for the folder input and dropdown
  const folderInput = document.querySelector('#folderInput');
  const folderDropdown = document.querySelector('#folderDropdown');
  const selectAllButton = document.querySelector('#selectAllButton');
  selectAllButton.addEventListener('click', handleSelectAllClick);
  const clearSelectedButton = document.querySelector('#clearSelectedButton');
  clearSelectedButton.addEventListener('click', handleClearSelectedClick);
  const addWordSection = document.querySelector('#addWordSection');
  const addWordToggle = document.querySelector('#addWordToggle');
  const addWordContent = document.querySelector('#addWordContent');

  addWordSection.addEventListener('click', () => {
    addWordContent.classList.toggle('hidden');
    addWordToggle.classList.toggle('collapsed');
  });

});

function saveSearchInput() {
  const searchInput = document.querySelector('#mainSearch');
  chrome.storage.local.set({ 'searchInput': searchInput.value }, function() {
    console.log('Search input saved');
  });
}

function restoreState() {
  chrome.storage.local.get(['searchInput', 'folderList', 'mainContent', 'importExportButtons', 'hamburgerMenuRotated', 'currentPosition', 'results'], function(result) {
    if (result.searchInput) {
      document.querySelector('#mainSearch').value = result.searchInput;
    }
    
    // Always show the main content and hide the folder list
    document.querySelector('#folderList').classList.add('hidden');
    document.querySelector('#mainContent').classList.remove('hidden');
    document.querySelector('#importExportButtons').classList.add('hidden');
    document.querySelector('#hamburgerMenu').classList.remove('rotate-90');
    
    if (result.currentPosition) {
      currentPosition = result.currentPosition;
    }

    if (result.results) {
      results = result.results;
      displayResults(results);
    } else if (result.searchResults) {
      document.querySelector('#resultsContainer').innerHTML = result.searchResults;
    }
  });
}


function openFolderList() {
  const mainContent = document.querySelector('#mainContent');
  const folderList = document.querySelector('#folderList');
  const importExportButtons = document.querySelector('#importExportButtons');
  const hamburgerMenu = document.querySelector('#hamburgerMenu');

  if (folderList.classList.contains('hidden')) {
    mainContent.classList.add('hidden');
    folderList.classList.remove('hidden');
    importExportButtons.classList.remove('hidden');
    hamburgerMenu.classList.add('rotate-90');
  } else {
    mainContent.classList.remove('hidden');
    folderList.classList.add('hidden');
    importExportButtons.classList.add('hidden');
    hamburgerMenu.classList.remove('rotate-90');
  }
}

function closeFolderList() {
  document.querySelector('#folderList').classList.add('hidden');
  document.querySelector('#mainContent').classList.remove('hidden');
  document.querySelector('#importExportButtons').classList.add('hidden');
  document.querySelector('#hamburgerMenu').classList.remove('rotate-90');
}


function loadWordsAndNotes() {
  chrome.storage.local.get(['words', 'notes', 'selectedWords'], (result) => {
    const words = result.words || {};
    const notes = result.notes || '';
    const selectedWords = result.selectedWords || [];

    displayWords(words, selectedWords);
  });
}

function createSidebar(matches) {
  const sidebar = document.createElement('div');
  sidebar.id = 'multi-find-sidebar';
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: white;
    border-left: 1px solid #ccc;
    overflow-y: scroll;
    padding: 10px;
    box-sizing: border-box;
    z-index: 9999;
    font-size: 14px;
  `;

  const title = document.createElement('h3');
  title.textContent = 'Multi-Find Highlights';
  sidebar.appendChild(title);

  const list = document.createElement('ul');
  matches.forEach(match => {
    if (match.count > 0) {
      const listItem = document.createElement('li');
      listItem.textContent = `${match.word} (${match.color}) ${match.count} counts`;
      listItem.style.color = match.color;
      list.appendChild(listItem);
    }
  });
  sidebar.appendChild(list);

  document.body.appendChild(sidebar);
}

function folderClearAll() {
  // Clear the search input
  const mainSearchInput = document.querySelector('#mainSearch');
  mainSearchInput.value = '';

  // Clear the selected words
  const selectedWordsInput = document.querySelector('#selectedWords');
  selectedWordsInput.value = '[]';
  chrome.storage.local.set({ selectedWords: [] });

  // Uncheck all word checkboxes
  const wordCheckboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
  wordCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  // Perform a search with an empty query to clear everything
  performMainSearch();
}

function toggleSelectedWord(wordListItem, word, color) {
  const selectedWordsInput = document.querySelector('#selectedWords');
  const selectedWords = JSON.parse(selectedWordsInput.value);
  const wordIndex = selectedWords.findIndex((w) => w.word === word && w.color === color);

  if (wordIndex === -1) {
    selectedWords.push({ word, color });
    wordListItem.classList.add('selected');
  } else {
    selectedWords.splice(wordIndex, 1);
    wordListItem.classList.remove('selected');
  }

  selectedWordsInput.value = JSON.stringify(selectedWords);
  chrome.storage.local.set({ selectedWords }); // Save selected words to local storage
}

function clearAll() {
  // Clear the search input
  const mainSearchInput = document.querySelector('#mainSearch');
  mainSearchInput.value = '';

  // Clear the selected words
  const selectedWordsInput = document.querySelector('#selectedWords');
  selectedWordsInput.value = '[]';
  chrome.storage.local.set({ selectedWords: [] });

  // Uncheck all word checkboxes
  const wordCheckboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
  wordCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  // Perform a search with an empty query to clear everything
  performMainSearch();
}

function addWord() {
  const wordInput = document.querySelector('#wordInput');
  const colorInput = document.querySelector('#colorInput');
  const colorHexInput = document.querySelector('#colorHexInput');
  const folderInput = document.querySelector('#folderInput');

  if (wordInput && folderInput) {
    const word = wordInput.value;
    const color = colorInput ? colorInput.value : '';
    const colorHex = colorHexInput ? colorHexInput.value : '';
    const folder = folderInput.value;

    if (word && folder) {
      chrome.storage.local.get(['words'], (result) => {
        const words = result.words || {};

        // Check if the word exists in any folder
        const existingWordFolder = Object.keys(words).find(folderName =>
          words[folderName].some(wordObj => wordObj.word === word)
        );

        if (existingWordFolder) {
          // Show a popup notification if the word already exists in any folder
          showNotification(`The word "${word}" is already saved in the "${existingWordFolder}" folder.`);
        } else {
          if (!words[folder]) {
            words[folder] = [];
          }

          const selectedColor = colorHex || (color !== '#000000' ? color : getRandomColor());

          words[folder].push({ word, color: selectedColor });

          chrome.storage.local.set({ words }, () => {
            loadWordsAndNotes();
            document.querySelector('#wordInput').value = '';
            document.querySelector('#colorInput').value = '#000000';
            document.querySelector('#colorHexInput').value = '';
            document.querySelector('#folderSelect').value = '';
          });
        }
      });
    } else {
      alert('Please fill in the word and select a folder.');
    }
  }
}

function removeWord(folder, wordToRemove) {
  chrome.storage.local.get(['words'], (result) => {
    const words = result.words || {};

    if (words[folder]) {
      words[folder] = words[folder].filter((wordObj) => wordObj.word !== wordToRemove);

      if (words[folder].length === 0) {
        delete words[folder];
      }

      chrome.storage.local.set({ words }, () => {
        loadWordsAndNotes();
      });
    }
  });
}


function searchAndHighlight() {
  chrome.storage.local.get(['words'], (result) => {
    const words = result.words || {};

    // Get the selected words
    const selectedWords = JSON.parse(document.querySelector('#selectedWords').value);
    const wordsToHighlight = [...selectedWords];

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "searchAndHighlight", words: wordsToHighlight }, (response) => {
        if (response && response.result === "success") {
          alert("Words highlighted successfully!");
        } else {
          alert("Failed to highlight words!");
        }
      });
    });
  });
}

function performMainSearch() {
  const mainSearchInput = document.querySelector('#mainSearch');
  const searchWords = mainSearchInput.value.split(',').map(word => word.trim());

  const folderSearchInput = document.querySelector('#wordInput');
  const folderSearchWords = folderSearchInput.value.split(',').map(word => word.trim());

  // Get the selected words from Chrome storage
  chrome.storage.local.get('selectedWords', (result) => {
    const selectedWords = result.selectedWords || [];

    // Combine searchWords, folderSearchWords, and selectedWords into a single array
    const allWords = [...searchWords, ...folderSearchWords, ...selectedWords.map(obj => obj.word)];

    // Sort the words by length in descending order
    allWords.sort((a, b) => b.length - a.length);

  // Clear existing highlights before performing the search
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'clearHighlights' }, (response) => {
      if (response && response.status === 'Highlights cleared') {
        currentPosition = {}; // Reset currentPosition before performing the search
          // Get the saved words from storage
          chrome.storage.local.get(['words'], (storageResult) => {
            const savedWords = storageResult.words || {};

            // Create a Set to store unique saved words
            const uniqueSavedWords = new Set();
            Object.values(savedWords).forEach(wordList => {
              wordList.forEach(wordObj => uniqueSavedWords.add(wordObj.word));
            });

            // Define the classic highlighter colors
            const classicColors = [
              '#FFFF77',
              '#7777FF',
              '#77FF92',
              '#C977FF',
              '#77FFE4',
              '#77C9FF',
              '#FF7792',
              '#FFAE77'
            ];

            let colorIndex = 0;

            // Send words to content script for highlighting, longest first
            const wordsToHighlight = allWords.map(word => {
              if (uniqueSavedWords.has(word)) {
                // If the word is saved, find its color from the saved words
                const savedWord = Object.values(savedWords).find(wordList =>
                  wordList.find(wordObj => wordObj.word === word)
                );
                const color = savedWord ? savedWord.find(wordObj => wordObj.word === word).color : getRandomColor();
                return { word, color };
              } else {
                // If the word is not saved, assign a color from the classic highlighter colors or a random color
                const color = colorIndex < classicColors.length ? classicColors[colorIndex] : getRandomColor();
                colorIndex++;
                return { word, color };
              }
            });

            chrome.tabs.sendMessage(tabs[0].id, { action: 'searchAndHighlight', words: wordsToHighlight }, (response) => {
              if (response.result === 'success') {
                results = response.results;
                displayResults(results);
                saveState();
                
                // Save the current position for each word
                results.forEach(result => {
                  currentPosition[result.word] = 0;
                });
                
                chrome.storage.local.set({ currentPosition });
              }
            });

            // Update the custom scrollbar indicator
            chrome.tabs.sendMessage(tabs[0].id, { action: 'updateScrollbarIndicator' });
          });
        }
      });
    });
  });
}

function performPartialSearch() {
  const mainSearchInput = document.querySelector('#mainSearch');
  const searchWords = mainSearchInput.value.split(',').map(word => word.trim());

  const folderSearchInput = document.querySelector('#wordInput');
  const folderSearchWords = folderSearchInput.value.split(',').map(word => word.trim());

  // Get the selected words from Chrome storage
  chrome.storage.local.get('selectedWords', (result) => {
    const selectedWords = result.selectedWords || [];

    // Combine searchWords, folderSearchWords, and selectedWords into a single array
    const allWords = [...searchWords, ...folderSearchWords, ...selectedWords.map(obj => obj.word)];

  // Clear existing highlights before performing the search
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'clearHighlights' }, (response) => {
      if (response && response.status === 'Highlights cleared') {
        currentPosition = {}; // Reset currentPosition before performing the search
          // Get the saved words from storage
          chrome.storage.local.get(['words'], (storageResult) => {
            const savedWords = storageResult.words || {};

            // Create a Set to store unique saved words
            const uniqueSavedWords = new Set();
            Object.values(savedWords).forEach(wordList => {
              wordList.forEach(wordObj => uniqueSavedWords.add(wordObj.word));
            });

            // Define the classic highlighter colors
            const classicColors = [
              '#FFFF77',
              '#7777FF',
              '#77FF92',
              '#C977FF',
              '#77FFE4',
              '#77C9FF',
              '#FF7792',
              '#FFAE77'
            ];

            let colorIndex = 0;

            // Send words to content script for highlighting, partial match
            const wordsToHighlight = allWords.map(word => {
              if (uniqueSavedWords.has(word)) {
                // If the word is saved, find its color from the saved words
                const savedWord = Object.values(savedWords).find(wordList =>
                  wordList.find(wordObj => wordObj.word === word)
                );
                const color = savedWord ? savedWord.find(wordObj => wordObj.word === word).color : getRandomColor();
                return { word, color };
              } else {
                // If the word is not saved, assign a color from the classic highlighter colors or a random color
                const color = colorIndex < classicColors.length ? classicColors[colorIndex] : getRandomColor();
                colorIndex++;
                return { word, color };
              }
            });

            chrome.tabs.sendMessage(tabs[0].id, { action: 'partialSearchAndHighlight', words: wordsToHighlight }, (response) => {
              if (response.result === 'success') {
                results = response.results;
                displayResults(results);
                saveState();
                
                // Save the current position for each word
                results.forEach(result => {
                  currentPosition[result.word] = 0;
                });
                
                chrome.storage.local.set({ currentPosition });
              }
            });

            // Update the custom scrollbar indicator
            chrome.tabs.sendMessage(tabs[0].id, { action: 'updateScrollbarIndicator' });
          });
        }
      });
    });
  });
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function handleSelectAllClick() {
  const wordsContainer = document.querySelector('#wordsContainer');
  const visibleWordItems = wordsContainer.querySelectorAll('.flex.items-center.justify-between:not([style*="display: none"])');
  const selectedWordsInput = document.querySelector('#selectedWords');
  const selectedWords = JSON.parse(selectedWordsInput.value);

  visibleWordItems.forEach(wordItem => {
    const checkbox = wordItem.querySelector('.checkbox-container input[type="checkbox"]');
    const word = checkbox.dataset.word;
    const color = checkbox.dataset.color;

    if (!checkbox.checked) {
      checkbox.checked = true;
      if (!selectedWords.some(selectedWord => selectedWord.word === word && selectedWord.color === color)) {
        selectedWords.push({ word, color });
      }
    }
  });

  selectedWordsInput.value = JSON.stringify(selectedWords);
  chrome.storage.local.set({ selectedWords });
}

function handleClearSelectedClick() {
  const selectedWordsInput = document.querySelector('#selectedWords');
  const selectedWords = [];
  selectedWordsInput.value = JSON.stringify(selectedWords);
  chrome.storage.local.set({ selectedWords });

  const wordsContainer = document.querySelector('#wordsContainer');
  const wordCheckboxes = wordsContainer.querySelectorAll('.checkbox-container input[type="checkbox"]');
  wordCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  // Update the "Select All" button state
  const selectAllButton = document.querySelector('#selectAllButton');
  selectAllButton.textContent = 'Select Visible';
}



function displayWords(words, selectedWords) {
  const wordsContainer = document.querySelector('#wordsContainer');
  wordsContainer.innerHTML = '';

  // Check if the "Quick save" folder exists
  if (words['Quick save']) {
    const quickSaveFolder = createFolderElement('Quick save', words['Quick save'], selectedWords);
    wordsContainer.appendChild(quickSaveFolder);
  }

  // Display the remaining folders
  for (const folder in words) {
    if (folder !== 'Quick save') {
      const folderDiv = createFolderElement(folder, words[folder], selectedWords);
      wordsContainer.appendChild(folderDiv);
    }
  }
}

function createFolderElement(folder, wordsArray, selectedWords) {
  const folderDiv = document.createElement('div');
  folderDiv.classList.add('folder', 'mb-4', 'rounded-lg');
  folderDiv.style.backgroundColor = '#282839';
  folderDiv.style.padding = '10px';

  const folderTitle = document.createElement('h4');
  folderTitle.classList.add('text-lg', 'font-bold', 'mb-2', 'flex', 'items-center');

  const folderCheckbox = document.createElement('input');
  folderCheckbox.type = 'checkbox';
  folderCheckbox.dataset.folder = folder;
  folderCheckbox.classList.add('mr-2');
  folderCheckbox.addEventListener('change', () => {
    const wordCheckboxes = folderDiv.querySelectorAll('.checkbox-container input[type="checkbox"]');
    wordCheckboxes.forEach(checkbox => {
      checkbox.checked = folderCheckbox.checked;
      const wordObj = wordsArray.find(word => word.word === checkbox.dataset.word);
      const index = selectedWords.findIndex(selectedWord =>
        selectedWord.word === wordObj.word && selectedWord.color === wordObj.color
      );
      if (folderCheckbox.checked && index === -1) {
        selectedWords.push({ word: wordObj.word, color: wordObj.color });
      } else if (!folderCheckbox.checked && index !== -1) {
        selectedWords.splice(index, 1);
      }
    });
    const selectedWordsInput = document.querySelector('#selectedWords');
    selectedWordsInput.value = JSON.stringify(selectedWords);
  });

  folderTitle.appendChild(folderCheckbox);

  const folderTitleText = document.createElement('span');
  folderTitleText.textContent = folder;
  folderTitle.appendChild(folderTitleText);

  folderDiv.appendChild(folderTitle);

  const wordList = document.createElement('ul');
  wordList.classList.add('space-y-2');

  // Add word items to the folder
  for (const wordObj of wordsArray) {
    const { wordListItem, noteContainer } = createWordListItem(wordObj, selectedWords, folder);
    wordList.appendChild(wordListItem);

    // Append the note container after the <li> element
    if (wordObj.note) {
      wordList.appendChild(noteContainer);
    }
  }

  folderDiv.appendChild(wordList);
  return folderDiv;
}

function createWordListItem(wordObj, selectedWords, folder) {
  const wordListItem = document.createElement('li');
  wordListItem.classList.add('flex', 'items-center', 'justify-between', 'p-2', 'rounded', 'shadow');
  wordListItem.style.backgroundColor = wordObj.color;

  const checkboxContainer = document.createElement('div');
  checkboxContainer.classList.add('checkbox-container', 'flex', 'items-center');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.dataset.word = wordObj.word;
  checkbox.dataset.color = wordObj.color;
  checkbox.classList.add('mr-2');

  const isSelected = selectedWords.some(selectedWord =>
    selectedWord.word === wordObj.word && selectedWord.color === wordObj.color
  );
  checkbox.checked = isSelected;

  checkbox.addEventListener('change', () => {
    const selectedWordsInput = document.querySelector('#selectedWords');
    const selectedWords = JSON.parse(selectedWordsInput.value);

    if (checkbox.checked) {
      selectedWords.push({ word: wordObj.word, color: wordObj.color });
    } else {
      const index = selectedWords.findIndex(selectedWord =>
        selectedWord.word === wordObj.word && selectedWord.color === wordObj.color
      );
      if (index !== -1) {
        selectedWords.splice(index, 1);
      }
    }

    selectedWordsInput.value = JSON.stringify(selectedWords);
    chrome.storage.local.set({ selectedWords });

    // Update the "Select All" button state
    const selectAllButton = document.querySelector('#selectAllButton');
    const visibleWordCheckboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]:not([style*="display: none"])');
    const allVisibleWordsSelected = Array.from(visibleWordCheckboxes).every(checkbox => checkbox.checked);
    selectAllButton.textContent = allVisibleWordsSelected ? 'Deselect All' : 'Select All Results';
  });

  checkboxContainer.appendChild(checkbox);

  const wordSpan = document.createElement('span');
  wordSpan.textContent = wordObj.word;
  wordSpan.style.color = 'white';
  wordSpan.style.fontSize = '13px';
  wordSpan.style.fontWeight = 'bold';
  wordSpan.style.textShadow = '#000 0px 0px 10px';
  checkboxContainer.appendChild(wordSpan);

  wordListItem.appendChild(checkboxContainer);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('flex', 'space-x-2');

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('bg-gray-800', 'hover:bg-gray-900', 'text-white', 'px-2', 'py-1', 'rounded');
  editButton.addEventListener('click', (event) => {
    event.stopPropagation();
    openEditWordPopup(folder, wordObj);
  });
  buttonContainer.appendChild(editButton);

  const removeButton = document.createElement('button');
  removeButton.textContent = 'x';
  removeButton.classList.add('text-red-400', 'hover:text-red-800', 'font-black', 'px-2', 'py-1', 'rounded');
  removeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    removeWord(folder, wordObj.word);
  });
  buttonContainer.appendChild(removeButton);

  wordListItem.appendChild(buttonContainer);

  // Add the tags input element with the tags-input class
  const editTagsInput = document.createElement('input');
  editTagsInput.type = 'text';
  editTagsInput.value = wordObj.tags ? wordObj.tags.join(', ') : '';
  editTagsInput.classList.add('tags-input', 'hidden');
  wordListItem.appendChild(editTagsInput);

  // Create the note container element
  const noteContainer = document.createElement('div');
  noteContainer.classList.add('note-container');
  noteContainer.style.backgroundColor = 'black';
  noteContainer.style.color = '#b4bfd1';
  noteContainer.style.fontSize = '12px';
  noteContainer.style.padding = '10px';
  noteContainer.style.marginTop = '0px';
  noteContainer.style.borderTopLeftRadius = '0px';
  noteContainer.style.borderTopRightRadius = '0px';
  noteContainer.style.borderBottomLeftRadius = '5px';
  noteContainer.style.borderBottomRightRadius = '5px';
  noteContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

  if (wordObj.note) {
    const noteSpan = document.createElement('span');
    noteSpan.textContent = wordObj.note;
    noteContainer.appendChild(noteSpan);
  }

  return { wordListItem, noteContainer };
}


function openEditWordPopup(folder, wordObj) {
  const editWordPopup = document.querySelector('#editWordPopup');
  const editWordInput = document.querySelector('#editWordInput');
  const editColorInput = document.querySelector('#editColorInput');
  const editFolderInput = document.querySelector('#editFolderInput');
  const editFolderDropdown = document.querySelector('#editFolderDropdown');
  const editTagsInput = document.querySelector('#editTagsInput');
  const editNoteInput = document.querySelector('#editNoteInput');
  const saveEditButton = document.querySelector('#saveEditButton');
  const cancelEditButton = document.querySelector('#cancelEditButton');

  editWordInput.value = wordObj.word;
  editColorInput.value = wordObj.color;
  editFolderInput.value = folder;
  editTagsInput.value = wordObj.tags || '';
  editNoteInput.value = wordObj.note || '';

  // Clear the folder dropdown
  editFolderDropdown.innerHTML = '';

  // Populate the folder dropdown
  populateEditFolderDropdown('');

  // Event listener for folder input
  editFolderInput.addEventListener('input', handleFolderInput);

  // Event listener for folder input click
  editFolderInput.addEventListener('click', handleFolderClick);

  // Event listener for document click
  document.addEventListener('click', handleDocumentClick);

  function handleFolderInput() {
    populateEditFolderDropdown(editFolderInput.value);
    editFolderDropdown.classList.remove('hidden');
  }

  function handleFolderClick() {
    if (editFolderInput.value === '') {
      populateEditFolderDropdown('');
      editFolderDropdown.classList.remove('hidden');
    }
  }

  function handleDocumentClick(e) {
    const isClickedOutside = !editFolderInput.contains(e.target) && !editFolderDropdown.contains(e.target);
    if (isClickedOutside) {
      editFolderDropdown.classList.add('hidden');
    }
  }

  saveEditButton.addEventListener('click', handleSaveEdit);

  function handleSaveEdit() {
    const newColor = editColorInput.value;
    const newFolder = editFolderInput.value;
    const newTags = editTagsInput.value.split(',').map(tag => tag.trim());
    const newNote = editNoteInput.value;

    chrome.storage.local.get(['words'], (result) => {
      const words = result.words || {};

      // Remove the word from the current folder
      words[folder] = words[folder].filter(word => word.word !== wordObj.word);

      // Check if the current folder is empty and delete it
      if (words[folder].length === 0) {
        delete words[folder];
      }

      // Add the updated word to the new folder
      if (!words[newFolder]) {
        words[newFolder] = [];
      }
      words[newFolder].push({
        word: wordObj.word,
        color: newColor,
        tags: newTags,
        note: newNote
      });

      // Update the selectedWords array
      const selectedWordsInput = document.querySelector('#selectedWords');
      const selectedWords = JSON.parse(selectedWordsInput.value);
      const index = selectedWords.findIndex(selectedWord =>
        selectedWord.word === wordObj.word && selectedWord.color === wordObj.color
      );
      if (index !== -1) {
        selectedWords.splice(index, 1);
        selectedWords.push({
          word: wordObj.word,
          color: newColor
        });
        selectedWordsInput.value = JSON.stringify(selectedWords);
      }

      chrome.storage.local.set({ words }, () => {
        loadWordsAndNotes();
        editWordPopup.classList.add('hidden');
        // Remove event listeners
        editFolderInput.removeEventListener('input', handleFolderInput);
        editFolderInput.removeEventListener('click', handleFolderClick);
        document.removeEventListener('click', handleDocumentClick);
        saveEditButton.removeEventListener('click', handleSaveEdit);
        cancelEditButton.removeEventListener('click', handleCancelEdit);
      });
    });
  }

  cancelEditButton.addEventListener('click', handleCancelEdit);

  function handleCancelEdit() {
    editWordPopup.classList.add('hidden');
    // Remove event listeners
    editFolderInput.removeEventListener('input', handleFolderInput);
    editFolderInput.removeEventListener('click', handleFolderClick);
    document.removeEventListener('click', handleDocumentClick);
    saveEditButton.removeEventListener('click', handleSaveEdit);
    cancelEditButton.removeEventListener('click', handleCancelEdit);
  }

  editWordPopup.classList.remove('hidden');
}

function populateEditFolderDropdown(filter) {
  const editFolderDropdown = document.querySelector('#editFolderDropdown');
  editFolderDropdown.innerHTML = ''; // Clear the dropdown before populating it

  chrome.storage.local.get(['words'], (result) => {
    const words = result.words || {};
    const folders = Object.keys(words);

    const filteredFolders = folders.filter(folderName => folderName.toLowerCase().includes(filter.toLowerCase()));

    filteredFolders.forEach(folderName => {
      const option = document.createElement('div');
      option.textContent = folderName;
      option.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-700');
      option.addEventListener('click', () => {
        const editFolderInput = document.querySelector('#editFolderInput');
        editFolderInput.value = folderName;
        editFolderDropdown.classList.add('hidden');
      });
      editFolderDropdown.appendChild(option);
    });

    if (filteredFolders.length === 0) {
      const noResultsOption = document.createElement('div');
      noResultsOption.textContent = 'No matching folders, new folder will be created.';
      noResultsOption.classList.add('px-4', 'py-2', 'text-gray-500');
      editFolderDropdown.appendChild(noResultsOption);
    }
  });
}


function displayResults(results) {
  const resultsContainer = document.querySelector('#resultsContainer');
  resultsContainer.innerHTML = '';

  for (const result of results) {
    // Check if a card for this word already exists
    const existingCard = resultsContainer.querySelector(`.card[data-word="${result.word}"]`);
    if (existingCard) {
      // If a card already exists, update the count
      const countElement = existingCard.querySelector('span:last-child');
      countElement.textContent = `${result.count || 0} counts `;
      
      // Update the position counter in the existing card
      const positionCounter = existingCard.querySelector('.position-counter');
      positionCounter.textContent = `${currentPosition[result.word] + 1}/${result.count}`;
    } else {
      // If a card doesn't exist, create a new one
      // Create the main card for each result
      const card = document.createElement('div');
      card.className = 'card mb-2 flex justify-between items-center rounded shadow p-1';
      card.style.backgroundColor = result.color;
      card.style.border = '1px solid #8492c3';
      card.dataset.word = result.word; // Store the word as a data attribute

      // Determine whether the background color is closer to white or black
      const isLightBackground = isColorCloserToWhite(result.color);
      const textColor = isLightBackground ? 'black' : 'white';

      // Wrap the word text and count in a div
      const textContainer = document.createElement('div');
      textContainer.className = 'flex-grow font-bold';
      textContainer.style.color = textColor;

      // Create a span to hold the word
      const wordText = document.createElement('span');
      wordText.textContent = `${result.word} `;
      textContainer.appendChild(wordText);
      card.appendChild(textContainer);

      // Create a span to hold the count
      const resultText = document.createElement('span');
      resultText.textContent = `${result.count || 0} counts `;
      resultText.style.textAlign = 'end';
      resultText.style.display = 'flex';
      textContainer.appendChild(resultText);
      card.appendChild(textContainer);

    // Create a span to hold the position counter
    const positionCounter = document.createElement('span');
    positionCounter.className = 'position-counter font-bold mr-2';
    positionCounter.style.color = textColor;
    positionCounter.textContent = currentPosition.hasOwnProperty(result.word) ? `${currentPosition[result.word] + 1}/${result.count}` : `0/${result.count}`;
    card.appendChild(positionCounter);

      // Create a container for the plus button and arrows
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container flex items-center rounded shadow';



      // Check if the word is already saved
      chrome.storage.local.get(['words'], (storageResult) => {
        const words = storageResult.words || {};
        const isWordSaved = Object.values(words).some(wordList =>
          wordList.some(wordObj => wordObj.word === result.word)
        );

        if (!isWordSaved) {
          // Create the plus button
          const plusButton = document.createElement('button');
          plusButton.innerHTML = '+';
          plusButton.className = 'plus-button font-fold bg-green-500 text-white p-2 hover:bg-green-600 rounded';
          plusButton.addEventListener('click', (e) => {
            e.stopPropagation();
            saveWordToQuickSave(result.word, result.color, plusButton);
          });
          buttonContainer.insertBefore(plusButton, buttonContainer.firstChild);
        }

        // Create the up arrow button
        const upArrow = document.createElement('button');
        upArrow.innerHTML = '&uarr;';
        upArrow.className = 'arrow font-bold p-2 bg-gray-100 hover:bg-gray-400 rounded';
        upArrow.style.color = '#121113';
        upArrow.addEventListener('click', (e) => {
          e.stopPropagation();
          navigateToWord(result.word, -1);
        });
        buttonContainer.appendChild(upArrow);

        // Create the down arrow button
        const downArrow = document.createElement('button');
        downArrow.innerHTML = '&darr;';
        downArrow.className = 'arrow font-bold bg-gray-300 p-2 hover:bg-gray-500 rounded';
        downArrow.style.color = '#121113';
        downArrow.addEventListener('click', (e) => {
          e.stopPropagation();
          navigateToWord(result.word, 1);
        });
        buttonContainer.appendChild(downArrow);
      });

      // Append the button container to the card
      card.appendChild(buttonContainer);

      // Add an event listener to the card that navigates to the first occurrence of the word and selects it
      card.addEventListener('click', () => {
        navigateToWord(result.word);
      });

      // Append the card to the results container
      resultsContainer.appendChild(card);
    }
  }
}

// Helper function to determine if a color is closer to white or black
function isColorCloserToWhite(color) {
  const rgb = parseInt(color.substring(1), 16); // Convert hexadecimal color to RGB integer
  const r = (rgb >> 16) & 0xff; // Extract red component
  const g = (rgb >> 8) & 0xff; // Extract green component
  const b = (rgb >> 0) & 0xff; // Extract blue component
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Calculate luminance
  return luminance > 128; // Return true if luminance is closer to white (255)
}

// Function to send a message to the content script to navigate and select the word
function navigateToWord(word, direction = 0) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'navigateToOccurrence',
      word: word,
      direction: direction,
      select: true
    }, (response) => {
      if (response && response.success) {
        currentPosition[word] = response.currentPosition;
        chrome.storage.local.set({ currentPosition });

        // Update the position counter in the popup when the user interacts with the word
        const card = document.querySelector(`.card[data-word="${word}"]`);
        const positionCounter = card.querySelector('.position-counter');
        positionCounter.textContent = `${currentPosition[word] + 1}/${response.totalCount}`;
      }
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCurrentPosition') {
    const { word, currentPosition, totalCount } = request;
    const card = document.querySelector(`.card[data-word="${word}"]`);
    const positionCounter = card.querySelector('.position-counter');
    positionCounter.textContent = `${currentPosition + 1}/${totalCount}`;
  }
});

//QOL save state so the extention does not refresh each time we open it.
function saveState() {
  const searchInput = document.querySelector('#mainSearch').value;
  const searchResults = document.querySelector('#resultsContainer').innerHTML;
  const folderList = document.querySelector('#folderList').classList.contains('hidden');
  const mainContent = document.querySelector('#mainContent').classList.contains('hidden');
  const importExportButtons = document.querySelector('#importExportButtons').classList.contains('hidden');
  const hamburgerMenuRotated = document.querySelector('#hamburgerMenu').classList.contains('rotate-90');

  chrome.storage.local.set({
    'searchInput': searchInput,
    'searchResults': searchResults,
    'folderList': folderList,
    'mainContent': mainContent,
    'importExportButtons': importExportButtons,
    'hamburgerMenuRotated': hamburgerMenuRotated,
    'currentPosition': currentPosition,
    'results': results,
    'currentPosition': currentPosition
  }, function() {
    console.log('State saved');
  });
}

function saveWordToQuickSave(word, color, plusButton) {
  chrome.storage.local.get(['words'], (result) => {
    const words = result.words || {};

    if (!words['Quick save']) {
      words['Quick save'] = [];
    }

    const existingWord = words['Quick save'].find(wordObj => wordObj.word === word);

    if (!existingWord) {
      const randomColor = getRandomColor(); // Generate a random color
      words['Quick save'].push({ word, color: randomColor });

      chrome.storage.local.set({ words }, () => {
        loadWordsAndNotes();
        showNotification(`"${word}" added to Quick save`);
        plusButton.remove();
      });
    }
  });
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification bg-green-500 text-white p-2 rounded shadow fixed bottom-4 right-4 z-50';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCurrentPosition') {
    currentPosition[request.word] = request.currentPosition;
    chrome.storage.local.set({ currentPosition });
  }
});


function populateFolderDropdown() {
  const folderInput = document.querySelector('#folderInput');
  const folderDropdown = document.querySelector('#folderDropdown');

  // Event listener for folder input click
  folderInput.addEventListener('click', handleFolderInputClick);

  // Event listener for folder input change
  folderInput.addEventListener('input', handleFolderInputChange);

  // Event listener for document click
  document.addEventListener('click', handleDocumentClick);

  function handleFolderInputClick() {
    if (folderInput.value === '') {
      if (!folderDropdownPopulated) {
        populateDropdownOptions('');
        folderDropdownPopulated = true;
      }
      folderDropdown.classList.remove('hidden');
    }
  }

  function handleFolderInputChange() {
    populateDropdownOptions(folderInput.value);
    folderDropdown.classList.remove('hidden');
  }

  function handleDocumentClick(event) {
    if (!folderInput.contains(event.target) && !folderDropdown.contains(event.target)) {
      folderDropdown.classList.add('hidden');
    }
  }
}

function populateDropdownOptions(filter) {
  const folderDropdown = document.querySelector('#folderDropdown');
  folderDropdown.innerHTML = ''; // Clear the dropdown before populating it

  chrome.storage.local.get(['words'], (result) => {
    const words = result.words || {};
    const folders = Object.keys(words);

    const filteredFolders = folders.filter(folder => folder.toLowerCase().includes(filter.toLowerCase()));

    const uniqueFolders = [...new Set(filteredFolders)]; // Create an array of unique folder names

    uniqueFolders.forEach(folder => {
      const option = document.createElement('div');
      option.textContent = folder;
      option.classList.add('folder-option', 'px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-700');
      option.addEventListener('click', () => {
        folderInput.value = folder;
        folderDropdown.classList.add('hidden');
      });
      folderDropdown.appendChild(option);
    });

    if (uniqueFolders.length === 0) {
      const noResultsOption = document.createElement('div');
      noResultsOption.textContent = 'No matching folders, new folder will be created.';
      noResultsOption.classList.add('px-4', 'py-2', 'text-gray-500');
      folderDropdown.appendChild(noResultsOption);
    }
  });
}

function searchWords(searchTerm) {
  const wordsContainer = document.querySelector('#wordsContainer');
  const folderDivs = wordsContainer.querySelectorAll('.folder');

  const foldersWithMatches = new Set();

  folderDivs.forEach(folderDiv => {
    const wordItems = folderDiv.querySelectorAll('.flex.items-center.justify-between');
    let folderHasMatch = false;

    wordItems.forEach(wordItem => {
      const wordSpan = wordItem.querySelector('span');
      const word = wordSpan.textContent.toLowerCase();

      const tagsInput = wordItem.querySelector('.tags-input');
      const tags = tagsInput ? tagsInput.value.toLowerCase() : '';

      const searchTermLower = searchTerm.toLowerCase();
      const wordMatch = word.startsWith(searchTermLower);
      const tagMatch = tags.split(',').some(tag => tag.trim().startsWith(searchTermLower));

      if (wordMatch || tagMatch || searchTerm === '') {
        wordItem.style.display = 'flex';
        folderHasMatch = true;
        // Show the note container if the word matches the search term or if the search term is empty
        const noteContainer = wordItem.nextElementSibling;
        if (noteContainer && noteContainer.classList.contains('note-container')) {
          noteContainer.style.display = 'block';
        }
      } else {
        wordItem.style.display = 'none';
        // Hide the note container if the word doesn't match the search term
        const noteContainer = wordItem.nextElementSibling;
        if (noteContainer && noteContainer.classList.contains('note-container')) {
          noteContainer.style.display = 'none';
        }
      }
    });

    if (folderHasMatch || searchTerm === '') {
      foldersWithMatches.add(folderDiv);
    }
  });

  folderDivs.forEach(folderDiv => {
    if (foldersWithMatches.has(folderDiv) || searchTerm === '') {
      folderDiv.style.display = 'block';
    } else {
      folderDiv.style.display = 'none';
    }
  });
}

function importSettings() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const importedData = JSON.parse(event.target.result);

      // Create a modal to display import options and contents
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-95';
      modal.innerHTML = `
        <div class="p-4 rounded shadow-lg" style="background-color: #19181b;">
          <h2 class="text-lg font-bold mb-4">Import Settings</h2>
          <p class="mb-4">Select an import option:</p>
          <div class="mb-4">
            <label>
              <input type="radio" name="importOption" value="replace" checked> Replace everything
            </label>
            <br>
            <label>
              <input type="radio" name="importOption" value="add"> Add to current settings
            </label>
          </div>
          <div class="mb-4">
            <p class="mb-2">Select the folder to import:</p>
            <ul id="importList" class="p-4"></ul>
          </div>
          <div class="flex justify-end">
            <button id="confirmImportBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2">Import</button>
            <button id="cancelImportBtn" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Populate the import list with the folders inside the "words" object
      const importList = modal.querySelector('#importList');
      if (importedData.words) {
        for (const folder in importedData.words) {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <label>
              <input type="checkbox" name="importFolder" value="${folder}" checked> ${folder}
            </label>
          `;
          importList.appendChild(listItem);
        }
      }

      // Handle import confirmation
      const confirmImportBtn = modal.querySelector('#confirmImportBtn');
      confirmImportBtn.addEventListener('click', () => {
        const importOption = modal.querySelector('input[name="importOption"]:checked').value;
        const selectedFolders = Array.from(modal.querySelectorAll('input[name="importFolder"]:checked'))
          .map(checkbox => checkbox.value);

        if (importOption === 'replace') {
          // Replace everything with the selected imported folders
          const importSettings = {
            words: {},
            notes: importedData.notes || ''
          };
          selectedFolders.forEach(folder => {
            importSettings.words[folder] = importedData.words[folder];
          });
          chrome.storage.local.set(importSettings, () => {
            alert('Settings imported successfully.');
            loadWordsAndNotes();
            modal.remove();
          });
        } else if (importOption === 'add') {
        // Add the selected imported folders to the current settings
        chrome.storage.local.get(['words', 'notes'], (currentSettings) => {
          const updatedSettings = {
            words: { ...currentSettings.words },
            notes: currentSettings.notes || ''
          };
          selectedFolders.forEach(folder => {
            if (!updatedSettings.words[folder]) {
              updatedSettings.words[folder] = [];
            }
            importedData.words[folder].forEach(importedWord => {
              const existingWord = updatedSettings.words[folder].find(word => word.word === importedWord.word);
              if (!existingWord) {
                updatedSettings.words[folder].push(importedWord);
              }
            });
          });
          chrome.storage.local.set(updatedSettings, () => {
            alert('Settings imported successfully.');
            loadWordsAndNotes();
            modal.remove();
          });
        });
        }
      });

      // Handle import cancellation
      const cancelImportBtn = modal.querySelector('#cancelImportBtn');
      cancelImportBtn.addEventListener('click', () => {
        modal.remove();
      });
    };

    reader.readAsText(file);
    document.body.removeChild(fileInput);
  });

  fileInput.click();
}

function exportSettings() {
  chrome.storage.local.get(['words', 'notes'], (result) => {
    const exportedData = JSON.stringify(result, null, 2);
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'Multi-Finder-Pro-settings.json';
    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}