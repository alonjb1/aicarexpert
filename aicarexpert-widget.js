// AiCareXpert Widget - Complete Working Version
console.log('🚀 AiCareXpert Widget: Starting execution...');

// Create the widget object with all functions
window.AiCareXpert = {
  // Configuration storage
  config: null,
  
  // Test function for debugging
  sendTestMessage: function(message) {
    console.log('🧪 AiCareXpert Test Message:', message);
    alert('AiCareXpert Test: ' + message);
    
    // If widget is initialized, try to send actual message
    if (this.config && this.config.apiUrl) {
      this.sendMessage(message);
    }
  },
  
  // Get current configuration
  getConfig: function() {
    console.log('📋 AiCareXpert: Getting config');
    return this.config || {};
  },
  
  // Initialize the widget
  init: function(options) {
    console.log('🔧 AiCareXpert: Initializing widget with options:', options);
    
    // Store configuration
    this.config = {
      tenantId: options.tenantId,
      assistantId: options.assistantId,
      widgetId: options.widgetId || 'aicarexpert-widget',
      apiUrl: options.apiUrl,
      supabaseAnonKey: options.supabaseAnonKey,
      config: options.config || {}
    };
    
    // Create widget UI
    this.createWidget();
    
    console.log('✅ AiCareXpert: Widget initialized successfully');
  },
  
  // Create the widget UI
  createWidget: function() {
    console.log('🎨 AiCareXpert: Creating widget UI');
    
    // Remove existing widget if any
    const existing = document.getElementById(this.config.widgetId);
    if (existing) {
      existing.remove();
    }
    
    // Create widget container
    const widget = document.createElement('div');
    widget.id = this.config.widgetId;
    widget.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <button id="${this.config.widgetId}-button" style="
          width: 60px;
          height: 60px;
          background: ${this.config.config.primaryColor || '#2563EB'};
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>
        
        <div id="${this.config.widgetId}-window" style="
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
        ">
          <div style="
            background: ${this.config.config.primaryColor || '#2563EB'};
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div>
              <div style="font-weight: 600; font-size: 16px;">${this.config.config.chatTitle || 'AI Assistant'}</div>
              <div style="font-size: 12px; opacity: 0.9;">Online now</div>
            </div>
            <button id="${this.config.widgetId}-close" style="
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 4px;
              border-radius: 4px;
            ">✕</button>
          </div>
          
          <div id="${this.config.widgetId}-messages" style="
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
          ">
            ${this.config.config.showWelcome ? `
              <div style="
                background: #f1f5f9;
                padding: 10px 12px;
                border-radius: 12px;
                border-bottom-left-radius: 4px;
                font-size: 14px;
                max-width: 80%;
              ">${this.config.config.welcomeMessage || 'Hello! How can I help you today?'}</div>
            ` : ''}
          </div>
          
          <div style="
            padding: 16px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 8px;
          ">
            <input 
              id="${this.config.widgetId}-input"
              type="text" 
              placeholder="${this.config.config.placeholder || 'Type your message...'}"
              style="
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                outline: none;
                font-size: 14px;
              "
            />
            <button id="${this.config.widgetId}-send" style="
              width: 40px;
              height: 40px;
              background: ${this.config.config.secondaryColor || '#059669'};
              border: none;
              border-radius: 50%;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            ">→</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    
    // Add event listeners
    this.attachEventListeners();
    
    console.log('✅ AiCareXpert: Widget UI created');
  },
  
  // Attach event listeners
  attachEventListeners: function() {
    const button = document.getElementById(this.config.widgetId + '-button');
    const closeBtn = document.getElementById(this.config.widgetId + '-close');
    const sendBtn = document.getElementById(this.config.widgetId + '-send');
    const input = document.getElementById(this.config.widgetId + '-input');
    
    if (button) {
      button.addEventListener('click', () => this.toggleWidget());
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggleWidget());
    }
    
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendMessage());
    }
    
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
  },
  
  // Toggle widget visibility
  toggleWidget: function() {
    const window = document.getElementById(this.config.widgetId + '-window');
    if (window) {
      const isVisible = window.style.display === 'flex';
      window.style.display = isVisible ? 'none' : 'flex';
      
      if (!isVisible) {
        const input = document.getElementById(this.config.widgetId + '-input');
        if (input) input.focus();
      }
    }
  },
  
  // Send message to API
  sendMessage: function(messageText) {
    const input = document.getElementById(this.config.widgetId + '-input');
    const message = messageText || (input ? input.value.trim() : '');
    
    if (!message) return;
    
    console.log('📤 AiCareXpert: Sending message:', message);
    
    // Clear input
    if (input) input.value = '';
    
    // Add user message to chat
    this.addMessage(message, 'user');
    
    // Show typing indicator
    this.showTyping();
    
    // Call API
    this.callAPI(message);
  },
  
  // Add message to chat
  addMessage: function(content, role) {
    const messagesContainer = document.getElementById(this.config.widgetId + '-messages');
    if (!messagesContainer) return;
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      background: ${role === 'user' ? (this.config.config.primaryColor || '#2563EB') : '#f1f5f9'};
      color: ${role === 'user' ? 'white' : '#334155'};
      padding: 10px 12px;
      border-radius: 12px;
      border-bottom-${role === 'user' ? 'right' : 'left'}-radius: 4px;
      font-size: 14px;
      max-width: 80%;
      align-self: ${role === 'user' ? 'flex-end' : 'flex-start'};
      margin-left: ${role === 'user' ? 'auto' : '0'};
    `;
    messageEl.textContent = content;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  
  // Show typing indicator
  showTyping: function() {
    const messagesContainer = document.getElementById(this.config.widgetId + '-messages');
    if (!messagesContainer) return;
    
    const typingEl = document.createElement('div');
    typingEl.id = this.config.widgetId + '-typing';
    typingEl.style.cssText = `
      background: #f1f5f9;
      padding: 10px 12px;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      font-size: 14px;
      max-width: 80%;
      align-self: flex-start;
    `;
    typingEl.textContent = 'Typing...';
    
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  
  // Hide typing indicator
  hideTyping: function() {
    const typingEl = document.getElementById(this.config.widgetId + '-typing');
    if (typingEl) {
      typingEl.remove();
    }
  },
  
  // Call API
  callAPI: async function(message) {
    try {
      console.log('🌐 AiCareXpert: Calling API with message:', message);
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authentication if available
      if (this.config.supabaseAnonKey) {
        headers['Authorization'] = `Bearer ${this.config.supabaseAnonKey}`;
        headers['apikey'] = this.config.supabaseAnonKey;
      }
      
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          message: message,
          tenantId: this.config.tenantId,
          assistantId: this.config.assistantId,
          sessionId: this.sessionId,
          userId: this.userId
        })
      });
      
      this.hideTyping();
      
      if (response.ok) {
        const data = await response.json();
        
        // Update session info
        if (data.sessionId) this.sessionId = data.sessionId;
        if (data.userId) this.userId = data.userId;
        
        // Add assistant response
        this.addMessage(data.response, 'assistant');
        
        console.log('✅ AiCareXpert: API call successful');
      } else {
        const errorText = await response.text();
        this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        console.error('❌ AiCareXpert: API error:', response.status, errorText);
      }
    } catch (error) {
      this.hideTyping();
      this.addMessage('Sorry, I encountered a network error. Please try again.', 'assistant');
      console.error('❌ AiCareXpert: Network error:', error);
    }
  }
};

console.log('✅ AiCareXpert Widget: Object created with properties:', Object.keys(window.AiCareXpert));
console.log('🎯 AiCareXpert Widget: Ready for initialization!');