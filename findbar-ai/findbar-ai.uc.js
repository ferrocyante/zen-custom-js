// ==UserScript==
// @name            BrowseBot
// @description     Transforms the standard Zen Browser findbar into a modern, floating, AI-powered chat interface.
// @author          BibekBhusal
// ==/UserScript==


(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BrowseBot = {}));
})(this, (function (exports) { 'use strict';

  const PREFS = {
    ENABLED: "extension.browse-bot.enabled",
    MINIMAL: "extension.browse-bot.minimal",
    PERSIST: "extension.browse-bot.persist-chat",
    DND_ENABLED: "extension.browse-bot.dnd-enabled",
    POSITION: "extension.browse-bot.position",
    DEBUG_MODE: "extension.browse-bot.debug-mode",
    STREAM_ENABLED: "extension.browse-bot.stream-enabled",

    GOD_MODE: "extension.browse-bot.god-mode",
    CITATIONS_ENABLED: "extension.browse-bot.citations-enabled",
    MAX_TOOL_CALLS: "extension.browse-bot.max-tool-calls",
    CONFORMATION: "extension.browse-bot.conform-before-tool-call",

    CONTEXT_MENU_ENABLED: "extension.browse-bot.context-menu-enabled",
    CONTEXT_MENU_AUTOSEND: "extension.browse-bot.context-menu-autosend",

    LLM_PROVIDER: "extension.browse-bot.llm-provider",
    MISTRAL_API_KEY: "extension.browse-bot.mistral-api-key",
    MISTRAL_MODEL: "extension.browse-bot.mistral-model",
    GEMINI_API_KEY: "extension.browse-bot.gemini-api-key",
    GEMINI_MODEL: "extension.browse-bot.gemini-model",
    OPENAI_API_KEY: "extension.browse-bot.openai-api-key",
    OPENAI_MODEL: "extension.browse-bot.openai-model",
    CLAUDE_API_KEY: "extension.browse-bot.claude-api-key",
    CLAUDE_MODEL: "extension.browse-bot.claude-model",
    GROK_API_KEY: "extension.browse-bot.grok-api-key",
    GROK_MODEL: "extension.browse-bot.grok-model",
    PERPLEXITY_API_KEY: "extension.browse-bot.perplexity-api-key",
    PERPLEXITY_MODEL: "extension.browse-bot.perplexity-model",
    OLLAMA_MODEL: "extension.browse-bot.ollama-model",
    OLLAMA_API_KEY: "extension.browse-bot.ollama-api-key",

    //TODO: Not yet implimented
    COPY_BTN_ENABLED: "extension.browse-bot.copy-btn-enabled",
    MARKDOWN_ENABLED: "extension.browse-bot.markdown-enabled",
    SHOW_TOOL_CALL: "extension.browse-bot.show-tool-call",

    defaultValues: {},

    getPref(key) {
      try {
        const pref = UC_API.Prefs.get(key);
        if (!pref) return PREFS.defaultValues[key];
        if (!pref.exists()) return PREFS.defaultValues[key];
        return pref.value;
      } catch {
        return PREFS.defaultValues[key];
      }
    },

    setPref(prefKey, value) {
      UC_API.Prefs.set(prefKey, value);
    },

    setInitialPrefs() {
      for (const [key, value] of Object.entries(PREFS.defaultValues)) {
        UC_API.Prefs.setIfUnset(key, value);
      }
    },

    get enabled() {
      return this.getPref(this.ENABLED);
    },
    set enabled(value) {
      this.setPref(this.ENABLED, value);
    },

    get minimal() {
      return this.getPref(this.MINIMAL);
    },
    set minimal(value) {
      this.setPref(this.MINIMAL, value);
    },

    get streamEnabled() {
      return this.getPref(this.STREAM_ENABLED);
    },
    set streamEnabled(value) {
      this.setPref(this.STREAM_ENABLED, value);
    },

    set godMode(value) {
      this.setPref(this.GOD_MODE, value);
    },
    get godMode() {
      return this.getPref(this.GOD_MODE);
    },

    get citationsEnabled() {
      return this.getPref(this.CITATIONS_ENABLED);
    },
    set citationsEnabled(value) {
      this.setPref(this.CITATIONS_ENABLED, value);
    },

    get contextMenuEnabled() {
      return this.getPref(this.CONTEXT_MENU_ENABLED);
    },
    set contextMenuEnabled(value) {
      this.setPref(this.CONTEXT_MENU_ENABLED, value);
    },

    get contextMenuAutoSend() {
      return this.getPref(this.CONTEXT_MENU_AUTOSEND);
    },
    set contextMenuAutoSend(value) {
      this.setPref(this.CONTEXT_MENU_AUTOSEND, value);
    },

    get llmProvider() {
      return this.getPref(this.LLM_PROVIDER);
    },
    set llmProvider(value) {
      this.setPref(this.LLM_PROVIDER, value);
    },

    get persistChat() {
      return this.getPref(this.PERSIST);
    },
    set persistChat(value) {
      this.setPref(this.PERSIST, value);
    },

    get maxToolCalls() {
      return this.getPref(this.MAX_TOOL_CALLS);
    },
    set maxToolCalls(value) {
      this.setPref(this.MAX_TOOL_CALLS, value);
    },

    get copyBtnEnabled() {
      return this.getPref(this.COPY_BTN_ENABLED);
    },
    set copyBtnEnabled(value) {
      this.setPref(this.COPY_BTN_ENABLED, value);
    },

    get markdownEnabled() {
      return this.getPref(this.MARKDOWN_ENABLED);
    },
    set markdownEnabled(value) {
      this.setPref(this.MARKDOWN_ENABLED, value);
    },

    get conformation() {
      return this.getPref(this.CONFORMATION);
    },
    set conformation(value) {
      this.setPref(this.CONFORMATION, value);
    },

    get showToolCall() {
      return this.getPref(this.SHOW_TOOL_CALL);
    },
    set showToolCall(value) {
      this.setPref(this.SHOW_TOOL_CALL, value);
    },

    get dndEnabled() {
      return this.getPref(this.DND_ENABLED);
    },
    set dndEnabled(value) {
      this.setPref(this.DND_ENABLED, value);
    },

    get position() {
      return this.getPref(this.POSITION);
    },
    set position(value) {
      this.setPref(this.POSITION, value);
    },
  };

  const debugLog = (...args) => {
    if (PREFS.getPref(PREFS.DEBUG_MODE, false)) {
      console.log("BrowseBot :", ...args);
    }
  };

  const debugError$1 = (...args) => {
    if (PREFS.getPref(PREFS.DEBUG_MODE, false)) {
      console.error("BrowseBot :", ...args);
    }
  };

  PREFS.defaultValues = {
    [PREFS.ENABLED]: true,
    [PREFS.MINIMAL]: true,
    [PREFS.GOD_MODE]: false,
    [PREFS.DEBUG_MODE]: false,
    [PREFS.PERSIST]: false,
    [PREFS.STREAM_ENABLED]: true,
    [PREFS.CITATIONS_ENABLED]: false,
    [PREFS.CONTEXT_MENU_ENABLED]: true,
    [PREFS.CONTEXT_MENU_AUTOSEND]: true,
    [PREFS.LLM_PROVIDER]: "gemini",
    [PREFS.MISTRAL_API_KEY]: "",
    [PREFS.MISTRAL_MODEL]: "mistral-medium-latest",
    [PREFS.GEMINI_API_KEY]: "",
    [PREFS.GEMINI_MODEL]: "gemini-2.0-flash",
    [PREFS.OPENAI_API_KEY]: "",
    [PREFS.OPENAI_MODEL]: "gpt-4o",
    [PREFS.CLAUDE_API_KEY]: "",
    [PREFS.CLAUDE_MODEL]: "claude-4-opus",
    [PREFS.GROK_API_KEY]: "",
    [PREFS.GROK_MODEL]: "grok-4",
    [PREFS.PERPLEXITY_API_KEY]: "",
    [PREFS.PERPLEXITY_MODEL]: "sonar",
    [PREFS.OLLAMA_MODEL]: "llama2",
    [PREFS.OLLAMA_API_KEY]: "",
    [PREFS.DND_ENABLED]: true,
    [PREFS.POSITION]: "top-right",
    [PREFS.MAX_TOOL_CALLS]: 5,
    [PREFS.CONFORMATION]: true,
    // [PREFS.COPY_BTN_ENABLED]: true,
    // [PREFS.MARKDOWN_ENABLED]: true,
    // [PREFS.SHOW_TOOL_CALL]: false,
  };

  function frameScript() {
    const getUrlAndTitle = () => {
      return {
        url: content.location.href,
        title: content.document.title,
      };
    };

    const extractRelevantContent = () => {
      const clonedBody = content.document.body.cloneNode(true);
      const elementsToRemove = clonedBody.querySelectorAll(
        "script, style, meta, noscript, iframe, svg, canvas, img, video, audio, object, embed, applet, link, head"
      );
      elementsToRemove.forEach((el) => el.remove());
      return clonedBody.innerHTML;
    };

    const extractTextContent = (trimWhiteSpace = true) => {
      const clonedBody = content.document.body.cloneNode(true);
      const elementsToRemove = clonedBody.querySelectorAll(
        "script, style, meta, noscript, iframe, svg, canvas, input, textarea, select, img, video, audio, object, embed, applet, form, button, link, head"
      );
      elementsToRemove.forEach((el) => el.remove());

      clonedBody.querySelectorAll("br").forEach((br) => {
        br.replaceWith("\n");
      });

      const blockSelector =
        "p, div, li, h1, h2, h3, h4, h5, h6, tr, article, section, header, footer, aside, main, blockquote, pre";
      clonedBody.querySelectorAll(blockSelector).forEach((el) => {
        el.append("\n");
      });

      const textContent = clonedBody.textContent;

      if (trimWhiteSpace) {
        return textContent.replace(/\s+/g, " ").trim();
      }

      return textContent
        .replace(/[ \t\r\f\v]+/g, " ")
        .replace(/ ?\n ?/g, "\n")
        .replace(/\n+/g, "\n")
        .trim();
    };

    async function getYouTubeTranscript() {
      const win = content;
      const doc = content.document;

      async function ensureBodyAvailable() {
        if (doc.body) return;
        await new Promise((resolve) => {
          const check = () => {
            if (doc.body) resolve();
            else win.setTimeout(check, 50);
          };
          check();
        });
      }

      function waitForSelectorWithObserver(selector, timeout = 5000) {
        return new Promise(async (resolve, reject) => {
          try {
            await ensureBodyAvailable();
            const el = doc.querySelector(selector);
            if (el) return resolve(el);

            const observer = new win.MutationObserver(() => {
              const el = doc.querySelector(selector);
              if (el) {
                observer.disconnect();
                resolve(el);
              }
            });

            observer.observe(doc.body, {
              childList: true,
              subtree: true,
            });

            win.setTimeout(() => {
              observer.disconnect();
              reject(new Error(`Timeout waiting for ${selector}`));
            }, timeout);
          } catch (e) {
            reject(new Error(`waitForSelectorWithObserver failed: ${e.message}`));
          }
        });
      }

      try {
        if (!doc.querySelector("ytd-transcript-renderer")) {
          const button = doc.querySelector('button[aria-label="Show transcript"]');
          if (!button)
            throw new Error('"Show transcript" button not found — transcript may not be available.');
          button.click();
          await waitForSelectorWithObserver("ytd-transcript-renderer", 5000);
        }

        await waitForSelectorWithObserver("ytd-transcript-segment-renderer .segment-text", 5000);

        const segments = Array.from(
          doc.querySelectorAll("ytd-transcript-segment-renderer .segment-text")
        );
        if (!segments.length) throw new Error("Transcript segments found, but all are empty.");

        const transcript = segments
          .map((el) => el.textContent.trim())
          .filter(Boolean)
          .join("\n");
        return transcript;
      } catch (err) {
        throw err;
      }
    }

    const handlers = {
      GetPageHTMLContent: () => {
        return {
          content: extractRelevantContent(),
          url: getUrlAndTitle().url,
          title: getUrlAndTitle().title,
        };
      },

      GetSelectedText: () => {
        const selection = content.getSelection();
        return {
          selectedText: selection.toString(),
          hasSelection: !selection.isCollapsed,
          ...getUrlAndTitle(),
        };
      },

      GetPageTextContent: ({ trimWhiteSpace }) => {
        return {
          textContent: extractTextContent(trimWhiteSpace),
          ...getUrlAndTitle(),
        };
      },

      ClickElement: ({ selector }) => {
        const element = content.document.querySelector(selector);
        if (!element) {
          throw new Error(`Element with selector "${selector}" not found.`);
        }
        element.click();
        return { result: `Clicked element with selector "${selector}".` };
      },

      FillForm: ({ selector, value }) => {
        const element = content.document.querySelector(selector);
        if (!element) {
          throw new Error(`Element with selector "${selector}" not found.`);
        }
        element.value = value;
        element.dispatchEvent(new Event("input", { bubbles: true }));
        return {
          result: `Filled element with selector "${selector}" with value "${value}".`,
        };
      },

      GetYoutubeTranscript: async () => {
        const transcript = await getYouTubeTranscript();
        return { transcript };
      },
    };

    addMessageListener("FindbarAI:Command", async function (msg) {
      const cmd = msg.data.command;
      const data = msg.data.data || {};
      try {
        const result = await handlers[cmd](data);
        sendAsyncMessage("FindbarAI:Result", { command: cmd, result });
      } catch (e) {
        sendAsyncMessage("FindbarAI:Result", { command: cmd, result: { error: e.message } });
      }
    });
  }

  let currentMessageManager = null;

  const updateMessageManager = () => {
    if (gBrowser && gBrowser.selectedBrowser) {
      const mm = gBrowser.selectedBrowser.messageManager;
      if (mm !== currentMessageManager) {
        currentMessageManager = mm;
        if (!gBrowser.selectedBrowser._findbarAIInjected) {
          const scriptText = `(${frameScript})();`;
          mm.loadFrameScript(
            "data:application/javascript;charset=utf-8," + encodeURIComponent(scriptText),
            false
          );
          gBrowser.selectedBrowser._findbarAIInjected = true;
        }
      }
    }
  };

  const messageManagerAPI = {
    send(cmd, data = {}) {
      updateMessageManager();
      if (!currentMessageManager) {
        debugError$1("No message manager available.");
        return Promise.reject(new Error("No message manager available."));
      }

      return new Promise((resolve, reject) => {
        const listener = (msg) => {
          if (msg.data.command === cmd) {
            currentMessageManager.removeMessageListener("FindbarAI:Result", listener);
            if (msg.data.result && msg.data.result.error) {
              reject(new Error(msg.data.result.error));
            } else {
              resolve(msg.data.result);
            }
          }
        };
        currentMessageManager.addMessageListener("FindbarAI:Result", listener);
        currentMessageManager.sendAsyncMessage("FindbarAI:Command", { command: cmd, data });
      });
    },

    getUrlAndTitle() {
      return {
        url: gBrowser.currentURI.spec,
        title: gBrowser.selectedBrowser.contentTitle,
      };
    },

    async getHTMLContent() {
      try {
        return await this.send("GetPageHTMLContent");
      } catch (error) {
        debugError$1("Failed to get page HTML content:", error);
        return {};
      }
    },

    async getSelectedText() {
      try {
        const result = await this.send("GetSelectedText");
        if (!result || !result.hasSelection) {
          return this.getUrlAndTitle();
        }
        return result;
      } catch (error) {
        debugError$1("Failed to get selected text:", error);
        return this.getUrlAndTitle();
      }
    },

    async getPageTextContent(trimWhiteSpace = true) {
      try {
        return await this.send("GetPageTextContent", { trimWhiteSpace });
      } catch (error) {
        debugError$1("Failed to get page text content:", error);
        return this.getUrlAndTitle();
      }
    },

    async clickElement(selector) {
      try {
        return await this.send("ClickElement", { selector });
      } catch (error) {
        debugError$1(`Failed to click element with selector "${selector}":`, error);
        return { error: `Failed to click element with selector "${selector}".` };
      }
    },

    async fillForm(selector, value) {
      try {
        return await this.send("FillForm", { selector, value });
      } catch (error) {
        debugError$1(`Failed to fill form with selector "${selector}":`, error);
        return { error: `Failed to fill form with selector "${selector}".` };
      }
    },

    async getYoutubeTranscript() {
      try {
        return await this.send("GetYoutubeTranscript");
      } catch (error) {
        debugError$1("Failed to get youtube transcript:", error);
        return { error: `Failed to get youtube transcript: ${error.message}` };
      }
    },
  };

  // src/errors/ai-sdk-error.ts
  var marker$1 = "vercel.ai.error";
  var symbol$1 = Symbol.for(marker$1);
  var _a$1;
  var _AISDKError = class _AISDKError extends Error {
    /**
     * Creates an AI SDK Error.
     *
     * @param {Object} params - The parameters for creating the error.
     * @param {string} params.name - The name of the error.
     * @param {string} params.message - The error message.
     * @param {unknown} [params.cause] - The underlying cause of the error.
     */
    constructor({
      name: name14,
      message,
      cause
    }) {
      super(message);
      this[_a$1] = true;
      this.name = name14;
      this.cause = cause;
    }
    /**
     * Checks if the given error is an AI SDK Error.
     * @param {unknown} error - The error to check.
     * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
     */
    static isInstance(error) {
      return _AISDKError.hasMarker(error, marker$1);
    }
    static hasMarker(error, marker15) {
      const markerSymbol = Symbol.for(marker15);
      return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
    }
  };
  _a$1 = symbol$1;
  var AISDKError = _AISDKError;

  // src/errors/api-call-error.ts
  var name$1 = "AI_APICallError";
  var marker2$1 = `vercel.ai.error.${name$1}`;
  var symbol2$1 = Symbol.for(marker2$1);
  var _a2$1;
  var APICallError = class extends AISDKError {
    constructor({
      message,
      url,
      requestBodyValues,
      statusCode,
      responseHeaders,
      responseBody,
      cause,
      isRetryable = statusCode != null && (statusCode === 408 || // request timeout
      statusCode === 409 || // conflict
      statusCode === 429 || // too many requests
      statusCode >= 500),
      // server error
      data
    }) {
      super({ name: name$1, message, cause });
      this[_a2$1] = true;
      this.url = url;
      this.requestBodyValues = requestBodyValues;
      this.statusCode = statusCode;
      this.responseHeaders = responseHeaders;
      this.responseBody = responseBody;
      this.isRetryable = isRetryable;
      this.data = data;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker2$1);
    }
  };
  _a2$1 = symbol2$1;

  // src/errors/empty-response-body-error.ts
  var name2$1 = "AI_EmptyResponseBodyError";
  var marker3 = `vercel.ai.error.${name2$1}`;
  var symbol3 = Symbol.for(marker3);
  var _a3;
  var EmptyResponseBodyError = class extends AISDKError {
    // used in isInstance
    constructor({ message = "Empty response body" } = {}) {
      super({ name: name2$1, message });
      this[_a3] = true;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker3);
    }
  };
  _a3 = symbol3;

  // src/errors/get-error-message.ts
  function getErrorMessage$1(error) {
    if (error == null) {
      return "unknown error";
    }
    if (typeof error === "string") {
      return error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return JSON.stringify(error);
  }

  // src/errors/invalid-argument-error.ts
  var name3 = "AI_InvalidArgumentError";
  var marker4$1 = `vercel.ai.error.${name3}`;
  var symbol4$1 = Symbol.for(marker4$1);
  var _a4$1;
  var InvalidArgumentError$1 = class InvalidArgumentError extends AISDKError {
    constructor({
      message,
      cause,
      argument
    }) {
      super({ name: name3, message, cause });
      this[_a4$1] = true;
      this.argument = argument;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker4$1);
    }
  };
  _a4$1 = symbol4$1;

  // src/errors/invalid-prompt-error.ts
  var name4$1 = "AI_InvalidPromptError";
  var marker5$1 = `vercel.ai.error.${name4$1}`;
  var symbol5$1 = Symbol.for(marker5$1);
  var _a5$1;
  var InvalidPromptError = class extends AISDKError {
    constructor({
      prompt,
      message,
      cause
    }) {
      super({ name: name4$1, message: `Invalid prompt: ${message}`, cause });
      this[_a5$1] = true;
      this.prompt = prompt;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker5$1);
    }
  };
  _a5$1 = symbol5$1;

  // src/errors/invalid-response-data-error.ts
  var name5$1 = "AI_InvalidResponseDataError";
  var marker6$1 = `vercel.ai.error.${name5$1}`;
  var symbol6$1 = Symbol.for(marker6$1);
  var _a6$1;
  var InvalidResponseDataError = class extends AISDKError {
    constructor({
      data,
      message = `Invalid response data: ${JSON.stringify(data)}.`
    }) {
      super({ name: name5$1, message });
      this[_a6$1] = true;
      this.data = data;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker6$1);
    }
  };
  _a6$1 = symbol6$1;

  // src/errors/json-parse-error.ts
  var name6$1 = "AI_JSONParseError";
  var marker7$1 = `vercel.ai.error.${name6$1}`;
  var symbol7$1 = Symbol.for(marker7$1);
  var _a7$1;
  var JSONParseError = class extends AISDKError {
    constructor({ text, cause }) {
      super({
        name: name6$1,
        message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage$1(cause)}`,
        cause
      });
      this[_a7$1] = true;
      this.text = text;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker7$1);
    }
  };
  _a7$1 = symbol7$1;

  // src/errors/load-api-key-error.ts
  var name7$1 = "AI_LoadAPIKeyError";
  var marker8$1 = `vercel.ai.error.${name7$1}`;
  var symbol8$1 = Symbol.for(marker8$1);
  var _a8$1;
  var LoadAPIKeyError = class extends AISDKError {
    // used in isInstance
    constructor({ message }) {
      super({ name: name7$1, message });
      this[_a8$1] = true;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker8$1);
    }
  };
  _a8$1 = symbol8$1;

  // src/errors/no-such-model-error.ts
  var name10$1 = "AI_NoSuchModelError";
  var marker11$1 = `vercel.ai.error.${name10$1}`;
  var symbol11$1 = Symbol.for(marker11$1);
  var _a11$1;
  var NoSuchModelError = class extends AISDKError {
    constructor({
      errorName = name10$1,
      modelId,
      modelType,
      message = `No such ${modelType}: ${modelId}`
    }) {
      super({ name: errorName, message });
      this[_a11$1] = true;
      this.modelId = modelId;
      this.modelType = modelType;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker11$1);
    }
  };
  _a11$1 = symbol11$1;

  // src/errors/too-many-embedding-values-for-call-error.ts
  var name11$1 = "AI_TooManyEmbeddingValuesForCallError";
  var marker12$1 = `vercel.ai.error.${name11$1}`;
  var symbol12$1 = Symbol.for(marker12$1);
  var _a12$1;
  var TooManyEmbeddingValuesForCallError = class extends AISDKError {
    constructor(options) {
      super({
        name: name11$1,
        message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
      });
      this[_a12$1] = true;
      this.provider = options.provider;
      this.modelId = options.modelId;
      this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
      this.values = options.values;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker12$1);
    }
  };
  _a12$1 = symbol12$1;

  // src/errors/type-validation-error.ts
  var name12$1 = "AI_TypeValidationError";
  var marker13$1 = `vercel.ai.error.${name12$1}`;
  var symbol13$1 = Symbol.for(marker13$1);
  var _a13$1;
  var _TypeValidationError = class _TypeValidationError extends AISDKError {
    constructor({ value, cause }) {
      super({
        name: name12$1,
        message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$1(cause)}`,
        cause
      });
      this[_a13$1] = true;
      this.value = value;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker13$1);
    }
    /**
     * Wraps an error into a TypeValidationError.
     * If the cause is already a TypeValidationError with the same value, it returns the cause.
     * Otherwise, it creates a new TypeValidationError.
     *
     * @param {Object} params - The parameters for wrapping the error.
     * @param {unknown} params.value - The value that failed validation.
     * @param {unknown} params.cause - The original error or cause of the validation failure.
     * @returns {TypeValidationError} A TypeValidationError instance.
     */
    static wrap({
      value,
      cause
    }) {
      return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
    }
  };
  _a13$1 = symbol13$1;
  var TypeValidationError = _TypeValidationError;

  // src/errors/unsupported-functionality-error.ts
  var name13$1 = "AI_UnsupportedFunctionalityError";
  var marker14$1 = `vercel.ai.error.${name13$1}`;
  var symbol14$1 = Symbol.for(marker14$1);
  var _a14$1;
  var UnsupportedFunctionalityError = class extends AISDKError {
    constructor({
      functionality,
      message = `'${functionality}' functionality not supported.`
    }) {
      super({ name: name13$1, message });
      this[_a14$1] = true;
      this.functionality = functionality;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker14$1);
    }
  };
  _a14$1 = symbol14$1;

  // src/json-value/is-json.ts
  function isJSONValue(value) {
    if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return true;
    }
    if (Array.isArray(value)) {
      return value.every(isJSONValue);
    }
    if (typeof value === "object") {
      return Object.entries(value).every(
        ([key, val]) => typeof key === "string" && isJSONValue(val)
      );
    }
    return false;
  }
  function isJSONArray(value) {
    return Array.isArray(value) && value.every(isJSONValue);
  }
  function isJSONObject(value) {
    return value != null && typeof value === "object" && Object.entries(value).every(
      ([key, val]) => typeof key === "string" && isJSONValue(val)
    );
  }

  let customAlphabet = (alphabet, defaultSize = 21) => {
    return (size = defaultSize) => {
      let id = '';
      let i = size | 0;
      while (i--) {
        id += alphabet[(Math.random() * alphabet.length) | 0];
      }
      return id
    }
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var secureJsonParse = {exports: {}};

  const hasBuffer = typeof Buffer !== 'undefined';
  const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
  const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;

  function _parse (text, reviver, options) {
    // Normalize arguments
    if (options == null) {
      if (reviver !== null && typeof reviver === 'object') {
        options = reviver;
        reviver = undefined;
      }
    }

    if (hasBuffer && Buffer.isBuffer(text)) {
      text = text.toString();
    }

    // BOM checker
    if (text && text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }

    // Parse normally, allowing exceptions
    const obj = JSON.parse(text, reviver);

    // Ignore null and non-objects
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    const protoAction = (options && options.protoAction) || 'error';
    const constructorAction = (options && options.constructorAction) || 'error';

    // options: 'error' (default) / 'remove' / 'ignore'
    if (protoAction === 'ignore' && constructorAction === 'ignore') {
      return obj
    }

    if (protoAction !== 'ignore' && constructorAction !== 'ignore') {
      if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
        return obj
      }
    } else if (protoAction !== 'ignore' && constructorAction === 'ignore') {
      if (suspectProtoRx.test(text) === false) {
        return obj
      }
    } else {
      if (suspectConstructorRx.test(text) === false) {
        return obj
      }
    }

    // Scan result for proto keys
    return filter(obj, { protoAction, constructorAction, safe: options && options.safe })
  }

  function filter (obj, { protoAction = 'error', constructorAction = 'error', safe } = {}) {
    let next = [obj];

    while (next.length) {
      const nodes = next;
      next = [];

      for (const node of nodes) {
        if (protoAction !== 'ignore' && Object.prototype.hasOwnProperty.call(node, '__proto__')) { // Avoid calling node.hasOwnProperty directly
          if (safe === true) {
            return null
          } else if (protoAction === 'error') {
            throw new SyntaxError('Object contains forbidden prototype property')
          }

          delete node.__proto__; // eslint-disable-line no-proto
        }

        if (constructorAction !== 'ignore' &&
            Object.prototype.hasOwnProperty.call(node, 'constructor') &&
            Object.prototype.hasOwnProperty.call(node.constructor, 'prototype')) { // Avoid calling node.hasOwnProperty directly
          if (safe === true) {
            return null
          } else if (constructorAction === 'error') {
            throw new SyntaxError('Object contains forbidden prototype property')
          }

          delete node.constructor;
        }

        for (const key in node) {
          const value = node[key];
          if (value && typeof value === 'object') {
            next.push(value);
          }
        }
      }
    }
    return obj
  }

  function parse (text, reviver, options) {
    const stackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    try {
      return _parse(text, reviver, options)
    } finally {
      Error.stackTraceLimit = stackTraceLimit;
    }
  }

  function safeParse (text, reviver) {
    const stackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    try {
      return _parse(text, reviver, { safe: true })
    } catch (_e) {
      return null
    } finally {
      Error.stackTraceLimit = stackTraceLimit;
    }
  }

  secureJsonParse.exports = parse;
  secureJsonParse.exports.default = parse;
  secureJsonParse.exports.parse = parse;
  secureJsonParse.exports.safeParse = safeParse;
  secureJsonParse.exports.scan = filter;

  var secureJsonParseExports = secureJsonParse.exports;
  var SecureJSON = /*@__PURE__*/getDefaultExportFromCjs(secureJsonParseExports);

  // src/combine-headers.ts
  function combineHeaders(...headers) {
    return headers.reduce(
      (combinedHeaders, currentHeaders) => ({
        ...combinedHeaders,
        ...currentHeaders != null ? currentHeaders : {}
      }),
      {}
    );
  }

  // src/convert-async-iterator-to-readable-stream.ts
  function convertAsyncIteratorToReadableStream(iterator) {
    return new ReadableStream({
      /**
       * Called when the consumer wants to pull more data from the stream.
       *
       * @param {ReadableStreamDefaultController<T>} controller - The controller to enqueue data into the stream.
       * @returns {Promise<void>}
       */
      async pull(controller) {
        try {
          const { value, done } = await iterator.next();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        } catch (error) {
          controller.error(error);
        }
      },
      /**
       * Called when the consumer cancels the stream.
       */
      cancel() {
      }
    });
  }

  // src/delay.ts
  async function delay(delayInMs) {
    return delayInMs == null ? Promise.resolve() : new Promise((resolve2) => setTimeout(resolve2, delayInMs));
  }

  // src/event-source-parser-stream.ts
  function createEventSourceParserStream() {
    let buffer = "";
    let event = void 0;
    let data = [];
    let lastEventId = void 0;
    let retry = void 0;
    function parseLine(line, controller) {
      if (line === "") {
        dispatchEvent(controller);
        return;
      }
      if (line.startsWith(":")) {
        return;
      }
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) {
        handleField(line, "");
        return;
      }
      const field = line.slice(0, colonIndex);
      const valueStart = colonIndex + 1;
      const value = valueStart < line.length && line[valueStart] === " " ? line.slice(valueStart + 1) : line.slice(valueStart);
      handleField(field, value);
    }
    function dispatchEvent(controller) {
      if (data.length > 0) {
        controller.enqueue({
          event,
          data: data.join("\n"),
          id: lastEventId,
          retry
        });
        data = [];
        event = void 0;
        retry = void 0;
      }
    }
    function handleField(field, value) {
      switch (field) {
        case "event":
          event = value;
          break;
        case "data":
          data.push(value);
          break;
        case "id":
          lastEventId = value;
          break;
        case "retry":
          const parsedRetry = parseInt(value, 10);
          if (!isNaN(parsedRetry)) {
            retry = parsedRetry;
          }
          break;
      }
    }
    return new TransformStream({
      transform(chunk, controller) {
        const { lines, incompleteLine } = splitLines(buffer, chunk);
        buffer = incompleteLine;
        for (let i = 0; i < lines.length; i++) {
          parseLine(lines[i], controller);
        }
      },
      flush(controller) {
        parseLine(buffer, controller);
        dispatchEvent(controller);
      }
    });
  }
  function splitLines(buffer, chunk) {
    const lines = [];
    let currentLine = buffer;
    for (let i = 0; i < chunk.length; ) {
      const char = chunk[i++];
      if (char === "\n") {
        lines.push(currentLine);
        currentLine = "";
      } else if (char === "\r") {
        lines.push(currentLine);
        currentLine = "";
        if (chunk[i] === "\n") {
          i++;
        }
      } else {
        currentLine += char;
      }
    }
    return { lines, incompleteLine: currentLine };
  }

  // src/extract-response-headers.ts
  function extractResponseHeaders(response) {
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }
  var createIdGenerator = ({
    prefix,
    size: defaultSize = 16,
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    separator = "-"
  } = {}) => {
    const generator = customAlphabet(alphabet, defaultSize);
    if (prefix == null) {
      return generator;
    }
    if (alphabet.includes(separator)) {
      throw new InvalidArgumentError$1({
        argument: "separator",
        message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
      });
    }
    return (size) => `${prefix}${separator}${generator(size)}`;
  };
  var generateId = createIdGenerator();

  // src/get-error-message.ts
  function getErrorMessage(error) {
    if (error == null) {
      return "unknown error";
    }
    if (typeof error === "string") {
      return error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return JSON.stringify(error);
  }

  // src/remove-undefined-entries.ts
  function removeUndefinedEntries(record) {
    return Object.fromEntries(
      Object.entries(record).filter(([_key, value]) => value != null)
    );
  }

  // src/is-abort-error.ts
  function isAbortError(error) {
    return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
  }
  function loadApiKey({
    apiKey,
    environmentVariableName,
    apiKeyParameterName = "apiKey",
    description
  }) {
    if (typeof apiKey === "string") {
      return apiKey;
    }
    if (apiKey != null) {
      throw new LoadAPIKeyError({
        message: `${description} API key must be a string.`
      });
    }
    if (typeof process === "undefined") {
      throw new LoadAPIKeyError({
        message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
      });
    }
    apiKey = process.env[environmentVariableName];
    if (apiKey == null) {
      throw new LoadAPIKeyError({
        message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
      });
    }
    if (typeof apiKey !== "string") {
      throw new LoadAPIKeyError({
        message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
      });
    }
    return apiKey;
  }

  // src/validator.ts
  var validatorSymbol = Symbol.for("vercel.ai.validator");
  function validator(validate) {
    return { [validatorSymbol]: true, validate };
  }
  function isValidator(value) {
    return typeof value === "object" && value !== null && validatorSymbol in value && value[validatorSymbol] === true && "validate" in value;
  }
  function asValidator(value) {
    return isValidator(value) ? value : zodValidator(value);
  }
  function zodValidator(zodSchema) {
    return validator((value) => {
      const result = zodSchema.safeParse(value);
      return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
    });
  }

  // src/validate-types.ts
  function validateTypes({
    value,
    schema: inputSchema
  }) {
    const result = safeValidateTypes({ value, schema: inputSchema });
    if (!result.success) {
      throw TypeValidationError.wrap({ value, cause: result.error });
    }
    return result.value;
  }
  function safeValidateTypes({
    value,
    schema
  }) {
    const validator2 = asValidator(schema);
    try {
      if (validator2.validate == null) {
        return { success: true, value };
      }
      const result = validator2.validate(value);
      if (result.success) {
        return result;
      }
      return {
        success: false,
        error: TypeValidationError.wrap({ value, cause: result.error })
      };
    } catch (error) {
      return {
        success: false,
        error: TypeValidationError.wrap({ value, cause: error })
      };
    }
  }

  // src/parse-json.ts
  function parseJSON({
    text,
    schema
  }) {
    try {
      const value = SecureJSON.parse(text);
      if (schema == null) {
        return value;
      }
      return validateTypes({ value, schema });
    } catch (error) {
      if (JSONParseError.isInstance(error) || TypeValidationError.isInstance(error)) {
        throw error;
      }
      throw new JSONParseError({ text, cause: error });
    }
  }
  function safeParseJSON({
    text,
    schema
  }) {
    try {
      const value = SecureJSON.parse(text);
      if (schema == null) {
        return { success: true, value, rawValue: value };
      }
      const validationResult = safeValidateTypes({ value, schema });
      return validationResult.success ? { ...validationResult, rawValue: value } : validationResult;
    } catch (error) {
      return {
        success: false,
        error: JSONParseError.isInstance(error) ? error : new JSONParseError({ text, cause: error })
      };
    }
  }
  function isParsableJson(input) {
    try {
      SecureJSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  }
  function parseProviderOptions({
    provider,
    providerOptions,
    schema
  }) {
    if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
      return void 0;
    }
    const parsedProviderOptions = safeValidateTypes({
      value: providerOptions[provider],
      schema
    });
    if (!parsedProviderOptions.success) {
      throw new InvalidArgumentError$1({
        argument: "providerOptions",
        message: `invalid ${provider} provider options`,
        cause: parsedProviderOptions.error
      });
    }
    return parsedProviderOptions.value;
  }
  var getOriginalFetch2 = () => globalThis.fetch;
  var postJsonToApi = async ({
    url,
    headers,
    body,
    failedResponseHandler,
    successfulResponseHandler,
    abortSignal,
    fetch
  }) => postToApi({
    url,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: {
      content: JSON.stringify(body),
      values: body
    },
    failedResponseHandler,
    successfulResponseHandler,
    abortSignal,
    fetch
  });
  var postFormDataToApi = async ({
    url,
    headers,
    formData,
    failedResponseHandler,
    successfulResponseHandler,
    abortSignal,
    fetch
  }) => postToApi({
    url,
    headers,
    body: {
      content: formData,
      values: Object.fromEntries(formData.entries())
    },
    failedResponseHandler,
    successfulResponseHandler,
    abortSignal,
    fetch
  });
  var postToApi = async ({
    url,
    headers = {},
    body,
    successfulResponseHandler,
    failedResponseHandler,
    abortSignal,
    fetch = getOriginalFetch2()
  }) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: removeUndefinedEntries(headers),
        body: body.content,
        signal: abortSignal
      });
      const responseHeaders = extractResponseHeaders(response);
      if (!response.ok) {
        let errorInformation;
        try {
          errorInformation = await failedResponseHandler({
            response,
            url,
            requestBodyValues: body.values
          });
        } catch (error) {
          if (isAbortError(error) || APICallError.isInstance(error)) {
            throw error;
          }
          throw new APICallError({
            message: "Failed to process error response",
            cause: error,
            statusCode: response.status,
            url,
            responseHeaders,
            requestBodyValues: body.values
          });
        }
        throw errorInformation.value;
      }
      try {
        return await successfulResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (error instanceof Error) {
          if (isAbortError(error) || APICallError.isInstance(error)) {
            throw error;
          }
        }
        throw new APICallError({
          message: "Failed to process successful response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }
      if (error instanceof TypeError && error.message === "fetch failed") {
        const cause = error.cause;
        if (cause != null) {
          throw new APICallError({
            message: `Cannot connect to API: ${cause.message}`,
            cause,
            url,
            requestBodyValues: body.values,
            isRetryable: true
            // retry when network error
          });
        }
      }
      throw error;
    }
  };

  // src/resolve.ts
  async function resolve(value) {
    if (typeof value === "function") {
      value = value();
    }
    return Promise.resolve(value);
  }
  var createJsonErrorResponseHandler = ({
    errorSchema,
    errorToMessage,
    isRetryable
  }) => async ({ response, url, requestBodyValues }) => {
    const responseBody = await response.text();
    const responseHeaders = extractResponseHeaders(response);
    if (responseBody.trim() === "") {
      return {
        responseHeaders,
        value: new APICallError({
          message: response.statusText,
          url,
          requestBodyValues,
          statusCode: response.status,
          responseHeaders,
          responseBody,
          isRetryable: isRetryable == null ? void 0 : isRetryable(response)
        })
      };
    }
    try {
      const parsedError = parseJSON({
        text: responseBody,
        schema: errorSchema
      });
      return {
        responseHeaders,
        value: new APICallError({
          message: errorToMessage(parsedError),
          url,
          requestBodyValues,
          statusCode: response.status,
          responseHeaders,
          responseBody,
          data: parsedError,
          isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
        })
      };
    } catch (parseError) {
      return {
        responseHeaders,
        value: new APICallError({
          message: response.statusText,
          url,
          requestBodyValues,
          statusCode: response.status,
          responseHeaders,
          responseBody,
          isRetryable: isRetryable == null ? void 0 : isRetryable(response)
        })
      };
    }
  };
  var createEventSourceResponseHandler = (chunkSchema) => async ({ response }) => {
    const responseHeaders = extractResponseHeaders(response);
    if (response.body == null) {
      throw new EmptyResponseBodyError({});
    }
    return {
      responseHeaders,
      value: response.body.pipeThrough(new TextDecoderStream()).pipeThrough(createEventSourceParserStream()).pipeThrough(
        new TransformStream({
          transform({ data }, controller) {
            if (data === "[DONE]") {
              return;
            }
            controller.enqueue(
              safeParseJSON({
                text: data,
                schema: chunkSchema
              })
            );
          }
        })
      )
    };
  };
  var createJsonResponseHandler = (responseSchema) => async ({ response, url, requestBodyValues }) => {
    const responseBody = await response.text();
    const parsedResult = safeParseJSON({
      text: responseBody,
      schema: responseSchema
    });
    const responseHeaders = extractResponseHeaders(response);
    if (!parsedResult.success) {
      throw new APICallError({
        message: "Invalid JSON response",
        cause: parsedResult.error,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        url,
        requestBodyValues
      });
    }
    return {
      responseHeaders,
      value: parsedResult.value,
      rawValue: parsedResult.rawValue
    };
  };
  var createBinaryResponseHandler = () => async ({ response, url, requestBodyValues }) => {
    const responseHeaders = extractResponseHeaders(response);
    if (!response.body) {
      throw new APICallError({
        message: "Response body is empty",
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody: void 0
      });
    }
    try {
      const buffer = await response.arrayBuffer();
      return {
        responseHeaders,
        value: new Uint8Array(buffer)
      };
    } catch (error) {
      throw new APICallError({
        message: "Failed to read response as array buffer",
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody: void 0,
        cause: error
      });
    }
  };

  // src/uint8-utils.ts
  var { btoa, atob: atob$1 } = globalThis;
  function convertBase64ToUint8Array(base64String) {
    const base64Url = base64String.replace(/-/g, "+").replace(/_/g, "/");
    const latin1string = atob$1(base64Url);
    return Uint8Array.from(latin1string, (byte) => byte.codePointAt(0));
  }
  function convertUint8ArrayToBase64(array) {
    let latin1string = "";
    for (let i = 0; i < array.length; i++) {
      latin1string += String.fromCodePoint(array[i]);
    }
    return btoa(latin1string);
  }

  // src/without-trailing-slash.ts
  function withoutTrailingSlash(url) {
    return url == null ? void 0 : url.replace(/\/$/, "");
  }

  const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
  const defaultOptions = {
      name: undefined,
      $refStrategy: "root",
      basePath: ["#"],
      effectStrategy: "input",
      pipeStrategy: "all",
      dateStrategy: "format:date-time",
      mapStrategy: "entries",
      removeAdditionalStrategy: "passthrough",
      allowedAdditionalProperties: true,
      rejectedAdditionalProperties: false,
      definitionPath: "definitions",
      target: "jsonSchema7",
      strictUnions: false,
      definitions: {},
      errorMessages: false,
      markdownDescription: false,
      patternStrategy: "escape",
      applyRegexFlags: false,
      emailStrategy: "format:email",
      base64Strategy: "contentEncoding:base64",
      nameStrategy: "ref",
      openAiAnyTypeName: "OpenAiAnyType"
  };
  const getDefaultOptions = (options) => (typeof options === "string"
      ? {
          ...defaultOptions,
          name: options,
      }
      : {
          ...defaultOptions,
          ...options,
      });

  const getRefs = (options) => {
      const _options = getDefaultOptions(options);
      const currentPath = _options.name !== undefined
          ? [..._options.basePath, _options.definitionPath, _options.name]
          : _options.basePath;
      return {
          ..._options,
          flags: { hasReferencedOpenAiAnyType: false },
          currentPath: currentPath,
          propertyPath: undefined,
          seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [
              def._def,
              {
                  def: def._def,
                  path: [..._options.basePath, _options.definitionPath, name],
                  // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
                  jsonSchema: undefined,
              },
          ])),
      };
  };

  function addErrorMessage(res, key, errorMessage, refs) {
      if (!refs?.errorMessages)
          return;
      if (errorMessage) {
          res.errorMessage = {
              ...res.errorMessage,
              [key]: errorMessage,
          };
      }
  }
  function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
      res[key] = value;
      addErrorMessage(res, key, errorMessage, refs);
  }

  const getRelativePath = (pathA, pathB) => {
      let i = 0;
      for (; i < pathA.length && i < pathB.length; i++) {
          if (pathA[i] !== pathB[i])
              break;
      }
      return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
  };

  var util;
  (function (util) {
      util.assertEqual = (_) => { };
      function assertIs(_arg) { }
      util.assertIs = assertIs;
      function assertNever(_x) {
          throw new Error();
      }
      util.assertNever = assertNever;
      util.arrayToEnum = (items) => {
          const obj = {};
          for (const item of items) {
              obj[item] = item;
          }
          return obj;
      };
      util.getValidEnumValues = (obj) => {
          const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
          const filtered = {};
          for (const k of validKeys) {
              filtered[k] = obj[k];
          }
          return util.objectValues(filtered);
      };
      util.objectValues = (obj) => {
          return util.objectKeys(obj).map(function (e) {
              return obj[e];
          });
      };
      util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
          ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
          : (object) => {
              const keys = [];
              for (const key in object) {
                  if (Object.prototype.hasOwnProperty.call(object, key)) {
                      keys.push(key);
                  }
              }
              return keys;
          };
      util.find = (arr, checker) => {
          for (const item of arr) {
              if (checker(item))
                  return item;
          }
          return undefined;
      };
      util.isInteger = typeof Number.isInteger === "function"
          ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
          : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
          return array.map((val) => (typeof val === "string" ? `'${val}'` : val)).join(separator);
      }
      util.joinValues = joinValues;
      util.jsonStringifyReplacer = (_, value) => {
          if (typeof value === "bigint") {
              return value.toString();
          }
          return value;
      };
  })(util || (util = {}));
  var objectUtil;
  (function (objectUtil) {
      objectUtil.mergeShapes = (first, second) => {
          return {
              ...first,
              ...second, // second overwrites first
          };
      };
  })(objectUtil || (objectUtil = {}));
  const ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set",
  ]);
  const getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
          case "undefined":
              return ZodParsedType.undefined;
          case "string":
              return ZodParsedType.string;
          case "number":
              return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
          case "boolean":
              return ZodParsedType.boolean;
          case "function":
              return ZodParsedType.function;
          case "bigint":
              return ZodParsedType.bigint;
          case "symbol":
              return ZodParsedType.symbol;
          case "object":
              if (Array.isArray(data)) {
                  return ZodParsedType.array;
              }
              if (data === null) {
                  return ZodParsedType.null;
              }
              if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                  return ZodParsedType.promise;
              }
              if (typeof Map !== "undefined" && data instanceof Map) {
                  return ZodParsedType.map;
              }
              if (typeof Set !== "undefined" && data instanceof Set) {
                  return ZodParsedType.set;
              }
              if (typeof Date !== "undefined" && data instanceof Date) {
                  return ZodParsedType.date;
              }
              return ZodParsedType.object;
          default:
              return ZodParsedType.unknown;
      }
  };

  const ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite",
  ]);
  class ZodError extends Error {
      get errors() {
          return this.issues;
      }
      constructor(issues) {
          super();
          this.issues = [];
          this.addIssue = (sub) => {
              this.issues = [...this.issues, sub];
          };
          this.addIssues = (subs = []) => {
              this.issues = [...this.issues, ...subs];
          };
          const actualProto = new.target.prototype;
          if (Object.setPrototypeOf) {
              // eslint-disable-next-line ban/ban
              Object.setPrototypeOf(this, actualProto);
          }
          else {
              this.__proto__ = actualProto;
          }
          this.name = "ZodError";
          this.issues = issues;
      }
      format(_mapper) {
          const mapper = _mapper ||
              function (issue) {
                  return issue.message;
              };
          const fieldErrors = { _errors: [] };
          const processError = (error) => {
              for (const issue of error.issues) {
                  if (issue.code === "invalid_union") {
                      issue.unionErrors.map(processError);
                  }
                  else if (issue.code === "invalid_return_type") {
                      processError(issue.returnTypeError);
                  }
                  else if (issue.code === "invalid_arguments") {
                      processError(issue.argumentsError);
                  }
                  else if (issue.path.length === 0) {
                      fieldErrors._errors.push(mapper(issue));
                  }
                  else {
                      let curr = fieldErrors;
                      let i = 0;
                      while (i < issue.path.length) {
                          const el = issue.path[i];
                          const terminal = i === issue.path.length - 1;
                          if (!terminal) {
                              curr[el] = curr[el] || { _errors: [] };
                              // if (typeof el === "string") {
                              //   curr[el] = curr[el] || { _errors: [] };
                              // } else if (typeof el === "number") {
                              //   const errorArray: any = [];
                              //   errorArray._errors = [];
                              //   curr[el] = curr[el] || errorArray;
                              // }
                          }
                          else {
                              curr[el] = curr[el] || { _errors: [] };
                              curr[el]._errors.push(mapper(issue));
                          }
                          curr = curr[el];
                          i++;
                      }
                  }
              }
          };
          processError(this);
          return fieldErrors;
      }
      static assert(value) {
          if (!(value instanceof ZodError)) {
              throw new Error(`Not a ZodError: ${value}`);
          }
      }
      toString() {
          return this.message;
      }
      get message() {
          return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
          return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
          const fieldErrors = {};
          const formErrors = [];
          for (const sub of this.issues) {
              if (sub.path.length > 0) {
                  const firstEl = sub.path[0];
                  fieldErrors[firstEl] = fieldErrors[firstEl] || [];
                  fieldErrors[firstEl].push(mapper(sub));
              }
              else {
                  formErrors.push(mapper(sub));
              }
          }
          return { formErrors, fieldErrors };
      }
      get formErrors() {
          return this.flatten();
      }
  }
  ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
  };

  const errorMap = (issue, _ctx) => {
      let message;
      switch (issue.code) {
          case ZodIssueCode.invalid_type:
              if (issue.received === ZodParsedType.undefined) {
                  message = "Required";
              }
              else {
                  message = `Expected ${issue.expected}, received ${issue.received}`;
              }
              break;
          case ZodIssueCode.invalid_literal:
              message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
              break;
          case ZodIssueCode.unrecognized_keys:
              message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
              break;
          case ZodIssueCode.invalid_union:
              message = `Invalid input`;
              break;
          case ZodIssueCode.invalid_union_discriminator:
              message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
              break;
          case ZodIssueCode.invalid_enum_value:
              message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
              break;
          case ZodIssueCode.invalid_arguments:
              message = `Invalid function arguments`;
              break;
          case ZodIssueCode.invalid_return_type:
              message = `Invalid function return type`;
              break;
          case ZodIssueCode.invalid_date:
              message = `Invalid date`;
              break;
          case ZodIssueCode.invalid_string:
              if (typeof issue.validation === "object") {
                  if ("includes" in issue.validation) {
                      message = `Invalid input: must include "${issue.validation.includes}"`;
                      if (typeof issue.validation.position === "number") {
                          message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                      }
                  }
                  else if ("startsWith" in issue.validation) {
                      message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                  }
                  else if ("endsWith" in issue.validation) {
                      message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                  }
                  else {
                      util.assertNever(issue.validation);
                  }
              }
              else if (issue.validation !== "regex") {
                  message = `Invalid ${issue.validation}`;
              }
              else {
                  message = "Invalid";
              }
              break;
          case ZodIssueCode.too_small:
              if (issue.type === "array")
                  message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
              else if (issue.type === "string")
                  message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
              else if (issue.type === "number")
                  message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
              else if (issue.type === "bigint")
                  message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
              else if (issue.type === "date")
                  message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
              else
                  message = "Invalid input";
              break;
          case ZodIssueCode.too_big:
              if (issue.type === "array")
                  message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
              else if (issue.type === "string")
                  message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
              else if (issue.type === "number")
                  message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
              else if (issue.type === "bigint")
                  message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
              else if (issue.type === "date")
                  message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
              else
                  message = "Invalid input";
              break;
          case ZodIssueCode.custom:
              message = `Invalid input`;
              break;
          case ZodIssueCode.invalid_intersection_types:
              message = `Intersection results could not be merged`;
              break;
          case ZodIssueCode.not_multiple_of:
              message = `Number must be a multiple of ${issue.multipleOf}`;
              break;
          case ZodIssueCode.not_finite:
              message = "Number must be finite";
              break;
          default:
              message = _ctx.defaultError;
              util.assertNever(issue);
      }
      return { message };
  };

  let overrideErrorMap = errorMap;
  function getErrorMap() {
      return overrideErrorMap;
  }

  const makeIssue = (params) => {
      const { data, path, errorMaps, issueData } = params;
      const fullPath = [...path, ...(issueData.path || [])];
      const fullIssue = {
          ...issueData,
          path: fullPath,
      };
      if (issueData.message !== undefined) {
          return {
              ...issueData,
              path: fullPath,
              message: issueData.message,
          };
      }
      let errorMessage = "";
      const maps = errorMaps
          .filter((m) => !!m)
          .slice()
          .reverse();
      for (const map of maps) {
          errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
          ...issueData,
          path: fullPath,
          message: errorMessage,
      };
  };
  function addIssueToContext(ctx, issueData) {
      const overrideMap = getErrorMap();
      const issue = makeIssue({
          issueData: issueData,
          data: ctx.data,
          path: ctx.path,
          errorMaps: [
              ctx.common.contextualErrorMap, // contextual error map is first priority
              ctx.schemaErrorMap, // then schema-bound map if available
              overrideMap, // then global override map
              overrideMap === errorMap ? undefined : errorMap, // then global default map
          ].filter((x) => !!x),
      });
      ctx.common.issues.push(issue);
  }
  class ParseStatus {
      constructor() {
          this.value = "valid";
      }
      dirty() {
          if (this.value === "valid")
              this.value = "dirty";
      }
      abort() {
          if (this.value !== "aborted")
              this.value = "aborted";
      }
      static mergeArray(status, results) {
          const arrayValue = [];
          for (const s of results) {
              if (s.status === "aborted")
                  return INVALID;
              if (s.status === "dirty")
                  status.dirty();
              arrayValue.push(s.value);
          }
          return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
          const syncPairs = [];
          for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                  key,
                  value,
              });
          }
          return ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
          const finalObject = {};
          for (const pair of pairs) {
              const { key, value } = pair;
              if (key.status === "aborted")
                  return INVALID;
              if (value.status === "aborted")
                  return INVALID;
              if (key.status === "dirty")
                  status.dirty();
              if (value.status === "dirty")
                  status.dirty();
              if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
                  finalObject[key.value] = value.value;
              }
          }
          return { status: status.value, value: finalObject };
      }
  }
  const INVALID = Object.freeze({
      status: "aborted",
  });
  const DIRTY = (value) => ({ status: "dirty", value });
  const OK = (value) => ({ status: "valid", value });
  const isAborted = (x) => x.status === "aborted";
  const isDirty = (x) => x.status === "dirty";
  const isValid = (x) => x.status === "valid";
  const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

  var errorUtil;
  (function (errorUtil) {
      errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      // biome-ignore lint:
      errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
  })(errorUtil || (errorUtil = {}));

  class ParseInputLazyPath {
      constructor(parent, value, path, key) {
          this._cachedPath = [];
          this.parent = parent;
          this.data = value;
          this._path = path;
          this._key = key;
      }
      get path() {
          if (!this._cachedPath.length) {
              if (Array.isArray(this._key)) {
                  this._cachedPath.push(...this._path, ...this._key);
              }
              else {
                  this._cachedPath.push(...this._path, this._key);
              }
          }
          return this._cachedPath;
      }
  }
  const handleResult = (ctx, result) => {
      if (isValid(result)) {
          return { success: true, data: result.value };
      }
      else {
          if (!ctx.common.issues.length) {
              throw new Error("Validation failed but no issues detected.");
          }
          return {
              success: false,
              get error() {
                  if (this._error)
                      return this._error;
                  const error = new ZodError(ctx.common.issues);
                  this._error = error;
                  return this._error;
              },
          };
      }
  };
  function processCreateParams(params) {
      if (!params)
          return {};
      const { errorMap, invalid_type_error, required_error, description } = params;
      if (errorMap && (invalid_type_error || required_error)) {
          throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
      }
      if (errorMap)
          return { errorMap: errorMap, description };
      const customMap = (iss, ctx) => {
          const { message } = params;
          if (iss.code === "invalid_enum_value") {
              return { message: message ?? ctx.defaultError };
          }
          if (typeof ctx.data === "undefined") {
              return { message: message ?? required_error ?? ctx.defaultError };
          }
          if (iss.code !== "invalid_type")
              return { message: ctx.defaultError };
          return { message: message ?? invalid_type_error ?? ctx.defaultError };
      };
      return { errorMap: customMap, description };
  }
  class ZodType {
      get description() {
          return this._def.description;
      }
      _getType(input) {
          return getParsedType(input.data);
      }
      _getOrReturnCtx(input, ctx) {
          return (ctx || {
              common: input.parent.common,
              data: input.data,
              parsedType: getParsedType(input.data),
              schemaErrorMap: this._def.errorMap,
              path: input.path,
              parent: input.parent,
          });
      }
      _processInputParams(input) {
          return {
              status: new ParseStatus(),
              ctx: {
                  common: input.parent.common,
                  data: input.data,
                  parsedType: getParsedType(input.data),
                  schemaErrorMap: this._def.errorMap,
                  path: input.path,
                  parent: input.parent,
              },
          };
      }
      _parseSync(input) {
          const result = this._parse(input);
          if (isAsync(result)) {
              throw new Error("Synchronous parse encountered promise.");
          }
          return result;
      }
      _parseAsync(input) {
          const result = this._parse(input);
          return Promise.resolve(result);
      }
      parse(data, params) {
          const result = this.safeParse(data, params);
          if (result.success)
              return result.data;
          throw result.error;
      }
      safeParse(data, params) {
          const ctx = {
              common: {
                  issues: [],
                  async: params?.async ?? false,
                  contextualErrorMap: params?.errorMap,
              },
              path: params?.path || [],
              schemaErrorMap: this._def.errorMap,
              parent: null,
              data,
              parsedType: getParsedType(data),
          };
          const result = this._parseSync({ data, path: ctx.path, parent: ctx });
          return handleResult(ctx, result);
      }
      "~validate"(data) {
          const ctx = {
              common: {
                  issues: [],
                  async: !!this["~standard"].async,
              },
              path: [],
              schemaErrorMap: this._def.errorMap,
              parent: null,
              data,
              parsedType: getParsedType(data),
          };
          if (!this["~standard"].async) {
              try {
                  const result = this._parseSync({ data, path: [], parent: ctx });
                  return isValid(result)
                      ? {
                          value: result.value,
                      }
                      : {
                          issues: ctx.common.issues,
                      };
              }
              catch (err) {
                  if (err?.message?.toLowerCase()?.includes("encountered")) {
                      this["~standard"].async = true;
                  }
                  ctx.common = {
                      issues: [],
                      async: true,
                  };
              }
          }
          return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result)
              ? {
                  value: result.value,
              }
              : {
                  issues: ctx.common.issues,
              });
      }
      async parseAsync(data, params) {
          const result = await this.safeParseAsync(data, params);
          if (result.success)
              return result.data;
          throw result.error;
      }
      async safeParseAsync(data, params) {
          const ctx = {
              common: {
                  issues: [],
                  contextualErrorMap: params?.errorMap,
                  async: true,
              },
              path: params?.path || [],
              schemaErrorMap: this._def.errorMap,
              parent: null,
              data,
              parsedType: getParsedType(data),
          };
          const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
          const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
          return handleResult(ctx, result);
      }
      refine(check, message) {
          const getIssueProperties = (val) => {
              if (typeof message === "string" || typeof message === "undefined") {
                  return { message };
              }
              else if (typeof message === "function") {
                  return message(val);
              }
              else {
                  return message;
              }
          };
          return this._refinement((val, ctx) => {
              const result = check(val);
              const setError = () => ctx.addIssue({
                  code: ZodIssueCode.custom,
                  ...getIssueProperties(val),
              });
              if (typeof Promise !== "undefined" && result instanceof Promise) {
                  return result.then((data) => {
                      if (!data) {
                          setError();
                          return false;
                      }
                      else {
                          return true;
                      }
                  });
              }
              if (!result) {
                  setError();
                  return false;
              }
              else {
                  return true;
              }
          });
      }
      refinement(check, refinementData) {
          return this._refinement((val, ctx) => {
              if (!check(val)) {
                  ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
                  return false;
              }
              else {
                  return true;
              }
          });
      }
      _refinement(refinement) {
          return new ZodEffects({
              schema: this,
              typeName: ZodFirstPartyTypeKind.ZodEffects,
              effect: { type: "refinement", refinement },
          });
      }
      superRefine(refinement) {
          return this._refinement(refinement);
      }
      constructor(def) {
          /** Alias of safeParseAsync */
          this.spa = this.safeParseAsync;
          this._def = def;
          this.parse = this.parse.bind(this);
          this.safeParse = this.safeParse.bind(this);
          this.parseAsync = this.parseAsync.bind(this);
          this.safeParseAsync = this.safeParseAsync.bind(this);
          this.spa = this.spa.bind(this);
          this.refine = this.refine.bind(this);
          this.refinement = this.refinement.bind(this);
          this.superRefine = this.superRefine.bind(this);
          this.optional = this.optional.bind(this);
          this.nullable = this.nullable.bind(this);
          this.nullish = this.nullish.bind(this);
          this.array = this.array.bind(this);
          this.promise = this.promise.bind(this);
          this.or = this.or.bind(this);
          this.and = this.and.bind(this);
          this.transform = this.transform.bind(this);
          this.brand = this.brand.bind(this);
          this.default = this.default.bind(this);
          this.catch = this.catch.bind(this);
          this.describe = this.describe.bind(this);
          this.pipe = this.pipe.bind(this);
          this.readonly = this.readonly.bind(this);
          this.isNullable = this.isNullable.bind(this);
          this.isOptional = this.isOptional.bind(this);
          this["~standard"] = {
              version: 1,
              vendor: "zod",
              validate: (data) => this["~validate"](data),
          };
      }
      optional() {
          return ZodOptional.create(this, this._def);
      }
      nullable() {
          return ZodNullable.create(this, this._def);
      }
      nullish() {
          return this.nullable().optional();
      }
      array() {
          return ZodArray.create(this);
      }
      promise() {
          return ZodPromise.create(this, this._def);
      }
      or(option) {
          return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
          return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
          return new ZodEffects({
              ...processCreateParams(this._def),
              schema: this,
              typeName: ZodFirstPartyTypeKind.ZodEffects,
              effect: { type: "transform", transform },
          });
      }
      default(def) {
          const defaultValueFunc = typeof def === "function" ? def : () => def;
          return new ZodDefault({
              ...processCreateParams(this._def),
              innerType: this,
              defaultValue: defaultValueFunc,
              typeName: ZodFirstPartyTypeKind.ZodDefault,
          });
      }
      brand() {
          return new ZodBranded({
              typeName: ZodFirstPartyTypeKind.ZodBranded,
              type: this,
              ...processCreateParams(this._def),
          });
      }
      catch(def) {
          const catchValueFunc = typeof def === "function" ? def : () => def;
          return new ZodCatch({
              ...processCreateParams(this._def),
              innerType: this,
              catchValue: catchValueFunc,
              typeName: ZodFirstPartyTypeKind.ZodCatch,
          });
      }
      describe(description) {
          const This = this.constructor;
          return new This({
              ...this._def,
              description,
          });
      }
      pipe(target) {
          return ZodPipeline.create(this, target);
      }
      readonly() {
          return ZodReadonly.create(this);
      }
      isOptional() {
          return this.safeParse(undefined).success;
      }
      isNullable() {
          return this.safeParse(null).success;
      }
  }
  const cuidRegex = /^c[^\s-]{8,}$/i;
  const cuid2Regex = /^[0-9a-z]+$/;
  const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  // const uuidRegex =
  //   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
  const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  const nanoidRegex = /^[a-z0-9_-]{21}$/i;
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
  // from https://stackoverflow.com/a/46181/1550155
  // old version: too slow, didn't support unicode
  // const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
  //old email regex
  // const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
  // eslint-disable-next-line
  // const emailRegex =
  //   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
  // const emailRegex =
  //   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  // const emailRegex =
  //   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  // const emailRegex =
  //   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
  // from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
  const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  let emojiRegex$1;
  // faster, simpler, safer
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
  // const ipv6Regex =
  // /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  // https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
  const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  // https://base64.guru/standards/base64url
  const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
  // simple
  // const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
  // no leap year validation
  // const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
  // with leap year validation
  const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
  const dateRegex = new RegExp(`^${dateRegexSource}$`);
  function timeRegexSource(args) {
      let secondsRegexSource = `[0-5]\\d`;
      if (args.precision) {
          secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
      }
      else if (args.precision == null) {
          secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
      }
      const secondsQuantifier = args.precision ? "+" : "?"; // require seconds if precision is nonzero
      return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
  }
  function timeRegex(args) {
      return new RegExp(`^${timeRegexSource(args)}$`);
  }
  // Adapted from https://stackoverflow.com/a/3143231
  function datetimeRegex(args) {
      let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
      const opts = [];
      opts.push(args.local ? `Z?` : `Z`);
      if (args.offset)
          opts.push(`([+-]\\d{2}:?\\d{2})`);
      regex = `${regex}(${opts.join("|")})`;
      return new RegExp(`^${regex}$`);
  }
  function isValidIP(ip, version) {
      if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
          return true;
      }
      if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
          return true;
      }
      return false;
  }
  function isValidJWT(jwt, alg) {
      if (!jwtRegex.test(jwt))
          return false;
      try {
          const [header] = jwt.split(".");
          if (!header)
              return false;
          // Convert base64url to base64
          const base64 = header
              .replace(/-/g, "+")
              .replace(/_/g, "/")
              .padEnd(header.length + ((4 - (header.length % 4)) % 4), "=");
          const decoded = JSON.parse(atob(base64));
          if (typeof decoded !== "object" || decoded === null)
              return false;
          if ("typ" in decoded && decoded?.typ !== "JWT")
              return false;
          if (!decoded.alg)
              return false;
          if (alg && decoded.alg !== alg)
              return false;
          return true;
      }
      catch {
          return false;
      }
  }
  function isValidCidr(ip, version) {
      if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
          return true;
      }
      if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
          return true;
      }
      return false;
  }
  class ZodString extends ZodType {
      _parse(input) {
          if (this._def.coerce) {
              input.data = String(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.string) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.string,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          const status = new ParseStatus();
          let ctx = undefined;
          for (const check of this._def.checks) {
              if (check.kind === "min") {
                  if (input.data.length < check.value) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.too_small,
                          minimum: check.value,
                          type: "string",
                          inclusive: true,
                          exact: false,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "max") {
                  if (input.data.length > check.value) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.too_big,
                          maximum: check.value,
                          type: "string",
                          inclusive: true,
                          exact: false,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "length") {
                  const tooBig = input.data.length > check.value;
                  const tooSmall = input.data.length < check.value;
                  if (tooBig || tooSmall) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      if (tooBig) {
                          addIssueToContext(ctx, {
                              code: ZodIssueCode.too_big,
                              maximum: check.value,
                              type: "string",
                              inclusive: true,
                              exact: true,
                              message: check.message,
                          });
                      }
                      else if (tooSmall) {
                          addIssueToContext(ctx, {
                              code: ZodIssueCode.too_small,
                              minimum: check.value,
                              type: "string",
                              inclusive: true,
                              exact: true,
                              message: check.message,
                          });
                      }
                      status.dirty();
                  }
              }
              else if (check.kind === "email") {
                  if (!emailRegex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "email",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "emoji") {
                  if (!emojiRegex$1) {
                      emojiRegex$1 = new RegExp(_emojiRegex, "u");
                  }
                  if (!emojiRegex$1.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "emoji",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "uuid") {
                  if (!uuidRegex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "uuid",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "nanoid") {
                  if (!nanoidRegex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "nanoid",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "cuid") {
                  if (!cuidRegex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "cuid",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "cuid2") {
                  if (!cuid2Regex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "cuid2",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "ulid") {
                  if (!ulidRegex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "ulid",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "url") {
                  try {
                      new URL(input.data);
                  }
                  catch {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "url",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "regex") {
                  check.regex.lastIndex = 0;
                  const testResult = check.regex.test(input.data);
                  if (!testResult) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "regex",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "trim") {
                  input.data = input.data.trim();
              }
              else if (check.kind === "includes") {
                  if (!input.data.includes(check.value, check.position)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.invalid_string,
                          validation: { includes: check.value, position: check.position },
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "toLowerCase") {
                  input.data = input.data.toLowerCase();
              }
              else if (check.kind === "toUpperCase") {
                  input.data = input.data.toUpperCase();
              }
              else if (check.kind === "startsWith") {
                  if (!input.data.startsWith(check.value)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.invalid_string,
                          validation: { startsWith: check.value },
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "endsWith") {
                  if (!input.data.endsWith(check.value)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.invalid_string,
                          validation: { endsWith: check.value },
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "datetime") {
                  const regex = datetimeRegex(check);
                  if (!regex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.invalid_string,
                          validation: "datetime",
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "date") {
                  const regex = dateRegex;
                  if (!regex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.invalid_string,
                          validation: "date",
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "time") {
                  const regex = timeRegex(check);
                  if (!regex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.invalid_string,
                          validation: "time",
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "duration") {
                  if (!durationRegex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "duration",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "ip") {
                  if (!isValidIP(input.data, check.version)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "ip",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "jwt") {
                  if (!isValidJWT(input.data, check.alg)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "jwt",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "cidr") {
                  if (!isValidCidr(input.data, check.version)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "cidr",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "base64") {
                  if (!base64Regex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "base64",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "base64url") {
                  if (!base64urlRegex.test(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          validation: "base64url",
                          code: ZodIssueCode.invalid_string,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else {
                  util.assertNever(check);
              }
          }
          return { status: status.value, value: input.data };
      }
      _regex(regex, validation, message) {
          return this.refinement((data) => regex.test(data), {
              validation,
              code: ZodIssueCode.invalid_string,
              ...errorUtil.errToObj(message),
          });
      }
      _addCheck(check) {
          return new ZodString({
              ...this._def,
              checks: [...this._def.checks, check],
          });
      }
      email(message) {
          return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
      }
      url(message) {
          return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
      }
      emoji(message) {
          return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
      }
      uuid(message) {
          return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
      }
      nanoid(message) {
          return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
      }
      cuid(message) {
          return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
      }
      cuid2(message) {
          return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
      }
      ulid(message) {
          return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
      }
      base64(message) {
          return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
      }
      base64url(message) {
          // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
          return this._addCheck({
              kind: "base64url",
              ...errorUtil.errToObj(message),
          });
      }
      jwt(options) {
          return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
      }
      ip(options) {
          return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
      }
      cidr(options) {
          return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
      }
      datetime(options) {
          if (typeof options === "string") {
              return this._addCheck({
                  kind: "datetime",
                  precision: null,
                  offset: false,
                  local: false,
                  message: options,
              });
          }
          return this._addCheck({
              kind: "datetime",
              precision: typeof options?.precision === "undefined" ? null : options?.precision,
              offset: options?.offset ?? false,
              local: options?.local ?? false,
              ...errorUtil.errToObj(options?.message),
          });
      }
      date(message) {
          return this._addCheck({ kind: "date", message });
      }
      time(options) {
          if (typeof options === "string") {
              return this._addCheck({
                  kind: "time",
                  precision: null,
                  message: options,
              });
          }
          return this._addCheck({
              kind: "time",
              precision: typeof options?.precision === "undefined" ? null : options?.precision,
              ...errorUtil.errToObj(options?.message),
          });
      }
      duration(message) {
          return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
      }
      regex(regex, message) {
          return this._addCheck({
              kind: "regex",
              regex: regex,
              ...errorUtil.errToObj(message),
          });
      }
      includes(value, options) {
          return this._addCheck({
              kind: "includes",
              value: value,
              position: options?.position,
              ...errorUtil.errToObj(options?.message),
          });
      }
      startsWith(value, message) {
          return this._addCheck({
              kind: "startsWith",
              value: value,
              ...errorUtil.errToObj(message),
          });
      }
      endsWith(value, message) {
          return this._addCheck({
              kind: "endsWith",
              value: value,
              ...errorUtil.errToObj(message),
          });
      }
      min(minLength, message) {
          return this._addCheck({
              kind: "min",
              value: minLength,
              ...errorUtil.errToObj(message),
          });
      }
      max(maxLength, message) {
          return this._addCheck({
              kind: "max",
              value: maxLength,
              ...errorUtil.errToObj(message),
          });
      }
      length(len, message) {
          return this._addCheck({
              kind: "length",
              value: len,
              ...errorUtil.errToObj(message),
          });
      }
      /**
       * Equivalent to `.min(1)`
       */
      nonempty(message) {
          return this.min(1, errorUtil.errToObj(message));
      }
      trim() {
          return new ZodString({
              ...this._def,
              checks: [...this._def.checks, { kind: "trim" }],
          });
      }
      toLowerCase() {
          return new ZodString({
              ...this._def,
              checks: [...this._def.checks, { kind: "toLowerCase" }],
          });
      }
      toUpperCase() {
          return new ZodString({
              ...this._def,
              checks: [...this._def.checks, { kind: "toUpperCase" }],
          });
      }
      get isDatetime() {
          return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isDate() {
          return !!this._def.checks.find((ch) => ch.kind === "date");
      }
      get isTime() {
          return !!this._def.checks.find((ch) => ch.kind === "time");
      }
      get isDuration() {
          return !!this._def.checks.find((ch) => ch.kind === "duration");
      }
      get isEmail() {
          return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
          return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isEmoji() {
          return !!this._def.checks.find((ch) => ch.kind === "emoji");
      }
      get isUUID() {
          return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isNANOID() {
          return !!this._def.checks.find((ch) => ch.kind === "nanoid");
      }
      get isCUID() {
          return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
          return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get isULID() {
          return !!this._def.checks.find((ch) => ch.kind === "ulid");
      }
      get isIP() {
          return !!this._def.checks.find((ch) => ch.kind === "ip");
      }
      get isCIDR() {
          return !!this._def.checks.find((ch) => ch.kind === "cidr");
      }
      get isBase64() {
          return !!this._def.checks.find((ch) => ch.kind === "base64");
      }
      get isBase64url() {
          // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
          return !!this._def.checks.find((ch) => ch.kind === "base64url");
      }
      get minLength() {
          let min = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "min") {
                  if (min === null || ch.value > min)
                      min = ch.value;
              }
          }
          return min;
      }
      get maxLength() {
          let max = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "max") {
                  if (max === null || ch.value < max)
                      max = ch.value;
              }
          }
          return max;
      }
  }
  ZodString.create = (params) => {
      return new ZodString({
          checks: [],
          typeName: ZodFirstPartyTypeKind.ZodString,
          coerce: params?.coerce ?? false,
          ...processCreateParams(params),
      });
  };
  // https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
  function floatSafeRemainder(val, step) {
      const valDecCount = (val.toString().split(".")[1] || "").length;
      const stepDecCount = (step.toString().split(".")[1] || "").length;
      const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
      const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
      const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
      return (valInt % stepInt) / 10 ** decCount;
  }
  class ZodNumber extends ZodType {
      constructor() {
          super(...arguments);
          this.min = this.gte;
          this.max = this.lte;
          this.step = this.multipleOf;
      }
      _parse(input) {
          if (this._def.coerce) {
              input.data = Number(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.number) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.number,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          let ctx = undefined;
          const status = new ParseStatus();
          for (const check of this._def.checks) {
              if (check.kind === "int") {
                  if (!util.isInteger(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.invalid_type,
                          expected: "integer",
                          received: "float",
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "min") {
                  const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                  if (tooSmall) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.too_small,
                          minimum: check.value,
                          type: "number",
                          inclusive: check.inclusive,
                          exact: false,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "max") {
                  const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                  if (tooBig) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.too_big,
                          maximum: check.value,
                          type: "number",
                          inclusive: check.inclusive,
                          exact: false,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "multipleOf") {
                  if (floatSafeRemainder(input.data, check.value) !== 0) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.not_multiple_of,
                          multipleOf: check.value,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "finite") {
                  if (!Number.isFinite(input.data)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.not_finite,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else {
                  util.assertNever(check);
              }
          }
          return { status: status.value, value: input.data };
      }
      gte(value, message) {
          return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
          return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
          return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
          return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
          return new ZodNumber({
              ...this._def,
              checks: [
                  ...this._def.checks,
                  {
                      kind,
                      value,
                      inclusive,
                      message: errorUtil.toString(message),
                  },
              ],
          });
      }
      _addCheck(check) {
          return new ZodNumber({
              ...this._def,
              checks: [...this._def.checks, check],
          });
      }
      int(message) {
          return this._addCheck({
              kind: "int",
              message: errorUtil.toString(message),
          });
      }
      positive(message) {
          return this._addCheck({
              kind: "min",
              value: 0,
              inclusive: false,
              message: errorUtil.toString(message),
          });
      }
      negative(message) {
          return this._addCheck({
              kind: "max",
              value: 0,
              inclusive: false,
              message: errorUtil.toString(message),
          });
      }
      nonpositive(message) {
          return this._addCheck({
              kind: "max",
              value: 0,
              inclusive: true,
              message: errorUtil.toString(message),
          });
      }
      nonnegative(message) {
          return this._addCheck({
              kind: "min",
              value: 0,
              inclusive: true,
              message: errorUtil.toString(message),
          });
      }
      multipleOf(value, message) {
          return this._addCheck({
              kind: "multipleOf",
              value: value,
              message: errorUtil.toString(message),
          });
      }
      finite(message) {
          return this._addCheck({
              kind: "finite",
              message: errorUtil.toString(message),
          });
      }
      safe(message) {
          return this._addCheck({
              kind: "min",
              inclusive: true,
              value: Number.MIN_SAFE_INTEGER,
              message: errorUtil.toString(message),
          })._addCheck({
              kind: "max",
              inclusive: true,
              value: Number.MAX_SAFE_INTEGER,
              message: errorUtil.toString(message),
          });
      }
      get minValue() {
          let min = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "min") {
                  if (min === null || ch.value > min)
                      min = ch.value;
              }
          }
          return min;
      }
      get maxValue() {
          let max = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "max") {
                  if (max === null || ch.value < max)
                      max = ch.value;
              }
          }
          return max;
      }
      get isInt() {
          return !!this._def.checks.find((ch) => ch.kind === "int" || (ch.kind === "multipleOf" && util.isInteger(ch.value)));
      }
      get isFinite() {
          let max = null;
          let min = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
                  return true;
              }
              else if (ch.kind === "min") {
                  if (min === null || ch.value > min)
                      min = ch.value;
              }
              else if (ch.kind === "max") {
                  if (max === null || ch.value < max)
                      max = ch.value;
              }
          }
          return Number.isFinite(min) && Number.isFinite(max);
      }
  }
  ZodNumber.create = (params) => {
      return new ZodNumber({
          checks: [],
          typeName: ZodFirstPartyTypeKind.ZodNumber,
          coerce: params?.coerce || false,
          ...processCreateParams(params),
      });
  };
  class ZodBigInt extends ZodType {
      constructor() {
          super(...arguments);
          this.min = this.gte;
          this.max = this.lte;
      }
      _parse(input) {
          if (this._def.coerce) {
              try {
                  input.data = BigInt(input.data);
              }
              catch {
                  return this._getInvalidInput(input);
              }
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.bigint) {
              return this._getInvalidInput(input);
          }
          let ctx = undefined;
          const status = new ParseStatus();
          for (const check of this._def.checks) {
              if (check.kind === "min") {
                  const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                  if (tooSmall) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.too_small,
                          type: "bigint",
                          minimum: check.value,
                          inclusive: check.inclusive,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "max") {
                  const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                  if (tooBig) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.too_big,
                          type: "bigint",
                          maximum: check.value,
                          inclusive: check.inclusive,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "multipleOf") {
                  if (input.data % check.value !== BigInt(0)) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.not_multiple_of,
                          multipleOf: check.value,
                          message: check.message,
                      });
                      status.dirty();
                  }
              }
              else {
                  util.assertNever(check);
              }
          }
          return { status: status.value, value: input.data };
      }
      _getInvalidInput(input) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.bigint,
              received: ctx.parsedType,
          });
          return INVALID;
      }
      gte(value, message) {
          return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
          return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
          return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
          return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
          return new ZodBigInt({
              ...this._def,
              checks: [
                  ...this._def.checks,
                  {
                      kind,
                      value,
                      inclusive,
                      message: errorUtil.toString(message),
                  },
              ],
          });
      }
      _addCheck(check) {
          return new ZodBigInt({
              ...this._def,
              checks: [...this._def.checks, check],
          });
      }
      positive(message) {
          return this._addCheck({
              kind: "min",
              value: BigInt(0),
              inclusive: false,
              message: errorUtil.toString(message),
          });
      }
      negative(message) {
          return this._addCheck({
              kind: "max",
              value: BigInt(0),
              inclusive: false,
              message: errorUtil.toString(message),
          });
      }
      nonpositive(message) {
          return this._addCheck({
              kind: "max",
              value: BigInt(0),
              inclusive: true,
              message: errorUtil.toString(message),
          });
      }
      nonnegative(message) {
          return this._addCheck({
              kind: "min",
              value: BigInt(0),
              inclusive: true,
              message: errorUtil.toString(message),
          });
      }
      multipleOf(value, message) {
          return this._addCheck({
              kind: "multipleOf",
              value,
              message: errorUtil.toString(message),
          });
      }
      get minValue() {
          let min = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "min") {
                  if (min === null || ch.value > min)
                      min = ch.value;
              }
          }
          return min;
      }
      get maxValue() {
          let max = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "max") {
                  if (max === null || ch.value < max)
                      max = ch.value;
              }
          }
          return max;
      }
  }
  ZodBigInt.create = (params) => {
      return new ZodBigInt({
          checks: [],
          typeName: ZodFirstPartyTypeKind.ZodBigInt,
          coerce: params?.coerce ?? false,
          ...processCreateParams(params),
      });
  };
  class ZodBoolean extends ZodType {
      _parse(input) {
          if (this._def.coerce) {
              input.data = Boolean(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.boolean) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.boolean,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          return OK(input.data);
      }
  }
  ZodBoolean.create = (params) => {
      return new ZodBoolean({
          typeName: ZodFirstPartyTypeKind.ZodBoolean,
          coerce: params?.coerce || false,
          ...processCreateParams(params),
      });
  };
  class ZodDate extends ZodType {
      _parse(input) {
          if (this._def.coerce) {
              input.data = new Date(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.date) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.date,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          if (Number.isNaN(input.data.getTime())) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_date,
              });
              return INVALID;
          }
          const status = new ParseStatus();
          let ctx = undefined;
          for (const check of this._def.checks) {
              if (check.kind === "min") {
                  if (input.data.getTime() < check.value) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.too_small,
                          message: check.message,
                          inclusive: true,
                          exact: false,
                          minimum: check.value,
                          type: "date",
                      });
                      status.dirty();
                  }
              }
              else if (check.kind === "max") {
                  if (input.data.getTime() > check.value) {
                      ctx = this._getOrReturnCtx(input, ctx);
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.too_big,
                          message: check.message,
                          inclusive: true,
                          exact: false,
                          maximum: check.value,
                          type: "date",
                      });
                      status.dirty();
                  }
              }
              else {
                  util.assertNever(check);
              }
          }
          return {
              status: status.value,
              value: new Date(input.data.getTime()),
          };
      }
      _addCheck(check) {
          return new ZodDate({
              ...this._def,
              checks: [...this._def.checks, check],
          });
      }
      min(minDate, message) {
          return this._addCheck({
              kind: "min",
              value: minDate.getTime(),
              message: errorUtil.toString(message),
          });
      }
      max(maxDate, message) {
          return this._addCheck({
              kind: "max",
              value: maxDate.getTime(),
              message: errorUtil.toString(message),
          });
      }
      get minDate() {
          let min = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "min") {
                  if (min === null || ch.value > min)
                      min = ch.value;
              }
          }
          return min != null ? new Date(min) : null;
      }
      get maxDate() {
          let max = null;
          for (const ch of this._def.checks) {
              if (ch.kind === "max") {
                  if (max === null || ch.value < max)
                      max = ch.value;
              }
          }
          return max != null ? new Date(max) : null;
      }
  }
  ZodDate.create = (params) => {
      return new ZodDate({
          checks: [],
          coerce: params?.coerce || false,
          typeName: ZodFirstPartyTypeKind.ZodDate,
          ...processCreateParams(params),
      });
  };
  class ZodSymbol extends ZodType {
      _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.symbol) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.symbol,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          return OK(input.data);
      }
  }
  ZodSymbol.create = (params) => {
      return new ZodSymbol({
          typeName: ZodFirstPartyTypeKind.ZodSymbol,
          ...processCreateParams(params),
      });
  };
  class ZodUndefined extends ZodType {
      _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.undefined) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.undefined,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          return OK(input.data);
      }
  }
  ZodUndefined.create = (params) => {
      return new ZodUndefined({
          typeName: ZodFirstPartyTypeKind.ZodUndefined,
          ...processCreateParams(params),
      });
  };
  class ZodNull extends ZodType {
      _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.null) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.null,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          return OK(input.data);
      }
  }
  ZodNull.create = (params) => {
      return new ZodNull({
          typeName: ZodFirstPartyTypeKind.ZodNull,
          ...processCreateParams(params),
      });
  };
  class ZodAny extends ZodType {
      constructor() {
          super(...arguments);
          // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
          this._any = true;
      }
      _parse(input) {
          return OK(input.data);
      }
  }
  ZodAny.create = (params) => {
      return new ZodAny({
          typeName: ZodFirstPartyTypeKind.ZodAny,
          ...processCreateParams(params),
      });
  };
  class ZodUnknown extends ZodType {
      constructor() {
          super(...arguments);
          // required
          this._unknown = true;
      }
      _parse(input) {
          return OK(input.data);
      }
  }
  ZodUnknown.create = (params) => {
      return new ZodUnknown({
          typeName: ZodFirstPartyTypeKind.ZodUnknown,
          ...processCreateParams(params),
      });
  };
  class ZodNever extends ZodType {
      _parse(input) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.never,
              received: ctx.parsedType,
          });
          return INVALID;
      }
  }
  ZodNever.create = (params) => {
      return new ZodNever({
          typeName: ZodFirstPartyTypeKind.ZodNever,
          ...processCreateParams(params),
      });
  };
  class ZodVoid extends ZodType {
      _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.undefined) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.void,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          return OK(input.data);
      }
  }
  ZodVoid.create = (params) => {
      return new ZodVoid({
          typeName: ZodFirstPartyTypeKind.ZodVoid,
          ...processCreateParams(params),
      });
  };
  class ZodArray extends ZodType {
      _parse(input) {
          const { ctx, status } = this._processInputParams(input);
          const def = this._def;
          if (ctx.parsedType !== ZodParsedType.array) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.array,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          if (def.exactLength !== null) {
              const tooBig = ctx.data.length > def.exactLength.value;
              const tooSmall = ctx.data.length < def.exactLength.value;
              if (tooBig || tooSmall) {
                  addIssueToContext(ctx, {
                      code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
                      minimum: (tooSmall ? def.exactLength.value : undefined),
                      maximum: (tooBig ? def.exactLength.value : undefined),
                      type: "array",
                      inclusive: true,
                      exact: true,
                      message: def.exactLength.message,
                  });
                  status.dirty();
              }
          }
          if (def.minLength !== null) {
              if (ctx.data.length < def.minLength.value) {
                  addIssueToContext(ctx, {
                      code: ZodIssueCode.too_small,
                      minimum: def.minLength.value,
                      type: "array",
                      inclusive: true,
                      exact: false,
                      message: def.minLength.message,
                  });
                  status.dirty();
              }
          }
          if (def.maxLength !== null) {
              if (ctx.data.length > def.maxLength.value) {
                  addIssueToContext(ctx, {
                      code: ZodIssueCode.too_big,
                      maximum: def.maxLength.value,
                      type: "array",
                      inclusive: true,
                      exact: false,
                      message: def.maxLength.message,
                  });
                  status.dirty();
              }
          }
          if (ctx.common.async) {
              return Promise.all([...ctx.data].map((item, i) => {
                  return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
              })).then((result) => {
                  return ParseStatus.mergeArray(status, result);
              });
          }
          const result = [...ctx.data].map((item, i) => {
              return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          });
          return ParseStatus.mergeArray(status, result);
      }
      get element() {
          return this._def.type;
      }
      min(minLength, message) {
          return new ZodArray({
              ...this._def,
              minLength: { value: minLength, message: errorUtil.toString(message) },
          });
      }
      max(maxLength, message) {
          return new ZodArray({
              ...this._def,
              maxLength: { value: maxLength, message: errorUtil.toString(message) },
          });
      }
      length(len, message) {
          return new ZodArray({
              ...this._def,
              exactLength: { value: len, message: errorUtil.toString(message) },
          });
      }
      nonempty(message) {
          return this.min(1, message);
      }
  }
  ZodArray.create = (schema, params) => {
      return new ZodArray({
          type: schema,
          minLength: null,
          maxLength: null,
          exactLength: null,
          typeName: ZodFirstPartyTypeKind.ZodArray,
          ...processCreateParams(params),
      });
  };
  function deepPartialify(schema) {
      if (schema instanceof ZodObject) {
          const newShape = {};
          for (const key in schema.shape) {
              const fieldSchema = schema.shape[key];
              newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
          }
          return new ZodObject({
              ...schema._def,
              shape: () => newShape,
          });
      }
      else if (schema instanceof ZodArray) {
          return new ZodArray({
              ...schema._def,
              type: deepPartialify(schema.element),
          });
      }
      else if (schema instanceof ZodOptional) {
          return ZodOptional.create(deepPartialify(schema.unwrap()));
      }
      else if (schema instanceof ZodNullable) {
          return ZodNullable.create(deepPartialify(schema.unwrap()));
      }
      else if (schema instanceof ZodTuple) {
          return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
      }
      else {
          return schema;
      }
  }
  class ZodObject extends ZodType {
      constructor() {
          super(...arguments);
          this._cached = null;
          /**
           * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
           * If you want to pass through unknown properties, use `.passthrough()` instead.
           */
          this.nonstrict = this.passthrough;
          // extend<
          //   Augmentation extends ZodRawShape,
          //   NewOutput extends util.flatten<{
          //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
          //       ? Augmentation[k]["_output"]
          //       : k extends keyof Output
          //       ? Output[k]
          //       : never;
          //   }>,
          //   NewInput extends util.flatten<{
          //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
          //       ? Augmentation[k]["_input"]
          //       : k extends keyof Input
          //       ? Input[k]
          //       : never;
          //   }>
          // >(
          //   augmentation: Augmentation
          // ): ZodObject<
          //   extendShape<T, Augmentation>,
          //   UnknownKeys,
          //   Catchall,
          //   NewOutput,
          //   NewInput
          // > {
          //   return new ZodObject({
          //     ...this._def,
          //     shape: () => ({
          //       ...this._def.shape(),
          //       ...augmentation,
          //     }),
          //   }) as any;
          // }
          /**
           * @deprecated Use `.extend` instead
           *  */
          this.augment = this.extend;
      }
      _getCached() {
          if (this._cached !== null)
              return this._cached;
          const shape = this._def.shape();
          const keys = util.objectKeys(shape);
          this._cached = { shape, keys };
          return this._cached;
      }
      _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.object) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.object,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          const { status, ctx } = this._processInputParams(input);
          const { shape, keys: shapeKeys } = this._getCached();
          const extraKeys = [];
          if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
              for (const key in ctx.data) {
                  if (!shapeKeys.includes(key)) {
                      extraKeys.push(key);
                  }
              }
          }
          const pairs = [];
          for (const key of shapeKeys) {
              const keyValidator = shape[key];
              const value = ctx.data[key];
              pairs.push({
                  key: { status: "valid", value: key },
                  value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
                  alwaysSet: key in ctx.data,
              });
          }
          if (this._def.catchall instanceof ZodNever) {
              const unknownKeys = this._def.unknownKeys;
              if (unknownKeys === "passthrough") {
                  for (const key of extraKeys) {
                      pairs.push({
                          key: { status: "valid", value: key },
                          value: { status: "valid", value: ctx.data[key] },
                      });
                  }
              }
              else if (unknownKeys === "strict") {
                  if (extraKeys.length > 0) {
                      addIssueToContext(ctx, {
                          code: ZodIssueCode.unrecognized_keys,
                          keys: extraKeys,
                      });
                      status.dirty();
                  }
              }
              else if (unknownKeys === "strip") ;
              else {
                  throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
              }
          }
          else {
              // run catchall validation
              const catchall = this._def.catchall;
              for (const key of extraKeys) {
                  const value = ctx.data[key];
                  pairs.push({
                      key: { status: "valid", value: key },
                      value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                      ),
                      alwaysSet: key in ctx.data,
                  });
              }
          }
          if (ctx.common.async) {
              return Promise.resolve()
                  .then(async () => {
                  const syncPairs = [];
                  for (const pair of pairs) {
                      const key = await pair.key;
                      const value = await pair.value;
                      syncPairs.push({
                          key,
                          value,
                          alwaysSet: pair.alwaysSet,
                      });
                  }
                  return syncPairs;
              })
                  .then((syncPairs) => {
                  return ParseStatus.mergeObjectSync(status, syncPairs);
              });
          }
          else {
              return ParseStatus.mergeObjectSync(status, pairs);
          }
      }
      get shape() {
          return this._def.shape();
      }
      strict(message) {
          errorUtil.errToObj;
          return new ZodObject({
              ...this._def,
              unknownKeys: "strict",
              ...(message !== undefined
                  ? {
                      errorMap: (issue, ctx) => {
                          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
                          if (issue.code === "unrecognized_keys")
                              return {
                                  message: errorUtil.errToObj(message).message ?? defaultError,
                              };
                          return {
                              message: defaultError,
                          };
                      },
                  }
                  : {}),
          });
      }
      strip() {
          return new ZodObject({
              ...this._def,
              unknownKeys: "strip",
          });
      }
      passthrough() {
          return new ZodObject({
              ...this._def,
              unknownKeys: "passthrough",
          });
      }
      // const AugmentFactory =
      //   <Def extends ZodObjectDef>(def: Def) =>
      //   <Augmentation extends ZodRawShape>(
      //     augmentation: Augmentation
      //   ): ZodObject<
      //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
      //     Def["unknownKeys"],
      //     Def["catchall"]
      //   > => {
      //     return new ZodObject({
      //       ...def,
      //       shape: () => ({
      //         ...def.shape(),
      //         ...augmentation,
      //       }),
      //     }) as any;
      //   };
      extend(augmentation) {
          return new ZodObject({
              ...this._def,
              shape: () => ({
                  ...this._def.shape(),
                  ...augmentation,
              }),
          });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
          const merged = new ZodObject({
              unknownKeys: merging._def.unknownKeys,
              catchall: merging._def.catchall,
              shape: () => ({
                  ...this._def.shape(),
                  ...merging._def.shape(),
              }),
              typeName: ZodFirstPartyTypeKind.ZodObject,
          });
          return merged;
      }
      // merge<
      //   Incoming extends AnyZodObject,
      //   Augmentation extends Incoming["shape"],
      //   NewOutput extends {
      //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
      //       ? Augmentation[k]["_output"]
      //       : k extends keyof Output
      //       ? Output[k]
      //       : never;
      //   },
      //   NewInput extends {
      //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
      //       ? Augmentation[k]["_input"]
      //       : k extends keyof Input
      //       ? Input[k]
      //       : never;
      //   }
      // >(
      //   merging: Incoming
      // ): ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"],
      //   NewOutput,
      //   NewInput
      // > {
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      setKey(key, schema) {
          return this.augment({ [key]: schema });
      }
      // merge<Incoming extends AnyZodObject>(
      //   merging: Incoming
      // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
      // ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"]
      // > {
      //   // const mergedShape = objectUtil.mergeShapes(
      //   //   this._def.shape(),
      //   //   merging._def.shape()
      //   // );
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      catchall(index) {
          return new ZodObject({
              ...this._def,
              catchall: index,
          });
      }
      pick(mask) {
          const shape = {};
          for (const key of util.objectKeys(mask)) {
              if (mask[key] && this.shape[key]) {
                  shape[key] = this.shape[key];
              }
          }
          return new ZodObject({
              ...this._def,
              shape: () => shape,
          });
      }
      omit(mask) {
          const shape = {};
          for (const key of util.objectKeys(this.shape)) {
              if (!mask[key]) {
                  shape[key] = this.shape[key];
              }
          }
          return new ZodObject({
              ...this._def,
              shape: () => shape,
          });
      }
      /**
       * @deprecated
       */
      deepPartial() {
          return deepPartialify(this);
      }
      partial(mask) {
          const newShape = {};
          for (const key of util.objectKeys(this.shape)) {
              const fieldSchema = this.shape[key];
              if (mask && !mask[key]) {
                  newShape[key] = fieldSchema;
              }
              else {
                  newShape[key] = fieldSchema.optional();
              }
          }
          return new ZodObject({
              ...this._def,
              shape: () => newShape,
          });
      }
      required(mask) {
          const newShape = {};
          for (const key of util.objectKeys(this.shape)) {
              if (mask && !mask[key]) {
                  newShape[key] = this.shape[key];
              }
              else {
                  const fieldSchema = this.shape[key];
                  let newField = fieldSchema;
                  while (newField instanceof ZodOptional) {
                      newField = newField._def.innerType;
                  }
                  newShape[key] = newField;
              }
          }
          return new ZodObject({
              ...this._def,
              shape: () => newShape,
          });
      }
      keyof() {
          return createZodEnum(util.objectKeys(this.shape));
      }
  }
  ZodObject.create = (shape, params) => {
      return new ZodObject({
          shape: () => shape,
          unknownKeys: "strip",
          catchall: ZodNever.create(),
          typeName: ZodFirstPartyTypeKind.ZodObject,
          ...processCreateParams(params),
      });
  };
  ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
          shape: () => shape,
          unknownKeys: "strict",
          catchall: ZodNever.create(),
          typeName: ZodFirstPartyTypeKind.ZodObject,
          ...processCreateParams(params),
      });
  };
  ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
          shape,
          unknownKeys: "strip",
          catchall: ZodNever.create(),
          typeName: ZodFirstPartyTypeKind.ZodObject,
          ...processCreateParams(params),
      });
  };
  class ZodUnion extends ZodType {
      _parse(input) {
          const { ctx } = this._processInputParams(input);
          const options = this._def.options;
          function handleResults(results) {
              // return first issue-free validation if it exists
              for (const result of results) {
                  if (result.result.status === "valid") {
                      return result.result;
                  }
              }
              for (const result of results) {
                  if (result.result.status === "dirty") {
                      // add issues from dirty option
                      ctx.common.issues.push(...result.ctx.common.issues);
                      return result.result;
                  }
              }
              // return invalid
              const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_union,
                  unionErrors,
              });
              return INVALID;
          }
          if (ctx.common.async) {
              return Promise.all(options.map(async (option) => {
                  const childCtx = {
                      ...ctx,
                      common: {
                          ...ctx.common,
                          issues: [],
                      },
                      parent: null,
                  };
                  return {
                      result: await option._parseAsync({
                          data: ctx.data,
                          path: ctx.path,
                          parent: childCtx,
                      }),
                      ctx: childCtx,
                  };
              })).then(handleResults);
          }
          else {
              let dirty = undefined;
              const issues = [];
              for (const option of options) {
                  const childCtx = {
                      ...ctx,
                      common: {
                          ...ctx.common,
                          issues: [],
                      },
                      parent: null,
                  };
                  const result = option._parseSync({
                      data: ctx.data,
                      path: ctx.path,
                      parent: childCtx,
                  });
                  if (result.status === "valid") {
                      return result;
                  }
                  else if (result.status === "dirty" && !dirty) {
                      dirty = { result, ctx: childCtx };
                  }
                  if (childCtx.common.issues.length) {
                      issues.push(childCtx.common.issues);
                  }
              }
              if (dirty) {
                  ctx.common.issues.push(...dirty.ctx.common.issues);
                  return dirty.result;
              }
              const unionErrors = issues.map((issues) => new ZodError(issues));
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_union,
                  unionErrors,
              });
              return INVALID;
          }
      }
      get options() {
          return this._def.options;
      }
  }
  ZodUnion.create = (types, params) => {
      return new ZodUnion({
          options: types,
          typeName: ZodFirstPartyTypeKind.ZodUnion,
          ...processCreateParams(params),
      });
  };
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  //////////                                 //////////
  //////////      ZodDiscriminatedUnion      //////////
  //////////                                 //////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  const getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
          return getDiscriminator(type.schema);
      }
      else if (type instanceof ZodEffects) {
          return getDiscriminator(type.innerType());
      }
      else if (type instanceof ZodLiteral) {
          return [type.value];
      }
      else if (type instanceof ZodEnum) {
          return type.options;
      }
      else if (type instanceof ZodNativeEnum) {
          // eslint-disable-next-line ban/ban
          return util.objectValues(type.enum);
      }
      else if (type instanceof ZodDefault) {
          return getDiscriminator(type._def.innerType);
      }
      else if (type instanceof ZodUndefined) {
          return [undefined];
      }
      else if (type instanceof ZodNull) {
          return [null];
      }
      else if (type instanceof ZodOptional) {
          return [undefined, ...getDiscriminator(type.unwrap())];
      }
      else if (type instanceof ZodNullable) {
          return [null, ...getDiscriminator(type.unwrap())];
      }
      else if (type instanceof ZodBranded) {
          return getDiscriminator(type.unwrap());
      }
      else if (type instanceof ZodReadonly) {
          return getDiscriminator(type.unwrap());
      }
      else if (type instanceof ZodCatch) {
          return getDiscriminator(type._def.innerType);
      }
      else {
          return [];
      }
  };
  class ZodDiscriminatedUnion extends ZodType {
      _parse(input) {
          const { ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.object) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.object,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          const discriminator = this.discriminator;
          const discriminatorValue = ctx.data[discriminator];
          const option = this.optionsMap.get(discriminatorValue);
          if (!option) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_union_discriminator,
                  options: Array.from(this.optionsMap.keys()),
                  path: [discriminator],
              });
              return INVALID;
          }
          if (ctx.common.async) {
              return option._parseAsync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx,
              });
          }
          else {
              return option._parseSync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx,
              });
          }
      }
      get discriminator() {
          return this._def.discriminator;
      }
      get options() {
          return this._def.options;
      }
      get optionsMap() {
          return this._def.optionsMap;
      }
      /**
       * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
       * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
       * have a different value for each object in the union.
       * @param discriminator the name of the discriminator property
       * @param types an array of object schemas
       * @param params
       */
      static create(discriminator, options, params) {
          // Get all the valid discriminator values
          const optionsMap = new Map();
          // try {
          for (const type of options) {
              const discriminatorValues = getDiscriminator(type.shape[discriminator]);
              if (!discriminatorValues.length) {
                  throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
              }
              for (const value of discriminatorValues) {
                  if (optionsMap.has(value)) {
                      throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                  }
                  optionsMap.set(value, type);
              }
          }
          return new ZodDiscriminatedUnion({
              typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
              discriminator,
              options,
              optionsMap,
              ...processCreateParams(params),
          });
      }
  }
  function mergeValues(a, b) {
      const aType = getParsedType(a);
      const bType = getParsedType(b);
      if (a === b) {
          return { valid: true, data: a };
      }
      else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
          const bKeys = util.objectKeys(b);
          const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
          const newObj = { ...a, ...b };
          for (const key of sharedKeys) {
              const sharedValue = mergeValues(a[key], b[key]);
              if (!sharedValue.valid) {
                  return { valid: false };
              }
              newObj[key] = sharedValue.data;
          }
          return { valid: true, data: newObj };
      }
      else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
          if (a.length !== b.length) {
              return { valid: false };
          }
          const newArray = [];
          for (let index = 0; index < a.length; index++) {
              const itemA = a[index];
              const itemB = b[index];
              const sharedValue = mergeValues(itemA, itemB);
              if (!sharedValue.valid) {
                  return { valid: false };
              }
              newArray.push(sharedValue.data);
          }
          return { valid: true, data: newArray };
      }
      else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
          return { valid: true, data: a };
      }
      else {
          return { valid: false };
      }
  }
  class ZodIntersection extends ZodType {
      _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          const handleParsed = (parsedLeft, parsedRight) => {
              if (isAborted(parsedLeft) || isAborted(parsedRight)) {
                  return INVALID;
              }
              const merged = mergeValues(parsedLeft.value, parsedRight.value);
              if (!merged.valid) {
                  addIssueToContext(ctx, {
                      code: ZodIssueCode.invalid_intersection_types,
                  });
                  return INVALID;
              }
              if (isDirty(parsedLeft) || isDirty(parsedRight)) {
                  status.dirty();
              }
              return { status: status.value, value: merged.data };
          };
          if (ctx.common.async) {
              return Promise.all([
                  this._def.left._parseAsync({
                      data: ctx.data,
                      path: ctx.path,
                      parent: ctx,
                  }),
                  this._def.right._parseAsync({
                      data: ctx.data,
                      path: ctx.path,
                      parent: ctx,
                  }),
              ]).then(([left, right]) => handleParsed(left, right));
          }
          else {
              return handleParsed(this._def.left._parseSync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx,
              }), this._def.right._parseSync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx,
              }));
          }
      }
  }
  ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
          left: left,
          right: right,
          typeName: ZodFirstPartyTypeKind.ZodIntersection,
          ...processCreateParams(params),
      });
  };
  // type ZodTupleItems = [ZodTypeAny, ...ZodTypeAny[]];
  class ZodTuple extends ZodType {
      _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.array) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.array,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          if (ctx.data.length < this._def.items.length) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: this._def.items.length,
                  inclusive: true,
                  exact: false,
                  type: "array",
              });
              return INVALID;
          }
          const rest = this._def.rest;
          if (!rest && ctx.data.length > this._def.items.length) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: this._def.items.length,
                  inclusive: true,
                  exact: false,
                  type: "array",
              });
              status.dirty();
          }
          const items = [...ctx.data]
              .map((item, itemIndex) => {
              const schema = this._def.items[itemIndex] || this._def.rest;
              if (!schema)
                  return null;
              return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
          })
              .filter((x) => !!x); // filter nulls
          if (ctx.common.async) {
              return Promise.all(items).then((results) => {
                  return ParseStatus.mergeArray(status, results);
              });
          }
          else {
              return ParseStatus.mergeArray(status, items);
          }
      }
      get items() {
          return this._def.items;
      }
      rest(rest) {
          return new ZodTuple({
              ...this._def,
              rest,
          });
      }
  }
  ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
          throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
          items: schemas,
          typeName: ZodFirstPartyTypeKind.ZodTuple,
          rest: null,
          ...processCreateParams(params),
      });
  };
  class ZodRecord extends ZodType {
      get keySchema() {
          return this._def.keyType;
      }
      get valueSchema() {
          return this._def.valueType;
      }
      _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.object) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.object,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          const pairs = [];
          const keyType = this._def.keyType;
          const valueType = this._def.valueType;
          for (const key in ctx.data) {
              pairs.push({
                  key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                  value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
                  alwaysSet: key in ctx.data,
              });
          }
          if (ctx.common.async) {
              return ParseStatus.mergeObjectAsync(status, pairs);
          }
          else {
              return ParseStatus.mergeObjectSync(status, pairs);
          }
      }
      get element() {
          return this._def.valueType;
      }
      static create(first, second, third) {
          if (second instanceof ZodType) {
              return new ZodRecord({
                  keyType: first,
                  valueType: second,
                  typeName: ZodFirstPartyTypeKind.ZodRecord,
                  ...processCreateParams(third),
              });
          }
          return new ZodRecord({
              keyType: ZodString.create(),
              valueType: first,
              typeName: ZodFirstPartyTypeKind.ZodRecord,
              ...processCreateParams(second),
          });
      }
  }
  class ZodMap extends ZodType {
      get keySchema() {
          return this._def.keyType;
      }
      get valueSchema() {
          return this._def.valueType;
      }
      _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.map) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.map,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          const keyType = this._def.keyType;
          const valueType = this._def.valueType;
          const pairs = [...ctx.data.entries()].map(([key, value], index) => {
              return {
                  key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                  value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
              };
          });
          if (ctx.common.async) {
              const finalMap = new Map();
              return Promise.resolve().then(async () => {
                  for (const pair of pairs) {
                      const key = await pair.key;
                      const value = await pair.value;
                      if (key.status === "aborted" || value.status === "aborted") {
                          return INVALID;
                      }
                      if (key.status === "dirty" || value.status === "dirty") {
                          status.dirty();
                      }
                      finalMap.set(key.value, value.value);
                  }
                  return { status: status.value, value: finalMap };
              });
          }
          else {
              const finalMap = new Map();
              for (const pair of pairs) {
                  const key = pair.key;
                  const value = pair.value;
                  if (key.status === "aborted" || value.status === "aborted") {
                      return INVALID;
                  }
                  if (key.status === "dirty" || value.status === "dirty") {
                      status.dirty();
                  }
                  finalMap.set(key.value, value.value);
              }
              return { status: status.value, value: finalMap };
          }
      }
  }
  ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
          valueType,
          keyType,
          typeName: ZodFirstPartyTypeKind.ZodMap,
          ...processCreateParams(params),
      });
  };
  class ZodSet extends ZodType {
      _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.set) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.set,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          const def = this._def;
          if (def.minSize !== null) {
              if (ctx.data.size < def.minSize.value) {
                  addIssueToContext(ctx, {
                      code: ZodIssueCode.too_small,
                      minimum: def.minSize.value,
                      type: "set",
                      inclusive: true,
                      exact: false,
                      message: def.minSize.message,
                  });
                  status.dirty();
              }
          }
          if (def.maxSize !== null) {
              if (ctx.data.size > def.maxSize.value) {
                  addIssueToContext(ctx, {
                      code: ZodIssueCode.too_big,
                      maximum: def.maxSize.value,
                      type: "set",
                      inclusive: true,
                      exact: false,
                      message: def.maxSize.message,
                  });
                  status.dirty();
              }
          }
          const valueType = this._def.valueType;
          function finalizeSet(elements) {
              const parsedSet = new Set();
              for (const element of elements) {
                  if (element.status === "aborted")
                      return INVALID;
                  if (element.status === "dirty")
                      status.dirty();
                  parsedSet.add(element.value);
              }
              return { status: status.value, value: parsedSet };
          }
          const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
          if (ctx.common.async) {
              return Promise.all(elements).then((elements) => finalizeSet(elements));
          }
          else {
              return finalizeSet(elements);
          }
      }
      min(minSize, message) {
          return new ZodSet({
              ...this._def,
              minSize: { value: minSize, message: errorUtil.toString(message) },
          });
      }
      max(maxSize, message) {
          return new ZodSet({
              ...this._def,
              maxSize: { value: maxSize, message: errorUtil.toString(message) },
          });
      }
      size(size, message) {
          return this.min(size, message).max(size, message);
      }
      nonempty(message) {
          return this.min(1, message);
      }
  }
  ZodSet.create = (valueType, params) => {
      return new ZodSet({
          valueType,
          minSize: null,
          maxSize: null,
          typeName: ZodFirstPartyTypeKind.ZodSet,
          ...processCreateParams(params),
      });
  };
  class ZodLazy extends ZodType {
      get schema() {
          return this._def.getter();
      }
      _parse(input) {
          const { ctx } = this._processInputParams(input);
          const lazySchema = this._def.getter();
          return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
  }
  ZodLazy.create = (getter, params) => {
      return new ZodLazy({
          getter: getter,
          typeName: ZodFirstPartyTypeKind.ZodLazy,
          ...processCreateParams(params),
      });
  };
  class ZodLiteral extends ZodType {
      _parse(input) {
          if (input.data !== this._def.value) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  received: ctx.data,
                  code: ZodIssueCode.invalid_literal,
                  expected: this._def.value,
              });
              return INVALID;
          }
          return { status: "valid", value: input.data };
      }
      get value() {
          return this._def.value;
      }
  }
  ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
          value: value,
          typeName: ZodFirstPartyTypeKind.ZodLiteral,
          ...processCreateParams(params),
      });
  };
  function createZodEnum(values, params) {
      return new ZodEnum({
          values,
          typeName: ZodFirstPartyTypeKind.ZodEnum,
          ...processCreateParams(params),
      });
  }
  class ZodEnum extends ZodType {
      _parse(input) {
          if (typeof input.data !== "string") {
              const ctx = this._getOrReturnCtx(input);
              const expectedValues = this._def.values;
              addIssueToContext(ctx, {
                  expected: util.joinValues(expectedValues),
                  received: ctx.parsedType,
                  code: ZodIssueCode.invalid_type,
              });
              return INVALID;
          }
          if (!this._cache) {
              this._cache = new Set(this._def.values);
          }
          if (!this._cache.has(input.data)) {
              const ctx = this._getOrReturnCtx(input);
              const expectedValues = this._def.values;
              addIssueToContext(ctx, {
                  received: ctx.data,
                  code: ZodIssueCode.invalid_enum_value,
                  options: expectedValues,
              });
              return INVALID;
          }
          return OK(input.data);
      }
      get options() {
          return this._def.values;
      }
      get enum() {
          const enumValues = {};
          for (const val of this._def.values) {
              enumValues[val] = val;
          }
          return enumValues;
      }
      get Values() {
          const enumValues = {};
          for (const val of this._def.values) {
              enumValues[val] = val;
          }
          return enumValues;
      }
      get Enum() {
          const enumValues = {};
          for (const val of this._def.values) {
              enumValues[val] = val;
          }
          return enumValues;
      }
      extract(values, newDef = this._def) {
          return ZodEnum.create(values, {
              ...this._def,
              ...newDef,
          });
      }
      exclude(values, newDef = this._def) {
          return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
              ...this._def,
              ...newDef,
          });
      }
  }
  ZodEnum.create = createZodEnum;
  class ZodNativeEnum extends ZodType {
      _parse(input) {
          const nativeEnumValues = util.getValidEnumValues(this._def.values);
          const ctx = this._getOrReturnCtx(input);
          if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
              const expectedValues = util.objectValues(nativeEnumValues);
              addIssueToContext(ctx, {
                  expected: util.joinValues(expectedValues),
                  received: ctx.parsedType,
                  code: ZodIssueCode.invalid_type,
              });
              return INVALID;
          }
          if (!this._cache) {
              this._cache = new Set(util.getValidEnumValues(this._def.values));
          }
          if (!this._cache.has(input.data)) {
              const expectedValues = util.objectValues(nativeEnumValues);
              addIssueToContext(ctx, {
                  received: ctx.data,
                  code: ZodIssueCode.invalid_enum_value,
                  options: expectedValues,
              });
              return INVALID;
          }
          return OK(input.data);
      }
      get enum() {
          return this._def.values;
      }
  }
  ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
          values: values,
          typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
          ...processCreateParams(params),
      });
  };
  class ZodPromise extends ZodType {
      unwrap() {
          return this._def.type;
      }
      _parse(input) {
          const { ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.promise,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
          return OK(promisified.then((data) => {
              return this._def.type.parseAsync(data, {
                  path: ctx.path,
                  errorMap: ctx.common.contextualErrorMap,
              });
          }));
      }
  }
  ZodPromise.create = (schema, params) => {
      return new ZodPromise({
          type: schema,
          typeName: ZodFirstPartyTypeKind.ZodPromise,
          ...processCreateParams(params),
      });
  };
  class ZodEffects extends ZodType {
      innerType() {
          return this._def.schema;
      }
      sourceType() {
          return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
              ? this._def.schema.sourceType()
              : this._def.schema;
      }
      _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          const effect = this._def.effect || null;
          const checkCtx = {
              addIssue: (arg) => {
                  addIssueToContext(ctx, arg);
                  if (arg.fatal) {
                      status.abort();
                  }
                  else {
                      status.dirty();
                  }
              },
              get path() {
                  return ctx.path;
              },
          };
          checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
          if (effect.type === "preprocess") {
              const processed = effect.transform(ctx.data, checkCtx);
              if (ctx.common.async) {
                  return Promise.resolve(processed).then(async (processed) => {
                      if (status.value === "aborted")
                          return INVALID;
                      const result = await this._def.schema._parseAsync({
                          data: processed,
                          path: ctx.path,
                          parent: ctx,
                      });
                      if (result.status === "aborted")
                          return INVALID;
                      if (result.status === "dirty")
                          return DIRTY(result.value);
                      if (status.value === "dirty")
                          return DIRTY(result.value);
                      return result;
                  });
              }
              else {
                  if (status.value === "aborted")
                      return INVALID;
                  const result = this._def.schema._parseSync({
                      data: processed,
                      path: ctx.path,
                      parent: ctx,
                  });
                  if (result.status === "aborted")
                      return INVALID;
                  if (result.status === "dirty")
                      return DIRTY(result.value);
                  if (status.value === "dirty")
                      return DIRTY(result.value);
                  return result;
              }
          }
          if (effect.type === "refinement") {
              const executeRefinement = (acc) => {
                  const result = effect.refinement(acc, checkCtx);
                  if (ctx.common.async) {
                      return Promise.resolve(result);
                  }
                  if (result instanceof Promise) {
                      throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                  }
                  return acc;
              };
              if (ctx.common.async === false) {
                  const inner = this._def.schema._parseSync({
                      data: ctx.data,
                      path: ctx.path,
                      parent: ctx,
                  });
                  if (inner.status === "aborted")
                      return INVALID;
                  if (inner.status === "dirty")
                      status.dirty();
                  // return value is ignored
                  executeRefinement(inner.value);
                  return { status: status.value, value: inner.value };
              }
              else {
                  return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
                      if (inner.status === "aborted")
                          return INVALID;
                      if (inner.status === "dirty")
                          status.dirty();
                      return executeRefinement(inner.value).then(() => {
                          return { status: status.value, value: inner.value };
                      });
                  });
              }
          }
          if (effect.type === "transform") {
              if (ctx.common.async === false) {
                  const base = this._def.schema._parseSync({
                      data: ctx.data,
                      path: ctx.path,
                      parent: ctx,
                  });
                  if (!isValid(base))
                      return INVALID;
                  const result = effect.transform(base.value, checkCtx);
                  if (result instanceof Promise) {
                      throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                  }
                  return { status: status.value, value: result };
              }
              else {
                  return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
                      if (!isValid(base))
                          return INVALID;
                      return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
                          status: status.value,
                          value: result,
                      }));
                  });
              }
          }
          util.assertNever(effect);
      }
  }
  ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
          schema,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect,
          ...processCreateParams(params),
      });
  };
  ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
          schema,
          effect: { type: "preprocess", transform: preprocess },
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          ...processCreateParams(params),
      });
  };
  class ZodOptional extends ZodType {
      _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType === ZodParsedType.undefined) {
              return OK(undefined);
          }
          return this._def.innerType._parse(input);
      }
      unwrap() {
          return this._def.innerType;
      }
  }
  ZodOptional.create = (type, params) => {
      return new ZodOptional({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodOptional,
          ...processCreateParams(params),
      });
  };
  class ZodNullable extends ZodType {
      _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType === ZodParsedType.null) {
              return OK(null);
          }
          return this._def.innerType._parse(input);
      }
      unwrap() {
          return this._def.innerType;
      }
  }
  ZodNullable.create = (type, params) => {
      return new ZodNullable({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodNullable,
          ...processCreateParams(params),
      });
  };
  class ZodDefault extends ZodType {
      _parse(input) {
          const { ctx } = this._processInputParams(input);
          let data = ctx.data;
          if (ctx.parsedType === ZodParsedType.undefined) {
              data = this._def.defaultValue();
          }
          return this._def.innerType._parse({
              data,
              path: ctx.path,
              parent: ctx,
          });
      }
      removeDefault() {
          return this._def.innerType;
      }
  }
  ZodDefault.create = (type, params) => {
      return new ZodDefault({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodDefault,
          defaultValue: typeof params.default === "function" ? params.default : () => params.default,
          ...processCreateParams(params),
      });
  };
  class ZodCatch extends ZodType {
      _parse(input) {
          const { ctx } = this._processInputParams(input);
          // newCtx is used to not collect issues from inner types in ctx
          const newCtx = {
              ...ctx,
              common: {
                  ...ctx.common,
                  issues: [],
              },
          };
          const result = this._def.innerType._parse({
              data: newCtx.data,
              path: newCtx.path,
              parent: {
                  ...newCtx,
              },
          });
          if (isAsync(result)) {
              return result.then((result) => {
                  return {
                      status: "valid",
                      value: result.status === "valid"
                          ? result.value
                          : this._def.catchValue({
                              get error() {
                                  return new ZodError(newCtx.common.issues);
                              },
                              input: newCtx.data,
                          }),
                  };
              });
          }
          else {
              return {
                  status: "valid",
                  value: result.status === "valid"
                      ? result.value
                      : this._def.catchValue({
                          get error() {
                              return new ZodError(newCtx.common.issues);
                          },
                          input: newCtx.data,
                      }),
              };
          }
      }
      removeCatch() {
          return this._def.innerType;
      }
  }
  ZodCatch.create = (type, params) => {
      return new ZodCatch({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodCatch,
          catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
          ...processCreateParams(params),
      });
  };
  class ZodNaN extends ZodType {
      _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.nan) {
              const ctx = this._getOrReturnCtx(input);
              addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: ZodParsedType.nan,
                  received: ctx.parsedType,
              });
              return INVALID;
          }
          return { status: "valid", value: input.data };
      }
  }
  ZodNaN.create = (params) => {
      return new ZodNaN({
          typeName: ZodFirstPartyTypeKind.ZodNaN,
          ...processCreateParams(params),
      });
  };
  class ZodBranded extends ZodType {
      _parse(input) {
          const { ctx } = this._processInputParams(input);
          const data = ctx.data;
          return this._def.type._parse({
              data,
              path: ctx.path,
              parent: ctx,
          });
      }
      unwrap() {
          return this._def.type;
      }
  }
  class ZodPipeline extends ZodType {
      _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.common.async) {
              const handleAsync = async () => {
                  const inResult = await this._def.in._parseAsync({
                      data: ctx.data,
                      path: ctx.path,
                      parent: ctx,
                  });
                  if (inResult.status === "aborted")
                      return INVALID;
                  if (inResult.status === "dirty") {
                      status.dirty();
                      return DIRTY(inResult.value);
                  }
                  else {
                      return this._def.out._parseAsync({
                          data: inResult.value,
                          path: ctx.path,
                          parent: ctx,
                      });
                  }
              };
              return handleAsync();
          }
          else {
              const inResult = this._def.in._parseSync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx,
              });
              if (inResult.status === "aborted")
                  return INVALID;
              if (inResult.status === "dirty") {
                  status.dirty();
                  return {
                      status: "dirty",
                      value: inResult.value,
                  };
              }
              else {
                  return this._def.out._parseSync({
                      data: inResult.value,
                      path: ctx.path,
                      parent: ctx,
                  });
              }
          }
      }
      static create(a, b) {
          return new ZodPipeline({
              in: a,
              out: b,
              typeName: ZodFirstPartyTypeKind.ZodPipeline,
          });
      }
  }
  class ZodReadonly extends ZodType {
      _parse(input) {
          const result = this._def.innerType._parse(input);
          const freeze = (data) => {
              if (isValid(data)) {
                  data.value = Object.freeze(data.value);
              }
              return data;
          };
          return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
      }
      unwrap() {
          return this._def.innerType;
      }
  }
  ZodReadonly.create = (type, params) => {
      return new ZodReadonly({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodReadonly,
          ...processCreateParams(params),
      });
  };
  ////////////////////////////////////////
  ////////////////////////////////////////
  //////////                    //////////
  //////////      z.custom      //////////
  //////////                    //////////
  ////////////////////////////////////////
  ////////////////////////////////////////
  function cleanParams(params, data) {
      const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
      const p2 = typeof p === "string" ? { message: p } : p;
      return p2;
  }
  function custom(check, _params = {}, 
  /**
   * @deprecated
   *
   * Pass `fatal` into the params object instead:
   *
   * ```ts
   * z.string().custom((val) => val.length > 5, { fatal: false })
   * ```
   *
   */
  fatal) {
      if (check)
          return ZodAny.create().superRefine((data, ctx) => {
              const r = check(data);
              if (r instanceof Promise) {
                  return r.then((r) => {
                      if (!r) {
                          const params = cleanParams(_params, data);
                          const _fatal = params.fatal ?? fatal ?? true;
                          ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
                      }
                  });
              }
              if (!r) {
                  const params = cleanParams(_params, data);
                  const _fatal = params.fatal ?? fatal ?? true;
                  ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
              }
              return;
          });
      return ZodAny.create();
  }
  var ZodFirstPartyTypeKind;
  (function (ZodFirstPartyTypeKind) {
      ZodFirstPartyTypeKind["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
      ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
  const instanceOfType = (
  // const instanceOfType = <T extends new (...args: any[]) => any>(
  cls, params = {
      message: `Input not instance of ${cls.name}`,
  }) => custom((data) => data instanceof cls, params);
  const stringType = ZodString.create;
  const numberType = ZodNumber.create;
  const booleanType = ZodBoolean.create;
  const nullType = ZodNull.create;
  const anyType = ZodAny.create;
  const unknownType = ZodUnknown.create;
  ZodNever.create;
  const arrayType = ZodArray.create;
  const objectType = ZodObject.create;
  const unionType = ZodUnion.create;
  const discriminatedUnionType = ZodDiscriminatedUnion.create;
  ZodIntersection.create;
  const tupleType = ZodTuple.create;
  const recordType = ZodRecord.create;
  const lazyType = ZodLazy.create;
  const literalType = ZodLiteral.create;
  const enumType = ZodEnum.create;
  ZodPromise.create;
  const optionalType = ZodOptional.create;
  ZodNullable.create;

  function parseAnyDef(refs) {
      if (refs.target !== "openAi") {
          return {};
      }
      const anyDefinitionPath = [
          ...refs.basePath,
          refs.definitionPath,
          refs.openAiAnyTypeName,
      ];
      refs.flags.hasReferencedOpenAiAnyType = true;
      return {
          $ref: refs.$refStrategy === "relative"
              ? getRelativePath(anyDefinitionPath, refs.currentPath)
              : anyDefinitionPath.join("/"),
      };
  }

  function parseArrayDef(def, refs) {
      const res = {
          type: "array",
      };
      if (def.type?._def &&
          def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
          res.items = parseDef(def.type._def, {
              ...refs,
              currentPath: [...refs.currentPath, "items"],
          });
      }
      if (def.minLength) {
          setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
      }
      if (def.maxLength) {
          setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
      }
      if (def.exactLength) {
          setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
          setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
      }
      return res;
  }

  function parseBigintDef(def, refs) {
      const res = {
          type: "integer",
          format: "int64",
      };
      if (!def.checks)
          return res;
      for (const check of def.checks) {
          switch (check.kind) {
              case "min":
                  if (refs.target === "jsonSchema7") {
                      if (check.inclusive) {
                          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                      }
                      else {
                          setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
                      }
                  }
                  else {
                      if (!check.inclusive) {
                          res.exclusiveMinimum = true;
                      }
                      setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                  }
                  break;
              case "max":
                  if (refs.target === "jsonSchema7") {
                      if (check.inclusive) {
                          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                      }
                      else {
                          setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
                      }
                  }
                  else {
                      if (!check.inclusive) {
                          res.exclusiveMaximum = true;
                      }
                      setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                  }
                  break;
              case "multipleOf":
                  setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
                  break;
          }
      }
      return res;
  }

  function parseBooleanDef() {
      return {
          type: "boolean",
      };
  }

  function parseBrandedDef(_def, refs) {
      return parseDef(_def.type._def, refs);
  }

  const parseCatchDef = (def, refs) => {
      return parseDef(def.innerType._def, refs);
  };

  function parseDateDef(def, refs, overrideDateStrategy) {
      const strategy = overrideDateStrategy ?? refs.dateStrategy;
      if (Array.isArray(strategy)) {
          return {
              anyOf: strategy.map((item, i) => parseDateDef(def, refs, item)),
          };
      }
      switch (strategy) {
          case "string":
          case "format:date-time":
              return {
                  type: "string",
                  format: "date-time",
              };
          case "format:date":
              return {
                  type: "string",
                  format: "date",
              };
          case "integer":
              return integerDateParser(def, refs);
      }
  }
  const integerDateParser = (def, refs) => {
      const res = {
          type: "integer",
          format: "unix-time",
      };
      if (refs.target === "openApi3") {
          return res;
      }
      for (const check of def.checks) {
          switch (check.kind) {
              case "min":
                  setResponseValueAndErrors(res, "minimum", check.value, // This is in milliseconds
                  check.message, refs);
                  break;
              case "max":
                  setResponseValueAndErrors(res, "maximum", check.value, // This is in milliseconds
                  check.message, refs);
                  break;
          }
      }
      return res;
  };

  function parseDefaultDef(_def, refs) {
      return {
          ...parseDef(_def.innerType._def, refs),
          default: _def.defaultValue(),
      };
  }

  function parseEffectsDef(_def, refs) {
      return refs.effectStrategy === "input"
          ? parseDef(_def.schema._def, refs)
          : parseAnyDef(refs);
  }

  function parseEnumDef(def) {
      return {
          type: "string",
          enum: Array.from(def.values),
      };
  }

  const isJsonSchema7AllOfType = (type) => {
      if ("type" in type && type.type === "string")
          return false;
      return "allOf" in type;
  };
  function parseIntersectionDef(def, refs) {
      const allOf = [
          parseDef(def.left._def, {
              ...refs,
              currentPath: [...refs.currentPath, "allOf", "0"],
          }),
          parseDef(def.right._def, {
              ...refs,
              currentPath: [...refs.currentPath, "allOf", "1"],
          }),
      ].filter((x) => !!x);
      let unevaluatedProperties = refs.target === "jsonSchema2019-09"
          ? { unevaluatedProperties: false }
          : undefined;
      const mergedAllOf = [];
      // If either of the schemas is an allOf, merge them into a single allOf
      allOf.forEach((schema) => {
          if (isJsonSchema7AllOfType(schema)) {
              mergedAllOf.push(...schema.allOf);
              if (schema.unevaluatedProperties === undefined) {
                  // If one of the schemas has no unevaluatedProperties set,
                  // the merged schema should also have no unevaluatedProperties set
                  unevaluatedProperties = undefined;
              }
          }
          else {
              let nestedSchema = schema;
              if ("additionalProperties" in schema &&
                  schema.additionalProperties === false) {
                  const { additionalProperties, ...rest } = schema;
                  nestedSchema = rest;
              }
              else {
                  // As soon as one of the schemas has additionalProperties set not to false, we allow unevaluatedProperties
                  unevaluatedProperties = undefined;
              }
              mergedAllOf.push(nestedSchema);
          }
      });
      return mergedAllOf.length
          ? {
              allOf: mergedAllOf,
              ...unevaluatedProperties,
          }
          : undefined;
  }

  function parseLiteralDef(def, refs) {
      const parsedType = typeof def.value;
      if (parsedType !== "bigint" &&
          parsedType !== "number" &&
          parsedType !== "boolean" &&
          parsedType !== "string") {
          return {
              type: Array.isArray(def.value) ? "array" : "object",
          };
      }
      if (refs.target === "openApi3") {
          return {
              type: parsedType === "bigint" ? "integer" : parsedType,
              enum: [def.value],
          };
      }
      return {
          type: parsedType === "bigint" ? "integer" : parsedType,
          const: def.value,
      };
  }

  let emojiRegex = undefined;
  /**
   * Generated from the regular expressions found here as of 2024-05-22:
   * https://github.com/colinhacks/zod/blob/master/src/types.ts.
   *
   * Expressions with /i flag have been changed accordingly.
   */
  const zodPatterns = {
      /**
       * `c` was changed to `[cC]` to replicate /i flag
       */
      cuid: /^[cC][^\s-]{8,}$/,
      cuid2: /^[0-9a-z]+$/,
      ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
      /**
       * `a-z` was added to replicate /i flag
       */
      email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
      /**
       * Constructed a valid Unicode RegExp
       *
       * Lazily instantiate since this type of regex isn't supported
       * in all envs (e.g. React Native).
       *
       * See:
       * https://github.com/colinhacks/zod/issues/2433
       * Fix in Zod:
       * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
       */
      emoji: () => {
          if (emojiRegex === undefined) {
              emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
          }
          return emojiRegex;
      },
      /**
       * Unused
       */
      uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
      /**
       * Unused
       */
      ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
      ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
      /**
       * Unused
       */
      ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
      ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
      base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
      base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
      nanoid: /^[a-zA-Z0-9_-]{21}$/,
      jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  };
  function parseStringDef(def, refs) {
      const res = {
          type: "string",
      };
      if (def.checks) {
          for (const check of def.checks) {
              switch (check.kind) {
                  case "min":
                      setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number"
                          ? Math.max(res.minLength, check.value)
                          : check.value, check.message, refs);
                      break;
                  case "max":
                      setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number"
                          ? Math.min(res.maxLength, check.value)
                          : check.value, check.message, refs);
                      break;
                  case "email":
                      switch (refs.emailStrategy) {
                          case "format:email":
                              addFormat(res, "email", check.message, refs);
                              break;
                          case "format:idn-email":
                              addFormat(res, "idn-email", check.message, refs);
                              break;
                          case "pattern:zod":
                              addPattern(res, zodPatterns.email, check.message, refs);
                              break;
                      }
                      break;
                  case "url":
                      addFormat(res, "uri", check.message, refs);
                      break;
                  case "uuid":
                      addFormat(res, "uuid", check.message, refs);
                      break;
                  case "regex":
                      addPattern(res, check.regex, check.message, refs);
                      break;
                  case "cuid":
                      addPattern(res, zodPatterns.cuid, check.message, refs);
                      break;
                  case "cuid2":
                      addPattern(res, zodPatterns.cuid2, check.message, refs);
                      break;
                  case "startsWith":
                      addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
                      break;
                  case "endsWith":
                      addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
                      break;
                  case "datetime":
                      addFormat(res, "date-time", check.message, refs);
                      break;
                  case "date":
                      addFormat(res, "date", check.message, refs);
                      break;
                  case "time":
                      addFormat(res, "time", check.message, refs);
                      break;
                  case "duration":
                      addFormat(res, "duration", check.message, refs);
                      break;
                  case "length":
                      setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number"
                          ? Math.max(res.minLength, check.value)
                          : check.value, check.message, refs);
                      setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number"
                          ? Math.min(res.maxLength, check.value)
                          : check.value, check.message, refs);
                      break;
                  case "includes": {
                      addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
                      break;
                  }
                  case "ip": {
                      if (check.version !== "v6") {
                          addFormat(res, "ipv4", check.message, refs);
                      }
                      if (check.version !== "v4") {
                          addFormat(res, "ipv6", check.message, refs);
                      }
                      break;
                  }
                  case "base64url":
                      addPattern(res, zodPatterns.base64url, check.message, refs);
                      break;
                  case "jwt":
                      addPattern(res, zodPatterns.jwt, check.message, refs);
                      break;
                  case "cidr": {
                      if (check.version !== "v6") {
                          addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
                      }
                      if (check.version !== "v4") {
                          addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
                      }
                      break;
                  }
                  case "emoji":
                      addPattern(res, zodPatterns.emoji(), check.message, refs);
                      break;
                  case "ulid": {
                      addPattern(res, zodPatterns.ulid, check.message, refs);
                      break;
                  }
                  case "base64": {
                      switch (refs.base64Strategy) {
                          case "format:binary": {
                              addFormat(res, "binary", check.message, refs);
                              break;
                          }
                          case "contentEncoding:base64": {
                              setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
                              break;
                          }
                          case "pattern:zod": {
                              addPattern(res, zodPatterns.base64, check.message, refs);
                              break;
                          }
                      }
                      break;
                  }
                  case "nanoid": {
                      addPattern(res, zodPatterns.nanoid, check.message, refs);
                  }
              }
          }
      }
      return res;
  }
  function escapeLiteralCheckValue(literal, refs) {
      return refs.patternStrategy === "escape"
          ? escapeNonAlphaNumeric(literal)
          : literal;
  }
  const ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
  function escapeNonAlphaNumeric(source) {
      let result = "";
      for (let i = 0; i < source.length; i++) {
          if (!ALPHA_NUMERIC.has(source[i])) {
              result += "\\";
          }
          result += source[i];
      }
      return result;
  }
  // Adds a "format" keyword to the schema. If a format exists, both formats will be joined in an allOf-node, along with subsequent ones.
  function addFormat(schema, value, message, refs) {
      if (schema.format || schema.anyOf?.some((x) => x.format)) {
          if (!schema.anyOf) {
              schema.anyOf = [];
          }
          if (schema.format) {
              schema.anyOf.push({
                  format: schema.format,
                  ...(schema.errorMessage &&
                      refs.errorMessages && {
                      errorMessage: { format: schema.errorMessage.format },
                  }),
              });
              delete schema.format;
              if (schema.errorMessage) {
                  delete schema.errorMessage.format;
                  if (Object.keys(schema.errorMessage).length === 0) {
                      delete schema.errorMessage;
                  }
              }
          }
          schema.anyOf.push({
              format: value,
              ...(message &&
                  refs.errorMessages && { errorMessage: { format: message } }),
          });
      }
      else {
          setResponseValueAndErrors(schema, "format", value, message, refs);
      }
  }
  // Adds a "pattern" keyword to the schema. If a pattern exists, both patterns will be joined in an allOf-node, along with subsequent ones.
  function addPattern(schema, regex, message, refs) {
      if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
          if (!schema.allOf) {
              schema.allOf = [];
          }
          if (schema.pattern) {
              schema.allOf.push({
                  pattern: schema.pattern,
                  ...(schema.errorMessage &&
                      refs.errorMessages && {
                      errorMessage: { pattern: schema.errorMessage.pattern },
                  }),
              });
              delete schema.pattern;
              if (schema.errorMessage) {
                  delete schema.errorMessage.pattern;
                  if (Object.keys(schema.errorMessage).length === 0) {
                      delete schema.errorMessage;
                  }
              }
          }
          schema.allOf.push({
              pattern: stringifyRegExpWithFlags(regex, refs),
              ...(message &&
                  refs.errorMessages && { errorMessage: { pattern: message } }),
          });
      }
      else {
          setResponseValueAndErrors(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
      }
  }
  // Mutate z.string.regex() in a best attempt to accommodate for regex flags when applyRegexFlags is true
  function stringifyRegExpWithFlags(regex, refs) {
      if (!refs.applyRegexFlags || !regex.flags) {
          return regex.source;
      }
      // Currently handled flags
      const flags = {
          i: regex.flags.includes("i"),
          m: regex.flags.includes("m"),
          s: regex.flags.includes("s"), // `.` matches newlines
      };
      // The general principle here is to step through each character, one at a time, applying mutations as flags require. We keep track when the current character is escaped, and when it's inside a group /like [this]/ or (also) a range like /[a-z]/. The following is fairly brittle imperative code; edit at your peril!
      const source = flags.i ? regex.source.toLowerCase() : regex.source;
      let pattern = "";
      let isEscaped = false;
      let inCharGroup = false;
      let inCharRange = false;
      for (let i = 0; i < source.length; i++) {
          if (isEscaped) {
              pattern += source[i];
              isEscaped = false;
              continue;
          }
          if (flags.i) {
              if (inCharGroup) {
                  if (source[i].match(/[a-z]/)) {
                      if (inCharRange) {
                          pattern += source[i];
                          pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
                          inCharRange = false;
                      }
                      else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
                          pattern += source[i];
                          inCharRange = true;
                      }
                      else {
                          pattern += `${source[i]}${source[i].toUpperCase()}`;
                      }
                      continue;
                  }
              }
              else if (source[i].match(/[a-z]/)) {
                  pattern += `[${source[i]}${source[i].toUpperCase()}]`;
                  continue;
              }
          }
          if (flags.m) {
              if (source[i] === "^") {
                  pattern += `(^|(?<=[\r\n]))`;
                  continue;
              }
              else if (source[i] === "$") {
                  pattern += `($|(?=[\r\n]))`;
                  continue;
              }
          }
          if (flags.s && source[i] === ".") {
              pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
              continue;
          }
          pattern += source[i];
          if (source[i] === "\\") {
              isEscaped = true;
          }
          else if (inCharGroup && source[i] === "]") {
              inCharGroup = false;
          }
          else if (!inCharGroup && source[i] === "[") {
              inCharGroup = true;
          }
      }
      try {
          new RegExp(pattern);
      }
      catch {
          console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
          return regex.source;
      }
      return pattern;
  }

  function parseRecordDef(def, refs) {
      if (refs.target === "openAi") {
          console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
      }
      if (refs.target === "openApi3" &&
          def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
          return {
              type: "object",
              required: def.keyType._def.values,
              properties: def.keyType._def.values.reduce((acc, key) => ({
                  ...acc,
                  [key]: parseDef(def.valueType._def, {
                      ...refs,
                      currentPath: [...refs.currentPath, "properties", key],
                  }) ?? parseAnyDef(refs),
              }), {}),
              additionalProperties: refs.rejectedAdditionalProperties,
          };
      }
      const schema = {
          type: "object",
          additionalProperties: parseDef(def.valueType._def, {
              ...refs,
              currentPath: [...refs.currentPath, "additionalProperties"],
          }) ?? refs.allowedAdditionalProperties,
      };
      if (refs.target === "openApi3") {
          return schema;
      }
      if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString &&
          def.keyType._def.checks?.length) {
          const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
          return {
              ...schema,
              propertyNames: keyType,
          };
      }
      else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
          return {
              ...schema,
              propertyNames: {
                  enum: def.keyType._def.values,
              },
          };
      }
      else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded &&
          def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString &&
          def.keyType._def.type._def.checks?.length) {
          const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
          return {
              ...schema,
              propertyNames: keyType,
          };
      }
      return schema;
  }

  function parseMapDef(def, refs) {
      if (refs.mapStrategy === "record") {
          return parseRecordDef(def, refs);
      }
      const keys = parseDef(def.keyType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", "items", "0"],
      }) || parseAnyDef(refs);
      const values = parseDef(def.valueType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", "items", "1"],
      }) || parseAnyDef(refs);
      return {
          type: "array",
          maxItems: 125,
          items: {
              type: "array",
              items: [keys, values],
              minItems: 2,
              maxItems: 2,
          },
      };
  }

  function parseNativeEnumDef(def) {
      const object = def.values;
      const actualKeys = Object.keys(def.values).filter((key) => {
          return typeof object[object[key]] !== "number";
      });
      const actualValues = actualKeys.map((key) => object[key]);
      const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
      return {
          type: parsedTypes.length === 1
              ? parsedTypes[0] === "string"
                  ? "string"
                  : "number"
              : ["string", "number"],
          enum: actualValues,
      };
  }

  function parseNeverDef(refs) {
      return refs.target === "openAi"
          ? undefined
          : {
              not: parseAnyDef({
                  ...refs,
                  currentPath: [...refs.currentPath, "not"],
              }),
          };
  }

  function parseNullDef(refs) {
      return refs.target === "openApi3"
          ? {
              enum: ["null"],
              nullable: true,
          }
          : {
              type: "null",
          };
  }

  const primitiveMappings = {
      ZodString: "string",
      ZodNumber: "number",
      ZodBigInt: "integer",
      ZodBoolean: "boolean",
      ZodNull: "null",
  };
  function parseUnionDef(def, refs) {
      if (refs.target === "openApi3")
          return asAnyOf(def, refs);
      const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
      // This blocks tries to look ahead a bit to produce nicer looking schemas with type array instead of anyOf.
      if (options.every((x) => x._def.typeName in primitiveMappings &&
          (!x._def.checks || !x._def.checks.length))) {
          // all types in union are primitive and lack checks, so might as well squash into {type: [...]}
          const types = options.reduce((types, x) => {
              const type = primitiveMappings[x._def.typeName]; //Can be safely casted due to row 43
              return type && !types.includes(type) ? [...types, type] : types;
          }, []);
          return {
              type: types.length > 1 ? types : types[0],
          };
      }
      else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
          // all options literals
          const types = options.reduce((acc, x) => {
              const type = typeof x._def.value;
              switch (type) {
                  case "string":
                  case "number":
                  case "boolean":
                      return [...acc, type];
                  case "bigint":
                      return [...acc, "integer"];
                  case "object":
                      if (x._def.value === null)
                          return [...acc, "null"];
                  case "symbol":
                  case "undefined":
                  case "function":
                  default:
                      return acc;
              }
          }, []);
          if (types.length === options.length) {
              // all the literals are primitive, as far as null can be considered primitive
              const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
              return {
                  type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
                  enum: options.reduce((acc, x) => {
                      return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
                  }, []),
              };
          }
      }
      else if (options.every((x) => x._def.typeName === "ZodEnum")) {
          return {
              type: "string",
              enum: options.reduce((acc, x) => [
                  ...acc,
                  ...x._def.values.filter((x) => !acc.includes(x)),
              ], []),
          };
      }
      return asAnyOf(def, refs);
  }
  const asAnyOf = (def, refs) => {
      const anyOf = (def.options instanceof Map
          ? Array.from(def.options.values())
          : def.options)
          .map((x, i) => parseDef(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "anyOf", `${i}`],
      }))
          .filter((x) => !!x &&
          (!refs.strictUnions ||
              (typeof x === "object" && Object.keys(x).length > 0)));
      return anyOf.length ? { anyOf } : undefined;
  };

  function parseNullableDef(def, refs) {
      if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) &&
          (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
          if (refs.target === "openApi3") {
              return {
                  type: primitiveMappings[def.innerType._def.typeName],
                  nullable: true,
              };
          }
          return {
              type: [
                  primitiveMappings[def.innerType._def.typeName],
                  "null",
              ],
          };
      }
      if (refs.target === "openApi3") {
          const base = parseDef(def.innerType._def, {
              ...refs,
              currentPath: [...refs.currentPath],
          });
          if (base && "$ref" in base)
              return { allOf: [base], nullable: true };
          return base && { ...base, nullable: true };
      }
      const base = parseDef(def.innerType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "anyOf", "0"],
      });
      return base && { anyOf: [base, { type: "null" }] };
  }

  function parseNumberDef(def, refs) {
      const res = {
          type: "number",
      };
      if (!def.checks)
          return res;
      for (const check of def.checks) {
          switch (check.kind) {
              case "int":
                  res.type = "integer";
                  addErrorMessage(res, "type", check.message, refs);
                  break;
              case "min":
                  if (refs.target === "jsonSchema7") {
                      if (check.inclusive) {
                          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                      }
                      else {
                          setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
                      }
                  }
                  else {
                      if (!check.inclusive) {
                          res.exclusiveMinimum = true;
                      }
                      setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                  }
                  break;
              case "max":
                  if (refs.target === "jsonSchema7") {
                      if (check.inclusive) {
                          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                      }
                      else {
                          setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
                      }
                  }
                  else {
                      if (!check.inclusive) {
                          res.exclusiveMaximum = true;
                      }
                      setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                  }
                  break;
              case "multipleOf":
                  setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
                  break;
          }
      }
      return res;
  }

  function parseObjectDef(def, refs) {
      const forceOptionalIntoNullable = refs.target === "openAi";
      const result = {
          type: "object",
          properties: {},
      };
      const required = [];
      const shape = def.shape();
      for (const propName in shape) {
          let propDef = shape[propName];
          if (propDef === undefined || propDef._def === undefined) {
              continue;
          }
          let propOptional = safeIsOptional(propDef);
          if (propOptional && forceOptionalIntoNullable) {
              if (propDef._def.typeName === "ZodOptional") {
                  propDef = propDef._def.innerType;
              }
              if (!propDef.isNullable()) {
                  propDef = propDef.nullable();
              }
              propOptional = false;
          }
          const parsedDef = parseDef(propDef._def, {
              ...refs,
              currentPath: [...refs.currentPath, "properties", propName],
              propertyPath: [...refs.currentPath, "properties", propName],
          });
          if (parsedDef === undefined) {
              continue;
          }
          result.properties[propName] = parsedDef;
          if (!propOptional) {
              required.push(propName);
          }
      }
      if (required.length) {
          result.required = required;
      }
      const additionalProperties = decideAdditionalProperties(def, refs);
      if (additionalProperties !== undefined) {
          result.additionalProperties = additionalProperties;
      }
      return result;
  }
  function decideAdditionalProperties(def, refs) {
      if (def.catchall._def.typeName !== "ZodNever") {
          return parseDef(def.catchall._def, {
              ...refs,
              currentPath: [...refs.currentPath, "additionalProperties"],
          });
      }
      switch (def.unknownKeys) {
          case "passthrough":
              return refs.allowedAdditionalProperties;
          case "strict":
              return refs.rejectedAdditionalProperties;
          case "strip":
              return refs.removeAdditionalStrategy === "strict"
                  ? refs.allowedAdditionalProperties
                  : refs.rejectedAdditionalProperties;
      }
  }
  function safeIsOptional(schema) {
      try {
          return schema.isOptional();
      }
      catch {
          return true;
      }
  }

  const parseOptionalDef = (def, refs) => {
      if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
          return parseDef(def.innerType._def, refs);
      }
      const innerSchema = parseDef(def.innerType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "anyOf", "1"],
      });
      return innerSchema
          ? {
              anyOf: [
                  {
                      not: parseAnyDef(refs),
                  },
                  innerSchema,
              ],
          }
          : parseAnyDef(refs);
  };

  const parsePipelineDef = (def, refs) => {
      if (refs.pipeStrategy === "input") {
          return parseDef(def.in._def, refs);
      }
      else if (refs.pipeStrategy === "output") {
          return parseDef(def.out._def, refs);
      }
      const a = parseDef(def.in._def, {
          ...refs,
          currentPath: [...refs.currentPath, "allOf", "0"],
      });
      const b = parseDef(def.out._def, {
          ...refs,
          currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"],
      });
      return {
          allOf: [a, b].filter((x) => x !== undefined),
      };
  };

  function parsePromiseDef(def, refs) {
      return parseDef(def.type._def, refs);
  }

  function parseSetDef(def, refs) {
      const items = parseDef(def.valueType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items"],
      });
      const schema = {
          type: "array",
          uniqueItems: true,
          items,
      };
      if (def.minSize) {
          setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
      }
      if (def.maxSize) {
          setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
      }
      return schema;
  }

  function parseTupleDef(def, refs) {
      if (def.rest) {
          return {
              type: "array",
              minItems: def.items.length,
              items: def.items
                  .map((x, i) => parseDef(x._def, {
                  ...refs,
                  currentPath: [...refs.currentPath, "items", `${i}`],
              }))
                  .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
              additionalItems: parseDef(def.rest._def, {
                  ...refs,
                  currentPath: [...refs.currentPath, "additionalItems"],
              }),
          };
      }
      else {
          return {
              type: "array",
              minItems: def.items.length,
              maxItems: def.items.length,
              items: def.items
                  .map((x, i) => parseDef(x._def, {
                  ...refs,
                  currentPath: [...refs.currentPath, "items", `${i}`],
              }))
                  .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
          };
      }
  }

  function parseUndefinedDef(refs) {
      return {
          not: parseAnyDef(refs),
      };
  }

  function parseUnknownDef(refs) {
      return parseAnyDef(refs);
  }

  const parseReadonlyDef = (def, refs) => {
      return parseDef(def.innerType._def, refs);
  };

  const selectParser = (def, typeName, refs) => {
      switch (typeName) {
          case ZodFirstPartyTypeKind.ZodString:
              return parseStringDef(def, refs);
          case ZodFirstPartyTypeKind.ZodNumber:
              return parseNumberDef(def, refs);
          case ZodFirstPartyTypeKind.ZodObject:
              return parseObjectDef(def, refs);
          case ZodFirstPartyTypeKind.ZodBigInt:
              return parseBigintDef(def, refs);
          case ZodFirstPartyTypeKind.ZodBoolean:
              return parseBooleanDef();
          case ZodFirstPartyTypeKind.ZodDate:
              return parseDateDef(def, refs);
          case ZodFirstPartyTypeKind.ZodUndefined:
              return parseUndefinedDef(refs);
          case ZodFirstPartyTypeKind.ZodNull:
              return parseNullDef(refs);
          case ZodFirstPartyTypeKind.ZodArray:
              return parseArrayDef(def, refs);
          case ZodFirstPartyTypeKind.ZodUnion:
          case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
              return parseUnionDef(def, refs);
          case ZodFirstPartyTypeKind.ZodIntersection:
              return parseIntersectionDef(def, refs);
          case ZodFirstPartyTypeKind.ZodTuple:
              return parseTupleDef(def, refs);
          case ZodFirstPartyTypeKind.ZodRecord:
              return parseRecordDef(def, refs);
          case ZodFirstPartyTypeKind.ZodLiteral:
              return parseLiteralDef(def, refs);
          case ZodFirstPartyTypeKind.ZodEnum:
              return parseEnumDef(def);
          case ZodFirstPartyTypeKind.ZodNativeEnum:
              return parseNativeEnumDef(def);
          case ZodFirstPartyTypeKind.ZodNullable:
              return parseNullableDef(def, refs);
          case ZodFirstPartyTypeKind.ZodOptional:
              return parseOptionalDef(def, refs);
          case ZodFirstPartyTypeKind.ZodMap:
              return parseMapDef(def, refs);
          case ZodFirstPartyTypeKind.ZodSet:
              return parseSetDef(def, refs);
          case ZodFirstPartyTypeKind.ZodLazy:
              return () => def.getter()._def;
          case ZodFirstPartyTypeKind.ZodPromise:
              return parsePromiseDef(def, refs);
          case ZodFirstPartyTypeKind.ZodNaN:
          case ZodFirstPartyTypeKind.ZodNever:
              return parseNeverDef(refs);
          case ZodFirstPartyTypeKind.ZodEffects:
              return parseEffectsDef(def, refs);
          case ZodFirstPartyTypeKind.ZodAny:
              return parseAnyDef(refs);
          case ZodFirstPartyTypeKind.ZodUnknown:
              return parseUnknownDef(refs);
          case ZodFirstPartyTypeKind.ZodDefault:
              return parseDefaultDef(def, refs);
          case ZodFirstPartyTypeKind.ZodBranded:
              return parseBrandedDef(def, refs);
          case ZodFirstPartyTypeKind.ZodReadonly:
              return parseReadonlyDef(def, refs);
          case ZodFirstPartyTypeKind.ZodCatch:
              return parseCatchDef(def, refs);
          case ZodFirstPartyTypeKind.ZodPipeline:
              return parsePipelineDef(def, refs);
          case ZodFirstPartyTypeKind.ZodFunction:
          case ZodFirstPartyTypeKind.ZodVoid:
          case ZodFirstPartyTypeKind.ZodSymbol:
              return undefined;
          default:
              /* c8 ignore next */
              return ((_) => undefined)();
      }
  };

  function parseDef(def, refs, forceResolution = false) {
      const seenItem = refs.seen.get(def);
      if (refs.override) {
          const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
          if (overrideResult !== ignoreOverride) {
              return overrideResult;
          }
      }
      if (seenItem && !forceResolution) {
          const seenSchema = get$ref(seenItem, refs);
          if (seenSchema !== undefined) {
              return seenSchema;
          }
      }
      const newItem = { def, path: refs.currentPath, jsonSchema: undefined };
      refs.seen.set(def, newItem);
      const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
      // If the return was a function, then the inner definition needs to be extracted before a call to parseDef (recursive)
      const jsonSchema = typeof jsonSchemaOrGetter === "function"
          ? parseDef(jsonSchemaOrGetter(), refs)
          : jsonSchemaOrGetter;
      if (jsonSchema) {
          addMeta(def, refs, jsonSchema);
      }
      if (refs.postProcess) {
          const postProcessResult = refs.postProcess(jsonSchema, def, refs);
          newItem.jsonSchema = jsonSchema;
          return postProcessResult;
      }
      newItem.jsonSchema = jsonSchema;
      return jsonSchema;
  }
  const get$ref = (item, refs) => {
      switch (refs.$refStrategy) {
          case "root":
              return { $ref: item.path.join("/") };
          case "relative":
              return { $ref: getRelativePath(refs.currentPath, item.path) };
          case "none":
          case "seen": {
              if (item.path.length < refs.currentPath.length &&
                  item.path.every((value, index) => refs.currentPath[index] === value)) {
                  console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                  return parseAnyDef(refs);
              }
              return refs.$refStrategy === "seen" ? parseAnyDef(refs) : undefined;
          }
      }
  };
  const addMeta = (def, refs, jsonSchema) => {
      if (def.description) {
          jsonSchema.description = def.description;
          if (refs.markdownDescription) {
              jsonSchema.markdownDescription = def.description;
          }
      }
      return jsonSchema;
  };

  const zodToJsonSchema = (schema, options) => {
      const refs = getRefs(options);
      let definitions = typeof options === "object" && options.definitions
          ? Object.entries(options.definitions).reduce((acc, [name, schema]) => ({
              ...acc,
              [name]: parseDef(schema._def, {
                  ...refs,
                  currentPath: [...refs.basePath, refs.definitionPath, name],
              }, true) ?? parseAnyDef(refs),
          }), {})
          : undefined;
      const name = typeof options === "string"
          ? options
          : options?.nameStrategy === "title"
              ? undefined
              : options?.name;
      const main = parseDef(schema._def, name === undefined
          ? refs
          : {
              ...refs,
              currentPath: [...refs.basePath, refs.definitionPath, name],
          }, false) ?? parseAnyDef(refs);
      const title = typeof options === "object" &&
          options.name !== undefined &&
          options.nameStrategy === "title"
          ? options.name
          : undefined;
      if (title !== undefined) {
          main.title = title;
      }
      if (refs.flags.hasReferencedOpenAiAnyType) {
          if (!definitions) {
              definitions = {};
          }
          if (!definitions[refs.openAiAnyTypeName]) {
              definitions[refs.openAiAnyTypeName] = {
                  // Skipping "object" as no properties can be defined and additionalProperties must be "false"
                  type: ["string", "number", "integer", "boolean", "array", "null"],
                  items: {
                      $ref: refs.$refStrategy === "relative"
                          ? "1"
                          : [
                              ...refs.basePath,
                              refs.definitionPath,
                              refs.openAiAnyTypeName,
                          ].join("/"),
                  },
              };
          }
      }
      const combined = name === undefined
          ? definitions
              ? {
                  ...main,
                  [refs.definitionPath]: definitions,
              }
              : main
          : {
              $ref: [
                  ...(refs.$refStrategy === "relative" ? [] : refs.basePath),
                  refs.definitionPath,
                  name,
              ].join("/"),
              [refs.definitionPath]: {
                  ...definitions,
                  [name]: main,
              },
          };
      if (refs.target === "jsonSchema7") {
          combined.$schema = "http://json-schema.org/draft-07/schema#";
      }
      else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") {
          combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
      }
      if (refs.target === "openAi" &&
          ("anyOf" in combined ||
              "oneOf" in combined ||
              "allOf" in combined ||
              ("type" in combined && Array.isArray(combined.type)))) {
          console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
      }
      return combined;
  };

  // src/index.ts

  // src/assistant-stream-parts.ts
  var textStreamPart = {
    code: "0",
    name: "text",
    parse: (value) => {
      if (typeof value !== "string") {
        throw new Error('"text" parts expect a string value.');
      }
      return { type: "text", value };
    }
  };
  var errorStreamPart = {
    code: "3",
    name: "error",
    parse: (value) => {
      if (typeof value !== "string") {
        throw new Error('"error" parts expect a string value.');
      }
      return { type: "error", value };
    }
  };
  var assistantMessageStreamPart = {
    code: "4",
    name: "assistant_message",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("id" in value) || !("role" in value) || !("content" in value) || typeof value.id !== "string" || typeof value.role !== "string" || value.role !== "assistant" || !Array.isArray(value.content) || !value.content.every(
        (item) => item != null && typeof item === "object" && "type" in item && item.type === "text" && "text" in item && item.text != null && typeof item.text === "object" && "value" in item.text && typeof item.text.value === "string"
      )) {
        throw new Error(
          '"assistant_message" parts expect an object with an "id", "role", and "content" property.'
        );
      }
      return {
        type: "assistant_message",
        value
      };
    }
  };
  var assistantControlDataStreamPart = {
    code: "5",
    name: "assistant_control_data",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("threadId" in value) || !("messageId" in value) || typeof value.threadId !== "string" || typeof value.messageId !== "string") {
        throw new Error(
          '"assistant_control_data" parts expect an object with a "threadId" and "messageId" property.'
        );
      }
      return {
        type: "assistant_control_data",
        value: {
          threadId: value.threadId,
          messageId: value.messageId
        }
      };
    }
  };
  var dataMessageStreamPart = {
    code: "6",
    name: "data_message",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("role" in value) || !("data" in value) || typeof value.role !== "string" || value.role !== "data") {
        throw new Error(
          '"data_message" parts expect an object with a "role" and "data" property.'
        );
      }
      return {
        type: "data_message",
        value
      };
    }
  };
  var assistantStreamParts = [
    textStreamPart,
    errorStreamPart,
    assistantMessageStreamPart,
    assistantControlDataStreamPart,
    dataMessageStreamPart
  ];
  ({
    [textStreamPart.code]: textStreamPart,
    [errorStreamPart.code]: errorStreamPart,
    [assistantMessageStreamPart.code]: assistantMessageStreamPart,
    [assistantControlDataStreamPart.code]: assistantControlDataStreamPart,
    [dataMessageStreamPart.code]: dataMessageStreamPart
  });
  ({
    [textStreamPart.name]: textStreamPart.code,
    [errorStreamPart.name]: errorStreamPart.code,
    [assistantMessageStreamPart.name]: assistantMessageStreamPart.code,
    [assistantControlDataStreamPart.name]: assistantControlDataStreamPart.code,
    [dataMessageStreamPart.name]: dataMessageStreamPart.code
  });
  assistantStreamParts.map((part) => part.code);

  // src/fix-json.ts
  function fixJson(input) {
    const stack = ["ROOT"];
    let lastValidIndex = -1;
    let literalStart = null;
    function processValueStart(char, i, swapState) {
      {
        switch (char) {
          case '"': {
            lastValidIndex = i;
            stack.pop();
            stack.push(swapState);
            stack.push("INSIDE_STRING");
            break;
          }
          case "f":
          case "t":
          case "n": {
            lastValidIndex = i;
            literalStart = i;
            stack.pop();
            stack.push(swapState);
            stack.push("INSIDE_LITERAL");
            break;
          }
          case "-": {
            stack.pop();
            stack.push(swapState);
            stack.push("INSIDE_NUMBER");
            break;
          }
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            stack.pop();
            stack.push(swapState);
            stack.push("INSIDE_NUMBER");
            break;
          }
          case "{": {
            lastValidIndex = i;
            stack.pop();
            stack.push(swapState);
            stack.push("INSIDE_OBJECT_START");
            break;
          }
          case "[": {
            lastValidIndex = i;
            stack.pop();
            stack.push(swapState);
            stack.push("INSIDE_ARRAY_START");
            break;
          }
        }
      }
    }
    function processAfterObjectValue(char, i) {
      switch (char) {
        case ",": {
          stack.pop();
          stack.push("INSIDE_OBJECT_AFTER_COMMA");
          break;
        }
        case "}": {
          lastValidIndex = i;
          stack.pop();
          break;
        }
      }
    }
    function processAfterArrayValue(char, i) {
      switch (char) {
        case ",": {
          stack.pop();
          stack.push("INSIDE_ARRAY_AFTER_COMMA");
          break;
        }
        case "]": {
          lastValidIndex = i;
          stack.pop();
          break;
        }
      }
    }
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const currentState = stack[stack.length - 1];
      switch (currentState) {
        case "ROOT":
          processValueStart(char, i, "FINISH");
          break;
        case "INSIDE_OBJECT_START": {
          switch (char) {
            case '"': {
              stack.pop();
              stack.push("INSIDE_OBJECT_KEY");
              break;
            }
            case "}": {
              lastValidIndex = i;
              stack.pop();
              break;
            }
          }
          break;
        }
        case "INSIDE_OBJECT_AFTER_COMMA": {
          switch (char) {
            case '"': {
              stack.pop();
              stack.push("INSIDE_OBJECT_KEY");
              break;
            }
          }
          break;
        }
        case "INSIDE_OBJECT_KEY": {
          switch (char) {
            case '"': {
              stack.pop();
              stack.push("INSIDE_OBJECT_AFTER_KEY");
              break;
            }
          }
          break;
        }
        case "INSIDE_OBJECT_AFTER_KEY": {
          switch (char) {
            case ":": {
              stack.pop();
              stack.push("INSIDE_OBJECT_BEFORE_VALUE");
              break;
            }
          }
          break;
        }
        case "INSIDE_OBJECT_BEFORE_VALUE": {
          processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
          break;
        }
        case "INSIDE_OBJECT_AFTER_VALUE": {
          processAfterObjectValue(char, i);
          break;
        }
        case "INSIDE_STRING": {
          switch (char) {
            case '"': {
              stack.pop();
              lastValidIndex = i;
              break;
            }
            case "\\": {
              stack.push("INSIDE_STRING_ESCAPE");
              break;
            }
            default: {
              lastValidIndex = i;
            }
          }
          break;
        }
        case "INSIDE_ARRAY_START": {
          switch (char) {
            case "]": {
              lastValidIndex = i;
              stack.pop();
              break;
            }
            default: {
              lastValidIndex = i;
              processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
              break;
            }
          }
          break;
        }
        case "INSIDE_ARRAY_AFTER_VALUE": {
          switch (char) {
            case ",": {
              stack.pop();
              stack.push("INSIDE_ARRAY_AFTER_COMMA");
              break;
            }
            case "]": {
              lastValidIndex = i;
              stack.pop();
              break;
            }
            default: {
              lastValidIndex = i;
              break;
            }
          }
          break;
        }
        case "INSIDE_ARRAY_AFTER_COMMA": {
          processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
          break;
        }
        case "INSIDE_STRING_ESCAPE": {
          stack.pop();
          lastValidIndex = i;
          break;
        }
        case "INSIDE_NUMBER": {
          switch (char) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9": {
              lastValidIndex = i;
              break;
            }
            case "e":
            case "E":
            case "-":
            case ".": {
              break;
            }
            case ",": {
              stack.pop();
              if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
                processAfterArrayValue(char, i);
              }
              if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
                processAfterObjectValue(char, i);
              }
              break;
            }
            case "}": {
              stack.pop();
              if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
                processAfterObjectValue(char, i);
              }
              break;
            }
            case "]": {
              stack.pop();
              if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
                processAfterArrayValue(char, i);
              }
              break;
            }
            default: {
              stack.pop();
              break;
            }
          }
          break;
        }
        case "INSIDE_LITERAL": {
          const partialLiteral = input.substring(literalStart, i + 1);
          if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
          } else {
            lastValidIndex = i;
          }
          break;
        }
      }
    }
    let result = input.slice(0, lastValidIndex + 1);
    for (let i = stack.length - 1; i >= 0; i--) {
      const state = stack[i];
      switch (state) {
        case "INSIDE_STRING": {
          result += '"';
          break;
        }
        case "INSIDE_OBJECT_KEY":
        case "INSIDE_OBJECT_AFTER_KEY":
        case "INSIDE_OBJECT_AFTER_COMMA":
        case "INSIDE_OBJECT_START":
        case "INSIDE_OBJECT_BEFORE_VALUE":
        case "INSIDE_OBJECT_AFTER_VALUE": {
          result += "}";
          break;
        }
        case "INSIDE_ARRAY_START":
        case "INSIDE_ARRAY_AFTER_COMMA":
        case "INSIDE_ARRAY_AFTER_VALUE": {
          result += "]";
          break;
        }
        case "INSIDE_LITERAL": {
          const partialLiteral = input.substring(literalStart, input.length);
          if ("true".startsWith(partialLiteral)) {
            result += "true".slice(partialLiteral.length);
          } else if ("false".startsWith(partialLiteral)) {
            result += "false".slice(partialLiteral.length);
          } else if ("null".startsWith(partialLiteral)) {
            result += "null".slice(partialLiteral.length);
          }
        }
      }
    }
    return result;
  }

  // src/parse-partial-json.ts
  function parsePartialJson(jsonText) {
    if (jsonText === void 0) {
      return { value: void 0, state: "undefined-input" };
    }
    let result = safeParseJSON({ text: jsonText });
    if (result.success) {
      return { value: result.value, state: "successful-parse" };
    }
    result = safeParseJSON({ text: fixJson(jsonText) });
    if (result.success) {
      return { value: result.value, state: "repaired-parse" };
    }
    return { value: void 0, state: "failed-parse" };
  }

  // src/data-stream-parts.ts
  var textStreamPart2 = {
    code: "0",
    name: "text",
    parse: (value) => {
      if (typeof value !== "string") {
        throw new Error('"text" parts expect a string value.');
      }
      return { type: "text", value };
    }
  };
  var dataStreamPart = {
    code: "2",
    name: "data",
    parse: (value) => {
      if (!Array.isArray(value)) {
        throw new Error('"data" parts expect an array value.');
      }
      return { type: "data", value };
    }
  };
  var errorStreamPart2 = {
    code: "3",
    name: "error",
    parse: (value) => {
      if (typeof value !== "string") {
        throw new Error('"error" parts expect a string value.');
      }
      return { type: "error", value };
    }
  };
  var messageAnnotationsStreamPart = {
    code: "8",
    name: "message_annotations",
    parse: (value) => {
      if (!Array.isArray(value)) {
        throw new Error('"message_annotations" parts expect an array value.');
      }
      return { type: "message_annotations", value };
    }
  };
  var toolCallStreamPart = {
    code: "9",
    name: "tool_call",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("toolName" in value) || typeof value.toolName !== "string" || !("args" in value) || typeof value.args !== "object") {
        throw new Error(
          '"tool_call" parts expect an object with a "toolCallId", "toolName", and "args" property.'
        );
      }
      return {
        type: "tool_call",
        value
      };
    }
  };
  var toolResultStreamPart = {
    code: "a",
    name: "tool_result",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("result" in value)) {
        throw new Error(
          '"tool_result" parts expect an object with a "toolCallId" and a "result" property.'
        );
      }
      return {
        type: "tool_result",
        value
      };
    }
  };
  var toolCallStreamingStartStreamPart = {
    code: "b",
    name: "tool_call_streaming_start",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("toolName" in value) || typeof value.toolName !== "string") {
        throw new Error(
          '"tool_call_streaming_start" parts expect an object with a "toolCallId" and "toolName" property.'
        );
      }
      return {
        type: "tool_call_streaming_start",
        value
      };
    }
  };
  var toolCallDeltaStreamPart = {
    code: "c",
    name: "tool_call_delta",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("argsTextDelta" in value) || typeof value.argsTextDelta !== "string") {
        throw new Error(
          '"tool_call_delta" parts expect an object with a "toolCallId" and "argsTextDelta" property.'
        );
      }
      return {
        type: "tool_call_delta",
        value
      };
    }
  };
  var finishMessageStreamPart = {
    code: "d",
    name: "finish_message",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("finishReason" in value) || typeof value.finishReason !== "string") {
        throw new Error(
          '"finish_message" parts expect an object with a "finishReason" property.'
        );
      }
      const result = {
        finishReason: value.finishReason
      };
      if ("usage" in value && value.usage != null && typeof value.usage === "object" && "promptTokens" in value.usage && "completionTokens" in value.usage) {
        result.usage = {
          promptTokens: typeof value.usage.promptTokens === "number" ? value.usage.promptTokens : Number.NaN,
          completionTokens: typeof value.usage.completionTokens === "number" ? value.usage.completionTokens : Number.NaN
        };
      }
      return {
        type: "finish_message",
        value: result
      };
    }
  };
  var finishStepStreamPart = {
    code: "e",
    name: "finish_step",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("finishReason" in value) || typeof value.finishReason !== "string") {
        throw new Error(
          '"finish_step" parts expect an object with a "finishReason" property.'
        );
      }
      const result = {
        finishReason: value.finishReason,
        isContinued: false
      };
      if ("usage" in value && value.usage != null && typeof value.usage === "object" && "promptTokens" in value.usage && "completionTokens" in value.usage) {
        result.usage = {
          promptTokens: typeof value.usage.promptTokens === "number" ? value.usage.promptTokens : Number.NaN,
          completionTokens: typeof value.usage.completionTokens === "number" ? value.usage.completionTokens : Number.NaN
        };
      }
      if ("isContinued" in value && typeof value.isContinued === "boolean") {
        result.isContinued = value.isContinued;
      }
      return {
        type: "finish_step",
        value: result
      };
    }
  };
  var startStepStreamPart = {
    code: "f",
    name: "start_step",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("messageId" in value) || typeof value.messageId !== "string") {
        throw new Error(
          '"start_step" parts expect an object with an "id" property.'
        );
      }
      return {
        type: "start_step",
        value: {
          messageId: value.messageId
        }
      };
    }
  };
  var reasoningStreamPart = {
    code: "g",
    name: "reasoning",
    parse: (value) => {
      if (typeof value !== "string") {
        throw new Error('"reasoning" parts expect a string value.');
      }
      return { type: "reasoning", value };
    }
  };
  var sourcePart = {
    code: "h",
    name: "source",
    parse: (value) => {
      if (value == null || typeof value !== "object") {
        throw new Error('"source" parts expect a Source object.');
      }
      return {
        type: "source",
        value
      };
    }
  };
  var redactedReasoningStreamPart = {
    code: "i",
    name: "redacted_reasoning",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("data" in value) || typeof value.data !== "string") {
        throw new Error(
          '"redacted_reasoning" parts expect an object with a "data" property.'
        );
      }
      return { type: "redacted_reasoning", value: { data: value.data } };
    }
  };
  var reasoningSignatureStreamPart = {
    code: "j",
    name: "reasoning_signature",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("signature" in value) || typeof value.signature !== "string") {
        throw new Error(
          '"reasoning_signature" parts expect an object with a "signature" property.'
        );
      }
      return {
        type: "reasoning_signature",
        value: { signature: value.signature }
      };
    }
  };
  var fileStreamPart = {
    code: "k",
    name: "file",
    parse: (value) => {
      if (value == null || typeof value !== "object" || !("data" in value) || typeof value.data !== "string" || !("mimeType" in value) || typeof value.mimeType !== "string") {
        throw new Error(
          '"file" parts expect an object with a "data" and "mimeType" property.'
        );
      }
      return { type: "file", value };
    }
  };
  var dataStreamParts = [
    textStreamPart2,
    dataStreamPart,
    errorStreamPart2,
    messageAnnotationsStreamPart,
    toolCallStreamPart,
    toolResultStreamPart,
    toolCallStreamingStartStreamPart,
    toolCallDeltaStreamPart,
    finishMessageStreamPart,
    finishStepStreamPart,
    startStepStreamPart,
    reasoningStreamPart,
    sourcePart,
    redactedReasoningStreamPart,
    reasoningSignatureStreamPart,
    fileStreamPart
  ];
  Object.fromEntries(
    dataStreamParts.map((part) => [part.code, part])
  );
  Object.fromEntries(
    dataStreamParts.map((part) => [part.name, part.code])
  );
  dataStreamParts.map((part) => part.code);
  function formatDataStreamPart(type, value) {
    const streamPart = dataStreamParts.find((part) => part.name === type);
    if (!streamPart) {
      throw new Error(`Invalid stream part type: ${type}`);
    }
    return `${streamPart.code}:${JSON.stringify(value)}
`;
  }
  function zodSchema(zodSchema2, options) {
    var _a;
    const useReferences = (_a = void 0 ) != null ? _a : false;
    return jsonSchema(
      zodToJsonSchema(zodSchema2, {
        $refStrategy: useReferences ? "root" : "none",
        target: "jsonSchema7"
        // note: openai mode breaks various gemini conversions
      }),
      {
        validate: (value) => {
          const result = zodSchema2.safeParse(value);
          return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
        }
      }
    );
  }

  // src/schema.ts
  var schemaSymbol = Symbol.for("vercel.ai.schema");
  function jsonSchema(jsonSchema2, {
    validate
  } = {}) {
    return {
      [schemaSymbol]: true,
      _type: void 0,
      // should never be used directly
      [validatorSymbol]: true,
      jsonSchema: jsonSchema2,
      validate
    };
  }
  function isSchema(value) {
    return typeof value === "object" && value !== null && schemaSymbol in value && value[schemaSymbol] === true && "jsonSchema" in value && "validate" in value;
  }
  function asSchema(schema) {
    return isSchema(schema) ? schema : zodSchema(schema);
  }

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  // Updates to this file should also be replicated to @opentelemetry/core too.
  /**
   * - globalThis (New standard)
   * - self (Will return the current window instance for supported browsers)
   * - window (fallback for older browser implementations)
   * - global (NodeJS implementation)
   * - <object> (When all else fails)
   */
  /** only globals that common to node and browsers are allowed */
  // eslint-disable-next-line node/no-unsupported-features/es-builtins, no-undef
  var _globalThis = typeof globalThis === 'object'
      ? globalThis
      : typeof self === 'object'
          ? self
          : typeof window === 'object'
              ? window
              : typeof global === 'object'
                  ? global
                  : {};

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  // this is autogenerated file, see scripts/version-update.js
  var VERSION = '1.9.0';

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
  /**
   * Create a function to test an API version to see if it is compatible with the provided ownVersion.
   *
   * The returned function has the following semantics:
   * - Exact match is always compatible
   * - Major versions must match exactly
   *    - 1.x package cannot use global 2.x package
   *    - 2.x package cannot use global 1.x package
   * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
   *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
   *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
   * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
   * - Patch and build tag differences are not considered at this time
   *
   * @param ownVersion version which should be checked against
   */
  function _makeCompatibilityCheck(ownVersion) {
      var acceptedVersions = new Set([ownVersion]);
      var rejectedVersions = new Set();
      var myVersionMatch = ownVersion.match(re);
      if (!myVersionMatch) {
          // we cannot guarantee compatibility so we always return noop
          return function () { return false; };
      }
      var ownVersionParsed = {
          major: +myVersionMatch[1],
          minor: +myVersionMatch[2],
          patch: +myVersionMatch[3],
          prerelease: myVersionMatch[4],
      };
      // if ownVersion has a prerelease tag, versions must match exactly
      if (ownVersionParsed.prerelease != null) {
          return function isExactmatch(globalVersion) {
              return globalVersion === ownVersion;
          };
      }
      function _reject(v) {
          rejectedVersions.add(v);
          return false;
      }
      function _accept(v) {
          acceptedVersions.add(v);
          return true;
      }
      return function isCompatible(globalVersion) {
          if (acceptedVersions.has(globalVersion)) {
              return true;
          }
          if (rejectedVersions.has(globalVersion)) {
              return false;
          }
          var globalVersionMatch = globalVersion.match(re);
          if (!globalVersionMatch) {
              // cannot parse other version
              // we cannot guarantee compatibility so we always noop
              return _reject(globalVersion);
          }
          var globalVersionParsed = {
              major: +globalVersionMatch[1],
              minor: +globalVersionMatch[2],
              patch: +globalVersionMatch[3],
              prerelease: globalVersionMatch[4],
          };
          // if globalVersion has a prerelease tag, versions must match exactly
          if (globalVersionParsed.prerelease != null) {
              return _reject(globalVersion);
          }
          // major versions must match
          if (ownVersionParsed.major !== globalVersionParsed.major) {
              return _reject(globalVersion);
          }
          if (ownVersionParsed.major === 0) {
              if (ownVersionParsed.minor === globalVersionParsed.minor &&
                  ownVersionParsed.patch <= globalVersionParsed.patch) {
                  return _accept(globalVersion);
              }
              return _reject(globalVersion);
          }
          if (ownVersionParsed.minor <= globalVersionParsed.minor) {
              return _accept(globalVersion);
          }
          return _reject(globalVersion);
      };
  }
  /**
   * Test an API version to see if it is compatible with this API.
   *
   * - Exact match is always compatible
   * - Major versions must match exactly
   *    - 1.x package cannot use global 2.x package
   *    - 2.x package cannot use global 1.x package
   * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
   *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
   *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
   * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
   * - Patch and build tag differences are not considered at this time
   *
   * @param version version of the API requesting an instance of the global API
   */
  var isCompatible = _makeCompatibilityCheck(VERSION);

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var major = VERSION.split('.')[0];
  var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
  var _global = _globalThis;
  function registerGlobal(type, instance, diag, allowOverride) {
      var _a;
      if (allowOverride === void 0) { allowOverride = false; }
      var api = (_global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
          version: VERSION,
      });
      if (!allowOverride && api[type]) {
          // already registered an API of this type
          var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
          diag.error(err.stack || err.message);
          return false;
      }
      if (api.version !== VERSION) {
          // All registered APIs must be of the same version exactly
          var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
          diag.error(err.stack || err.message);
          return false;
      }
      api[type] = instance;
      diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
      return true;
  }
  function getGlobal(type) {
      var _a, _b;
      var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
      if (!globalVersion || !isCompatible(globalVersion)) {
          return;
      }
      return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
  }
  function unregisterGlobal(type, diag) {
      diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
      var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
      if (api) {
          delete api[type];
      }
  }

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var __read$3 = (window && window.__read) || function (o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  };
  var __spreadArray$3 = (window && window.__spreadArray) || function (to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  };
  /**
   * Component Logger which is meant to be used as part of any component which
   * will add automatically additional namespace in front of the log message.
   * It will then forward all message to global diag logger
   * @example
   * const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
   * cLogger.debug('test');
   * // @opentelemetry/instrumentation-http test
   */
  var DiagComponentLogger = /** @class */ (function () {
      function DiagComponentLogger(props) {
          this._namespace = props.namespace || 'DiagComponentLogger';
      }
      DiagComponentLogger.prototype.debug = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return logProxy('debug', this._namespace, args);
      };
      DiagComponentLogger.prototype.error = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return logProxy('error', this._namespace, args);
      };
      DiagComponentLogger.prototype.info = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return logProxy('info', this._namespace, args);
      };
      DiagComponentLogger.prototype.warn = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return logProxy('warn', this._namespace, args);
      };
      DiagComponentLogger.prototype.verbose = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return logProxy('verbose', this._namespace, args);
      };
      return DiagComponentLogger;
  }());
  function logProxy(funcName, namespace, args) {
      var logger = getGlobal('diag');
      // shortcut if logger not set
      if (!logger) {
          return;
      }
      args.unshift(namespace);
      return logger[funcName].apply(logger, __spreadArray$3([], __read$3(args), false));
  }

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Defines the available internal logging levels for the diagnostic logger, the numeric values
   * of the levels are defined to match the original values from the initial LogLevel to avoid
   * compatibility/migration issues for any implementation that assume the numeric ordering.
   */
  var DiagLogLevel;
  (function (DiagLogLevel) {
      /** Diagnostic Logging level setting to disable all logging (except and forced logs) */
      DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
      /** Identifies an error scenario */
      DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
      /** Identifies a warning scenario */
      DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
      /** General informational log message */
      DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
      /** General debug log message */
      DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
      /**
       * Detailed trace level logging should only be used for development, should only be set
       * in a development environment.
       */
      DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
      /** Used to set the logging level to include all logging */
      DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
  })(DiagLogLevel || (DiagLogLevel = {}));

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function createLogLevelDiagLogger(maxLevel, logger) {
      if (maxLevel < DiagLogLevel.NONE) {
          maxLevel = DiagLogLevel.NONE;
      }
      else if (maxLevel > DiagLogLevel.ALL) {
          maxLevel = DiagLogLevel.ALL;
      }
      // In case the logger is null or undefined
      logger = logger || {};
      function _filterFunc(funcName, theLevel) {
          var theFunc = logger[funcName];
          if (typeof theFunc === 'function' && maxLevel >= theLevel) {
              return theFunc.bind(logger);
          }
          return function () { };
      }
      return {
          error: _filterFunc('error', DiagLogLevel.ERROR),
          warn: _filterFunc('warn', DiagLogLevel.WARN),
          info: _filterFunc('info', DiagLogLevel.INFO),
          debug: _filterFunc('debug', DiagLogLevel.DEBUG),
          verbose: _filterFunc('verbose', DiagLogLevel.VERBOSE),
      };
  }

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var __read$2 = (window && window.__read) || function (o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  };
  var __spreadArray$2 = (window && window.__spreadArray) || function (to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  };
  var API_NAME$2 = 'diag';
  /**
   * Singleton object which represents the entry point to the OpenTelemetry internal
   * diagnostic API
   */
  var DiagAPI = /** @class */ (function () {
      /**
       * Private internal constructor
       * @private
       */
      function DiagAPI() {
          function _logProxy(funcName) {
              return function () {
                  var args = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                      args[_i] = arguments[_i];
                  }
                  var logger = getGlobal('diag');
                  // shortcut if logger not set
                  if (!logger)
                      return;
                  return logger[funcName].apply(logger, __spreadArray$2([], __read$2(args), false));
              };
          }
          // Using self local variable for minification purposes as 'this' cannot be minified
          var self = this;
          // DiagAPI specific functions
          var setLogger = function (logger, optionsOrLogLevel) {
              var _a, _b, _c;
              if (optionsOrLogLevel === void 0) { optionsOrLogLevel = { logLevel: DiagLogLevel.INFO }; }
              if (logger === self) {
                  // There isn't much we can do here.
                  // Logging to the console might break the user application.
                  // Try to log to self. If a logger was previously registered it will receive the log.
                  var err = new Error('Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation');
                  self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
                  return false;
              }
              if (typeof optionsOrLogLevel === 'number') {
                  optionsOrLogLevel = {
                      logLevel: optionsOrLogLevel,
                  };
              }
              var oldLogger = getGlobal('diag');
              var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
              // There already is an logger registered. We'll let it know before overwriting it.
              if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
                  var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : '<failed to generate stacktrace>';
                  oldLogger.warn("Current logger will be overwritten from " + stack);
                  newLogger.warn("Current logger will overwrite one already registered from " + stack);
              }
              return registerGlobal('diag', newLogger, self, true);
          };
          self.setLogger = setLogger;
          self.disable = function () {
              unregisterGlobal(API_NAME$2, self);
          };
          self.createComponentLogger = function (options) {
              return new DiagComponentLogger(options);
          };
          self.verbose = _logProxy('verbose');
          self.debug = _logProxy('debug');
          self.info = _logProxy('info');
          self.warn = _logProxy('warn');
          self.error = _logProxy('error');
      }
      /** Get the singleton instance of the DiagAPI API */
      DiagAPI.instance = function () {
          if (!this._instance) {
              this._instance = new DiagAPI();
          }
          return this._instance;
      };
      return DiagAPI;
  }());

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /** Get a key to uniquely identify a context value */
  function createContextKey(description) {
      // The specification states that for the same input, multiple calls should
      // return different keys. Due to the nature of the JS dependency management
      // system, this creates problems where multiple versions of some package
      // could hold different keys for the same property.
      //
      // Therefore, we use Symbol.for which returns the same key for the same input.
      return Symbol.for(description);
  }
  var BaseContext = /** @class */ (function () {
      /**
       * Construct a new context which inherits values from an optional parent context.
       *
       * @param parentContext a context from which to inherit values
       */
      function BaseContext(parentContext) {
          // for minification
          var self = this;
          self._currentContext = parentContext ? new Map(parentContext) : new Map();
          self.getValue = function (key) { return self._currentContext.get(key); };
          self.setValue = function (key, value) {
              var context = new BaseContext(self._currentContext);
              context._currentContext.set(key, value);
              return context;
          };
          self.deleteValue = function (key) {
              var context = new BaseContext(self._currentContext);
              context._currentContext.delete(key);
              return context;
          };
      }
      return BaseContext;
  }());
  /** The root context is used as the default parent context when there is no active context */
  var ROOT_CONTEXT = new BaseContext();

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var __read$1 = (window && window.__read) || function (o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  };
  var __spreadArray$1 = (window && window.__spreadArray) || function (to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  };
  var NoopContextManager = /** @class */ (function () {
      function NoopContextManager() {
      }
      NoopContextManager.prototype.active = function () {
          return ROOT_CONTEXT;
      };
      NoopContextManager.prototype.with = function (_context, fn, thisArg) {
          var args = [];
          for (var _i = 3; _i < arguments.length; _i++) {
              args[_i - 3] = arguments[_i];
          }
          return fn.call.apply(fn, __spreadArray$1([thisArg], __read$1(args), false));
      };
      NoopContextManager.prototype.bind = function (_context, target) {
          return target;
      };
      NoopContextManager.prototype.enable = function () {
          return this;
      };
      NoopContextManager.prototype.disable = function () {
          return this;
      };
      return NoopContextManager;
  }());

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var __read = (window && window.__read) || function (o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  };
  var __spreadArray = (window && window.__spreadArray) || function (to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  };
  var API_NAME$1 = 'context';
  var NOOP_CONTEXT_MANAGER = new NoopContextManager();
  /**
   * Singleton object which represents the entry point to the OpenTelemetry Context API
   */
  var ContextAPI = /** @class */ (function () {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      function ContextAPI() {
      }
      /** Get the singleton instance of the Context API */
      ContextAPI.getInstance = function () {
          if (!this._instance) {
              this._instance = new ContextAPI();
          }
          return this._instance;
      };
      /**
       * Set the current context manager.
       *
       * @returns true if the context manager was successfully registered, else false
       */
      ContextAPI.prototype.setGlobalContextManager = function (contextManager) {
          return registerGlobal(API_NAME$1, contextManager, DiagAPI.instance());
      };
      /**
       * Get the currently active context
       */
      ContextAPI.prototype.active = function () {
          return this._getContextManager().active();
      };
      /**
       * Execute a function with an active context
       *
       * @param context context to be active during function execution
       * @param fn function to execute in a context
       * @param thisArg optional receiver to be used for calling fn
       * @param args optional arguments forwarded to fn
       */
      ContextAPI.prototype.with = function (context, fn, thisArg) {
          var _a;
          var args = [];
          for (var _i = 3; _i < arguments.length; _i++) {
              args[_i - 3] = arguments[_i];
          }
          return (_a = this._getContextManager()).with.apply(_a, __spreadArray([context, fn, thisArg], __read(args), false));
      };
      /**
       * Bind a context to a target function or event emitter
       *
       * @param context context to bind to the event emitter or function. Defaults to the currently active context
       * @param target function or event emitter to bind
       */
      ContextAPI.prototype.bind = function (context, target) {
          return this._getContextManager().bind(context, target);
      };
      ContextAPI.prototype._getContextManager = function () {
          return getGlobal(API_NAME$1) || NOOP_CONTEXT_MANAGER;
      };
      /** Disable and remove the global context manager */
      ContextAPI.prototype.disable = function () {
          this._getContextManager().disable();
          unregisterGlobal(API_NAME$1, DiagAPI.instance());
      };
      return ContextAPI;
  }());

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var TraceFlags;
  (function (TraceFlags) {
      /** Represents no flag set. */
      TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
      /** Bit to represent whether trace is sampled in trace flags. */
      TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
  })(TraceFlags || (TraceFlags = {}));

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var INVALID_SPANID = '0000000000000000';
  var INVALID_TRACEID = '00000000000000000000000000000000';
  var INVALID_SPAN_CONTEXT = {
      traceId: INVALID_TRACEID,
      spanId: INVALID_SPANID,
      traceFlags: TraceFlags.NONE,
  };

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * The NonRecordingSpan is the default {@link Span} that is used when no Span
   * implementation is available. All operations are no-op including context
   * propagation.
   */
  var NonRecordingSpan = /** @class */ (function () {
      function NonRecordingSpan(_spanContext) {
          if (_spanContext === void 0) { _spanContext = INVALID_SPAN_CONTEXT; }
          this._spanContext = _spanContext;
      }
      // Returns a SpanContext.
      NonRecordingSpan.prototype.spanContext = function () {
          return this._spanContext;
      };
      // By default does nothing
      NonRecordingSpan.prototype.setAttribute = function (_key, _value) {
          return this;
      };
      // By default does nothing
      NonRecordingSpan.prototype.setAttributes = function (_attributes) {
          return this;
      };
      // By default does nothing
      NonRecordingSpan.prototype.addEvent = function (_name, _attributes) {
          return this;
      };
      NonRecordingSpan.prototype.addLink = function (_link) {
          return this;
      };
      NonRecordingSpan.prototype.addLinks = function (_links) {
          return this;
      };
      // By default does nothing
      NonRecordingSpan.prototype.setStatus = function (_status) {
          return this;
      };
      // By default does nothing
      NonRecordingSpan.prototype.updateName = function (_name) {
          return this;
      };
      // By default does nothing
      NonRecordingSpan.prototype.end = function (_endTime) { };
      // isRecording always returns false for NonRecordingSpan.
      NonRecordingSpan.prototype.isRecording = function () {
          return false;
      };
      // By default does nothing
      NonRecordingSpan.prototype.recordException = function (_exception, _time) { };
      return NonRecordingSpan;
  }());

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * span key
   */
  var SPAN_KEY = createContextKey('OpenTelemetry Context Key SPAN');
  /**
   * Return the span if one exists
   *
   * @param context context to get span from
   */
  function getSpan(context) {
      return context.getValue(SPAN_KEY) || undefined;
  }
  /**
   * Gets the span from the current context, if one exists.
   */
  function getActiveSpan() {
      return getSpan(ContextAPI.getInstance().active());
  }
  /**
   * Set the span on a context
   *
   * @param context context to use as parent
   * @param span span to set active
   */
  function setSpan(context, span) {
      return context.setValue(SPAN_KEY, span);
  }
  /**
   * Remove current span stored in the context
   *
   * @param context context to delete span from
   */
  function deleteSpan(context) {
      return context.deleteValue(SPAN_KEY);
  }
  /**
   * Wrap span context in a NoopSpan and set as span in a new
   * context
   *
   * @param context context to set active span on
   * @param spanContext span context to be wrapped
   */
  function setSpanContext(context, spanContext) {
      return setSpan(context, new NonRecordingSpan(spanContext));
  }
  /**
   * Get the span context of the span if it exists.
   *
   * @param context context to get values from
   */
  function getSpanContext(context) {
      var _a;
      return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
  }

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
  var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
  function isValidTraceId(traceId) {
      return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
  }
  function isValidSpanId(spanId) {
      return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
  }
  /**
   * Returns true if this {@link SpanContext} is valid.
   * @return true if this {@link SpanContext} is valid.
   */
  function isSpanContextValid(spanContext) {
      return (isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId));
  }
  /**
   * Wrap the given {@link SpanContext} in a new non-recording {@link Span}
   *
   * @param spanContext span context to be wrapped
   * @returns a new non-recording {@link Span} with the provided context
   */
  function wrapSpanContext(spanContext) {
      return new NonRecordingSpan(spanContext);
  }

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var contextApi = ContextAPI.getInstance();
  /**
   * No-op implementations of {@link Tracer}.
   */
  var NoopTracer = /** @class */ (function () {
      function NoopTracer() {
      }
      // startSpan starts a noop span.
      NoopTracer.prototype.startSpan = function (name, options, context) {
          if (context === void 0) { context = contextApi.active(); }
          var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
          if (root) {
              return new NonRecordingSpan();
          }
          var parentFromContext = context && getSpanContext(context);
          if (isSpanContext(parentFromContext) &&
              isSpanContextValid(parentFromContext)) {
              return new NonRecordingSpan(parentFromContext);
          }
          else {
              return new NonRecordingSpan();
          }
      };
      NoopTracer.prototype.startActiveSpan = function (name, arg2, arg3, arg4) {
          var opts;
          var ctx;
          var fn;
          if (arguments.length < 2) {
              return;
          }
          else if (arguments.length === 2) {
              fn = arg2;
          }
          else if (arguments.length === 3) {
              opts = arg2;
              fn = arg3;
          }
          else {
              opts = arg2;
              ctx = arg3;
              fn = arg4;
          }
          var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
          var span = this.startSpan(name, opts, parentContext);
          var contextWithSpanSet = setSpan(parentContext, span);
          return contextApi.with(contextWithSpanSet, fn, undefined, span);
      };
      return NoopTracer;
  }());
  function isSpanContext(spanContext) {
      return (typeof spanContext === 'object' &&
          typeof spanContext['spanId'] === 'string' &&
          typeof spanContext['traceId'] === 'string' &&
          typeof spanContext['traceFlags'] === 'number');
  }

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var NOOP_TRACER = new NoopTracer();
  /**
   * Proxy tracer provided by the proxy tracer provider
   */
  var ProxyTracer = /** @class */ (function () {
      function ProxyTracer(_provider, name, version, options) {
          this._provider = _provider;
          this.name = name;
          this.version = version;
          this.options = options;
      }
      ProxyTracer.prototype.startSpan = function (name, options, context) {
          return this._getTracer().startSpan(name, options, context);
      };
      ProxyTracer.prototype.startActiveSpan = function (_name, _options, _context, _fn) {
          var tracer = this._getTracer();
          return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
      };
      /**
       * Try to get a tracer from the proxy tracer provider.
       * If the proxy tracer provider has no delegate, return a noop tracer.
       */
      ProxyTracer.prototype._getTracer = function () {
          if (this._delegate) {
              return this._delegate;
          }
          var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
          if (!tracer) {
              return NOOP_TRACER;
          }
          this._delegate = tracer;
          return this._delegate;
      };
      return ProxyTracer;
  }());

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * An implementation of the {@link TracerProvider} which returns an impotent
   * Tracer for all calls to `getTracer`.
   *
   * All operations are no-op.
   */
  var NoopTracerProvider = /** @class */ (function () {
      function NoopTracerProvider() {
      }
      NoopTracerProvider.prototype.getTracer = function (_name, _version, _options) {
          return new NoopTracer();
      };
      return NoopTracerProvider;
  }());

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
  /**
   * Tracer provider which provides {@link ProxyTracer}s.
   *
   * Before a delegate is set, tracers provided are NoOp.
   *   When a delegate is set, traces are provided from the delegate.
   *   When a delegate is set after tracers have already been provided,
   *   all tracers already provided will use the provided delegate implementation.
   */
  var ProxyTracerProvider = /** @class */ (function () {
      function ProxyTracerProvider() {
      }
      /**
       * Get a {@link ProxyTracer}
       */
      ProxyTracerProvider.prototype.getTracer = function (name, version, options) {
          var _a;
          return ((_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options));
      };
      ProxyTracerProvider.prototype.getDelegate = function () {
          var _a;
          return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
      };
      /**
       * Set the delegate tracer provider
       */
      ProxyTracerProvider.prototype.setDelegate = function (delegate) {
          this._delegate = delegate;
      };
      ProxyTracerProvider.prototype.getDelegateTracer = function (name, version, options) {
          var _a;
          return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
      };
      return ProxyTracerProvider;
  }());

  /**
   * An enumeration of status codes.
   */
  var SpanStatusCode;
  (function (SpanStatusCode) {
      /**
       * The default status.
       */
      SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
      /**
       * The operation has been validated by an Application developer or
       * Operator to have completed successfully.
       */
      SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
      /**
       * The operation contains an error.
       */
      SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
  })(SpanStatusCode || (SpanStatusCode = {}));

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var API_NAME = 'trace';
  /**
   * Singleton object which represents the entry point to the OpenTelemetry Tracing API
   */
  var TraceAPI = /** @class */ (function () {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      function TraceAPI() {
          this._proxyTracerProvider = new ProxyTracerProvider();
          this.wrapSpanContext = wrapSpanContext;
          this.isSpanContextValid = isSpanContextValid;
          this.deleteSpan = deleteSpan;
          this.getSpan = getSpan;
          this.getActiveSpan = getActiveSpan;
          this.getSpanContext = getSpanContext;
          this.setSpan = setSpan;
          this.setSpanContext = setSpanContext;
      }
      /** Get the singleton instance of the Trace API */
      TraceAPI.getInstance = function () {
          if (!this._instance) {
              this._instance = new TraceAPI();
          }
          return this._instance;
      };
      /**
       * Set the current global tracer.
       *
       * @returns true if the tracer provider was successfully registered, else false
       */
      TraceAPI.prototype.setGlobalTracerProvider = function (provider) {
          var success = registerGlobal(API_NAME, this._proxyTracerProvider, DiagAPI.instance());
          if (success) {
              this._proxyTracerProvider.setDelegate(provider);
          }
          return success;
      };
      /**
       * Returns the global tracer provider.
       */
      TraceAPI.prototype.getTracerProvider = function () {
          return getGlobal(API_NAME) || this._proxyTracerProvider;
      };
      /**
       * Returns a tracer from the global tracer provider.
       */
      TraceAPI.prototype.getTracer = function (name, version) {
          return this.getTracerProvider().getTracer(name, version);
      };
      /** Remove the global tracer provider */
      TraceAPI.prototype.disable = function () {
          unregisterGlobal(API_NAME, DiagAPI.instance());
          this._proxyTracerProvider = new ProxyTracerProvider();
      };
      return TraceAPI;
  }());

  /*
   * Copyright The OpenTelemetry Authors
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  // Split module-level variable definition into separate files to allow
  // tree-shaking on each api instance.
  /** Entrypoint for trace API */
  var trace = TraceAPI.getInstance();

  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name17 in all)
      __defProp(target, name17, { get: all[name17], enumerable: true });
  };

  // core/util/prepare-response-headers.ts
  function prepareResponseHeaders(headers, {
    contentType,
    dataStreamVersion
  }) {
    const responseHeaders = new Headers(headers != null ? headers : {});
    if (!responseHeaders.has("Content-Type")) {
      responseHeaders.set("Content-Type", contentType);
    }
    if (dataStreamVersion !== void 0) {
      responseHeaders.set("X-Vercel-AI-Data-Stream", dataStreamVersion);
    }
    return responseHeaders;
  }

  // core/util/prepare-outgoing-http-headers.ts
  function prepareOutgoingHttpHeaders(headers, {
    contentType,
    dataStreamVersion
  }) {
    const outgoingHeaders = {};
    if (headers != null) {
      for (const [key, value] of Object.entries(headers)) {
        outgoingHeaders[key] = value;
      }
    }
    if (outgoingHeaders["Content-Type"] == null) {
      outgoingHeaders["Content-Type"] = contentType;
    }
    if (dataStreamVersion !== void 0) {
      outgoingHeaders["X-Vercel-AI-Data-Stream"] = dataStreamVersion;
    }
    return outgoingHeaders;
  }

  // core/util/write-to-server-response.ts
  function writeToServerResponse({
    response,
    status,
    statusText,
    headers,
    stream
  }) {
    response.writeHead(status != null ? status : 200, statusText, headers);
    const reader = stream.getReader();
    const read = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done)
            break;
          response.write(value);
        }
      } catch (error) {
        throw error;
      } finally {
        response.end();
      }
    };
    read();
  }
  var UnsupportedModelVersionError = class extends AISDKError {
    constructor() {
      super({
        name: "AI_UnsupportedModelVersionError",
        message: `Unsupported model version. AI SDK 4 only supports models that implement specification version "v1". Please upgrade to AI SDK 5 to use this model.`
      });
    }
  };
  var name = "AI_InvalidArgumentError";
  var marker = `vercel.ai.error.${name}`;
  var symbol = Symbol.for(marker);
  var _a;
  var InvalidArgumentError = class extends AISDKError {
    constructor({
      parameter,
      value,
      message
    }) {
      super({
        name,
        message: `Invalid argument for parameter ${parameter}: ${message}`
      });
      this[_a] = true;
      this.parameter = parameter;
      this.value = value;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker);
    }
  };
  _a = symbol;
  var name2 = "AI_RetryError";
  var marker2 = `vercel.ai.error.${name2}`;
  var symbol2 = Symbol.for(marker2);
  var _a2;
  var RetryError = class extends AISDKError {
    constructor({
      message,
      reason,
      errors
    }) {
      super({ name: name2, message });
      this[_a2] = true;
      this.reason = reason;
      this.errors = errors;
      this.lastError = errors[errors.length - 1];
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker2);
    }
  };
  _a2 = symbol2;

  // util/retry-with-exponential-backoff.ts
  var retryWithExponentialBackoff = ({
    maxRetries = 2,
    initialDelayInMs = 2e3,
    backoffFactor = 2
  } = {}) => async (f) => _retryWithExponentialBackoff(f, {
    maxRetries,
    delayInMs: initialDelayInMs,
    backoffFactor
  });
  async function _retryWithExponentialBackoff(f, {
    maxRetries,
    delayInMs,
    backoffFactor
  }, errors = []) {
    try {
      return await f();
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }
      if (maxRetries === 0) {
        throw error;
      }
      const errorMessage = getErrorMessage(error);
      const newErrors = [...errors, error];
      const tryNumber = newErrors.length;
      if (tryNumber > maxRetries) {
        throw new RetryError({
          message: `Failed after ${tryNumber} attempts. Last error: ${errorMessage}`,
          reason: "maxRetriesExceeded",
          errors: newErrors
        });
      }
      if (error instanceof Error && APICallError.isInstance(error) && error.isRetryable === true && tryNumber <= maxRetries) {
        await delay(delayInMs);
        return _retryWithExponentialBackoff(
          f,
          { maxRetries, delayInMs: backoffFactor * delayInMs, backoffFactor },
          newErrors
        );
      }
      if (tryNumber === 1) {
        throw error;
      }
      throw new RetryError({
        message: `Failed after ${tryNumber} attempts with non-retryable error: '${errorMessage}'`,
        reason: "errorNotRetryable",
        errors: newErrors
      });
    }
  }

  // core/prompt/prepare-retries.ts
  function prepareRetries({
    maxRetries
  }) {
    if (maxRetries != null) {
      if (!Number.isInteger(maxRetries)) {
        throw new InvalidArgumentError({
          parameter: "maxRetries",
          value: maxRetries,
          message: "maxRetries must be an integer"
        });
      }
      if (maxRetries < 0) {
        throw new InvalidArgumentError({
          parameter: "maxRetries",
          value: maxRetries,
          message: "maxRetries must be >= 0"
        });
      }
    }
    const maxRetriesResult = maxRetries != null ? maxRetries : 2;
    return {
      maxRetries: maxRetriesResult,
      retry: retryWithExponentialBackoff({ maxRetries: maxRetriesResult })
    };
  }

  // core/telemetry/assemble-operation-name.ts
  function assembleOperationName({
    operationId,
    telemetry
  }) {
    return {
      // standardized operation and resource name:
      "operation.name": `${operationId}${(telemetry == null ? void 0 : telemetry.functionId) != null ? ` ${telemetry.functionId}` : ""}`,
      "resource.name": telemetry == null ? void 0 : telemetry.functionId,
      // detailed, AI SDK specific data:
      "ai.operationId": operationId,
      "ai.telemetry.functionId": telemetry == null ? void 0 : telemetry.functionId
    };
  }

  // core/telemetry/get-base-telemetry-attributes.ts
  function getBaseTelemetryAttributes({
    model,
    settings,
    telemetry,
    headers
  }) {
    var _a17;
    return {
      "ai.model.provider": model.provider,
      "ai.model.id": model.modelId,
      // settings:
      ...Object.entries(settings).reduce((attributes, [key, value]) => {
        attributes[`ai.settings.${key}`] = value;
        return attributes;
      }, {}),
      // add metadata as attributes:
      ...Object.entries((_a17 = telemetry == null ? void 0 : telemetry.metadata) != null ? _a17 : {}).reduce(
        (attributes, [key, value]) => {
          attributes[`ai.telemetry.metadata.${key}`] = value;
          return attributes;
        },
        {}
      ),
      // request headers
      ...Object.entries(headers != null ? headers : {}).reduce((attributes, [key, value]) => {
        if (value !== void 0) {
          attributes[`ai.request.headers.${key}`] = value;
        }
        return attributes;
      }, {})
    };
  }

  // core/telemetry/noop-tracer.ts
  var noopTracer = {
    startSpan() {
      return noopSpan;
    },
    startActiveSpan(name17, arg1, arg2, arg3) {
      if (typeof arg1 === "function") {
        return arg1(noopSpan);
      }
      if (typeof arg2 === "function") {
        return arg2(noopSpan);
      }
      if (typeof arg3 === "function") {
        return arg3(noopSpan);
      }
    }
  };
  var noopSpan = {
    spanContext() {
      return noopSpanContext;
    },
    setAttribute() {
      return this;
    },
    setAttributes() {
      return this;
    },
    addEvent() {
      return this;
    },
    addLink() {
      return this;
    },
    addLinks() {
      return this;
    },
    setStatus() {
      return this;
    },
    updateName() {
      return this;
    },
    end() {
      return this;
    },
    isRecording() {
      return false;
    },
    recordException() {
      return this;
    }
  };
  var noopSpanContext = {
    traceId: "",
    spanId: "",
    traceFlags: 0
  };

  // core/telemetry/get-tracer.ts
  function getTracer({
    isEnabled = false,
    tracer
  } = {}) {
    if (!isEnabled) {
      return noopTracer;
    }
    if (tracer) {
      return tracer;
    }
    return trace.getTracer("ai");
  }
  function recordSpan({
    name: name17,
    tracer,
    attributes,
    fn,
    endWhenDone = true
  }) {
    return tracer.startActiveSpan(name17, { attributes }, async (span) => {
      try {
        const result = await fn(span);
        if (endWhenDone) {
          span.end();
        }
        return result;
      } catch (error) {
        try {
          recordErrorOnSpan(span, error);
        } finally {
          span.end();
        }
        throw error;
      }
    });
  }
  function recordErrorOnSpan(span, error) {
    if (error instanceof Error) {
      span.recordException({
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      });
    } else {
      span.setStatus({ code: SpanStatusCode.ERROR });
    }
  }

  // core/telemetry/select-telemetry-attributes.ts
  function selectTelemetryAttributes({
    telemetry,
    attributes
  }) {
    if ((telemetry == null ? void 0 : telemetry.isEnabled) !== true) {
      return {};
    }
    return Object.entries(attributes).reduce((attributes2, [key, value]) => {
      if (value === void 0) {
        return attributes2;
      }
      if (typeof value === "object" && "input" in value && typeof value.input === "function") {
        if ((telemetry == null ? void 0 : telemetry.recordInputs) === false) {
          return attributes2;
        }
        const result = value.input();
        return result === void 0 ? attributes2 : { ...attributes2, [key]: result };
      }
      if (typeof value === "object" && "output" in value && typeof value.output === "function") {
        if ((telemetry == null ? void 0 : telemetry.recordOutputs) === false) {
          return attributes2;
        }
        const result = value.output();
        return result === void 0 ? attributes2 : { ...attributes2, [key]: result };
      }
      return { ...attributes2, [key]: value };
    }, {});
  }
  var DefaultGeneratedFile = class {
    constructor({
      data,
      mimeType
    }) {
      const isUint8Array = data instanceof Uint8Array;
      this.base64Data = isUint8Array ? void 0 : data;
      this.uint8ArrayData = isUint8Array ? data : void 0;
      this.mimeType = mimeType;
    }
    // lazy conversion with caching to avoid unnecessary conversion overhead:
    get base64() {
      if (this.base64Data == null) {
        this.base64Data = convertUint8ArrayToBase64(this.uint8ArrayData);
      }
      return this.base64Data;
    }
    // lazy conversion with caching to avoid unnecessary conversion overhead:
    get uint8Array() {
      if (this.uint8ArrayData == null) {
        this.uint8ArrayData = convertBase64ToUint8Array(this.base64Data);
      }
      return this.uint8ArrayData;
    }
  };
  var DefaultGeneratedFileWithType = class extends DefaultGeneratedFile {
    constructor(options) {
      super(options);
      this.type = "file";
    }
  };
  var imageMimeTypeSignatures = [
    {
      mimeType: "image/gif",
      bytesPrefix: [71, 73, 70],
      base64Prefix: "R0lG"
    },
    {
      mimeType: "image/png",
      bytesPrefix: [137, 80, 78, 71],
      base64Prefix: "iVBORw"
    },
    {
      mimeType: "image/jpeg",
      bytesPrefix: [255, 216],
      base64Prefix: "/9j/"
    },
    {
      mimeType: "image/webp",
      bytesPrefix: [82, 73, 70, 70],
      base64Prefix: "UklGRg"
    },
    {
      mimeType: "image/bmp",
      bytesPrefix: [66, 77],
      base64Prefix: "Qk"
    },
    {
      mimeType: "image/tiff",
      bytesPrefix: [73, 73, 42, 0],
      base64Prefix: "SUkqAA"
    },
    {
      mimeType: "image/tiff",
      bytesPrefix: [77, 77, 0, 42],
      base64Prefix: "TU0AKg"
    },
    {
      mimeType: "image/avif",
      bytesPrefix: [
        0,
        0,
        0,
        32,
        102,
        116,
        121,
        112,
        97,
        118,
        105,
        102
      ],
      base64Prefix: "AAAAIGZ0eXBhdmlm"
    },
    {
      mimeType: "image/heic",
      bytesPrefix: [
        0,
        0,
        0,
        32,
        102,
        116,
        121,
        112,
        104,
        101,
        105,
        99
      ],
      base64Prefix: "AAAAIGZ0eXBoZWlj"
    }
  ];
  var stripID3 = (data) => {
    const bytes = typeof data === "string" ? convertBase64ToUint8Array(data) : data;
    const id3Size = (bytes[6] & 127) << 21 | (bytes[7] & 127) << 14 | (bytes[8] & 127) << 7 | bytes[9] & 127;
    return bytes.slice(id3Size + 10);
  };
  function stripID3TagsIfPresent(data) {
    const hasId3 = typeof data === "string" && data.startsWith("SUQz") || typeof data !== "string" && data.length > 10 && data[0] === 73 && // 'I'
    data[1] === 68 && // 'D'
    data[2] === 51;
    return hasId3 ? stripID3(data) : data;
  }
  function detectMimeType({
    data,
    signatures
  }) {
    const processedData = stripID3TagsIfPresent(data);
    for (const signature of signatures) {
      if (typeof processedData === "string" ? processedData.startsWith(signature.base64Prefix) : processedData.length >= signature.bytesPrefix.length && signature.bytesPrefix.every(
        (byte, index) => processedData[index] === byte
      )) {
        return signature.mimeType;
      }
    }
    return void 0;
  }
  var name4 = "AI_NoObjectGeneratedError";
  var marker4 = `vercel.ai.error.${name4}`;
  var symbol4 = Symbol.for(marker4);
  var _a4;
  var NoObjectGeneratedError = class extends AISDKError {
    constructor({
      message = "No object generated.",
      cause,
      text: text2,
      response,
      usage,
      finishReason
    }) {
      super({ name: name4, message, cause });
      this[_a4] = true;
      this.text = text2;
      this.response = response;
      this.usage = usage;
      this.finishReason = finishReason;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker4);
    }
  };
  _a4 = symbol4;
  var name5 = "AI_DownloadError";
  var marker5 = `vercel.ai.error.${name5}`;
  var symbol5 = Symbol.for(marker5);
  var _a5;
  var DownloadError = class extends AISDKError {
    constructor({
      url,
      statusCode,
      statusText,
      cause,
      message = cause == null ? `Failed to download ${url}: ${statusCode} ${statusText}` : `Failed to download ${url}: ${cause}`
    }) {
      super({ name: name5, message, cause });
      this[_a5] = true;
      this.url = url;
      this.statusCode = statusCode;
      this.statusText = statusText;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker5);
    }
  };
  _a5 = symbol5;

  // util/download.ts
  async function download({ url }) {
    var _a17;
    const urlText = url.toString();
    try {
      const response = await fetch(urlText);
      if (!response.ok) {
        throw new DownloadError({
          url: urlText,
          statusCode: response.status,
          statusText: response.statusText
        });
      }
      return {
        data: new Uint8Array(await response.arrayBuffer()),
        mimeType: (_a17 = response.headers.get("content-type")) != null ? _a17 : void 0
      };
    } catch (error) {
      if (DownloadError.isInstance(error)) {
        throw error;
      }
      throw new DownloadError({ url: urlText, cause: error });
    }
  }
  var name6 = "AI_InvalidDataContentError";
  var marker6 = `vercel.ai.error.${name6}`;
  var symbol6 = Symbol.for(marker6);
  var _a6;
  var InvalidDataContentError = class extends AISDKError {
    constructor({
      content,
      cause,
      message = `Invalid data content. Expected a base64 string, Uint8Array, ArrayBuffer, or Buffer, but got ${typeof content}.`
    }) {
      super({ name: name6, message, cause });
      this[_a6] = true;
      this.content = content;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker6);
    }
  };
  _a6 = symbol6;
  var dataContentSchema = unionType([
    stringType(),
    instanceOfType(Uint8Array),
    instanceOfType(ArrayBuffer),
    custom(
      // Buffer might not be available in some environments such as CloudFlare:
      (value) => {
        var _a17, _b;
        return (_b = (_a17 = globalThis.Buffer) == null ? void 0 : _a17.isBuffer(value)) != null ? _b : false;
      },
      { message: "Must be a Buffer" }
    )
  ]);
  function convertDataContentToBase64String(content) {
    if (typeof content === "string") {
      return content;
    }
    if (content instanceof ArrayBuffer) {
      return convertUint8ArrayToBase64(new Uint8Array(content));
    }
    return convertUint8ArrayToBase64(content);
  }
  function convertDataContentToUint8Array(content) {
    if (content instanceof Uint8Array) {
      return content;
    }
    if (typeof content === "string") {
      try {
        return convertBase64ToUint8Array(content);
      } catch (error) {
        throw new InvalidDataContentError({
          message: "Invalid data content. Content string is not a base64-encoded media.",
          content,
          cause: error
        });
      }
    }
    if (content instanceof ArrayBuffer) {
      return new Uint8Array(content);
    }
    throw new InvalidDataContentError({ content });
  }
  function convertUint8ArrayToText(uint8Array) {
    try {
      return new TextDecoder().decode(uint8Array);
    } catch (error) {
      throw new Error("Error decoding Uint8Array to text");
    }
  }
  var name7 = "AI_InvalidMessageRoleError";
  var marker7 = `vercel.ai.error.${name7}`;
  var symbol7 = Symbol.for(marker7);
  var _a7;
  var InvalidMessageRoleError = class extends AISDKError {
    constructor({
      role,
      message = `Invalid message role: '${role}'. Must be one of: "system", "user", "assistant", "tool".`
    }) {
      super({ name: name7, message });
      this[_a7] = true;
      this.role = role;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker7);
    }
  };
  _a7 = symbol7;

  // core/prompt/split-data-url.ts
  function splitDataUrl(dataUrl) {
    try {
      const [header, base64Content] = dataUrl.split(",");
      return {
        mimeType: header.split(";")[0].split(":")[1],
        base64Content
      };
    } catch (error) {
      return {
        mimeType: void 0,
        base64Content: void 0
      };
    }
  }

  // core/prompt/convert-to-language-model-prompt.ts
  async function convertToLanguageModelPrompt({
    prompt,
    modelSupportsImageUrls = true,
    modelSupportsUrl = () => false,
    downloadImplementation = download
  }) {
    const downloadedAssets = await downloadAssets(
      prompt.messages,
      downloadImplementation,
      modelSupportsImageUrls,
      modelSupportsUrl
    );
    return [
      ...prompt.system != null ? [{ role: "system", content: prompt.system }] : [],
      ...prompt.messages.map(
        (message) => convertToLanguageModelMessage(message, downloadedAssets)
      )
    ];
  }
  function convertToLanguageModelMessage(message, downloadedAssets) {
    var _a17, _b, _c, _d, _e, _f;
    const role = message.role;
    switch (role) {
      case "system": {
        return {
          role: "system",
          content: message.content,
          providerMetadata: (_a17 = message.providerOptions) != null ? _a17 : message.experimental_providerMetadata
        };
      }
      case "user": {
        if (typeof message.content === "string") {
          return {
            role: "user",
            content: [{ type: "text", text: message.content }],
            providerMetadata: (_b = message.providerOptions) != null ? _b : message.experimental_providerMetadata
          };
        }
        return {
          role: "user",
          content: message.content.map((part) => convertPartToLanguageModelPart(part, downloadedAssets)).filter((part) => part.type !== "text" || part.text !== ""),
          providerMetadata: (_c = message.providerOptions) != null ? _c : message.experimental_providerMetadata
        };
      }
      case "assistant": {
        if (typeof message.content === "string") {
          return {
            role: "assistant",
            content: [{ type: "text", text: message.content }],
            providerMetadata: (_d = message.providerOptions) != null ? _d : message.experimental_providerMetadata
          };
        }
        return {
          role: "assistant",
          content: message.content.filter(
            // remove empty text parts:
            (part) => part.type !== "text" || part.text !== ""
          ).map((part) => {
            var _a18;
            const providerOptions = (_a18 = part.providerOptions) != null ? _a18 : part.experimental_providerMetadata;
            switch (part.type) {
              case "file": {
                return {
                  type: "file",
                  data: part.data instanceof URL ? part.data : convertDataContentToBase64String(part.data),
                  filename: part.filename,
                  mimeType: part.mimeType,
                  providerMetadata: providerOptions
                };
              }
              case "reasoning": {
                return {
                  type: "reasoning",
                  text: part.text,
                  signature: part.signature,
                  providerMetadata: providerOptions
                };
              }
              case "redacted-reasoning": {
                return {
                  type: "redacted-reasoning",
                  data: part.data,
                  providerMetadata: providerOptions
                };
              }
              case "text": {
                return {
                  type: "text",
                  text: part.text,
                  providerMetadata: providerOptions
                };
              }
              case "tool-call": {
                return {
                  type: "tool-call",
                  toolCallId: part.toolCallId,
                  toolName: part.toolName,
                  args: part.args,
                  providerMetadata: providerOptions
                };
              }
            }
          }),
          providerMetadata: (_e = message.providerOptions) != null ? _e : message.experimental_providerMetadata
        };
      }
      case "tool": {
        return {
          role: "tool",
          content: message.content.map((part) => {
            var _a18;
            return {
              type: "tool-result",
              toolCallId: part.toolCallId,
              toolName: part.toolName,
              result: part.result,
              content: part.experimental_content,
              isError: part.isError,
              providerMetadata: (_a18 = part.providerOptions) != null ? _a18 : part.experimental_providerMetadata
            };
          }),
          providerMetadata: (_f = message.providerOptions) != null ? _f : message.experimental_providerMetadata
        };
      }
      default: {
        const _exhaustiveCheck = role;
        throw new InvalidMessageRoleError({ role: _exhaustiveCheck });
      }
    }
  }
  async function downloadAssets(messages, downloadImplementation, modelSupportsImageUrls, modelSupportsUrl) {
    const urls = messages.filter((message) => message.role === "user").map((message) => message.content).filter(
      (content) => Array.isArray(content)
    ).flat().filter(
      (part) => part.type === "image" || part.type === "file"
    ).filter(
      (part) => !(part.type === "image" && modelSupportsImageUrls === true)
    ).map((part) => part.type === "image" ? part.image : part.data).map(
      (part) => (
        // support string urls:
        typeof part === "string" && (part.startsWith("http:") || part.startsWith("https:")) ? new URL(part) : part
      )
    ).filter((image) => image instanceof URL).filter((url) => !modelSupportsUrl(url));
    const downloadedImages = await Promise.all(
      urls.map(async (url) => ({
        url,
        data: await downloadImplementation({ url })
      }))
    );
    return Object.fromEntries(
      downloadedImages.map(({ url, data }) => [url.toString(), data])
    );
  }
  function convertPartToLanguageModelPart(part, downloadedAssets) {
    var _a17, _b, _c, _d;
    if (part.type === "text") {
      return {
        type: "text",
        text: part.text,
        providerMetadata: (_a17 = part.providerOptions) != null ? _a17 : part.experimental_providerMetadata
      };
    }
    let mimeType = part.mimeType;
    let data;
    let content;
    let normalizedData;
    const type = part.type;
    switch (type) {
      case "image":
        data = part.image;
        break;
      case "file":
        data = part.data;
        break;
      default:
        throw new Error(`Unsupported part type: ${type}`);
    }
    try {
      content = typeof data === "string" ? new URL(data) : data;
    } catch (error) {
      content = data;
    }
    if (content instanceof URL) {
      if (content.protocol === "data:") {
        const { mimeType: dataUrlMimeType, base64Content } = splitDataUrl(
          content.toString()
        );
        if (dataUrlMimeType == null || base64Content == null) {
          throw new Error(`Invalid data URL format in part ${type}`);
        }
        mimeType = dataUrlMimeType;
        normalizedData = convertDataContentToUint8Array(base64Content);
      } else {
        const downloadedFile = downloadedAssets[content.toString()];
        if (downloadedFile) {
          normalizedData = downloadedFile.data;
          mimeType != null ? mimeType : mimeType = downloadedFile.mimeType;
        } else {
          normalizedData = content;
        }
      }
    } else {
      normalizedData = convertDataContentToUint8Array(content);
    }
    switch (type) {
      case "image": {
        if (normalizedData instanceof Uint8Array) {
          mimeType = (_b = detectMimeType({
            data: normalizedData,
            signatures: imageMimeTypeSignatures
          })) != null ? _b : mimeType;
        }
        return {
          type: "image",
          image: normalizedData,
          mimeType,
          providerMetadata: (_c = part.providerOptions) != null ? _c : part.experimental_providerMetadata
        };
      }
      case "file": {
        if (mimeType == null) {
          throw new Error(`Mime type is missing for file part`);
        }
        return {
          type: "file",
          data: normalizedData instanceof Uint8Array ? convertDataContentToBase64String(normalizedData) : normalizedData,
          filename: part.filename,
          mimeType,
          providerMetadata: (_d = part.providerOptions) != null ? _d : part.experimental_providerMetadata
        };
      }
    }
  }

  // core/prompt/prepare-call-settings.ts
  function prepareCallSettings({
    maxTokens,
    temperature,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    stopSequences,
    seed
  }) {
    if (maxTokens != null) {
      if (!Number.isInteger(maxTokens)) {
        throw new InvalidArgumentError({
          parameter: "maxTokens",
          value: maxTokens,
          message: "maxTokens must be an integer"
        });
      }
      if (maxTokens < 1) {
        throw new InvalidArgumentError({
          parameter: "maxTokens",
          value: maxTokens,
          message: "maxTokens must be >= 1"
        });
      }
    }
    if (temperature != null) {
      if (typeof temperature !== "number") {
        throw new InvalidArgumentError({
          parameter: "temperature",
          value: temperature,
          message: "temperature must be a number"
        });
      }
    }
    if (topP != null) {
      if (typeof topP !== "number") {
        throw new InvalidArgumentError({
          parameter: "topP",
          value: topP,
          message: "topP must be a number"
        });
      }
    }
    if (topK != null) {
      if (typeof topK !== "number") {
        throw new InvalidArgumentError({
          parameter: "topK",
          value: topK,
          message: "topK must be a number"
        });
      }
    }
    if (presencePenalty != null) {
      if (typeof presencePenalty !== "number") {
        throw new InvalidArgumentError({
          parameter: "presencePenalty",
          value: presencePenalty,
          message: "presencePenalty must be a number"
        });
      }
    }
    if (frequencyPenalty != null) {
      if (typeof frequencyPenalty !== "number") {
        throw new InvalidArgumentError({
          parameter: "frequencyPenalty",
          value: frequencyPenalty,
          message: "frequencyPenalty must be a number"
        });
      }
    }
    if (seed != null) {
      if (!Number.isInteger(seed)) {
        throw new InvalidArgumentError({
          parameter: "seed",
          value: seed,
          message: "seed must be an integer"
        });
      }
    }
    return {
      maxTokens,
      // TODO v5 remove default 0 for temperature
      temperature: temperature != null ? temperature : 0,
      topP,
      topK,
      presencePenalty,
      frequencyPenalty,
      stopSequences: stopSequences != null && stopSequences.length > 0 ? stopSequences : void 0,
      seed
    };
  }

  // core/prompt/attachments-to-parts.ts
  function attachmentsToParts(attachments) {
    var _a17, _b, _c;
    const parts = [];
    for (const attachment of attachments) {
      let url;
      try {
        url = new URL(attachment.url);
      } catch (error) {
        throw new Error(`Invalid URL: ${attachment.url}`);
      }
      switch (url.protocol) {
        case "http:":
        case "https:": {
          if ((_a17 = attachment.contentType) == null ? void 0 : _a17.startsWith("image/")) {
            parts.push({ type: "image", image: url });
          } else {
            if (!attachment.contentType) {
              throw new Error(
                "If the attachment is not an image, it must specify a content type"
              );
            }
            parts.push({
              type: "file",
              data: url,
              mimeType: attachment.contentType
            });
          }
          break;
        }
        case "data:": {
          let header;
          let base64Content;
          let mimeType;
          try {
            [header, base64Content] = attachment.url.split(",");
            mimeType = header.split(";")[0].split(":")[1];
          } catch (error) {
            throw new Error(`Error processing data URL: ${attachment.url}`);
          }
          if (mimeType == null || base64Content == null) {
            throw new Error(`Invalid data URL format: ${attachment.url}`);
          }
          if ((_b = attachment.contentType) == null ? void 0 : _b.startsWith("image/")) {
            parts.push({
              type: "image",
              image: convertDataContentToUint8Array(base64Content)
            });
          } else if ((_c = attachment.contentType) == null ? void 0 : _c.startsWith("text/")) {
            parts.push({
              type: "text",
              text: convertUint8ArrayToText(
                convertDataContentToUint8Array(base64Content)
              )
            });
          } else {
            if (!attachment.contentType) {
              throw new Error(
                "If the attachment is not an image or text, it must specify a content type"
              );
            }
            parts.push({
              type: "file",
              data: base64Content,
              mimeType: attachment.contentType
            });
          }
          break;
        }
        default: {
          throw new Error(`Unsupported URL protocol: ${url.protocol}`);
        }
      }
    }
    return parts;
  }
  var name8 = "AI_MessageConversionError";
  var marker8 = `vercel.ai.error.${name8}`;
  var symbol8 = Symbol.for(marker8);
  var _a8;
  var MessageConversionError = class extends AISDKError {
    constructor({
      originalMessage,
      message
    }) {
      super({ name: name8, message });
      this[_a8] = true;
      this.originalMessage = originalMessage;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker8);
    }
  };
  _a8 = symbol8;

  // core/prompt/convert-to-core-messages.ts
  function convertToCoreMessages(messages, options) {
    var _a17, _b;
    const tools = (_a17 = options == null ? void 0 : options.tools) != null ? _a17 : {};
    const coreMessages = [];
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const isLastMessage = i === messages.length - 1;
      const { role, content, experimental_attachments } = message;
      switch (role) {
        case "system": {
          coreMessages.push({
            role: "system",
            content
          });
          break;
        }
        case "user": {
          if (message.parts == null) {
            coreMessages.push({
              role: "user",
              content: experimental_attachments ? [
                { type: "text", text: content },
                ...attachmentsToParts(experimental_attachments)
              ] : content
            });
          } else {
            const textParts = message.parts.filter((part) => part.type === "text").map((part) => ({
              type: "text",
              text: part.text
            }));
            coreMessages.push({
              role: "user",
              content: experimental_attachments ? [...textParts, ...attachmentsToParts(experimental_attachments)] : textParts
            });
          }
          break;
        }
        case "assistant": {
          if (message.parts != null) {
            let processBlock2 = function() {
              const content2 = [];
              for (const part of block) {
                switch (part.type) {
                  case "file":
                  case "text": {
                    content2.push(part);
                    break;
                  }
                  case "reasoning": {
                    for (const detail of part.details) {
                      switch (detail.type) {
                        case "text":
                          content2.push({
                            type: "reasoning",
                            text: detail.text,
                            signature: detail.signature
                          });
                          break;
                        case "redacted":
                          content2.push({
                            type: "redacted-reasoning",
                            data: detail.data
                          });
                          break;
                      }
                    }
                    break;
                  }
                  case "tool-invocation":
                    content2.push({
                      type: "tool-call",
                      toolCallId: part.toolInvocation.toolCallId,
                      toolName: part.toolInvocation.toolName,
                      args: part.toolInvocation.args
                    });
                    break;
                  default: {
                    const _exhaustiveCheck = part;
                    throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
                  }
                }
              }
              coreMessages.push({
                role: "assistant",
                content: content2
              });
              const stepInvocations = block.filter(
                (part) => part.type === "tool-invocation"
              ).map((part) => part.toolInvocation);
              if (stepInvocations.length > 0) {
                coreMessages.push({
                  role: "tool",
                  content: stepInvocations.map(
                    (toolInvocation) => {
                      if (!("result" in toolInvocation)) {
                        throw new MessageConversionError({
                          originalMessage: message,
                          message: "ToolInvocation must have a result: " + JSON.stringify(toolInvocation)
                        });
                      }
                      const { toolCallId, toolName, result } = toolInvocation;
                      const tool2 = tools[toolName];
                      return (tool2 == null ? void 0 : tool2.experimental_toToolResultContent) != null ? {
                        type: "tool-result",
                        toolCallId,
                        toolName,
                        result: tool2.experimental_toToolResultContent(result),
                        experimental_content: tool2.experimental_toToolResultContent(result)
                      } : {
                        type: "tool-result",
                        toolCallId,
                        toolName,
                        result
                      };
                    }
                  )
                });
              }
              block = [];
              blockHasToolInvocations = false;
              currentStep++;
            };
            let currentStep = 0;
            let blockHasToolInvocations = false;
            let block = [];
            for (const part of message.parts) {
              switch (part.type) {
                case "text": {
                  if (blockHasToolInvocations) {
                    processBlock2();
                  }
                  block.push(part);
                  break;
                }
                case "file":
                case "reasoning": {
                  block.push(part);
                  break;
                }
                case "tool-invocation": {
                  if (((_b = part.toolInvocation.step) != null ? _b : 0) !== currentStep) {
                    processBlock2();
                  }
                  block.push(part);
                  blockHasToolInvocations = true;
                  break;
                }
              }
            }
            processBlock2();
            break;
          }
          const toolInvocations = message.toolInvocations;
          if (toolInvocations == null || toolInvocations.length === 0) {
            coreMessages.push({ role: "assistant", content });
            break;
          }
          const maxStep = toolInvocations.reduce((max, toolInvocation) => {
            var _a18;
            return Math.max(max, (_a18 = toolInvocation.step) != null ? _a18 : 0);
          }, 0);
          for (let i2 = 0; i2 <= maxStep; i2++) {
            const stepInvocations = toolInvocations.filter(
              (toolInvocation) => {
                var _a18;
                return ((_a18 = toolInvocation.step) != null ? _a18 : 0) === i2;
              }
            );
            if (stepInvocations.length === 0) {
              continue;
            }
            coreMessages.push({
              role: "assistant",
              content: [
                ...isLastMessage && content && i2 === 0 ? [{ type: "text", text: content }] : [],
                ...stepInvocations.map(
                  ({ toolCallId, toolName, args }) => ({
                    type: "tool-call",
                    toolCallId,
                    toolName,
                    args
                  })
                )
              ]
            });
            coreMessages.push({
              role: "tool",
              content: stepInvocations.map((toolInvocation) => {
                if (!("result" in toolInvocation)) {
                  throw new MessageConversionError({
                    originalMessage: message,
                    message: "ToolInvocation must have a result: " + JSON.stringify(toolInvocation)
                  });
                }
                const { toolCallId, toolName, result } = toolInvocation;
                const tool2 = tools[toolName];
                return (tool2 == null ? void 0 : tool2.experimental_toToolResultContent) != null ? {
                  type: "tool-result",
                  toolCallId,
                  toolName,
                  result: tool2.experimental_toToolResultContent(result),
                  experimental_content: tool2.experimental_toToolResultContent(result)
                } : {
                  type: "tool-result",
                  toolCallId,
                  toolName,
                  result
                };
              })
            });
          }
          if (content && !isLastMessage) {
            coreMessages.push({ role: "assistant", content });
          }
          break;
        }
        case "data": {
          break;
        }
        default: {
          const _exhaustiveCheck = role;
          throw new MessageConversionError({
            originalMessage: message,
            message: `Unsupported role: ${_exhaustiveCheck}`
          });
        }
      }
    }
    return coreMessages;
  }
  var jsonValueSchema = lazyType(
    () => unionType([
      nullType(),
      stringType(),
      numberType(),
      booleanType(),
      recordType(stringType(), jsonValueSchema),
      arrayType(jsonValueSchema)
    ])
  );

  // core/types/provider-metadata.ts
  var providerMetadataSchema = recordType(
    stringType(),
    recordType(stringType(), jsonValueSchema)
  );
  var toolResultContentSchema = arrayType(
    unionType([
      objectType({ type: literalType("text"), text: stringType() }),
      objectType({
        type: literalType("image"),
        data: stringType(),
        mimeType: stringType().optional()
      })
    ])
  );

  // core/prompt/content-part.ts
  var textPartSchema = objectType({
    type: literalType("text"),
    text: stringType(),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var imagePartSchema = objectType({
    type: literalType("image"),
    image: unionType([dataContentSchema, instanceOfType(URL)]),
    mimeType: stringType().optional(),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var filePartSchema = objectType({
    type: literalType("file"),
    data: unionType([dataContentSchema, instanceOfType(URL)]),
    filename: stringType().optional(),
    mimeType: stringType(),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var reasoningPartSchema = objectType({
    type: literalType("reasoning"),
    text: stringType(),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var redactedReasoningPartSchema = objectType({
    type: literalType("redacted-reasoning"),
    data: stringType(),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var toolCallPartSchema = objectType({
    type: literalType("tool-call"),
    toolCallId: stringType(),
    toolName: stringType(),
    args: unknownType(),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var toolResultPartSchema = objectType({
    type: literalType("tool-result"),
    toolCallId: stringType(),
    toolName: stringType(),
    result: unknownType(),
    content: toolResultContentSchema.optional(),
    isError: booleanType().optional(),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });

  // core/prompt/message.ts
  var coreSystemMessageSchema = objectType({
    role: literalType("system"),
    content: stringType(),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var coreUserMessageSchema = objectType({
    role: literalType("user"),
    content: unionType([
      stringType(),
      arrayType(unionType([textPartSchema, imagePartSchema, filePartSchema]))
    ]),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var coreAssistantMessageSchema = objectType({
    role: literalType("assistant"),
    content: unionType([
      stringType(),
      arrayType(
        unionType([
          textPartSchema,
          filePartSchema,
          reasoningPartSchema,
          redactedReasoningPartSchema,
          toolCallPartSchema
        ])
      )
    ]),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var coreToolMessageSchema = objectType({
    role: literalType("tool"),
    content: arrayType(toolResultPartSchema),
    providerOptions: providerMetadataSchema.optional(),
    experimental_providerMetadata: providerMetadataSchema.optional()
  });
  var coreMessageSchema = unionType([
    coreSystemMessageSchema,
    coreUserMessageSchema,
    coreAssistantMessageSchema,
    coreToolMessageSchema
  ]);

  // core/prompt/standardize-prompt.ts
  function standardizePrompt({
    prompt,
    tools
  }) {
    if (prompt.prompt == null && prompt.messages == null) {
      throw new InvalidPromptError({
        prompt,
        message: "prompt or messages must be defined"
      });
    }
    if (prompt.prompt != null && prompt.messages != null) {
      throw new InvalidPromptError({
        prompt,
        message: "prompt and messages cannot be defined at the same time"
      });
    }
    if (prompt.system != null && typeof prompt.system !== "string") {
      throw new InvalidPromptError({
        prompt,
        message: "system must be a string"
      });
    }
    if (prompt.prompt != null) {
      if (typeof prompt.prompt !== "string") {
        throw new InvalidPromptError({
          prompt,
          message: "prompt must be a string"
        });
      }
      return {
        type: "prompt",
        system: prompt.system,
        messages: [
          {
            role: "user",
            content: prompt.prompt
          }
        ]
      };
    }
    if (prompt.messages != null) {
      const promptType = detectPromptType(prompt.messages);
      const messages = promptType === "ui-messages" ? convertToCoreMessages(prompt.messages, {
        tools
      }) : prompt.messages;
      if (messages.length === 0) {
        throw new InvalidPromptError({
          prompt,
          message: "messages must not be empty"
        });
      }
      const validationResult = safeValidateTypes({
        value: messages,
        schema: arrayType(coreMessageSchema)
      });
      if (!validationResult.success) {
        throw new InvalidPromptError({
          prompt,
          message: [
            "message must be a CoreMessage or a UI message",
            `Validation error: ${validationResult.error.message}`
          ].join("\n"),
          cause: validationResult.error
        });
      }
      return {
        type: "messages",
        messages,
        system: prompt.system
      };
    }
    throw new Error("unreachable");
  }
  function detectPromptType(prompt) {
    if (!Array.isArray(prompt)) {
      throw new InvalidPromptError({
        prompt,
        message: [
          "messages must be an array of CoreMessage or UIMessage",
          `Received non-array value: ${JSON.stringify(prompt)}`
        ].join("\n"),
        cause: prompt
      });
    }
    if (prompt.length === 0) {
      return "messages";
    }
    const characteristics = prompt.map(detectSingleMessageCharacteristics);
    if (characteristics.some((c) => c === "has-ui-specific-parts")) {
      return "ui-messages";
    }
    const nonMessageIndex = characteristics.findIndex(
      (c) => c !== "has-core-specific-parts" && c !== "message"
    );
    if (nonMessageIndex === -1) {
      return "messages";
    }
    throw new InvalidPromptError({
      prompt,
      message: [
        "messages must be an array of CoreMessage or UIMessage",
        `Received message of type: "${characteristics[nonMessageIndex]}" at index ${nonMessageIndex}`,
        `messages[${nonMessageIndex}]: ${JSON.stringify(prompt[nonMessageIndex])}`
      ].join("\n"),
      cause: prompt
    });
  }
  function detectSingleMessageCharacteristics(message) {
    if (typeof message === "object" && message !== null && (message.role === "function" || // UI-only role
    message.role === "data" || // UI-only role
    "toolInvocations" in message || // UI-specific field
    "parts" in message || // UI-specific field
    "experimental_attachments" in message)) {
      return "has-ui-specific-parts";
    } else if (typeof message === "object" && message !== null && "content" in message && (Array.isArray(message.content) || // Core messages can have array content
    "experimental_providerMetadata" in message || "providerOptions" in message)) {
      return "has-core-specific-parts";
    } else if (typeof message === "object" && message !== null && "role" in message && "content" in message && typeof message.content === "string" && ["system", "user", "assistant", "tool"].includes(message.role)) {
      return "message";
    } else {
      return "other";
    }
  }

  // core/types/usage.ts
  function calculateLanguageModelUsage({
    promptTokens,
    completionTokens
  }) {
    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };
  }
  function addLanguageModelUsage(usage1, usage2) {
    return {
      promptTokens: usage1.promptTokens + usage2.promptTokens,
      completionTokens: usage1.completionTokens + usage2.completionTokens,
      totalTokens: usage1.totalTokens + usage2.totalTokens
    };
  }

  // core/generate-object/inject-json-instruction.ts
  var DEFAULT_SCHEMA_PREFIX = "JSON schema:";
  var DEFAULT_SCHEMA_SUFFIX = "You MUST answer with a JSON object that matches the JSON schema above.";
  var DEFAULT_GENERIC_SUFFIX = "You MUST answer with JSON.";
  function injectJsonInstruction({
    prompt,
    schema,
    schemaPrefix = schema != null ? DEFAULT_SCHEMA_PREFIX : void 0,
    schemaSuffix = schema != null ? DEFAULT_SCHEMA_SUFFIX : DEFAULT_GENERIC_SUFFIX
  }) {
    return [
      prompt != null && prompt.length > 0 ? prompt : void 0,
      prompt != null && prompt.length > 0 ? "" : void 0,
      // add a newline if prompt is not null
      schemaPrefix,
      schema != null ? JSON.stringify(schema) : void 0,
      schemaSuffix
    ].filter((line) => line != null).join("\n");
  }

  // core/util/async-iterable-stream.ts
  function createAsyncIterableStream(source) {
    const stream = source.pipeThrough(new TransformStream());
    stream[Symbol.asyncIterator] = () => {
      const reader = stream.getReader();
      return {
        async next() {
          const { done, value } = await reader.read();
          return done ? { done: true, value: void 0 } : { done: false, value };
        }
      };
    };
    return stream;
  }

  // core/generate-object/output-strategy.ts
  var noSchemaOutputStrategy = {
    type: "no-schema",
    jsonSchema: void 0,
    validatePartialResult({ value, textDelta }) {
      return { success: true, value: { partial: value, textDelta } };
    },
    validateFinalResult(value, context) {
      return value === void 0 ? {
        success: false,
        error: new NoObjectGeneratedError({
          message: "No object generated: response did not match schema.",
          text: context.text,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        })
      } : { success: true, value };
    },
    createElementStream() {
      throw new UnsupportedFunctionalityError({
        functionality: "element streams in no-schema mode"
      });
    }
  };
  var objectOutputStrategy = (schema) => ({
    type: "object",
    jsonSchema: schema.jsonSchema,
    validatePartialResult({ value, textDelta }) {
      return {
        success: true,
        value: {
          // Note: currently no validation of partial results:
          partial: value,
          textDelta
        }
      };
    },
    validateFinalResult(value) {
      return safeValidateTypes({ value, schema });
    },
    createElementStream() {
      throw new UnsupportedFunctionalityError({
        functionality: "element streams in object mode"
      });
    }
  });
  var arrayOutputStrategy = (schema) => {
    const { $schema, ...itemSchema } = schema.jsonSchema;
    return {
      type: "enum",
      // wrap in object that contains array of elements, since most LLMs will not
      // be able to generate an array directly:
      // possible future optimization: use arrays directly when model supports grammar-guided generation
      jsonSchema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          elements: { type: "array", items: itemSchema }
        },
        required: ["elements"],
        additionalProperties: false
      },
      validatePartialResult({ value, latestObject, isFirstDelta, isFinalDelta }) {
        var _a17;
        if (!isJSONObject(value) || !isJSONArray(value.elements)) {
          return {
            success: false,
            error: new TypeValidationError({
              value,
              cause: "value must be an object that contains an array of elements"
            })
          };
        }
        const inputArray = value.elements;
        const resultArray = [];
        for (let i = 0; i < inputArray.length; i++) {
          const element = inputArray[i];
          const result = safeValidateTypes({ value: element, schema });
          if (i === inputArray.length - 1 && !isFinalDelta) {
            continue;
          }
          if (!result.success) {
            return result;
          }
          resultArray.push(result.value);
        }
        const publishedElementCount = (_a17 = latestObject == null ? void 0 : latestObject.length) != null ? _a17 : 0;
        let textDelta = "";
        if (isFirstDelta) {
          textDelta += "[";
        }
        if (publishedElementCount > 0) {
          textDelta += ",";
        }
        textDelta += resultArray.slice(publishedElementCount).map((element) => JSON.stringify(element)).join(",");
        if (isFinalDelta) {
          textDelta += "]";
        }
        return {
          success: true,
          value: {
            partial: resultArray,
            textDelta
          }
        };
      },
      validateFinalResult(value) {
        if (!isJSONObject(value) || !isJSONArray(value.elements)) {
          return {
            success: false,
            error: new TypeValidationError({
              value,
              cause: "value must be an object that contains an array of elements"
            })
          };
        }
        const inputArray = value.elements;
        for (const element of inputArray) {
          const result = safeValidateTypes({ value: element, schema });
          if (!result.success) {
            return result;
          }
        }
        return { success: true, value: inputArray };
      },
      createElementStream(originalStream) {
        let publishedElements = 0;
        return createAsyncIterableStream(
          originalStream.pipeThrough(
            new TransformStream({
              transform(chunk, controller) {
                switch (chunk.type) {
                  case "object": {
                    const array = chunk.object;
                    for (; publishedElements < array.length; publishedElements++) {
                      controller.enqueue(array[publishedElements]);
                    }
                    break;
                  }
                  case "text-delta":
                  case "finish":
                  case "error":
                    break;
                  default: {
                    const _exhaustiveCheck = chunk;
                    throw new Error(
                      `Unsupported chunk type: ${_exhaustiveCheck}`
                    );
                  }
                }
              }
            })
          )
        );
      }
    };
  };
  var enumOutputStrategy = (enumValues) => {
    return {
      type: "enum",
      // wrap in object that contains result, since most LLMs will not
      // be able to generate an enum value directly:
      // possible future optimization: use enums directly when model supports top-level enums
      jsonSchema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          result: { type: "string", enum: enumValues }
        },
        required: ["result"],
        additionalProperties: false
      },
      validateFinalResult(value) {
        if (!isJSONObject(value) || typeof value.result !== "string") {
          return {
            success: false,
            error: new TypeValidationError({
              value,
              cause: 'value must be an object that contains a string in the "result" property.'
            })
          };
        }
        const result = value.result;
        return enumValues.includes(result) ? { success: true, value: result } : {
          success: false,
          error: new TypeValidationError({
            value,
            cause: "value must be a string in the enum"
          })
        };
      },
      validatePartialResult() {
        throw new UnsupportedFunctionalityError({
          functionality: "partial results in enum mode"
        });
      },
      createElementStream() {
        throw new UnsupportedFunctionalityError({
          functionality: "element streams in enum mode"
        });
      }
    };
  };
  function getOutputStrategy({
    output,
    schema,
    enumValues
  }) {
    switch (output) {
      case "object":
        return objectOutputStrategy(asSchema(schema));
      case "array":
        return arrayOutputStrategy(asSchema(schema));
      case "enum":
        return enumOutputStrategy(enumValues);
      case "no-schema":
        return noSchemaOutputStrategy;
      default: {
        const _exhaustiveCheck = output;
        throw new Error(`Unsupported output: ${_exhaustiveCheck}`);
      }
    }
  }

  // core/generate-object/validate-object-generation-input.ts
  function validateObjectGenerationInput({
    output,
    mode,
    schema,
    schemaName,
    schemaDescription,
    enumValues
  }) {
    if (output != null && output !== "object" && output !== "array" && output !== "enum" && output !== "no-schema") {
      throw new InvalidArgumentError({
        parameter: "output",
        value: output,
        message: "Invalid output type."
      });
    }
    if (output === "no-schema") {
      if (mode === "auto" || mode === "tool") {
        throw new InvalidArgumentError({
          parameter: "mode",
          value: mode,
          message: 'Mode must be "json" for no-schema output.'
        });
      }
      if (schema != null) {
        throw new InvalidArgumentError({
          parameter: "schema",
          value: schema,
          message: "Schema is not supported for no-schema output."
        });
      }
      if (schemaDescription != null) {
        throw new InvalidArgumentError({
          parameter: "schemaDescription",
          value: schemaDescription,
          message: "Schema description is not supported for no-schema output."
        });
      }
      if (schemaName != null) {
        throw new InvalidArgumentError({
          parameter: "schemaName",
          value: schemaName,
          message: "Schema name is not supported for no-schema output."
        });
      }
      if (enumValues != null) {
        throw new InvalidArgumentError({
          parameter: "enumValues",
          value: enumValues,
          message: "Enum values are not supported for no-schema output."
        });
      }
    }
    if (output === "object") {
      if (schema == null) {
        throw new InvalidArgumentError({
          parameter: "schema",
          value: schema,
          message: "Schema is required for object output."
        });
      }
      if (enumValues != null) {
        throw new InvalidArgumentError({
          parameter: "enumValues",
          value: enumValues,
          message: "Enum values are not supported for object output."
        });
      }
    }
    if (output === "array") {
      if (schema == null) {
        throw new InvalidArgumentError({
          parameter: "schema",
          value: schema,
          message: "Element schema is required for array output."
        });
      }
      if (enumValues != null) {
        throw new InvalidArgumentError({
          parameter: "enumValues",
          value: enumValues,
          message: "Enum values are not supported for array output."
        });
      }
    }
    if (output === "enum") {
      if (schema != null) {
        throw new InvalidArgumentError({
          parameter: "schema",
          value: schema,
          message: "Schema is not supported for enum output."
        });
      }
      if (schemaDescription != null) {
        throw new InvalidArgumentError({
          parameter: "schemaDescription",
          value: schemaDescription,
          message: "Schema description is not supported for enum output."
        });
      }
      if (schemaName != null) {
        throw new InvalidArgumentError({
          parameter: "schemaName",
          value: schemaName,
          message: "Schema name is not supported for enum output."
        });
      }
      if (enumValues == null) {
        throw new InvalidArgumentError({
          parameter: "enumValues",
          value: enumValues,
          message: "Enum values are required for enum output."
        });
      }
      for (const value of enumValues) {
        if (typeof value !== "string") {
          throw new InvalidArgumentError({
            parameter: "enumValues",
            value,
            message: "Enum values must be strings."
          });
        }
      }
    }
  }

  // core/prompt/stringify-for-telemetry.ts
  function stringifyForTelemetry(prompt) {
    const processedPrompt = prompt.map((message) => {
      return {
        ...message,
        content: typeof message.content === "string" ? message.content : message.content.map(processPart)
      };
    });
    return JSON.stringify(processedPrompt);
  }
  function processPart(part) {
    if (part.type === "image") {
      return {
        ...part,
        image: part.image instanceof Uint8Array ? convertDataContentToBase64String(part.image) : part.image
      };
    }
    return part;
  }

  // core/generate-object/generate-object.ts
  var originalGenerateId = createIdGenerator({ prefix: "aiobj", size: 24 });
  async function generateObject({
    model,
    enum: enumValues,
    // rename bc enum is reserved by typescript
    schema: inputSchema,
    schemaName,
    schemaDescription,
    mode,
    output = "object",
    system,
    prompt,
    messages,
    maxRetries: maxRetriesArg,
    abortSignal,
    headers,
    experimental_repairText: repairText,
    experimental_telemetry: telemetry,
    experimental_providerMetadata,
    providerOptions = experimental_providerMetadata,
    _internal: {
      generateId: generateId3 = originalGenerateId,
      currentDate = () => /* @__PURE__ */ new Date()
    } = {},
    ...settings
  }) {
    if (typeof model === "string" || model.specificationVersion !== "v1") {
      throw new UnsupportedModelVersionError();
    }
    validateObjectGenerationInput({
      output,
      mode,
      schema: inputSchema,
      schemaName,
      schemaDescription,
      enumValues
    });
    const { maxRetries, retry } = prepareRetries({ maxRetries: maxRetriesArg });
    const outputStrategy = getOutputStrategy({
      output,
      schema: inputSchema,
      enumValues
    });
    if (outputStrategy.type === "no-schema" && mode === void 0) {
      mode = "json";
    }
    const baseTelemetryAttributes = getBaseTelemetryAttributes({
      model,
      telemetry,
      headers,
      settings: { ...settings, maxRetries }
    });
    const tracer = getTracer(telemetry);
    return recordSpan({
      name: "ai.generateObject",
      attributes: selectTelemetryAttributes({
        telemetry,
        attributes: {
          ...assembleOperationName({
            operationId: "ai.generateObject",
            telemetry
          }),
          ...baseTelemetryAttributes,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: () => JSON.stringify({ system, prompt, messages })
          },
          "ai.schema": outputStrategy.jsonSchema != null ? { input: () => JSON.stringify(outputStrategy.jsonSchema) } : void 0,
          "ai.schema.name": schemaName,
          "ai.schema.description": schemaDescription,
          "ai.settings.output": outputStrategy.type,
          "ai.settings.mode": mode
        }
      }),
      tracer,
      fn: async (span) => {
        var _a17, _b, _c, _d;
        if (mode === "auto" || mode == null) {
          mode = model.defaultObjectGenerationMode;
        }
        let result;
        let finishReason;
        let usage;
        let warnings;
        let rawResponse;
        let response;
        let request;
        let logprobs;
        let resultProviderMetadata;
        switch (mode) {
          case "json": {
            const standardizedPrompt = standardizePrompt({
              prompt: {
                system: outputStrategy.jsonSchema == null ? injectJsonInstruction({ prompt: system }) : model.supportsStructuredOutputs ? system : injectJsonInstruction({
                  prompt: system,
                  schema: outputStrategy.jsonSchema
                }),
                prompt,
                messages
              },
              tools: void 0
            });
            const promptMessages = await convertToLanguageModelPrompt({
              prompt: standardizedPrompt,
              modelSupportsImageUrls: model.supportsImageUrls,
              modelSupportsUrl: (_a17 = model.supportsUrl) == null ? void 0 : _a17.bind(model)
              // support 'this' context
            });
            const generateResult = await retry(
              () => recordSpan({
                name: "ai.generateObject.doGenerate",
                attributes: selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    ...assembleOperationName({
                      operationId: "ai.generateObject.doGenerate",
                      telemetry
                    }),
                    ...baseTelemetryAttributes,
                    "ai.prompt.format": {
                      input: () => standardizedPrompt.type
                    },
                    "ai.prompt.messages": {
                      input: () => JSON.stringify(promptMessages)
                    },
                    "ai.settings.mode": mode,
                    // standardized gen-ai llm span attributes:
                    "gen_ai.system": model.provider,
                    "gen_ai.request.model": model.modelId,
                    "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                    "gen_ai.request.max_tokens": settings.maxTokens,
                    "gen_ai.request.presence_penalty": settings.presencePenalty,
                    "gen_ai.request.temperature": settings.temperature,
                    "gen_ai.request.top_k": settings.topK,
                    "gen_ai.request.top_p": settings.topP
                  }
                }),
                tracer,
                fn: async (span2) => {
                  var _a18, _b2, _c2, _d2, _e, _f;
                  const result2 = await model.doGenerate({
                    mode: {
                      type: "object-json",
                      schema: outputStrategy.jsonSchema,
                      name: schemaName,
                      description: schemaDescription
                    },
                    ...prepareCallSettings(settings),
                    inputFormat: standardizedPrompt.type,
                    prompt: promptMessages,
                    providerMetadata: providerOptions,
                    abortSignal,
                    headers
                  });
                  const responseData = {
                    id: (_b2 = (_a18 = result2.response) == null ? void 0 : _a18.id) != null ? _b2 : generateId3(),
                    timestamp: (_d2 = (_c2 = result2.response) == null ? void 0 : _c2.timestamp) != null ? _d2 : currentDate(),
                    modelId: (_f = (_e = result2.response) == null ? void 0 : _e.modelId) != null ? _f : model.modelId
                  };
                  if (result2.text === void 0) {
                    throw new NoObjectGeneratedError({
                      message: "No object generated: the model did not return a response.",
                      response: responseData,
                      usage: calculateLanguageModelUsage(result2.usage),
                      finishReason: result2.finishReason
                    });
                  }
                  span2.setAttributes(
                    selectTelemetryAttributes({
                      telemetry,
                      attributes: {
                        "ai.response.finishReason": result2.finishReason,
                        "ai.response.object": { output: () => result2.text },
                        "ai.response.id": responseData.id,
                        "ai.response.model": responseData.modelId,
                        "ai.response.timestamp": responseData.timestamp.toISOString(),
                        "ai.response.providerMetadata": JSON.stringify(
                          result2.providerMetadata
                        ),
                        "ai.usage.promptTokens": result2.usage.promptTokens,
                        "ai.usage.completionTokens": result2.usage.completionTokens,
                        // standardized gen-ai llm span attributes:
                        "gen_ai.response.finish_reasons": [result2.finishReason],
                        "gen_ai.response.id": responseData.id,
                        "gen_ai.response.model": responseData.modelId,
                        "gen_ai.usage.prompt_tokens": result2.usage.promptTokens,
                        "gen_ai.usage.completion_tokens": result2.usage.completionTokens
                      }
                    })
                  );
                  return { ...result2, objectText: result2.text, responseData };
                }
              })
            );
            result = generateResult.objectText;
            finishReason = generateResult.finishReason;
            usage = generateResult.usage;
            warnings = generateResult.warnings;
            rawResponse = generateResult.rawResponse;
            logprobs = generateResult.logprobs;
            resultProviderMetadata = generateResult.providerMetadata;
            request = (_b = generateResult.request) != null ? _b : {};
            response = generateResult.responseData;
            break;
          }
          case "tool": {
            const standardizedPrompt = standardizePrompt({
              prompt: { system, prompt, messages },
              tools: void 0
            });
            const promptMessages = await convertToLanguageModelPrompt({
              prompt: standardizedPrompt,
              modelSupportsImageUrls: model.supportsImageUrls,
              modelSupportsUrl: (_c = model.supportsUrl) == null ? void 0 : _c.bind(model)
              // support 'this' context,
            });
            const inputFormat = standardizedPrompt.type;
            const generateResult = await retry(
              () => recordSpan({
                name: "ai.generateObject.doGenerate",
                attributes: selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    ...assembleOperationName({
                      operationId: "ai.generateObject.doGenerate",
                      telemetry
                    }),
                    ...baseTelemetryAttributes,
                    "ai.prompt.format": {
                      input: () => inputFormat
                    },
                    "ai.prompt.messages": {
                      input: () => stringifyForTelemetry(promptMessages)
                    },
                    "ai.settings.mode": mode,
                    // standardized gen-ai llm span attributes:
                    "gen_ai.system": model.provider,
                    "gen_ai.request.model": model.modelId,
                    "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                    "gen_ai.request.max_tokens": settings.maxTokens,
                    "gen_ai.request.presence_penalty": settings.presencePenalty,
                    "gen_ai.request.temperature": settings.temperature,
                    "gen_ai.request.top_k": settings.topK,
                    "gen_ai.request.top_p": settings.topP
                  }
                }),
                tracer,
                fn: async (span2) => {
                  var _a18, _b2, _c2, _d2, _e, _f, _g, _h;
                  const result2 = await model.doGenerate({
                    mode: {
                      type: "object-tool",
                      tool: {
                        type: "function",
                        name: schemaName != null ? schemaName : "json",
                        description: schemaDescription != null ? schemaDescription : "Respond with a JSON object.",
                        parameters: outputStrategy.jsonSchema
                      }
                    },
                    ...prepareCallSettings(settings),
                    inputFormat,
                    prompt: promptMessages,
                    providerMetadata: providerOptions,
                    abortSignal,
                    headers
                  });
                  const objectText = (_b2 = (_a18 = result2.toolCalls) == null ? void 0 : _a18[0]) == null ? void 0 : _b2.args;
                  const responseData = {
                    id: (_d2 = (_c2 = result2.response) == null ? void 0 : _c2.id) != null ? _d2 : generateId3(),
                    timestamp: (_f = (_e = result2.response) == null ? void 0 : _e.timestamp) != null ? _f : currentDate(),
                    modelId: (_h = (_g = result2.response) == null ? void 0 : _g.modelId) != null ? _h : model.modelId
                  };
                  if (objectText === void 0) {
                    throw new NoObjectGeneratedError({
                      message: "No object generated: the tool was not called.",
                      response: responseData,
                      usage: calculateLanguageModelUsage(result2.usage),
                      finishReason: result2.finishReason
                    });
                  }
                  span2.setAttributes(
                    selectTelemetryAttributes({
                      telemetry,
                      attributes: {
                        "ai.response.finishReason": result2.finishReason,
                        "ai.response.object": { output: () => objectText },
                        "ai.response.id": responseData.id,
                        "ai.response.model": responseData.modelId,
                        "ai.response.timestamp": responseData.timestamp.toISOString(),
                        "ai.response.providerMetadata": JSON.stringify(
                          result2.providerMetadata
                        ),
                        "ai.usage.promptTokens": result2.usage.promptTokens,
                        "ai.usage.completionTokens": result2.usage.completionTokens,
                        // standardized gen-ai llm span attributes:
                        "gen_ai.response.finish_reasons": [result2.finishReason],
                        "gen_ai.response.id": responseData.id,
                        "gen_ai.response.model": responseData.modelId,
                        "gen_ai.usage.input_tokens": result2.usage.promptTokens,
                        "gen_ai.usage.output_tokens": result2.usage.completionTokens
                      }
                    })
                  );
                  return { ...result2, objectText, responseData };
                }
              })
            );
            result = generateResult.objectText;
            finishReason = generateResult.finishReason;
            usage = generateResult.usage;
            warnings = generateResult.warnings;
            rawResponse = generateResult.rawResponse;
            logprobs = generateResult.logprobs;
            resultProviderMetadata = generateResult.providerMetadata;
            request = (_d = generateResult.request) != null ? _d : {};
            response = generateResult.responseData;
            break;
          }
          case void 0: {
            throw new Error(
              "Model does not have a default object generation mode."
            );
          }
          default: {
            const _exhaustiveCheck = mode;
            throw new Error(`Unsupported mode: ${_exhaustiveCheck}`);
          }
        }
        function processResult(result2) {
          const parseResult = safeParseJSON({ text: result2 });
          if (!parseResult.success) {
            throw new NoObjectGeneratedError({
              message: "No object generated: could not parse the response.",
              cause: parseResult.error,
              text: result2,
              response,
              usage: calculateLanguageModelUsage(usage),
              finishReason
            });
          }
          const validationResult = outputStrategy.validateFinalResult(
            parseResult.value,
            {
              text: result2,
              response,
              usage: calculateLanguageModelUsage(usage)
            }
          );
          if (!validationResult.success) {
            throw new NoObjectGeneratedError({
              message: "No object generated: response did not match schema.",
              cause: validationResult.error,
              text: result2,
              response,
              usage: calculateLanguageModelUsage(usage),
              finishReason
            });
          }
          return validationResult.value;
        }
        let object2;
        try {
          object2 = processResult(result);
        } catch (error) {
          if (repairText != null && NoObjectGeneratedError.isInstance(error) && (JSONParseError.isInstance(error.cause) || TypeValidationError.isInstance(error.cause))) {
            const repairedText = await repairText({
              text: result,
              error: error.cause
            });
            if (repairedText === null) {
              throw error;
            }
            object2 = processResult(repairedText);
          } else {
            throw error;
          }
        }
        span.setAttributes(
          selectTelemetryAttributes({
            telemetry,
            attributes: {
              "ai.response.finishReason": finishReason,
              "ai.response.object": {
                output: () => JSON.stringify(object2)
              },
              "ai.usage.promptTokens": usage.promptTokens,
              "ai.usage.completionTokens": usage.completionTokens
            }
          })
        );
        return new DefaultGenerateObjectResult({
          object: object2,
          finishReason,
          usage: calculateLanguageModelUsage(usage),
          warnings,
          request,
          response: {
            ...response,
            headers: rawResponse == null ? void 0 : rawResponse.headers,
            body: rawResponse == null ? void 0 : rawResponse.body
          },
          logprobs,
          providerMetadata: resultProviderMetadata
        });
      }
    });
  }
  var DefaultGenerateObjectResult = class {
    constructor(options) {
      this.object = options.object;
      this.finishReason = options.finishReason;
      this.usage = options.usage;
      this.warnings = options.warnings;
      this.providerMetadata = options.providerMetadata;
      this.experimental_providerMetadata = options.providerMetadata;
      this.response = options.response;
      this.request = options.request;
      this.logprobs = options.logprobs;
    }
    toJsonResponse(init) {
      var _a17;
      return new Response(JSON.stringify(this.object), {
        status: (_a17 = init == null ? void 0 : init.status) != null ? _a17 : 200,
        headers: prepareResponseHeaders(init == null ? void 0 : init.headers, {
          contentType: "application/json; charset=utf-8"
        })
      });
    }
  };

  // util/delayed-promise.ts
  var DelayedPromise = class {
    constructor() {
      this.status = { type: "pending" };
      this._resolve = void 0;
      this._reject = void 0;
    }
    get value() {
      if (this.promise) {
        return this.promise;
      }
      this.promise = new Promise((resolve, reject) => {
        if (this.status.type === "resolved") {
          resolve(this.status.value);
        } else if (this.status.type === "rejected") {
          reject(this.status.error);
        }
        this._resolve = resolve;
        this._reject = reject;
      });
      return this.promise;
    }
    resolve(value) {
      var _a17;
      this.status = { type: "resolved", value };
      if (this.promise) {
        (_a17 = this._resolve) == null ? void 0 : _a17.call(this, value);
      }
    }
    reject(error) {
      var _a17;
      this.status = { type: "rejected", error };
      if (this.promise) {
        (_a17 = this._reject) == null ? void 0 : _a17.call(this, error);
      }
    }
  };

  // util/create-resolvable-promise.ts
  function createResolvablePromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject
    };
  }

  // core/util/create-stitchable-stream.ts
  function createStitchableStream() {
    let innerStreamReaders = [];
    let controller = null;
    let isClosed = false;
    let waitForNewStream = createResolvablePromise();
    const processPull = async () => {
      if (isClosed && innerStreamReaders.length === 0) {
        controller == null ? void 0 : controller.close();
        return;
      }
      if (innerStreamReaders.length === 0) {
        waitForNewStream = createResolvablePromise();
        await waitForNewStream.promise;
        return processPull();
      }
      try {
        const { value, done } = await innerStreamReaders[0].read();
        if (done) {
          innerStreamReaders.shift();
          if (innerStreamReaders.length > 0) {
            await processPull();
          } else if (isClosed) {
            controller == null ? void 0 : controller.close();
          }
        } else {
          controller == null ? void 0 : controller.enqueue(value);
        }
      } catch (error) {
        controller == null ? void 0 : controller.error(error);
        innerStreamReaders.shift();
        if (isClosed && innerStreamReaders.length === 0) {
          controller == null ? void 0 : controller.close();
        }
      }
    };
    return {
      stream: new ReadableStream({
        start(controllerParam) {
          controller = controllerParam;
        },
        pull: processPull,
        async cancel() {
          for (const reader of innerStreamReaders) {
            await reader.cancel();
          }
          innerStreamReaders = [];
          isClosed = true;
        }
      }),
      addStream: (innerStream) => {
        if (isClosed) {
          throw new Error("Cannot add inner stream: outer stream is closed");
        }
        innerStreamReaders.push(innerStream.getReader());
        waitForNewStream.resolve();
      },
      /**
       * Gracefully close the outer stream. This will let the inner streams
       * finish processing and then close the outer stream.
       */
      close: () => {
        isClosed = true;
        waitForNewStream.resolve();
        if (innerStreamReaders.length === 0) {
          controller == null ? void 0 : controller.close();
        }
      },
      /**
       * Immediately close the outer stream. This will cancel all inner streams
       * and close the outer stream.
       */
      terminate: () => {
        isClosed = true;
        waitForNewStream.resolve();
        innerStreamReaders.forEach((reader) => reader.cancel());
        innerStreamReaders = [];
        controller == null ? void 0 : controller.close();
      }
    };
  }

  // core/util/now.ts
  function now() {
    var _a17, _b;
    return (_b = (_a17 = globalThis == null ? void 0 : globalThis.performance) == null ? void 0 : _a17.now()) != null ? _b : Date.now();
  }

  // core/generate-object/stream-object.ts
  createIdGenerator({ prefix: "aiobj", size: 24 });
  var name9 = "AI_NoOutputSpecifiedError";
  var marker9 = `vercel.ai.error.${name9}`;
  var symbol9 = Symbol.for(marker9);
  var _a9;
  var NoOutputSpecifiedError = class extends AISDKError {
    // used in isInstance
    constructor({ message = "No output specified." } = {}) {
      super({ name: name9, message });
      this[_a9] = true;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker9);
    }
  };
  _a9 = symbol9;
  var name10 = "AI_ToolExecutionError";
  var marker10 = `vercel.ai.error.${name10}`;
  var symbol10 = Symbol.for(marker10);
  var _a10;
  var ToolExecutionError = class extends AISDKError {
    constructor({
      toolArgs,
      toolName,
      toolCallId,
      cause,
      message = `Error executing tool ${toolName}: ${getErrorMessage$1(cause)}`
    }) {
      super({ name: name10, message, cause });
      this[_a10] = true;
      this.toolArgs = toolArgs;
      this.toolName = toolName;
      this.toolCallId = toolCallId;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker10);
    }
  };
  _a10 = symbol10;

  // core/util/is-non-empty-object.ts
  function isNonEmptyObject(object2) {
    return object2 != null && Object.keys(object2).length > 0;
  }

  // core/prompt/prepare-tools-and-tool-choice.ts
  function prepareToolsAndToolChoice({
    tools,
    toolChoice,
    activeTools
  }) {
    if (!isNonEmptyObject(tools)) {
      return {
        tools: void 0,
        toolChoice: void 0
      };
    }
    const filteredTools = activeTools != null ? Object.entries(tools).filter(
      ([name17]) => activeTools.includes(name17)
    ) : Object.entries(tools);
    return {
      tools: filteredTools.map(([name17, tool2]) => {
        const toolType = tool2.type;
        switch (toolType) {
          case void 0:
          case "function":
            return {
              type: "function",
              name: name17,
              description: tool2.description,
              parameters: asSchema(tool2.parameters).jsonSchema
            };
          case "provider-defined":
            return {
              type: "provider-defined",
              name: name17,
              id: tool2.id,
              args: tool2.args
            };
          default: {
            const exhaustiveCheck = toolType;
            throw new Error(`Unsupported tool type: ${exhaustiveCheck}`);
          }
        }
      }),
      toolChoice: toolChoice == null ? { type: "auto" } : typeof toolChoice === "string" ? { type: toolChoice } : { type: "tool", toolName: toolChoice.toolName }
    };
  }

  // core/util/split-on-last-whitespace.ts
  var lastWhitespaceRegexp = /^([\s\S]*?)(\s+)(\S*)$/;
  function splitOnLastWhitespace(text2) {
    const match = text2.match(lastWhitespaceRegexp);
    return match ? { prefix: match[1], whitespace: match[2], suffix: match[3] } : void 0;
  }

  // core/util/remove-text-after-last-whitespace.ts
  function removeTextAfterLastWhitespace(text2) {
    const match = splitOnLastWhitespace(text2);
    return match ? match.prefix + match.whitespace : text2;
  }
  var name11 = "AI_InvalidToolArgumentsError";
  var marker11 = `vercel.ai.error.${name11}`;
  var symbol11 = Symbol.for(marker11);
  var _a11;
  var InvalidToolArgumentsError = class extends AISDKError {
    constructor({
      toolArgs,
      toolName,
      cause,
      message = `Invalid arguments for tool ${toolName}: ${getErrorMessage$1(
      cause
    )}`
    }) {
      super({ name: name11, message, cause });
      this[_a11] = true;
      this.toolArgs = toolArgs;
      this.toolName = toolName;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker11);
    }
  };
  _a11 = symbol11;
  var name12 = "AI_NoSuchToolError";
  var marker12 = `vercel.ai.error.${name12}`;
  var symbol12 = Symbol.for(marker12);
  var _a12;
  var NoSuchToolError = class extends AISDKError {
    constructor({
      toolName,
      availableTools = void 0,
      message = `Model tried to call unavailable tool '${toolName}'. ${availableTools === void 0 ? "No tools are available." : `Available tools: ${availableTools.join(", ")}.`}`
    }) {
      super({ name: name12, message });
      this[_a12] = true;
      this.toolName = toolName;
      this.availableTools = availableTools;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker12);
    }
  };
  _a12 = symbol12;
  var name13 = "AI_ToolCallRepairError";
  var marker13 = `vercel.ai.error.${name13}`;
  var symbol13 = Symbol.for(marker13);
  var _a13;
  var ToolCallRepairError = class extends AISDKError {
    constructor({
      cause,
      originalError,
      message = `Error repairing tool call: ${getErrorMessage$1(cause)}`
    }) {
      super({ name: name13, message, cause });
      this[_a13] = true;
      this.originalError = originalError;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker13);
    }
  };
  _a13 = symbol13;

  // core/generate-text/parse-tool-call.ts
  async function parseToolCall({
    toolCall,
    tools,
    repairToolCall,
    system,
    messages
  }) {
    if (tools == null) {
      throw new NoSuchToolError({ toolName: toolCall.toolName });
    }
    try {
      return await doParseToolCall({ toolCall, tools });
    } catch (error) {
      if (repairToolCall == null || !(NoSuchToolError.isInstance(error) || InvalidToolArgumentsError.isInstance(error))) {
        throw error;
      }
      let repairedToolCall = null;
      try {
        repairedToolCall = await repairToolCall({
          toolCall,
          tools,
          parameterSchema: ({ toolName }) => asSchema(tools[toolName].parameters).jsonSchema,
          system,
          messages,
          error
        });
      } catch (repairError) {
        throw new ToolCallRepairError({
          cause: repairError,
          originalError: error
        });
      }
      if (repairedToolCall == null) {
        throw error;
      }
      return await doParseToolCall({ toolCall: repairedToolCall, tools });
    }
  }
  async function doParseToolCall({
    toolCall,
    tools
  }) {
    const toolName = toolCall.toolName;
    const tool2 = tools[toolName];
    if (tool2 == null) {
      throw new NoSuchToolError({
        toolName: toolCall.toolName,
        availableTools: Object.keys(tools)
      });
    }
    const schema = asSchema(tool2.parameters);
    const parseResult = toolCall.args.trim() === "" ? safeValidateTypes({ value: {}, schema }) : safeParseJSON({ text: toolCall.args, schema });
    if (parseResult.success === false) {
      throw new InvalidToolArgumentsError({
        toolName,
        toolArgs: toolCall.args,
        cause: parseResult.error
      });
    }
    return {
      type: "tool-call",
      toolCallId: toolCall.toolCallId,
      toolName,
      args: parseResult.value
    };
  }

  // core/generate-text/reasoning-detail.ts
  function asReasoningText(reasoning) {
    const reasoningText = reasoning.filter((part) => part.type === "text").map((part) => part.text).join("");
    return reasoningText.length > 0 ? reasoningText : void 0;
  }

  // core/generate-text/to-response-messages.ts
  function toResponseMessages({
    text: text2 = "",
    files,
    reasoning,
    tools,
    toolCalls,
    toolResults,
    messageId,
    generateMessageId
  }) {
    const responseMessages = [];
    const content = [];
    if (reasoning.length > 0) {
      content.push(
        ...reasoning.map(
          (part) => part.type === "text" ? { ...part, type: "reasoning" } : { ...part, type: "redacted-reasoning" }
        )
      );
    }
    if (files.length > 0) {
      content.push(
        ...files.map((file) => ({
          type: "file",
          data: file.base64,
          mimeType: file.mimeType
        }))
      );
    }
    if (text2.length > 0) {
      content.push({ type: "text", text: text2 });
    }
    if (toolCalls.length > 0) {
      content.push(...toolCalls);
    }
    if (content.length > 0) {
      responseMessages.push({
        role: "assistant",
        content,
        id: messageId
      });
    }
    if (toolResults.length > 0) {
      responseMessages.push({
        role: "tool",
        id: generateMessageId(),
        content: toolResults.map((toolResult) => {
          const tool2 = tools[toolResult.toolName];
          return (tool2 == null ? void 0 : tool2.experimental_toToolResultContent) != null ? {
            type: "tool-result",
            toolCallId: toolResult.toolCallId,
            toolName: toolResult.toolName,
            result: tool2.experimental_toToolResultContent(toolResult.result),
            experimental_content: tool2.experimental_toToolResultContent(
              toolResult.result
            )
          } : {
            type: "tool-result",
            toolCallId: toolResult.toolCallId,
            toolName: toolResult.toolName,
            result: toolResult.result
          };
        })
      });
    }
    return responseMessages;
  }

  // core/generate-text/generate-text.ts
  var originalGenerateId3 = createIdGenerator({
    prefix: "aitxt",
    size: 24
  });
  var originalGenerateMessageId = createIdGenerator({
    prefix: "msg",
    size: 24
  });
  async function generateText({
    model,
    tools,
    toolChoice,
    system,
    prompt,
    messages,
    maxRetries: maxRetriesArg,
    abortSignal,
    headers,
    maxSteps = 1,
    experimental_generateMessageId: generateMessageId = originalGenerateMessageId,
    experimental_output: output,
    experimental_continueSteps: continueSteps = false,
    experimental_telemetry: telemetry,
    experimental_providerMetadata,
    providerOptions = experimental_providerMetadata,
    experimental_activeTools: activeTools,
    experimental_prepareStep: prepareStep,
    experimental_repairToolCall: repairToolCall,
    _internal: {
      generateId: generateId3 = originalGenerateId3,
      currentDate = () => /* @__PURE__ */ new Date()
    } = {},
    onStepFinish,
    ...settings
  }) {
    var _a17;
    if (typeof model === "string" || model.specificationVersion !== "v1") {
      throw new UnsupportedModelVersionError();
    }
    if (maxSteps < 1) {
      throw new InvalidArgumentError({
        parameter: "maxSteps",
        value: maxSteps,
        message: "maxSteps must be at least 1"
      });
    }
    const { maxRetries, retry } = prepareRetries({ maxRetries: maxRetriesArg });
    const baseTelemetryAttributes = getBaseTelemetryAttributes({
      model,
      telemetry,
      headers,
      settings: { ...settings, maxRetries }
    });
    const initialPrompt = standardizePrompt({
      prompt: {
        system: (_a17 = output == null ? void 0 : output.injectIntoSystemPrompt({ system, model })) != null ? _a17 : system,
        prompt,
        messages
      },
      tools
    });
    const tracer = getTracer(telemetry);
    return recordSpan({
      name: "ai.generateText",
      attributes: selectTelemetryAttributes({
        telemetry,
        attributes: {
          ...assembleOperationName({
            operationId: "ai.generateText",
            telemetry
          }),
          ...baseTelemetryAttributes,
          // model:
          "ai.model.provider": model.provider,
          "ai.model.id": model.modelId,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: () => JSON.stringify({ system, prompt, messages })
          },
          "ai.settings.maxSteps": maxSteps
        }
      }),
      tracer,
      fn: async (span) => {
        var _a18, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
        const callSettings = prepareCallSettings(settings);
        let currentModelResponse;
        let currentToolCalls = [];
        let currentToolResults = [];
        let currentReasoningDetails = [];
        let stepCount = 0;
        const responseMessages = [];
        let text2 = "";
        const sources = [];
        const steps = [];
        let usage = {
          completionTokens: 0,
          promptTokens: 0,
          totalTokens: 0
        };
        let stepType = "initial";
        do {
          const promptFormat = stepCount === 0 ? initialPrompt.type : "messages";
          const stepInputMessages = [
            ...initialPrompt.messages,
            ...responseMessages
          ];
          const prepareStepResult = await (prepareStep == null ? void 0 : prepareStep({
            model,
            steps,
            maxSteps,
            stepNumber: stepCount
          }));
          const stepToolChoice = (_a18 = prepareStepResult == null ? void 0 : prepareStepResult.toolChoice) != null ? _a18 : toolChoice;
          const stepActiveTools = (_b = prepareStepResult == null ? void 0 : prepareStepResult.experimental_activeTools) != null ? _b : activeTools;
          const stepModel = (_c = prepareStepResult == null ? void 0 : prepareStepResult.model) != null ? _c : model;
          const promptMessages = await convertToLanguageModelPrompt({
            prompt: {
              type: promptFormat,
              system: initialPrompt.system,
              messages: stepInputMessages
            },
            modelSupportsImageUrls: stepModel.supportsImageUrls,
            modelSupportsUrl: (_d = stepModel.supportsUrl) == null ? void 0 : _d.bind(stepModel)
            // support 'this' context
          });
          const mode = {
            type: "regular",
            ...prepareToolsAndToolChoice({
              tools,
              toolChoice: stepToolChoice,
              activeTools: stepActiveTools
            })
          };
          currentModelResponse = await retry(
            () => recordSpan({
              name: "ai.generateText.doGenerate",
              attributes: selectTelemetryAttributes({
                telemetry,
                attributes: {
                  ...assembleOperationName({
                    operationId: "ai.generateText.doGenerate",
                    telemetry
                  }),
                  ...baseTelemetryAttributes,
                  // model:
                  "ai.model.provider": stepModel.provider,
                  "ai.model.id": stepModel.modelId,
                  // prompt:
                  "ai.prompt.format": { input: () => promptFormat },
                  "ai.prompt.messages": {
                    input: () => stringifyForTelemetry(promptMessages)
                  },
                  "ai.prompt.tools": {
                    // convert the language model level tools:
                    input: () => {
                      var _a19;
                      return (_a19 = mode.tools) == null ? void 0 : _a19.map((tool2) => JSON.stringify(tool2));
                    }
                  },
                  "ai.prompt.toolChoice": {
                    input: () => mode.toolChoice != null ? JSON.stringify(mode.toolChoice) : void 0
                  },
                  // standardized gen-ai llm span attributes:
                  "gen_ai.system": stepModel.provider,
                  "gen_ai.request.model": stepModel.modelId,
                  "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                  "gen_ai.request.max_tokens": settings.maxTokens,
                  "gen_ai.request.presence_penalty": settings.presencePenalty,
                  "gen_ai.request.stop_sequences": settings.stopSequences,
                  "gen_ai.request.temperature": settings.temperature,
                  "gen_ai.request.top_k": settings.topK,
                  "gen_ai.request.top_p": settings.topP
                }
              }),
              tracer,
              fn: async (span2) => {
                var _a19, _b2, _c2, _d2, _e2, _f2;
                const result = await stepModel.doGenerate({
                  mode,
                  ...callSettings,
                  inputFormat: promptFormat,
                  responseFormat: output == null ? void 0 : output.responseFormat({ model }),
                  prompt: promptMessages,
                  providerMetadata: providerOptions,
                  abortSignal,
                  headers
                });
                const responseData = {
                  id: (_b2 = (_a19 = result.response) == null ? void 0 : _a19.id) != null ? _b2 : generateId3(),
                  timestamp: (_d2 = (_c2 = result.response) == null ? void 0 : _c2.timestamp) != null ? _d2 : currentDate(),
                  modelId: (_f2 = (_e2 = result.response) == null ? void 0 : _e2.modelId) != null ? _f2 : stepModel.modelId
                };
                span2.setAttributes(
                  selectTelemetryAttributes({
                    telemetry,
                    attributes: {
                      "ai.response.finishReason": result.finishReason,
                      "ai.response.text": {
                        output: () => result.text
                      },
                      "ai.response.toolCalls": {
                        output: () => JSON.stringify(result.toolCalls)
                      },
                      "ai.response.id": responseData.id,
                      "ai.response.model": responseData.modelId,
                      "ai.response.timestamp": responseData.timestamp.toISOString(),
                      "ai.response.providerMetadata": JSON.stringify(
                        result.providerMetadata
                      ),
                      "ai.usage.promptTokens": result.usage.promptTokens,
                      "ai.usage.completionTokens": result.usage.completionTokens,
                      // standardized gen-ai llm span attributes:
                      "gen_ai.response.finish_reasons": [result.finishReason],
                      "gen_ai.response.id": responseData.id,
                      "gen_ai.response.model": responseData.modelId,
                      "gen_ai.usage.input_tokens": result.usage.promptTokens,
                      "gen_ai.usage.output_tokens": result.usage.completionTokens
                    }
                  })
                );
                return { ...result, response: responseData };
              }
            })
          );
          currentToolCalls = await Promise.all(
            ((_e = currentModelResponse.toolCalls) != null ? _e : []).map(
              (toolCall) => parseToolCall({
                toolCall,
                tools,
                repairToolCall,
                system,
                messages: stepInputMessages
              })
            )
          );
          currentToolResults = tools == null ? [] : await executeTools({
            toolCalls: currentToolCalls,
            tools,
            tracer,
            telemetry,
            messages: stepInputMessages,
            abortSignal
          });
          const currentUsage = calculateLanguageModelUsage(
            currentModelResponse.usage
          );
          usage = addLanguageModelUsage(usage, currentUsage);
          let nextStepType = "done";
          if (++stepCount < maxSteps) {
            if (continueSteps && currentModelResponse.finishReason === "length" && // only use continue when there are no tool calls:
            currentToolCalls.length === 0) {
              nextStepType = "continue";
            } else if (
              // there are tool calls:
              currentToolCalls.length > 0 && // all current tool calls have results:
              currentToolResults.length === currentToolCalls.length
            ) {
              nextStepType = "tool-result";
            }
          }
          const originalText = (_f = currentModelResponse.text) != null ? _f : "";
          const stepTextLeadingWhitespaceTrimmed = stepType === "continue" && // only for continue steps
          text2.trimEnd() !== text2 ? originalText.trimStart() : originalText;
          const stepText = nextStepType === "continue" ? removeTextAfterLastWhitespace(stepTextLeadingWhitespaceTrimmed) : stepTextLeadingWhitespaceTrimmed;
          text2 = nextStepType === "continue" || stepType === "continue" ? text2 + stepText : stepText;
          currentReasoningDetails = asReasoningDetails(
            currentModelResponse.reasoning
          );
          sources.push(...(_g = currentModelResponse.sources) != null ? _g : []);
          if (stepType === "continue") {
            const lastMessage = responseMessages[responseMessages.length - 1];
            if (typeof lastMessage.content === "string") {
              lastMessage.content += stepText;
            } else {
              lastMessage.content.push({
                text: stepText,
                type: "text"
              });
            }
          } else {
            responseMessages.push(
              ...toResponseMessages({
                text: text2,
                files: asFiles(currentModelResponse.files),
                reasoning: asReasoningDetails(currentModelResponse.reasoning),
                tools: tools != null ? tools : {},
                toolCalls: currentToolCalls,
                toolResults: currentToolResults,
                messageId: generateMessageId(),
                generateMessageId
              })
            );
          }
          const currentStepResult = {
            stepType,
            text: stepText,
            // TODO v5: rename reasoning to reasoningText (and use reasoning for composite array)
            reasoning: asReasoningText(currentReasoningDetails),
            reasoningDetails: currentReasoningDetails,
            files: asFiles(currentModelResponse.files),
            sources: (_h = currentModelResponse.sources) != null ? _h : [],
            toolCalls: currentToolCalls,
            toolResults: currentToolResults,
            finishReason: currentModelResponse.finishReason,
            usage: currentUsage,
            warnings: currentModelResponse.warnings,
            logprobs: currentModelResponse.logprobs,
            request: (_i = currentModelResponse.request) != null ? _i : {},
            response: {
              ...currentModelResponse.response,
              headers: (_j = currentModelResponse.rawResponse) == null ? void 0 : _j.headers,
              body: (_k = currentModelResponse.rawResponse) == null ? void 0 : _k.body,
              // deep clone msgs to avoid mutating past messages in multi-step:
              messages: structuredClone(responseMessages)
            },
            providerMetadata: currentModelResponse.providerMetadata,
            experimental_providerMetadata: currentModelResponse.providerMetadata,
            isContinued: nextStepType === "continue"
          };
          steps.push(currentStepResult);
          await (onStepFinish == null ? void 0 : onStepFinish(currentStepResult));
          stepType = nextStepType;
        } while (stepType !== "done");
        span.setAttributes(
          selectTelemetryAttributes({
            telemetry,
            attributes: {
              "ai.response.finishReason": currentModelResponse.finishReason,
              "ai.response.text": {
                output: () => currentModelResponse.text
              },
              "ai.response.toolCalls": {
                output: () => JSON.stringify(currentModelResponse.toolCalls)
              },
              "ai.usage.promptTokens": currentModelResponse.usage.promptTokens,
              "ai.usage.completionTokens": currentModelResponse.usage.completionTokens,
              "ai.response.providerMetadata": JSON.stringify(
                currentModelResponse.providerMetadata
              )
            }
          })
        );
        return new DefaultGenerateTextResult({
          text: text2,
          files: asFiles(currentModelResponse.files),
          reasoning: asReasoningText(currentReasoningDetails),
          reasoningDetails: currentReasoningDetails,
          sources,
          outputResolver: () => {
            if (output == null) {
              throw new NoOutputSpecifiedError();
            }
            return output.parseOutput(
              { text: text2 },
              {
                response: currentModelResponse.response,
                usage,
                finishReason: currentModelResponse.finishReason
              }
            );
          },
          toolCalls: currentToolCalls,
          toolResults: currentToolResults,
          finishReason: currentModelResponse.finishReason,
          usage,
          warnings: currentModelResponse.warnings,
          request: (_l = currentModelResponse.request) != null ? _l : {},
          response: {
            ...currentModelResponse.response,
            headers: (_m = currentModelResponse.rawResponse) == null ? void 0 : _m.headers,
            body: (_n = currentModelResponse.rawResponse) == null ? void 0 : _n.body,
            messages: responseMessages
          },
          logprobs: currentModelResponse.logprobs,
          steps,
          providerMetadata: currentModelResponse.providerMetadata
        });
      }
    });
  }
  async function executeTools({
    toolCalls,
    tools,
    tracer,
    telemetry,
    messages,
    abortSignal
  }) {
    const toolResults = await Promise.all(
      toolCalls.map(async ({ toolCallId, toolName, args }) => {
        const tool2 = tools[toolName];
        if ((tool2 == null ? void 0 : tool2.execute) == null) {
          return void 0;
        }
        const result = await recordSpan({
          name: "ai.toolCall",
          attributes: selectTelemetryAttributes({
            telemetry,
            attributes: {
              ...assembleOperationName({
                operationId: "ai.toolCall",
                telemetry
              }),
              "ai.toolCall.name": toolName,
              "ai.toolCall.id": toolCallId,
              "ai.toolCall.args": {
                output: () => JSON.stringify(args)
              }
            }
          }),
          tracer,
          fn: async (span) => {
            try {
              const result2 = await tool2.execute(args, {
                toolCallId,
                messages,
                abortSignal
              });
              try {
                span.setAttributes(
                  selectTelemetryAttributes({
                    telemetry,
                    attributes: {
                      "ai.toolCall.result": {
                        output: () => JSON.stringify(result2)
                      }
                    }
                  })
                );
              } catch (ignored) {
              }
              return result2;
            } catch (error) {
              recordErrorOnSpan(span, error);
              throw new ToolExecutionError({
                toolCallId,
                toolName,
                toolArgs: args,
                cause: error
              });
            }
          }
        });
        return {
          type: "tool-result",
          toolCallId,
          toolName,
          args,
          result
        };
      })
    );
    return toolResults.filter(
      (result) => result != null
    );
  }
  var DefaultGenerateTextResult = class {
    constructor(options) {
      this.text = options.text;
      this.files = options.files;
      this.reasoning = options.reasoning;
      this.reasoningDetails = options.reasoningDetails;
      this.toolCalls = options.toolCalls;
      this.toolResults = options.toolResults;
      this.finishReason = options.finishReason;
      this.usage = options.usage;
      this.warnings = options.warnings;
      this.request = options.request;
      this.response = options.response;
      this.steps = options.steps;
      this.experimental_providerMetadata = options.providerMetadata;
      this.providerMetadata = options.providerMetadata;
      this.logprobs = options.logprobs;
      this.outputResolver = options.outputResolver;
      this.sources = options.sources;
    }
    get experimental_output() {
      return this.outputResolver();
    }
  };
  function asReasoningDetails(reasoning) {
    if (reasoning == null) {
      return [];
    }
    if (typeof reasoning === "string") {
      return [{ type: "text", text: reasoning }];
    }
    return reasoning;
  }
  function asFiles(files) {
    var _a17;
    return (_a17 = files == null ? void 0 : files.map((file) => new DefaultGeneratedFile(file))) != null ? _a17 : [];
  }

  // core/generate-text/output.ts
  var output_exports = {};
  __export(output_exports, {
    object: () => object,
    text: () => text
  });
  var name14 = "AI_InvalidStreamPartError";
  var marker14 = `vercel.ai.error.${name14}`;
  var symbol14 = Symbol.for(marker14);
  var _a14;
  var InvalidStreamPartError = class extends AISDKError {
    constructor({
      chunk,
      message
    }) {
      super({ name: name14, message });
      this[_a14] = true;
      this.chunk = chunk;
    }
    static isInstance(error) {
      return AISDKError.hasMarker(error, marker14);
    }
  };
  _a14 = symbol14;

  // core/generate-text/output.ts
  var text = () => ({
    type: "text",
    responseFormat: () => ({ type: "text" }),
    injectIntoSystemPrompt({ system }) {
      return system;
    },
    parsePartial({ text: text2 }) {
      return { partial: text2 };
    },
    parseOutput({ text: text2 }) {
      return text2;
    }
  });
  var object = ({
    schema: inputSchema
  }) => {
    const schema = asSchema(inputSchema);
    return {
      type: "object",
      responseFormat: ({ model }) => ({
        type: "json",
        schema: model.supportsStructuredOutputs ? schema.jsonSchema : void 0
      }),
      injectIntoSystemPrompt({ system, model }) {
        return model.supportsStructuredOutputs ? system : injectJsonInstruction({
          prompt: system,
          schema: schema.jsonSchema
        });
      },
      parsePartial({ text: text2 }) {
        const result = parsePartialJson(text2);
        switch (result.state) {
          case "failed-parse":
          case "undefined-input":
            return void 0;
          case "repaired-parse":
          case "successful-parse":
            return {
              // Note: currently no validation of partial results:
              partial: result.value
            };
          default: {
            const _exhaustiveCheck = result.state;
            throw new Error(`Unsupported parse state: ${_exhaustiveCheck}`);
          }
        }
      },
      parseOutput({ text: text2 }, context) {
        const parseResult = safeParseJSON({ text: text2 });
        if (!parseResult.success) {
          throw new NoObjectGeneratedError({
            message: "No object generated: could not parse the response.",
            cause: parseResult.error,
            text: text2,
            response: context.response,
            usage: context.usage,
            finishReason: context.finishReason
          });
        }
        const validationResult = safeValidateTypes({
          value: parseResult.value,
          schema
        });
        if (!validationResult.success) {
          throw new NoObjectGeneratedError({
            message: "No object generated: response did not match schema.",
            cause: validationResult.error,
            text: text2,
            response: context.response,
            usage: context.usage,
            finishReason: context.finishReason
          });
        }
        return validationResult.value;
      }
    };
  };

  // util/as-array.ts
  function asArray(value) {
    return value === void 0 ? [] : Array.isArray(value) ? value : [value];
  }

  // util/consume-stream.ts
  async function consumeStream({
    stream,
    onError
  }) {
    const reader = stream.getReader();
    try {
      while (true) {
        const { done } = await reader.read();
        if (done)
          break;
      }
    } catch (error) {
      onError == null ? void 0 : onError(error);
    } finally {
      reader.releaseLock();
    }
  }

  // core/util/merge-streams.ts
  function mergeStreams(stream1, stream2) {
    const reader1 = stream1.getReader();
    const reader2 = stream2.getReader();
    let lastRead1 = void 0;
    let lastRead2 = void 0;
    let stream1Done = false;
    let stream2Done = false;
    async function readStream1(controller) {
      try {
        if (lastRead1 == null) {
          lastRead1 = reader1.read();
        }
        const result = await lastRead1;
        lastRead1 = void 0;
        if (!result.done) {
          controller.enqueue(result.value);
        } else {
          controller.close();
        }
      } catch (error) {
        controller.error(error);
      }
    }
    async function readStream2(controller) {
      try {
        if (lastRead2 == null) {
          lastRead2 = reader2.read();
        }
        const result = await lastRead2;
        lastRead2 = void 0;
        if (!result.done) {
          controller.enqueue(result.value);
        } else {
          controller.close();
        }
      } catch (error) {
        controller.error(error);
      }
    }
    return new ReadableStream({
      async pull(controller) {
        try {
          if (stream1Done) {
            await readStream2(controller);
            return;
          }
          if (stream2Done) {
            await readStream1(controller);
            return;
          }
          if (lastRead1 == null) {
            lastRead1 = reader1.read();
          }
          if (lastRead2 == null) {
            lastRead2 = reader2.read();
          }
          const { result, reader } = await Promise.race([
            lastRead1.then((result2) => ({ result: result2, reader: reader1 })),
            lastRead2.then((result2) => ({ result: result2, reader: reader2 }))
          ]);
          if (!result.done) {
            controller.enqueue(result.value);
          }
          if (reader === reader1) {
            lastRead1 = void 0;
            if (result.done) {
              await readStream2(controller);
              stream1Done = true;
            }
          } else {
            lastRead2 = void 0;
            if (result.done) {
              stream2Done = true;
              await readStream1(controller);
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
      cancel() {
        reader1.cancel();
        reader2.cancel();
      }
    });
  }
  function runToolsTransformation({
    tools,
    generatorStream,
    toolCallStreaming,
    tracer,
    telemetry,
    system,
    messages,
    abortSignal,
    repairToolCall
  }) {
    let toolResultsStreamController = null;
    const toolResultsStream = new ReadableStream({
      start(controller) {
        toolResultsStreamController = controller;
      }
    });
    const activeToolCalls = {};
    const outstandingToolResults = /* @__PURE__ */ new Set();
    let canClose = false;
    let finishChunk = void 0;
    function attemptClose() {
      if (canClose && outstandingToolResults.size === 0) {
        if (finishChunk != null) {
          toolResultsStreamController.enqueue(finishChunk);
        }
        toolResultsStreamController.close();
      }
    }
    const forwardStream = new TransformStream({
      async transform(chunk, controller) {
        const chunkType = chunk.type;
        switch (chunkType) {
          case "text-delta":
          case "reasoning":
          case "reasoning-signature":
          case "redacted-reasoning":
          case "source":
          case "response-metadata":
          case "error": {
            controller.enqueue(chunk);
            break;
          }
          case "file": {
            controller.enqueue(
              new DefaultGeneratedFileWithType({
                data: chunk.data,
                mimeType: chunk.mimeType
              })
            );
            break;
          }
          case "tool-call-delta": {
            if (toolCallStreaming) {
              if (!activeToolCalls[chunk.toolCallId]) {
                controller.enqueue({
                  type: "tool-call-streaming-start",
                  toolCallId: chunk.toolCallId,
                  toolName: chunk.toolName
                });
                activeToolCalls[chunk.toolCallId] = true;
              }
              controller.enqueue({
                type: "tool-call-delta",
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName,
                argsTextDelta: chunk.argsTextDelta
              });
            }
            break;
          }
          case "tool-call": {
            try {
              const toolCall = await parseToolCall({
                toolCall: chunk,
                tools,
                repairToolCall,
                system,
                messages
              });
              controller.enqueue(toolCall);
              const tool2 = tools[toolCall.toolName];
              if (tool2.execute != null) {
                const toolExecutionId = generateId();
                outstandingToolResults.add(toolExecutionId);
                recordSpan({
                  name: "ai.toolCall",
                  attributes: selectTelemetryAttributes({
                    telemetry,
                    attributes: {
                      ...assembleOperationName({
                        operationId: "ai.toolCall",
                        telemetry
                      }),
                      "ai.toolCall.name": toolCall.toolName,
                      "ai.toolCall.id": toolCall.toolCallId,
                      "ai.toolCall.args": {
                        output: () => JSON.stringify(toolCall.args)
                      }
                    }
                  }),
                  tracer,
                  fn: async (span) => tool2.execute(toolCall.args, {
                    toolCallId: toolCall.toolCallId,
                    messages,
                    abortSignal
                  }).then(
                    (result) => {
                      toolResultsStreamController.enqueue({
                        ...toolCall,
                        type: "tool-result",
                        result
                      });
                      outstandingToolResults.delete(toolExecutionId);
                      attemptClose();
                      try {
                        span.setAttributes(
                          selectTelemetryAttributes({
                            telemetry,
                            attributes: {
                              "ai.toolCall.result": {
                                output: () => JSON.stringify(result)
                              }
                            }
                          })
                        );
                      } catch (ignored) {
                      }
                    },
                    (error) => {
                      recordErrorOnSpan(span, error);
                      toolResultsStreamController.enqueue({
                        type: "error",
                        error: new ToolExecutionError({
                          toolCallId: toolCall.toolCallId,
                          toolName: toolCall.toolName,
                          toolArgs: toolCall.args,
                          cause: error
                        })
                      });
                      outstandingToolResults.delete(toolExecutionId);
                      attemptClose();
                    }
                  )
                });
              }
            } catch (error) {
              toolResultsStreamController.enqueue({
                type: "error",
                error
              });
            }
            break;
          }
          case "finish": {
            finishChunk = {
              type: "finish",
              finishReason: chunk.finishReason,
              logprobs: chunk.logprobs,
              usage: calculateLanguageModelUsage(chunk.usage),
              experimental_providerMetadata: chunk.providerMetadata
            };
            break;
          }
          default: {
            const _exhaustiveCheck = chunkType;
            throw new Error(`Unhandled chunk type: ${_exhaustiveCheck}`);
          }
        }
      },
      flush() {
        canClose = true;
        attemptClose();
      }
    });
    return new ReadableStream({
      async start(controller) {
        return Promise.all([
          generatorStream.pipeThrough(forwardStream).pipeTo(
            new WritableStream({
              write(chunk) {
                controller.enqueue(chunk);
              },
              close() {
              }
            })
          ),
          toolResultsStream.pipeTo(
            new WritableStream({
              write(chunk) {
                controller.enqueue(chunk);
              },
              close() {
                controller.close();
              }
            })
          )
        ]);
      }
    });
  }

  // core/generate-text/stream-text.ts
  var originalGenerateId4 = createIdGenerator({
    prefix: "aitxt",
    size: 24
  });
  var originalGenerateMessageId2 = createIdGenerator({
    prefix: "msg",
    size: 24
  });
  function streamText({
    model,
    tools,
    toolChoice,
    system,
    prompt,
    messages,
    maxRetries,
    abortSignal,
    headers,
    maxSteps = 1,
    experimental_generateMessageId: generateMessageId = originalGenerateMessageId2,
    experimental_output: output,
    experimental_continueSteps: continueSteps = false,
    experimental_telemetry: telemetry,
    experimental_providerMetadata,
    providerOptions = experimental_providerMetadata,
    experimental_toolCallStreaming = false,
    toolCallStreaming = experimental_toolCallStreaming,
    experimental_activeTools: activeTools,
    experimental_repairToolCall: repairToolCall,
    experimental_transform: transform,
    onChunk,
    onError,
    onFinish,
    onStepFinish,
    _internal: {
      now: now2 = now,
      generateId: generateId3 = originalGenerateId4,
      currentDate = () => /* @__PURE__ */ new Date()
    } = {},
    ...settings
  }) {
    if (typeof model === "string" || model.specificationVersion !== "v1") {
      throw new UnsupportedModelVersionError();
    }
    return new DefaultStreamTextResult({
      model,
      telemetry,
      headers,
      settings,
      maxRetries,
      abortSignal,
      system,
      prompt,
      messages,
      tools,
      toolChoice,
      toolCallStreaming,
      transforms: asArray(transform),
      activeTools,
      repairToolCall,
      maxSteps,
      output,
      continueSteps,
      providerOptions,
      onChunk,
      onError,
      onFinish,
      onStepFinish,
      now: now2,
      currentDate,
      generateId: generateId3,
      generateMessageId
    });
  }
  function createOutputTransformStream(output) {
    if (!output) {
      return new TransformStream({
        transform(chunk, controller) {
          controller.enqueue({ part: chunk, partialOutput: void 0 });
        }
      });
    }
    let text2 = "";
    let textChunk = "";
    let lastPublishedJson = "";
    function publishTextChunk({
      controller,
      partialOutput = void 0
    }) {
      controller.enqueue({
        part: { type: "text-delta", textDelta: textChunk },
        partialOutput
      });
      textChunk = "";
    }
    return new TransformStream({
      transform(chunk, controller) {
        if (chunk.type === "step-finish") {
          publishTextChunk({ controller });
        }
        if (chunk.type !== "text-delta") {
          controller.enqueue({ part: chunk, partialOutput: void 0 });
          return;
        }
        text2 += chunk.textDelta;
        textChunk += chunk.textDelta;
        const result = output.parsePartial({ text: text2 });
        if (result != null) {
          const currentJson = JSON.stringify(result.partial);
          if (currentJson !== lastPublishedJson) {
            publishTextChunk({ controller, partialOutput: result.partial });
            lastPublishedJson = currentJson;
          }
        }
      },
      flush(controller) {
        if (textChunk.length > 0) {
          publishTextChunk({ controller });
        }
      }
    });
  }
  var DefaultStreamTextResult = class {
    constructor({
      model,
      telemetry,
      headers,
      settings,
      maxRetries: maxRetriesArg,
      abortSignal,
      system,
      prompt,
      messages,
      tools,
      toolChoice,
      toolCallStreaming,
      transforms,
      activeTools,
      repairToolCall,
      maxSteps,
      output,
      continueSteps,
      providerOptions,
      now: now2,
      currentDate,
      generateId: generateId3,
      generateMessageId,
      onChunk,
      onError,
      onFinish,
      onStepFinish
    }) {
      this.warningsPromise = new DelayedPromise();
      this.usagePromise = new DelayedPromise();
      this.finishReasonPromise = new DelayedPromise();
      this.providerMetadataPromise = new DelayedPromise();
      this.textPromise = new DelayedPromise();
      this.reasoningPromise = new DelayedPromise();
      this.reasoningDetailsPromise = new DelayedPromise();
      this.sourcesPromise = new DelayedPromise();
      this.filesPromise = new DelayedPromise();
      this.toolCallsPromise = new DelayedPromise();
      this.toolResultsPromise = new DelayedPromise();
      this.requestPromise = new DelayedPromise();
      this.responsePromise = new DelayedPromise();
      this.stepsPromise = new DelayedPromise();
      var _a17;
      if (maxSteps < 1) {
        throw new InvalidArgumentError({
          parameter: "maxSteps",
          value: maxSteps,
          message: "maxSteps must be at least 1"
        });
      }
      this.output = output;
      let recordedStepText = "";
      let recordedContinuationText = "";
      let recordedFullText = "";
      let stepReasoning = [];
      let stepFiles = [];
      let activeReasoningText = void 0;
      let recordedStepSources = [];
      const recordedSources = [];
      const recordedResponse = {
        id: generateId3(),
        timestamp: currentDate(),
        modelId: model.modelId,
        messages: []
      };
      let recordedToolCalls = [];
      let recordedToolResults = [];
      let recordedFinishReason = void 0;
      let recordedUsage = void 0;
      let stepType = "initial";
      const recordedSteps = [];
      let rootSpan;
      const eventProcessor = new TransformStream({
        async transform(chunk, controller) {
          controller.enqueue(chunk);
          const { part } = chunk;
          if (part.type === "text-delta" || part.type === "reasoning" || part.type === "source" || part.type === "tool-call" || part.type === "tool-result" || part.type === "tool-call-streaming-start" || part.type === "tool-call-delta") {
            await (onChunk == null ? void 0 : onChunk({ chunk: part }));
          }
          if (part.type === "error") {
            await (onError == null ? void 0 : onError({ error: part.error }));
          }
          if (part.type === "text-delta") {
            recordedStepText += part.textDelta;
            recordedContinuationText += part.textDelta;
            recordedFullText += part.textDelta;
          }
          if (part.type === "reasoning") {
            if (activeReasoningText == null) {
              activeReasoningText = { type: "text", text: part.textDelta };
              stepReasoning.push(activeReasoningText);
            } else {
              activeReasoningText.text += part.textDelta;
            }
          }
          if (part.type === "reasoning-signature") {
            if (activeReasoningText == null) {
              throw new AISDKError({
                name: "InvalidStreamPart",
                message: "reasoning-signature without reasoning"
              });
            }
            activeReasoningText.signature = part.signature;
            activeReasoningText = void 0;
          }
          if (part.type === "redacted-reasoning") {
            stepReasoning.push({ type: "redacted", data: part.data });
          }
          if (part.type === "file") {
            stepFiles.push(part);
          }
          if (part.type === "source") {
            recordedSources.push(part.source);
            recordedStepSources.push(part.source);
          }
          if (part.type === "tool-call") {
            recordedToolCalls.push(part);
          }
          if (part.type === "tool-result") {
            recordedToolResults.push(part);
          }
          if (part.type === "step-finish") {
            const stepMessages = toResponseMessages({
              text: recordedContinuationText,
              files: stepFiles,
              reasoning: stepReasoning,
              tools: tools != null ? tools : {},
              toolCalls: recordedToolCalls,
              toolResults: recordedToolResults,
              messageId: part.messageId,
              generateMessageId
            });
            const currentStep = recordedSteps.length;
            let nextStepType = "done";
            if (currentStep + 1 < maxSteps) {
              if (continueSteps && part.finishReason === "length" && // only use continue when there are no tool calls:
              recordedToolCalls.length === 0) {
                nextStepType = "continue";
              } else if (
                // there are tool calls:
                recordedToolCalls.length > 0 && // all current tool calls have results:
                recordedToolResults.length === recordedToolCalls.length
              ) {
                nextStepType = "tool-result";
              }
            }
            const currentStepResult = {
              stepType,
              text: recordedStepText,
              reasoning: asReasoningText(stepReasoning),
              reasoningDetails: stepReasoning,
              files: stepFiles,
              sources: recordedStepSources,
              toolCalls: recordedToolCalls,
              toolResults: recordedToolResults,
              finishReason: part.finishReason,
              usage: part.usage,
              warnings: part.warnings,
              logprobs: part.logprobs,
              request: part.request,
              response: {
                ...part.response,
                messages: [...recordedResponse.messages, ...stepMessages]
              },
              providerMetadata: part.experimental_providerMetadata,
              experimental_providerMetadata: part.experimental_providerMetadata,
              isContinued: part.isContinued
            };
            await (onStepFinish == null ? void 0 : onStepFinish(currentStepResult));
            recordedSteps.push(currentStepResult);
            recordedToolCalls = [];
            recordedToolResults = [];
            recordedStepText = "";
            recordedStepSources = [];
            stepReasoning = [];
            stepFiles = [];
            activeReasoningText = void 0;
            if (nextStepType !== "done") {
              stepType = nextStepType;
            }
            if (nextStepType !== "continue") {
              recordedResponse.messages.push(...stepMessages);
              recordedContinuationText = "";
            }
          }
          if (part.type === "finish") {
            recordedResponse.id = part.response.id;
            recordedResponse.timestamp = part.response.timestamp;
            recordedResponse.modelId = part.response.modelId;
            recordedResponse.headers = part.response.headers;
            recordedUsage = part.usage;
            recordedFinishReason = part.finishReason;
          }
        },
        async flush(controller) {
          var _a18;
          try {
            if (recordedSteps.length === 0) {
              return;
            }
            const lastStep = recordedSteps[recordedSteps.length - 1];
            self.warningsPromise.resolve(lastStep.warnings);
            self.requestPromise.resolve(lastStep.request);
            self.responsePromise.resolve(lastStep.response);
            self.toolCallsPromise.resolve(lastStep.toolCalls);
            self.toolResultsPromise.resolve(lastStep.toolResults);
            self.providerMetadataPromise.resolve(
              lastStep.experimental_providerMetadata
            );
            self.reasoningPromise.resolve(lastStep.reasoning);
            self.reasoningDetailsPromise.resolve(lastStep.reasoningDetails);
            const finishReason = recordedFinishReason != null ? recordedFinishReason : "unknown";
            const usage = recordedUsage != null ? recordedUsage : {
              completionTokens: NaN,
              promptTokens: NaN,
              totalTokens: NaN
            };
            self.finishReasonPromise.resolve(finishReason);
            self.usagePromise.resolve(usage);
            self.textPromise.resolve(recordedFullText);
            self.sourcesPromise.resolve(recordedSources);
            self.filesPromise.resolve(lastStep.files);
            self.stepsPromise.resolve(recordedSteps);
            await (onFinish == null ? void 0 : onFinish({
              finishReason,
              logprobs: void 0,
              usage,
              text: recordedFullText,
              reasoning: lastStep.reasoning,
              reasoningDetails: lastStep.reasoningDetails,
              files: lastStep.files,
              sources: lastStep.sources,
              toolCalls: lastStep.toolCalls,
              toolResults: lastStep.toolResults,
              request: (_a18 = lastStep.request) != null ? _a18 : {},
              response: lastStep.response,
              warnings: lastStep.warnings,
              providerMetadata: lastStep.providerMetadata,
              experimental_providerMetadata: lastStep.experimental_providerMetadata,
              steps: recordedSteps
            }));
            rootSpan.setAttributes(
              selectTelemetryAttributes({
                telemetry,
                attributes: {
                  "ai.response.finishReason": finishReason,
                  "ai.response.text": { output: () => recordedFullText },
                  "ai.response.toolCalls": {
                    output: () => {
                      var _a19;
                      return ((_a19 = lastStep.toolCalls) == null ? void 0 : _a19.length) ? JSON.stringify(lastStep.toolCalls) : void 0;
                    }
                  },
                  "ai.usage.promptTokens": usage.promptTokens,
                  "ai.usage.completionTokens": usage.completionTokens,
                  "ai.response.providerMetadata": JSON.stringify(
                    lastStep.providerMetadata
                  )
                }
              })
            );
          } catch (error) {
            controller.error(error);
          } finally {
            rootSpan.end();
          }
        }
      });
      const stitchableStream = createStitchableStream();
      this.addStream = stitchableStream.addStream;
      this.closeStream = stitchableStream.close;
      let stream = stitchableStream.stream;
      for (const transform of transforms) {
        stream = stream.pipeThrough(
          transform({
            tools,
            stopStream() {
              stitchableStream.terminate();
            }
          })
        );
      }
      this.baseStream = stream.pipeThrough(createOutputTransformStream(output)).pipeThrough(eventProcessor);
      const { maxRetries, retry } = prepareRetries({
        maxRetries: maxRetriesArg
      });
      const tracer = getTracer(telemetry);
      const baseTelemetryAttributes = getBaseTelemetryAttributes({
        model,
        telemetry,
        headers,
        settings: { ...settings, maxRetries }
      });
      const initialPrompt = standardizePrompt({
        prompt: {
          system: (_a17 = output == null ? void 0 : output.injectIntoSystemPrompt({ system, model })) != null ? _a17 : system,
          prompt,
          messages
        },
        tools
      });
      const self = this;
      recordSpan({
        name: "ai.streamText",
        attributes: selectTelemetryAttributes({
          telemetry,
          attributes: {
            ...assembleOperationName({ operationId: "ai.streamText", telemetry }),
            ...baseTelemetryAttributes,
            // specific settings that only make sense on the outer level:
            "ai.prompt": {
              input: () => JSON.stringify({ system, prompt, messages })
            },
            "ai.settings.maxSteps": maxSteps
          }
        }),
        tracer,
        endWhenDone: false,
        fn: async (rootSpanArg) => {
          rootSpan = rootSpanArg;
          async function streamStep({
            currentStep,
            responseMessages,
            usage,
            stepType: stepType2,
            previousStepText,
            hasLeadingWhitespace,
            messageId
          }) {
            var _a18;
            const promptFormat = responseMessages.length === 0 ? initialPrompt.type : "messages";
            const stepInputMessages = [
              ...initialPrompt.messages,
              ...responseMessages
            ];
            const promptMessages = await convertToLanguageModelPrompt({
              prompt: {
                type: promptFormat,
                system: initialPrompt.system,
                messages: stepInputMessages
              },
              modelSupportsImageUrls: model.supportsImageUrls,
              modelSupportsUrl: (_a18 = model.supportsUrl) == null ? void 0 : _a18.bind(model)
              // support 'this' context
            });
            const mode = {
              type: "regular",
              ...prepareToolsAndToolChoice({ tools, toolChoice, activeTools })
            };
            const {
              result: { stream: stream2, warnings, rawResponse, request },
              doStreamSpan,
              startTimestampMs
            } = await retry(
              () => recordSpan({
                name: "ai.streamText.doStream",
                attributes: selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    ...assembleOperationName({
                      operationId: "ai.streamText.doStream",
                      telemetry
                    }),
                    ...baseTelemetryAttributes,
                    "ai.prompt.format": {
                      input: () => promptFormat
                    },
                    "ai.prompt.messages": {
                      input: () => stringifyForTelemetry(promptMessages)
                    },
                    "ai.prompt.tools": {
                      // convert the language model level tools:
                      input: () => {
                        var _a19;
                        return (_a19 = mode.tools) == null ? void 0 : _a19.map((tool2) => JSON.stringify(tool2));
                      }
                    },
                    "ai.prompt.toolChoice": {
                      input: () => mode.toolChoice != null ? JSON.stringify(mode.toolChoice) : void 0
                    },
                    // standardized gen-ai llm span attributes:
                    "gen_ai.system": model.provider,
                    "gen_ai.request.model": model.modelId,
                    "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                    "gen_ai.request.max_tokens": settings.maxTokens,
                    "gen_ai.request.presence_penalty": settings.presencePenalty,
                    "gen_ai.request.stop_sequences": settings.stopSequences,
                    "gen_ai.request.temperature": settings.temperature,
                    "gen_ai.request.top_k": settings.topK,
                    "gen_ai.request.top_p": settings.topP
                  }
                }),
                tracer,
                endWhenDone: false,
                fn: async (doStreamSpan2) => ({
                  startTimestampMs: now2(),
                  // get before the call
                  doStreamSpan: doStreamSpan2,
                  result: await model.doStream({
                    mode,
                    ...prepareCallSettings(settings),
                    inputFormat: promptFormat,
                    responseFormat: output == null ? void 0 : output.responseFormat({ model }),
                    prompt: promptMessages,
                    providerMetadata: providerOptions,
                    abortSignal,
                    headers
                  })
                })
              })
            );
            const transformedStream = runToolsTransformation({
              tools,
              generatorStream: stream2,
              toolCallStreaming,
              tracer,
              telemetry,
              system,
              messages: stepInputMessages,
              repairToolCall,
              abortSignal
            });
            const stepRequest = request != null ? request : {};
            const stepToolCalls = [];
            const stepToolResults = [];
            const stepReasoning2 = [];
            const stepFiles2 = [];
            let activeReasoningText2 = void 0;
            let stepFinishReason = "unknown";
            let stepUsage = {
              promptTokens: 0,
              completionTokens: 0,
              totalTokens: 0
            };
            let stepProviderMetadata;
            let stepFirstChunk = true;
            let stepText = "";
            let fullStepText = stepType2 === "continue" ? previousStepText : "";
            let stepLogProbs;
            let stepResponse = {
              id: generateId3(),
              timestamp: currentDate(),
              modelId: model.modelId
            };
            let chunkBuffer = "";
            let chunkTextPublished = false;
            let inWhitespacePrefix = true;
            let hasWhitespaceSuffix = false;
            async function publishTextChunk({
              controller,
              chunk
            }) {
              controller.enqueue(chunk);
              stepText += chunk.textDelta;
              fullStepText += chunk.textDelta;
              chunkTextPublished = true;
              hasWhitespaceSuffix = chunk.textDelta.trimEnd() !== chunk.textDelta;
            }
            self.addStream(
              transformedStream.pipeThrough(
                new TransformStream({
                  async transform(chunk, controller) {
                    var _a19, _b, _c;
                    if (stepFirstChunk) {
                      const msToFirstChunk = now2() - startTimestampMs;
                      stepFirstChunk = false;
                      doStreamSpan.addEvent("ai.stream.firstChunk", {
                        "ai.response.msToFirstChunk": msToFirstChunk
                      });
                      doStreamSpan.setAttributes({
                        "ai.response.msToFirstChunk": msToFirstChunk
                      });
                      controller.enqueue({
                        type: "step-start",
                        messageId,
                        request: stepRequest,
                        warnings: warnings != null ? warnings : []
                      });
                    }
                    if (chunk.type === "text-delta" && chunk.textDelta.length === 0) {
                      return;
                    }
                    const chunkType = chunk.type;
                    switch (chunkType) {
                      case "text-delta": {
                        if (continueSteps) {
                          const trimmedChunkText = inWhitespacePrefix && hasLeadingWhitespace ? chunk.textDelta.trimStart() : chunk.textDelta;
                          if (trimmedChunkText.length === 0) {
                            break;
                          }
                          inWhitespacePrefix = false;
                          chunkBuffer += trimmedChunkText;
                          const split = splitOnLastWhitespace(chunkBuffer);
                          if (split != null) {
                            chunkBuffer = split.suffix;
                            await publishTextChunk({
                              controller,
                              chunk: {
                                type: "text-delta",
                                textDelta: split.prefix + split.whitespace
                              }
                            });
                          }
                        } else {
                          await publishTextChunk({ controller, chunk });
                        }
                        break;
                      }
                      case "reasoning": {
                        controller.enqueue(chunk);
                        if (activeReasoningText2 == null) {
                          activeReasoningText2 = {
                            type: "text",
                            text: chunk.textDelta
                          };
                          stepReasoning2.push(activeReasoningText2);
                        } else {
                          activeReasoningText2.text += chunk.textDelta;
                        }
                        break;
                      }
                      case "reasoning-signature": {
                        controller.enqueue(chunk);
                        if (activeReasoningText2 == null) {
                          throw new InvalidStreamPartError({
                            chunk,
                            message: "reasoning-signature without reasoning"
                          });
                        }
                        activeReasoningText2.signature = chunk.signature;
                        activeReasoningText2 = void 0;
                        break;
                      }
                      case "redacted-reasoning": {
                        controller.enqueue(chunk);
                        stepReasoning2.push({
                          type: "redacted",
                          data: chunk.data
                        });
                        break;
                      }
                      case "tool-call": {
                        controller.enqueue(chunk);
                        stepToolCalls.push(chunk);
                        break;
                      }
                      case "tool-result": {
                        controller.enqueue(chunk);
                        stepToolResults.push(chunk);
                        break;
                      }
                      case "response-metadata": {
                        stepResponse = {
                          id: (_a19 = chunk.id) != null ? _a19 : stepResponse.id,
                          timestamp: (_b = chunk.timestamp) != null ? _b : stepResponse.timestamp,
                          modelId: (_c = chunk.modelId) != null ? _c : stepResponse.modelId
                        };
                        break;
                      }
                      case "finish": {
                        stepUsage = chunk.usage;
                        stepFinishReason = chunk.finishReason;
                        stepProviderMetadata = chunk.experimental_providerMetadata;
                        stepLogProbs = chunk.logprobs;
                        const msToFinish = now2() - startTimestampMs;
                        doStreamSpan.addEvent("ai.stream.finish");
                        doStreamSpan.setAttributes({
                          "ai.response.msToFinish": msToFinish,
                          "ai.response.avgCompletionTokensPerSecond": 1e3 * stepUsage.completionTokens / msToFinish
                        });
                        break;
                      }
                      case "file": {
                        stepFiles2.push(chunk);
                        controller.enqueue(chunk);
                        break;
                      }
                      case "source":
                      case "tool-call-streaming-start":
                      case "tool-call-delta": {
                        controller.enqueue(chunk);
                        break;
                      }
                      case "error": {
                        controller.enqueue(chunk);
                        stepFinishReason = "error";
                        break;
                      }
                      default: {
                        const exhaustiveCheck = chunkType;
                        throw new Error(`Unknown chunk type: ${exhaustiveCheck}`);
                      }
                    }
                  },
                  // invoke onFinish callback and resolve toolResults promise when the stream is about to close:
                  async flush(controller) {
                    const stepToolCallsJson = stepToolCalls.length > 0 ? JSON.stringify(stepToolCalls) : void 0;
                    let nextStepType = "done";
                    if (currentStep + 1 < maxSteps) {
                      if (continueSteps && stepFinishReason === "length" && // only use continue when there are no tool calls:
                      stepToolCalls.length === 0) {
                        nextStepType = "continue";
                      } else if (
                        // there are tool calls:
                        stepToolCalls.length > 0 && // all current tool calls have results:
                        stepToolResults.length === stepToolCalls.length
                      ) {
                        nextStepType = "tool-result";
                      }
                    }
                    if (continueSteps && chunkBuffer.length > 0 && (nextStepType !== "continue" || // when the next step is a regular step, publish the buffer
                    stepType2 === "continue" && !chunkTextPublished)) {
                      await publishTextChunk({
                        controller,
                        chunk: {
                          type: "text-delta",
                          textDelta: chunkBuffer
                        }
                      });
                      chunkBuffer = "";
                    }
                    try {
                      doStreamSpan.setAttributes(
                        selectTelemetryAttributes({
                          telemetry,
                          attributes: {
                            "ai.response.finishReason": stepFinishReason,
                            "ai.response.text": { output: () => stepText },
                            "ai.response.toolCalls": {
                              output: () => stepToolCallsJson
                            },
                            "ai.response.id": stepResponse.id,
                            "ai.response.model": stepResponse.modelId,
                            "ai.response.timestamp": stepResponse.timestamp.toISOString(),
                            "ai.response.providerMetadata": JSON.stringify(stepProviderMetadata),
                            "ai.usage.promptTokens": stepUsage.promptTokens,
                            "ai.usage.completionTokens": stepUsage.completionTokens,
                            // standardized gen-ai llm span attributes:
                            "gen_ai.response.finish_reasons": [stepFinishReason],
                            "gen_ai.response.id": stepResponse.id,
                            "gen_ai.response.model": stepResponse.modelId,
                            "gen_ai.usage.input_tokens": stepUsage.promptTokens,
                            "gen_ai.usage.output_tokens": stepUsage.completionTokens
                          }
                        })
                      );
                    } catch (error) {
                    } finally {
                      doStreamSpan.end();
                    }
                    controller.enqueue({
                      type: "step-finish",
                      finishReason: stepFinishReason,
                      usage: stepUsage,
                      providerMetadata: stepProviderMetadata,
                      experimental_providerMetadata: stepProviderMetadata,
                      logprobs: stepLogProbs,
                      request: stepRequest,
                      response: {
                        ...stepResponse,
                        headers: rawResponse == null ? void 0 : rawResponse.headers
                      },
                      warnings,
                      isContinued: nextStepType === "continue",
                      messageId
                    });
                    const combinedUsage = addLanguageModelUsage(usage, stepUsage);
                    if (nextStepType === "done") {
                      controller.enqueue({
                        type: "finish",
                        finishReason: stepFinishReason,
                        usage: combinedUsage,
                        providerMetadata: stepProviderMetadata,
                        experimental_providerMetadata: stepProviderMetadata,
                        logprobs: stepLogProbs,
                        response: {
                          ...stepResponse,
                          headers: rawResponse == null ? void 0 : rawResponse.headers
                        }
                      });
                      self.closeStream();
                    } else {
                      if (stepType2 === "continue") {
                        const lastMessage = responseMessages[responseMessages.length - 1];
                        if (typeof lastMessage.content === "string") {
                          lastMessage.content += stepText;
                        } else {
                          lastMessage.content.push({
                            text: stepText,
                            type: "text"
                          });
                        }
                      } else {
                        responseMessages.push(
                          ...toResponseMessages({
                            text: stepText,
                            files: stepFiles2,
                            reasoning: stepReasoning2,
                            tools: tools != null ? tools : {},
                            toolCalls: stepToolCalls,
                            toolResults: stepToolResults,
                            messageId,
                            generateMessageId
                          })
                        );
                      }
                      await streamStep({
                        currentStep: currentStep + 1,
                        responseMessages,
                        usage: combinedUsage,
                        stepType: nextStepType,
                        previousStepText: fullStepText,
                        hasLeadingWhitespace: hasWhitespaceSuffix,
                        messageId: (
                          // keep the same id when continuing a step:
                          nextStepType === "continue" ? messageId : generateMessageId()
                        )
                      });
                    }
                  }
                })
              )
            );
          }
          await streamStep({
            currentStep: 0,
            responseMessages: [],
            usage: {
              promptTokens: 0,
              completionTokens: 0,
              totalTokens: 0
            },
            previousStepText: "",
            stepType: "initial",
            hasLeadingWhitespace: false,
            messageId: generateMessageId()
          });
        }
      }).catch((error) => {
        self.addStream(
          new ReadableStream({
            start(controller) {
              controller.enqueue({ type: "error", error });
              controller.close();
            }
          })
        );
        self.closeStream();
      });
    }
    get warnings() {
      return this.warningsPromise.value;
    }
    get usage() {
      return this.usagePromise.value;
    }
    get finishReason() {
      return this.finishReasonPromise.value;
    }
    get experimental_providerMetadata() {
      return this.providerMetadataPromise.value;
    }
    get providerMetadata() {
      return this.providerMetadataPromise.value;
    }
    get text() {
      return this.textPromise.value;
    }
    get reasoning() {
      return this.reasoningPromise.value;
    }
    get reasoningDetails() {
      return this.reasoningDetailsPromise.value;
    }
    get sources() {
      return this.sourcesPromise.value;
    }
    get files() {
      return this.filesPromise.value;
    }
    get toolCalls() {
      return this.toolCallsPromise.value;
    }
    get toolResults() {
      return this.toolResultsPromise.value;
    }
    get request() {
      return this.requestPromise.value;
    }
    get response() {
      return this.responsePromise.value;
    }
    get steps() {
      return this.stepsPromise.value;
    }
    /**
    Split out a new stream from the original stream.
    The original stream is replaced to allow for further splitting,
    since we do not know how many times the stream will be split.
    
    Note: this leads to buffering the stream content on the server.
    However, the LLM results are expected to be small enough to not cause issues.
       */
    teeStream() {
      const [stream1, stream2] = this.baseStream.tee();
      this.baseStream = stream2;
      return stream1;
    }
    get textStream() {
      return createAsyncIterableStream(
        this.teeStream().pipeThrough(
          new TransformStream({
            transform({ part }, controller) {
              if (part.type === "text-delta") {
                controller.enqueue(part.textDelta);
              }
            }
          })
        )
      );
    }
    get fullStream() {
      return createAsyncIterableStream(
        this.teeStream().pipeThrough(
          new TransformStream({
            transform({ part }, controller) {
              controller.enqueue(part);
            }
          })
        )
      );
    }
    async consumeStream(options) {
      var _a17;
      try {
        await consumeStream({
          stream: this.fullStream,
          onError: options == null ? void 0 : options.onError
        });
      } catch (error) {
        (_a17 = options == null ? void 0 : options.onError) == null ? void 0 : _a17.call(options, error);
      }
    }
    get experimental_partialOutputStream() {
      if (this.output == null) {
        throw new NoOutputSpecifiedError();
      }
      return createAsyncIterableStream(
        this.teeStream().pipeThrough(
          new TransformStream({
            transform({ partialOutput }, controller) {
              if (partialOutput != null) {
                controller.enqueue(partialOutput);
              }
            }
          })
        )
      );
    }
    toDataStreamInternal({
      getErrorMessage: getErrorMessage5 = () => "An error occurred.",
      // mask error messages for safety by default
      sendUsage = true,
      sendReasoning = false,
      sendSources = false,
      experimental_sendFinish = true
    }) {
      return this.fullStream.pipeThrough(
        new TransformStream({
          transform: async (chunk, controller) => {
            const chunkType = chunk.type;
            switch (chunkType) {
              case "text-delta": {
                controller.enqueue(formatDataStreamPart("text", chunk.textDelta));
                break;
              }
              case "reasoning": {
                if (sendReasoning) {
                  controller.enqueue(
                    formatDataStreamPart("reasoning", chunk.textDelta)
                  );
                }
                break;
              }
              case "redacted-reasoning": {
                if (sendReasoning) {
                  controller.enqueue(
                    formatDataStreamPart("redacted_reasoning", {
                      data: chunk.data
                    })
                  );
                }
                break;
              }
              case "reasoning-signature": {
                if (sendReasoning) {
                  controller.enqueue(
                    formatDataStreamPart("reasoning_signature", {
                      signature: chunk.signature
                    })
                  );
                }
                break;
              }
              case "file": {
                controller.enqueue(
                  formatDataStreamPart("file", {
                    mimeType: chunk.mimeType,
                    data: chunk.base64
                  })
                );
                break;
              }
              case "source": {
                if (sendSources) {
                  controller.enqueue(
                    formatDataStreamPart("source", chunk.source)
                  );
                }
                break;
              }
              case "tool-call-streaming-start": {
                controller.enqueue(
                  formatDataStreamPart("tool_call_streaming_start", {
                    toolCallId: chunk.toolCallId,
                    toolName: chunk.toolName
                  })
                );
                break;
              }
              case "tool-call-delta": {
                controller.enqueue(
                  formatDataStreamPart("tool_call_delta", {
                    toolCallId: chunk.toolCallId,
                    argsTextDelta: chunk.argsTextDelta
                  })
                );
                break;
              }
              case "tool-call": {
                controller.enqueue(
                  formatDataStreamPart("tool_call", {
                    toolCallId: chunk.toolCallId,
                    toolName: chunk.toolName,
                    args: chunk.args
                  })
                );
                break;
              }
              case "tool-result": {
                controller.enqueue(
                  formatDataStreamPart("tool_result", {
                    toolCallId: chunk.toolCallId,
                    result: chunk.result
                  })
                );
                break;
              }
              case "error": {
                controller.enqueue(
                  formatDataStreamPart("error", getErrorMessage5(chunk.error))
                );
                break;
              }
              case "step-start": {
                controller.enqueue(
                  formatDataStreamPart("start_step", {
                    messageId: chunk.messageId
                  })
                );
                break;
              }
              case "step-finish": {
                controller.enqueue(
                  formatDataStreamPart("finish_step", {
                    finishReason: chunk.finishReason,
                    usage: sendUsage ? {
                      promptTokens: chunk.usage.promptTokens,
                      completionTokens: chunk.usage.completionTokens
                    } : void 0,
                    isContinued: chunk.isContinued
                  })
                );
                break;
              }
              case "finish": {
                if (experimental_sendFinish) {
                  controller.enqueue(
                    formatDataStreamPart("finish_message", {
                      finishReason: chunk.finishReason,
                      usage: sendUsage ? {
                        promptTokens: chunk.usage.promptTokens,
                        completionTokens: chunk.usage.completionTokens
                      } : void 0
                    })
                  );
                }
                break;
              }
              default: {
                const exhaustiveCheck = chunkType;
                throw new Error(`Unknown chunk type: ${exhaustiveCheck}`);
              }
            }
          }
        })
      );
    }
    pipeDataStreamToResponse(response, {
      status,
      statusText,
      headers,
      data,
      getErrorMessage: getErrorMessage5,
      sendUsage,
      sendReasoning,
      sendSources,
      experimental_sendFinish
    } = {}) {
      writeToServerResponse({
        response,
        status,
        statusText,
        headers: prepareOutgoingHttpHeaders(headers, {
          contentType: "text/plain; charset=utf-8",
          dataStreamVersion: "v1"
        }),
        stream: this.toDataStream({
          data,
          getErrorMessage: getErrorMessage5,
          sendUsage,
          sendReasoning,
          sendSources,
          experimental_sendFinish
        })
      });
    }
    pipeTextStreamToResponse(response, init) {
      writeToServerResponse({
        response,
        status: init == null ? void 0 : init.status,
        statusText: init == null ? void 0 : init.statusText,
        headers: prepareOutgoingHttpHeaders(init == null ? void 0 : init.headers, {
          contentType: "text/plain; charset=utf-8"
        }),
        stream: this.textStream.pipeThrough(new TextEncoderStream())
      });
    }
    // TODO breaking change 5.0: remove pipeThrough(new TextEncoderStream())
    toDataStream(options) {
      const stream = this.toDataStreamInternal({
        getErrorMessage: options == null ? void 0 : options.getErrorMessage,
        sendUsage: options == null ? void 0 : options.sendUsage,
        sendReasoning: options == null ? void 0 : options.sendReasoning,
        sendSources: options == null ? void 0 : options.sendSources,
        experimental_sendFinish: options == null ? void 0 : options.experimental_sendFinish
      }).pipeThrough(new TextEncoderStream());
      return (options == null ? void 0 : options.data) ? mergeStreams(options == null ? void 0 : options.data.stream, stream) : stream;
    }
    mergeIntoDataStream(writer, options) {
      writer.merge(
        this.toDataStreamInternal({
          getErrorMessage: writer.onError,
          sendUsage: options == null ? void 0 : options.sendUsage,
          sendReasoning: options == null ? void 0 : options.sendReasoning,
          sendSources: options == null ? void 0 : options.sendSources,
          experimental_sendFinish: options == null ? void 0 : options.experimental_sendFinish
        })
      );
    }
    toDataStreamResponse({
      headers,
      status,
      statusText,
      data,
      getErrorMessage: getErrorMessage5,
      sendUsage,
      sendReasoning,
      sendSources,
      experimental_sendFinish
    } = {}) {
      return new Response(
        this.toDataStream({
          data,
          getErrorMessage: getErrorMessage5,
          sendUsage,
          sendReasoning,
          sendSources,
          experimental_sendFinish
        }),
        {
          status,
          statusText,
          headers: prepareResponseHeaders(headers, {
            contentType: "text/plain; charset=utf-8",
            dataStreamVersion: "v1"
          })
        }
      );
    }
    toTextStreamResponse(init) {
      var _a17;
      return new Response(this.textStream.pipeThrough(new TextEncoderStream()), {
        status: (_a17 = init == null ? void 0 : init.status) != null ? _a17 : 200,
        headers: prepareResponseHeaders(init == null ? void 0 : init.headers, {
          contentType: "text/plain; charset=utf-8"
        })
      });
    }
  };

  // core/tool/tool.ts
  function tool(tool2) {
    return tool2;
  }
  var ClientOrServerImplementationSchema = objectType({
    name: stringType(),
    version: stringType()
  }).passthrough();
  var BaseParamsSchema = objectType({
    _meta: optionalType(objectType({}).passthrough())
  }).passthrough();
  var ResultSchema = BaseParamsSchema;
  var RequestSchema = objectType({
    method: stringType(),
    params: optionalType(BaseParamsSchema)
  });
  var ServerCapabilitiesSchema = objectType({
    experimental: optionalType(objectType({}).passthrough()),
    logging: optionalType(objectType({}).passthrough()),
    prompts: optionalType(
      objectType({
        listChanged: optionalType(booleanType())
      }).passthrough()
    ),
    resources: optionalType(
      objectType({
        subscribe: optionalType(booleanType()),
        listChanged: optionalType(booleanType())
      }).passthrough()
    ),
    tools: optionalType(
      objectType({
        listChanged: optionalType(booleanType())
      }).passthrough()
    )
  }).passthrough();
  ResultSchema.extend({
    protocolVersion: stringType(),
    capabilities: ServerCapabilitiesSchema,
    serverInfo: ClientOrServerImplementationSchema,
    instructions: optionalType(stringType())
  });
  var PaginatedResultSchema = ResultSchema.extend({
    nextCursor: optionalType(stringType())
  });
  var ToolSchema = objectType({
    name: stringType(),
    description: optionalType(stringType()),
    inputSchema: objectType({
      type: literalType("object"),
      properties: optionalType(objectType({}).passthrough())
    }).passthrough()
  }).passthrough();
  PaginatedResultSchema.extend({
    tools: arrayType(ToolSchema)
  });
  var TextContentSchema = objectType({
    type: literalType("text"),
    text: stringType()
  }).passthrough();
  var ImageContentSchema = objectType({
    type: literalType("image"),
    data: stringType().base64(),
    mimeType: stringType()
  }).passthrough();
  var ResourceContentsSchema = objectType({
    /**
     * The URI of this resource.
     */
    uri: stringType(),
    /**
     * The MIME type of this resource, if known.
     */
    mimeType: optionalType(stringType())
  }).passthrough();
  var TextResourceContentsSchema = ResourceContentsSchema.extend({
    text: stringType()
  });
  var BlobResourceContentsSchema = ResourceContentsSchema.extend({
    blob: stringType().base64()
  });
  var EmbeddedResourceSchema = objectType({
    type: literalType("resource"),
    resource: unionType([TextResourceContentsSchema, BlobResourceContentsSchema])
  }).passthrough();
  ResultSchema.extend({
    content: arrayType(
      unionType([TextContentSchema, ImageContentSchema, EmbeddedResourceSchema])
    ),
    isError: booleanType().default(false).optional()
  }).or(
    ResultSchema.extend({
      toolResult: unknownType()
    })
  );

  // core/tool/mcp/json-rpc-message.ts
  var JSONRPC_VERSION = "2.0";
  var JSONRPCRequestSchema = objectType({
    jsonrpc: literalType(JSONRPC_VERSION),
    id: unionType([stringType(), numberType().int()])
  }).merge(RequestSchema).strict();
  var JSONRPCResponseSchema = objectType({
    jsonrpc: literalType(JSONRPC_VERSION),
    id: unionType([stringType(), numberType().int()]),
    result: ResultSchema
  }).strict();
  var JSONRPCErrorSchema = objectType({
    jsonrpc: literalType(JSONRPC_VERSION),
    id: unionType([stringType(), numberType().int()]),
    error: objectType({
      code: numberType().int(),
      message: stringType(),
      data: optionalType(unknownType())
    })
  }).strict();
  var JSONRPCNotificationSchema = objectType({
    jsonrpc: literalType(JSONRPC_VERSION)
  }).merge(
    objectType({
      method: stringType(),
      params: optionalType(BaseParamsSchema)
    })
  ).strict();
  unionType([
    JSONRPCRequestSchema,
    JSONRPCNotificationSchema,
    JSONRPCResponseSchema,
    JSONRPCErrorSchema
  ]);

  // streams/langchain-adapter.ts
  var langchain_adapter_exports = {};
  __export(langchain_adapter_exports, {
    mergeIntoDataStream: () => mergeIntoDataStream,
    toDataStream: () => toDataStream,
    toDataStreamResponse: () => toDataStreamResponse
  });

  // streams/stream-callbacks.ts
  function createCallbacksTransformer(callbacks = {}) {
    const textEncoder = new TextEncoder();
    let aggregatedResponse = "";
    return new TransformStream({
      async start() {
        if (callbacks.onStart)
          await callbacks.onStart();
      },
      async transform(message, controller) {
        controller.enqueue(textEncoder.encode(message));
        aggregatedResponse += message;
        if (callbacks.onToken)
          await callbacks.onToken(message);
        if (callbacks.onText && typeof message === "string") {
          await callbacks.onText(message);
        }
      },
      async flush() {
        if (callbacks.onCompletion) {
          await callbacks.onCompletion(aggregatedResponse);
        }
        if (callbacks.onFinal) {
          await callbacks.onFinal(aggregatedResponse);
        }
      }
    });
  }

  // streams/langchain-adapter.ts
  function toDataStreamInternal(stream, callbacks) {
    return stream.pipeThrough(
      new TransformStream({
        transform: async (value, controller) => {
          var _a17;
          if (typeof value === "string") {
            controller.enqueue(value);
            return;
          }
          if ("event" in value) {
            if (value.event === "on_chat_model_stream") {
              forwardAIMessageChunk(
                (_a17 = value.data) == null ? void 0 : _a17.chunk,
                controller
              );
            }
            return;
          }
          forwardAIMessageChunk(value, controller);
        }
      })
    ).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(new TextDecoderStream()).pipeThrough(
      new TransformStream({
        transform: async (chunk, controller) => {
          controller.enqueue(formatDataStreamPart("text", chunk));
        }
      })
    );
  }
  function toDataStream(stream, callbacks) {
    return toDataStreamInternal(stream, callbacks).pipeThrough(
      new TextEncoderStream()
    );
  }
  function toDataStreamResponse(stream, options) {
    var _a17;
    const dataStream = toDataStreamInternal(
      stream,
      options == null ? void 0 : options.callbacks
    ).pipeThrough(new TextEncoderStream());
    const data = options == null ? void 0 : options.data;
    const init = options == null ? void 0 : options.init;
    const responseStream = data ? mergeStreams(data.stream, dataStream) : dataStream;
    return new Response(responseStream, {
      status: (_a17 = init == null ? void 0 : init.status) != null ? _a17 : 200,
      statusText: init == null ? void 0 : init.statusText,
      headers: prepareResponseHeaders(init == null ? void 0 : init.headers, {
        contentType: "text/plain; charset=utf-8",
        dataStreamVersion: "v1"
      })
    });
  }
  function mergeIntoDataStream(stream, options) {
    options.dataStream.merge(toDataStreamInternal(stream, options.callbacks));
  }
  function forwardAIMessageChunk(chunk, controller) {
    if (typeof chunk.content === "string") {
      controller.enqueue(chunk.content);
    } else {
      const content = chunk.content;
      for (const item of content) {
        if (item.type === "text") {
          controller.enqueue(item.text);
        }
      }
    }
  }

  // streams/llamaindex-adapter.ts
  var llamaindex_adapter_exports = {};
  __export(llamaindex_adapter_exports, {
    mergeIntoDataStream: () => mergeIntoDataStream2,
    toDataStream: () => toDataStream2,
    toDataStreamResponse: () => toDataStreamResponse2
  });
  function toDataStreamInternal2(stream, callbacks) {
    const trimStart = trimStartOfStream();
    return convertAsyncIteratorToReadableStream(stream[Symbol.asyncIterator]()).pipeThrough(
      new TransformStream({
        async transform(message, controller) {
          controller.enqueue(trimStart(message.delta));
        }
      })
    ).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(new TextDecoderStream()).pipeThrough(
      new TransformStream({
        transform: async (chunk, controller) => {
          controller.enqueue(formatDataStreamPart("text", chunk));
        }
      })
    );
  }
  function toDataStream2(stream, callbacks) {
    return toDataStreamInternal2(stream, callbacks).pipeThrough(
      new TextEncoderStream()
    );
  }
  function toDataStreamResponse2(stream, options = {}) {
    var _a17;
    const { init, data, callbacks } = options;
    const dataStream = toDataStreamInternal2(stream, callbacks).pipeThrough(
      new TextEncoderStream()
    );
    const responseStream = data ? mergeStreams(data.stream, dataStream) : dataStream;
    return new Response(responseStream, {
      status: (_a17 = init == null ? void 0 : init.status) != null ? _a17 : 200,
      statusText: init == null ? void 0 : init.statusText,
      headers: prepareResponseHeaders(init == null ? void 0 : init.headers, {
        contentType: "text/plain; charset=utf-8",
        dataStreamVersion: "v1"
      })
    });
  }
  function mergeIntoDataStream2(stream, options) {
    options.dataStream.merge(toDataStreamInternal2(stream, options.callbacks));
  }
  function trimStartOfStream() {
    let isStreamStart = true;
    return (text2) => {
      if (isStreamStart) {
        text2 = text2.trimStart();
        if (text2)
          isStreamStart = false;
      }
      return text2;
    };
  }

  // src/mistral-provider.ts
  function convertToMistralChatMessages(prompt) {
    const messages = [];
    for (let i = 0; i < prompt.length; i++) {
      const { role, content } = prompt[i];
      const isLastMessage = i === prompt.length - 1;
      switch (role) {
        case "system": {
          messages.push({ role: "system", content });
          break;
        }
        case "user": {
          messages.push({
            role: "user",
            content: content.map((part) => {
              var _a;
              switch (part.type) {
                case "text": {
                  return { type: "text", text: part.text };
                }
                case "image": {
                  return {
                    type: "image_url",
                    image_url: part.image instanceof URL ? part.image.toString() : `data:${(_a = part.mimeType) != null ? _a : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`
                  };
                }
                case "file": {
                  if (!(part.data instanceof URL)) {
                    throw new UnsupportedFunctionalityError({
                      functionality: "File content parts in user messages"
                    });
                  }
                  switch (part.mimeType) {
                    case "application/pdf": {
                      return {
                        type: "document_url",
                        document_url: part.data.toString()
                      };
                    }
                    default: {
                      throw new UnsupportedFunctionalityError({
                        functionality: "Only PDF files are supported in user messages"
                      });
                    }
                  }
                }
              }
            })
          });
          break;
        }
        case "assistant": {
          let text = "";
          const toolCalls = [];
          for (const part of content) {
            switch (part.type) {
              case "text": {
                text += part.text;
                break;
              }
              case "tool-call": {
                toolCalls.push({
                  id: part.toolCallId,
                  type: "function",
                  function: {
                    name: part.toolName,
                    arguments: JSON.stringify(part.args)
                  }
                });
                break;
              }
            }
          }
          messages.push({
            role: "assistant",
            content: text,
            prefix: isLastMessage ? true : void 0,
            tool_calls: toolCalls.length > 0 ? toolCalls : void 0
          });
          break;
        }
        case "tool": {
          for (const toolResponse of content) {
            messages.push({
              role: "tool",
              name: toolResponse.toolName,
              content: JSON.stringify(toolResponse.result),
              tool_call_id: toolResponse.toolCallId
            });
          }
          break;
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    return messages;
  }

  // src/map-mistral-finish-reason.ts
  function mapMistralFinishReason(finishReason) {
    switch (finishReason) {
      case "stop":
        return "stop";
      case "length":
      case "model_length":
        return "length";
      case "tool_calls":
        return "tool-calls";
      default:
        return "unknown";
    }
  }
  var mistralErrorDataSchema = objectType({
    object: literalType("error"),
    message: stringType(),
    type: stringType(),
    param: stringType().nullable(),
    code: stringType().nullable()
  });
  var mistralFailedResponseHandler = createJsonErrorResponseHandler({
    errorSchema: mistralErrorDataSchema,
    errorToMessage: (data) => data.message
  });

  // src/get-response-metadata.ts
  function getResponseMetadata$3({
    id,
    model,
    created
  }) {
    return {
      id: id != null ? id : void 0,
      modelId: model != null ? model : void 0,
      timestamp: created != null ? new Date(created * 1e3) : void 0
    };
  }
  function prepareTools$5(mode) {
    var _a;
    const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
    const toolWarnings = [];
    if (tools == null) {
      return { tools: void 0, tool_choice: void 0, toolWarnings };
    }
    const mistralTools = [];
    for (const tool of tools) {
      if (tool.type === "provider-defined") {
        toolWarnings.push({ type: "unsupported-tool", tool });
      } else {
        mistralTools.push({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
          }
        });
      }
    }
    const toolChoice = mode.toolChoice;
    if (toolChoice == null) {
      return { tools: mistralTools, tool_choice: void 0, toolWarnings };
    }
    const type = toolChoice.type;
    switch (type) {
      case "auto":
      case "none":
        return { tools: mistralTools, tool_choice: type, toolWarnings };
      case "required":
        return { tools: mistralTools, tool_choice: "any", toolWarnings };
      case "tool":
        return {
          tools: mistralTools.filter(
            (tool) => tool.function.name === toolChoice.toolName
          ),
          tool_choice: "any",
          toolWarnings
        };
      default: {
        const _exhaustiveCheck = type;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
        });
      }
    }
  }

  // src/mistral-chat-language-model.ts
  var MistralChatLanguageModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.defaultObjectGenerationMode = "json";
      this.supportsImageUrls = false;
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    get provider() {
      return this.config.provider;
    }
    supportsUrl(url) {
      return url.protocol === "https:";
    }
    getArgs({
      mode,
      prompt,
      maxTokens,
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      stopSequences,
      responseFormat,
      seed,
      providerMetadata
    }) {
      var _a, _b;
      const type = mode.type;
      const warnings = [];
      if (topK != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "topK"
        });
      }
      if (frequencyPenalty != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty"
        });
      }
      if (presencePenalty != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty"
        });
      }
      if (stopSequences != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "stopSequences"
        });
      }
      if (responseFormat != null && responseFormat.type === "json" && responseFormat.schema != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "responseFormat",
          details: "JSON response format schema is not supported"
        });
      }
      const baseArgs = {
        // model id:
        model: this.modelId,
        // model specific settings:
        safe_prompt: this.settings.safePrompt,
        // standardized settings:
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        random_seed: seed,
        // response format:
        response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? { type: "json_object" } : void 0,
        // mistral-specific provider options:
        document_image_limit: (_a = providerMetadata == null ? void 0 : providerMetadata.mistral) == null ? void 0 : _a.documentImageLimit,
        document_page_limit: (_b = providerMetadata == null ? void 0 : providerMetadata.mistral) == null ? void 0 : _b.documentPageLimit,
        // messages:
        messages: convertToMistralChatMessages(prompt)
      };
      switch (type) {
        case "regular": {
          const { tools, tool_choice, toolWarnings } = prepareTools$5(mode);
          return {
            args: { ...baseArgs, tools, tool_choice },
            warnings: [...warnings, ...toolWarnings]
          };
        }
        case "object-json": {
          return {
            args: {
              ...baseArgs,
              response_format: { type: "json_object" }
            },
            warnings
          };
        }
        case "object-tool": {
          return {
            args: {
              ...baseArgs,
              tool_choice: "any",
              tools: [{ type: "function", function: mode.tool }]
            },
            warnings
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    async doGenerate(options) {
      var _a;
      const { args, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: `${this.config.baseURL}/chat/completions`,
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: mistralFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          mistralChatResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      const choice = response.choices[0];
      let text = extractTextContent(choice.message.content);
      const lastMessage = rawPrompt[rawPrompt.length - 1];
      if (lastMessage.role === "assistant" && (text == null ? void 0 : text.startsWith(lastMessage.content))) {
        text = text.slice(lastMessage.content.length);
      }
      return {
        text,
        toolCalls: (_a = choice.message.tool_calls) == null ? void 0 : _a.map((toolCall) => ({
          toolCallType: "function",
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          args: toolCall.function.arguments
        })),
        finishReason: mapMistralFinishReason(choice.finish_reason),
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: {
          headers: responseHeaders,
          body: rawResponse
        },
        request: { body: JSON.stringify(args) },
        response: getResponseMetadata$3(response),
        warnings
      };
    }
    async doStream(options) {
      const { args, warnings } = this.getArgs(options);
      const body = { ...args, stream: true };
      const { responseHeaders, value: response } = await postJsonToApi({
        url: `${this.config.baseURL}/chat/completions`,
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: mistralFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          mistralChatChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      let chunkNumber = 0;
      let trimLeadingSpace = false;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              if (!chunk.success) {
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              chunkNumber++;
              const value = chunk.value;
              if (chunkNumber === 1) {
                controller.enqueue({
                  type: "response-metadata",
                  ...getResponseMetadata$3(value)
                });
              }
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens
                };
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapMistralFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              const textContent = extractTextContent(delta.content);
              if (chunkNumber <= 2) {
                const lastMessage = rawPrompt[rawPrompt.length - 1];
                if (lastMessage.role === "assistant" && textContent === lastMessage.content.trimEnd()) {
                  if (textContent.length < lastMessage.content.length) {
                    trimLeadingSpace = true;
                  }
                  return;
                }
              }
              if (textContent != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: trimLeadingSpace ? textContent.trimStart() : textContent
                });
                trimLeadingSpace = false;
              }
              if (delta.tool_calls != null) {
                for (const toolCall of delta.tool_calls) {
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    argsTextDelta: toolCall.function.arguments
                  });
                  controller.enqueue({
                    type: "tool-call",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    args: toolCall.function.arguments
                  });
                }
              }
            },
            flush(controller) {
              controller.enqueue({ type: "finish", finishReason, usage });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    }
  };
  function extractTextContent(content) {
    if (typeof content === "string") {
      return content;
    }
    if (content == null) {
      return void 0;
    }
    const textContent = [];
    for (const chunk of content) {
      const { type } = chunk;
      switch (type) {
        case "text":
          textContent.push(chunk.text);
          break;
        case "image_url":
        case "reference":
          break;
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    return textContent.length ? textContent.join("") : void 0;
  }
  var mistralContentSchema = unionType([
    stringType(),
    arrayType(
      discriminatedUnionType("type", [
        objectType({
          type: literalType("text"),
          text: stringType()
        }),
        objectType({
          type: literalType("image_url"),
          image_url: unionType([
            stringType(),
            objectType({
              url: stringType(),
              detail: stringType().nullable()
            })
          ])
        }),
        objectType({
          type: literalType("reference"),
          reference_ids: arrayType(numberType())
        })
      ])
    )
  ]).nullish();
  var mistralChatResponseSchema = objectType({
    id: stringType().nullish(),
    created: numberType().nullish(),
    model: stringType().nullish(),
    choices: arrayType(
      objectType({
        message: objectType({
          role: literalType("assistant"),
          content: mistralContentSchema,
          tool_calls: arrayType(
            objectType({
              id: stringType(),
              function: objectType({ name: stringType(), arguments: stringType() })
            })
          ).nullish()
        }),
        index: numberType(),
        finish_reason: stringType().nullish()
      })
    ),
    object: literalType("chat.completion"),
    usage: objectType({
      prompt_tokens: numberType(),
      completion_tokens: numberType()
    })
  });
  var mistralChatChunkSchema = objectType({
    id: stringType().nullish(),
    created: numberType().nullish(),
    model: stringType().nullish(),
    choices: arrayType(
      objectType({
        delta: objectType({
          role: enumType(["assistant"]).optional(),
          content: mistralContentSchema,
          tool_calls: arrayType(
            objectType({
              id: stringType(),
              function: objectType({ name: stringType(), arguments: stringType() })
            })
          ).nullish()
        }),
        finish_reason: stringType().nullish(),
        index: numberType()
      })
    ),
    usage: objectType({
      prompt_tokens: numberType(),
      completion_tokens: numberType()
    }).nullish()
  });
  var MistralEmbeddingModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    get provider() {
      return this.config.provider;
    }
    get maxEmbeddingsPerCall() {
      var _a;
      return (_a = this.settings.maxEmbeddingsPerCall) != null ? _a : 32;
    }
    get supportsParallelCalls() {
      var _a;
      return (_a = this.settings.supportsParallelCalls) != null ? _a : false;
    }
    async doEmbed({
      values,
      abortSignal,
      headers
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          provider: this.provider,
          modelId: this.modelId,
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          values
        });
      }
      const { responseHeaders, value: response } = await postJsonToApi({
        url: `${this.config.baseURL}/embeddings`,
        headers: combineHeaders(this.config.headers(), headers),
        body: {
          model: this.modelId,
          input: values,
          encoding_format: "float"
        },
        failedResponseHandler: mistralFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          MistralTextEmbeddingResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: response.data.map((item) => item.embedding),
        usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
        rawResponse: { headers: responseHeaders }
      };
    }
  };
  var MistralTextEmbeddingResponseSchema = objectType({
    data: arrayType(objectType({ embedding: arrayType(numberType()) })),
    usage: objectType({ prompt_tokens: numberType() }).nullish()
  });

  // src/mistral-provider.ts
  function createMistral(options = {}) {
    var _a;
    const baseURL = (_a = withoutTrailingSlash(options.baseURL)) != null ? _a : "https://api.mistral.ai/v1";
    const getHeaders = () => ({
      Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "MISTRAL_API_KEY",
      description: "Mistral"
    })}`,
      ...options.headers
    });
    const createChatModel = (modelId, settings = {}) => new MistralChatLanguageModel(modelId, settings, {
      provider: "mistral.chat",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch
    });
    const createEmbeddingModel = (modelId, settings = {}) => new MistralEmbeddingModel(modelId, settings, {
      provider: "mistral.embedding",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch
    });
    const provider = function(modelId, settings) {
      if (new.target) {
        throw new Error(
          "The Mistral model function cannot be called with the new keyword."
        );
      }
      return createChatModel(modelId, settings);
    };
    provider.languageModel = createChatModel;
    provider.chat = createChatModel;
    provider.embedding = createEmbeddingModel;
    provider.textEmbedding = createEmbeddingModel;
    provider.textEmbeddingModel = createEmbeddingModel;
    return provider;
  }
  createMistral();

  // src/google-provider.ts

  // src/convert-json-schema-to-openapi-schema.ts
  function convertJSONSchemaToOpenAPISchema(jsonSchema) {
    if (isEmptyObjectSchema(jsonSchema)) {
      return void 0;
    }
    if (typeof jsonSchema === "boolean") {
      return { type: "boolean", properties: {} };
    }
    const {
      type,
      description,
      required,
      properties,
      items,
      allOf,
      anyOf,
      oneOf,
      format,
      const: constValue,
      minLength,
      enum: enumValues
    } = jsonSchema;
    const result = {};
    if (description)
      result.description = description;
    if (required)
      result.required = required;
    if (format)
      result.format = format;
    if (constValue !== void 0) {
      result.enum = [constValue];
    }
    if (type) {
      if (Array.isArray(type)) {
        if (type.includes("null")) {
          result.type = type.filter((t) => t !== "null")[0];
          result.nullable = true;
        } else {
          result.type = type;
        }
      } else if (type === "null") {
        result.type = "null";
      } else {
        result.type = type;
      }
    }
    if (enumValues !== void 0) {
      result.enum = enumValues;
    }
    if (properties != null) {
      result.properties = Object.entries(properties).reduce(
        (acc, [key, value]) => {
          acc[key] = convertJSONSchemaToOpenAPISchema(value);
          return acc;
        },
        {}
      );
    }
    if (items) {
      result.items = Array.isArray(items) ? items.map(convertJSONSchemaToOpenAPISchema) : convertJSONSchemaToOpenAPISchema(items);
    }
    if (allOf) {
      result.allOf = allOf.map(convertJSONSchemaToOpenAPISchema);
    }
    if (anyOf) {
      if (anyOf.some(
        (schema) => typeof schema === "object" && (schema == null ? void 0 : schema.type) === "null"
      )) {
        const nonNullSchemas = anyOf.filter(
          (schema) => !(typeof schema === "object" && (schema == null ? void 0 : schema.type) === "null")
        );
        if (nonNullSchemas.length === 1) {
          const converted = convertJSONSchemaToOpenAPISchema(nonNullSchemas[0]);
          if (typeof converted === "object") {
            result.nullable = true;
            Object.assign(result, converted);
          }
        } else {
          result.anyOf = nonNullSchemas.map(convertJSONSchemaToOpenAPISchema);
          result.nullable = true;
        }
      } else {
        result.anyOf = anyOf.map(convertJSONSchemaToOpenAPISchema);
      }
    }
    if (oneOf) {
      result.oneOf = oneOf.map(convertJSONSchemaToOpenAPISchema);
    }
    if (minLength !== void 0) {
      result.minLength = minLength;
    }
    return result;
  }
  function isEmptyObjectSchema(jsonSchema) {
    return jsonSchema != null && typeof jsonSchema === "object" && jsonSchema.type === "object" && (jsonSchema.properties == null || Object.keys(jsonSchema.properties).length === 0) && !jsonSchema.additionalProperties;
  }
  function convertToGoogleGenerativeAIMessages(prompt) {
    var _a, _b;
    const systemInstructionParts = [];
    const contents = [];
    let systemMessagesAllowed = true;
    for (const { role, content } of prompt) {
      switch (role) {
        case "system": {
          if (!systemMessagesAllowed) {
            throw new UnsupportedFunctionalityError({
              functionality: "system messages are only supported at the beginning of the conversation"
            });
          }
          systemInstructionParts.push({ text: content });
          break;
        }
        case "user": {
          systemMessagesAllowed = false;
          const parts = [];
          for (const part of content) {
            switch (part.type) {
              case "text": {
                parts.push({ text: part.text });
                break;
              }
              case "image": {
                parts.push(
                  part.image instanceof URL ? {
                    fileData: {
                      mimeType: (_a = part.mimeType) != null ? _a : "image/jpeg",
                      fileUri: part.image.toString()
                    }
                  } : {
                    inlineData: {
                      mimeType: (_b = part.mimeType) != null ? _b : "image/jpeg",
                      data: convertUint8ArrayToBase64(part.image)
                    }
                  }
                );
                break;
              }
              case "file": {
                parts.push(
                  part.data instanceof URL ? {
                    fileData: {
                      mimeType: part.mimeType,
                      fileUri: part.data.toString()
                    }
                  } : {
                    inlineData: {
                      mimeType: part.mimeType,
                      data: part.data
                    }
                  }
                );
                break;
              }
            }
          }
          contents.push({ role: "user", parts });
          break;
        }
        case "assistant": {
          systemMessagesAllowed = false;
          contents.push({
            role: "model",
            parts: content.map((part) => {
              switch (part.type) {
                case "text": {
                  return part.text.length === 0 ? void 0 : { text: part.text };
                }
                case "file": {
                  if (part.mimeType !== "image/png") {
                    throw new UnsupportedFunctionalityError({
                      functionality: "Only PNG images are supported in assistant messages"
                    });
                  }
                  if (part.data instanceof URL) {
                    throw new UnsupportedFunctionalityError({
                      functionality: "File data URLs in assistant messages are not supported"
                    });
                  }
                  return {
                    inlineData: {
                      mimeType: part.mimeType,
                      data: part.data
                    }
                  };
                }
                case "tool-call": {
                  return {
                    functionCall: {
                      name: part.toolName,
                      args: part.args
                    }
                  };
                }
              }
            }).filter((part) => part !== void 0)
          });
          break;
        }
        case "tool": {
          systemMessagesAllowed = false;
          contents.push({
            role: "user",
            parts: content.map((part) => ({
              functionResponse: {
                name: part.toolName,
                response: {
                  name: part.toolName,
                  content: part.result
                }
              }
            }))
          });
          break;
        }
      }
    }
    return {
      systemInstruction: systemInstructionParts.length > 0 ? { parts: systemInstructionParts } : void 0,
      contents
    };
  }

  // src/get-model-path.ts
  function getModelPath(modelId) {
    return modelId.includes("/") ? modelId : `models/${modelId}`;
  }
  var googleErrorDataSchema = objectType({
    error: objectType({
      code: numberType().nullable(),
      message: stringType(),
      status: stringType()
    })
  });
  var googleFailedResponseHandler = createJsonErrorResponseHandler({
    errorSchema: googleErrorDataSchema,
    errorToMessage: (data) => data.error.message
  });
  function prepareTools$4(mode, useSearchGrounding, dynamicRetrievalConfig, modelId) {
    var _a, _b;
    const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
    const toolWarnings = [];
    const isGemini2 = modelId.includes("gemini-2");
    const supportsDynamicRetrieval = modelId.includes("gemini-1.5-flash") && !modelId.includes("-8b");
    if (useSearchGrounding) {
      return {
        tools: isGemini2 ? { googleSearch: {} } : {
          googleSearchRetrieval: !supportsDynamicRetrieval || !dynamicRetrievalConfig ? {} : { dynamicRetrievalConfig }
        },
        toolConfig: void 0,
        toolWarnings
      };
    }
    if (tools == null) {
      return { tools: void 0, toolConfig: void 0, toolWarnings };
    }
    const functionDeclarations = [];
    for (const tool of tools) {
      if (tool.type === "provider-defined") {
        toolWarnings.push({ type: "unsupported-tool", tool });
      } else {
        functionDeclarations.push({
          name: tool.name,
          description: (_b = tool.description) != null ? _b : "",
          parameters: convertJSONSchemaToOpenAPISchema(tool.parameters)
        });
      }
    }
    const toolChoice = mode.toolChoice;
    if (toolChoice == null) {
      return {
        tools: { functionDeclarations },
        toolConfig: void 0,
        toolWarnings
      };
    }
    const type = toolChoice.type;
    switch (type) {
      case "auto":
        return {
          tools: { functionDeclarations },
          toolConfig: { functionCallingConfig: { mode: "AUTO" } },
          toolWarnings
        };
      case "none":
        return {
          tools: { functionDeclarations },
          toolConfig: { functionCallingConfig: { mode: "NONE" } },
          toolWarnings
        };
      case "required":
        return {
          tools: { functionDeclarations },
          toolConfig: { functionCallingConfig: { mode: "ANY" } },
          toolWarnings
        };
      case "tool":
        return {
          tools: { functionDeclarations },
          toolConfig: {
            functionCallingConfig: {
              mode: "ANY",
              allowedFunctionNames: [toolChoice.toolName]
            }
          },
          toolWarnings
        };
      default: {
        const _exhaustiveCheck = type;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
        });
      }
    }
  }

  // src/map-google-generative-ai-finish-reason.ts
  function mapGoogleGenerativeAIFinishReason({
    finishReason,
    hasToolCalls
  }) {
    switch (finishReason) {
      case "STOP":
        return hasToolCalls ? "tool-calls" : "stop";
      case "MAX_TOKENS":
        return "length";
      case "IMAGE_SAFETY":
      case "RECITATION":
      case "SAFETY":
      case "BLOCKLIST":
      case "PROHIBITED_CONTENT":
      case "SPII":
        return "content-filter";
      case "FINISH_REASON_UNSPECIFIED":
      case "OTHER":
        return "other";
      case "MALFORMED_FUNCTION_CALL":
        return "error";
      default:
        return "unknown";
    }
  }

  // src/google-generative-ai-language-model.ts
  var GoogleGenerativeAILanguageModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.defaultObjectGenerationMode = "json";
      this.supportsImageUrls = false;
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    get supportsStructuredOutputs() {
      var _a;
      return (_a = this.settings.structuredOutputs) != null ? _a : true;
    }
    get provider() {
      return this.config.provider;
    }
    async getArgs({
      mode,
      prompt,
      maxTokens,
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      stopSequences,
      responseFormat,
      seed,
      providerMetadata
    }) {
      var _a, _b, _c;
      const type = mode.type;
      const warnings = [];
      const googleOptions = parseProviderOptions({
        provider: "google",
        providerOptions: providerMetadata,
        schema: googleGenerativeAIProviderOptionsSchema
      });
      if (((_a = googleOptions == null ? void 0 : googleOptions.thinkingConfig) == null ? void 0 : _a.includeThoughts) === true && !this.config.provider.startsWith("google.vertex.")) {
        warnings.push({
          type: "other",
          message: `The 'includeThoughts' option is only supported with the Google Vertex provider and might not be supported or could behave unexpectedly with the current Google provider (${this.config.provider}).`
        });
      }
      const generationConfig = {
        // standardized settings:
        maxOutputTokens: maxTokens,
        temperature,
        topK,
        topP,
        frequencyPenalty,
        presencePenalty,
        stopSequences,
        seed,
        // response format:
        responseMimeType: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? "application/json" : void 0,
        responseSchema: (responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && // Google GenAI does not support all OpenAPI Schema features,
        // so this is needed as an escape hatch:
        this.supportsStructuredOutputs ? convertJSONSchemaToOpenAPISchema(responseFormat.schema) : void 0,
        ...this.settings.audioTimestamp && {
          audioTimestamp: this.settings.audioTimestamp
        },
        // provider options:
        responseModalities: googleOptions == null ? void 0 : googleOptions.responseModalities,
        thinkingConfig: googleOptions == null ? void 0 : googleOptions.thinkingConfig
      };
      const { contents, systemInstruction } = convertToGoogleGenerativeAIMessages(prompt);
      switch (type) {
        case "regular": {
          const { tools, toolConfig, toolWarnings } = prepareTools$4(
            mode,
            (_b = this.settings.useSearchGrounding) != null ? _b : false,
            this.settings.dynamicRetrievalConfig,
            this.modelId
          );
          return {
            args: {
              generationConfig,
              contents,
              systemInstruction,
              safetySettings: this.settings.safetySettings,
              tools,
              toolConfig,
              cachedContent: this.settings.cachedContent
            },
            warnings: [...warnings, ...toolWarnings]
          };
        }
        case "object-json": {
          return {
            args: {
              generationConfig: {
                ...generationConfig,
                responseMimeType: "application/json",
                responseSchema: mode.schema != null && // Google GenAI does not support all OpenAPI Schema features,
                // so this is needed as an escape hatch:
                this.supportsStructuredOutputs ? convertJSONSchemaToOpenAPISchema(mode.schema) : void 0
              },
              contents,
              systemInstruction,
              safetySettings: this.settings.safetySettings,
              cachedContent: this.settings.cachedContent
            },
            warnings
          };
        }
        case "object-tool": {
          return {
            args: {
              generationConfig,
              contents,
              systemInstruction,
              tools: {
                functionDeclarations: [
                  {
                    name: mode.tool.name,
                    description: (_c = mode.tool.description) != null ? _c : "",
                    parameters: convertJSONSchemaToOpenAPISchema(
                      mode.tool.parameters
                    )
                  }
                ]
              },
              toolConfig: { functionCallingConfig: { mode: "ANY" } },
              safetySettings: this.settings.safetySettings,
              cachedContent: this.settings.cachedContent
            },
            warnings
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    supportsUrl(url) {
      return this.config.isSupportedUrl(url);
    }
    async doGenerate(options) {
      var _a, _b, _c, _d, _e;
      const { args, warnings } = await this.getArgs(options);
      const body = JSON.stringify(args);
      const mergedHeaders = combineHeaders(
        await resolve(this.config.headers),
        options.headers
      );
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: `${this.config.baseURL}/${getModelPath(
        this.modelId
      )}:generateContent`,
        headers: mergedHeaders,
        body: args,
        failedResponseHandler: googleFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(responseSchema),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { contents: rawPrompt, ...rawSettings } = args;
      const candidate = response.candidates[0];
      const parts = candidate.content == null || typeof candidate.content !== "object" || !("parts" in candidate.content) ? [] : candidate.content.parts;
      const toolCalls = getToolCallsFromParts({
        parts,
        // Use candidateParts
        generateId: this.config.generateId
      });
      const usageMetadata = response.usageMetadata;
      return {
        text: getTextFromParts(parts),
        reasoning: getReasoningDetailsFromParts(parts),
        files: (_a = getInlineDataParts(parts)) == null ? void 0 : _a.map((part) => ({
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType
        })),
        toolCalls,
        finishReason: mapGoogleGenerativeAIFinishReason({
          finishReason: candidate.finishReason,
          hasToolCalls: toolCalls != null && toolCalls.length > 0
        }),
        usage: {
          promptTokens: (_b = usageMetadata == null ? void 0 : usageMetadata.promptTokenCount) != null ? _b : NaN,
          completionTokens: (_c = usageMetadata == null ? void 0 : usageMetadata.candidatesTokenCount) != null ? _c : NaN
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        warnings,
        providerMetadata: {
          google: {
            groundingMetadata: (_d = candidate.groundingMetadata) != null ? _d : null,
            safetyRatings: (_e = candidate.safetyRatings) != null ? _e : null
          }
        },
        sources: extractSources({
          groundingMetadata: candidate.groundingMetadata,
          generateId: this.config.generateId
        }),
        request: { body }
      };
    }
    async doStream(options) {
      const { args, warnings } = await this.getArgs(options);
      const body = JSON.stringify(args);
      const headers = combineHeaders(
        await resolve(this.config.headers),
        options.headers
      );
      const { responseHeaders, value: response } = await postJsonToApi({
        url: `${this.config.baseURL}/${getModelPath(
        this.modelId
      )}:streamGenerateContent?alt=sse`,
        headers,
        body: args,
        failedResponseHandler: googleFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(chunkSchema),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { contents: rawPrompt, ...rawSettings } = args;
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      let providerMetadata = void 0;
      const generateId2 = this.config.generateId;
      let hasToolCalls = false;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a, _b, _c, _d, _e, _f;
              if (!chunk.success) {
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              const usageMetadata = value.usageMetadata;
              if (usageMetadata != null) {
                usage = {
                  promptTokens: (_a = usageMetadata.promptTokenCount) != null ? _a : NaN,
                  completionTokens: (_b = usageMetadata.candidatesTokenCount) != null ? _b : NaN
                };
              }
              const candidate = (_c = value.candidates) == null ? void 0 : _c[0];
              if (candidate == null) {
                return;
              }
              const content = candidate.content;
              if (content != null) {
                const deltaText = getTextFromParts(content.parts);
                if (deltaText != null) {
                  controller.enqueue({
                    type: "text-delta",
                    textDelta: deltaText
                  });
                }
                const reasoningDeltaText = getReasoningDetailsFromParts(
                  content.parts
                );
                if (reasoningDeltaText != null) {
                  for (const part of reasoningDeltaText) {
                    controller.enqueue({
                      type: "reasoning",
                      textDelta: part.text
                    });
                  }
                }
                const inlineDataParts = getInlineDataParts(content.parts);
                if (inlineDataParts != null) {
                  for (const part of inlineDataParts) {
                    controller.enqueue({
                      type: "file",
                      mimeType: part.inlineData.mimeType,
                      data: part.inlineData.data
                    });
                  }
                }
                const toolCallDeltas = getToolCallsFromParts({
                  parts: content.parts,
                  generateId: generateId2
                });
                if (toolCallDeltas != null) {
                  for (const toolCall of toolCallDeltas) {
                    controller.enqueue({
                      type: "tool-call-delta",
                      toolCallType: "function",
                      toolCallId: toolCall.toolCallId,
                      toolName: toolCall.toolName,
                      argsTextDelta: toolCall.args
                    });
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: toolCall.toolCallId,
                      toolName: toolCall.toolName,
                      args: toolCall.args
                    });
                    hasToolCalls = true;
                  }
                }
              }
              if (candidate.finishReason != null) {
                finishReason = mapGoogleGenerativeAIFinishReason({
                  finishReason: candidate.finishReason,
                  hasToolCalls
                });
                const sources = (_d = extractSources({
                  groundingMetadata: candidate.groundingMetadata,
                  generateId: generateId2
                })) != null ? _d : [];
                for (const source of sources) {
                  controller.enqueue({ type: "source", source });
                }
                providerMetadata = {
                  google: {
                    groundingMetadata: (_e = candidate.groundingMetadata) != null ? _e : null,
                    safetyRatings: (_f = candidate.safetyRatings) != null ? _f : null
                  }
                };
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                usage,
                providerMetadata
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body }
      };
    }
  };
  function getToolCallsFromParts({
    parts,
    generateId: generateId2
  }) {
    const functionCallParts = parts == null ? void 0 : parts.filter(
      (part) => "functionCall" in part
    );
    return functionCallParts == null || functionCallParts.length === 0 ? void 0 : functionCallParts.map((part) => ({
      toolCallType: "function",
      toolCallId: generateId2(),
      toolName: part.functionCall.name,
      args: JSON.stringify(part.functionCall.args)
    }));
  }
  function getTextFromParts(parts) {
    const textParts = parts == null ? void 0 : parts.filter(
      (part) => "text" in part && part.thought !== true
    );
    return textParts == null || textParts.length === 0 ? void 0 : textParts.map((part) => part.text).join("");
  }
  function getReasoningDetailsFromParts(parts) {
    const reasoningParts = parts == null ? void 0 : parts.filter(
      (part) => "text" in part && part.thought === true && part.text != null
    );
    return reasoningParts == null || reasoningParts.length === 0 ? void 0 : reasoningParts.map((part) => ({ type: "text", text: part.text }));
  }
  function getInlineDataParts(parts) {
    return parts == null ? void 0 : parts.filter(
      (part) => "inlineData" in part
    );
  }
  function extractSources({
    groundingMetadata,
    generateId: generateId2
  }) {
    var _a;
    return (_a = groundingMetadata == null ? void 0 : groundingMetadata.groundingChunks) == null ? void 0 : _a.filter(
      (chunk) => chunk.web != null
    ).map((chunk) => ({
      sourceType: "url",
      id: generateId2(),
      url: chunk.web.uri,
      title: chunk.web.title
    }));
  }
  var contentSchema = objectType({
    parts: arrayType(
      unionType([
        // note: order matters since text can be fully empty
        objectType({
          functionCall: objectType({
            name: stringType(),
            args: unknownType()
          })
        }),
        objectType({
          inlineData: objectType({
            mimeType: stringType(),
            data: stringType()
          })
        }),
        objectType({
          text: stringType().nullish(),
          thought: booleanType().nullish()
        })
      ])
    ).nullish()
  });
  var groundingChunkSchema = objectType({
    web: objectType({ uri: stringType(), title: stringType() }).nullish(),
    retrievedContext: objectType({ uri: stringType(), title: stringType() }).nullish()
  });
  var groundingMetadataSchema = objectType({
    webSearchQueries: arrayType(stringType()).nullish(),
    retrievalQueries: arrayType(stringType()).nullish(),
    searchEntryPoint: objectType({ renderedContent: stringType() }).nullish(),
    groundingChunks: arrayType(groundingChunkSchema).nullish(),
    groundingSupports: arrayType(
      objectType({
        segment: objectType({
          startIndex: numberType().nullish(),
          endIndex: numberType().nullish(),
          text: stringType().nullish()
        }),
        segment_text: stringType().nullish(),
        groundingChunkIndices: arrayType(numberType()).nullish(),
        supportChunkIndices: arrayType(numberType()).nullish(),
        confidenceScores: arrayType(numberType()).nullish(),
        confidenceScore: arrayType(numberType()).nullish()
      })
    ).nullish(),
    retrievalMetadata: unionType([
      objectType({
        webDynamicRetrievalScore: numberType()
      }),
      objectType({})
    ]).nullish()
  });
  var safetyRatingSchema = objectType({
    category: stringType().nullish(),
    probability: stringType().nullish(),
    probabilityScore: numberType().nullish(),
    severity: stringType().nullish(),
    severityScore: numberType().nullish(),
    blocked: booleanType().nullish()
  });
  var responseSchema = objectType({
    candidates: arrayType(
      objectType({
        content: contentSchema.nullish().or(objectType({}).strict()),
        finishReason: stringType().nullish(),
        safetyRatings: arrayType(safetyRatingSchema).nullish(),
        groundingMetadata: groundingMetadataSchema.nullish()
      })
    ),
    usageMetadata: objectType({
      promptTokenCount: numberType().nullish(),
      candidatesTokenCount: numberType().nullish(),
      totalTokenCount: numberType().nullish()
    }).nullish()
  });
  var chunkSchema = objectType({
    candidates: arrayType(
      objectType({
        content: contentSchema.nullish(),
        finishReason: stringType().nullish(),
        safetyRatings: arrayType(safetyRatingSchema).nullish(),
        groundingMetadata: groundingMetadataSchema.nullish()
      })
    ).nullish(),
    usageMetadata: objectType({
      promptTokenCount: numberType().nullish(),
      candidatesTokenCount: numberType().nullish(),
      totalTokenCount: numberType().nullish()
    }).nullish()
  });
  var googleGenerativeAIProviderOptionsSchema = objectType({
    responseModalities: arrayType(enumType(["TEXT", "IMAGE"])).nullish(),
    thinkingConfig: objectType({
      thinkingBudget: numberType().nullish(),
      includeThoughts: booleanType().nullish()
    }).nullish()
  });
  var GoogleGenerativeAIEmbeddingModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    get provider() {
      return this.config.provider;
    }
    get maxEmbeddingsPerCall() {
      return 2048;
    }
    get supportsParallelCalls() {
      return true;
    }
    async doEmbed({
      values,
      headers,
      abortSignal
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          provider: this.provider,
          modelId: this.modelId,
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          values
        });
      }
      const mergedHeaders = combineHeaders(
        await resolve(this.config.headers),
        headers
      );
      const { responseHeaders, value: response } = await postJsonToApi({
        url: `${this.config.baseURL}/models/${this.modelId}:batchEmbedContents`,
        headers: mergedHeaders,
        body: {
          requests: values.map((value) => ({
            model: `models/${this.modelId}`,
            content: { role: "user", parts: [{ text: value }] },
            outputDimensionality: this.settings.outputDimensionality,
            taskType: this.settings.taskType
          }))
        },
        failedResponseHandler: googleFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          googleGenerativeAITextEmbeddingResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: response.embeddings.map((item) => item.values),
        usage: void 0,
        rawResponse: { headers: responseHeaders }
      };
    }
  };
  var googleGenerativeAITextEmbeddingResponseSchema = objectType({
    embeddings: arrayType(objectType({ values: arrayType(numberType()) }))
  });

  // src/google-supported-file-url.ts
  function isSupportedFileUrl(url) {
    return url.toString().startsWith("https://generativelanguage.googleapis.com/v1beta/files/");
  }

  // src/google-provider.ts
  function createGoogleGenerativeAI(options = {}) {
    var _a;
    const baseURL = (_a = withoutTrailingSlash(options.baseURL)) != null ? _a : "https://generativelanguage.googleapis.com/v1beta";
    const getHeaders = () => ({
      "x-goog-api-key": loadApiKey({
        apiKey: options.apiKey,
        environmentVariableName: "GOOGLE_GENERATIVE_AI_API_KEY",
        description: "Google Generative AI"
      }),
      ...options.headers
    });
    const createChatModel = (modelId, settings = {}) => {
      var _a2;
      return new GoogleGenerativeAILanguageModel(modelId, settings, {
        provider: "google.generative-ai",
        baseURL,
        headers: getHeaders,
        generateId: (_a2 = options.generateId) != null ? _a2 : generateId,
        isSupportedUrl: isSupportedFileUrl,
        fetch: options.fetch
      });
    };
    const createEmbeddingModel = (modelId, settings = {}) => new GoogleGenerativeAIEmbeddingModel(modelId, settings, {
      provider: "google.generative-ai",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch
    });
    const provider = function(modelId, settings) {
      if (new.target) {
        throw new Error(
          "The Google Generative AI model function cannot be called with the new keyword."
        );
      }
      return createChatModel(modelId, settings);
    };
    provider.languageModel = createChatModel;
    provider.chat = createChatModel;
    provider.generativeAI = createChatModel;
    provider.embedding = createEmbeddingModel;
    provider.textEmbedding = createEmbeddingModel;
    provider.textEmbeddingModel = createEmbeddingModel;
    return provider;
  }
  createGoogleGenerativeAI();

  // src/openai-provider.ts
  function convertToOpenAIChatMessages({
    prompt,
    useLegacyFunctionCalling = false,
    systemMessageMode = "system"
  }) {
    const messages = [];
    const warnings = [];
    for (const { role, content } of prompt) {
      switch (role) {
        case "system": {
          switch (systemMessageMode) {
            case "system": {
              messages.push({ role: "system", content });
              break;
            }
            case "developer": {
              messages.push({ role: "developer", content });
              break;
            }
            case "remove": {
              warnings.push({
                type: "other",
                message: "system messages are removed for this model"
              });
              break;
            }
            default: {
              const _exhaustiveCheck = systemMessageMode;
              throw new Error(
                `Unsupported system message mode: ${_exhaustiveCheck}`
              );
            }
          }
          break;
        }
        case "user": {
          if (content.length === 1 && content[0].type === "text") {
            messages.push({ role: "user", content: content[0].text });
            break;
          }
          messages.push({
            role: "user",
            content: content.map((part, index) => {
              var _a, _b, _c, _d;
              switch (part.type) {
                case "text": {
                  return { type: "text", text: part.text };
                }
                case "image": {
                  return {
                    type: "image_url",
                    image_url: {
                      url: part.image instanceof URL ? part.image.toString() : `data:${(_a = part.mimeType) != null ? _a : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`,
                      // OpenAI specific extension: image detail
                      detail: (_c = (_b = part.providerMetadata) == null ? void 0 : _b.openai) == null ? void 0 : _c.imageDetail
                    }
                  };
                }
                case "file": {
                  if (part.data instanceof URL) {
                    throw new UnsupportedFunctionalityError({
                      functionality: "'File content parts with URL data' functionality not supported."
                    });
                  }
                  switch (part.mimeType) {
                    case "audio/wav": {
                      return {
                        type: "input_audio",
                        input_audio: { data: part.data, format: "wav" }
                      };
                    }
                    case "audio/mp3":
                    case "audio/mpeg": {
                      return {
                        type: "input_audio",
                        input_audio: { data: part.data, format: "mp3" }
                      };
                    }
                    case "application/pdf": {
                      return {
                        type: "file",
                        file: {
                          filename: (_d = part.filename) != null ? _d : `part-${index}.pdf`,
                          file_data: `data:application/pdf;base64,${part.data}`
                        }
                      };
                    }
                    default: {
                      throw new UnsupportedFunctionalityError({
                        functionality: `File content part type ${part.mimeType} in user messages`
                      });
                    }
                  }
                }
              }
            })
          });
          break;
        }
        case "assistant": {
          let text = "";
          const toolCalls = [];
          for (const part of content) {
            switch (part.type) {
              case "text": {
                text += part.text;
                break;
              }
              case "tool-call": {
                toolCalls.push({
                  id: part.toolCallId,
                  type: "function",
                  function: {
                    name: part.toolName,
                    arguments: JSON.stringify(part.args)
                  }
                });
                break;
              }
            }
          }
          if (useLegacyFunctionCalling) {
            if (toolCalls.length > 1) {
              throw new UnsupportedFunctionalityError({
                functionality: "useLegacyFunctionCalling with multiple tool calls in one message"
              });
            }
            messages.push({
              role: "assistant",
              content: text,
              function_call: toolCalls.length > 0 ? toolCalls[0].function : void 0
            });
          } else {
            messages.push({
              role: "assistant",
              content: text,
              tool_calls: toolCalls.length > 0 ? toolCalls : void 0
            });
          }
          break;
        }
        case "tool": {
          for (const toolResponse of content) {
            if (useLegacyFunctionCalling) {
              messages.push({
                role: "function",
                name: toolResponse.toolName,
                content: JSON.stringify(toolResponse.result)
              });
            } else {
              messages.push({
                role: "tool",
                tool_call_id: toolResponse.toolCallId,
                content: JSON.stringify(toolResponse.result)
              });
            }
          }
          break;
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    return { messages, warnings };
  }

  // src/map-openai-chat-logprobs.ts
  function mapOpenAIChatLogProbsOutput(logprobs) {
    var _a, _b;
    return (_b = (_a = logprobs == null ? void 0 : logprobs.content) == null ? void 0 : _a.map(({ token, logprob, top_logprobs }) => ({
      token,
      logprob,
      topLogprobs: top_logprobs ? top_logprobs.map(({ token: token2, logprob: logprob2 }) => ({
        token: token2,
        logprob: logprob2
      })) : []
    }))) != null ? _b : void 0;
  }

  // src/map-openai-finish-reason.ts
  function mapOpenAIFinishReason(finishReason) {
    switch (finishReason) {
      case "stop":
        return "stop";
      case "length":
        return "length";
      case "content_filter":
        return "content-filter";
      case "function_call":
      case "tool_calls":
        return "tool-calls";
      default:
        return "unknown";
    }
  }
  var openaiErrorDataSchema = objectType({
    error: objectType({
      message: stringType(),
      // The additional information below is handled loosely to support
      // OpenAI-compatible providers that have slightly different error
      // responses:
      type: stringType().nullish(),
      param: anyType().nullish(),
      code: unionType([stringType(), numberType()]).nullish()
    })
  });
  var openaiFailedResponseHandler = createJsonErrorResponseHandler({
    errorSchema: openaiErrorDataSchema,
    errorToMessage: (data) => data.error.message
  });

  // src/get-response-metadata.ts
  function getResponseMetadata$2({
    id,
    model,
    created
  }) {
    return {
      id: id != null ? id : void 0,
      modelId: model != null ? model : void 0,
      timestamp: created != null ? new Date(created * 1e3) : void 0
    };
  }
  function prepareTools$3({
    mode,
    useLegacyFunctionCalling = false,
    structuredOutputs
  }) {
    var _a;
    const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
    const toolWarnings = [];
    if (tools == null) {
      return { tools: void 0, tool_choice: void 0, toolWarnings };
    }
    const toolChoice = mode.toolChoice;
    if (useLegacyFunctionCalling) {
      const openaiFunctions = [];
      for (const tool of tools) {
        if (tool.type === "provider-defined") {
          toolWarnings.push({ type: "unsupported-tool", tool });
        } else {
          openaiFunctions.push({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
          });
        }
      }
      if (toolChoice == null) {
        return {
          functions: openaiFunctions,
          function_call: void 0,
          toolWarnings
        };
      }
      const type2 = toolChoice.type;
      switch (type2) {
        case "auto":
        case "none":
        case void 0:
          return {
            functions: openaiFunctions,
            function_call: void 0,
            toolWarnings
          };
        case "required":
          throw new UnsupportedFunctionalityError({
            functionality: "useLegacyFunctionCalling and toolChoice: required"
          });
        default:
          return {
            functions: openaiFunctions,
            function_call: { name: toolChoice.toolName },
            toolWarnings
          };
      }
    }
    const openaiTools2 = [];
    for (const tool of tools) {
      if (tool.type === "provider-defined") {
        toolWarnings.push({ type: "unsupported-tool", tool });
      } else {
        openaiTools2.push({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
            strict: structuredOutputs ? true : void 0
          }
        });
      }
    }
    if (toolChoice == null) {
      return { tools: openaiTools2, tool_choice: void 0, toolWarnings };
    }
    const type = toolChoice.type;
    switch (type) {
      case "auto":
      case "none":
      case "required":
        return { tools: openaiTools2, tool_choice: type, toolWarnings };
      case "tool":
        return {
          tools: openaiTools2,
          tool_choice: {
            type: "function",
            function: {
              name: toolChoice.toolName
            }
          },
          toolWarnings
        };
      default: {
        const _exhaustiveCheck = type;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
        });
      }
    }
  }

  // src/openai-chat-language-model.ts
  var OpenAIChatLanguageModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    get supportsStructuredOutputs() {
      var _a;
      return (_a = this.settings.structuredOutputs) != null ? _a : isReasoningModel(this.modelId);
    }
    get defaultObjectGenerationMode() {
      if (isAudioModel(this.modelId)) {
        return "tool";
      }
      return this.supportsStructuredOutputs ? "json" : "tool";
    }
    get provider() {
      return this.config.provider;
    }
    get supportsImageUrls() {
      return !this.settings.downloadImages;
    }
    getArgs({
      mode,
      prompt,
      maxTokens,
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      stopSequences,
      responseFormat,
      seed,
      providerMetadata
    }) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const type = mode.type;
      const warnings = [];
      if (topK != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "topK"
        });
      }
      if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
        warnings.push({
          type: "unsupported-setting",
          setting: "responseFormat",
          details: "JSON response format schema is only supported with structuredOutputs"
        });
      }
      const useLegacyFunctionCalling = this.settings.useLegacyFunctionCalling;
      if (useLegacyFunctionCalling && this.settings.parallelToolCalls === true) {
        throw new UnsupportedFunctionalityError({
          functionality: "useLegacyFunctionCalling with parallelToolCalls"
        });
      }
      if (useLegacyFunctionCalling && this.supportsStructuredOutputs) {
        throw new UnsupportedFunctionalityError({
          functionality: "structuredOutputs with useLegacyFunctionCalling"
        });
      }
      const { messages, warnings: messageWarnings } = convertToOpenAIChatMessages(
        {
          prompt,
          useLegacyFunctionCalling,
          systemMessageMode: getSystemMessageMode(this.modelId)
        }
      );
      warnings.push(...messageWarnings);
      const baseArgs = {
        // model id:
        model: this.modelId,
        // model specific settings:
        logit_bias: this.settings.logitBias,
        logprobs: this.settings.logprobs === true || typeof this.settings.logprobs === "number" ? true : void 0,
        top_logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
        user: this.settings.user,
        parallel_tool_calls: this.settings.parallelToolCalls,
        // standardized settings:
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs && responseFormat.schema != null ? {
          type: "json_schema",
          json_schema: {
            schema: responseFormat.schema,
            strict: true,
            name: (_a = responseFormat.name) != null ? _a : "response",
            description: responseFormat.description
          }
        } : { type: "json_object" } : void 0,
        stop: stopSequences,
        seed,
        // openai specific settings:
        // TODO remove in next major version; we auto-map maxTokens now
        max_completion_tokens: (_b = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _b.maxCompletionTokens,
        store: (_c = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _c.store,
        metadata: (_d = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _d.metadata,
        prediction: (_e = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _e.prediction,
        reasoning_effort: (_g = (_f = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _f.reasoningEffort) != null ? _g : this.settings.reasoningEffort,
        // messages:
        messages
      };
      if (isReasoningModel(this.modelId)) {
        if (baseArgs.temperature != null) {
          baseArgs.temperature = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "temperature",
            details: "temperature is not supported for reasoning models"
          });
        }
        if (baseArgs.top_p != null) {
          baseArgs.top_p = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "topP",
            details: "topP is not supported for reasoning models"
          });
        }
        if (baseArgs.frequency_penalty != null) {
          baseArgs.frequency_penalty = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "frequencyPenalty",
            details: "frequencyPenalty is not supported for reasoning models"
          });
        }
        if (baseArgs.presence_penalty != null) {
          baseArgs.presence_penalty = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "presencePenalty",
            details: "presencePenalty is not supported for reasoning models"
          });
        }
        if (baseArgs.logit_bias != null) {
          baseArgs.logit_bias = void 0;
          warnings.push({
            type: "other",
            message: "logitBias is not supported for reasoning models"
          });
        }
        if (baseArgs.logprobs != null) {
          baseArgs.logprobs = void 0;
          warnings.push({
            type: "other",
            message: "logprobs is not supported for reasoning models"
          });
        }
        if (baseArgs.top_logprobs != null) {
          baseArgs.top_logprobs = void 0;
          warnings.push({
            type: "other",
            message: "topLogprobs is not supported for reasoning models"
          });
        }
        if (baseArgs.max_tokens != null) {
          if (baseArgs.max_completion_tokens == null) {
            baseArgs.max_completion_tokens = baseArgs.max_tokens;
          }
          baseArgs.max_tokens = void 0;
        }
      } else if (this.modelId.startsWith("gpt-4o-search-preview") || this.modelId.startsWith("gpt-4o-mini-search-preview")) {
        if (baseArgs.temperature != null) {
          baseArgs.temperature = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "temperature",
            details: "temperature is not supported for the search preview models and has been removed."
          });
        }
      }
      switch (type) {
        case "regular": {
          const { tools, tool_choice, functions, function_call, toolWarnings } = prepareTools$3({
            mode,
            useLegacyFunctionCalling,
            structuredOutputs: this.supportsStructuredOutputs
          });
          return {
            args: {
              ...baseArgs,
              tools,
              tool_choice,
              functions,
              function_call
            },
            warnings: [...warnings, ...toolWarnings]
          };
        }
        case "object-json": {
          return {
            args: {
              ...baseArgs,
              response_format: this.supportsStructuredOutputs && mode.schema != null ? {
                type: "json_schema",
                json_schema: {
                  schema: mode.schema,
                  strict: true,
                  name: (_h = mode.name) != null ? _h : "response",
                  description: mode.description
                }
              } : { type: "json_object" }
            },
            warnings
          };
        }
        case "object-tool": {
          return {
            args: useLegacyFunctionCalling ? {
              ...baseArgs,
              function_call: {
                name: mode.tool.name
              },
              functions: [
                {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters
                }
              ]
            } : {
              ...baseArgs,
              tool_choice: {
                type: "function",
                function: { name: mode.tool.name }
              },
              tools: [
                {
                  type: "function",
                  function: {
                    name: mode.tool.name,
                    description: mode.tool.description,
                    parameters: mode.tool.parameters,
                    strict: this.supportsStructuredOutputs ? true : void 0
                  }
                }
              ]
            },
            warnings
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    async doGenerate(options) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const { args: body, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiChatResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = body;
      const choice = response.choices[0];
      const completionTokenDetails = (_a = response.usage) == null ? void 0 : _a.completion_tokens_details;
      const promptTokenDetails = (_b = response.usage) == null ? void 0 : _b.prompt_tokens_details;
      const providerMetadata = { openai: {} };
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens) != null) {
        providerMetadata.openai.reasoningTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
        providerMetadata.openai.acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
        providerMetadata.openai.rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
      }
      if ((promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens) != null) {
        providerMetadata.openai.cachedPromptTokens = promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens;
      }
      return {
        text: (_c = choice.message.content) != null ? _c : void 0,
        toolCalls: this.settings.useLegacyFunctionCalling && choice.message.function_call ? [
          {
            toolCallType: "function",
            toolCallId: generateId(),
            toolName: choice.message.function_call.name,
            args: choice.message.function_call.arguments
          }
        ] : (_d = choice.message.tool_calls) == null ? void 0 : _d.map((toolCall) => {
          var _a2;
          return {
            toolCallType: "function",
            toolCallId: (_a2 = toolCall.id) != null ? _a2 : generateId(),
            toolName: toolCall.function.name,
            args: toolCall.function.arguments
          };
        }),
        finishReason: mapOpenAIFinishReason(choice.finish_reason),
        usage: {
          promptTokens: (_f = (_e = response.usage) == null ? void 0 : _e.prompt_tokens) != null ? _f : NaN,
          completionTokens: (_h = (_g = response.usage) == null ? void 0 : _g.completion_tokens) != null ? _h : NaN
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        request: { body: JSON.stringify(body) },
        response: getResponseMetadata$2(response),
        warnings,
        logprobs: mapOpenAIChatLogProbsOutput(choice.logprobs),
        providerMetadata
      };
    }
    async doStream(options) {
      if (this.settings.simulateStreaming) {
        const result = await this.doGenerate(options);
        const simulatedStream = new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "response-metadata", ...result.response });
            if (result.text) {
              controller.enqueue({
                type: "text-delta",
                textDelta: result.text
              });
            }
            if (result.toolCalls) {
              for (const toolCall of result.toolCalls) {
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  argsTextDelta: toolCall.args
                });
                controller.enqueue({
                  type: "tool-call",
                  ...toolCall
                });
              }
            }
            controller.enqueue({
              type: "finish",
              finishReason: result.finishReason,
              usage: result.usage,
              logprobs: result.logprobs,
              providerMetadata: result.providerMetadata
            });
            controller.close();
          }
        });
        return {
          stream: simulatedStream,
          rawCall: result.rawCall,
          rawResponse: result.rawResponse,
          warnings: result.warnings
        };
      }
      const { args, warnings } = this.getArgs(options);
      const body = {
        ...args,
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
      };
      const { responseHeaders, value: response } = await postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiChatChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      const toolCalls = [];
      let finishReason = "unknown";
      let usage = {
        promptTokens: void 0,
        completionTokens: void 0
      };
      let logprobs;
      let isFirstChunk = true;
      const { useLegacyFunctionCalling } = this.settings;
      const providerMetadata = { openai: {} };
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue({
                  type: "response-metadata",
                  ...getResponseMetadata$2(value)
                });
              }
              if (value.usage != null) {
                const {
                  prompt_tokens,
                  completion_tokens,
                  prompt_tokens_details,
                  completion_tokens_details
                } = value.usage;
                usage = {
                  promptTokens: prompt_tokens != null ? prompt_tokens : void 0,
                  completionTokens: completion_tokens != null ? completion_tokens : void 0
                };
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens) != null) {
                  providerMetadata.openai.reasoningTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens) != null) {
                  providerMetadata.openai.acceptedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens) != null) {
                  providerMetadata.openai.rejectedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens;
                }
                if ((prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens) != null) {
                  providerMetadata.openai.cachedPromptTokens = prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens;
                }
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAIFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              if (delta.content != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: delta.content
                });
              }
              const mappedLogprobs = mapOpenAIChatLogProbsOutput(
                choice == null ? void 0 : choice.logprobs
              );
              if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
                if (logprobs === void 0) logprobs = [];
                logprobs.push(...mappedLogprobs);
              }
              const mappedToolCalls = useLegacyFunctionCalling && delta.function_call != null ? [
                {
                  type: "function",
                  id: generateId(),
                  function: delta.function_call,
                  index: 0
                }
              ] : delta.tool_calls;
              if (mappedToolCalls != null) {
                for (const toolCallDelta of mappedToolCalls) {
                  const index = toolCallDelta.index;
                  if (toolCalls[index] == null) {
                    if (toolCallDelta.type !== "function") {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function' type.`
                      });
                    }
                    if (toolCallDelta.id == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'id' to be a string.`
                      });
                    }
                    if (((_a = toolCallDelta.function) == null ? void 0 : _a.name) == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function.name' to be a string.`
                      });
                    }
                    toolCalls[index] = {
                      id: toolCallDelta.id,
                      type: "function",
                      function: {
                        name: toolCallDelta.function.name,
                        arguments: (_b = toolCallDelta.function.arguments) != null ? _b : ""
                      },
                      hasFinished: false
                    };
                    const toolCall2 = toolCalls[index];
                    if (((_c = toolCall2.function) == null ? void 0 : _c.name) != null && ((_d = toolCall2.function) == null ? void 0 : _d.arguments) != null) {
                      if (toolCall2.function.arguments.length > 0) {
                        controller.enqueue({
                          type: "tool-call-delta",
                          toolCallType: "function",
                          toolCallId: toolCall2.id,
                          toolName: toolCall2.function.name,
                          argsTextDelta: toolCall2.function.arguments
                        });
                      }
                      if (isParsableJson(toolCall2.function.arguments)) {
                        controller.enqueue({
                          type: "tool-call",
                          toolCallType: "function",
                          toolCallId: (_e = toolCall2.id) != null ? _e : generateId(),
                          toolName: toolCall2.function.name,
                          args: toolCall2.function.arguments
                        });
                        toolCall2.hasFinished = true;
                      }
                    }
                    continue;
                  }
                  const toolCall = toolCalls[index];
                  if (toolCall.hasFinished) {
                    continue;
                  }
                  if (((_f = toolCallDelta.function) == null ? void 0 : _f.arguments) != null) {
                    toolCall.function.arguments += (_h = (_g = toolCallDelta.function) == null ? void 0 : _g.arguments) != null ? _h : "";
                  }
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    argsTextDelta: (_i = toolCallDelta.function.arguments) != null ? _i : ""
                  });
                  if (((_j = toolCall.function) == null ? void 0 : _j.name) != null && ((_k = toolCall.function) == null ? void 0 : _k.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: (_l = toolCall.id) != null ? _l : generateId(),
                      toolName: toolCall.function.name,
                      args: toolCall.function.arguments
                    });
                    toolCall.hasFinished = true;
                  }
                }
              }
            },
            flush(controller) {
              var _a, _b;
              controller.enqueue({
                type: "finish",
                finishReason,
                logprobs,
                usage: {
                  promptTokens: (_a = usage.promptTokens) != null ? _a : NaN,
                  completionTokens: (_b = usage.completionTokens) != null ? _b : NaN
                },
                ...providerMetadata != null ? { providerMetadata } : {}
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    }
  };
  var openaiTokenUsageSchema = objectType({
    prompt_tokens: numberType().nullish(),
    completion_tokens: numberType().nullish(),
    prompt_tokens_details: objectType({
      cached_tokens: numberType().nullish()
    }).nullish(),
    completion_tokens_details: objectType({
      reasoning_tokens: numberType().nullish(),
      accepted_prediction_tokens: numberType().nullish(),
      rejected_prediction_tokens: numberType().nullish()
    }).nullish()
  }).nullish();
  var openaiChatResponseSchema = objectType({
    id: stringType().nullish(),
    created: numberType().nullish(),
    model: stringType().nullish(),
    choices: arrayType(
      objectType({
        message: objectType({
          role: literalType("assistant").nullish(),
          content: stringType().nullish(),
          function_call: objectType({
            arguments: stringType(),
            name: stringType()
          }).nullish(),
          tool_calls: arrayType(
            objectType({
              id: stringType().nullish(),
              type: literalType("function"),
              function: objectType({
                name: stringType(),
                arguments: stringType()
              })
            })
          ).nullish()
        }),
        index: numberType(),
        logprobs: objectType({
          content: arrayType(
            objectType({
              token: stringType(),
              logprob: numberType(),
              top_logprobs: arrayType(
                objectType({
                  token: stringType(),
                  logprob: numberType()
                })
              )
            })
          ).nullable()
        }).nullish(),
        finish_reason: stringType().nullish()
      })
    ),
    usage: openaiTokenUsageSchema
  });
  var openaiChatChunkSchema = unionType([
    objectType({
      id: stringType().nullish(),
      created: numberType().nullish(),
      model: stringType().nullish(),
      choices: arrayType(
        objectType({
          delta: objectType({
            role: enumType(["assistant"]).nullish(),
            content: stringType().nullish(),
            function_call: objectType({
              name: stringType().optional(),
              arguments: stringType().optional()
            }).nullish(),
            tool_calls: arrayType(
              objectType({
                index: numberType(),
                id: stringType().nullish(),
                type: literalType("function").nullish(),
                function: objectType({
                  name: stringType().nullish(),
                  arguments: stringType().nullish()
                })
              })
            ).nullish()
          }).nullish(),
          logprobs: objectType({
            content: arrayType(
              objectType({
                token: stringType(),
                logprob: numberType(),
                top_logprobs: arrayType(
                  objectType({
                    token: stringType(),
                    logprob: numberType()
                  })
                )
              })
            ).nullable()
          }).nullish(),
          finish_reason: stringType().nullish(),
          index: numberType()
        })
      ),
      usage: openaiTokenUsageSchema
    }),
    openaiErrorDataSchema
  ]);
  function isReasoningModel(modelId) {
    return modelId.startsWith("o");
  }
  function isAudioModel(modelId) {
    return modelId.startsWith("gpt-4o-audio-preview");
  }
  function getSystemMessageMode(modelId) {
    var _a, _b;
    if (!isReasoningModel(modelId)) {
      return "system";
    }
    return (_b = (_a = reasoningModels[modelId]) == null ? void 0 : _a.systemMessageMode) != null ? _b : "developer";
  }
  var reasoningModels = {
    "o1-mini": {
      systemMessageMode: "remove"
    },
    "o1-mini-2024-09-12": {
      systemMessageMode: "remove"
    },
    "o1-preview": {
      systemMessageMode: "remove"
    },
    "o1-preview-2024-09-12": {
      systemMessageMode: "remove"
    },
    o3: {
      systemMessageMode: "developer"
    },
    "o3-2025-04-16": {
      systemMessageMode: "developer"
    },
    "o3-mini": {
      systemMessageMode: "developer"
    },
    "o3-mini-2025-01-31": {
      systemMessageMode: "developer"
    },
    "o4-mini": {
      systemMessageMode: "developer"
    },
    "o4-mini-2025-04-16": {
      systemMessageMode: "developer"
    }
  };
  function convertToOpenAICompletionPrompt({
    prompt,
    inputFormat,
    user = "user",
    assistant = "assistant"
  }) {
    if (inputFormat === "prompt" && prompt.length === 1 && prompt[0].role === "user" && prompt[0].content.length === 1 && prompt[0].content[0].type === "text") {
      return { prompt: prompt[0].content[0].text };
    }
    let text = "";
    if (prompt[0].role === "system") {
      text += `${prompt[0].content}

`;
      prompt = prompt.slice(1);
    }
    for (const { role, content } of prompt) {
      switch (role) {
        case "system": {
          throw new InvalidPromptError({
            message: "Unexpected system message in prompt: ${content}",
            prompt
          });
        }
        case "user": {
          const userMessage = content.map((part) => {
            switch (part.type) {
              case "text": {
                return part.text;
              }
              case "image": {
                throw new UnsupportedFunctionalityError({
                  functionality: "images"
                });
              }
            }
          }).join("");
          text += `${user}:
${userMessage}

`;
          break;
        }
        case "assistant": {
          const assistantMessage = content.map((part) => {
            switch (part.type) {
              case "text": {
                return part.text;
              }
              case "tool-call": {
                throw new UnsupportedFunctionalityError({
                  functionality: "tool-call messages"
                });
              }
            }
          }).join("");
          text += `${assistant}:
${assistantMessage}

`;
          break;
        }
        case "tool": {
          throw new UnsupportedFunctionalityError({
            functionality: "tool messages"
          });
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    text += `${assistant}:
`;
    return {
      prompt: text,
      stopSequences: [`
${user}:`]
    };
  }

  // src/map-openai-completion-logprobs.ts
  function mapOpenAICompletionLogProbs(logprobs) {
    return logprobs == null ? void 0 : logprobs.tokens.map((token, index) => ({
      token,
      logprob: logprobs.token_logprobs[index],
      topLogprobs: logprobs.top_logprobs ? Object.entries(logprobs.top_logprobs[index]).map(
        ([token2, logprob]) => ({
          token: token2,
          logprob
        })
      ) : []
    }));
  }

  // src/openai-completion-language-model.ts
  var OpenAICompletionLanguageModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.defaultObjectGenerationMode = void 0;
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    get provider() {
      return this.config.provider;
    }
    getArgs({
      mode,
      inputFormat,
      prompt,
      maxTokens,
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      stopSequences: userStopSequences,
      responseFormat,
      seed
    }) {
      var _a;
      const type = mode.type;
      const warnings = [];
      if (topK != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "topK"
        });
      }
      if (responseFormat != null && responseFormat.type !== "text") {
        warnings.push({
          type: "unsupported-setting",
          setting: "responseFormat",
          details: "JSON response format is not supported."
        });
      }
      const { prompt: completionPrompt, stopSequences } = convertToOpenAICompletionPrompt({ prompt, inputFormat });
      const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
      const baseArgs = {
        // model id:
        model: this.modelId,
        // model specific settings:
        echo: this.settings.echo,
        logit_bias: this.settings.logitBias,
        logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
        suffix: this.settings.suffix,
        user: this.settings.user,
        // standardized settings:
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        seed,
        // prompt:
        prompt: completionPrompt,
        // stop sequences:
        stop: stop.length > 0 ? stop : void 0
      };
      switch (type) {
        case "regular": {
          if ((_a = mode.tools) == null ? void 0 : _a.length) {
            throw new UnsupportedFunctionalityError({
              functionality: "tools"
            });
          }
          if (mode.toolChoice) {
            throw new UnsupportedFunctionalityError({
              functionality: "toolChoice"
            });
          }
          return { args: baseArgs, warnings };
        }
        case "object-json": {
          throw new UnsupportedFunctionalityError({
            functionality: "object-json mode"
          });
        }
        case "object-tool": {
          throw new UnsupportedFunctionalityError({
            functionality: "object-tool mode"
          });
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    async doGenerate(options) {
      const { args, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: this.config.url({
          path: "/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiCompletionResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { prompt: rawPrompt, ...rawSettings } = args;
      const choice = response.choices[0];
      return {
        text: choice.text,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens
        },
        finishReason: mapOpenAIFinishReason(choice.finish_reason),
        logprobs: mapOpenAICompletionLogProbs(choice.logprobs),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        response: getResponseMetadata$2(response),
        warnings,
        request: { body: JSON.stringify(args) }
      };
    }
    async doStream(options) {
      const { args, warnings } = this.getArgs(options);
      const body = {
        ...args,
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
      };
      const { responseHeaders, value: response } = await postJsonToApi({
        url: this.config.url({
          path: "/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiCompletionChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { prompt: rawPrompt, ...rawSettings } = args;
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      let logprobs;
      let isFirstChunk = true;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue({
                  type: "response-metadata",
                  ...getResponseMetadata$2(value)
                });
              }
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens
                };
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAIFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.text) != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: choice.text
                });
              }
              const mappedLogprobs = mapOpenAICompletionLogProbs(
                choice == null ? void 0 : choice.logprobs
              );
              if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
                if (logprobs === void 0) logprobs = [];
                logprobs.push(...mappedLogprobs);
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                logprobs,
                usage
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body: JSON.stringify(body) }
      };
    }
  };
  var openaiCompletionResponseSchema = objectType({
    id: stringType().nullish(),
    created: numberType().nullish(),
    model: stringType().nullish(),
    choices: arrayType(
      objectType({
        text: stringType(),
        finish_reason: stringType(),
        logprobs: objectType({
          tokens: arrayType(stringType()),
          token_logprobs: arrayType(numberType()),
          top_logprobs: arrayType(recordType(stringType(), numberType())).nullable()
        }).nullish()
      })
    ),
    usage: objectType({
      prompt_tokens: numberType(),
      completion_tokens: numberType()
    })
  });
  var openaiCompletionChunkSchema = unionType([
    objectType({
      id: stringType().nullish(),
      created: numberType().nullish(),
      model: stringType().nullish(),
      choices: arrayType(
        objectType({
          text: stringType(),
          finish_reason: stringType().nullish(),
          index: numberType(),
          logprobs: objectType({
            tokens: arrayType(stringType()),
            token_logprobs: arrayType(numberType()),
            top_logprobs: arrayType(recordType(stringType(), numberType())).nullable()
          }).nullish()
        })
      ),
      usage: objectType({
        prompt_tokens: numberType(),
        completion_tokens: numberType()
      }).nullish()
    }),
    openaiErrorDataSchema
  ]);
  var OpenAIEmbeddingModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    get provider() {
      return this.config.provider;
    }
    get maxEmbeddingsPerCall() {
      var _a;
      return (_a = this.settings.maxEmbeddingsPerCall) != null ? _a : 2048;
    }
    get supportsParallelCalls() {
      var _a;
      return (_a = this.settings.supportsParallelCalls) != null ? _a : true;
    }
    async doEmbed({
      values,
      headers,
      abortSignal
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          provider: this.provider,
          modelId: this.modelId,
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          values
        });
      }
      const { responseHeaders, value: response } = await postJsonToApi({
        url: this.config.url({
          path: "/embeddings",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: {
          model: this.modelId,
          input: values,
          encoding_format: "float",
          dimensions: this.settings.dimensions,
          user: this.settings.user
        },
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiTextEmbeddingResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        embeddings: response.data.map((item) => item.embedding),
        usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
        rawResponse: { headers: responseHeaders }
      };
    }
  };
  var openaiTextEmbeddingResponseSchema = objectType({
    data: arrayType(objectType({ embedding: arrayType(numberType()) })),
    usage: objectType({ prompt_tokens: numberType() }).nullish()
  });

  // src/openai-image-settings.ts
  var modelMaxImagesPerCall = {
    "dall-e-3": 1,
    "dall-e-2": 10,
    "gpt-image-1": 10
  };
  var hasDefaultResponseFormat = /* @__PURE__ */ new Set(["gpt-image-1"]);

  // src/openai-image-model.ts
  var OpenAIImageModel = class {
    constructor(modelId, settings, config) {
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
      this.specificationVersion = "v1";
    }
    get maxImagesPerCall() {
      var _a, _b;
      return (_b = (_a = this.settings.maxImagesPerCall) != null ? _a : modelMaxImagesPerCall[this.modelId]) != null ? _b : 1;
    }
    get provider() {
      return this.config.provider;
    }
    async doGenerate({
      prompt,
      n,
      size,
      aspectRatio,
      seed,
      providerOptions,
      headers,
      abortSignal
    }) {
      var _a, _b, _c, _d;
      const warnings = [];
      if (aspectRatio != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "aspectRatio",
          details: "This model does not support aspect ratio. Use `size` instead."
        });
      }
      if (seed != null) {
        warnings.push({ type: "unsupported-setting", setting: "seed" });
      }
      const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
      const { value: response, responseHeaders } = await postJsonToApi({
        url: this.config.url({
          path: "/images/generations",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: {
          model: this.modelId,
          prompt,
          n,
          size,
          ...(_d = providerOptions.openai) != null ? _d : {},
          ...!hasDefaultResponseFormat.has(this.modelId) ? { response_format: "b64_json" } : {}
        },
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiImageResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        images: response.data.map((item) => item.b64_json),
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders
        }
      };
    }
  };
  var openaiImageResponseSchema = objectType({
    data: arrayType(objectType({ b64_json: stringType() }))
  });
  var openAIProviderOptionsSchema = objectType({
    include: arrayType(stringType()).nullish(),
    language: stringType().nullish(),
    prompt: stringType().nullish(),
    temperature: numberType().min(0).max(1).nullish().default(0),
    timestampGranularities: arrayType(enumType(["word", "segment"])).nullish().default(["segment"])
  });
  var languageMap = {
    afrikaans: "af",
    arabic: "ar",
    armenian: "hy",
    azerbaijani: "az",
    belarusian: "be",
    bosnian: "bs",
    bulgarian: "bg",
    catalan: "ca",
    chinese: "zh",
    croatian: "hr",
    czech: "cs",
    danish: "da",
    dutch: "nl",
    english: "en",
    estonian: "et",
    finnish: "fi",
    french: "fr",
    galician: "gl",
    german: "de",
    greek: "el",
    hebrew: "he",
    hindi: "hi",
    hungarian: "hu",
    icelandic: "is",
    indonesian: "id",
    italian: "it",
    japanese: "ja",
    kannada: "kn",
    kazakh: "kk",
    korean: "ko",
    latvian: "lv",
    lithuanian: "lt",
    macedonian: "mk",
    malay: "ms",
    marathi: "mr",
    maori: "mi",
    nepali: "ne",
    norwegian: "no",
    persian: "fa",
    polish: "pl",
    portuguese: "pt",
    romanian: "ro",
    russian: "ru",
    serbian: "sr",
    slovak: "sk",
    slovenian: "sl",
    spanish: "es",
    swahili: "sw",
    swedish: "sv",
    tagalog: "tl",
    tamil: "ta",
    thai: "th",
    turkish: "tr",
    ukrainian: "uk",
    urdu: "ur",
    vietnamese: "vi",
    welsh: "cy"
  };
  var OpenAITranscriptionModel = class {
    constructor(modelId, config) {
      this.modelId = modelId;
      this.config = config;
      this.specificationVersion = "v1";
    }
    get provider() {
      return this.config.provider;
    }
    getArgs({
      audio,
      mediaType,
      providerOptions
    }) {
      var _a, _b, _c, _d, _e;
      const warnings = [];
      const openAIOptions = parseProviderOptions({
        provider: "openai",
        providerOptions,
        schema: openAIProviderOptionsSchema
      });
      const formData = new FormData();
      const blob = audio instanceof Uint8Array ? new Blob([audio]) : new Blob([convertBase64ToUint8Array(audio)]);
      formData.append("model", this.modelId);
      formData.append("file", new File([blob], "audio", { type: mediaType }));
      if (openAIOptions) {
        const transcriptionModelOptions = {
          include: (_a = openAIOptions.include) != null ? _a : void 0,
          language: (_b = openAIOptions.language) != null ? _b : void 0,
          prompt: (_c = openAIOptions.prompt) != null ? _c : void 0,
          temperature: (_d = openAIOptions.temperature) != null ? _d : void 0,
          timestamp_granularities: (_e = openAIOptions.timestampGranularities) != null ? _e : void 0
        };
        for (const key in transcriptionModelOptions) {
          const value = transcriptionModelOptions[key];
          if (value !== void 0) {
            formData.append(key, String(value));
          }
        }
      }
      return {
        formData,
        warnings
      };
    }
    async doGenerate(options) {
      var _a, _b, _c, _d, _e, _f;
      const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
      const { formData, warnings } = this.getArgs(options);
      const {
        value: response,
        responseHeaders,
        rawValue: rawResponse
      } = await postFormDataToApi({
        url: this.config.url({
          path: "/audio/transcriptions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        formData,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiTranscriptionResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const language = response.language != null && response.language in languageMap ? languageMap[response.language] : void 0;
      return {
        text: response.text,
        segments: (_e = (_d = response.words) == null ? void 0 : _d.map((word) => ({
          text: word.word,
          startSecond: word.start,
          endSecond: word.end
        }))) != null ? _e : [],
        language,
        durationInSeconds: (_f = response.duration) != null ? _f : void 0,
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders,
          body: rawResponse
        }
      };
    }
  };
  var openaiTranscriptionResponseSchema = objectType({
    text: stringType(),
    language: stringType().nullish(),
    duration: numberType().nullish(),
    words: arrayType(
      objectType({
        word: stringType(),
        start: numberType(),
        end: numberType()
      })
    ).nullish()
  });
  function convertToOpenAIResponsesMessages({
    prompt,
    systemMessageMode
  }) {
    const messages = [];
    const warnings = [];
    for (const { role, content } of prompt) {
      switch (role) {
        case "system": {
          switch (systemMessageMode) {
            case "system": {
              messages.push({ role: "system", content });
              break;
            }
            case "developer": {
              messages.push({ role: "developer", content });
              break;
            }
            case "remove": {
              warnings.push({
                type: "other",
                message: "system messages are removed for this model"
              });
              break;
            }
            default: {
              const _exhaustiveCheck = systemMessageMode;
              throw new Error(
                `Unsupported system message mode: ${_exhaustiveCheck}`
              );
            }
          }
          break;
        }
        case "user": {
          messages.push({
            role: "user",
            content: content.map((part, index) => {
              var _a, _b, _c, _d;
              switch (part.type) {
                case "text": {
                  return { type: "input_text", text: part.text };
                }
                case "image": {
                  return {
                    type: "input_image",
                    image_url: part.image instanceof URL ? part.image.toString() : `data:${(_a = part.mimeType) != null ? _a : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`,
                    // OpenAI specific extension: image detail
                    detail: (_c = (_b = part.providerMetadata) == null ? void 0 : _b.openai) == null ? void 0 : _c.imageDetail
                  };
                }
                case "file": {
                  if (part.data instanceof URL) {
                    throw new UnsupportedFunctionalityError({
                      functionality: "File URLs in user messages"
                    });
                  }
                  switch (part.mimeType) {
                    case "application/pdf": {
                      return {
                        type: "input_file",
                        filename: (_d = part.filename) != null ? _d : `part-${index}.pdf`,
                        file_data: `data:application/pdf;base64,${part.data}`
                      };
                    }
                    default: {
                      throw new UnsupportedFunctionalityError({
                        functionality: "Only PDF files are supported in user messages"
                      });
                    }
                  }
                }
              }
            })
          });
          break;
        }
        case "assistant": {
          for (const part of content) {
            switch (part.type) {
              case "text": {
                messages.push({
                  role: "assistant",
                  content: [{ type: "output_text", text: part.text }]
                });
                break;
              }
              case "tool-call": {
                messages.push({
                  type: "function_call",
                  call_id: part.toolCallId,
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                });
                break;
              }
            }
          }
          break;
        }
        case "tool": {
          for (const part of content) {
            messages.push({
              type: "function_call_output",
              call_id: part.toolCallId,
              output: JSON.stringify(part.result)
            });
          }
          break;
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    return { messages, warnings };
  }

  // src/responses/map-openai-responses-finish-reason.ts
  function mapOpenAIResponseFinishReason({
    finishReason,
    hasToolCalls
  }) {
    switch (finishReason) {
      case void 0:
      case null:
        return hasToolCalls ? "tool-calls" : "stop";
      case "max_output_tokens":
        return "length";
      case "content_filter":
        return "content-filter";
      default:
        return hasToolCalls ? "tool-calls" : "unknown";
    }
  }
  function prepareResponsesTools({
    mode,
    strict
  }) {
    var _a;
    const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
    const toolWarnings = [];
    if (tools == null) {
      return { tools: void 0, tool_choice: void 0, toolWarnings };
    }
    const toolChoice = mode.toolChoice;
    const openaiTools2 = [];
    for (const tool of tools) {
      switch (tool.type) {
        case "function":
          openaiTools2.push({
            type: "function",
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
            strict: strict ? true : void 0
          });
          break;
        case "provider-defined":
          switch (tool.id) {
            case "openai.web_search_preview":
              openaiTools2.push({
                type: "web_search_preview",
                search_context_size: tool.args.searchContextSize,
                user_location: tool.args.userLocation
              });
              break;
            default:
              toolWarnings.push({ type: "unsupported-tool", tool });
              break;
          }
          break;
        default:
          toolWarnings.push({ type: "unsupported-tool", tool });
          break;
      }
    }
    if (toolChoice == null) {
      return { tools: openaiTools2, tool_choice: void 0, toolWarnings };
    }
    const type = toolChoice.type;
    switch (type) {
      case "auto":
      case "none":
      case "required":
        return { tools: openaiTools2, tool_choice: type, toolWarnings };
      case "tool": {
        if (toolChoice.toolName === "web_search_preview") {
          return {
            tools: openaiTools2,
            tool_choice: {
              type: "web_search_preview"
            },
            toolWarnings
          };
        }
        return {
          tools: openaiTools2,
          tool_choice: {
            type: "function",
            name: toolChoice.toolName
          },
          toolWarnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
        });
      }
    }
  }

  // src/responses/openai-responses-language-model.ts
  var OpenAIResponsesLanguageModel = class {
    constructor(modelId, config) {
      this.specificationVersion = "v1";
      this.defaultObjectGenerationMode = "json";
      this.supportsStructuredOutputs = true;
      this.modelId = modelId;
      this.config = config;
    }
    get provider() {
      return this.config.provider;
    }
    getArgs({
      mode,
      maxTokens,
      temperature,
      stopSequences,
      topP,
      topK,
      presencePenalty,
      frequencyPenalty,
      seed,
      prompt,
      providerMetadata,
      responseFormat
    }) {
      var _a, _b, _c;
      const warnings = [];
      const modelConfig = getResponsesModelConfig(this.modelId);
      const type = mode.type;
      if (topK != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "topK"
        });
      }
      if (seed != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "seed"
        });
      }
      if (presencePenalty != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty"
        });
      }
      if (frequencyPenalty != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty"
        });
      }
      if (stopSequences != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "stopSequences"
        });
      }
      const { messages, warnings: messageWarnings } = convertToOpenAIResponsesMessages({
        prompt,
        systemMessageMode: modelConfig.systemMessageMode
      });
      warnings.push(...messageWarnings);
      const openaiOptions = parseProviderOptions({
        provider: "openai",
        providerOptions: providerMetadata,
        schema: openaiResponsesProviderOptionsSchema
      });
      const isStrict = (_a = openaiOptions == null ? void 0 : openaiOptions.strictSchemas) != null ? _a : true;
      const baseArgs = {
        model: this.modelId,
        input: messages,
        temperature,
        top_p: topP,
        max_output_tokens: maxTokens,
        ...(responseFormat == null ? void 0 : responseFormat.type) === "json" && {
          text: {
            format: responseFormat.schema != null ? {
              type: "json_schema",
              strict: isStrict,
              name: (_b = responseFormat.name) != null ? _b : "response",
              description: responseFormat.description,
              schema: responseFormat.schema
            } : { type: "json_object" }
          }
        },
        // provider options:
        metadata: openaiOptions == null ? void 0 : openaiOptions.metadata,
        parallel_tool_calls: openaiOptions == null ? void 0 : openaiOptions.parallelToolCalls,
        previous_response_id: openaiOptions == null ? void 0 : openaiOptions.previousResponseId,
        store: openaiOptions == null ? void 0 : openaiOptions.store,
        user: openaiOptions == null ? void 0 : openaiOptions.user,
        instructions: openaiOptions == null ? void 0 : openaiOptions.instructions,
        // model-specific settings:
        ...modelConfig.isReasoningModel && ((openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null || (openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null) && {
          reasoning: {
            ...(openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null && {
              effort: openaiOptions.reasoningEffort
            },
            ...(openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null && {
              summary: openaiOptions.reasoningSummary
            }
          }
        },
        ...modelConfig.requiredAutoTruncation && {
          truncation: "auto"
        }
      };
      if (modelConfig.isReasoningModel) {
        if (baseArgs.temperature != null) {
          baseArgs.temperature = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "temperature",
            details: "temperature is not supported for reasoning models"
          });
        }
        if (baseArgs.top_p != null) {
          baseArgs.top_p = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "topP",
            details: "topP is not supported for reasoning models"
          });
        }
      }
      switch (type) {
        case "regular": {
          const { tools, tool_choice, toolWarnings } = prepareResponsesTools({
            mode,
            strict: isStrict
            // TODO support provider options on tools
          });
          return {
            args: {
              ...baseArgs,
              tools,
              tool_choice
            },
            warnings: [...warnings, ...toolWarnings]
          };
        }
        case "object-json": {
          return {
            args: {
              ...baseArgs,
              text: {
                format: mode.schema != null ? {
                  type: "json_schema",
                  strict: isStrict,
                  name: (_c = mode.name) != null ? _c : "response",
                  description: mode.description,
                  schema: mode.schema
                } : { type: "json_object" }
              }
            },
            warnings
          };
        }
        case "object-tool": {
          return {
            args: {
              ...baseArgs,
              tool_choice: { type: "function", name: mode.tool.name },
              tools: [
                {
                  type: "function",
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters,
                  strict: isStrict
                }
              ]
            },
            warnings
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    async doGenerate(options) {
      var _a, _b, _c, _d, _e, _f, _g;
      const { args: body, warnings } = this.getArgs(options);
      const url = this.config.url({
        path: "/responses",
        modelId: this.modelId
      });
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = await postJsonToApi({
        url,
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          objectType({
            id: stringType(),
            created_at: numberType(),
            error: objectType({
              message: stringType(),
              code: stringType()
            }).nullish(),
            model: stringType(),
            output: arrayType(
              discriminatedUnionType("type", [
                objectType({
                  type: literalType("message"),
                  role: literalType("assistant"),
                  content: arrayType(
                    objectType({
                      type: literalType("output_text"),
                      text: stringType(),
                      annotations: arrayType(
                        objectType({
                          type: literalType("url_citation"),
                          start_index: numberType(),
                          end_index: numberType(),
                          url: stringType(),
                          title: stringType()
                        })
                      )
                    })
                  )
                }),
                objectType({
                  type: literalType("function_call"),
                  call_id: stringType(),
                  name: stringType(),
                  arguments: stringType()
                }),
                objectType({
                  type: literalType("web_search_call")
                }),
                objectType({
                  type: literalType("computer_call")
                }),
                objectType({
                  type: literalType("reasoning"),
                  summary: arrayType(
                    objectType({
                      type: literalType("summary_text"),
                      text: stringType()
                    })
                  )
                })
              ])
            ),
            incomplete_details: objectType({ reason: stringType() }).nullable(),
            usage: usageSchema
          })
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      if (response.error) {
        throw new APICallError({
          message: response.error.message,
          url,
          requestBodyValues: body,
          statusCode: 400,
          responseHeaders,
          responseBody: rawResponse,
          isRetryable: false
        });
      }
      const outputTextElements = response.output.filter((output) => output.type === "message").flatMap((output) => output.content).filter((content) => content.type === "output_text");
      const toolCalls = response.output.filter((output) => output.type === "function_call").map((output) => ({
        toolCallType: "function",
        toolCallId: output.call_id,
        toolName: output.name,
        args: output.arguments
      }));
      const reasoningSummary = (_b = (_a = response.output.find((item) => item.type === "reasoning")) == null ? void 0 : _a.summary) != null ? _b : null;
      return {
        text: outputTextElements.map((content) => content.text).join("\n"),
        sources: outputTextElements.flatMap(
          (content) => content.annotations.map((annotation) => {
            var _a2, _b2, _c2;
            return {
              sourceType: "url",
              id: (_c2 = (_b2 = (_a2 = this.config).generateId) == null ? void 0 : _b2.call(_a2)) != null ? _c2 : generateId(),
              url: annotation.url,
              title: annotation.title
            };
          })
        ),
        finishReason: mapOpenAIResponseFinishReason({
          finishReason: (_c = response.incomplete_details) == null ? void 0 : _c.reason,
          hasToolCalls: toolCalls.length > 0
        }),
        toolCalls: toolCalls.length > 0 ? toolCalls : void 0,
        reasoning: reasoningSummary ? reasoningSummary.map((summary) => ({
          type: "text",
          text: summary.text
        })) : void 0,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens
        },
        rawCall: {
          rawPrompt: void 0,
          rawSettings: {}
        },
        rawResponse: {
          headers: responseHeaders,
          body: rawResponse
        },
        request: {
          body: JSON.stringify(body)
        },
        response: {
          id: response.id,
          timestamp: new Date(response.created_at * 1e3),
          modelId: response.model
        },
        providerMetadata: {
          openai: {
            responseId: response.id,
            cachedPromptTokens: (_e = (_d = response.usage.input_tokens_details) == null ? void 0 : _d.cached_tokens) != null ? _e : null,
            reasoningTokens: (_g = (_f = response.usage.output_tokens_details) == null ? void 0 : _f.reasoning_tokens) != null ? _g : null
          }
        },
        warnings
      };
    }
    async doStream(options) {
      const { args: body, warnings } = this.getArgs(options);
      const { responseHeaders, value: response } = await postJsonToApi({
        url: this.config.url({
          path: "/responses",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: {
          ...body,
          stream: true
        },
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          openaiResponsesChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const self = this;
      let finishReason = "unknown";
      let promptTokens = NaN;
      let completionTokens = NaN;
      let cachedPromptTokens = null;
      let reasoningTokens = null;
      let responseId = null;
      const ongoingToolCalls = {};
      let hasToolCalls = false;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a, _b, _c, _d, _e, _f, _g, _h;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if (isResponseOutputItemAddedChunk(value)) {
                if (value.item.type === "function_call") {
                  ongoingToolCalls[value.output_index] = {
                    toolName: value.item.name,
                    toolCallId: value.item.call_id
                  };
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: value.item.call_id,
                    toolName: value.item.name,
                    argsTextDelta: value.item.arguments
                  });
                }
              } else if (isResponseFunctionCallArgumentsDeltaChunk(value)) {
                const toolCall = ongoingToolCalls[value.output_index];
                if (toolCall != null) {
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.toolCallId,
                    toolName: toolCall.toolName,
                    argsTextDelta: value.delta
                  });
                }
              } else if (isResponseCreatedChunk(value)) {
                responseId = value.response.id;
                controller.enqueue({
                  type: "response-metadata",
                  id: value.response.id,
                  timestamp: new Date(value.response.created_at * 1e3),
                  modelId: value.response.model
                });
              } else if (isTextDeltaChunk(value)) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: value.delta
                });
              } else if (isResponseReasoningSummaryTextDeltaChunk(value)) {
                controller.enqueue({
                  type: "reasoning",
                  textDelta: value.delta
                });
              } else if (isResponseOutputItemDoneChunk(value) && value.item.type === "function_call") {
                ongoingToolCalls[value.output_index] = void 0;
                hasToolCalls = true;
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: value.item.call_id,
                  toolName: value.item.name,
                  args: value.item.arguments
                });
              } else if (isResponseFinishedChunk(value)) {
                finishReason = mapOpenAIResponseFinishReason({
                  finishReason: (_a = value.response.incomplete_details) == null ? void 0 : _a.reason,
                  hasToolCalls
                });
                promptTokens = value.response.usage.input_tokens;
                completionTokens = value.response.usage.output_tokens;
                cachedPromptTokens = (_c = (_b = value.response.usage.input_tokens_details) == null ? void 0 : _b.cached_tokens) != null ? _c : cachedPromptTokens;
                reasoningTokens = (_e = (_d = value.response.usage.output_tokens_details) == null ? void 0 : _d.reasoning_tokens) != null ? _e : reasoningTokens;
              } else if (isResponseAnnotationAddedChunk(value)) {
                controller.enqueue({
                  type: "source",
                  source: {
                    sourceType: "url",
                    id: (_h = (_g = (_f = self.config).generateId) == null ? void 0 : _g.call(_f)) != null ? _h : generateId(),
                    url: value.annotation.url,
                    title: value.annotation.title
                  }
                });
              } else if (isErrorChunk(value)) {
                controller.enqueue({ type: "error", error: value });
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                usage: { promptTokens, completionTokens },
                ...(cachedPromptTokens != null || reasoningTokens != null) && {
                  providerMetadata: {
                    openai: {
                      responseId,
                      cachedPromptTokens,
                      reasoningTokens
                    }
                  }
                }
              });
            }
          })
        ),
        rawCall: {
          rawPrompt: void 0,
          rawSettings: {}
        },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    }
  };
  var usageSchema = objectType({
    input_tokens: numberType(),
    input_tokens_details: objectType({ cached_tokens: numberType().nullish() }).nullish(),
    output_tokens: numberType(),
    output_tokens_details: objectType({ reasoning_tokens: numberType().nullish() }).nullish()
  });
  var textDeltaChunkSchema = objectType({
    type: literalType("response.output_text.delta"),
    delta: stringType()
  });
  var responseFinishedChunkSchema = objectType({
    type: enumType(["response.completed", "response.incomplete"]),
    response: objectType({
      incomplete_details: objectType({ reason: stringType() }).nullish(),
      usage: usageSchema
    })
  });
  var responseCreatedChunkSchema = objectType({
    type: literalType("response.created"),
    response: objectType({
      id: stringType(),
      created_at: numberType(),
      model: stringType()
    })
  });
  var responseOutputItemDoneSchema = objectType({
    type: literalType("response.output_item.done"),
    output_index: numberType(),
    item: discriminatedUnionType("type", [
      objectType({
        type: literalType("message")
      }),
      objectType({
        type: literalType("function_call"),
        id: stringType(),
        call_id: stringType(),
        name: stringType(),
        arguments: stringType(),
        status: literalType("completed")
      })
    ])
  });
  var responseFunctionCallArgumentsDeltaSchema = objectType({
    type: literalType("response.function_call_arguments.delta"),
    item_id: stringType(),
    output_index: numberType(),
    delta: stringType()
  });
  var responseOutputItemAddedSchema = objectType({
    type: literalType("response.output_item.added"),
    output_index: numberType(),
    item: discriminatedUnionType("type", [
      objectType({
        type: literalType("message")
      }),
      objectType({
        type: literalType("function_call"),
        id: stringType(),
        call_id: stringType(),
        name: stringType(),
        arguments: stringType()
      })
    ])
  });
  var responseAnnotationAddedSchema = objectType({
    type: literalType("response.output_text.annotation.added"),
    annotation: objectType({
      type: literalType("url_citation"),
      url: stringType(),
      title: stringType()
    })
  });
  var responseReasoningSummaryTextDeltaSchema = objectType({
    type: literalType("response.reasoning_summary_text.delta"),
    item_id: stringType(),
    output_index: numberType(),
    summary_index: numberType(),
    delta: stringType()
  });
  var errorChunkSchema = objectType({
    type: literalType("error"),
    code: stringType(),
    message: stringType(),
    param: stringType().nullish(),
    sequence_number: numberType()
  });
  var openaiResponsesChunkSchema = unionType([
    textDeltaChunkSchema,
    responseFinishedChunkSchema,
    responseCreatedChunkSchema,
    responseOutputItemDoneSchema,
    responseFunctionCallArgumentsDeltaSchema,
    responseOutputItemAddedSchema,
    responseAnnotationAddedSchema,
    responseReasoningSummaryTextDeltaSchema,
    errorChunkSchema,
    objectType({ type: stringType() }).passthrough()
    // fallback for unknown chunks
  ]);
  function isTextDeltaChunk(chunk) {
    return chunk.type === "response.output_text.delta";
  }
  function isResponseOutputItemDoneChunk(chunk) {
    return chunk.type === "response.output_item.done";
  }
  function isResponseFinishedChunk(chunk) {
    return chunk.type === "response.completed" || chunk.type === "response.incomplete";
  }
  function isResponseCreatedChunk(chunk) {
    return chunk.type === "response.created";
  }
  function isResponseFunctionCallArgumentsDeltaChunk(chunk) {
    return chunk.type === "response.function_call_arguments.delta";
  }
  function isResponseOutputItemAddedChunk(chunk) {
    return chunk.type === "response.output_item.added";
  }
  function isResponseAnnotationAddedChunk(chunk) {
    return chunk.type === "response.output_text.annotation.added";
  }
  function isResponseReasoningSummaryTextDeltaChunk(chunk) {
    return chunk.type === "response.reasoning_summary_text.delta";
  }
  function isErrorChunk(chunk) {
    return chunk.type === "error";
  }
  function getResponsesModelConfig(modelId) {
    if (modelId.startsWith("o")) {
      if (modelId.startsWith("o1-mini") || modelId.startsWith("o1-preview")) {
        return {
          isReasoningModel: true,
          systemMessageMode: "remove",
          requiredAutoTruncation: false
        };
      }
      return {
        isReasoningModel: true,
        systemMessageMode: "developer",
        requiredAutoTruncation: false
      };
    }
    return {
      isReasoningModel: false,
      systemMessageMode: "system",
      requiredAutoTruncation: false
    };
  }
  var openaiResponsesProviderOptionsSchema = objectType({
    metadata: anyType().nullish(),
    parallelToolCalls: booleanType().nullish(),
    previousResponseId: stringType().nullish(),
    store: booleanType().nullish(),
    user: stringType().nullish(),
    reasoningEffort: stringType().nullish(),
    strictSchemas: booleanType().nullish(),
    instructions: stringType().nullish(),
    reasoningSummary: stringType().nullish()
  });
  var WebSearchPreviewParameters = objectType({});
  function webSearchPreviewTool({
    searchContextSize,
    userLocation
  } = {}) {
    return {
      type: "provider-defined",
      id: "openai.web_search_preview",
      args: {
        searchContextSize,
        userLocation
      },
      parameters: WebSearchPreviewParameters
    };
  }
  var openaiTools = {
    webSearchPreview: webSearchPreviewTool
  };
  var OpenAIProviderOptionsSchema = objectType({
    instructions: stringType().nullish(),
    speed: numberType().min(0.25).max(4).default(1).nullish()
  });
  var OpenAISpeechModel = class {
    constructor(modelId, config) {
      this.modelId = modelId;
      this.config = config;
      this.specificationVersion = "v1";
    }
    get provider() {
      return this.config.provider;
    }
    getArgs({
      text,
      voice = "alloy",
      outputFormat = "mp3",
      speed,
      instructions,
      providerOptions
    }) {
      const warnings = [];
      const openAIOptions = parseProviderOptions({
        provider: "openai",
        providerOptions,
        schema: OpenAIProviderOptionsSchema
      });
      const requestBody = {
        model: this.modelId,
        input: text,
        voice,
        response_format: "mp3",
        speed,
        instructions
      };
      if (outputFormat) {
        if (["mp3", "opus", "aac", "flac", "wav", "pcm"].includes(outputFormat)) {
          requestBody.response_format = outputFormat;
        } else {
          warnings.push({
            type: "unsupported-setting",
            setting: "outputFormat",
            details: `Unsupported output format: ${outputFormat}. Using mp3 instead.`
          });
        }
      }
      if (openAIOptions) {
        const speechModelOptions = {};
        for (const key in speechModelOptions) {
          const value = speechModelOptions[key];
          if (value !== void 0) {
            requestBody[key] = value;
          }
        }
      }
      return {
        requestBody,
        warnings
      };
    }
    async doGenerate(options) {
      var _a, _b, _c;
      const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
      const { requestBody, warnings } = this.getArgs(options);
      const {
        value: audio,
        responseHeaders,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: this.config.url({
          path: "/audio/speech",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: requestBody,
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createBinaryResponseHandler(),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      return {
        audio,
        warnings,
        request: {
          body: JSON.stringify(requestBody)
        },
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders,
          body: rawResponse
        }
      };
    }
  };

  // src/openai-provider.ts
  function createOpenAI(options = {}) {
    var _a, _b, _c;
    const baseURL = (_a = withoutTrailingSlash(options.baseURL)) != null ? _a : "https://api.openai.com/v1";
    const compatibility = (_b = options.compatibility) != null ? _b : "compatible";
    const providerName = (_c = options.name) != null ? _c : "openai";
    const getHeaders = () => ({
      Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "OPENAI_API_KEY",
      description: "OpenAI"
    })}`,
      "OpenAI-Organization": options.organization,
      "OpenAI-Project": options.project,
      ...options.headers
    });
    const createChatModel = (modelId, settings = {}) => new OpenAIChatLanguageModel(modelId, settings, {
      provider: `${providerName}.chat`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      compatibility,
      fetch: options.fetch
    });
    const createCompletionModel = (modelId, settings = {}) => new OpenAICompletionLanguageModel(modelId, settings, {
      provider: `${providerName}.completion`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      compatibility,
      fetch: options.fetch
    });
    const createEmbeddingModel = (modelId, settings = {}) => new OpenAIEmbeddingModel(modelId, settings, {
      provider: `${providerName}.embedding`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch
    });
    const createImageModel = (modelId, settings = {}) => new OpenAIImageModel(modelId, settings, {
      provider: `${providerName}.image`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch
    });
    const createTranscriptionModel = (modelId) => new OpenAITranscriptionModel(modelId, {
      provider: `${providerName}.transcription`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch
    });
    const createSpeechModel = (modelId) => new OpenAISpeechModel(modelId, {
      provider: `${providerName}.speech`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch
    });
    const createLanguageModel = (modelId, settings) => {
      if (new.target) {
        throw new Error(
          "The OpenAI model function cannot be called with the new keyword."
        );
      }
      if (modelId === "gpt-3.5-turbo-instruct") {
        return createCompletionModel(
          modelId,
          settings
        );
      }
      return createChatModel(modelId, settings);
    };
    const createResponsesModel = (modelId) => {
      return new OpenAIResponsesLanguageModel(modelId, {
        provider: `${providerName}.responses`,
        url: ({ path }) => `${baseURL}${path}`,
        headers: getHeaders,
        fetch: options.fetch
      });
    };
    const provider = function(modelId, settings) {
      return createLanguageModel(modelId, settings);
    };
    provider.languageModel = createLanguageModel;
    provider.chat = createChatModel;
    provider.completion = createCompletionModel;
    provider.responses = createResponsesModel;
    provider.embedding = createEmbeddingModel;
    provider.textEmbedding = createEmbeddingModel;
    provider.textEmbeddingModel = createEmbeddingModel;
    provider.image = createImageModel;
    provider.imageModel = createImageModel;
    provider.transcription = createTranscriptionModel;
    provider.transcriptionModel = createTranscriptionModel;
    provider.speech = createSpeechModel;
    provider.speechModel = createSpeechModel;
    provider.tools = openaiTools;
    return provider;
  }
  createOpenAI({
    compatibility: "strict"
    // strict for OpenAI API
  });

  // src/anthropic-provider.ts
  var anthropicErrorDataSchema = objectType({
    type: literalType("error"),
    error: objectType({
      type: stringType(),
      message: stringType()
    })
  });
  var anthropicFailedResponseHandler = createJsonErrorResponseHandler({
    errorSchema: anthropicErrorDataSchema,
    errorToMessage: (data) => data.error.message
  });
  function prepareTools$2(mode) {
    var _a;
    const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
    const toolWarnings = [];
    const betas = /* @__PURE__ */ new Set();
    if (tools == null) {
      return { tools: void 0, tool_choice: void 0, toolWarnings, betas };
    }
    const anthropicTools2 = [];
    for (const tool of tools) {
      switch (tool.type) {
        case "function":
          anthropicTools2.push({
            name: tool.name,
            description: tool.description,
            input_schema: tool.parameters
          });
          break;
        case "provider-defined":
          switch (tool.id) {
            case "anthropic.computer_20250124":
              betas.add("computer-use-2025-01-24");
              anthropicTools2.push({
                name: tool.name,
                type: "computer_20250124",
                display_width_px: tool.args.displayWidthPx,
                display_height_px: tool.args.displayHeightPx,
                display_number: tool.args.displayNumber
              });
              break;
            case "anthropic.computer_20241022":
              betas.add("computer-use-2024-10-22");
              anthropicTools2.push({
                name: tool.name,
                type: "computer_20241022",
                display_width_px: tool.args.displayWidthPx,
                display_height_px: tool.args.displayHeightPx,
                display_number: tool.args.displayNumber
              });
              break;
            case "anthropic.text_editor_20250124":
              betas.add("computer-use-2025-01-24");
              anthropicTools2.push({
                name: tool.name,
                type: "text_editor_20250124"
              });
              break;
            case "anthropic.text_editor_20241022":
              betas.add("computer-use-2024-10-22");
              anthropicTools2.push({
                name: tool.name,
                type: "text_editor_20241022"
              });
              break;
            case "anthropic.bash_20250124":
              betas.add("computer-use-2025-01-24");
              anthropicTools2.push({
                name: tool.name,
                type: "bash_20250124"
              });
              break;
            case "anthropic.bash_20241022":
              betas.add("computer-use-2024-10-22");
              anthropicTools2.push({
                name: tool.name,
                type: "bash_20241022"
              });
              break;
            default:
              toolWarnings.push({ type: "unsupported-tool", tool });
              break;
          }
          break;
        default:
          toolWarnings.push({ type: "unsupported-tool", tool });
          break;
      }
    }
    const toolChoice = mode.toolChoice;
    if (toolChoice == null) {
      return {
        tools: anthropicTools2,
        tool_choice: void 0,
        toolWarnings,
        betas
      };
    }
    const type = toolChoice.type;
    switch (type) {
      case "auto":
        return {
          tools: anthropicTools2,
          tool_choice: { type: "auto" },
          toolWarnings,
          betas
        };
      case "required":
        return {
          tools: anthropicTools2,
          tool_choice: { type: "any" },
          toolWarnings,
          betas
        };
      case "none":
        return { tools: void 0, tool_choice: void 0, toolWarnings, betas };
      case "tool":
        return {
          tools: anthropicTools2,
          tool_choice: { type: "tool", name: toolChoice.toolName },
          toolWarnings,
          betas
        };
      default: {
        const _exhaustiveCheck = type;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
        });
      }
    }
  }
  function convertToAnthropicMessagesPrompt({
    prompt,
    sendReasoning,
    warnings
  }) {
    var _a, _b, _c, _d;
    const betas = /* @__PURE__ */ new Set();
    const blocks = groupIntoBlocks(prompt);
    let system = void 0;
    const messages = [];
    function getCacheControl(providerMetadata) {
      var _a2;
      const anthropic2 = providerMetadata == null ? void 0 : providerMetadata.anthropic;
      const cacheControlValue = (_a2 = anthropic2 == null ? void 0 : anthropic2.cacheControl) != null ? _a2 : anthropic2 == null ? void 0 : anthropic2.cache_control;
      return cacheControlValue;
    }
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const isLastBlock = i === blocks.length - 1;
      const type = block.type;
      switch (type) {
        case "system": {
          if (system != null) {
            throw new UnsupportedFunctionalityError({
              functionality: "Multiple system messages that are separated by user/assistant messages"
            });
          }
          system = block.messages.map(({ content, providerMetadata }) => ({
            type: "text",
            text: content,
            cache_control: getCacheControl(providerMetadata)
          }));
          break;
        }
        case "user": {
          const anthropicContent = [];
          for (const message of block.messages) {
            const { role, content } = message;
            switch (role) {
              case "user": {
                for (let j = 0; j < content.length; j++) {
                  const part = content[j];
                  const isLastPart = j === content.length - 1;
                  const cacheControl = (_a = getCacheControl(part.providerMetadata)) != null ? _a : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
                  switch (part.type) {
                    case "text": {
                      anthropicContent.push({
                        type: "text",
                        text: part.text,
                        cache_control: cacheControl
                      });
                      break;
                    }
                    case "image": {
                      anthropicContent.push({
                        type: "image",
                        source: part.image instanceof URL ? {
                          type: "url",
                          url: part.image.toString()
                        } : {
                          type: "base64",
                          media_type: (_b = part.mimeType) != null ? _b : "image/jpeg",
                          data: convertUint8ArrayToBase64(part.image)
                        },
                        cache_control: cacheControl
                      });
                      break;
                    }
                    case "file": {
                      if (part.mimeType !== "application/pdf") {
                        throw new UnsupportedFunctionalityError({
                          functionality: "Non-PDF files in user messages"
                        });
                      }
                      betas.add("pdfs-2024-09-25");
                      anthropicContent.push({
                        type: "document",
                        source: part.data instanceof URL ? {
                          type: "url",
                          url: part.data.toString()
                        } : {
                          type: "base64",
                          media_type: "application/pdf",
                          data: part.data
                        },
                        cache_control: cacheControl
                      });
                      break;
                    }
                  }
                }
                break;
              }
              case "tool": {
                for (let i2 = 0; i2 < content.length; i2++) {
                  const part = content[i2];
                  const isLastPart = i2 === content.length - 1;
                  const cacheControl = (_c = getCacheControl(part.providerMetadata)) != null ? _c : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
                  const toolResultContent = part.content != null ? part.content.map((part2) => {
                    var _a2;
                    switch (part2.type) {
                      case "text":
                        return {
                          type: "text",
                          text: part2.text,
                          cache_control: void 0
                        };
                      case "image":
                        return {
                          type: "image",
                          source: {
                            type: "base64",
                            media_type: (_a2 = part2.mimeType) != null ? _a2 : "image/jpeg",
                            data: part2.data
                          },
                          cache_control: void 0
                        };
                    }
                  }) : JSON.stringify(part.result);
                  anthropicContent.push({
                    type: "tool_result",
                    tool_use_id: part.toolCallId,
                    content: toolResultContent,
                    is_error: part.isError,
                    cache_control: cacheControl
                  });
                }
                break;
              }
              default: {
                const _exhaustiveCheck = role;
                throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
              }
            }
          }
          messages.push({ role: "user", content: anthropicContent });
          break;
        }
        case "assistant": {
          const anthropicContent = [];
          for (let j = 0; j < block.messages.length; j++) {
            const message = block.messages[j];
            const isLastMessage = j === block.messages.length - 1;
            const { content } = message;
            for (let k = 0; k < content.length; k++) {
              const part = content[k];
              const isLastContentPart = k === content.length - 1;
              const cacheControl = (_d = getCacheControl(part.providerMetadata)) != null ? _d : isLastContentPart ? getCacheControl(message.providerMetadata) : void 0;
              switch (part.type) {
                case "text": {
                  anthropicContent.push({
                    type: "text",
                    text: (
                      // trim the last text part if it's the last message in the block
                      // because Anthropic does not allow trailing whitespace
                      // in pre-filled assistant responses
                      isLastBlock && isLastMessage && isLastContentPart ? part.text.trim() : part.text
                    ),
                    cache_control: cacheControl
                  });
                  break;
                }
                case "reasoning": {
                  if (sendReasoning) {
                    anthropicContent.push({
                      type: "thinking",
                      thinking: part.text,
                      signature: part.signature,
                      cache_control: cacheControl
                    });
                  } else {
                    warnings.push({
                      type: "other",
                      message: "sending reasoning content is disabled for this model"
                    });
                  }
                  break;
                }
                case "redacted-reasoning": {
                  anthropicContent.push({
                    type: "redacted_thinking",
                    data: part.data,
                    cache_control: cacheControl
                  });
                  break;
                }
                case "tool-call": {
                  anthropicContent.push({
                    type: "tool_use",
                    id: part.toolCallId,
                    name: part.toolName,
                    input: part.args,
                    cache_control: cacheControl
                  });
                  break;
                }
              }
            }
          }
          messages.push({ role: "assistant", content: anthropicContent });
          break;
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    return {
      prompt: { system, messages },
      betas
    };
  }
  function groupIntoBlocks(prompt) {
    const blocks = [];
    let currentBlock = void 0;
    for (const message of prompt) {
      const { role } = message;
      switch (role) {
        case "system": {
          if ((currentBlock == null ? void 0 : currentBlock.type) !== "system") {
            currentBlock = { type: "system", messages: [] };
            blocks.push(currentBlock);
          }
          currentBlock.messages.push(message);
          break;
        }
        case "assistant": {
          if ((currentBlock == null ? void 0 : currentBlock.type) !== "assistant") {
            currentBlock = { type: "assistant", messages: [] };
            blocks.push(currentBlock);
          }
          currentBlock.messages.push(message);
          break;
        }
        case "user": {
          if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
            currentBlock = { type: "user", messages: [] };
            blocks.push(currentBlock);
          }
          currentBlock.messages.push(message);
          break;
        }
        case "tool": {
          if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
            currentBlock = { type: "user", messages: [] };
            blocks.push(currentBlock);
          }
          currentBlock.messages.push(message);
          break;
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    return blocks;
  }

  // src/map-anthropic-stop-reason.ts
  function mapAnthropicStopReason(finishReason) {
    switch (finishReason) {
      case "end_turn":
      case "stop_sequence":
        return "stop";
      case "tool_use":
        return "tool-calls";
      case "max_tokens":
        return "length";
      default:
        return "unknown";
    }
  }

  // src/anthropic-messages-language-model.ts
  var AnthropicMessagesLanguageModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.defaultObjectGenerationMode = "tool";
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    supportsUrl(url) {
      return url.protocol === "https:";
    }
    get provider() {
      return this.config.provider;
    }
    get supportsImageUrls() {
      return this.config.supportsImageUrls;
    }
    async getArgs({
      mode,
      prompt,
      maxTokens = 4096,
      // 4096: max model output tokens TODO update default in v5
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      stopSequences,
      responseFormat,
      seed,
      providerMetadata: providerOptions
    }) {
      var _a, _b, _c;
      const type = mode.type;
      const warnings = [];
      if (frequencyPenalty != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty"
        });
      }
      if (presencePenalty != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty"
        });
      }
      if (seed != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "seed"
        });
      }
      if (responseFormat != null && responseFormat.type !== "text") {
        warnings.push({
          type: "unsupported-setting",
          setting: "responseFormat",
          details: "JSON response format is not supported."
        });
      }
      const { prompt: messagesPrompt, betas: messagesBetas } = convertToAnthropicMessagesPrompt({
        prompt,
        sendReasoning: (_a = this.settings.sendReasoning) != null ? _a : true,
        warnings
      });
      const anthropicOptions = parseProviderOptions({
        provider: "anthropic",
        providerOptions,
        schema: anthropicProviderOptionsSchema
      });
      const isThinking = ((_b = anthropicOptions == null ? void 0 : anthropicOptions.thinking) == null ? void 0 : _b.type) === "enabled";
      const thinkingBudget = (_c = anthropicOptions == null ? void 0 : anthropicOptions.thinking) == null ? void 0 : _c.budgetTokens;
      const baseArgs = {
        // model id:
        model: this.modelId,
        // standardized settings:
        max_tokens: maxTokens,
        temperature,
        top_k: topK,
        top_p: topP,
        stop_sequences: stopSequences,
        // provider specific settings:
        ...isThinking && {
          thinking: { type: "enabled", budget_tokens: thinkingBudget }
        },
        // prompt:
        system: messagesPrompt.system,
        messages: messagesPrompt.messages
      };
      if (isThinking) {
        if (thinkingBudget == null) {
          throw new UnsupportedFunctionalityError({
            functionality: "thinking requires a budget"
          });
        }
        if (baseArgs.temperature != null) {
          baseArgs.temperature = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "temperature",
            details: "temperature is not supported when thinking is enabled"
          });
        }
        if (topK != null) {
          baseArgs.top_k = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "topK",
            details: "topK is not supported when thinking is enabled"
          });
        }
        if (topP != null) {
          baseArgs.top_p = void 0;
          warnings.push({
            type: "unsupported-setting",
            setting: "topP",
            details: "topP is not supported when thinking is enabled"
          });
        }
        baseArgs.max_tokens = maxTokens + thinkingBudget;
      }
      switch (type) {
        case "regular": {
          const {
            tools,
            tool_choice,
            toolWarnings,
            betas: toolsBetas
          } = prepareTools$2(mode);
          return {
            args: { ...baseArgs, tools, tool_choice },
            warnings: [...warnings, ...toolWarnings],
            betas: /* @__PURE__ */ new Set([...messagesBetas, ...toolsBetas])
          };
        }
        case "object-json": {
          throw new UnsupportedFunctionalityError({
            functionality: "json-mode object generation"
          });
        }
        case "object-tool": {
          const { name, description, parameters } = mode.tool;
          return {
            args: {
              ...baseArgs,
              tools: [{ name, description, input_schema: parameters }],
              tool_choice: { type: "tool", name }
            },
            warnings,
            betas: messagesBetas
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    async getHeaders({
      betas,
      headers
    }) {
      return combineHeaders(
        await resolve(this.config.headers),
        betas.size > 0 ? { "anthropic-beta": Array.from(betas).join(",") } : {},
        headers
      );
    }
    buildRequestUrl(isStreaming) {
      var _a, _b, _c;
      return (_c = (_b = (_a = this.config).buildRequestUrl) == null ? void 0 : _b.call(_a, this.config.baseURL, isStreaming)) != null ? _c : `${this.config.baseURL}/messages`;
    }
    transformRequestBody(args) {
      var _a, _b, _c;
      return (_c = (_b = (_a = this.config).transformRequestBody) == null ? void 0 : _b.call(_a, args)) != null ? _c : args;
    }
    async doGenerate(options) {
      var _a, _b, _c, _d;
      const { args, warnings, betas } = await this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: this.buildRequestUrl(false),
        headers: await this.getHeaders({ betas, headers: options.headers }),
        body: this.transformRequestBody(args),
        failedResponseHandler: anthropicFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          anthropicMessagesResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      let text = "";
      for (const content of response.content) {
        if (content.type === "text") {
          text += content.text;
        }
      }
      let toolCalls = void 0;
      if (response.content.some((content) => content.type === "tool_use")) {
        toolCalls = [];
        for (const content of response.content) {
          if (content.type === "tool_use") {
            toolCalls.push({
              toolCallType: "function",
              toolCallId: content.id,
              toolName: content.name,
              args: JSON.stringify(content.input)
            });
          }
        }
      }
      const reasoning = response.content.filter(
        (content) => content.type === "redacted_thinking" || content.type === "thinking"
      ).map(
        (content) => content.type === "thinking" ? {
          type: "text",
          text: content.thinking,
          signature: content.signature
        } : {
          type: "redacted",
          data: content.data
        }
      );
      return {
        text,
        reasoning: reasoning.length > 0 ? reasoning : void 0,
        toolCalls,
        finishReason: mapAnthropicStopReason(response.stop_reason),
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: {
          headers: responseHeaders,
          body: rawResponse
        },
        response: {
          id: (_a = response.id) != null ? _a : void 0,
          modelId: (_b = response.model) != null ? _b : void 0
        },
        warnings,
        providerMetadata: {
          anthropic: {
            cacheCreationInputTokens: (_c = response.usage.cache_creation_input_tokens) != null ? _c : null,
            cacheReadInputTokens: (_d = response.usage.cache_read_input_tokens) != null ? _d : null
          }
        },
        request: { body: JSON.stringify(args) }
      };
    }
    async doStream(options) {
      const { args, warnings, betas } = await this.getArgs(options);
      const body = { ...args, stream: true };
      const { responseHeaders, value: response } = await postJsonToApi({
        url: this.buildRequestUrl(true),
        headers: await this.getHeaders({ betas, headers: options.headers }),
        body: this.transformRequestBody(body),
        failedResponseHandler: anthropicFailedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          anthropicMessagesChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      let finishReason = "unknown";
      const usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      const toolCallContentBlocks = {};
      let providerMetadata = void 0;
      let blockType = void 0;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a, _b, _c, _d;
              if (!chunk.success) {
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              switch (value.type) {
                case "ping": {
                  return;
                }
                case "content_block_start": {
                  const contentBlockType = value.content_block.type;
                  blockType = contentBlockType;
                  switch (contentBlockType) {
                    case "text":
                    case "thinking": {
                      return;
                    }
                    case "redacted_thinking": {
                      controller.enqueue({
                        type: "redacted-reasoning",
                        data: value.content_block.data
                      });
                      return;
                    }
                    case "tool_use": {
                      toolCallContentBlocks[value.index] = {
                        toolCallId: value.content_block.id,
                        toolName: value.content_block.name,
                        jsonText: ""
                      };
                      return;
                    }
                    default: {
                      const _exhaustiveCheck = contentBlockType;
                      throw new Error(
                        `Unsupported content block type: ${_exhaustiveCheck}`
                      );
                    }
                  }
                }
                case "content_block_stop": {
                  if (toolCallContentBlocks[value.index] != null) {
                    const contentBlock = toolCallContentBlocks[value.index];
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: contentBlock.toolCallId,
                      toolName: contentBlock.toolName,
                      args: contentBlock.jsonText
                    });
                    delete toolCallContentBlocks[value.index];
                  }
                  blockType = void 0;
                  return;
                }
                case "content_block_delta": {
                  const deltaType = value.delta.type;
                  switch (deltaType) {
                    case "text_delta": {
                      controller.enqueue({
                        type: "text-delta",
                        textDelta: value.delta.text
                      });
                      return;
                    }
                    case "thinking_delta": {
                      controller.enqueue({
                        type: "reasoning",
                        textDelta: value.delta.thinking
                      });
                      return;
                    }
                    case "signature_delta": {
                      if (blockType === "thinking") {
                        controller.enqueue({
                          type: "reasoning-signature",
                          signature: value.delta.signature
                        });
                      }
                      return;
                    }
                    case "input_json_delta": {
                      const contentBlock = toolCallContentBlocks[value.index];
                      controller.enqueue({
                        type: "tool-call-delta",
                        toolCallType: "function",
                        toolCallId: contentBlock.toolCallId,
                        toolName: contentBlock.toolName,
                        argsTextDelta: value.delta.partial_json
                      });
                      contentBlock.jsonText += value.delta.partial_json;
                      return;
                    }
                    default: {
                      const _exhaustiveCheck = deltaType;
                      throw new Error(
                        `Unsupported delta type: ${_exhaustiveCheck}`
                      );
                    }
                  }
                }
                case "message_start": {
                  usage.promptTokens = value.message.usage.input_tokens;
                  usage.completionTokens = value.message.usage.output_tokens;
                  providerMetadata = {
                    anthropic: {
                      cacheCreationInputTokens: (_a = value.message.usage.cache_creation_input_tokens) != null ? _a : null,
                      cacheReadInputTokens: (_b = value.message.usage.cache_read_input_tokens) != null ? _b : null
                    }
                  };
                  controller.enqueue({
                    type: "response-metadata",
                    id: (_c = value.message.id) != null ? _c : void 0,
                    modelId: (_d = value.message.model) != null ? _d : void 0
                  });
                  return;
                }
                case "message_delta": {
                  usage.completionTokens = value.usage.output_tokens;
                  finishReason = mapAnthropicStopReason(value.delta.stop_reason);
                  return;
                }
                case "message_stop": {
                  controller.enqueue({
                    type: "finish",
                    finishReason,
                    usage,
                    providerMetadata
                  });
                  return;
                }
                case "error": {
                  controller.enqueue({ type: "error", error: value.error });
                  return;
                }
                default: {
                  const _exhaustiveCheck = value;
                  throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
                }
              }
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body: JSON.stringify(body) }
      };
    }
  };
  var anthropicMessagesResponseSchema = objectType({
    type: literalType("message"),
    id: stringType().nullish(),
    model: stringType().nullish(),
    content: arrayType(
      discriminatedUnionType("type", [
        objectType({
          type: literalType("text"),
          text: stringType()
        }),
        objectType({
          type: literalType("thinking"),
          thinking: stringType(),
          signature: stringType()
        }),
        objectType({
          type: literalType("redacted_thinking"),
          data: stringType()
        }),
        objectType({
          type: literalType("tool_use"),
          id: stringType(),
          name: stringType(),
          input: unknownType()
        })
      ])
    ),
    stop_reason: stringType().nullish(),
    usage: objectType({
      input_tokens: numberType(),
      output_tokens: numberType(),
      cache_creation_input_tokens: numberType().nullish(),
      cache_read_input_tokens: numberType().nullish()
    })
  });
  var anthropicMessagesChunkSchema = discriminatedUnionType("type", [
    objectType({
      type: literalType("message_start"),
      message: objectType({
        id: stringType().nullish(),
        model: stringType().nullish(),
        usage: objectType({
          input_tokens: numberType(),
          output_tokens: numberType(),
          cache_creation_input_tokens: numberType().nullish(),
          cache_read_input_tokens: numberType().nullish()
        })
      })
    }),
    objectType({
      type: literalType("content_block_start"),
      index: numberType(),
      content_block: discriminatedUnionType("type", [
        objectType({
          type: literalType("text"),
          text: stringType()
        }),
        objectType({
          type: literalType("thinking"),
          thinking: stringType()
        }),
        objectType({
          type: literalType("tool_use"),
          id: stringType(),
          name: stringType()
        }),
        objectType({
          type: literalType("redacted_thinking"),
          data: stringType()
        })
      ])
    }),
    objectType({
      type: literalType("content_block_delta"),
      index: numberType(),
      delta: discriminatedUnionType("type", [
        objectType({
          type: literalType("input_json_delta"),
          partial_json: stringType()
        }),
        objectType({
          type: literalType("text_delta"),
          text: stringType()
        }),
        objectType({
          type: literalType("thinking_delta"),
          thinking: stringType()
        }),
        objectType({
          type: literalType("signature_delta"),
          signature: stringType()
        })
      ])
    }),
    objectType({
      type: literalType("content_block_stop"),
      index: numberType()
    }),
    objectType({
      type: literalType("error"),
      error: objectType({
        type: stringType(),
        message: stringType()
      })
    }),
    objectType({
      type: literalType("message_delta"),
      delta: objectType({ stop_reason: stringType().nullish() }),
      usage: objectType({ output_tokens: numberType() })
    }),
    objectType({
      type: literalType("message_stop")
    }),
    objectType({
      type: literalType("ping")
    })
  ]);
  var anthropicProviderOptionsSchema = objectType({
    thinking: objectType({
      type: unionType([literalType("enabled"), literalType("disabled")]),
      budgetTokens: numberType().optional()
    }).optional()
  });
  var Bash20241022Parameters = objectType({
    command: stringType(),
    restart: booleanType().optional()
  });
  function bashTool_20241022(options = {}) {
    return {
      type: "provider-defined",
      id: "anthropic.bash_20241022",
      args: {},
      parameters: Bash20241022Parameters,
      execute: options.execute,
      experimental_toToolResultContent: options.experimental_toToolResultContent
    };
  }
  var Bash20250124Parameters = objectType({
    command: stringType(),
    restart: booleanType().optional()
  });
  function bashTool_20250124(options = {}) {
    return {
      type: "provider-defined",
      id: "anthropic.bash_20250124",
      args: {},
      parameters: Bash20250124Parameters,
      execute: options.execute,
      experimental_toToolResultContent: options.experimental_toToolResultContent
    };
  }
  var TextEditor20241022Parameters = objectType({
    command: enumType(["view", "create", "str_replace", "insert", "undo_edit"]),
    path: stringType(),
    file_text: stringType().optional(),
    insert_line: numberType().int().optional(),
    new_str: stringType().optional(),
    old_str: stringType().optional(),
    view_range: arrayType(numberType().int()).optional()
  });
  function textEditorTool_20241022(options = {}) {
    return {
      type: "provider-defined",
      id: "anthropic.text_editor_20241022",
      args: {},
      parameters: TextEditor20241022Parameters,
      execute: options.execute,
      experimental_toToolResultContent: options.experimental_toToolResultContent
    };
  }
  var TextEditor20250124Parameters = objectType({
    command: enumType(["view", "create", "str_replace", "insert", "undo_edit"]),
    path: stringType(),
    file_text: stringType().optional(),
    insert_line: numberType().int().optional(),
    new_str: stringType().optional(),
    old_str: stringType().optional(),
    view_range: arrayType(numberType().int()).optional()
  });
  function textEditorTool_20250124(options = {}) {
    return {
      type: "provider-defined",
      id: "anthropic.text_editor_20250124",
      args: {},
      parameters: TextEditor20250124Parameters,
      execute: options.execute,
      experimental_toToolResultContent: options.experimental_toToolResultContent
    };
  }
  var Computer20241022Parameters = objectType({
    action: enumType([
      "key",
      "type",
      "mouse_move",
      "left_click",
      "left_click_drag",
      "right_click",
      "middle_click",
      "double_click",
      "screenshot",
      "cursor_position"
    ]),
    coordinate: arrayType(numberType().int()).optional(),
    text: stringType().optional()
  });
  function computerTool_20241022(options) {
    return {
      type: "provider-defined",
      id: "anthropic.computer_20241022",
      args: {
        displayWidthPx: options.displayWidthPx,
        displayHeightPx: options.displayHeightPx,
        displayNumber: options.displayNumber
      },
      parameters: Computer20241022Parameters,
      execute: options.execute,
      experimental_toToolResultContent: options.experimental_toToolResultContent
    };
  }
  var Computer20250124Parameters = objectType({
    action: enumType([
      "key",
      "hold_key",
      "type",
      "cursor_position",
      "mouse_move",
      "left_mouse_down",
      "left_mouse_up",
      "left_click",
      "left_click_drag",
      "right_click",
      "middle_click",
      "double_click",
      "triple_click",
      "scroll",
      "wait",
      "screenshot"
    ]),
    coordinate: tupleType([numberType().int(), numberType().int()]).optional(),
    duration: numberType().optional(),
    scroll_amount: numberType().optional(),
    scroll_direction: enumType(["up", "down", "left", "right"]).optional(),
    start_coordinate: tupleType([numberType().int(), numberType().int()]).optional(),
    text: stringType().optional()
  });
  function computerTool_20250124(options) {
    return {
      type: "provider-defined",
      id: "anthropic.computer_20250124",
      args: {
        displayWidthPx: options.displayWidthPx,
        displayHeightPx: options.displayHeightPx,
        displayNumber: options.displayNumber
      },
      parameters: Computer20250124Parameters,
      execute: options.execute,
      experimental_toToolResultContent: options.experimental_toToolResultContent
    };
  }
  var anthropicTools = {
    bash_20241022: bashTool_20241022,
    bash_20250124: bashTool_20250124,
    textEditor_20241022: textEditorTool_20241022,
    textEditor_20250124: textEditorTool_20250124,
    computer_20241022: computerTool_20241022,
    computer_20250124: computerTool_20250124
  };

  // src/anthropic-provider.ts
  function createAnthropic(options = {}) {
    var _a;
    const baseURL = (_a = withoutTrailingSlash(options.baseURL)) != null ? _a : "https://api.anthropic.com/v1";
    const getHeaders = () => ({
      "anthropic-version": "2023-06-01",
      "x-api-key": loadApiKey({
        apiKey: options.apiKey,
        environmentVariableName: "ANTHROPIC_API_KEY",
        description: "Anthropic"
      }),
      ...options.headers
    });
    const createChatModel = (modelId, settings = {}) => new AnthropicMessagesLanguageModel(modelId, settings, {
      provider: "anthropic.messages",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      supportsImageUrls: true
    });
    const provider = function(modelId, settings) {
      if (new.target) {
        throw new Error(
          "The Anthropic model function cannot be called with the new keyword."
        );
      }
      return createChatModel(modelId, settings);
    };
    provider.languageModel = createChatModel;
    provider.chat = createChatModel;
    provider.messages = createChatModel;
    provider.textEmbeddingModel = (modelId) => {
      throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
    };
    provider.tools = anthropicTools;
    return provider;
  }
  createAnthropic();

  // src/openai-compatible-chat-language-model.ts
  function getOpenAIMetadata(message) {
    var _a, _b;
    return (_b = (_a = message == null ? void 0 : message.providerMetadata) == null ? void 0 : _a.openaiCompatible) != null ? _b : {};
  }
  function convertToOpenAICompatibleChatMessages(prompt) {
    const messages = [];
    for (const { role, content, ...message } of prompt) {
      const metadata = getOpenAIMetadata({ ...message });
      switch (role) {
        case "system": {
          messages.push({ role: "system", content, ...metadata });
          break;
        }
        case "user": {
          if (content.length === 1 && content[0].type === "text") {
            messages.push({
              role: "user",
              content: content[0].text,
              ...getOpenAIMetadata(content[0])
            });
            break;
          }
          messages.push({
            role: "user",
            content: content.map((part) => {
              var _a;
              const partMetadata = getOpenAIMetadata(part);
              switch (part.type) {
                case "text": {
                  return { type: "text", text: part.text, ...partMetadata };
                }
                case "image": {
                  return {
                    type: "image_url",
                    image_url: {
                      url: part.image instanceof URL ? part.image.toString() : `data:${(_a = part.mimeType) != null ? _a : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`
                    },
                    ...partMetadata
                  };
                }
                case "file": {
                  throw new UnsupportedFunctionalityError({
                    functionality: "File content parts in user messages"
                  });
                }
              }
            }),
            ...metadata
          });
          break;
        }
        case "assistant": {
          let text = "";
          const toolCalls = [];
          for (const part of content) {
            const partMetadata = getOpenAIMetadata(part);
            switch (part.type) {
              case "text": {
                text += part.text;
                break;
              }
              case "tool-call": {
                toolCalls.push({
                  id: part.toolCallId,
                  type: "function",
                  function: {
                    name: part.toolName,
                    arguments: JSON.stringify(part.args)
                  },
                  ...partMetadata
                });
                break;
              }
            }
          }
          messages.push({
            role: "assistant",
            content: text,
            tool_calls: toolCalls.length > 0 ? toolCalls : void 0,
            ...metadata
          });
          break;
        }
        case "tool": {
          for (const toolResponse of content) {
            const toolResponseMetadata = getOpenAIMetadata(toolResponse);
            messages.push({
              role: "tool",
              tool_call_id: toolResponse.toolCallId,
              content: JSON.stringify(toolResponse.result),
              ...toolResponseMetadata
            });
          }
          break;
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    return messages;
  }

  // src/get-response-metadata.ts
  function getResponseMetadata$1({
    id,
    model,
    created
  }) {
    return {
      id: id != null ? id : void 0,
      modelId: model != null ? model : void 0,
      timestamp: created != null ? new Date(created * 1e3) : void 0
    };
  }

  // src/map-openai-compatible-finish-reason.ts
  function mapOpenAICompatibleFinishReason(finishReason) {
    switch (finishReason) {
      case "stop":
        return "stop";
      case "length":
        return "length";
      case "content_filter":
        return "content-filter";
      case "function_call":
      case "tool_calls":
        return "tool-calls";
      default:
        return "unknown";
    }
  }
  var openaiCompatibleErrorDataSchema = objectType({
    error: objectType({
      message: stringType(),
      // The additional information below is handled loosely to support
      // OpenAI-compatible providers that have slightly different error
      // responses:
      type: stringType().nullish(),
      param: anyType().nullish(),
      code: unionType([stringType(), numberType()]).nullish()
    })
  });
  var defaultOpenAICompatibleErrorStructure = {
    errorSchema: openaiCompatibleErrorDataSchema,
    errorToMessage: (data) => data.error.message
  };
  function prepareTools$1({
    mode,
    structuredOutputs
  }) {
    var _a;
    const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
    const toolWarnings = [];
    if (tools == null) {
      return { tools: void 0, tool_choice: void 0, toolWarnings };
    }
    const toolChoice = mode.toolChoice;
    const openaiCompatTools = [];
    for (const tool of tools) {
      if (tool.type === "provider-defined") {
        toolWarnings.push({ type: "unsupported-tool", tool });
      } else {
        openaiCompatTools.push({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
          }
        });
      }
    }
    if (toolChoice == null) {
      return { tools: openaiCompatTools, tool_choice: void 0, toolWarnings };
    }
    const type = toolChoice.type;
    switch (type) {
      case "auto":
      case "none":
      case "required":
        return { tools: openaiCompatTools, tool_choice: type, toolWarnings };
      case "tool":
        return {
          tools: openaiCompatTools,
          tool_choice: {
            type: "function",
            function: {
              name: toolChoice.toolName
            }
          },
          toolWarnings
        };
      default: {
        const _exhaustiveCheck = type;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
        });
      }
    }
  }

  // src/openai-compatible-chat-language-model.ts
  var OpenAICompatibleChatLanguageModel = class {
    // type inferred via constructor
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      var _a, _b;
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
      const errorStructure = (_a = config.errorStructure) != null ? _a : defaultOpenAICompatibleErrorStructure;
      this.chunkSchema = createOpenAICompatibleChatChunkSchema(
        errorStructure.errorSchema
      );
      this.failedResponseHandler = createJsonErrorResponseHandler(errorStructure);
      this.supportsStructuredOutputs = (_b = config.supportsStructuredOutputs) != null ? _b : false;
    }
    get defaultObjectGenerationMode() {
      return this.config.defaultObjectGenerationMode;
    }
    get provider() {
      return this.config.provider;
    }
    get providerOptionsName() {
      return this.config.provider.split(".")[0].trim();
    }
    getArgs({
      mode,
      prompt,
      maxTokens,
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      providerMetadata,
      stopSequences,
      responseFormat,
      seed
    }) {
      var _a, _b, _c, _d, _e;
      const type = mode.type;
      const warnings = [];
      if (topK != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "topK"
        });
      }
      if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
        warnings.push({
          type: "unsupported-setting",
          setting: "responseFormat",
          details: "JSON response format schema is only supported with structuredOutputs"
        });
      }
      const baseArgs = {
        // model id:
        model: this.modelId,
        // model specific settings:
        user: this.settings.user,
        // standardized settings:
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs === true && responseFormat.schema != null ? {
          type: "json_schema",
          json_schema: {
            schema: responseFormat.schema,
            name: (_a = responseFormat.name) != null ? _a : "response",
            description: responseFormat.description
          }
        } : { type: "json_object" } : void 0,
        stop: stopSequences,
        seed,
        ...providerMetadata == null ? void 0 : providerMetadata[this.providerOptionsName],
        reasoning_effort: (_d = (_b = providerMetadata == null ? void 0 : providerMetadata[this.providerOptionsName]) == null ? void 0 : _b.reasoningEffort) != null ? _d : (_c = providerMetadata == null ? void 0 : providerMetadata["openai-compatible"]) == null ? void 0 : _c.reasoningEffort,
        // messages:
        messages: convertToOpenAICompatibleChatMessages(prompt)
      };
      switch (type) {
        case "regular": {
          const { tools, tool_choice, toolWarnings } = prepareTools$1({
            mode,
            structuredOutputs: this.supportsStructuredOutputs
          });
          return {
            args: { ...baseArgs, tools, tool_choice },
            warnings: [...warnings, ...toolWarnings]
          };
        }
        case "object-json": {
          return {
            args: {
              ...baseArgs,
              response_format: this.supportsStructuredOutputs === true && mode.schema != null ? {
                type: "json_schema",
                json_schema: {
                  schema: mode.schema,
                  name: (_e = mode.name) != null ? _e : "response",
                  description: mode.description
                }
              } : { type: "json_object" }
            },
            warnings
          };
        }
        case "object-tool": {
          return {
            args: {
              ...baseArgs,
              tool_choice: {
                type: "function",
                function: { name: mode.tool.name }
              },
              tools: [
                {
                  type: "function",
                  function: {
                    name: mode.tool.name,
                    description: mode.tool.description,
                    parameters: mode.tool.parameters
                  }
                }
              ]
            },
            warnings
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    async doGenerate(options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const { args, warnings } = this.getArgs({ ...options });
      const body = JSON.stringify(args);
      const {
        responseHeaders,
        value: responseBody,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: this.failedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          OpenAICompatibleChatResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      const choice = responseBody.choices[0];
      const providerMetadata = {
        [this.providerOptionsName]: {},
        ...(_b = (_a = this.config.metadataExtractor) == null ? void 0 : _a.extractMetadata) == null ? void 0 : _b.call(_a, {
          parsedBody: rawResponse
        })
      };
      const completionTokenDetails = (_c = responseBody.usage) == null ? void 0 : _c.completion_tokens_details;
      const promptTokenDetails = (_d = responseBody.usage) == null ? void 0 : _d.prompt_tokens_details;
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens) != null) {
        providerMetadata[this.providerOptionsName].reasoningTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
        providerMetadata[this.providerOptionsName].acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
      }
      if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
        providerMetadata[this.providerOptionsName].rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
      }
      if ((promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens) != null) {
        providerMetadata[this.providerOptionsName].cachedPromptTokens = promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens;
      }
      return {
        text: (_e = choice.message.content) != null ? _e : void 0,
        reasoning: (_f = choice.message.reasoning_content) != null ? _f : void 0,
        toolCalls: (_g = choice.message.tool_calls) == null ? void 0 : _g.map((toolCall) => {
          var _a2;
          return {
            toolCallType: "function",
            toolCallId: (_a2 = toolCall.id) != null ? _a2 : generateId(),
            toolName: toolCall.function.name,
            args: toolCall.function.arguments
          };
        }),
        finishReason: mapOpenAICompatibleFinishReason(choice.finish_reason),
        usage: {
          promptTokens: (_i = (_h = responseBody.usage) == null ? void 0 : _h.prompt_tokens) != null ? _i : NaN,
          completionTokens: (_k = (_j = responseBody.usage) == null ? void 0 : _j.completion_tokens) != null ? _k : NaN
        },
        providerMetadata,
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        response: getResponseMetadata$1(responseBody),
        warnings,
        request: { body }
      };
    }
    async doStream(options) {
      var _a;
      if (this.settings.simulateStreaming) {
        const result = await this.doGenerate(options);
        const simulatedStream = new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "response-metadata", ...result.response });
            if (result.reasoning) {
              if (Array.isArray(result.reasoning)) {
                for (const part of result.reasoning) {
                  if (part.type === "text") {
                    controller.enqueue({
                      type: "reasoning",
                      textDelta: part.text
                    });
                  }
                }
              } else {
                controller.enqueue({
                  type: "reasoning",
                  textDelta: result.reasoning
                });
              }
            }
            if (result.text) {
              controller.enqueue({
                type: "text-delta",
                textDelta: result.text
              });
            }
            if (result.toolCalls) {
              for (const toolCall of result.toolCalls) {
                controller.enqueue({
                  type: "tool-call",
                  ...toolCall
                });
              }
            }
            controller.enqueue({
              type: "finish",
              finishReason: result.finishReason,
              usage: result.usage,
              logprobs: result.logprobs,
              providerMetadata: result.providerMetadata
            });
            controller.close();
          }
        });
        return {
          stream: simulatedStream,
          rawCall: result.rawCall,
          rawResponse: result.rawResponse,
          warnings: result.warnings
        };
      }
      const { args, warnings } = this.getArgs({ ...options });
      const body = {
        ...args,
        stream: true,
        // only include stream_options when in strict compatibility mode:
        stream_options: this.config.includeUsage ? { include_usage: true } : void 0
      };
      const metadataExtractor = (_a = this.config.metadataExtractor) == null ? void 0 : _a.createStreamExtractor();
      const { responseHeaders, value: response } = await postJsonToApi({
        url: this.config.url({
          path: "/chat/completions",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: this.failedResponseHandler,
        successfulResponseHandler: createEventSourceResponseHandler(
          this.chunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      const toolCalls = [];
      let finishReason = "unknown";
      let usage = {
        completionTokens: void 0,
        completionTokensDetails: {
          reasoningTokens: void 0,
          acceptedPredictionTokens: void 0,
          rejectedPredictionTokens: void 0
        },
        promptTokens: void 0,
        promptTokensDetails: {
          cachedTokens: void 0
        }
      };
      let isFirstChunk = true;
      let providerOptionsName = this.providerOptionsName;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            // TODO we lost type safety on Chunk, most likely due to the error schema. MUST FIX
            transform(chunk, controller) {
              var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
              if (!chunk.success) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              metadataExtractor == null ? void 0 : metadataExtractor.processChunk(chunk.rawValue);
              if ("error" in value) {
                finishReason = "error";
                controller.enqueue({ type: "error", error: value.error.message });
                return;
              }
              if (isFirstChunk) {
                isFirstChunk = false;
                controller.enqueue({
                  type: "response-metadata",
                  ...getResponseMetadata$1(value)
                });
              }
              if (value.usage != null) {
                const {
                  prompt_tokens,
                  completion_tokens,
                  prompt_tokens_details,
                  completion_tokens_details
                } = value.usage;
                usage.promptTokens = prompt_tokens != null ? prompt_tokens : void 0;
                usage.completionTokens = completion_tokens != null ? completion_tokens : void 0;
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens) != null) {
                  usage.completionTokensDetails.reasoningTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens) != null) {
                  usage.completionTokensDetails.acceptedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens;
                }
                if ((completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens) != null) {
                  usage.completionTokensDetails.rejectedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens;
                }
                if ((prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens) != null) {
                  usage.promptTokensDetails.cachedTokens = prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens;
                }
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapOpenAICompatibleFinishReason(
                  choice.finish_reason
                );
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              if (delta.reasoning_content != null) {
                controller.enqueue({
                  type: "reasoning",
                  textDelta: delta.reasoning_content
                });
              }
              if (delta.content != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: delta.content
                });
              }
              if (delta.tool_calls != null) {
                for (const toolCallDelta of delta.tool_calls) {
                  const index = toolCallDelta.index;
                  if (toolCalls[index] == null) {
                    if (toolCallDelta.type !== "function") {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function' type.`
                      });
                    }
                    if (toolCallDelta.id == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'id' to be a string.`
                      });
                    }
                    if (((_a2 = toolCallDelta.function) == null ? void 0 : _a2.name) == null) {
                      throw new InvalidResponseDataError({
                        data: toolCallDelta,
                        message: `Expected 'function.name' to be a string.`
                      });
                    }
                    toolCalls[index] = {
                      id: toolCallDelta.id,
                      type: "function",
                      function: {
                        name: toolCallDelta.function.name,
                        arguments: (_b = toolCallDelta.function.arguments) != null ? _b : ""
                      },
                      hasFinished: false
                    };
                    const toolCall2 = toolCalls[index];
                    if (((_c = toolCall2.function) == null ? void 0 : _c.name) != null && ((_d = toolCall2.function) == null ? void 0 : _d.arguments) != null) {
                      if (toolCall2.function.arguments.length > 0) {
                        controller.enqueue({
                          type: "tool-call-delta",
                          toolCallType: "function",
                          toolCallId: toolCall2.id,
                          toolName: toolCall2.function.name,
                          argsTextDelta: toolCall2.function.arguments
                        });
                      }
                      if (isParsableJson(toolCall2.function.arguments)) {
                        controller.enqueue({
                          type: "tool-call",
                          toolCallType: "function",
                          toolCallId: (_e = toolCall2.id) != null ? _e : generateId(),
                          toolName: toolCall2.function.name,
                          args: toolCall2.function.arguments
                        });
                        toolCall2.hasFinished = true;
                      }
                    }
                    continue;
                  }
                  const toolCall = toolCalls[index];
                  if (toolCall.hasFinished) {
                    continue;
                  }
                  if (((_f = toolCallDelta.function) == null ? void 0 : _f.arguments) != null) {
                    toolCall.function.arguments += (_h = (_g = toolCallDelta.function) == null ? void 0 : _g.arguments) != null ? _h : "";
                  }
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    argsTextDelta: (_i = toolCallDelta.function.arguments) != null ? _i : ""
                  });
                  if (((_j = toolCall.function) == null ? void 0 : _j.name) != null && ((_k = toolCall.function) == null ? void 0 : _k.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                    controller.enqueue({
                      type: "tool-call",
                      toolCallType: "function",
                      toolCallId: (_l = toolCall.id) != null ? _l : generateId(),
                      toolName: toolCall.function.name,
                      args: toolCall.function.arguments
                    });
                    toolCall.hasFinished = true;
                  }
                }
              }
            },
            flush(controller) {
              var _a2, _b;
              const providerMetadata = {
                [providerOptionsName]: {},
                ...metadataExtractor == null ? void 0 : metadataExtractor.buildMetadata()
              };
              if (usage.completionTokensDetails.reasoningTokens != null) {
                providerMetadata[providerOptionsName].reasoningTokens = usage.completionTokensDetails.reasoningTokens;
              }
              if (usage.completionTokensDetails.acceptedPredictionTokens != null) {
                providerMetadata[providerOptionsName].acceptedPredictionTokens = usage.completionTokensDetails.acceptedPredictionTokens;
              }
              if (usage.completionTokensDetails.rejectedPredictionTokens != null) {
                providerMetadata[providerOptionsName].rejectedPredictionTokens = usage.completionTokensDetails.rejectedPredictionTokens;
              }
              if (usage.promptTokensDetails.cachedTokens != null) {
                providerMetadata[providerOptionsName].cachedPromptTokens = usage.promptTokensDetails.cachedTokens;
              }
              controller.enqueue({
                type: "finish",
                finishReason,
                usage: {
                  promptTokens: (_a2 = usage.promptTokens) != null ? _a2 : NaN,
                  completionTokens: (_b = usage.completionTokens) != null ? _b : NaN
                },
                providerMetadata
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        warnings,
        request: { body: JSON.stringify(body) }
      };
    }
  };
  var openaiCompatibleTokenUsageSchema = objectType({
    prompt_tokens: numberType().nullish(),
    completion_tokens: numberType().nullish(),
    prompt_tokens_details: objectType({
      cached_tokens: numberType().nullish()
    }).nullish(),
    completion_tokens_details: objectType({
      reasoning_tokens: numberType().nullish(),
      accepted_prediction_tokens: numberType().nullish(),
      rejected_prediction_tokens: numberType().nullish()
    }).nullish()
  }).nullish();
  var OpenAICompatibleChatResponseSchema = objectType({
    id: stringType().nullish(),
    created: numberType().nullish(),
    model: stringType().nullish(),
    choices: arrayType(
      objectType({
        message: objectType({
          role: literalType("assistant").nullish(),
          content: stringType().nullish(),
          reasoning_content: stringType().nullish(),
          tool_calls: arrayType(
            objectType({
              id: stringType().nullish(),
              type: literalType("function"),
              function: objectType({
                name: stringType(),
                arguments: stringType()
              })
            })
          ).nullish()
        }),
        finish_reason: stringType().nullish()
      })
    ),
    usage: openaiCompatibleTokenUsageSchema
  });
  var createOpenAICompatibleChatChunkSchema = (errorSchema) => unionType([
    objectType({
      id: stringType().nullish(),
      created: numberType().nullish(),
      model: stringType().nullish(),
      choices: arrayType(
        objectType({
          delta: objectType({
            role: enumType(["assistant"]).nullish(),
            content: stringType().nullish(),
            reasoning_content: stringType().nullish(),
            tool_calls: arrayType(
              objectType({
                index: numberType().optional(),
                id: stringType().nullish(),
                type: literalType("function").nullish(),
                function: objectType({
                  name: stringType().nullish(),
                  arguments: stringType().nullish()
                })
              })
            ).nullish()
          }).nullish(),
          finish_reason: stringType().nullish()
        })
      ),
      usage: openaiCompatibleTokenUsageSchema
    }),
    errorSchema
  ]);
  objectType({
    id: stringType().nullish(),
    created: numberType().nullish(),
    model: stringType().nullish(),
    choices: arrayType(
      objectType({
        text: stringType(),
        finish_reason: stringType()
      })
    ),
    usage: objectType({
      prompt_tokens: numberType(),
      completion_tokens: numberType()
    }).nullish()
  });
  objectType({
    data: arrayType(objectType({ embedding: arrayType(numberType()) })),
    usage: objectType({ prompt_tokens: numberType() }).nullish()
  });
  var OpenAICompatibleImageModel = class {
    constructor(modelId, settings, config) {
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
      this.specificationVersion = "v1";
    }
    get maxImagesPerCall() {
      var _a;
      return (_a = this.settings.maxImagesPerCall) != null ? _a : 10;
    }
    get provider() {
      return this.config.provider;
    }
    async doGenerate({
      prompt,
      n,
      size,
      aspectRatio,
      seed,
      providerOptions,
      headers,
      abortSignal
    }) {
      var _a, _b, _c, _d, _e;
      const warnings = [];
      if (aspectRatio != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "aspectRatio",
          details: "This model does not support aspect ratio. Use `size` instead."
        });
      }
      if (seed != null) {
        warnings.push({ type: "unsupported-setting", setting: "seed" });
      }
      const currentDate = (_c = (_b = (_a = this.config._internal) == null ? void 0 : _a.currentDate) == null ? void 0 : _b.call(_a)) != null ? _c : /* @__PURE__ */ new Date();
      const { value: response, responseHeaders } = await postJsonToApi({
        url: this.config.url({
          path: "/images/generations",
          modelId: this.modelId
        }),
        headers: combineHeaders(this.config.headers(), headers),
        body: {
          model: this.modelId,
          prompt,
          n,
          size,
          ...(_d = providerOptions.openai) != null ? _d : {},
          response_format: "b64_json",
          ...this.settings.user ? { user: this.settings.user } : {}
        },
        failedResponseHandler: createJsonErrorResponseHandler(
          (_e = this.config.errorStructure) != null ? _e : defaultOpenAICompatibleErrorStructure
        ),
        successfulResponseHandler: createJsonResponseHandler(
          openaiCompatibleImageResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        images: response.data.map((item) => item.b64_json),
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders
        }
      };
    }
  };
  var openaiCompatibleImageResponseSchema = objectType({
    data: arrayType(objectType({ b64_json: stringType() }))
  });

  // src/xai-provider.ts

  // src/xai-chat-settings.ts
  function supportsStructuredOutputs(modelId) {
    return [
      "grok-3",
      "grok-3-beta",
      "grok-3-latest",
      "grok-3-fast",
      "grok-3-fast-beta",
      "grok-3-fast-latest",
      "grok-3-mini",
      "grok-3-mini-beta",
      "grok-3-mini-latest",
      "grok-3-mini-fast",
      "grok-3-mini-fast-beta",
      "grok-3-mini-fast-latest",
      "grok-2-1212",
      "grok-2-vision-1212"
    ].includes(modelId);
  }
  var xaiErrorSchema = objectType({
    code: stringType(),
    error: stringType()
  });

  // src/xai-provider.ts
  var xaiErrorStructure = {
    errorSchema: xaiErrorSchema,
    errorToMessage: (data) => data.error
  };
  function createXai(options = {}) {
    var _a;
    const baseURL = withoutTrailingSlash(
      (_a = options.baseURL) != null ? _a : "https://api.x.ai/v1"
    );
    const getHeaders = () => ({
      Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "XAI_API_KEY",
      description: "xAI API key"
    })}`,
      ...options.headers
    });
    const createLanguageModel = (modelId, settings = {}) => {
      const structuredOutputs = supportsStructuredOutputs(modelId);
      return new OpenAICompatibleChatLanguageModel(modelId, settings, {
        provider: "xai.chat",
        url: ({ path }) => `${baseURL}${path}`,
        headers: getHeaders,
        fetch: options.fetch,
        defaultObjectGenerationMode: structuredOutputs ? "json" : "tool",
        errorStructure: xaiErrorStructure,
        supportsStructuredOutputs: structuredOutputs,
        includeUsage: true
      });
    };
    const createImageModel = (modelId, settings = {}) => {
      return new OpenAICompatibleImageModel(modelId, settings, {
        provider: "xai.image",
        url: ({ path }) => `${baseURL}${path}`,
        headers: getHeaders,
        fetch: options.fetch,
        errorStructure: xaiErrorStructure
      });
    };
    const provider = (modelId, settings) => createLanguageModel(modelId, settings);
    provider.languageModel = createLanguageModel;
    provider.chat = createLanguageModel;
    provider.textEmbeddingModel = (modelId) => {
      throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
    };
    provider.imageModel = createImageModel;
    provider.image = createImageModel;
    return provider;
  }
  var xai = createXai();

  // src/perplexity-provider.ts
  function convertToPerplexityMessages(prompt) {
    const messages = [];
    for (const { role, content } of prompt) {
      switch (role) {
        case "system": {
          messages.push({ role: "system", content });
          break;
        }
        case "user":
        case "assistant": {
          messages.push({
            role,
            content: content.filter(
              (part) => part.type !== "reasoning" && part.type !== "redacted-reasoning"
            ).map((part) => {
              switch (part.type) {
                case "text": {
                  return part.text;
                }
                case "image": {
                  throw new UnsupportedFunctionalityError({
                    functionality: "Image content parts in user messages"
                  });
                }
                case "file": {
                  throw new UnsupportedFunctionalityError({
                    functionality: "File content parts in user messages"
                  });
                }
                case "tool-call": {
                  throw new UnsupportedFunctionalityError({
                    functionality: "Tool calls in assistant messages"
                  });
                }
                default: {
                  const _exhaustiveCheck = part;
                  throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
                }
              }
            }).join("")
          });
          break;
        }
        case "tool": {
          throw new UnsupportedFunctionalityError({
            functionality: "Tool messages"
          });
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    return messages;
  }

  // src/map-perplexity-finish-reason.ts
  function mapPerplexityFinishReason(finishReason) {
    switch (finishReason) {
      case "stop":
      case "length":
        return finishReason;
      default:
        return "unknown";
    }
  }

  // src/perplexity-language-model.ts
  var PerplexityLanguageModel = class {
    constructor(modelId, config) {
      this.specificationVersion = "v1";
      this.defaultObjectGenerationMode = "json";
      this.supportsStructuredOutputs = true;
      this.supportsImageUrls = false;
      this.provider = "perplexity";
      this.modelId = modelId;
      this.config = config;
    }
    getArgs({
      mode,
      prompt,
      maxTokens,
      temperature,
      topP,
      topK,
      frequencyPenalty,
      presencePenalty,
      stopSequences,
      responseFormat,
      seed,
      providerMetadata
    }) {
      var _a;
      const type = mode.type;
      const warnings = [];
      if (topK != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "topK"
        });
      }
      if (stopSequences != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "stopSequences"
        });
      }
      if (seed != null) {
        warnings.push({
          type: "unsupported-setting",
          setting: "seed"
        });
      }
      const baseArgs = {
        // model id:
        model: this.modelId,
        // standardized settings:
        frequency_penalty: frequencyPenalty,
        max_tokens: maxTokens,
        presence_penalty: presencePenalty,
        temperature,
        top_k: topK,
        top_p: topP,
        // response format:
        response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? {
          type: "json_schema",
          json_schema: { schema: responseFormat.schema }
        } : void 0,
        // provider extensions
        ...(_a = providerMetadata == null ? void 0 : providerMetadata.perplexity) != null ? _a : {},
        // messages:
        messages: convertToPerplexityMessages(prompt)
      };
      switch (type) {
        case "regular": {
          return { args: baseArgs, warnings };
        }
        case "object-json": {
          return {
            args: {
              ...baseArgs,
              response_format: {
                type: "json_schema",
                json_schema: { schema: mode.schema }
              }
            },
            warnings
          };
        }
        case "object-tool": {
          throw new UnsupportedFunctionalityError({
            functionality: "tool-mode object generation"
          });
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    async doGenerate(options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const { args, warnings } = this.getArgs(options);
      const {
        responseHeaders,
        value: response,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: `${this.config.baseURL}/chat/completions`,
        headers: combineHeaders(this.config.headers(), options.headers),
        body: args,
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: perplexityErrorSchema,
          errorToMessage
        }),
        successfulResponseHandler: createJsonResponseHandler(
          perplexityResponseSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      const choice = response.choices[0];
      const text = choice.message.content;
      return {
        text,
        toolCalls: [],
        finishReason: mapPerplexityFinishReason(choice.finish_reason),
        usage: {
          promptTokens: (_b = (_a = response.usage) == null ? void 0 : _a.prompt_tokens) != null ? _b : Number.NaN,
          completionTokens: (_d = (_c = response.usage) == null ? void 0 : _c.completion_tokens) != null ? _d : Number.NaN
        },
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders, body: rawResponse },
        request: { body: JSON.stringify(args) },
        response: getResponseMetadata(response),
        warnings,
        sources: (_e = response.citations) == null ? void 0 : _e.map((url) => ({
          sourceType: "url",
          id: this.config.generateId(),
          url
        })),
        providerMetadata: {
          perplexity: {
            images: (_g = (_f = response.images) == null ? void 0 : _f.map((image) => ({
              imageUrl: image.image_url,
              originUrl: image.origin_url,
              height: image.height,
              width: image.width
            }))) != null ? _g : null,
            usage: {
              citationTokens: (_i = (_h = response.usage) == null ? void 0 : _h.citation_tokens) != null ? _i : null,
              numSearchQueries: (_k = (_j = response.usage) == null ? void 0 : _j.num_search_queries) != null ? _k : null
            }
          }
        }
      };
    }
    async doStream(options) {
      const { args, warnings } = this.getArgs(options);
      const body = { ...args, stream: true };
      const { responseHeaders, value: response } = await postJsonToApi({
        url: `${this.config.baseURL}/chat/completions`,
        headers: combineHeaders(this.config.headers(), options.headers),
        body,
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: perplexityErrorSchema,
          errorToMessage
        }),
        successfulResponseHandler: createEventSourceResponseHandler(
          perplexityChunkSchema
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch
      });
      const { messages: rawPrompt, ...rawSettings } = args;
      let finishReason = "unknown";
      let usage = {
        promptTokens: Number.NaN,
        completionTokens: Number.NaN
      };
      const providerMetadata = {
        perplexity: {
          usage: {
            citationTokens: null,
            numSearchQueries: null
          },
          images: null
        }
      };
      let isFirstChunk = true;
      const self = this;
      return {
        stream: response.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              var _a, _b, _c;
              if (!chunk.success) {
                controller.enqueue({ type: "error", error: chunk.error });
                return;
              }
              const value = chunk.value;
              if (isFirstChunk) {
                controller.enqueue({
                  type: "response-metadata",
                  ...getResponseMetadata(value)
                });
                (_a = value.citations) == null ? void 0 : _a.forEach((url) => {
                  controller.enqueue({
                    type: "source",
                    source: {
                      sourceType: "url",
                      id: self.config.generateId(),
                      url
                    }
                  });
                });
                isFirstChunk = false;
              }
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens
                };
                providerMetadata.perplexity.usage = {
                  citationTokens: (_b = value.usage.citation_tokens) != null ? _b : null,
                  numSearchQueries: (_c = value.usage.num_search_queries) != null ? _c : null
                };
              }
              if (value.images != null) {
                providerMetadata.perplexity.images = value.images.map((image) => ({
                  imageUrl: image.image_url,
                  originUrl: image.origin_url,
                  height: image.height,
                  width: image.width
                }));
              }
              const choice = value.choices[0];
              if ((choice == null ? void 0 : choice.finish_reason) != null) {
                finishReason = mapPerplexityFinishReason(choice.finish_reason);
              }
              if ((choice == null ? void 0 : choice.delta) == null) {
                return;
              }
              const delta = choice.delta;
              const textContent = delta.content;
              if (textContent != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: textContent
                });
              }
            },
            flush(controller) {
              controller.enqueue({
                type: "finish",
                finishReason,
                usage,
                providerMetadata
              });
            }
          })
        ),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        warnings
      };
    }
  };
  function getResponseMetadata({
    id,
    model,
    created
  }) {
    return {
      id,
      modelId: model,
      timestamp: new Date(created * 1e3)
    };
  }
  var perplexityUsageSchema = objectType({
    prompt_tokens: numberType(),
    completion_tokens: numberType(),
    citation_tokens: numberType().nullish(),
    num_search_queries: numberType().nullish()
  });
  var perplexityImageSchema = objectType({
    image_url: stringType(),
    origin_url: stringType(),
    height: numberType(),
    width: numberType()
  });
  var perplexityResponseSchema = objectType({
    id: stringType(),
    created: numberType(),
    model: stringType(),
    choices: arrayType(
      objectType({
        message: objectType({
          role: literalType("assistant"),
          content: stringType()
        }),
        finish_reason: stringType().nullish()
      })
    ),
    citations: arrayType(stringType()).nullish(),
    images: arrayType(perplexityImageSchema).nullish(),
    usage: perplexityUsageSchema.nullish()
  });
  var perplexityChunkSchema = objectType({
    id: stringType(),
    created: numberType(),
    model: stringType(),
    choices: arrayType(
      objectType({
        delta: objectType({
          role: literalType("assistant"),
          content: stringType()
        }),
        finish_reason: stringType().nullish()
      })
    ),
    citations: arrayType(stringType()).nullish(),
    images: arrayType(perplexityImageSchema).nullish(),
    usage: perplexityUsageSchema.nullish()
  });
  var perplexityErrorSchema = objectType({
    error: objectType({
      code: numberType(),
      message: stringType().nullish(),
      type: stringType().nullish()
    })
  });
  var errorToMessage = (data) => {
    var _a, _b;
    return (_b = (_a = data.error.message) != null ? _a : data.error.type) != null ? _b : "unknown error";
  };

  // src/perplexity-provider.ts
  function createPerplexity(options = {}) {
    const getHeaders = () => ({
      Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "PERPLEXITY_API_KEY",
      description: "Perplexity"
    })}`,
      ...options.headers
    });
    const createLanguageModel = (modelId) => {
      var _a;
      return new PerplexityLanguageModel(modelId, {
        baseURL: withoutTrailingSlash(
          (_a = options.baseURL) != null ? _a : "https://api.perplexity.ai"
        ),
        headers: getHeaders,
        generateId,
        fetch: options.fetch
      });
    };
    const provider = (modelId) => createLanguageModel(modelId);
    provider.languageModel = createLanguageModel;
    provider.textEmbeddingModel = (modelId) => {
      throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
    };
    return provider;
  }
  createPerplexity();

  var dist = {};

  var options = {};

  (function (exports) {
  	/**
  	 * Sometimes you don't allow every type to be partially parsed.
  	 * For example, you may not want a partial number because it may increase its size gradually before it's complete.
  	 * In this case, you can use the `Allow` object to control what types you allow to be partially parsed.
  	 * @module
  	 */
  	Object.defineProperty(exports, "__esModule", { value: true });
  	exports.Allow = exports.ALL = exports.COLLECTION = exports.ATOM = exports.SPECIAL = exports.INF = exports._INFINITY = exports.INFINITY = exports.NAN = exports.BOOL = exports.NULL = exports.OBJ = exports.ARR = exports.NUM = exports.STR = void 0;
  	/**
  	 * allow partial strings like `"hello \u12` to be parsed as `"hello "`
  	 */
  	exports.STR = 0b000000001;
  	/**
  	 * allow partial numbers like `123.` to be parsed as `123`
  	 */
  	exports.NUM = 0b000000010;
  	/**
  	 * allow partial arrays like `[1, 2,` to be parsed as `[1, 2]`
  	 */
  	exports.ARR = 0b000000100;
  	/**
  	 * allow partial objects like `{"a": 1, "b":` to be parsed as `{"a": 1}`
  	 */
  	exports.OBJ = 0b000001000;
  	/**
  	 * allow `nu` to be parsed as `null`
  	 */
  	exports.NULL = 0b000010000;
  	/**
  	 * allow `tr` to be parsed as `true`, and `fa` to be parsed as `false`
  	 */
  	exports.BOOL = 0b000100000;
  	/**
  	 * allow `Na` to be parsed as `NaN`
  	 */
  	exports.NAN = 0b001000000;
  	/**
  	 * allow `Inf` to be parsed as `Infinity`
  	 */
  	exports.INFINITY = 0b010000000;
  	/**
  	 * allow `-Inf` to be parsed as `-Infinity`
  	 */
  	exports._INFINITY = 0b100000000;
  	exports.INF = exports.INFINITY | exports._INFINITY;
  	exports.SPECIAL = exports.NULL | exports.BOOL | exports.INF | exports.NAN;
  	exports.ATOM = exports.STR | exports.NUM | exports.SPECIAL;
  	exports.COLLECTION = exports.ARR | exports.OBJ;
  	exports.ALL = exports.ATOM | exports.COLLECTION;
  	/**
  	 * Control what types you allow to be partially parsed.
  	 * The default is to allow all types to be partially parsed, which in most casees is the best option.
  	 * @example
  	 * If you don't want to allow partial objects, you can use the following code:
  	 * ```ts
  	 * import { Allow, parse } from "partial-json";
  	 * parse(`[{"a": 1, "b": 2}, {"a": 3,`, Allow.ARR); // [ { a: 1, b: 2 } ]
  	 * ```
  	 * Or you can use `~` to disallow a type:
  	 * ```ts
  	 * parse(`[{"a": 1, "b": 2}, {"a": 3,`, ~Allow.OBJ); // [ { a: 1, b: 2 } ]
  	 * ```
  	 * @example
  	 * If you don't want to allow partial strings, you can use the following code:
  	 * ```ts
  	 * import { Allow, parse } from "partial-json";
  	 * parse(`["complete string", "incompl`, ~Allow.STR); // [ 'complete string' ]
  	 * ```
  	 */
  	exports.Allow = { STR: exports.STR, NUM: exports.NUM, ARR: exports.ARR, OBJ: exports.OBJ, NULL: exports.NULL, BOOL: exports.BOOL, NAN: exports.NAN, INFINITY: exports.INFINITY, _INFINITY: exports._INFINITY, INF: exports.INF, SPECIAL: exports.SPECIAL, ATOM: exports.ATOM, COLLECTION: exports.COLLECTION, ALL: exports.ALL };
  	exports.default = exports.Allow; 
  } (options));

  (function (exports) {
  	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  	    if (k2 === undefined) k2 = k;
  	    var desc = Object.getOwnPropertyDescriptor(m, k);
  	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
  	      desc = { enumerable: true, get: function() { return m[k]; } };
  	    }
  	    Object.defineProperty(o, k2, desc);
  	}) : (function(o, m, k, k2) {
  	    if (k2 === undefined) k2 = k;
  	    o[k2] = m[k];
  	}));
  	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
  	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
  	};
  	Object.defineProperty(exports, "__esModule", { value: true });
  	exports.Allow = exports.MalformedJSON = exports.PartialJSON = exports.parseJSON = exports.parse = void 0;
  	const options_1 = options;
  	Object.defineProperty(exports, "Allow", { enumerable: true, get: function () { return options_1.Allow; } });
  	__exportStar(options, exports);
  	class PartialJSON extends Error {
  	}
  	exports.PartialJSON = PartialJSON;
  	class MalformedJSON extends Error {
  	}
  	exports.MalformedJSON = MalformedJSON;
  	/**
  	 * Parse incomplete JSON
  	 * @param {string} jsonString Partial JSON to be parsed
  	 * @param {number} allowPartial Specify what types are allowed to be partial, see {@link Allow} for details
  	 * @returns The parsed JSON
  	 * @throws {PartialJSON} If the JSON is incomplete (related to the `allow` parameter)
  	 * @throws {MalformedJSON} If the JSON is malformed
  	 */
  	function parseJSON(jsonString, allowPartial = options_1.Allow.ALL) {
  	    if (typeof jsonString !== "string") {
  	        throw new TypeError(`expecting str, got ${typeof jsonString}`);
  	    }
  	    if (!jsonString.trim()) {
  	        throw new Error(`${jsonString} is empty`);
  	    }
  	    return _parseJSON(jsonString.trim(), allowPartial);
  	}
  	exports.parseJSON = parseJSON;
  	const _parseJSON = (jsonString, allow) => {
  	    const length = jsonString.length;
  	    let index = 0;
  	    const markPartialJSON = (msg) => {
  	        throw new PartialJSON(`${msg} at position ${index}`);
  	    };
  	    const throwMalformedError = (msg) => {
  	        throw new MalformedJSON(`${msg} at position ${index}`);
  	    };
  	    const parseAny = () => {
  	        skipBlank();
  	        if (index >= length)
  	            markPartialJSON("Unexpected end of input");
  	        if (jsonString[index] === '"')
  	            return parseStr();
  	        if (jsonString[index] === "{")
  	            return parseObj();
  	        if (jsonString[index] === "[")
  	            return parseArr();
  	        if (jsonString.substring(index, index + 4) === "null" || (options_1.Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index)))) {
  	            index += 4;
  	            return null;
  	        }
  	        if (jsonString.substring(index, index + 4) === "true" || (options_1.Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index)))) {
  	            index += 4;
  	            return true;
  	        }
  	        if (jsonString.substring(index, index + 5) === "false" || (options_1.Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index)))) {
  	            index += 5;
  	            return false;
  	        }
  	        if (jsonString.substring(index, index + 8) === "Infinity" || (options_1.Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index)))) {
  	            index += 8;
  	            return Infinity;
  	        }
  	        if (jsonString.substring(index, index + 9) === "-Infinity" || (options_1.Allow._INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index)))) {
  	            index += 9;
  	            return -Infinity;
  	        }
  	        if (jsonString.substring(index, index + 3) === "NaN" || (options_1.Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index)))) {
  	            index += 3;
  	            return NaN;
  	        }
  	        return parseNum();
  	    };
  	    const parseStr = () => {
  	        const start = index;
  	        let escape = false;
  	        index++; // skip initial quote
  	        while (index < length && (jsonString[index] !== '"' || (escape && jsonString[index - 1] === "\\"))) {
  	            escape = jsonString[index] === "\\" ? !escape : false;
  	            index++;
  	        }
  	        if (jsonString.charAt(index) == '"') {
  	            try {
  	                return JSON.parse(jsonString.substring(start, ++index - Number(escape)));
  	            }
  	            catch (e) {
  	                throwMalformedError(String(e));
  	            }
  	        }
  	        else if (options_1.Allow.STR & allow) {
  	            try {
  	                return JSON.parse(jsonString.substring(start, index - Number(escape)) + '"');
  	            }
  	            catch (e) {
  	                // SyntaxError: Invalid escape sequence
  	                return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + '"');
  	            }
  	        }
  	        markPartialJSON("Unterminated string literal");
  	    };
  	    const parseObj = () => {
  	        index++; // skip initial brace
  	        skipBlank();
  	        const obj = {};
  	        try {
  	            while (jsonString[index] !== "}") {
  	                skipBlank();
  	                if (index >= length && options_1.Allow.OBJ & allow)
  	                    return obj;
  	                const key = parseStr();
  	                skipBlank();
  	                index++; // skip colon
  	                try {
  	                    const value = parseAny();
  	                    obj[key] = value;
  	                }
  	                catch (e) {
  	                    if (options_1.Allow.OBJ & allow)
  	                        return obj;
  	                    else
  	                        throw e;
  	                }
  	                skipBlank();
  	                if (jsonString[index] === ",")
  	                    index++; // skip comma
  	            }
  	        }
  	        catch (e) {
  	            if (options_1.Allow.OBJ & allow)
  	                return obj;
  	            else
  	                markPartialJSON("Expected '}' at end of object");
  	        }
  	        index++; // skip final brace
  	        return obj;
  	    };
  	    const parseArr = () => {
  	        index++; // skip initial bracket
  	        const arr = [];
  	        try {
  	            while (jsonString[index] !== "]") {
  	                arr.push(parseAny());
  	                skipBlank();
  	                if (jsonString[index] === ",") {
  	                    index++; // skip comma
  	                }
  	            }
  	        }
  	        catch (e) {
  	            if (options_1.Allow.ARR & allow) {
  	                return arr;
  	            }
  	            markPartialJSON("Expected ']' at end of array");
  	        }
  	        index++; // skip final bracket
  	        return arr;
  	    };
  	    const parseNum = () => {
  	        if (index === 0) {
  	            if (jsonString === "-")
  	                throwMalformedError("Not sure what '-' is");
  	            try {
  	                return JSON.parse(jsonString);
  	            }
  	            catch (e) {
  	                if (options_1.Allow.NUM & allow)
  	                    try {
  	                        return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
  	                    }
  	                    catch (e) { }
  	                throwMalformedError(String(e));
  	            }
  	        }
  	        const start = index;
  	        if (jsonString[index] === "-")
  	            index++;
  	        while (jsonString[index] && ",]}".indexOf(jsonString[index]) === -1)
  	            index++;
  	        if (index == length && !(options_1.Allow.NUM & allow))
  	            markPartialJSON("Unterminated number literal");
  	        try {
  	            return JSON.parse(jsonString.substring(start, index));
  	        }
  	        catch (e) {
  	            if (jsonString.substring(start, index) === "-")
  	                markPartialJSON("Not sure what '-' is");
  	            try {
  	                return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
  	            }
  	            catch (e) {
  	                throwMalformedError(String(e));
  	            }
  	        }
  	    };
  	    const skipBlank = () => {
  	        while (index < length && " \n\r\t".includes(jsonString[index])) {
  	            index++;
  	        }
  	    };
  	    return parseAny();
  	};
  	const parse = parseJSON;
  	exports.parse = parse; 
  } (dist));

  // src/ollama-provider.ts
  function convertToOllamaChatMessages(prompt) {
    const messages = [];
    for (const { content, role } of prompt) {
      switch (role) {
        case "system": {
          messages.push({ content, role: "system" });
          break;
        }
        case "user": {
          messages.push({
            ...content.reduce(
              (previous, current) => {
                if (current.type === "text") {
                  previous.content += current.text;
                } else if (current.type === "image" && current.image instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "Image URLs in user messages"
                  });
                } else if (current.type === "image" && current.image instanceof Uint8Array) {
                  previous.images = previous.images || [];
                  previous.images.push(convertUint8ArrayToBase64(current.image));
                }
                return previous;
              },
              { content: "" }
            ),
            role: "user"
          });
          break;
        }
        case "assistant": {
          const text = [];
          const toolCalls = [];
          for (const part of content) {
            switch (part.type) {
              case "text": {
                text.push(part.text);
                break;
              }
              case "tool-call": {
                toolCalls.push({
                  function: {
                    arguments: part.args,
                    name: part.toolName
                  },
                  id: part.toolCallId,
                  type: "function"
                });
                break;
              }
              default: {
                const _exhaustiveCheck = part;
                throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
              }
            }
          }
          messages.push({
            content: text.join(","),
            role: "assistant",
            tool_calls: toolCalls.length > 0 ? toolCalls : void 0
          });
          break;
        }
        case "tool": {
          messages.push(
            ...content.map((part) => ({
              // Non serialized contents are not accepted by ollama, triggering the following error:
              // "json: cannot unmarshal array into Go struct field ChatRequest.messages of type string"
              content: typeof part.result === "object" ? JSON.stringify(part.result) : `${part.result}`,
              role: "tool",
              tool_call_id: part.toolCallId
            }))
          );
          break;
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    return messages;
  }
  var InferToolCallsFromStream = class {
    constructor({
      tools,
      type
    }) {
      this._firstMessage = true;
      this._tools = tools;
      this._toolPartial = "";
      this._toolCalls = [];
      this._type = type;
      this._detectedToolCall = false;
    }
    get toolCalls() {
      return this._toolCalls;
    }
    get detectedToolCall() {
      return this._detectedToolCall;
    }
    parse({
      controller,
      delta
    }) {
      var _a;
      this.detectToolCall(delta);
      if (!this._detectedToolCall) {
        return false;
      }
      this._toolPartial += delta;
      let parsedFunctions = dist.parse(this._toolPartial);
      if (!Array.isArray(parsedFunctions)) {
        parsedFunctions = [parsedFunctions];
      }
      for (const [index, parsedFunction] of parsedFunctions.entries()) {
        const parsedArguments = (_a = JSON.stringify(parsedFunction == null ? void 0 : parsedFunction.parameters)) != null ? _a : "";
        if (parsedArguments === "") {
          continue;
        }
        if (!this._toolCalls[index]) {
          this._toolCalls[index] = {
            function: {
              arguments: "",
              name: parsedFunction.name
            },
            id: generateId(),
            type: "function"
          };
        }
        const toolCall = this._toolCalls[index];
        toolCall.function.arguments = parsedArguments;
        controller.enqueue({
          argsTextDelta: delta,
          toolCallId: toolCall.id,
          toolCallType: "function",
          toolName: toolCall.function.name,
          type: "tool-call-delta"
        });
      }
      return true;
    }
    finish({
      controller
    }) {
      for (const toolCall of this.toolCalls) {
        controller.enqueue({
          args: toolCall.function.arguments,
          toolCallId: toolCall.id,
          toolCallType: "function",
          toolName: toolCall.function.name,
          type: "tool-call"
        });
      }
      return this.finishReason();
    }
    detectToolCall(delta) {
      if (!this._tools || this._tools.length === 0) {
        return;
      }
      if (this._firstMessage) {
        if (this._type === "object-tool") {
          this._detectedToolCall = true;
        } else if (this._type === "regular" && (delta.trim().startsWith("{") || delta.trim().startsWith("["))) {
          this._detectedToolCall = true;
        }
        this._firstMessage = false;
      }
    }
    finishReason() {
      if (!this.detectedToolCall) {
        return "stop";
      }
      return this._type === "object-tool" ? "stop" : "tool-calls";
    }
  };

  // src/map-ollama-finish-reason.ts
  function mapOllamaFinishReason({
    finishReason,
    hasToolCalls
  }) {
    switch (finishReason) {
      case "stop": {
        return hasToolCalls ? "tool-calls" : "stop";
      }
      default: {
        return "other";
      }
    }
  }
  var ollamaErrorDataSchema = objectType({
    error: objectType({
      code: stringType().nullable(),
      message: stringType(),
      param: anyType().nullable(),
      type: stringType()
    })
  });
  var ollamaFailedResponseHandler = createJsonErrorResponseHandler({
    errorSchema: ollamaErrorDataSchema,
    errorToMessage: (data) => data.error.message
  });
  function prepareTools({
    mode
  }) {
    var _a;
    const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
    const toolWarnings = [];
    const toolChoice = mode.toolChoice;
    if (tools === void 0) {
      return {
        tools: void 0,
        toolWarnings
      };
    }
    const ollamaTools = [];
    for (const tool of tools) {
      if (tool.type === "provider-defined") {
        toolWarnings.push({ tool, type: "unsupported-tool" });
      } else {
        ollamaTools.push({
          function: {
            description: tool.description,
            name: tool.name,
            parameters: tool.parameters
          },
          type: "function"
        });
      }
    }
    if (toolChoice === void 0) {
      return {
        tools: ollamaTools,
        toolWarnings
      };
    }
    const type = toolChoice.type;
    switch (type) {
      case "auto": {
        return {
          tools: ollamaTools,
          toolWarnings
        };
      }
      case "none": {
        return {
          tools: void 0,
          toolWarnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
        });
      }
    }
  }

  // src/utils/remove-undefined.ts
  function removeUndefined(object) {
    return Object.fromEntries(
      Object.entries(object).filter(([, v]) => v !== void 0)
    );
  }

  // src/utils/text-line-stream.ts
  var TextLineStream = class extends TransformStream {
    constructor() {
      super({
        flush: (controller) => {
          if (this.buffer.length === 0) return;
          controller.enqueue(this.buffer);
        },
        transform: (chunkText, controller) => {
          chunkText = this.buffer + chunkText;
          while (true) {
            const EOL = chunkText.indexOf("\n");
            if (EOL === -1) break;
            controller.enqueue(chunkText.slice(0, EOL));
            chunkText = chunkText.slice(EOL + 1);
          }
          this.buffer = chunkText;
        }
      });
      this.buffer = "";
    }
  };

  // src/utils/response-handler.ts
  var createJsonStreamResponseHandler = (chunkSchema) => async ({ response }) => {
    const responseHeaders = extractResponseHeaders(response);
    if (response.body === null) {
      throw new EmptyResponseBodyError({});
    }
    return {
      responseHeaders,
      value: response.body.pipeThrough(new TextDecoderStream()).pipeThrough(new TextLineStream()).pipeThrough(
        new TransformStream({
          transform(chunkText, controller) {
            controller.enqueue(
              safeParseJSON({
                schema: chunkSchema,
                text: chunkText
              })
            );
          }
        })
      )
    };
  };

  // src/ollama-chat-language-model.ts
  var OllamaChatLanguageModel = class {
    constructor(modelId, settings, config) {
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
      this.specificationVersion = "v1";
      this.defaultObjectGenerationMode = "json";
      this.supportsImageUrls = false;
    }
    get supportsStructuredOutputs() {
      var _a;
      return (_a = this.settings.structuredOutputs) != null ? _a : false;
    }
    get provider() {
      return this.config.provider;
    }
    getArguments({
      frequencyPenalty,
      maxTokens,
      mode,
      presencePenalty,
      prompt,
      responseFormat,
      seed,
      stopSequences,
      temperature,
      topK,
      topP
    }) {
      const type = mode.type;
      const warnings = [];
      if (responseFormat !== void 0 && responseFormat.type === "json" && responseFormat.schema !== void 0 && !this.supportsStructuredOutputs) {
        warnings.push({
          details: "JSON response format schema is only supported with structuredOutputs",
          setting: "responseFormat",
          type: "unsupported-setting"
        });
      }
      const baseArguments = {
        format: responseFormat == null ? void 0 : responseFormat.type,
        model: this.modelId,
        options: removeUndefined({
          f16_kv: this.settings.f16Kv,
          frequency_penalty: frequencyPenalty,
          low_vram: this.settings.lowVram,
          main_gpu: this.settings.mainGpu,
          min_p: this.settings.minP,
          mirostat: this.settings.mirostat,
          mirostat_eta: this.settings.mirostatEta,
          mirostat_tau: this.settings.mirostatTau,
          num_batch: this.settings.numBatch,
          num_ctx: this.settings.numCtx,
          num_gpu: this.settings.numGpu,
          num_keep: this.settings.numKeep,
          num_predict: maxTokens,
          num_thread: this.settings.numThread,
          numa: this.settings.numa,
          penalize_newline: this.settings.penalizeNewline,
          presence_penalty: presencePenalty,
          repeat_last_n: this.settings.repeatLastN,
          repeat_penalty: this.settings.repeatPenalty,
          seed,
          stop: stopSequences,
          temperature,
          tfs_z: this.settings.tfsZ,
          top_k: topK,
          top_p: topP,
          typical_p: this.settings.typicalP,
          use_mlock: this.settings.useMlock,
          use_mmap: this.settings.useMmap,
          vocab_only: this.settings.vocabOnly
        })
      };
      switch (type) {
        case "regular": {
          const { tools, toolWarnings } = prepareTools({
            mode
          });
          return {
            args: {
              ...baseArguments,
              messages: convertToOllamaChatMessages(prompt),
              tools
            },
            type,
            warnings: [...warnings, ...toolWarnings]
          };
        }
        case "object-json": {
          return {
            args: {
              ...baseArguments,
              format: this.supportsStructuredOutputs && mode.schema !== void 0 ? mode.schema : "json",
              messages: convertToOllamaChatMessages(prompt)
            },
            type,
            warnings
          };
        }
        case "object-tool": {
          return {
            args: {
              ...baseArguments,
              messages: convertToOllamaChatMessages(prompt),
              tool_choice: {
                function: { name: mode.tool.name },
                type: "function"
              },
              tools: [
                {
                  function: {
                    description: mode.tool.description,
                    name: mode.tool.name,
                    parameters: mode.tool.parameters
                  },
                  type: "function"
                }
              ]
            },
            type,
            warnings
          };
        }
        default: {
          const _exhaustiveCheck = type;
          throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
        }
      }
    }
    async doGenerate(options) {
      var _a, _b;
      const { args, warnings } = this.getArguments(options);
      const body = {
        ...args,
        stream: false
      };
      const { responseHeaders, value: response } = await postJsonToApi({
        abortSignal: options.abortSignal,
        body,
        failedResponseHandler: ollamaFailedResponseHandler,
        fetch: this.config.fetch,
        headers: combineHeaders(this.config.headers(), options.headers),
        successfulResponseHandler: createJsonResponseHandler(
          ollamaChatResponseSchema
        ),
        url: `${this.config.baseURL}/chat`
      });
      const { messages: rawPrompt, ...rawSettings } = body;
      const toolCalls = (_a = response.message.tool_calls) == null ? void 0 : _a.map((toolCall) => {
        var _a2;
        return {
          args: JSON.stringify(toolCall.function.arguments),
          toolCallId: (_a2 = toolCall.id) != null ? _a2 : generateId(),
          toolCallType: "function",
          toolName: toolCall.function.name
        };
      });
      return {
        finishReason: mapOllamaFinishReason({
          finishReason: response.done_reason,
          hasToolCalls: toolCalls !== void 0 && toolCalls.length > 0
        }),
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        text: (_b = response.message.content) != null ? _b : void 0,
        toolCalls,
        usage: {
          completionTokens: response.eval_count || 0,
          promptTokens: response.prompt_eval_count || 0
        },
        warnings
      };
    }
    async doStream(options) {
      if (this.settings.simulateStreaming) {
        const result = await this.doGenerate(options);
        const simulatedStream = new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "response-metadata", ...result.response });
            if (result.text) {
              controller.enqueue({
                textDelta: result.text,
                type: "text-delta"
              });
            }
            if (result.toolCalls) {
              for (const toolCall of result.toolCalls) {
                controller.enqueue({
                  argsTextDelta: toolCall.args,
                  toolCallId: toolCall.toolCallId,
                  toolCallType: "function",
                  toolName: toolCall.toolName,
                  type: "tool-call-delta"
                });
                controller.enqueue({
                  type: "tool-call",
                  ...toolCall
                });
              }
            }
            controller.enqueue({
              finishReason: result.finishReason,
              logprobs: result.logprobs,
              providerMetadata: result.providerMetadata,
              type: "finish",
              usage: result.usage
            });
            controller.close();
          }
        });
        return {
          rawCall: result.rawCall,
          rawResponse: result.rawResponse,
          stream: simulatedStream,
          warnings: result.warnings
        };
      }
      const { args: body, type, warnings } = this.getArguments(options);
      const { responseHeaders, value: response } = await postJsonToApi({
        abortSignal: options.abortSignal,
        body,
        failedResponseHandler: ollamaFailedResponseHandler,
        fetch: this.config.fetch,
        headers: combineHeaders(this.config.headers(), options.headers),
        successfulResponseHandler: createJsonStreamResponseHandler(
          ollamaChatStreamChunkSchema
        ),
        url: `${this.config.baseURL}/chat`
      });
      const { messages: rawPrompt, ...rawSettings } = body;
      const tools = options.mode.type === "regular" ? options.mode.tools : options.mode.type === "object-tool" ? [options.mode.tool] : void 0;
      const inferToolCallsFromStream = new InferToolCallsFromStream({
        tools,
        type
      });
      let finishReason = "other";
      let usage = {
        completionTokens: Number.NaN,
        promptTokens: Number.NaN
      };
      const { experimentalStreamTools = true } = this.settings;
      return {
        rawCall: { rawPrompt, rawSettings },
        rawResponse: { headers: responseHeaders },
        request: { body: JSON.stringify(body) },
        stream: response.pipeThrough(
          new TransformStream({
            async flush(controller) {
              controller.enqueue({
                finishReason,
                type: "finish",
                usage
              });
            },
            async transform(chunk, controller) {
              if (!chunk.success) {
                controller.enqueue({ error: chunk.error, type: "error" });
                return;
              }
              const value = chunk.value;
              if (value.done) {
                finishReason = inferToolCallsFromStream.finish({ controller });
                usage = {
                  completionTokens: value.eval_count,
                  promptTokens: value.prompt_eval_count || 0
                };
                return;
              }
              if (experimentalStreamTools) {
                const isToolCallStream = inferToolCallsFromStream.parse({
                  controller,
                  delta: value.message.content
                });
                if (isToolCallStream) {
                  return;
                }
              }
              if (value.message.content !== null) {
                controller.enqueue({
                  textDelta: value.message.content,
                  type: "text-delta"
                });
              }
            }
          })
        ),
        warnings
      };
    }
  };
  var ollamaChatResponseSchema = objectType({
    created_at: stringType(),
    done: literalType(true),
    done_reason: stringType().optional().nullable(),
    eval_count: numberType(),
    eval_duration: numberType(),
    load_duration: numberType().optional(),
    message: objectType({
      content: stringType(),
      role: stringType(),
      tool_calls: arrayType(
        objectType({
          function: objectType({
            arguments: recordType(anyType()),
            name: stringType()
          }),
          id: stringType().optional()
        })
      ).optional().nullable()
    }),
    model: stringType(),
    prompt_eval_count: numberType().optional(),
    prompt_eval_duration: numberType().optional(),
    total_duration: numberType()
  });
  var ollamaChatStreamChunkSchema = discriminatedUnionType("done", [
    objectType({
      created_at: stringType(),
      done: literalType(false),
      message: objectType({
        content: stringType(),
        role: stringType()
      }),
      model: stringType()
    }),
    objectType({
      created_at: stringType(),
      done: literalType(true),
      eval_count: numberType(),
      eval_duration: numberType(),
      load_duration: numberType().optional(),
      model: stringType(),
      prompt_eval_count: numberType().optional(),
      prompt_eval_duration: numberType().optional(),
      total_duration: numberType()
    })
  ]);
  var OllamaEmbeddingModel = class {
    constructor(modelId, settings, config) {
      this.specificationVersion = "v1";
      this.modelId = modelId;
      this.settings = settings;
      this.config = config;
    }
    get provider() {
      return this.config.provider;
    }
    get maxEmbeddingsPerCall() {
      var _a;
      return (_a = this.settings.maxEmbeddingsPerCall) != null ? _a : 2048;
    }
    get supportsParallelCalls() {
      return false;
    }
    async doEmbed({
      abortSignal,
      values
    }) {
      if (values.length > this.maxEmbeddingsPerCall) {
        throw new TooManyEmbeddingValuesForCallError({
          maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
          modelId: this.modelId,
          provider: this.provider,
          values
        });
      }
      const { responseHeaders, value: response } = await postJsonToApi({
        abortSignal,
        body: {
          input: values,
          model: this.modelId
        },
        failedResponseHandler: ollamaFailedResponseHandler,
        fetch: this.config.fetch,
        headers: this.config.headers(),
        successfulResponseHandler: createJsonResponseHandler(
          ollamaTextEmbeddingResponseSchema
        ),
        url: `${this.config.baseURL}/embed`
      });
      return {
        embeddings: response.embeddings,
        rawResponse: { headers: responseHeaders },
        usage: response.prompt_eval_count ? { tokens: response.prompt_eval_count } : void 0
      };
    }
  };
  var ollamaTextEmbeddingResponseSchema = objectType({
    embeddings: arrayType(arrayType(numberType())),
    prompt_eval_count: numberType().nullable()
  });

  // src/ollama-provider.ts
  function createOllama(options = {}) {
    var _a;
    const baseURL = (_a = withoutTrailingSlash(options.baseURL)) != null ? _a : "http://127.0.0.1:11434/api";
    const getHeaders = () => ({
      ...options.headers
    });
    const createChatModel = (modelId, settings = {}) => new OllamaChatLanguageModel(modelId, settings, {
      baseURL,
      fetch: options.fetch,
      headers: getHeaders,
      provider: "ollama.chat"
    });
    const createEmbeddingModel = (modelId, settings = {}) => new OllamaEmbeddingModel(modelId, settings, {
      baseURL,
      fetch: options.fetch,
      headers: getHeaders,
      provider: "ollama.embedding"
    });
    const provider = function(modelId, settings) {
      if (new.target) {
        throw new Error(
          "The Ollama model function cannot be called with the new keyword."
        );
      }
      return createChatModel(modelId, settings);
    };
    provider.chat = createChatModel;
    provider.embedding = createEmbeddingModel;
    provider.languageModel = createChatModel;
    provider.textEmbedding = createEmbeddingModel;
    provider.textEmbeddingModel = createEmbeddingModel;
    return provider;
  }
  var ollama = createOllama();

  // Base object with shared logic for all providers
  const providerPrototype = {
    get apiKey() {
      return PREFS.getPref(this.apiPref);
    },
    set apiKey(v) {
      if (typeof v === "string") PREFS.setPref(this.apiPref, v);
    },
    get model() {
      return PREFS.getPref(this.modelPref);
    },
    set model(v) {
      if (this.AVAILABLE_MODELS.includes(v)) PREFS.setPref(this.modelPref, v);
    },
    getModel() {
      return this.create({ apiKey: this.apiKey })(this.model);
    },
  };

  const mistral = Object.assign(Object.create(providerPrototype), {
    name: "mistral",
    label: "Mistral AI",
    faviconUrl: "https://www.google.com/s2/favicons?sz=32&domain_url=https%3A%2F%2Fmistral.ai%2F",
    apiKeyUrl: "https://console.mistral.ai/api-keys/",
    AVAILABLE_MODELS: [
      "pixtral-large-latest",
      "mistral-large-latest",
      "mistral-medium-latest",
      "mistral-medium-2505",
      "mistral-small-latest",
      "magistral-small-2506",
      "magistral-medium-2506",
      "ministral-3b-latest",
      "ministral-8b-latest",
      "pixtral-12b-2409",
      "open-mistral-7b",
      "open-mixtral-8x7b",
      "open-mixtral-8x22b",
    ],
    AVAILABLE_MODELS_LABELS: {
      "pixtral-large-latest": "Pixtral Large (Latest)",
      "mistral-large-latest": "Mistral Large (Latest)",
      "mistral-medium-latest": "Mistral Medium (Latest)",
      "mistral-medium-2505": "Mistral Medium (2505)",
      "mistral-small-latest": "Mistral Small(Latest)",
      "magistral-small-2506": "Magistral Small (2506)",
      "magistral-medium-2506": "Magistral Medium (2506)",
      "ministral-3b-latest": "Ministral 3B (Latest)",
      "ministral-8b-latest": "Ministral 8B (Latest)",
      "pixtral-12b-2409": "Pixtral 12B (2409)",
      "open-mistral-7b": "Open Mistral 7B",
      "open-mixtral-8x7b": "Open Mixtral 8x7B",
      "open-mixtral-8x22b": "Open Mixtral 8x22B",
    },
    modelPref: PREFS.MISTRAL_MODEL,
    apiPref: PREFS.MISTRAL_API_KEY,
    create: createMistral,
  });

  const gemini = Object.assign(Object.create(providerPrototype), {
    name: "gemini",
    label: "Google Gemini",
    faviconUrl: "https://www.google.com/s2/favicons?sz=32&domain_url=https%3A%2F%2Fgemini.google.com",
    apiKeyUrl: "https://aistudio.google.com/app/apikey",
    AVAILABLE_MODELS: [
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash-lite-preview-06-17",
      "gemini-2.0-flash",
      "gemini-1.5-pro",
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash-8b-latest",
    ],
    AVAILABLE_MODELS_LABELS: {
      "gemini-2.5-pro": "Gemini 2.5 Pro",
      "gemini-2.5-flash": "Gemini 2.5 Flash",
      "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite",
      "gemini-2.5-flash-lite-preview-06-17": "Gemini 2.5 Flash Lite (preview)",
      "gemini-2.0-flash": "Gemini 2.0 Flash",
      "gemini-1.5-pro": "Gemini 1.5 Pro",
      "gemini-1.5-pro-latest": "Gemini 1.5 Pro Latest",
      "gemini-1.5-flash": "Gemini 1.5 Flash",
      "gemini-1.5-flash-latest": "Gemini 1.5 Flash Latest",
      "gemini-1.5-flash-8b": "Gemini 1.5 Flash 8B",
      "gemini-1.5-flash-8b-latest": "Gemini 1.5 Flash 8B Latest",
    },
    modelPref: PREFS.GEMINI_MODEL,
    apiPref: PREFS.GEMINI_API_KEY,
    create: createGoogleGenerativeAI,
  });

  const openai = Object.assign(Object.create(providerPrototype), {
    name: "openai",
    label: "OpenAI GPT",
    faviconUrl: "https://www.google.com/s2/favicons?sz=32&domain_url=chatgpt.com/",
    apiKeyUrl: "https://platform.openai.com/account/api-keys",
    AVAILABLE_MODELS: [
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4o-audio-preview",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
      "o1",
      "o3-mini",
      "o3",
      "o4-mini",
    ],
    AVAILABLE_MODELS_LABELS: {
      "gpt-4.1": "GPT 4.1",
      "gpt-4.1-mini": "GPT 4.1 Mini",
      "gpt-4.1-nano": "GPT 4.1 Nano",
      "gpt-4o": "GPT 4o",
      "gpt-4o-mini": "GPT 4o Mini",
      "gpt-4o-audio-preview": "GPT 4o Audio Preview",
      "gpt-4-turbo": "GPT 4 Turbo",
      "gpt-4": "GPT 4",
      "gpt-3.5-turbo": "GPT 3.5 Turbo",
      o1: "O1",
      "o3-mini": "O3 Mini",
      o3: "O3",
      "o4-mini": "O4 Mini",
    },
    modelPref: PREFS.OPENAI_MODEL,
    apiPref: PREFS.OPENAI_API_KEY,
    create: createOpenAI,
  });

  const claude = Object.assign(Object.create(providerPrototype), {
    name: "claude",
    label: "Anthropic Claude",
    faviconUrl: "https://www.google.com/s2/favicons?sz=32&domain_url=anthropic.com",
    apiKeyUrl: "https://console.anthropic.com/dashboard",
    AVAILABLE_MODELS: [
      "claude-4-opus",
      "claude-4-sonnet",
      "claude-4-haiku",
      "claude-3-opus",
      "claude-3-sonnet",
      "claude-3-haiku",
    ],
    AVAILABLE_MODELS_LABELS: {
      "claude-4-opus": "Claude 4 Opus",
      "claude-4-sonnet": "Claude 4 Sonnet",
      "claude-4-haiku": "Claude 4 Haiku",
      "claude-3-opus": "Claude 3 Opus",
      "claude-3-sonnet": "Claude 3 Sonnet",
      "claude-3-haiku": "Claude 3 Haiku",
    },
    modelPref: PREFS.CLAUDE_MODEL,
    apiPref: PREFS.CLAUDE_API_KEY,
    create: createAnthropic,
  });

  const grok = Object.assign(Object.create(providerPrototype), {
    name: "grok",
    label: "xAI Grok",
    faviconUrl: "https://www.google.com/s2/favicons?sz=32&domain_url=x.ai",
    apiKeyUrl: "https://x.ai/api",
    AVAILABLE_MODELS: [
      "grok-4",
      "grok-3",
      "grok-3-latest",
      "grok-3-fast",
      "grok-3-fast-latest",
      "grok-3-mini",
      "grok-3-mini-latest",
      "grok-3-mini-fast",
      "grok-3-mini-fast-latest",
      "grok-2",
      "grok-2-latest",
      "grok-2-1212",
      "grok-beta",
    ],
    AVAILABLE_MODELS_LABELS: {
      "grok-4": "Grok 4",
      "grok-3": "Grok 3",
      "grok-3-latest": "Grok 3 Latest",
      "grok-3-fast": "Grok 3 Fast",
      "grok-3-fast-latest": "Grok 3 Fast Latest",
      "grok-3-mini": "Grok 3 Mini",
      "grok-3-mini-latest": "Grok 3 Mini Latest",
      "grok-3-mini-fast": "Grok 3 Mini Fast",
      "grok-3-mini-fast-latest": "Grok 3 Mini Fast Latest",
      "grok-2": "Grok 2",
      "grok-2-latest": "Grok 2 Latest",
      "grok-2-1212": "Grok 2 1212",
      "grok-beta": "Grok Beta",
    },
    modelPref: PREFS.GROK_MODEL,
    apiPref: PREFS.GROK_API_KEY,
    create: xai,
  });

  const perplexity = Object.assign(Object.create(providerPrototype), {
    name: "perplexity",
    label: "Perplexity AI",
    faviconUrl: "https://www.google.com/s2/favicons?sz=32&domain_url=perplexity.ai",
    apiKeyUrl: "https://perplexity.ai",
    AVAILABLE_MODELS: [
      "sonar-deep-research",
      "sonar-reasoning-pro",
      "sonar-reasoning",
      "sonar-pro",
      "sonar",
    ],
    AVAILABLE_MODELS_LABELS: {
      "sonar-deep-research": "Sonar Deep Research",
      "sonar-reasoning-pro": "Sonar Reasoning Pro",
      "sonar-reasoning": "Sonar Reasoning",
      "sonar-pro": "Sonar Pro",
      sonar: "Sonar",
    },
    modelPref: PREFS.PERPLEXITY_MODEL,
    apiPref: PREFS.PERPLEXITY_API_KEY,
    create: createPerplexity,
  });

  const ollamaProvider = Object.assign(Object.create(providerPrototype), {
    name: "ollama",
    label: "Ollama (local)",
    faviconUrl: "https://www.google.com/s2/favicons?sz=32&domain_url=ollama.com/",
    apiKeyUrl: "",
    AVAILABLE_MODELS: [
      "deepseek-r1:8b",
      "deepseek-r1:1.5b",
      "deepseek-r1:7b",
      "deepseek-r1:14b",
      "deepseek-r1:32b",
      "deepseek-r1:70b",
      "mixtral:8x22b",
      "mixtral:8x7b",
      "qwen3:0.6b",
      "qwen3:1.7b",
      "qwen3:4b",
      "qwen3:8b",
      "qwen3:14b",
      "qwen3:32b",
      "qwen3:30b-a3b",
      "qwen3:235b-a22b",
      "llama4:scout",
      "llama4:maverick",
    ],
    AVAILABLE_MODELS_LABELS: {
      "deepseek-r1:8b": "DeepSeek R1 (8B parameters)",
      "deepseek-r1:1.5b": "DeepSeek R1 (1.5B parameters)",
      "deepseek-r1:7b": "DeepSeek R1 (7B parameters)",
      "deepseek-r1:14b": "DeepSeek R1 (14B parameters)",
      "deepseek-r1:32b": "DeepSeek R1 (32B parameters)",
      "deepseek-r1:70b": "DeepSeek R1 (70B parameters)",
      "mixtral:8x22b": "Mixtral (8x22B)",
      "mixtral:8x7b": "Mixtral (8x7B)",
      "qwen3:0.6b": "Qwen3 (0.6B parameters)",
      "qwen3:1.7b": "Qwen3 (1.7B parameters)",
      "qwen3:4b": "Qwen3 (4B parameters)",
      "qwen3:8b": "Qwen3 (8B parameters)",
      "qwen3:14b": "Qwen3 (14B parameters)",
      "qwen3:32b": "Qwen3 (32B parameters)",
      "qwen3:30b-a3b": "Qwen3 (30B mixture-of-experts model with 3B active parameters)",
      "qwen3:235b-a22b": "Qwen3 (235B mixture-of-experts model with 22B active parameters)",
      "llama4:scout": "Llama 4 Scout",
      "llama4:maverick": "Llama 4 Maverick",
    },
    modelPref: PREFS.OLLAMA_MODEL,
    apiPref: PREFS.OLLAMA_API_KEY,
    getModel() {
      return ollama(this.model);
    },
  });

  // ╭─────────────────────────────────────────────────────────╮
  // │                         SEARCH                          │
  // ╰─────────────────────────────────────────────────────────╯
  async function getSearchURL(engineName, searchTerm) {
    try {
      const engine = await Services.search.getEngineByName(engineName);
      if (!engine) {
        debugError$1(`No search engine found with name: ${engineName}`);
        return null;
      }
      const submission = engine.getSubmission(searchTerm.trim());
      if (!submission) {
        debugError$1(`No submission found for term: ${searchTerm} and engine: ${engineName}`);
        return null;
      }
      return submission.uri.spec;
    } catch (e) {
      debugError$1(`Error getting search URL for engine "${engineName}".`, e);
      return null;
    }
  }

  async function search(args) {
    const { searchTerm, engineName, where } = args;
    const defaultEngineName = Services.search.defaultEngine.name;
    const searchEngineName = engineName || defaultEngineName;
    if (!searchTerm) return { error: "Search tool requires a searchTerm." };

    const url = await getSearchURL(searchEngineName, searchTerm);
    if (url) {
      return await openLink({ link: url, where });
    } else {
      return {
        error: `Could not find search engine named '${searchEngineName}'.`,
      };
    }
  }

  // ╭─────────────────────────────────────────────────────────╮
  // │                          TABS                           │
  // ╰─────────────────────────────────────────────────────────╯
  async function openLink(args) {
    const { link, where = "new tab" } = args;
    if (!link) return { error: "openLink requires a link." };
    const whereNormalized = where?.toLowerCase()?.trim();
    try {
      switch (whereNormalized) {
        case "current tab":
          openTrustedLinkIn(link, "current");
          break;
        case "new tab":
          openTrustedLinkIn(link, "tab");
          break;
        case "new window":
          openTrustedLinkIn(link, "window");
          break;
        case "incognito":
        case "private":
          window.openTrustedLinkIn(link, "window", { private: true });
          break;
        case "glance":
          if (window.gZenGlanceManager) {
            const rect = gBrowser.selectedBrowser.getBoundingClientRect();
            window.gZenGlanceManager.openGlance({
              url: link,
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              width: 10,
              height: 10,
            });
          } else {
            openTrustedLinkIn(link, "tab");
            return { result: `Glance not available. Opened in a new tab.` };
          }
          break;
        case "vsplit":
        case "hsplit":
          if (window.gZenViewSplitter) {
            const sep = whereNormalized === "vsplit" ? "vsep" : "hsep";
            const tab1 = gBrowser.selectedTab;
            await openTrustedLinkIn(link, "tab");
            const tab2 = gBrowser.selectedTab;
            gZenViewSplitter.splitTabs([tab1, tab2], sep, 1);
          } else return { error: "Split view is not available." };
          break;
        default:
          openTrustedLinkIn(link, "tab");
          return {
            result: `Unknown location "${where}". Opened in a new tab as fallback.`,
          };
      }
      return { result: `Successfully opened ${link} in ${where}.` };
    } catch (e) {
      debugError$1(`Failed to open link "${link}" in "${where}".`, e);
      return { error: `Failed to open link.` };
    }
  }

  async function newSplit(args) {
    const { link1, link2, type = "vertical" } = args;
    if (!window.gZenViewSplitter) return { error: "Split view function is not available." };
    if (!link1 || !link2) return { error: "newSplit requires two links." };
    try {
      const sep = type.toLowerCase() === "vertical" ? "vsep" : "hsep";
      await openTrustedLinkIn(link1, "tab");
      const tab1 = gBrowser.selectedTab;
      await openTrustedLinkIn(link2, "tab");
      const tab2 = gBrowser.selectedTab;
      gZenViewSplitter.splitTabs([tab1, tab2], sep, 1);
      return {
        result: `Successfully created ${type} split view with the provided links.`,
      };
    } catch (e) {
      debugError$1("Failed to create split view.", e);
      return { error: "Failed to create split view." };
    }
  }

  // ╭─────────────────────────────────────────────────────────╮
  // │                        BOOKMARKS                        │
  // ╰─────────────────────────────────────────────────────────╯

  /**
   * Searches bookmarks based on a query.
   * @param {object} args - The arguments object.
   * @param {string} args.query - The search term for bookmarks.
   * @returns {Promise<object>} A promise that resolves with an object containing an array of bookmark results or an error.
   */
  async function searchBookmarks(args) {
    const { query } = args;
    if (!query) return { error: "searchBookmarks requires a query." };

    try {
      const searchParams = { query };
      const bookmarks = await PlacesUtils.bookmarks.search(searchParams);

      // Map to a simpler format to save tokens for the AI model
      const results = bookmarks.map((bookmark) => ({
        id: bookmark.guid,
        title: bookmark.title,
        url: bookmark?.url?.href,
        parentID: bookmark.parentGuid,
      }));

      debugLog(`Found ${results.length} bookmarks for query "${query}":`, results);
      return { bookmarks: results };
    } catch (e) {
      debugError$1(`Error searching bookmarks for query "${query}":`, e);
      return { error: `Failed to search bookmarks.` };
    }
  }

  /**
   * Reads all bookmarks.
   * @returns {Promise<object>} A promise that resolves with an object containing an array of all bookmark results or an error.
   */

  async function getAllBookmarks() {
    try {
      const bookmarks = await PlacesUtils.bookmarks.search({});

      const results = bookmarks.map((bookmark) => ({
        id: bookmark.guid,
        title: bookmark.title,
        url: bookmark?.url?.href,
        parentID: bookmark.parentGuid,
      }));

      debugLog(`Read ${results.length} total bookmarks.`);
      return { bookmarks: results };
    } catch (e) {
      debugError$1(`Error reading all bookmarks:`, e);
      return { error: `Failed to read all bookmarks.` };
    }
  }

  /**
   * Creates a new bookmark.
   * @param {object} args - The arguments object.
   * @param {string} args.url - The URL to bookmark.
   * @param {string} [args.title] - The title for the bookmark. If not provided, the URL is used.
   * @param {string} [args.parentID] - The GUID of the parent folder. Defaults to the "Other Bookmarks" folder.
   * @returns {Promise<object>} A promise that resolves with a success message or an error.
   */
  async function createBookmark(args) {
    const { url, title, parentID } = args;
    if (!url) return { error: "createBookmark requires a URL." };

    try {
      const bookmarkInfo = {
        parentGuid: parentID || PlacesUtils.bookmarks.toolbarGuid,
        url: new URL(url),
        title: title || url,
      };

      const bm = await PlacesUtils.bookmarks.insert(bookmarkInfo);

      debugLog(`Bookmark created successfully:`, JSON.stringify(bm));
      return { result: `Successfully bookmarked "${bm.title}".` };
    } catch (e) {
      debugError$1(`Error creating bookmark for URL "${url}":`, e);
      return { error: `Failed to create bookmark.` };
    }
  }

  /**
   * Creates a new bookmark folder.
   * @param {object} args - The arguments object.
   * @param {string} args.title - The title for the new folder.
   * @param {string} [args.parentID] - The GUID of the parent folder. Defaults to the "Other Bookmarks" folder.
   * @returns {Promise<object>} A promise that resolves with a success message or an error.
   */
  async function addBookmarkFolder(args) {
    const { title, parentID } = args;
    if (!title) return { error: "addBookmarkFolder requires a title." };

    try {
      const folderInfo = {
        parentGuid: parentID || PlacesUtils.bookmarks.toolbarGuid,
        type: PlacesUtils.bookmarks.TYPE_FOLDER,
        title: title,
      };

      const folder = await PlacesUtils.bookmarks.insert(folderInfo);

      debugLog(`Bookmark folder created successfully:`, JSON.stringify(folderInfo));
      return { result: `Successfully created folder "${folder.title}".` };
    } catch (e) {
      debugError$1(`Error creating bookmark folder "${title}":`, e);
      return { error: `Failed to create folder.` };
    }
  }

  /**
   * Updates an existing bookmark.
   * @param {object} args - The arguments object.
   * @param {string} args.id - The GUID of the bookmark to update.
   * @param {string} [args.url] - The new URL for the bookmark.
   * @param {string} [args.parentID] - parent id
   *
   * @param {string} [args.title] - The new title for the bookmark.
   * @returns {Promise<object>} A promise that resolves with a success message or an error.
   */
  async function updateBookmark(args) {
    const { id, url, title, parentID } = args;
    if (!id) return { error: "updateBookmark requires a bookmark id (guid)." };
    if (!url && !title && !parentID)
      return {
        error: "updateBookmark requires either a new url, title, or parentID.",
      };

    try {
      const oldBookmark = await PlacesUtils.bookmarks.fetch(id);
      if (!oldBookmark) {
        return { error: `No bookmark found with id "${id}".` };
      }

      const bm = await PlacesUtils.bookmarks.update({
        guid: id,
        url: url ? new URL(url) : oldBookmark.url,
        title: title || oldBookmark.title,
        parentGuid: parentID || oldBookmark.parentGuid,
      });

      debugLog(`Bookmark updated successfully:`, JSON.stringify(bm));
      return { result: `Successfully updated bookmark to "${bm.title}".` };
    } catch (e) {
      debugError$1(`Error updating bookmark with id "${id}":`, e);
      return { error: `Failed to update bookmark.` };
    }
  }

  /**
   * Deletes a bookmark.
   * @param {object} args - The arguments object.
   * @param {string} args.id - The GUID of the bookmark to delete.
   * @returns {Promise<object>} A promise that resolves with a success message or an error.
   */

  async function deleteBookmark(args) {
    const { id } = args;
    if (!id) return { error: "deleteBookmark requires a bookmark id (guid)." };
    try {
      await PlacesUtils.bookmarks.remove(id);
      debugLog(`Bookmark with id "${id}" deleted successfully.`);
      return { result: `Successfully deleted bookmark.` };
    } catch (e) {
      debugError$1(`Error deleting bookmark with id "${id}":`, e);
      return { error: `Failed to delete bookmark.` };
    }
  }

  // ╭─────────────────────────────────────────────────────────╮
  // │                         ELEMENTS                        │
  // ╰─────────────────────────────────────────────────────────╯

  /**
   * Clicks an element on the page.
   * @param {object} args - The arguments object.
   * @param {string} args.selector - The CSS selector of the element to click.
   * @returns {Promise<object>} A promise that resolves with a success message or an error.
   */
  async function clickElement(args) {
    const { selector } = args;
    if (!selector) return { error: "clickElement requires a selector." };
    return messageManagerAPI.clickElement(selector);
  }

  /**
   * Fills a form input on the page.
   * @param {object} args - The arguments object.
   * @param {string} args.selector - The CSS selector of the input element to fill.
   * @param {string} args.value - The value to fill the input with.
   * @returns {Promise<object>} A promise that resolves with a success message or an error.
   */
  async function fillForm(args) {
    const { selector, value } = args;
    if (!selector) return { error: "fillForm requires a selector." };
    if (value === undefined) return { error: "fillForm requires a value." };
    return messageManagerAPI.fillForm(selector, value);
  }

  // Helper function to wrap tool execution with a confirmation dialog
  async function confirmAndExecute(toolName, executeFn, args) {
    if (PREFS.conformation) {
      const confirmed = await browseBotFindbar.createToolConfirmationDialog([toolName]);
      if (!confirmed) {
        debugLog(`Tool execution for '${toolName}' cancelled by user.`);
        return { error: `Tool execution for '${toolName}' was cancelled by the user.` };
      }
    }
    return executeFn(args);
  }

  const toolSet = {
    search: tool({
      description: "Performs a web search using a specified search engine and opens the results.",
      parameters: objectType({
        searchTerm: stringType().describe("The term to search for."),
        engineName: stringType().optional().describe("The name of the search engine to use."),
        where: stringType()
          .optional()
          .describe(
            "Where to open results. Options: 'current tab', 'new tab', 'new window', 'incognito', 'glance', 'vsplit', 'hsplit'. Default: 'new tab'."
          ),
      }),
      execute: (args) => confirmAndExecute("search", search, args),
    }),
    openLink: tool({
      description:
        "Opens a given URL in a specified location. Can also create a split view with the current tab.",
      parameters: objectType({
        link: stringType().describe("The URL to open."),
        where: stringType()
          .optional()
          .describe(
            "Where to open the link. Options: 'current tab', 'new tab', 'new window', 'incognito', 'glance', 'vsplit', 'hsplit'. Default: 'new tab'."
          ),
      }),
      execute: (args) => confirmAndExecute("openLink", openLink, args),
    }),
    newSplit: tool({
      description:
        "Creates a split view by opening two new URLs in two new tabs, then arranging them side-by-side.",
      parameters: objectType({
        link1: stringType().describe("The URL for the first new tab."),
        link2: stringType().describe("The URL for the second new tab."),
        type: stringType()
          .optional()
          .describe("The split type: 'horizontal' or 'vertical'. Defaults to 'vertical'."),
      }),
      execute: (args) => confirmAndExecute("newSplit", newSplit, args),
    }),
    getPageTextContent: tool({
      description:
        "Retrieves the text content of the current web page to answer questions if the initial context is insufficient.",
      parameters: objectType({}),
      execute: (args) =>
        confirmAndExecute(
          "getPageTextContent",
          messageManagerAPI.getPageTextContent.bind(messageManagerAPI),
          args
        ),
    }),
    getHTMLContent: tool({
      description:
        "Retrieves the full HTML source of the current web page for detailed analysis. Use this tool very rarely, only when text content is insufficient.",
      parameters: objectType({}),
      execute: (args) =>
        confirmAndExecute(
          "getHTMLContent",
          messageManagerAPI.getHTMLContent.bind(messageManagerAPI),
          args
        ),
    }),
    getYoutubeTranscript: tool({
      description:
        "Retrives the transcript of the current youtube video. Only use if current page is a youtube video.",
      parameters: objectType({}),
      execute: (args) =>
        confirmAndExecute(
          "getYoutubeTranscript",
          messageManagerAPI.getYoutubeTranscript.bind(messageManagerAPI),
          args
        ),
    }),
    searchBookmarks: tool({
      description: "Searches bookmarks based on a query.",
      parameters: objectType({
        query: stringType().describe("The search term for bookmarks."),
      }),
      execute: (args) => confirmAndExecute("searchBookmarks", searchBookmarks, args),
    }),
    getAllBookmarks: tool({
      description: "Retrieves all bookmarks.",
      parameters: objectType({}),
      execute: (args) => confirmAndExecute("getAllBookmarks", getAllBookmarks, args),
    }),
    createBookmark: tool({
      description: "Creates a new bookmark.",
      parameters: objectType({
        url: stringType().describe("The URL to bookmark."),
        title: stringType().optional().describe("The title for the bookmark."),
        parentID: stringType().optional().describe("The GUID of the parent folder."),
      }),
      execute: (args) => confirmAndExecute("createBookmark", createBookmark, args),
    }),
    addBookmarkFolder: tool({
      description: "Creates a new bookmark folder.",
      parameters: objectType({
        title: stringType().describe("The title for the new folder."),
        parentID: stringType().optional().describe("The GUID of the parent folder."),
      }),
      execute: (args) => confirmAndExecute("addBookmarkFolder", addBookmarkFolder, args),
    }),
    updateBookmark: tool({
      description: "Updates an existing bookmark.",
      parameters: objectType({
        id: stringType().describe("The GUID of the bookmark to update."),
        url: stringType().optional().describe("The new URL for the bookmark."),
        title: stringType().optional().describe("The new title for the bookmark."),
        parentID: stringType().optional().describe("The GUID of the parent folder."),
      }),
      execute: (args) => confirmAndExecute("updateBookmark", updateBookmark, args),
    }),
    deleteBookmark: tool({
      description: "Deletes a bookmark.",
      parameters: objectType({
        id: stringType().describe("The GUID of the bookmark to delete."),
      }),
      execute: (args) => confirmAndExecute("deleteBookmark", deleteBookmark, args),
    }),
    clickElement: tool({
      description: "Clicks an element on the page.",
      parameters: objectType({
        selector: stringType().describe("The CSS selector of the element to click."),
      }),
      execute: (args) => confirmAndExecute("clickElement", clickElement, args),
    }),
    fillForm: tool({
      description: "Fills a form input on the page.",
      parameters: objectType({
        selector: stringType().describe("The CSS selector of the input element to fill."),
        value: stringType().describe("The value to fill the input with."),
      }),
      execute: (args) => confirmAndExecute("fillForm", fillForm, args),
    }),
  };

  const getToolSystemPrompt = async () => {
    try {
      const searchEngines = await Services.search.getVisibleEngines();
      const engineNames = searchEngines.map((e) => e.name).join(", ");
      const defaultEngineName = Services.search.defaultEngine.name;
      return `
- When asked about your own abilities, describe the functions you can perform based on the tools listed below.

## GOD MODE ENABLED - TOOL USAGE:
You have access to browser functions. The user knows you have these abilities.
- **CRITICAL**: When you decide to call a tool, give short summary of what tool are you calling and why?
- Use tools when the user explicitly asks, or when it is the only logical way to fulfill their request (e.g., "search for...").

## Available Tools:
- \`search(searchTerm, engineName, where)\`: Performs a web search. Available engines: ${engineNames}. The default is '${defaultEngineName}'.
- \`openLink(link, where)\`: Opens a URL. Use this to open a single link or to create a split view with the *current* tab.
- \`newSplit(link1, link2, type)\`: Use this specifically for creating a split view with *two new tabs*.
- \`getPageTextContent()\` / \`getHTMLContent()\`: Use these to get updated page information if context is missing. Prefer \`getPageTextContent\`.
- \`searchBookmarks(query)\`: Searches your bookmarks for a specific query.
- \`getAllBookmarks()\`: Retrieves all of your bookmarks.
- \`createBookmark(url, title, parentID)\`: Creates a new bookmark.  The \`parentID\` is optional and should be the GUID of the parent folder. Defaults to the "Bookmarks Toolbar" folder which has GUID: \`PlacesUtils.bookmarks.toolbarGuid\`.
- \`addBookmarkFolder(title, parentID)\`: Creates a new bookmark folder. The \`parentID\` is optional and should be the GUID of the parent folder. Defaults to the "Bookmarks Toolbar" folder which has GUID: \`PlacesUtils.bookmarks.toolbarGuid\`.
- \`updateBookmark(id, url, title, parentID)\`: Updates an existing bookmark.  The \`id\` is the GUID of the bookmark.  You must provide the ID and either a new URL or a new title or new parentID (or any one or two).
- \`deleteBookmark(id)\`: Deletes a bookmark.  The \`id\` is the GUID of the bookmark.
- \`clickElement(selector)\`: Clicks an element on the page.
- \`fillForm(selector, value)\`: Fills a form input on the page.

## More instructions for Running tools
- While running tool like \`openLink\` and \`newSplit\` make sure URL is valid.
- User will provide URL and title of current of webpage. If you need more context, use the \`getPageTextContent\` or \`getHTMLContent\` tools.
- When the user asks you to "read the current page", use the \`getPageTextContent()\` or \`getHTMLContent\` tool.
- If the user asks you to open a link by its text (e.g., "click the 'About Us' link"), you must first use \`getHTMLContent()\` to find the link's full URL, then use \`openLink()\` to open it.

## Tool Call Examples:
Therse are just examples for you on how you can use tools calls, each example give you some concept, the concept is not specific to single tool.

### Use default value when user don't provides full information, If user don't provide default value you may ask and even give options if possible
#### Searching the Web: 
-   **User Prompt:** "search for firefox themes"
-   **Your Tool Call:** \`{"functionCall": {"name": "search", "args": {"searchTerm": "firefox themes", "engineName": "${defaultEngineName}"}}}\`

### Make sure you are calling tools with correct parameters.
#### Opening a Single Link:
-   **User Prompt:** "open github"
-   **Your Tool Call:** \`{"functionCall": {"name": "openLink", "args": {"link": "https://github.com", "where": "new tab"}}}\`

#### Creating a Split View with Two New Pages:
-   **User Prompt:** "show me youtube and twitch side by side"
-   **Your Tool Call:** \`{"functionCall": {"name": "newSplit", "args": {"link1": "https://youtube.com", "link2": "https://twitch.tv"}}}\`

### Use tools to get more context: If user ask anything whose answer is unknown to you and it can be obtained via tool call use it.
#### Reading the Current Page for Context
-   **User Prompt:** "summarize this page for me"
-   **Your Tool Call:** \`{"functionCall": {"name": "getPageTextContent", "args": {}}}\`

### Taking multiple steps; you might need for previous tool to compete and give you output before calling next tool
#### Finding and Clicking a Link on the Current Page
-   **User Prompt:** "click on the contact link"
-   **Your First Tool Call:** \`{"functionCall": {"name": "getHTMLContent", "args": {}}}\`
-   **Your Second Tool Call (after receiving HTML and finding the link):** \`{"functionCall": {"name": "openLink", "args": {"link": "https://example.com/contact-us"}}}\`

#### Finding and Editing a bookmark by folder name:
-   **User Prompt:** "Move bookmark titled 'Example' to folder 'MyFolder'"
-   **Your First Tool Call:** \`{"functionCall": {"name": "searchBookmarks", "args": {"query": "Example"}}}\`
-   **Your Second Tool Call:** \`{"functionCall": {"name": "searchBookmarks", "args": {"query": "MyFolder"}}}\`
-   **Your Third Tool Call (after receiving the bookmark and folder ids):** \`{"functionCall": {"name": "updateBookmark", "args": {"id": "xxxxxxxxxxxx", "parentID": "yyyyyyyyyyyy"}}}\`
Note that first and second tool clls can be made in parallel, but the third tool call needs output from the first and second tool calls so it must be made after first and second.

#### Filling a form:
-   **User Prompt:** "Fill the name with John and submit"
-   **Your First Tool Call:** \`{"functionCall": {"name": "getHTMLContent", "args": {}}}\`
-   **Your Second Tool Call:** \`{"functionCall": {"name": "fillForm", "args": {"selector": "#name", "value": "John"}}}\`
-   **Your Third Tool Call:** \`{"functionCall": {"name": "clickElement", "args": {"selector": "#submit-button"}}}\`

### Calling multiple tools at once.
#### Making 2 searches in split 
-   **User Prompt:** "Search for Japan in google and search for America in Youtube. Open them in vertical split."
-   **Your First Tool Call:** \`{"functionCall": {"name": "search", "args": {"searchTerm": "Japan", "engineName": "Google", "where": "new tab"}}}\`
-   **Your Second Tool Call:** \`{"functionCall": {"name": "search", "args": {"searchTerm": "America", "engineName": "Youtube", "where": "vsplit"}}}\`

*(Available search engines: ${engineNames}. Default is '${defaultEngineName}'.)*
`;
    } catch (error) {
      debugError$1("Error in getToolSystemPrompt:", error);
      return "";
    }
  };

  const citationSchema = objectType({
    answer: stringType().describe("The conversational answer to the user's query."),
    citations: arrayType(
        objectType({
          id: numberType()
            .describe(
              "Unique identifier for the citation, corresponding to the marker in the answer text."
            ),
          source_quote: stringType()
            .describe(
              "The exact, verbatim quote from the source text that supports the information."
            ),
        })
      )
      .describe("An array of citation objects from the source text."),
  });

  const llm = {
    history: [],
    systemInstruction: "",
    AVAILABLE_PROVIDERS: {
      claude: claude,
      gemini: gemini,
      grok: grok,
      mistral: mistral,
      ollama: ollamaProvider,
      openai: openai,
      perplexity: perplexity,
    },
    get currentProvider() {
      const providerName = PREFS.llmProvider || "gemini";
      return this.AVAILABLE_PROVIDERS[providerName];
    },
    setProvider(providerName) {
      if (this.AVAILABLE_PROVIDERS[providerName]) {
        PREFS.llmProvider = providerName;
        this.clearData();
        debugLog(`Switched LLM provider to: ${providerName}`);
      } else {
        debugError$1(`Provider "${providerName}" not found.`);
      }
    },
    async updateSystemPrompt() {
      debugLog("Updating system prompt...");
      const promptText = await this.getSystemPrompt();
      this.setSystemPrompt(promptText);
    },
    async getSystemPrompt() {
      let systemPrompt = `You are a helpful AI assistant integrated into Zen Browser, a minimal and modern fork of Firefox. Your primary purpose is to answer user questions based on the content of the current webpage.

## Your Instructions:
- Be concise, accurate, and helpful.`;

      if (PREFS.godMode) {
        systemPrompt += await getToolSystemPrompt();
      }

      if (PREFS.citationsEnabled) {
        systemPrompt += `

## Citation Instructions
- **Output Format**: Your entire response **MUST** be a single, valid JSON object with two keys: \`"answer"\` and \`"citations"\`.
- **Answer**: The \`"answer"\` key holds the conversational text. Use Markdown Syntax for formatting like lists, bolding, etc.
- **Citations**: The \`"citations"\` key holds an array of citation objects.
- **When to Cite**: For any statement of fact that is directly supported by the provided page content, you **SHOULD** provide a citation. It is not mandatory for every sentence.
- **How to Cite**: In your \`"answer"\`, append a marker like \`[1]\`, \`[2]\`. Each marker must correspond to a citation object in the array.
- **CRITICAL RULES FOR CITATIONS**:
    1.  **source_quote**: This MUST be the **exact, verbatim, and short** text from the page content.
    2.  **Accuracy**: The \`"source_quote"\` field must be identical to the text on the page, including punctuation and casing.
    3.  **Multiple Citations**: If multiple sources support one sentence, format them like \`[1][2]\`, not \`[1,2]\`.
    4.  **Unique IDs**: Each citation object **must** have a unique \`"id"\` that matches its marker in the answer text.
    5.  **Short**: The source quote must be short no longer than one sentence and should not contain line brakes.
- **Do Not Cite**: Do not cite your own abilities, general greetings, or information not from the provided text. Make sure the text is from page text content not from page title or URL.
- **Tool Calls**: If you call a tool, you **must not** provide citations in the same turn.

### Citation Examples

Here are some examples demonstrating the correct JSON output format.

**Example 1: General Question with a List and Multiple Citations**
-   **User Prompt:** "What are the main benefits of using this library?"
-   **Your JSON Response:**
    \`\`\`json
    {
      "answer": "This library offers several key benefits:\n\n*   **High Performance**: It is designed to be fast and efficient for large-scale data processing [1].\n*   **Flexibility**: You can integrate it with various frontend frameworks [2].\n*   **Ease of Use**: The API is well-documented and simple to get started with [3].",
      "citations": [
        {
          "id": 1,
          "source_quote": "The new architecture provides significant performance gains, especially for large-scale data processing."
        },
        {
          "id": 2,
          "source_quote": "It is framework-agnostic, offering adapters for React, Vue, and Svelte."
        },
        {
          "id": 3,
          "source_quote": "Our extensive documentation and simple API make getting started a breeze."
        }
      ]
    }
    \`\`\`

**Example 2: A Sentence Supported by Two Different Sources**
-   **User Prompt:** "Tell me about the project's history."
-   **Your JSON Response:**
    \`\`\`json
    {
      "answer": "The project was initially created in 2021 [1] and later became open-source in 2022 [2].",
      "citations": [
        {
          "id": 1,
          "source_quote": "Development began on the initial prototype in early 2021."
        },
        {
          "id": 2,
          "source_quote": "We are proud to announce that as of September 2022, the project is fully open-source."
        }
      ]
    }
    \`\`\`

**Example 3: The WRONG way (What NOT to do)**
This is incorrect because it uses one citation \`[1]\` for three different facts. This is lazy and unhelpful.
-   **Your JSON Response (Incorrect):**
    \`\`\`json
    {
      "answer": "This project is a toolkit for loading custom JavaScript into the browser [1]. Its main features include a modern UI [1] and an API for managing hotkeys and notifications [1].",
      "citations": [
        {
          "id": 1,
          "source_quote": "...a toolkit for loading custom JavaScript... It has features like a modern UI... provides an API for hotkeys and notifications..."
        }
      ]
    }
    \`\`\`

**Example 4: The WRONG way (What NOT to do)**
This is incorrect because it uses one citation same id for all facts.
\`\`\`json
{
  "answer": "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletion [1]. It is built with Tiptap and Vercel AI SDK [1]. You can install it using npm [1]. Features include a slash menu, bubble menu, AI autocomplete, and image uploads [1].",
  "citations": [
    {
      "id": 1,
      "source_quote": "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletion."
    },
    {
      "id": 1,
      "source_quote": "Built with Tiptap + Vercel AI SDK."
    },
    {
      "id": 1,
      "source_quote": "Installation npm i novel"
    },
    {
      "id": 1,
      "source_quote": "Features Slash menu & bubble menu AI autocomplete (type ++ to activate, or select from slash menu) Image uploads (drag & drop / copy & paste, or select from slash menu)"
    }
  ]
}
\`\`\`

**Example 5: The correct format of previous example**
This example is correct, note that it contain unique \`id\`, and each in text citation match to each citation \`id\`.
\`\`\`json
{
  "answer": "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletion [1]. It is built with Tiptap and Vercel AI SDK [2]. You can install it using npm [3]. Features include a slash menu, bubble menu, AI autocomplete, and image uploads [4].",
  "citations": [
    {
      "id": 1,
      "source_quote": "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletion."
    },
    {
      "id": 2,
      "source_quote": "Built with Tiptap + Vercel AI SDK."
    },
    {
      "id": 3,
      "source_quote": "Installation npm i novel"
    },
    {
      "id": 4,
      "source_quote": "Features Slash menu & bubble menu AI autocomplete (type ++ to activate, or select from slash menu) Image uploads (drag & drop / copy & paste, or select from slash menu)"
    }
  ]
}
\`\`\`
`;
      }

      if (!PREFS.godMode) {
        systemPrompt += `
- Strictly base all your answers on the webpage content provided below.
- If the user's question cannot be answered from the content, state that the information is not available on the page.

Here is the initial info about the current page:
`;
        const pageContext = await messageManagerAPI.getPageTextContent(!PREFS.citationsEnabled);
        systemPrompt += JSON.stringify(pageContext);
      }
      // debugLog("Final System Prompt:", systemPrompt);
      return systemPrompt;
    },
    setSystemPrompt(promptText) {
      this.systemInstruction = promptText || "";
    },

    parseModelResponseText(responseText) {
      let answer = responseText;
      let citations = [];

      if (PREFS.citationsEnabled) {
        try {
          // Find the JSON part of the response
          const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : responseText;
          const parsedContent = JSON.parse(jsonString);

          if (typeof parsedContent.answer === "string") {
            answer = parsedContent.answer;
            if (Array.isArray(parsedContent.citations)) {
              citations = parsedContent.citations;
            }
          } else {
            // Parsed JSON but 'answer' field is missing or not a string.
            debugLog("AI response JSON missing 'answer' field or not a string:", parsedContent);
          }
        } catch (e) {
          // JSON parsing failed, keep rawText as answer.
          debugError$1("Failed to parse AI message content as JSON:", e, "Raw Text:", responseText);
        }
      }
      return { answer, citations };
    },

    async sendMessage(prompt, abortSignal) {
      await this.updateSystemPrompt();

      this.history.push({ role: "user", content: prompt });
      debugLog("Current history before sending:", this.history);

      const model = this.currentProvider.getModel();
      debugLog(`Using provider: ${this.currentProvider.name}, model: ${this.currentProvider.model}`);
      // debugLog("System instruction for this call:", this.systemInstruction);

      // Citation Mode using generateObject (non-streaming)
      if (PREFS.citationsEnabled) {
        const { object } = await generateObject({
          model,
          schema: citationSchema,
          mode: "tool",
          system: this.systemInstruction,
          messages: this.history,
          abortSignal,
        });

        // Manually add the assistant's structured response to the history
        this.history.push({ role: "assistant", content: JSON.stringify(object) });

        if (browseBotFindbar?.findbar && PREFS.persistChat) {
          browseBotFindbar.findbar.history = this.getHistory();
        }

        return object;
      }

      const commonConfig = {
        model,
        system: this.systemInstruction,
        messages: this.history,
        tools: PREFS.godMode ? toolSet : undefined,
        maxSteps: PREFS.godMode ? PREFS.maxToolCalls : 1,
        abortSignal,
      };

      // Non-Citation Mode (Streaming or Non-Streaming)
      if (PREFS.streamEnabled) {
        return streamText({
          ...commonConfig,
          async onFinish({ response }) {
            llm.history.push(...response.messages);
            if (browseBotFindbar?.findbar && PREFS.persistChat) {
              browseBotFindbar.findbar.history = llm.getHistory();
            }
          },
        });
      } else {
        const result = await generateText(commonConfig);
        this.history.push(...result.response.messages);
        if (browseBotFindbar?.findbar && PREFS.persistChat) {
          browseBotFindbar.findbar.history = this.getHistory();
        }
        return result;
      }
    },
    getHistory() {
      return [...this.history];
    },
    clearData() {
      debugLog("Clearing LLM history and system prompt.");
      this.history = [];
      this.setSystemPrompt("");
    },
    getLastMessage() {
      return this.history.length > 0 ? this.history[this.history.length - 1] : null;
    },
  };

  const parseElement = (elementString, type = "html") => {
    if (type === "xul") {
      return window.MozXULElement.parseXULToFragment(elementString).firstChild;
    }

    let element = new DOMParser().parseFromString(elementString, "text/html");
    if (element.body.children.length) element = element.body.firstChild;
    else element = element.head.firstChild;
    return element;
  };

  const escapeXmlAttribute = (str) => {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const SettingsModal = {
    _modalElement: null,
    _currentPrefValues: {},

    _getSafeIdForProvider(providerName) {
      return providerName.replace(/\./g, "-");
    },

    createModalElement() {
      const settingsHtml = this._generateSettingsHtml();
      const container = parseElement(settingsHtml);
      this._modalElement = container;

      const providerOptionsXUL = Object.entries(llm.AVAILABLE_PROVIDERS)
        .map(
          ([name, provider]) =>
            `<menuitem
            value="${name}"
            label="${escapeXmlAttribute(provider.label)}"
            ${name === PREFS.llmProvider ? 'selected="true"' : ""}
            ${provider.faviconUrl ? `image="${escapeXmlAttribute(provider.faviconUrl)}"` : ""}
          />`
        )
        .join("");

      const menulistXul = `
      <menulist id="pref-llm-provider" data-pref="${PREFS.LLM_PROVIDER}" value="${PREFS.llmProvider}">
        <menupopup>
          ${providerOptionsXUL}
        </menupopup>
      </menulist>`;

      const providerSelectorXulElement = parseElement(menulistXul, "xul");
      const placeholder = this._modalElement.querySelector("#llm-provider-selector-placeholder");
      if (placeholder) {
        placeholder.replaceWith(providerSelectorXulElement);
      }

      const positionOptions = {
        "top-left": "Top Left",
        "top-right": "Top Right",
        "bottom-left": "Bottom Left",
        "bottom-right": "Bottom Right",
      };
      const positionOptionsXUL = Object.entries(positionOptions)
        .map(
          ([value, label]) =>
            `<menuitem
            value="${value}"
            label="${escapeXmlAttribute(label)}"
            ${value === PREFS.position ? 'selected="true"' : ""}
          />`
        )
        .join("");

      const positionMenulistXul = `
      <menulist id="pref-position" data-pref="${PREFS.POSITION}" value="${PREFS.position}">
        <menupopup>
          ${positionOptionsXUL}
        </menupopup>
      </menulist>`;
      const positionSelectorXulElement = parseElement(positionMenulistXul, "xul");
      const positionPlaceholder = this._modalElement.querySelector("#position-selector-placeholder");

      if (positionPlaceholder) {
        positionPlaceholder.replaceWith(positionSelectorXulElement);
      }

      for (const [name, provider] of Object.entries(llm.AVAILABLE_PROVIDERS)) {
        const modelPrefKey = provider.modelPref;
        const currentModel = provider.model;

        const modelOptionsXUL = provider.AVAILABLE_MODELS.map(
          (model) =>
            `<menuitem
              value="${model}"
              label="${escapeXmlAttribute(provider.AVAILABLE_MODELS_LABELS[model] || model)}"
              ${model === currentModel ? 'selected="true"' : ""}
            />`
        ).join("");

        const modelMenulistXul = `
          <menulist id="pref-${this._getSafeIdForProvider(name)}-model" data-pref="${modelPrefKey}" value="${currentModel}">
            <menupopup>
              ${modelOptionsXUL}
            </menupopup>
          </menulist>`;

        const modelPlaceholder = this._modalElement.querySelector(
          `#llm-model-selector-placeholder-${this._getSafeIdForProvider(name)}`
        );
        if (modelPlaceholder) {
          const modelSelectorXulElement = parseElement(modelMenulistXul, "xul");
          modelPlaceholder.replaceWith(modelSelectorXulElement);
        }
      }

      this._attachEventListeners();
      return container;
    },

    _attachEventListeners() {
      if (!this._modalElement) return;

      // Close button
      this._modalElement.querySelector("#close-settings").addEventListener("click", () => {
        this.hide();
      });

      // Save button
      this._modalElement.querySelector("#save-settings").addEventListener("click", () => {
        this.saveSettings();
        this.hide();
        if (browseBotFindbar.enabled) browseBotFindbar.show();
        else browseBotFindbar.destroy();
      });

      this._modalElement.addEventListener("click", (e) => {
        if (e.target === this._modalElement) {
          this.hide();
        }
      });

      this._modalElement.querySelectorAll(".accordion-header").forEach((header) => {
        header.addEventListener("click", () => {
          const section = header.closest(".settings-accordion");
          const isExpanded = section.dataset.expanded === "true";
          section.dataset.expanded = isExpanded ? "false" : "true";
        });
      });

      // Initialize and listen to changes on controls (store in _currentPrefValues)
      this._modalElement.querySelectorAll("[data-pref]").forEach((control) => {
        const prefKey = control.dataset.pref;

        // Initialize control value from PREFS
        if (control.type === "checkbox") {
          control.checked = PREFS.getPref(prefKey);
        } else if (control.tagName.toLowerCase() === "menulist") {
          control.value = PREFS.getPref(prefKey);
        } else {
          control.value = PREFS.getPref(prefKey);
        }

        this._currentPrefValues[prefKey] = PREFS.getPref(prefKey);

        // Store changes in _currentPrefValues
        if (control.tagName.toLowerCase() === "menulist") {
          control.addEventListener("command", (e) => {
            this._currentPrefValues[prefKey] = e.target.value;
            debugLog(
              `Settings form value for ${prefKey} changed to: ${this._currentPrefValues[prefKey]}`
            );
            if (prefKey === PREFS.LLM_PROVIDER) {
              this._updateProviderSpecificSettings(
                this._modalElement,
                this._currentPrefValues[prefKey]
              );
            }
          });
        } else {
          control.addEventListener("change", (e) => {
            if (control.type === "checkbox") {
              this._currentPrefValues[prefKey] = e.target.checked;
            } else if (control.type === "number") {
              try {
                this._currentPrefValues[prefKey] = Number(e.target.value);
              } catch (error) {
                this._currentPrefValues[prefKey] = 0;
              }
            } else {
              this._currentPrefValues[prefKey] = e.target.value;
            }
            debugLog(
              `Settings form value for ${prefKey} changed to: ${this._currentPrefValues[prefKey]}`
            );
          });
        }
      });

      // Attach event listeners for API key links
      this._modalElement.querySelectorAll(".get-api-key-link").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const url = e.target.dataset.url;
          if (url) {
            openTrustedLinkIn(url, "tab");
            this.hide();
          }
        });
      });

      // Initial update for provider-specific settings display
      this._updateProviderSpecificSettings(this._modalElement, PREFS.llmProvider);
    },

    saveSettings() {
      for (const prefKey in this._currentPrefValues) {
        if (Object.prototype.hasOwnProperty.call(this._currentPrefValues, prefKey)) {
          if (prefKey.endsWith("api-key")) {
            if (this._currentPrefValues[prefKey]){
            const maskedKey = "*".repeat(this._currentPrefValues[prefKey].length);
            debugLog(`Saving pref ${prefKey} to: ${maskedKey}`);
            }
          } else {
            debugLog(`Saving pref ${prefKey} to: ${this._currentPrefValues[prefKey]}`);
          }
          try{
          PREFS.setPref(prefKey, this._currentPrefValues[prefKey]);
          }catch(e){debugError(`Error Saving pref for ${prefKey} ${e}`);}
        }
      }
      // Special case: If API key is empty after saving, ensure findbar is collapsed
      if (!llm.currentProvider.apiKey) {
        browseBotFindbar.expanded = false;
      }
    },

    show() {
      this.createModalElement();
      this._modalElement.querySelectorAll("[data-pref]").forEach((control) => {
        const prefKey = control.dataset.pref;
        if (control.type === "checkbox") {
          control.checked = PREFS.getPref(prefKey);
        } else {
          // For XUL menulist, ensure its value is set correctly on show
          if (control.tagName.toLowerCase() === "menulist") {
            control.value = PREFS.getPref(prefKey);
          } else {
            control.value = PREFS.getPref(prefKey);
          }
        }
        this._currentPrefValues[prefKey] = PREFS.getPref(prefKey);
      });
      this._updateProviderSpecificSettings(this._modalElement, PREFS.llmProvider);

      document.documentElement.appendChild(this._modalElement);
    },

    hide() {
      if (this._modalElement && this._modalElement.parentNode) {
        this._modalElement.remove();
      }
    },

    // Helper to show/hide provider-specific settings sections and update model dropdowns
    _updateProviderSpecificSettings(container, selectedProviderName) {
      container.querySelectorAll(".provider-settings-group").forEach((group) => {
        group.style.display = "none";
      });

      // Use the safe ID for the selector
      const activeGroup = container.querySelector(
        `#${this._getSafeIdForProvider(selectedProviderName)}-settings-group`
      );
      if (activeGroup) {
        activeGroup.style.display = "block";

        // Dynamically update the model dropdown for the active provider
        const modelPrefKey = PREFS[`${selectedProviderName.toUpperCase()}_MODEL`];
        if (modelPrefKey) {
          // Use the safe ID for the model selector as well
          const modelSelect = activeGroup.querySelector(
            `#pref-${this._getSafeIdForProvider(selectedProviderName)}-model`
          );
          if (modelSelect) {
            modelSelect.value = this._currentPrefValues[modelPrefKey] || PREFS.getPref(modelPrefKey);
          }
        }
        // Update the "Get API Key" link's state for the active provider
        const provider = llm.AVAILABLE_PROVIDERS[selectedProviderName];
        const getApiKeyLink = activeGroup.querySelector(".get-api-key-link");
        if (getApiKeyLink) {
          if (provider.apiKeyUrl) {
            getApiKeyLink.style.display = "inline-block";
            getApiKeyLink.dataset.url = provider.apiKeyUrl;
          } else {
            getApiKeyLink.style.display = "none";
            delete getApiKeyLink.dataset.url;
          }
        }
      }
    },

    _generateCheckboxSettingHtml(label, prefConstant) {
      const prefId = `pref-${prefConstant.toLowerCase().replace(/_/g, "-")}`;
      return `
      <div class="setting-item">
        <label for="${prefId}">${label}</label>
        <input type="checkbox" id="${prefId}" data-pref="${prefConstant}" />
      </div>
    `;
    },

    _createCheckboxSectionHtml(
      title,
      settingsArray,
      expanded = true,
      contentBefore = "",
      contentAfter = ""
    ) {
      const settingsHtml = settingsArray
        .map((s) => this._generateCheckboxSettingHtml(s.label, s.pref))
        .join("");
      return `
    <section class="settings-section settings-accordion" data-expanded="${expanded}" >
      <h4 class="accordion-header">${title}</h4>
      <div class="accordion-content">
        ${contentBefore}
        ${settingsHtml}
        ${contentAfter}
      </div>
    </section>
  `;
    },

    _generateSettingsHtml() {
      const generalSettings = [
        { label: "Enable AI Findbar", pref: PREFS.ENABLED },
        { label: "Minimal Mode (similar to arc)", pref: PREFS.MINIMAL },
        { label: "Persist Chat (don't persist when browser closes)", pref: PREFS.PERSIST },
        { label: "Debug Mode (logs in console)", pref: PREFS.DEBUG_MODE },
        { label: "Enable Drag and Drop", pref: PREFS.DND_ENABLED },
      ];
      const positionSelectorPlaceholderHtml = `
      <div class="setting-item">
        <label for="pref-position">Position</label>
        <div id="position-selector-placeholder"></div>
      </div>
    `;
      const generalSectionHtml = this._createCheckboxSectionHtml(
        "General",
        generalSettings,
        true,
        "",
        positionSelectorPlaceholderHtml
      );

      const aiBehaviorSettings = [
        { label: "Enable Citations", pref: PREFS.CITATIONS_ENABLED },
        { label: "Stream Response", pref: PREFS.STREAM_ENABLED },
        { label: "God Mode (AI can use tool calls)", pref: PREFS.GOD_MODE },
        { label: "Conformation before tool call", pref: PREFS.CONFORMATION },
      ];
      const aiBehaviorWarningHtml = `
      <div id="citations-god-mode-warning" class="warning-message" >
        Warning: Enabling both Citations and God Mode may lead to unexpected behavior or errors.
      </div>
    `;
      const maxToolCallsHtml = `
  <div class="setting-item">
    <label for="pref-max-tool-calls">Max Tool Calls (Maximum number of messages to send AI back to back)</label>
    <input type="number" id="pref-max-tool-calls" data-pref="${PREFS.MAX_TOOL_CALLS}" />
  </div>
`;

      const aiBehaviorSectionHtml = this._createCheckboxSectionHtml(
        "AI Behavior",
        aiBehaviorSettings,
        true,
        aiBehaviorWarningHtml,
        maxToolCallsHtml
      );

      // Context Menu Settings
      const contextMenuSettings = [
        { label: "Enable Context Menu (right click menu)", pref: PREFS.CONTEXT_MENU_ENABLED },
        {
          label: "Auto Send from Context Menu",
          pref: PREFS.CONTEXT_MENU_AUTOSEND,
        },
      ];
      const contextMenuSectionHtml = this._createCheckboxSectionHtml(
        "Context Menu",
        contextMenuSettings
      );

      const browserFindbarSettings = [
        { label: "Find as you Type", pref: "accessibility.typeaheadfind" },
        {
          label: "Enable sound (when word not found)",
          pref: "accessibility.typeaheadfind.enablesound",
        },
        { label: "Entire Word", pref: "findbar.entireword" },
        { label: "Highlight All", pref: "findbar.highlightAll" },
      ];
      const browserSettingsHtml = this._createCheckboxSectionHtml(
        "Browser Findbar",
        browserFindbarSettings,
        false
      );

      let llmProviderSettingsHtml = "";
      for (const [name, provider] of Object.entries(llm.AVAILABLE_PROVIDERS)) {
        const apiPrefKey = PREFS[`${name.toUpperCase()}_API_KEY`];
        const modelPrefKey = PREFS[`${name.toUpperCase()}_MODEL`];

        const apiInputHtml = apiPrefKey
          ? `
        <div class="setting-item">
          <label for="pref-${this._getSafeIdForProvider(name)}-api-key">API Key</label>
          <input type="password" id="pref-${this._getSafeIdForProvider(name)}-api-key" data-pref="${apiPrefKey}" placeholder="Enter ${provider.label} API Key" />
        </div>
      `
          : "";

        // Placeholder for the XUL menulist, which will be inserted dynamically in createModalElement
        const modelSelectPlaceholderHtml = modelPrefKey
          ? `
        <div class="setting-item">
          <label for="pref-${this._getSafeIdForProvider(name)}-model">Model</label>
          <div id="llm-model-selector-placeholder-${this._getSafeIdForProvider(name)}"></div>
        </div>
      `
          : "";

        llmProviderSettingsHtml += `
        <div id="${this._getSafeIdForProvider(name)}-settings-group" class="provider-settings-group">
          <div class="provider-header-group">
            <h5>${provider.label}</h5>
            <button class="get-api-key-link" data-url="${provider.apiKeyUrl || ""}" style="display: ${provider.apiKeyUrl ? "inline-block" : "none"};">Get API Key</button>
          </div>
          ${apiInputHtml}
          ${modelSelectPlaceholderHtml}
        </div>
      `;
      }

      const llmProvidersSectionHtml = `
      <section class="settings-section settings-accordion" data-expanded="false">
        <h4 class="accordion-header">LLM Providers</h4>
        <div class="setting-item accordion-content" class="">
          <label for="pref-llm-provider">Select Provider</label>
          <div id="llm-provider-selector-placeholder"></div>
        </div>
        ${llmProviderSettingsHtml}
      </section>`;

      return `
      <div id="ai-settings-modal-overlay">
        <div class="browse-bot-settings-modal">
          <div class="ai-settings-header">
            <h3>Settings</h3>
            <div>
              <button id="close-settings" class="settings-close-btn">Close</button>
              <button id="save-settings" class="settings-save-btn">Save</button>
            </div>
          </div>
          <div class="ai-settings-content">
            ${generalSectionHtml}
            ${aiBehaviorSectionHtml}
            ${contextMenuSectionHtml}
            ${llmProvidersSectionHtml}
            ${browserSettingsHtml}
          </div>
        </div>
      </div>
    `;
    },
  };

  var markdownStylesInjected = false;
  const injectMarkdownStyles = async () => {
    try {
      const { markedStyles } = await import('chrome://userscripts/content/engine/marked.js');
      const styleTag = parseElement(`<style>${markedStyles}<style>`);
      document.head.appendChild(styleTag);
      markdownStylesInjected = true;
      return true;
    } catch (e) {
      debugError$1(e);
      return false;
    }
  };

  function parseMD(markdown) {
    const markedOptions = { breaks: true, gfm: true };
    if (!markdownStylesInjected) {
      injectMarkdownStyles();
    }
    const content = window.marked ? window.marked.parse(markdown, markedOptions) : markdown;
    let htmlContent = parseElement(`<div class="markdown-body">${content}</div>`);

    return htmlContent;
  }

  PREFS.setInitialPrefs();
  const browseBotFindbar = {
    findbar: null,
    expandButton: null,
    chatContainer: null,
    apiKeyContainer: null,
    _updateFindbar: null,
    _addKeymaps: null,
    _handleInputKeyPress: null,
    _handleFindFieldInput: null,
    _isExpanded: false,
    _updateContextMenuText: null,
    _godModeListener: null,
    _citationsListener: null,
    _contextMenuEnabledListener: null,
    _persistListener: null,
    _minimalListener: null,
    _dndListener: null,
    contextMenuItem: null,
    _matchesObserver: null,
    _isDragging: false,
    _startDrag: null,
    _stopDrag: null,
    _handleDrag: null,
    _initialContainerCoor: { x: null, y: null },
    _initialMouseCoor: { x: null, y: null },
    _startWidth: null,
    _resizeHandle: null,
    _isResizing: false,
    _startResize: null,
    _stopResize: null,
    _handleResize: null,
    _handleResizeEnd: null,
    _toolConfirmationDialog: null,
    _isStreaming: false,
    _abortController: null,

    get expanded() {
      return this._isExpanded;
    },
    set expanded(value) {
      const isChanged = value !== this._isExpanded;
      this._isExpanded = value;
      if (!this.findbar) return;
      this.findbar.expanded = value;

      if (value) {
        this.findbar.classList.add("ai-expanded");
        this.show();
        this.showAIInterface();
        if (isChanged) this.focusPrompt();
        const messagesContainer = this?.chatContainer?.querySelector("#chat-messages");
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      } else {
        if (this._isStreaming) {
          this._abortController?.abort();
        }
        this.findbar.classList.remove("ai-expanded");
        this.removeAIInterface();
        if (isChanged && !this.minimal) this.focusInput();
      }
    },
    toggleExpanded() {
      this.expanded = !this.expanded;
    },

    get enabled() {
      return PREFS.enabled;
    },
    set enabled(value) {
      if (typeof value === "boolean") PREFS.enabled = value;
    },
    toggleEnabled() {
      this.enabled = !this.enabled;
    },
    handleEnabledChange(enabled) {
      if (enabled.value) this.init();
      else this.destroy();
    },

    get minimal() {
      return PREFS.minimal;
    },
    set minimal(value) {
      if (typeof value === "boolean") PREFS.minimal = value;
    },

    handleMinimalPrefChange: function () {
      this.removeExpandButton();
      this.addExpandButton();
      this.removeAIInterface();
      this.showAIInterface();
    },

    createToolConfirmationDialog(toolNames) {
      return new Promise((resolve) => {
        const dialog = parseElement(`
        <div class="tool-confirmation-dialog">
          <div class="tool-confirmation-content">
            <p>Allow the following tools to run: ${toolNames?.join(", ")}?</p>
            <div class="buttons">
              <button class="not-again">Don't ask again</button>
              <div class="right-side-buttons">
                <button class="confirm-tool">Yes</button>
                <button class="cancel-tool">No</button>
              </div>
            </div>
          </div>
        </div>
      `);
        this._toolConfirmationDialog = dialog;

        const removeDilog = () => {
          dialog.remove();
          this._toolConfirmationDialog = null;
        };

        const confirmButton = dialog.querySelector(".confirm-tool");
        confirmButton.addEventListener("click", () => {
          removeDilog();
          resolve(true);
        });

        const cancelButton = dialog.querySelector(".cancel-tool");
        cancelButton.addEventListener("click", () => {
          removeDilog();
          resolve(false);
        });

        const notAgainButton = dialog.querySelector(".not-again");
        notAgainButton.addEventListener("click", () => {
          removeDilog();
          PREFS.conformation = false;
          resolve(true);
        });

        document.body.appendChild(dialog);
      });
    },

    updateFindbar() {
      SettingsModal.hide();
      this.removeExpandButton();
      this.removeAIInterface();
      this.disableResize();
      if (!PREFS.persistChat) {
        this.hide();
        this.expanded = false;
        this.clear();
      }
      gBrowser.getFindBar().then((findbar) => {
        this.findbar = findbar;
        this.addExpandButton();
        if (PREFS.persistChat) {
          if (this?.findbar?.history) {
            llm.history = this.findbar.history;
            if (
              this?.findbar?.aiStatus &&
              JSON.stringify(this.aiStatus) !== JSON.stringify(this.findbar.aiStatus)
            ) {
              llm.history = [];
              this.findbar.history = [];
            }
          } else llm.history = [];
          if (this?.findbar?.expanded && !this?.findbar?.hidden) {
            setTimeout(() => (this.expanded = true), 200);
          } else {
            this.hide();
            this.expanded = false;
          }
        } else {
          this.hide();
          this.expanded = false;
        }
        this.updateFindbarStatus();
        setTimeout(() => {
          if (PREFS.dndEnabled) this.enableResize();
        }, 0);
        setTimeout(() => this.updateFoundMatchesDisplay(), 0);
        this.findbar._findField.removeEventListener("keypress", this._handleInputKeyPress);
        this.findbar._findField.addEventListener("keypress", this._handleInputKeyPress);
        this.findbar._findField.removeEventListener("input", this._handleFindFieldInput);
        this.findbar._findField.addEventListener("input", this._handleFindFieldInput);

        const originalOnFindbarOpen = this.findbar.browser.finder.onFindbarOpen;
        const originalOnFindbarClose = this.findbar.browser.finder.onFindbarClose;

        //making sure this only runs one time
        if (!findbar?.openOverWritten) {
          //update placeholder when findbar is opened
          findbar.browser.finder.onFindbarOpen = (...args) => {
            originalOnFindbarOpen.apply(findbar.browser.finder, args); //making sure original function is called
            if (this.enabled) {
              debugLog("Findbar is being opened");
              setTimeout(
                () => (this.findbar._findField.placeholder = "Press Alt + Enter to ask AI"),
                100
              );
            }
          };
          findbar.browser.finder.onFindbarClose = (...args) => {
            originalOnFindbarClose.apply(findbar.browser.finder, args);
            if (this.enabled) {
              debugLog("Findbar is being closed");

              if (this._isStreaming) {
                this._abortController?.abort();
              }
            }
          };
          findbar.openOverWritten = true;
        }
      });
    },

    highlight(word) {
      if (!this.findbar) return;
      this.findbar._find(word);
      setTimeout(() => {
        this.findbar.browser.finder.highlight(false);
      }, 2000);
    },

    show() {
      if (!this.findbar) return false;
      this.findbar.open();
      this.focusInput();
      return true;
    },
    hide() {
      if (!this.findbar) return false;
      this.findbar.close();
      this.findbar.toggleHighlight(false);
      return true;
    },
    toggleVisibility() {
      if (!this.findbar) return;
      if (this.findbar.hidden) this.show();
      else this.hide();
    },

    clear() {
      llm.clearData();
      if (this.findbar) {
        this.findbar.history = null;
      }
      const messages = this?.chatContainer?.querySelector("#chat-messages");
      if (messages) messages.innerHTML = "";
    },

    aiStatus: {
      citationsEnabled: PREFS.citationsEnabled,
      godMode: PREFS.godMode,
    },
    updateFindbarStatus() {
      this.aiStatus = {
        godMode: PREFS.godMode,
        citationsEnabled: PREFS.citationsEnabled,
      };
      if (this.findbar) this.findbar.aiStatus = this.aiStatus;
    },

    createAPIKeyInterface() {
      const currentProviderName = llm.currentProvider.name;
      const menuItems = Object.entries(llm.AVAILABLE_PROVIDERS)
        .map(
          ([name, provider]) => `
                  <menuitem
                    value="${name}"
                    label="${escapeXmlAttribute(provider.label)}"
                    ${name === currentProviderName ? 'selected="true"' : ""}
                    ${provider.faviconUrl ? `image="${escapeXmlAttribute(provider.faviconUrl)}"` : ""}
                  />
                `
        )
        .join("");

      const menulistXul = `
        <menulist id="provider-selector" class="provider-selector" value="${currentProviderName}">
          <menupopup>
            ${menuItems}
          </menupopup>
        </menulist>`;

      const providerSelectorXulElement = parseElement(menulistXul, "xul");

      const html = `
        <div class="browse-bot-setup">
          <div class="ai-setup-content">
            <h3>AI Setup Required</h3>
            <p>To use AI features, you need to set up your API key and select a provider. If it is Ollama set any value to API key(don't keep it empty).</p>
            <div class="provider-selection-group">
              <label for="provider-selector">Select Provider:</label>
            </div>
            <div class="api-key-input-group">
              <input type="password" id="api-key" placeholder="Enter your API key" />
              <button id="save-api-key">Save</button>
            </div>
            <div class="api-key-links">
              <button id="get-api-key-link">Get API Key</button>
            </div>
          </div>
        </div>`;
      const container = parseElement(html);

      const providerSelectionGroup = container.querySelector(".provider-selection-group");
      // Insert the XUL menulist after the label within the group
      providerSelectionGroup.appendChild(providerSelectorXulElement);

      const providerSelector = container.querySelector("#provider-selector");
      const input = container.querySelector("#api-key");
      const saveBtn = container.querySelector("#save-api-key");
      const getApiKeyLink = container.querySelector("#get-api-key-link");

      // Initialize the input and link based on the currently selected provider
      input.value = llm.currentProvider.apiKey || "";
      getApiKeyLink.disabled = !llm.currentProvider.apiKeyUrl;
      getApiKeyLink.title = llm.currentProvider.apiKeyUrl
        ? "Get API Key"
        : "No API key link available for this provider.";

      // Use 'command' event for XUL menulist
      providerSelector.addEventListener("command", (e) => {
        const selectedProviderName = e.target.value;
        llm.setProvider(selectedProviderName); // This also updates PREFS.llmProvider internally
        input.value = llm.currentProvider.apiKey || "";
        getApiKeyLink.disabled = !llm.currentProvider.apiKeyUrl;
        getApiKeyLink.title = llm.currentProvider.apiKeyUrl
          ? "Get API Key"
          : "No API key link available for this provider.";
      });

      getApiKeyLink.addEventListener("click", () => {
        openTrustedLinkIn(llm.currentProvider.apiKeyUrl, "tab");
      });

      saveBtn.addEventListener("click", () => {
        const key = input.value.trim();
        if (key) {
          llm.currentProvider.apiKey = key; // This also updates PREFS.mistralApiKey/geminiApiKey internally
          this.showAIInterface(); // Refresh UI after saving key
        }
      });
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") saveBtn.click();
      });
      return container;
    },

    async sendMessage(prompt) {
      if (!prompt || this._isStreaming) return;

      this.show();
      this.expanded = true;

      // Add user message to the UI immediately
      this.addChatMessage({ role: "user", content: prompt });
      const messagesContainer = this.chatContainer.querySelector("#chat-messages");

      this._abortController = new AbortController();
      this._toggleStreamingControls(true);

      let aiMessageDiv;

      try {
        const resultPromise = llm.sendMessage(prompt, this._abortController.signal);

        if (PREFS.citationsEnabled || !PREFS.streamEnabled) {
          const loadingIndicator = this.createLoadingIndicator();
          if (messagesContainer) {
            messagesContainer.appendChild(loadingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }

          try {
            const result = await resultPromise;
            if (PREFS.citationsEnabled) {
              this.addChatMessage({ role: "assistant", content: result });
            } else {
              this.addChatMessage({ role: "assistant", content: result.text });
            }
          } finally {
            loadingIndicator.remove();
          }
        } else {
          aiMessageDiv = parseElement(
            `<div class="chat-message chat-message-ai">
  <div class="message-content">
    <div class="markdown-body"></div>
  </div>
</div>`
          );
          const contentDiv = aiMessageDiv.querySelector(".markdown-body");
          aiMessageDiv.appendChild(contentDiv);

          if (messagesContainer) {
            messagesContainer.appendChild(aiMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }

          const result = await resultPromise;
          let fullText = "";
          for await (const delta of result.textStream) {
            fullText += delta;
            contentDiv.innerHTML = parseMD(fullText).innerHTML;
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          debugError$1("Error sending message:", e);
          if (aiMessageDiv) aiMessageDiv.remove();
          this.addChatMessage({ role: "error", content: `Error: ${e.message}` });
        } else {
          debugLog("Streaming aborted by user.");
          if (aiMessageDiv) aiMessageDiv.remove();
        }
      } finally {
        this._toggleStreamingControls(false);
        this._abortController = null;
      }
    },

    _toggleStreamingControls(isStreaming) {
      this._isStreaming = isStreaming;
      if (!this.chatContainer) return;

      const sendBtn = this.chatContainer.querySelector("#send-prompt");
      const stopBtn = this.chatContainer.querySelector("#stop-generation");
      const promptInput = this.chatContainer.querySelector("#ai-prompt");

      if (isStreaming) {
        sendBtn.style.display = "none";
        stopBtn.style.display = "flex";
        promptInput.disabled = true;
      } else {
        sendBtn.style.display = "flex";
        stopBtn.style.display = "none";
        promptInput.disabled = false;
        this.focusPrompt();
      }
    },

    createChatInterface() {
      const chatInputGroup = `<div class="ai-chat-input-group">
          <textarea id="ai-prompt" placeholder="Ask AI anything..." rows="2"></textarea>
          <button id="send-prompt" class="send-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.991 6.01L5.399 10.563l4.195 2.428l3.699-3.7a1 1 0 0 1 1.414 1.415l-3.7 3.7l2.43 4.194L17.99 6.01Zm.323-2.244c1.195-.433 2.353.725 1.92 1.92l-5.282 14.605c-.434 1.198-2.07 1.344-2.709.241l-3.217-5.558l-5.558-3.217c-1.103-.639-.957-2.275.241-2.709z" />
            </svg>
          </button>
          <button id="stop-generation" class="stop-btn" style="display: none;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m2 6h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" />
              </svg>
          </button>
        </div>`;

      const container = parseElement(`
        <div class="browse-bot-chat">
          <div class="ai-chat-header">
            <div class="findbar-drag-handle"></div>
          </div>
          <div class="ai-chat-messages" id="chat-messages"></div>
          ${chatInputGroup}
        </div>`);

      const chatHeader = container.querySelector(".ai-chat-header");

      const clearBtn = parseElement(
        `
        <toolbarbutton 
          id="clear-chat" 
          class="clear-chat-btn" 
          image="chrome://global/skin/icons/delete.svg" 
          tooltiptext="Clear Chat"
        />`,
        "xul"
      );

      const settingsBtn = parseElement(
        `
        <toolbarbutton 
          id="open-settings-btn" 
          class="settings-btn" 
          image="chrome://global/skin/icons/settings.svg" 
          tooltiptext="Settings"
        />`,
        "xul"
      );

      const collapseBtn = parseElement(
        `
        <toolbarbutton 
          id="findbar-collapse-btn" 
          class="findbar-collapse-btn" 
          image="chrome://browser/skin/zen-icons/unpin.svg" 
          tooltiptext="Collapse"
        />`,
        "xul"
      );

      chatHeader.appendChild(clearBtn);
      chatHeader.appendChild(settingsBtn);
      chatHeader.appendChild(collapseBtn);

      const chatMessages = container.querySelector("#chat-messages");
      const promptInput = container.querySelector("#ai-prompt");
      const sendBtn = container.querySelector("#send-prompt");
      const stopBtn = container.querySelector("#stop-generation");

      const handleSend = () => {
        const prompt = promptInput.value.trim();
        this.sendMessage(prompt);
        promptInput.value = ""; // Clear input after sending
      };

      sendBtn.addEventListener("click", handleSend);
      stopBtn.addEventListener("click", () => {
        this._abortController?.abort();
      });

      promptInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });

      clearBtn.addEventListener("click", () => {
        this.clear();
        this.expanded = false;
      });

      settingsBtn.addEventListener("click", () => {
        SettingsModal.show();
      });

      collapseBtn.addEventListener("click", () => {
        this.expanded = false;
      });

      chatMessages.addEventListener("click", async (e) => {
        if (e.target.classList.contains("citation-link")) {
          const button = e.target;
          const citationId = button.dataset.citationId;
          const messageEl = button.closest(".chat-message[data-citations]");

          if (messageEl) {
            const citations = JSON.parse(messageEl.dataset.citations);
            const citation = citations.find((c) => c.id == citationId);
            if (citation && citation.source_quote) {
              debugLog(
                `Citation [${citationId}] clicked. Requesting highlight for:`,
                citation.source_quote
              );
              this.highlight(citation.source_quote);
            }
          }
        } else if (e.target?.href) {
          e.preventDefault();
          try {
            openTrustedLinkIn(e.target.href, "tab");
          } catch (e) {}
        }
      });

      return container;
    },

    createLoadingIndicator() {
      const messageDiv = parseElement(`<div class="chat-message chat-message-loading"></div>`);
      const contentDiv = parseElement(`<div class="message-content">Loading...</div>`);
      messageDiv.appendChild(contentDiv);
      return messageDiv;
    },

    addChatMessage(message) {
      const { role, content } = message;
      if (!this.chatContainer || content === undefined || content === null) return;

      const messagesContainer = this.chatContainer.querySelector("#chat-messages");
      if (!messagesContainer) return;

      let type;
      switch (role) {
        case "user":
          type = "user";
          break;
        case "assistant":
          type = "ai";
          break;
        case "error":
          type = "error";
          break;
        default:
          return; // Don't display other roles like 'tool'
      }

      const messageDiv = parseElement(`<div class="chat-message chat-message-${type}"></div>`);
      const contentDiv = parseElement(`<div class="message-content"></div>`);

      if (role === "assistant" && typeof content === "object" && content.answer !== undefined) {
        // Case 1: Live response from generateObject for citations
        const { answer, citations } = content;
        if (citations && citations.length > 0) {
          messageDiv.dataset.citations = JSON.stringify(citations);
        }
        const textToParse = answer.replace(
          /\[(\d+)\]/g,
          `<button class="citation-link" data-citation-id="$1">[$1]</button>`
        );
        contentDiv.appendChild(parseMD(textToParse));
      } else {
        // Case 2: String content (from user, stream, generateText, or history)
        const textContent = typeof content === "string" ? content : (content[0]?.text ?? "");

        if (role === "assistant" && PREFS.citationsEnabled) {
          // Sub-case: Rendering historical assistant message in citation mode.
          // It's a string that needs to be parsed into answer/citations.
          const { answer, citations } = llm.parseModelResponseText(textContent);
          if (citations && citations.length > 0) {
            messageDiv.dataset.citations = JSON.stringify(citations);
          }
          textToParse = answer.replace(
            /\[(\d+)\]/g,
            `<button class="citation-link" data-citation-id="$1">[$1]</button>`
          );
          contentDiv.appendChild(parseMD(textToParse));
        } else {
          // Sub-case: Simple string content
          contentDiv.appendChild(parseMD(textContent));
        }
      }

      messageDiv.appendChild(contentDiv);
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    showAIInterface() {
      if (!this.findbar) return;
      this.removeAIInterface();

      this.findbar.classList.remove("ai-settings-active");

      if (!llm.currentProvider.apiKey) {
        this.apiKeyContainer = this.createAPIKeyInterface();
        this.findbar.insertBefore(this.apiKeyContainer, this.findbar.firstChild);
      } else {
        this.chatContainer = this.createChatInterface();
        if (PREFS.dndEnabled) this.enableDND();

        // Re-render history using the new message format
        const history = llm.getHistory();
        for (const message of history) {
          this.addChatMessage(message);
        }

        this.findbar.insertBefore(this.chatContainer, this.findbar.firstChild);
      }
    },

    focusInput() {
      if (this.findbar) setTimeout(() => this.findbar._findField.focus(), 10);
    },
    focusPrompt() {
      const promptInput = this.chatContainer?.querySelector("#ai-prompt");
      if (promptInput) setTimeout(() => promptInput.focus(), 10);
    },
    setPromptText(text) {
      const promptInput = this?.chatContainer?.querySelector("#ai-prompt");
      if (promptInput && text) promptInput.value = text;
    },
    async setPromptTextFromSelection() {
      let text = "";
      const selection = await messageManagerAPI.getSelectedText();
      if (!selection || !selection.hasSelection) text = this?.findbar?._findField?.value;
      else text = selection.selectedText;
      this.setPromptText(text);
    },

    removeAIInterface() {
      if (this.apiKeyContainer) {
        this.apiKeyContainer.remove();
        this.apiKeyContainer = null;
      }
      if (this.chatContainer) {
        this.chatContainer.remove();
        this.chatContainer = null;
      }
    },

    init() {
      if (!this.enabled) return;
      this.updateFindbar();
      this.addListeners();
      if (PREFS.contextMenuEnabled) {
        this.addContextMenuItem();
      }
    },
    destroy() {
      this.findbar = null;
      this.expanded = false;
      try {
        this.removeListeners();
      } catch {}
      this.removeExpandButton();
      this.removeContextMenuItem();
      this.removeAIInterface();
      this._toolConfirmationDialog?.remove();
      this._toolConfirmationDialog = null;
      SettingsModal.hide();
    },

    addExpandButton() {
      if (!this.findbar) return false;

      // Always remove both buttons before adding the correct one
      this.removeExpandButton();

      if (this.minimal) {
        const container = this.findbar.querySelector(".findbar-container");
        if (container && !container.querySelector("#findbar-ask")) {
          const askBtn = parseElement(`<button id="findbar-ask" anonid="findbar-ask">Ask</button>`);
          askBtn.addEventListener("click", () => {
            const inpText = this.findbar._findField.value.trim();
            this.sendMessage(inpText);
            this.findbar._findField.value = "";
            this.focusInput();
          });
          container.appendChild(askBtn);
          this.askButton = askBtn;
        }
      } else {
        const button_id = "findbar-expand";
        const button = parseElement(
          `<button id="${button_id}" anonid="${button_id}">Expand</button>`
        );
        button.addEventListener("click", () => this.toggleExpanded());
        button.textContent = "Expand";
        this.findbar.appendChild(button);
        this.expandButton = button;
      }
      return true;
    },

    removeExpandButton() {
      if (this.askButton) {
        this.askButton.remove();
        this.askButton = null;
      }
      if (this.expandButton) {
        this.expandButton.remove();
        this.expandButton = null;
      }
      return true;
    },

    handleInputKeyPress: function (e) {
      if (e?.key === "Enter" && e?.altKey) {
        e.preventDefault();
        const inpText = this.findbar._findField.value.trim();
        this.sendMessage(inpText);
        this.findbar._findField.value = "";
        this.focusInput();
      }
    },

    addContextMenuItem(retryCount = 0) {
      if (this.contextMenuItem) return; // Already added
      if (!PREFS.contextMenuEnabled) return;

      const contextMenu = document.getElementById("contentAreaContextMenu");

      if (!contextMenu) {
        if (retryCount < 5) {
          debugLog(`Context menu not found, retrying... (attempt ${retryCount + 1}/5)`);
          setTimeout(() => this.addContextMenuItem(retryCount + 1), 200);
        } else {
          debugError$1("Failed to add context menu item after 5 attempts: Context menu not found.");
        }
        return;
      }

      const menuItem = document.createXULElement("menuitem");
      menuItem.id = "browse-bot-context-menu-item";
      menuItem.setAttribute("label", "Ask AI");
      menuItem.setAttribute("accesskey", "A");

      menuItem.addEventListener("command", this.handleContextMenuClick.bind(this));
      this.contextMenuItem = menuItem;

      const searchSelectItem = contextMenu.querySelector("#context-searchselect");

      if (searchSelectItem) {
        // Insert right after the searchselect item
        if (searchSelectItem.nextSibling) {
          contextMenu.insertBefore(menuItem, searchSelectItem.nextSibling);
        } else {
          contextMenu.appendChild(menuItem);
        }
      } else {
        // Fallback: insert after context-sep-redo separator
        const redoSeparator = contextMenu.querySelector("#context-sep-redo");
        if (redoSeparator) {
          if (redoSeparator.nextSibling) {
            contextMenu.insertBefore(menuItem, redoSeparator.nextSibling);
          } else {
            contextMenu.appendChild(menuItem);
          }
        } else {
          // Final fallback: don't add the menu item if neither element is found
          return;
        }
      }

      this._updateContextMenuText = this.updateContextMenuText.bind(this);
      contextMenu.addEventListener("popupshowing", this._updateContextMenuText);
    },

    removeContextMenuItem: function () {
      this?.contextMenuItem?.remove();
      this.contextMenuItem = null;
      document
        ?.getElementById("contentAreaContextMenu")
        ?.removeEventListener("popupshowing", this._updateContextMenuText);
    },
    handleContextMenuClick: async function () {
      const selection = await messageManagerAPI.getSelectedText();
      let finalMessage = "";
      if (!selection.hasSelection) {
        finalMessage = "Summarize current page";
      } else {
        finalMessage += "Explain this in context of current page\n";
        const selectedTextFormatted = selection?.selectedText
          ?.split("\n")
          ?.map((line) => line.trim())
          ?.filter((line) => line.length > 0)
          ?.map((line) => "> " + line)
          ?.join("\n");

        finalMessage += selectedTextFormatted;
      }
      this.expanded = true;
      if (PREFS.contextMenuAutoSend) {
        this.sendMessage(finalMessage);
        this.focusPrompt();
      } else {
        this.setPromptText(finalMessage);
        this.show();
        this.focusPrompt();
      }
    },

    handleContextMenuPrefChange: function (pref) {
      if (pref.value) this.addContextMenuItem();
      else this.removeContextMenuItem();
    },
    updateContextMenuText() {
      if (!PREFS.contextMenuEnabled || !this.contextMenuItem) return;
      const hasSelection = gContextMenu?.isTextSelected === true;
      this.contextMenuItem.label = hasSelection ? "Ask AI" : "Summarize with AI";
    },

    enableResize() {
      if (!this.findbar || this._resizeHandle) return;
      const resizeHandle = parseElement(`<div class="findbar-resize-handle"></div>`);
      this.findbar.appendChild(resizeHandle);
      this._resizeHandle = resizeHandle;
      this._startResize = this.startResize.bind(this);
      this._resizeHandle.addEventListener("mousedown", this._startResize);
    },

    startResize(e) {
      if (e.button !== 0 || !this.findbar) return;
      this._isResizing = true;
      this._initialMouseCoor = { x: e.clientX, y: e.clientY };
      const rect = this.findbar.getBoundingClientRect();
      this.startWidth = rect.width;
      this._handleResize = this.doResize.bind(this);
      this._stopResize = this.stopResize.bind(this);
      document.addEventListener("mousemove", this._handleResize);
      document.addEventListener("mouseup", this._stopResize);
    },

    doResize(e) {
      if (!this._isResizing || !this.findbar) return;
      const minWidth = 300;
      const maxWidth = 800;
      const directionFactor = PREFS.position.includes("right") ? -1 : 1;
      let newWidth = this.startWidth + (e.clientX - this._initialMouseCoor.x) * directionFactor;
      newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      this.findbar.style.width = `${newWidth}px`;
    },

    stopResize() {
      this._isResizing = false;
      document.removeEventListener("mousemove", this._handleResize);
      document.removeEventListener("mouseup", this._stopResize);
      this._handleResize = null;
      this._stopResize = null;
    },
    disableResize() {
      this._resizeHandle?.remove();
      this._resizeHandle = null;
      this.stopResize();
    },

    startDrag(e) {
      if (!this.chatContainer || e.button !== 0) return;
      this._isDragging = true;
      this._initialMouseCoor = { x: e.clientX, y: e.clientY };
      const rect = this.findbar.getBoundingClientRect();
      this._initialContainerCoor = { x: rect.left, y: rect.top };
      this._handleDrag = this.doDrag.bind(this);
      this._stopDrag = this.stopDrag.bind(this);
      document.addEventListener("mousemove", this._handleDrag);
      document.addEventListener("mouseup", this._stopDrag);
    },

    doDrag(e) {
      if (!this._isDragging) return;
      const minCoors = { x: 15, y: 35 };
      const rect = this.findbar.getBoundingClientRect();
      const maxCoors = {
        x: window.innerWidth - rect.width - 33,
        y: window.innerHeight - rect.height - 33,
      };
      const newCoors = {
        x: this._initialContainerCoor.x + (e.clientX - this._initialMouseCoor.x),
        y: this._initialContainerCoor.y + (e.clientY - this._initialMouseCoor.y),
      };

      if (
        gZenCompactModeManager &&
        !gZenCompactModeManager?.preference &&
        !gZenCompactModeManager.sidebarIsOnRight
      ) {
        newCoors.x -= gZenCompactModeManager.getAndApplySidebarWidth(); // deduct sidebar width if not sidebar is visible on right
      }
      newCoors.x = Math.max(minCoors.x, Math.min(newCoors.x, maxCoors.x));
      newCoors.y = Math.max(minCoors.y, Math.min(newCoors.y, maxCoors.y));

      this.findbar.style.setProperty("left", `${newCoors.x}px`, "important");
      this.findbar.style.setProperty("top", `${newCoors.y}px`, "important");
      this.findbar.style.setProperty("right", "unset", "important");
      this.findbar.style.setProperty("bottom", "unset", "important");
    },

    stopDrag() {
      this._isDragging = false;
      this.snapToClosestCorner();
      this._initialMouseCoor = { x: null, y: null };
      this._initialContainerCoor = { x: null, y: null };
      document.removeEventListener("mouseup", this._stopDrag);
      document.removeEventListener("mousemove", this._handleDrag);
      this._handleDrag = null;
      this._stopDrag = null;
    },

    snapToClosestCorner() {
      if (!this.findbar || !PREFS.dndEnabled) return;

      const rect = this.findbar.getBoundingClientRect();
      const currentX = rect.left;
      const currentY = rect.top;
      const findbarWidth = rect.width;
      const findbarHeight = rect.height;

      const snapPoints = {
        "top-left": { x: 0, y: 0 },
        "top-right": { x: window.innerWidth - findbarWidth, y: 0 },
        "bottom-left": { x: 0, y: window.innerHeight - findbarHeight },
        "bottom-right": {
          x: window.innerWidth - findbarWidth,
          y: window.innerHeight - findbarHeight,
        },
      };

      let closestPointName = PREFS.position;
      let minDistance = Infinity;

      for (const name in snapPoints) {
        const p = snapPoints[name];
        const distance = Math.sqrt(Math.pow(currentX - p.x, 2) + Math.pow(currentY - p.y, 2));

        if (distance < minDistance) {
          minDistance = distance;
          closestPointName = name;
        }
      }

      // Update preference if position changed
      if (closestPointName !== PREFS.position) {
        PREFS.position = closestPointName;
      }
      this.findbar.style.removeProperty("left");
      this.findbar.style.removeProperty("top");
      this.findbar.style.removeProperty("bottom");
      this.findbar.style.removeProperty("right");
      // this.applyFindbarPosition(closestPointName);
    },
    enableDND() {
      if (!this.chatContainer) return;
      const handle = this.chatContainer.querySelector(".findbar-drag-handle");
      if (!handle) return;
      this._startDrag = this.startDrag.bind(this);
      handle.addEventListener("mousedown", this._startDrag);
    },
    disableDND() {
      this._isDragging = false;
      if (!this.chatContainer) return;
      const handle = this.chatContainer.querySelector(".findbar-drag-handle");
      if (!handle) return;
      handle.removeEventListener("mousedown", this._startDrag);
      document.removeEventListener("mouseup", this._stopDrag);
      document.removeEventListener("mousemove", this._handleDrag);
      this._startDrag = null;
      this._stopDrag = null;
    },

    addKeymaps: function (e) {
      if (e.key && e.key.toLowerCase() === "f" && e.ctrlKey && e.shiftKey && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        this.expanded = true;
        this.show();
        this.focusPrompt();
        this.setPromptTextFromSelection();
      }
      if (e.key?.toLowerCase() === "escape") {
        if (SettingsModal._modalElement && SettingsModal._modalElement.parentNode) {
          e.preventDefault();
          e.stopPropagation();
          SettingsModal.hide();
        } else if (this._toolConfirmationDialog) {
          const cancelButton = this._toolConfirmationDialog.querySelector(".cancel-tool");
          cancelButton?.click();
        } else if (this.expanded) {
          e.preventDefault();
          e.stopPropagation();
          this.expanded = false;
          this.focusInput();
        }
      }
    },

    addListeners() {
      this._updateFindbar = this.updateFindbar.bind(this);
      this._addKeymaps = this.addKeymaps.bind(this);
      this._handleInputKeyPress = this.handleInputKeyPress.bind(this);
      this._handleFindFieldInput = this.updateFoundMatchesDisplay.bind(this);
      const _clearLLMData = () => {
        this.updateFindbarStatus();
        this.clear();
      };
      const _handleContextMenuPrefChange = this.handleContextMenuPrefChange.bind(this);
      const _handleMinimalPrefChange = this.handleMinimalPrefChange.bind(this);

      gBrowser.tabContainer.addEventListener("TabSelect", this._updateFindbar);
      document.addEventListener("keydown", this._addKeymaps);
      this._godModeListener = UC_API.Prefs.addListener(PREFS.GOD_MODE, _clearLLMData);
      this._citationsListener = UC_API.Prefs.addListener(PREFS.CITATIONS_ENABLED, _clearLLMData);
      this._minimalListener = UC_API.Prefs.addListener(PREFS.MINIMAL, _handleMinimalPrefChange);
      this._contextMenuEnabledListener = UC_API.Prefs.addListener(
        PREFS.CONTEXT_MENU_ENABLED,
        _handleContextMenuPrefChange
      );
      this._persistListener = UC_API.Prefs.addListener(PREFS.PERSIST, (pref) => {
        if (!this.findbar) return;
        if (pref.value) this.findbar.history = llm.history;
        else this.findbar.history = null;
      });
      this._dndListener = UC_API.Prefs.addListener(PREFS.DND_ENABLED, (pref) => {
        if (pref.value) {
          this.enableDND();
          this.enableResize();
        } else {
          this.disableDND();
          this.disableResize();
        }
      });
    },

    removeListeners() {
      if (this.findbar) {
        this.findbar._findField.removeEventListener("keypress", this._handleInputKeyPress);
        this.findbar._findField.removeEventListener("input", this._handleFindFieldInput);
      }
      gBrowser.tabContainer.removeEventListener("TabSelect", this._updateFindbar);
      document.removeEventListener("keydown", this._addKeymaps);
      UC_API.Prefs.removeListener(this._godModeListener);
      UC_API.Prefs.removeListener(this._citationsListener);
      UC_API.Prefs.removeListener(this._contextMenuEnabledListener);
      UC_API.Prefs.removeListener(this._minimalListener);
      UC_API.Prefs.removeListener(this._persistListener);
      UC_API.Prefs.removeListener(this._dndListener);
      this.disableDND();

      // Disconnect the MutationObserver when listeners are removed
      if (this._matchesObserver) {
        this._matchesObserver.disconnect();
        this._matchesObserver = null;
      }

      this._handleInputKeyPress = null;
      this._handleFindFieldInput = null;
      this._updateFindbar = null;
      this._addKeymaps = null;
      this._godModeListener = null;
      this._citationsListener = null;
      this._contextMenuEnabledListener = null;
      this._minimalListener = null;
      this._dndListener = null;
    },

    updateFoundMatchesDisplay(retry = 0) {
      if (!this.findbar) return;
      const matches = this.findbar.querySelector(".found-matches");
      const status = this.findbar.querySelector(".findbar-find-status");
      const wrapper = this.findbar.querySelector('hbox[anonid="findbar-textbox-wrapper"]');
      if (!wrapper) {
        if (retry < 10) setTimeout(() => this.updateFoundMatchesDisplay(retry + 1), 100);
        return;
      }
      if (matches && matches.parentElement !== wrapper) wrapper.appendChild(matches);
      if (status && status.parentElement !== wrapper) wrapper.appendChild(status);

      if (status && status.getAttribute("status") === "notfound") {
        status.setAttribute("value", "0/0");
        status.textContent = "0/0";
      }

      if (matches) {
        const labelChild = matches.querySelector("label");
        let labelValue = labelChild
          ? labelChild.getAttribute("value")
          : matches.getAttribute("value");
        let newLabel = "";
        if (labelValue) {
          let normalized = labelValue.replace(/(\d+)\s+of\s+(\d+)(?:\s+match(?:es)?)?/i, "$1/$2");
          newLabel = normalized === "1/1" ? "1/1" : normalized;
        }
        if (labelChild) {
          if (labelChild.getAttribute("value") !== newLabel)
            labelChild.setAttribute("value", newLabel);
          if (labelChild.textContent !== newLabel) labelChild.textContent = newLabel;
        } else {
          if (matches.getAttribute("value") !== newLabel) matches.setAttribute("value", newLabel);
          if (matches.textContent !== newLabel) matches.textContent = newLabel;
        }

        // Disconnect existing observer before creating a new one
        if (this._matchesObserver) this._matchesObserver.disconnect();

        const observer = new MutationObserver(() => this.updateFoundMatchesDisplay());
        observer.observe(matches, {
          attributes: true,
          attributeFilter: ["value"],
        });
        if (labelChild)
          observer.observe(labelChild, {
            attributes: true,
            attributeFilter: ["value"],
          });
        if (status)
          observer.observe(status, {
            attributes: true,
            attributeFilter: ["status", "value"],
          });
        this._matchesObserver = observer;
      }
    },
  };

  UC_API.Runtime.startupFinished().then(() => {
    browseBotFindbar.init();
    UC_API.Prefs.addListener(
      PREFS.ENABLED,
      browseBotFindbar.handleEnabledChange.bind(browseBotFindbar)
    );
    window.browseBotFindbar = browseBotFindbar;
  });

  exports.browseBotFindbar = browseBotFindbar;

}));
