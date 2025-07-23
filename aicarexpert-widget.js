/**
 * AiCareXpert Widget - Healthcare AI Chatbot
 * Version 2.4 - Direct global assignment fix
 */

(function() {
  'use strict';

  // Create global object first
  window.AiCareXpert = {};
  
  // Add functions directly to global object
  window.AiCareXpert.sendTestMessage = function(message) {
    console.log('AiCareXpert: Test function called with message:', message);
    if (!window.AiCareXpert.config) {
      console.error('AiCareXpert: Widget not initialized');
      return;
    }
    
    // Open widget if closed
    const widget = document.getElementById('aicarexpert-window');
    if (widget && !widget.classList.contains('open')) {
      widget.classList.add('open');
    }
    
    // Set input value and send
    const input = document.getElementById('aicarexpert-input');
    if (input) {
      input.value = message || 'Test message from debug function';
      sendMessage();
    }
  };

  window.AiCareXpert.getConfig = function() {
    return window.AiCareXpert.config || {};
  };

  window.AiCareXpert.init = function(config) {
      console.log('AiCareXpert: Initializing widget with config:', config);
      
      if (!config.tenantId || !config.assistantId || !config.apiUrl) {
        console.error('AiCareXpert: Missing required configuration: tenantId, assistantId, or apiUrl');
        return;
      }

      if (!config.supabaseAnonKey) {
        console.error('AiCareXpert: Missing supabaseAnonKey - this is required for authentication');
        return;
      }

      // Store config globally
      window.AiCareXpert.config = {
        tenantId: config.tenantId,
        assistantId: config.assistantId,
        apiUrl: config.apiUrl,
        supabaseAnonKey: config.supabaseAnonKey,
        widgetId: config.widgetId || 'aicarexpert-widget',
        config: {
          position: 'bottom-right',
          primaryColor: '#2563EB',
          secondaryColor: '#059669',
          fontFamily: 'Inter',
          borderRadius: '8px',
          showWelcome: true,
          welcomeMessage: 'Hello! How can I help you today?',
          chatTitle: 'AI Assistant',
          placeholder: 'Type your message...',
          autoOpen: false,
          collectEmail: false,
          enableTyping: true,
          size: 'medium',
          ...config.config
        }
      };

      // Generate unique user ID for this visitor
      window.AiCareXpert.userId = getOrCreateUserId();
      window.AiCareXpert.sessionId = null;
      window.AiCareXpert.isOpen = false;
      window.AiCareXpert.messages = [];
      
      // Create widget HTML
      createWidget();
      
      // Auto-open if configured
      if (window.AiCareXpert.config.config.autoOpen) {
        setTimeout(() => openWidget(), 1000);
      }

      console.log('AiCareXpert: Widget initialized successfully');
      console.log('AiCareXpert: Test functions should now be available');
    };

  console.log('AiCareXpert: Functions assigned to global object');
  console.log('AiCareXpert: Available functions:', Object.keys(window.AiCareXpert));
  // Get or create user ID from localStorage
  function getOrCreateUserId() {
    const storageKey = 'aicarexpert_user_id';
    let userId = localStorage.getItem(storageKey);
    
    if (!userId) {
      userId = `user_${generateUUID()}`;
      localStorage.setItem(storageKey, userId);
    }
    
    return userId;
  }

  // Generate UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Create widget HTML
  function createWidget() {
    const config = window.AiCareXpert.config;
    
    // Remove existing widget if any
    const existingWidget = document.getElementById(config.widgetId);
    if (existingWidget) {
      existingWidget.remove();
    }

    // Create widget container
    const widget = document.createElement('div');
    widget.id = config.widgetId;
    widget.innerHTML = getWidgetHTML();
    
    // Add styles
    addWidgetStyles();
    
    // Append to body
    document.body.appendChild(widget);
    
    // Add event listeners
    addEventListeners();
    
    // Add welcome message if enabled
    if (config.config.showWelcome) {
      addMessage(config.config.welcomeMessage, 'assistant');
    }
  }

  // Get widget HTML
  function getWidgetHTML() {
    const config = window.AiCareXpert.config.config;
    const position = config.position;
    const positionClass = `aicarexpert-${position}`;
    
    return `
      <div class="aicarexpert-widget ${positionClass}">
        <button class="aicarexpert-chat-button" id="aicarexpert-toggle">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>
        
        <div class="aicarexpert-chat-window" id="aicarexpert-window">
          <div class="aicarexpert-chat-header">
            <div class="aicarexpert-header-info">
              <div class="aicarexpert-chat-title">${config.chatTitle}</div>
              <div class="aicarexpert-chat-subtitle">Online now</div>
            </div>
            <button class="aicarexpert-close-button" id="aicarexpert-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          
          <div class="aicarexpert-chat-messages" id="aicarexpert-messages"></div>
          
          <div class="aicarexpert-typing-indicator" id="aicarexpert-typing">
            <div class="aicarexpert-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div class="aicarexpert-chat-input">
            <input 
              type="text" 
              id="aicarexpert-input" 
              placeholder="${config.placeholder}"
            >
            <button class="aicarexpert-send-button" id="aicarexpert-send">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Add widget styles
  function addWidgetStyles() {
    if (document.getElementById('aicarexpert-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'aicarexpert-styles';
    styles.textContent = getWidgetCSS();
    document.head.appendChild(styles);
  }

  // Get widget CSS
  function getWidgetCSS() {
    const config = window.AiCareXpert.config.config;
    const size = getSizeConfig(config.size);
    
    return `
      .aicarexpert-widget {
        position: fixed;
        z-index: 999999;
        font-family: ${config.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .aicarexpert-bottom-right { bottom: 20px; right: 20px; }
      .aicarexpert-bottom-left { bottom: 20px; left: 20px; }
      .aicarexpert-top-right { top: 20px; right: 20px; }
      .aicarexpert-top-left { top: 20px; left: 20px; }
      
      .aicarexpert-chat-button {
        width: 60px;
        height: 60px;
        background: ${config.primaryColor};
        border: none;
        border-radius: ${config.borderRadius === '20px' ? '50%' : config.borderRadius};
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        color: white;
      }
      
      .aicarexpert-chat-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }
      
      .aicarexpert-chat-window {
        position: absolute;
        ${config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
        ${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
        width: ${size.width};
        height: ${size.height};
        background: white;
        border-radius: ${config.borderRadius};
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid #e2e8f0;
      }
      
      .aicarexpert-chat-window.open {
        display: flex;
      }
      
      .aicarexpert-chat-header {
        background: ${config.primaryColor};
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .aicarexpert-chat-title {
        font-weight: 600;
        font-size: 16px;
        margin: 0;
      }
      
      .aicarexpert-chat-subtitle {
        font-size: 12px;
        opacity: 0.9;
        margin: 0;
      }
      
      .aicarexpert-close-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .aicarexpert-close-button:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .aicarexpert-chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-height: 0;
      }
      
      .aicarexpert-message {
        max-width: 80%;
        padding: 10px 12px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      .aicarexpert-message.user {
        background: ${config.primaryColor};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      
      .aicarexpert-message.assistant {
        background: #f1f5f9;
        color: #334155;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
      }
      
      .aicarexpert-typing-indicator {
        display: none;
        align-self: flex-start;
        padding: 10px 12px;
        background: #f1f5f9;
        border-radius: 12px;
        border-bottom-left-radius: 4px;
        margin: 0 16px;
      }
      
      .aicarexpert-typing-indicator.show {
        display: block;
      }
      
      .aicarexpert-typing-dots {
        display: flex;
        gap: 4px;
      }
      
      .aicarexpert-typing-dots span {
        width: 6px;
        height: 6px;
        background: #64748b;
        border-radius: 50%;
        animation: aicarexpert-typing 1.4s infinite ease-in-out;
      }
      
      .aicarexpert-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
      .aicarexpert-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
      
      @keyframes aicarexpert-typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
        30% { transform: translateY(-10px); opacity: 1; }
      }
      
      .aicarexpert-chat-input {
        padding: 16px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 8px;
      }
      
      .aicarexpert-chat-input input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        outline: none;
        font-size: 14px;
        font-family: inherit;
      }
      
      .aicarexpert-chat-input input:focus {
        border-color: ${config.primaryColor};
      }
      
      .aicarexpert-send-button {
        width: 40px;
        height: 40px;
        background: ${config.secondaryColor};
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        color: white;
      }
      
      .aicarexpert-send-button:hover {
        opacity: 0.9;
      }
      
      .aicarexpert-send-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
      
      /* Mobile responsive */
      @media (max-width: 480px) {
        .aicarexpert-chat-window {
          width: calc(100vw - 40px) !important;
          height: calc(100vh - 100px) !important;
          ${config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
          ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        }
      }
    `;
  }

  // Get size configuration
  function getSizeConfig(size) {
    switch (size) {
      case 'small': return { width: '300px', height: '400px' };
      case 'large': return { width: '400px', height: '600px' };
      default: return { width: '350px', height: '500px' };
    }
  }

  // Add event listeners
  function addEventListeners() {
    const toggleButton = document.getElementById('aicarexpert-toggle');
    const closeButton = document.getElementById('aicarexpert-close');
    const sendButton = document.getElementById('aicarexpert-send');
    const input = document.getElementById('aicarexpert-input');

    if (toggleButton) {
      toggleButton.addEventListener('click', toggleWidget);
    }

    if (closeButton) {
      closeButton.addEventListener('click', closeWidget);
    }

    if (sendButton) {
      sendButton.addEventListener('click', sendMessage);
    }

    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }
  }

  // Toggle widget
  function toggleWidget() {
    if (window.AiCareXpert.isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }

  // Open widget
  function openWidget() {
    const windowEl = document.getElementById('aicarexpert-window');
    const input = document.getElementById('aicarexpert-input');
    
    if (windowEl) {
      windowEl.classList.add('open');
      window.AiCareXpert.isOpen = true;
      
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  // Close widget
  function closeWidget() {
    const windowEl = document.getElementById('aicarexpert-window');
    
    if (windowEl) {
      windowEl.classList.remove('open');
      window.AiCareXpert.isOpen = false;
    }
  }

  // Add message to chat
  function addMessage(content, role) {
    const messagesContainer = document.getElementById('aicarexpert-messages');
    if (!messagesContainer) return;

    const messageEl = document.createElement('div');
    messageEl.className = `aicarexpert-message ${role}`;
    messageEl.textContent = content;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store message
    window.AiCareXpert.messages.push({ content, role, timestamp: new Date() });
  }

  // Show typing indicator
  function showTyping() {
    const typingEl = document.getElementById('aicarexpert-typing');
    if (typingEl) {
      typingEl.classList.add('show');
      
      // Scroll to bottom
      const messagesContainer = document.getElementById('aicarexpert-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }

  // Hide typing indicator
  function hideTyping() {
    const typingEl = document.getElementById('aicarexpert-typing');
    if (typingEl) {
      typingEl.classList.remove('show');
    }
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('aicarexpert-input');
    const sendButton = document.getElementById('aicarexpert-send');
    
    if (!input || !sendButton) return;
    
    const message = input.value.trim();
    if (!message) return;

    const config = window.AiCareXpert.config;

    // Validate configuration
    if (!config.supabaseAnonKey) {
      console.error('AiCareXpert: supabaseAnonKey is required but not provided');
      addMessage('Configuration error: Missing authentication key', 'assistant');
      return;
    }

    // Add user message
    addMessage(message, 'user');
    input.value = '';
    sendButton.disabled = true;
    
    // Show typing indicator
    if (config.config.enableTyping) {
      showTyping();
    }

    try {
      console.log('AiCareXpert: Sending message to API...');
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.supabaseAnonKey}`
      };
      
      const requestBody = {
        message: message,
        tenantId: config.tenantId,
        assistantId: config.assistantId,
        sessionId: window.AiCareXpert.sessionId,
        userId: window.AiCareXpert.userId
      };
      
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      hideTyping();

      if (response.ok) {
        const data = await response.json();
        
        // Update session info
        if (data.sessionId) window.AiCareXpert.sessionId = data.sessionId;
        if (data.userId) window.AiCareXpert.userId = data.userId;
        
        // Add assistant response
        addMessage(data.response, 'assistant');
      } else {
        const errorText = await response.text();
        console.error('AiCareXpert: API error response:', errorText);
        addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
      }
    } catch (error) {
      console.error('AiCareXpert: Chat error:', error);
      hideTyping();
      addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  }

  console.log('AiCareXpert: Widget script loaded successfully - Version 2.3');
})();