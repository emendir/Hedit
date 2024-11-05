import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {
	ClassicEditor,
	AccessibilityHelp,
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	CloudServices,
	Code,
	Essentials,
	FindAndReplace,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	Highlight,
	HorizontalLine,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	Mention,
	PageBreak,
	Paragraph,
	RemoveFormat,
	SelectAll,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Style,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	TodoList,
	Underline,
	Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import './App.css';

export default function App() {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [autosavedData, setAutosavedData] = useState(''); // State to hold autosaved data
	const editorInstanceRef = useRef(null); // Ref to hold the CKEditor instance
  const selectedFileRef = useRef(null);  // Ref to hold the latest selected file
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  // const { ipcRenderer } = window.require('electron');  // Use Electron's ipcRenderer
  const selectedFilePathRef = useRef(null); // Create a ref for selectedFilePath

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	// Update selectedFileRef whenever selectedFile changes
	useEffect(() => {
	    selectedFileRef.current = selectedFile;
	    if (selectedFile) {
        console.log("Selected file state updated:", selectedFile);
	    }
	}, [selectedFile]);
  useEffect(() => {
    selectedFilePathRef.current = selectedFilePath;
    console.log("Selected file state updated:", selectedFilePathRef);
}, [selectedFilePath]);

	const editorConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'findAndReplace',
				'|',
				'heading',
				'style',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'subscript',
				'superscript',
				'code',
				'removeFormat',
				'|',
				'specialCharacters',
				'horizontalLine',
				'pageBreak',
				'link',
				'insertImageViaUrl',
				'insertTable',
				'highlight',
				'blockQuote',
				'|',
				'alignment',
				'|',
				'bulletedList',
				'numberedList',
				'todoList',
				'outdent',
				'indent'
			],
			shouldNotGroupWhenFull: false
		},
		plugins: [
			AccessibilityHelp,
			Alignment,
			Autoformat,
			AutoImage,
			AutoLink,
			Autosave,
			BlockQuote,
			Bold,
			CloudServices,
			Code,
			Essentials,
			FindAndReplace,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			GeneralHtmlSupport,
			Heading,
			Highlight,
			HorizontalLine,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			ImageUpload,
			Indent,
			IndentBlock,
			Italic,
			Link,
			LinkImage,
			List,
			ListProperties,
			Mention,
			PageBreak,
			Paragraph,
			RemoveFormat,
			SelectAll,
			SpecialCharacters,
			SpecialCharactersArrows,
			SpecialCharactersCurrency,
			SpecialCharactersEssentials,
			SpecialCharactersLatin,
			SpecialCharactersMathematical,
			SpecialCharactersText,
			Strikethrough,
			Style,
			Subscript,
			Superscript,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			TextTransformation,
			TodoList,
			Underline,
			Undo
		],
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		htmlSupport: {
			allow: [
				{
					name: /^.*$/,
					styles: true,
					attributes: true,
					classes: true
				}
			]
		},
		image: {
			toolbar: [
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'resizeImage'
			]
		},
		initialData:
			'<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n',
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		},
		mention: {
			feeds: [
				{
					marker: '@',
					feed: [
						/* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
					]
				}
			]
		},
		menuBar: {
			isVisible: true
		},
		placeholder: 'Type or paste your content here!',
		style: {
			definitions: [
				{
					name: 'Article category',
					element: 'h3',
					classes: ['category']
				},
				{
					name: 'Title',
					element: 'h2',
					classes: ['document-title']
				},
				{
					name: 'Subtitle',
					element: 'h3',
					classes: ['document-subtitle']
				},
				{
					name: 'Info box',
					element: 'p',
					classes: ['info-box']
				},
				{
					name: 'Side quote',
					element: 'blockquote',
					classes: ['side-quote']
				},
				{
					name: 'Marker',
					element: 'span',
					classes: ['marker']
				},
				{
					name: 'Spoiler',
					element: 'span',
					classes: ['spoiler']
				},
				{
					name: 'Code (dark)',
					element: 'pre',
					classes: ['fancy-code', 'fancy-code-dark']
				},
				{
					name: 'Code (bright)',
					element: 'pre',
					classes: ['fancy-code', 'fancy-code-bright']
				}
			]
		},
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    },
    autosave: {
    save( editor ) {
        return saveData( editor.getData() );
    }
},
	};
  // Function to open file dialog and set the selected file path
  // Function to open file dialog, get path, and load file content into CKEditor
  const selectFile = async () => {
      const filePath = await window.electron.openFileDialog();

      console.log("File path selected:", filePath); // Log selected file path
      if (filePath) {
          setSelectedFilePath(filePath); // Update selectedFilePath state
          const fileContent = await window.electron.readFile(filePath);
          console.log("Set selected filePath:", selectedFilePath);  // Check if selectedFileRef is up-to-date

          // Log file content for debugging
          console.log("File content read:", fileContent);

          if (editorRef.current) {
              editorRef.current.setData(fileContent); // Set CKEditor content to file data
          }
      } else {
          console.warn("No file was selected.");
      }
  };
	    function saveData(data) {
        //console.log("Autosaving data:", data); // Log the editor content
        console.log("Saving data to:", selectedFilePathRef.current);  // Check if selectedFileRef is up-to-date
        const file = selectedFilePathRef.current;
        console.log("Current selectedFile in saveData:", file);  // Check if selectedFileRef is up-to-date

	        setAutosavedData(data); // Update autosaved data state

	        if (file) {
            console.log("Writing to file:", file); // Log the file path
            if (!window.electron){
              console.log("Electron not available!");
              return Promise.resolve(); // Return a resolved promise
            }
              // Use the saveFile method from the preload script
              window.electron.saveFile(file, data);
              window.electron.onSaveResponse((event, response) => {
                  if (response.success) console.log("File saved successfully.");
                  else console.error("Failed to save file:", response.error);
              });
	            console.log("Autosave completed, data written to file.");
	        } else {
	            console.warn("No file selected for saving.");
	        }

	        return Promise.resolve(); // Return a resolved promise
	    }

	    const handleFileChange = (event) => {
	        const file = event.target.files[0];
	        if (file) {
	            console.log("File selected:", file);
              setSelectedFile(file.path); // Update selected file state

	            // Read the file content
	            const reader = new FileReader();
	            reader.onload = (e) => {
	                const content = e.target.result; // Get file content
	                console.log("File content read:", content); // Log the content

	                // Use the editor instance ref to set the editor's content
	                if (editorInstanceRef.current) {
	                    editorInstanceRef.current.setData(content)
	                }
	            };
	            reader.readAsText(file); // Read file as text
	        } else {
	            console.warn("No file selected.");
	        }
	    };

	    return (
	        <div>
	            <div className="main-container">
	                <button onClick={selectFile}>Choose File</button>

	                <div className="editor-container editor-container_classic-editor editor-container_include-style" ref={editorContainerRef}>
	                    <div className="editor-container__editor">
	                        <CKEditor
	                            editor={ClassicEditor}
	                            config={editorConfig}
	                            onReady={editor => {
	                                // Store the editor instance in the ref
	                                editorInstanceRef.current = editor;
	                                editorRef.current = editor; // Also store it for any other use
	                            }}
	                        />
	                    </div>
	                </div>
	            </div>
	        </div>
	    );
	}
