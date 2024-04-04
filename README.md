# Multi-Finder Pro

Multi-Finder Pro is a powerful Chrome extension that allows you to find and highlight multiple words on a webpage. With its advanced features and customizable options, Multi-Finder Pro enhances your productivity and streamlines your workflow.

## Features

- **Multi-keyword search**: Enter multiple keywords separated by commas, and the extension will highlight all occurrences of these keywords on the page simultaneously.
- **Customizable highlight colors**: Assign a unique color to each keyword for easy distinction.
- **Keyword navigation**: Quickly jump between occurrences of each keyword using intuitive navigation buttons.
- **Partial matching**: Find occurrences of substrings within words using the partial matching feature.
- **Saved keyword lists**: Save frequently used keyword combinations into named lists for quick access and reuse.
- **Folder organization**: Organize saved keyword lists into folders for better management and categorization.
- **Quick Save folder**: Access your most frequently used words easily with the dedicated "Quick save" folder.
- **Persistent storage**: User preferences, saved keyword lists, and folder structures are stored locally using Chrome's Storage API.
- **Customizable appearance**: Enjoy a sleek and intuitive user interface with a responsive design.

## Installation

1. Clone this repository or download the source code as a ZIP file.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" using the toggle switch in the top right corner.
4. Click on "Load unpacked" and select the directory containing the extension's source code.
5. Multi-Finder Pro should now be installed and visible in your Chrome extensions list.

## Usage

1. Open the web page you wish to analyze.
2. Press Ctrl+Shift+F on Windows, Command+Shift+F on Mac or Click on the Multi-Finder Pro icon in the Chrome toolbar to open the extension popup.
3. Enter the keywords you want to search for, separated by commas, in the "Main Search" input field. Alternatively, select a saved keyword/s from the Saved Words list.
4. Click the "Search" button to highlight the exact keywords on the page. The extension will display the number of occurrences for each keyword.
- Use the ‘Partial Match’ to search for a partial match for a word. 
- - Example: Searching ‘ACK’ to highlight the ‘ACK’ on DHCPACK.
5. Use the navigation buttons next to each keyword to jump between occurrences. The current position and total count will be displayed for each keyword.
6. To customize the highlight color for a keyword: 
- If the keyword is already saved: Click on Edit for that keyword in the saved word list, then click on the color to change it.
- If the keyword is not saved: Quick save it by hitting the green ‘+’ icon and follow the same steps as above or use the ‘Add Custom Word’ to save the keyword with the desired color.
7. To save a keyword for future use, enter the keyword in the ‘Add Custom Word’ section, select a folder (or create a new one), and click the "Save" button. You can also use the green ‘+’ next to the result to quickly save it.
8. Press the hamburger menu and under the ‘Saved Words’ section you can view and manage your saved keyword lists.
- You can use the search bar to search for keywords or its tags. Since you can apply multiple tags to each keyword, you can easily have favorites and such.
- Select Visible can be used to tick the check box of all the keywords that are visible, when you search a keyword or tag you can use this button to quickly select all the results.
9. Press the ‘Clear All’ button to clear all highlights and selected keywords, this is accessible from both sides of the extension. 
10. Click the "Export" button to download your saved keyword lists and settings as a JSON file for backup or sharing purposes. To import previously exported settings, click the "Import" button and select the JSON file.


## Configuration

- Customize the highlight colors and assign them to specific keywords.
- Organize your saved keywords into folders for better management.
- Import and export your settings and saved data using the provided import/export functionality.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/Sunu03/multi-finder-pro). Feel free to submit pull requests with bug fixes or new features.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- This extension was inspired by the need for a powerful and user-friendly keyword search tool.
- Thanks to the open-source community for their valuable contributions and inspiration.
- I have less than a month of HTML and CSS knowledge, this was made with assitance from GPT4 and Claude.

---

Thank you for using Multi-Finder Pro! We hope this extension enhances your productivity and makes your keyword searching experience more efficient and enjoyable.
