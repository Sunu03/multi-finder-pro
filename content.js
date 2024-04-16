// Global variable to keep track of current position for each search term
const currentPosition = {};


function highlightWord(word, color) {
  const wordRegex = new RegExp('\\b(' + word + ')\\b', 'gi');

  let totalCount = 0;

  // Reset the current position for this word
  currentPosition[word] = 0;

  function highlightTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const matches = node.textContent.match(wordRegex);
      if (matches) {
        totalCount += matches.length;
      }

      const replacementNode = document.createElement('multiwordfinder-highlight');
      replacementNode.innerHTML = node.textContent.replace(
        wordRegex,
        `<multiwordfinder-highlight class="multiwordfinder-highlight" style="background-color: ${color}; color: ${getContrastColor(color)};" data-word="${word}">$1</multiwordfinder-highlight>`
      );

      let index = 0; // Initialize index for each highlighted word
      replacementNode.querySelectorAll('multiwordfinder-highlight').forEach(highlight => {
        highlight.dataset.index = index; // Set a data attribute to keep track of the index
        highlight.dataset.wordId = `word-${word}-${index}`; // Unique identifier for each word instance
        index++;
      });

      if (replacementNode.childElementCount > 0) {
        node.parentNode.replaceChild(replacementNode, node);
      }
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.nodeName !== 'SCRIPT' &&
      node.nodeName !== 'STYLE'
    ) {
      Array.from(node.childNodes).forEach(highlightTextNode);
    }
  }

  highlightTextNode(document.body);

  // After highlighting, update positions for scrollbar indicator
  document.querySelectorAll('multiwordfinder-highlight').forEach(highlight => {
    // Calculate the vertical position of each highlight as a percentage of the total document height
    const positionPercentage = (highlight.getBoundingClientRect().top + window.scrollY) / document.body.scrollHeight * 100;
    highlight.dataset.position = positionPercentage; // Store this position in a data attribute
  });

  // Update the custom scrollbar indicator after highlighting and calculating positions
  updateCustomScrollbarIndicator();

  return totalCount;
}

function highlightWordPartial(word, color) {
  const wordRegex = new RegExp(word, 'gi');

  let totalCount = 0;

  // Reset the current position for this word
  currentPosition[word] = 0;

  function highlightTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const matches = node.textContent.match(wordRegex);
      if (matches) {
        totalCount += matches.length;
      }

      const replacementNode = document.createElement('multiwordfinder-highlight');
      replacementNode.innerHTML = node.textContent.replace(
        wordRegex,
        `<multiwordfinder-highlight class="multiwordfinder-highlight" style="background-color: ${color}; color: ${getContrastColor(color)};" data-word="${word}">$&</multiwordfinder-highlight>`
      );

      let index = 0; // Initialize index for each highlighted word
      replacementNode.querySelectorAll('multiwordfinder-highlight').forEach(highlight => {
        highlight.dataset.index = index; // Set a data attribute to keep track of the index
        highlight.dataset.wordId = `word-${word}-${index}`; // Unique identifier for each word instance
        index++;
      });

      if (replacementNode.childElementCount > 0) {
        node.parentNode.replaceChild(replacementNode, node);
      }
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.nodeName !== 'SCRIPT' &&
      node.nodeName !== 'STYLE'
    ) {
      Array.from(node.childNodes).forEach(highlightTextNode);
    }
  }

  highlightTextNode(document.body);

  // After highlighting, update positions for scrollbar indicator
  document.querySelectorAll('multiwordfinder-highlight').forEach(highlight => {
    // Calculate the vertical position of each highlight as a percentage of the total document height
    const positionPercentage = (highlight.getBoundingClientRect().top + window.scrollY) / document.body.scrollHeight * 100;
    highlight.dataset.position = positionPercentage; // Store this position in a data attribute
  });

  // Update the custom scrollbar indicator after highlighting and calculating positions
  updateCustomScrollbarIndicator();

  return totalCount;
}

