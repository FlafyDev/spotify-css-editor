import ReactDOM from 'react-dom'
import React from 'react'
import CSSEditor from './css-editor';

async function main() {
  let mainViewContainer: HTMLElement | null = null;
  while (true) {
    mainViewContainer = document?.getElementById('main');

    if (Spicetify?.Platform?.History?.listen && mainViewContainer) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const cssEditorContainer = document.createElement('div');
  mainViewContainer.appendChild(cssEditorContainer);
  ReactDOM.render(<CSSEditor />, cssEditorContainer)
}

export default main;
