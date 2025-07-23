// AiCareXpert Widget - Production Version
console.log('🚀 AiCareXpert Widget Production: Loading...');

window.AiCareXpert = {
  version: '1.0.2-production',
  sessionId: null,
  userId: null,
  
  sendTestMessage: function(message) {
    console.log('🧪 AiCareXpert Test:', message);
    alert('AiCareXpert Test: ' + message);
    return 'Test successful';
  },
  
  getConfig: function() {
    console.log('📋 AiCareXpert: Getting config');
    return this.config || { status: 'No config set' };
  },
  
  init: function(options) {
    console.log('🔧 AiCareXpert: Initializing with options:', options);
    
    this.config = {
      tenantId: options.tenantId,
      assistantId: options.assistantId,
      widgetId: options.widgetId || 'aicarexpert-widget',
      apiUrl: options.apiUrl,
      supabaseAnonKey: options.supabaseAnonKey,
      config: options.config || {}
    };
    
    console.log('🔧 Config stored:', this.config);
    this.createWidget();
    console.log('✅ AiCareXpert: Widget initialized successfully');
    return 'Widget initialized';
  },
  
  createWidget: function() {
    console.log('🎨 AiCareXpert: Creating widget UI');
    
    // Remove existing widget
    const existing = document.getElementById(this.config.widgetId);
    if (existing) existing.remove();
    
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
        <!-- Chat Button -->
        <button onclick="window.AiCareXpert.toggleWidget()" style="
          width: 60px;
          height: 60px;
          background: ${this.config.config.primaryColor || '#2563EB'};
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: white;
          font-size: 24px;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          💬
        </button>
        
        <!-- Chat Window -->
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
          <!-- Header -->
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
            <button onclick="window.AiCareXpert.toggleWidget()" style="
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 4px;
              border-radius: 4px;
              font-size: 18px;
            " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='none'">
              ✕
            </button>
          </div>
          
          <!-- Messages -->
          <div id="${this.config.widgetId}-messages" style="
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
          ">
            ${this.config.config.showWelcome !== false ? `
            <div style="
              background: #f1f5f9;
              padding: 10px 12px;
              border-radius: 12px;
              border-bottom-left-radius: 4px;
              font-size: 14px;
              line-height: 1.4;
              color: #334155;
            ">
              ${this.config.config.welcomeMessage || 'Hello! How can I help you today?'}
            </div>
            ` : ''}
          </div>
          
          <!-- Typing Indicator -->
          <div id="${this.config.widgetId}-typing" style="
            display: none;
            padding: 0 16px 8px 16px;
          ">
            <div style="
              background: #f1f5f9;
              padding: 10px 12px;
              border-radius: 12px;
              border-bottom-left-radius: 4px;
              display: flex;
              gap: 4px;
              align-items: center;
            ">
              <div style="display: flex; gap: 4px;">
                <div style="width: 6px; height: 6px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
                <div style="width: 6px; height: 6px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out; animation-delay: 0.2s;"></div>
                <div style="width: 6px; height: 6px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out; animation-delay: 0.4s;"></div>
              </div>
            </div>
          </div>
          
          <!-- Input -->
          <div style="
            padding: 16px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 8px;
          ">
            <input 
              type="text" 
              id="${this.config.widgetId}-input"
              placeholder="${this.config.config.placeholder || 'Type your message...'}"
              style="
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                outline: none;
                font-size: 14px;
              "
              onfocus="this.style.borderColor='${this.config.config.primaryColor || '#2563EB'}'"
              onblur="this.style.borderColor='#d1d5db'"
            />
            <button 
              id="${this.config.widgetId}-send"
              style="
                width: 40px;
                height: 40px;
                background: ${this.config.config.secondaryColor || '#059669'};
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
                color: white;
                font-size: 16px;
              "
              onmouseover="if(!this.disabled) this.style.background='#047857'"
              onmouseout="if(!this.disabled) this.style.background='${this.config.config.secondaryColor || '#059669'}'"
              type="button"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
      
      <style>
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
        
        @media (max-width: 480px) {
          #${this.config.widgetId}-window {
            width: calc(100vw - 40px) !important;
            height: calc(100vh - 100px) !important;
            bottom: 80px !important;
            right: 20px !important;
          }
        }
      </style>
    `;
    
    document.body.appendChild(widget);
    
    // Add event listeners after DOM is created
    this.setupEventListeners();
    
    console.log('✅ AiCareXpert: Widget UI created with event listeners');
  },
  
  setupEventListeners: function() {
    console.log('🔗 AiCareXpert: Setting up event listeners');
    
    const input = document.getElementById(this.config.widgetId + '-input');
    const sendButton = document.getElementById(this.config.widgetId + '-send');
    
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          console.log('⌨️ AiCareXpert: Enter key pressed');
          this.sendMessage();
        }
      });
      console.log('✅ AiCareXpert: Input event listener added');
    } else {
      console.error('❌ AiCareXpert: Input element not found for event listener');
    }
    
    if (sendButton) {
      sendButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🖱️ AiCareXpert: Send button clicked');
        this.sendMessage();
      });
      console.log('✅ AiCareXpert: Send button event listener added');
    } else {
      console.error('❌ AiCareXpert: Send button not found for event listener');
    }
  },
  
  toggleWidget: function() {
    console.log('🔄 AiCareXpert: Toggling widget');
    const chatWindow = document.getElementById(this.config.widgetId + '-window');
    if (chatWindow) {
      const isVisible = chatWindow.style.display === 'flex';
      chatWindow.style.display = isVisible ? 'none' : 'flex';
      
      if (!isVisible) {
        // Focus input when opening
        setTimeout(() => {
          const input = document.getElementById(this.config.widgetId + '-input');
          if (input) input.focus();
        }, 100);
      }
    }
  },
  
  addMessage: function(content, role) {
    console.log(`💬 AiCareXpert: Adding ${role} message:`, content);
    const messagesContainer = document.getElementById(this.config.widgetId + '-messages');
    if (!messagesContainer) {
      console.error('❌ AiCareXpert: Messages container not found');
      return;
    }
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      max-width: 80%;
      padding: 10px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      ${role === 'user' 
        ? `background: ${this.config.config.primaryColor || '#2563EB'}; color: white; align-self: flex-end; border-bottom-right-radius: 4px;`
        : `background: #f1f5f9; color: #334155; align-self: flex-start; border-bottom-left-radius: 4px;`
      }
    `;
    messageEl.textContent = content;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    console.log('✅ AiCareXpert: Message added to UI');
  },
  
  showTyping: function() {
    console.log('⏳ AiCareXpert: Showing typing indicator');
    const typingEl = document.getElementById(this.config.widgetId + '-typing');
    if (typingEl) {
      typingEl.style.display = 'block';
      const messagesContainer = document.getElementById(this.config.widgetId + '-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  },
  
  hideTyping: function() {
    console.log('⏹️ AiCareXpert: Hiding typing indicator');
    const typingEl = document.getElementById(this.config.widgetId + '-typing');
    if (typingEl) typingEl.style.display = 'none';
  },
  
  sendMessage: async function() {
    console.log('🚀 AiCareXpert: sendMessage function called!');
    
    const input = document.getElementById(this.config.widgetId + '-input');
    const sendButton = document.getElementById(this.config.widgetId + '-send');
    
    if (!input) {
      console.error('❌ AiCareXpert: Input element not found');
      return;
    }
    
    if (!sendButton) {
      console.error('❌ AiCareXpert: Send button not found');
      return;
    }
    
    const message = input.value.trim();
    if (!message) {
      console.log('❌ AiCareXpert: Empty message, not sending');
      return;
    }
    
    console.log('📤 AiCareXpert: Sending message:', message);
    
    // Add user message
    this.addMessage(message, 'user');
    input.value = '';
    sendButton.disabled = true;
    sendButton.style.background = '#9ca3af';
    sendButton.style.cursor = 'not-allowed';
    this.showTyping();
    
    try {
      console.log('🌐 AiCareXpert: Making API call to:', this.config.apiUrl);
      console.log('🔑 AiCareXpert: Using tenant ID:', this.config.tenantId);
      console.log('🤖 AiCareXpert: Using assistant ID:', this.config.assistantId);
      
      const requestBody = {
        message: message,
        tenantId: this.config.tenantId,
        assistantId: this.config.assistantId,
        sessionId: this.sessionId,
        userId: this.userId
      };
      
      console.log('📦 AiCareXpert: Request body:', requestBody);
      
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZWZkbG9leGhzdmJ5bHZ5amhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTkzOTgsImV4cCI6MjA2ODYzNTM5OH0.mTZ29J3RdW0MgnN1tsKf6MnNZHuBa708FbVy4R6oCgA'
        },
        body: JSON.stringify(requestBody)
      });
      
      this.hideTyping();
      
      console.log('📡 AiCareXpert: API response status:', response.status);
      console.log('📡 AiCareXpert: API response headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ AiCareXpert: API response data:', data);
        
        // Update session info
        if (data.sessionId) {
          this.sessionId = data.sessionId;
          console.log('🔄 AiCareXpert: Session ID updated:', this.sessionId);
        }
        if (data.userId) {
          this.userId = data.userId;
          console.log('🔄 AiCareXpert: User ID updated:', this.userId);
        }
        
        // Add assistant response
        this.addMessage(data.response, 'assistant');
        console.log('✅ AiCareXpert: Assistant response added to chat');
      } else {
        const errorText = await response.text();
        console.error('❌ AiCareXpert: API error:', response.status, errorText);
        this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
      }
    } catch (error) {
      console.error('❌ AiCareXpert: Network error:', error);
      this.hideTyping();
      this.addMessage('Sorry, I encountered a network error. Please try again.', 'assistant');
    } finally {
      sendButton.disabled = false;
      sendButton.style.background = this.config.config.secondaryColor || '#059669';
      sendButton.style.cursor = 'pointer';
      input.focus();
      console.log('🔄 AiCareXpert: Send button re-enabled');
    }
  }
};

console.log('✅ AiCareXpert Widget Production: Loaded successfully with properties:', Object.keys(window.AiCareXpert));