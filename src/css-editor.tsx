import React from 'react'
import { SettingsSection } from 'spicetify-creator-settings-plugin'
import styles from './css-editor.module.scss'
import AceEditor from "react-ace";
import { Rnd } from 'react-rnd';
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";
import 'ace-builds/src-noconflict/snippets/css';
import 'ace-builds/src-noconflict/ext-language_tools.js';

interface ICSSEditorProps { }

interface ICSSEditorStates {
  code: string,
  fontSize: string,
  x: number,
  y: number,
  width: number,
  height: number,
  visible: boolean,
  mouseOverEditor: boolean,
}

class CSSEditor extends React.Component<ICSSEditorProps, ICSSEditorStates> {
  settings = new SettingsSection('CSS Editor', 'css-editor');
  dragging = false;

  constructor(props: ICSSEditorProps) {
    super(props);
    this.settings.addHidden('editor-x', 200);
    this.settings.addHidden('editor-y', 200);
    this.settings.addHidden('editor-width', 400);
    this.settings.addHidden('editor-height', 400);
    this.settings.addHidden('css', '/* Write your css here :D */');

    this.settings.addButton("button-1", "Open CSS Editor to see your current CSS", "Open CSS Editor", () => {
      this.setState(state => {
        return {
          visible: !state.visible,
          x: this.settings.getFieldValue<number>("editor-x"),
          y: this.settings.getFieldValue<number>("editor-y"),
          width: this.settings.getFieldValue<number>("editor-width"),
          height: this.settings.getFieldValue<number>("editor-height"),
        }
      });
    });
    this.settings.addInput("font-size", "Font size for the CSS Editor (in pixels)", "12px", () => {
      this.setState({
        fontSize: this.settings.getFieldValue<string>("font-size"),
      })
    });

    this.settings.pushSettings();

    this.state = {
      code: this.settings.getFieldValue<string>("css"),
      fontSize: this.settings.getFieldValue<string>("font-size"),
      x: 0, y: 0, width: 0, height: 0,
      visible: false,
      mouseOverEditor: false,
    };
  }

  setPosition(pos?: { x: number, y: number }) {
    this.setState(state => {
      if (!pos)
        pos = { x: state.x, y: state.y };

      const newPos = {
        x: Math.min(Math.max(pos.x, 0), window.innerWidth - state.width),
        y: Math.min(Math.max(pos.y, 0), window.innerHeight - state.height),
      }

      return {
        x: newPos.x,
        y: newPos.y,
      }
    });
  }

  setSize(size?: {width: number, height: number}) {
    this.setState(state => {
      if (!size)
        size = { width: state.width, height: state.height };

      return {
        width: size.width,
        height: size.height,
      }
    });
    this.setPosition();
  }

  componentDidUpdate() {
    this.settings.setFieldValue('editor-x', this.state.x);
    this.settings.setFieldValue('editor-y', this.state.y);
    this.settings.setFieldValue('editor-width', this.state.width);
    this.settings.setFieldValue('editor-height', this.state.height);
    this.settings.setFieldValue('css', this.state.code);
  }
  
  componentDidMount() {
    window.addEventListener('resize', () => this.setPosition());
  }

  render() {
    return <>
      <style type={"text/css"}>{this.state.code}</style>
      <div className={styles.screen} style={{ display: (this.state.visible ? undefined : 'none') }}>
        <Rnd
          style={{ pointerEvents: 'all' }}
          minWidth={100}
          minHeight={100}
          size={{ width: this.state.width, height: this.state.height }}
          position={{
            x: this.state.x,
            y: this.state.y,
          }}
          onDragStart={() => {
            if (!this.state.mouseOverEditor) {
              this.dragging = true;
            } else {
              return false;
            }
          }}
          onDrag={() => {
            if (!this.dragging) {
              return false;
            }
          }}
          onDragStop={(e, d) => {
            if (this.dragging) {
              this.setPosition({ x: d.x, y: d.y });
              this.dragging = false;
            }
          }}
          onResize={(e, direction, ref, delta, position) => {
            this.setPosition(position)
            this.setSize({width: ref.offsetWidth, height: ref.offsetHeight});
          }}
        >
          <div style={{ width: this.state.width, height: this.state.height }} className={styles.draggableChild}>
            <div className="main-playlistEditDetailsModal-header" style={{ padding: '14px' }}>
              <h1 className="main-type-canon">CSS</h1>
              <button className="main-playlistEditDetailsModal-closeBtn" onClick={() => {
                this.setState({
                  visible: false,
                })
              }}>
                <svg role="img" height="16" width="16" aria-label="Close" viewBox="0 0 16 16" className="Svg-sc-1bi12j5-0 hDgDGI">
                  <path d="M14.354 2.353l-.708-.707L8 7.293 2.353 1.646l-.707.707L7.293 8l-5.647 5.646.707.708L8 8.707l5.646 5.647.708-.708L8.707 8z">
                  </path>
                </svg>
              </button>
            </div>
            <div style={{ display: 'contents' }} onMouseOver={() => { this.setState({ mouseOverEditor: true }) }}
              onMouseLeave={() => { this.setState({ mouseOverEditor: false }) }}
            >
              <AceEditor
                mode="css"
                fontSize={this.state.fontSize}
                width={`${this.state.width - 16}px`}
                height={`${this.state.height - 16 - 56}px`}
                theme="monokai"
                value={this.state.code}
                onChange={(css) => {
                  this.setState({
                    code: css,
                  })
                }}
                name="css-editor-editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2
                }}
              />
            </div>
          </div>

        </Rnd>
      </div>
    </>
  }
}

export default CSSEditor;
