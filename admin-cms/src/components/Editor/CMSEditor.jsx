import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import NestedList from '@editorjs/nested-list';
import Table from '@editorjs/table';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import EquationTool from './EquationTool';

const CMSEditor = ({ initialData, onChange, readOnly = false, placeholder = 'Start writing your content...' }) => {
  const editorRef = useRef(null);
  const holderRef = useRef(null);
  const isReady = useRef(false);

  const getTools = useCallback(() => ({
    header: {
      class: Header,
      config: {
        placeholder: 'Enter heading text',
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 2,
      },
      inlineToolbar: ['bold', 'italic'],
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
      config: { placeholder },
    },
    list: {
      class: List,
      inlineToolbar: true,
      config: { defaultStyle: 'unordered' },
    },
    nestedList: {
      class: NestedList,
      inlineToolbar: true,
      config: { defaultStyle: 'unordered' },
    },
    table: {
      class: Table,
      inlineToolbar: true,
      config: { rows: 2, cols: 3, withHeadings: true },
    },
    image: {
      class: ImageTool,
      config: {
        uploader: {
          uploadByFile: async (file) => {
            // Convert to base64 for storage (production would use S3/CDN)
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  success: 1,
                  file: { url: reader.result, name: file.name, size: file.size },
                });
              };
              reader.readAsDataURL(file);
            });
          },
          uploadByUrl: async (url) => {
            return { success: 1, file: { url } };
          },
        },
      },
    },
    embed: { class: Embed, config: { services: { youtube: true, vimeo: true, codepen: true } } },
    quote: { class: Quote, inlineToolbar: true },
    delimiter: Delimiter,
    equation: {
      class: EquationTool,
    },
  }), [placeholder]);

  useEffect(() => {
    if (!holderRef.current || isReady.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      tools: getTools(),
      data: initialData || { blocks: [], version: '2.28.2' },
      readOnly,
      autofocus: !readOnly,
      placeholder: readOnly ? '' : placeholder,
      onChange: async () => {
        if (onChange && !readOnly) {
          try {
            const data = await editor.save();
            onChange(data);
          } catch (err) {
            console.error('EditorJS save error:', err);
          }
        }
      },
      onReady: () => {
        isReady.current = true;
      },
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
        editorRef.current = null;
        isReady.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div
        ref={holderRef}
        className="min-h-[450px] px-4 py-4"
        id="editorjs-holder"
      />
    </div>
  );
};

export default CMSEditor;