function clearHighlights() {
  const highlightedElements = document.querySelectorAll('multiwordfinder-highlight');
  highlightedElements.forEach(element => {
    const parent = element.parentNode;
    if (parent) {
      const textNode = document.createTextNode(element.textContent);
      parent.replaceChild(textNode, element);
      parent.normalize(); // Merge adjacent text nodes
    }
  });
  console.log(`Cleared ${highlightedElements.length} highlights.`);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "clearHighlights") {
    clearHighlights();
    sendResponse({status: "Highlights cleared"});
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchAndHighlight') {
    const words = request.words;

    // Remove existing highlights
    clearHighlights();

    // Sort the words array by length in descending order
    words.sort((a, b) => b.word.length - a.word.length);

    // Highlight the words
    const results = [];
    for (const wordObj of words) {
      if (wordObj.word) {
        const count = highlightWord(wordObj.word, wordObj.color);
        results.push({
          word: wordObj.word,
          color: wordObj.color,
          count: count
        });
      }
    }

    sendResponse({ result: 'success', results: results });
  } else if (request.action === 'navigateToOccurrence') {
    navigateToOccurrence(request.word, request.direction);

    if (request.select) {
      // Get the current element and select its text
      const currentElement = document.querySelector(`multiwordfinder-highlight[data-word="${request.word}"][data-index="${currentPosition[request.word]}"]`);
      if (currentElement) {
        selectText(currentElement);
      }
    }
  } else if (request.action === 'updateScrollbarIndicator') {
    updateCustomScrollbarIndicator();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'partialSearchAndHighlight') {
    const words = request.words;

    // Remove existing highlights
    clearHighlights();

    // Highlight the words (partial match)
    const results = [];
    for (const wordObj of words) {
      if (wordObj.word) {
        const count = highlightWordPartial(wordObj.word, wordObj.color);
        results.push({
          word: wordObj.word,
          color: wordObj.color,
          count: count
        });
      }
    }

    sendResponse({ result: 'success', results: results });
  }
});

function navigateToOccurrence(word, direction = 0) {
  const highlights = document.querySelectorAll(`multiwordfinder-highlight[data-word="${word}"]`);
  if (highlights.length === 0) return;

  // Remove the selected-word class from all highlights
  highlights.forEach(highlight => {
    highlight.classList.remove('selected-word');
  });

  currentPosition[word] = (currentPosition[word] + highlights.length + direction) % highlights.length;

  const targetElement = highlights[currentPosition[word]];
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Add the selected-word class to the target element
  targetElement.classList.add('selected-word');

  // Remove the current-word class from all highlights
  highlights.forEach(highlight => {
    highlight.classList.remove('current-word');
  });

  // Add the current-word class to the target element
  targetElement.classList.add('current-word');

  // Send a message to the popup script to update the position counter
  chrome.runtime.sendMessage({
    action: 'updateCurrentPosition',
    word: word,
    currentPosition: currentPosition[word],
    totalCount: highlights.length
  });
}

function selectText(element) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}

function updateCustomScrollbarIndicator() {
  let scrollbarIndicator = document.getElementById('custom-scrollbar-indicator');
  if (!scrollbarIndicator) {
    scrollbarIndicator = document.createElement('div');
    scrollbarIndicator.id = 'custom-scrollbar-indicator';
    document.body.appendChild(scrollbarIndicator);
  }

  // Basic styling for the scrollbar indicator (this should ideally be moved to content.css)
  scrollbarIndicator.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 20px;
      height: 100%;
      z-index: 9999;
  `;

  // Clear existing markers
  scrollbarIndicator.innerHTML = '';

  document.querySelectorAll('multiwordfinder-highlight').forEach(highlight => {
    const marker = document.createElement('div');
    const position = highlight.dataset.position; // Retrieve the stored position
    const color = highlight.style.backgroundColor; // Use the highlight's background color for the marker

    marker.style.cssText = `
      position: absolute;
      width: 100%;
      height: 2px;
      left: 0;
      top: ${position}%;
      background-color: ${color};
    `;

    scrollbarIndicator.appendChild(marker);
  });
}

function getContrastColor(color) {
  const rgb = parseInt(color.substring(1), 16); // Convert hexadecimal color to RGB integer
  const r = (rgb >> 16) & 0xff; // Extract red component
  const g = (rgb >> 8) & 0xff; // Extract green component
  const b = (rgb >> 0) & 0xff; // Extract blue component
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Calculate luminance
  return luminance > 128 ? '#000000' : '#ffffff'; // Return black or white based on luminance
}

// Add a message listener for updating the scrollbar indicator
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateScrollbarIndicator') {
    updateCustomScrollbarIndicator();
  }
});

