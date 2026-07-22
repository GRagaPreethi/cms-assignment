/**
 * Custom EditorJS Equation Block Tool
 * Supports LaTeX math equations with live preview via KaTeX
 */
import katex from 'katex';

export default class EquationTool {
  static get toolbox() {
    return {
      title: 'Equation',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h7"/><path d="M15 14l4 4-4 4"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return {
      equation: false,
      displayMode: false,
      description: {},
    };
  }

  constructor({ data, readOnly }) {
    this.data = {
      equation: data.equation || '',
      displayMode: data.displayMode !== undefined ? data.displayMode : true,
      description: data.description || '',
    };
    this.readOnly = readOnly;
    this._wrapper = null;
    this._input = null;
    this._preview = null;
    this._descInput = null;
  }

  render() {
    this._wrapper = document.createElement('div');
    this._wrapper.classList.add('equation-tool');
    this._wrapper.style.cssText = 'border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; background: #f9fafb; margin: 8px 0;';

    if (!this.readOnly) {
      // Mode toggle
      const toggleRow = document.createElement('div');
      toggleRow.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 12px;';

      const label = document.createElement('label');
      label.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; cursor: pointer;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = this.data.displayMode;
      checkbox.addEventListener('change', () => {
        this.data.displayMode = checkbox.checked;
        this._renderPreview();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode('Display mode (block equation)'));
      toggleRow.appendChild(label);
      this._wrapper.appendChild(toggleRow);

      // LaTeX input
      const inputLabel = document.createElement('p');
      inputLabel.textContent = 'LaTeX Expression';
      inputLabel.style.cssText = 'font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 4px;';
      this._wrapper.appendChild(inputLabel);

      this._input = document.createElement('textarea');
      this._input.value = this.data.equation;
      this._input.placeholder = 'Enter LaTeX, e.g. x^2 + y^2 = z^2';
      this._input.rows = 3;
      this._input.style.cssText = 'width: 100%; font-family: monospace; font-size: 13px; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; outline: none; resize: vertical; background: #fff;';
      this._input.addEventListener('input', () => {
        this.data.equation = this._input.value;
        this._renderPreview();
      });
      this._wrapper.appendChild(this._input);

      // Description input
      const descLabel = document.createElement('p');
      descLabel.textContent = 'Description (optional)';
      descLabel.style.cssText = 'font-size: 12px; font-weight: 500; color: #374151; margin-top: 10px; margin-bottom: 4px;';
      this._wrapper.appendChild(descLabel);

      this._descInput = document.createElement('input');
      this._descInput.type = 'text';
      this._descInput.value = this.data.description;
      this._descInput.placeholder = 'Brief description of this equation';
      this._descInput.style.cssText = 'width: 100%; font-size: 13px; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; outline: none; background: #fff;';
      this._descInput.addEventListener('input', () => {
        this.data.description = this._descInput.value;
      });
      this._wrapper.appendChild(this._descInput);
    }

    // Preview area
    const previewLabel = document.createElement('p');
    previewLabel.textContent = 'Preview';
    previewLabel.style.cssText = 'font-size: 12px; font-weight: 500; color: #374151; margin-top: 12px; margin-bottom: 4px;';
    if (!this.readOnly) this._wrapper.appendChild(previewLabel);

    this._preview = document.createElement('div');
    this._preview.style.cssText = 'padding: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; text-align: center; overflow-x: auto; min-height: 48px; display: flex; align-items: center; justify-content: center;';
    this._wrapper.appendChild(this._preview);

    if (this.data.description && this.readOnly) {
      const desc = document.createElement('p');
      desc.textContent = this.data.description;
      desc.style.cssText = 'font-size: 12px; color: #9ca3af; margin-top: 6px; text-align: center; font-style: italic;';
      this._wrapper.appendChild(desc);
    }

    this._renderPreview();
    return this._wrapper;
  }

  _renderPreview() {
    if (!this._preview) return;
    const eq = this.data.equation.trim();
    if (!eq) {
      this._preview.innerHTML = '<span style="color:#9ca3af;font-size:13px;">Enter a LaTeX expression above</span>';
      return;
    }
    try {
      katex.render(eq, this._preview, {
        displayMode: this.data.displayMode,
        throwOnError: false,
        output: 'html',
      });
    } catch (err) {
      this._preview.innerHTML = `<span style="color:#ef4444;font-size:13px;">Invalid LaTeX: ${err.message}</span>`;
    }
  }

  save() {
    return {
      equation: this.data.equation,
      displayMode: this.data.displayMode,
      description: this.data.description,
    };
  }

  validate(data) {
    return data.equation && data.equation.trim().length > 0;
  }
}
