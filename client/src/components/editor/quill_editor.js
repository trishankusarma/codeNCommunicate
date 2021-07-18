import React from 'react'
import ReactQuill, { Quill } from 'react-quill'
import quillEmoji from 'quill-emoji'
import 'react-quill/dist/quill.snow.css'
import './editor.css'

const Editor = ({editorHtml,setEditorHtml})=> {

    const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji

    Quill.register({
    'formats/emoji': EmojiBlot,
    'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    'modules/emoji-textarea': TextAreaEmoji
    }, true)


    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike','blockquote',
        'list', 'bullet', 'indent','emoji'
    ]
    
    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            ['emoji'], 
            [{'list': 'ordered'}, {'list': 'bullet'}, 
            {'indent': '-1'}, {'indent': '+1'}],
            ['clean'],
        ],
        'emoji-toolbar': true,
        "emoji-textarea": true,
        "emoji-shortname": true,
        clipboard: {
            matchVisual: false,
            toolbar_emoji: true,
        }
    }
    
    const handleChange = (html) => {
  	    setEditorHtml(html)
    }
 
    return (
      <div className="editor">
        <ReactQuill 
          theme='snow'
          onChange={handleChange}
          value={editorHtml}
          formats={formats}
          modules = {modules}
          placeholder="Start writing here...."
         />
       </div>
    )
}

export default Editor