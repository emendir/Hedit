import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const App = () => {
    const [editorData, setEditorData] = useState('');

    return (
        <div style={{ padding: '20px' }}>
            <h2>CKEditor 5 in Electron with React</h2>
            <CKEditor
                editor={ClassicEditor}
                data={editorData}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                }}
            />
            <div style={{ marginTop: '20px' }}>
                <h3>Editor Data:</h3>
                <div dangerouslySetInnerHTML={{ __html: editorData }} />
            </div>
        </div>
    );
};

export default App;
