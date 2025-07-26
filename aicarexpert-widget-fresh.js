// AiCareXpert Widget - Working Version (copied from fresh)
console.log('🚀 AiCareXpert Widget: Script execution started!');

window.AiCareXpert = {
  version: '1.0.3-working',
  sessionId: null,
  userId: null,
  leadForms: [],
  showingForm: null,
  
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
    
    console.log('🔧 AiCareXpert: Config stored:', this.config);
    this.createWidget();
    console.log('✅ AiCareXpert: Widget initialized successfully');
    return 'Widget initialized';
  },
  
  loadLeadForms: async function() {
    try {
      console.log('📋 AiCareXpert: Loading lead forms...');
      
      const response = await fetch(`${this.config.apiUrl.replace('/widget-chat-v2', '')}/get-lead-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
          'apikey': this.config.supabaseAnonKey
        },
        body: JSON.stringify({
          tenantId: this.config.tenantId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter forms based on widget configuration
        const allForms = data.forms || [];
        console.log('📋 AiCareXpert: Received forms from server:', allForms.length);
        
        // Only show forms that are enabled and selected in the Design Center
        if (this.config.config.enableLeadForms && this.config.config.selectedLeadForms) {
          this.leadForms = allForms.filter(form => 
            form.is_active && this.config.config.selectedLeadForms.includes(form.id)
          );
          console.log('📋 AiCareXpert: Filtered to selected forms:', this.leadForms.length);
          console.log('📋 AiCareXpert: Selected form IDs:', this.config.config.selectedLeadForms);
        } else {
          this.leadForms = []; // No forms if lead forms are disabled
          console.log('📋 AiCareXpert: Lead forms disabled in config');
        }
        
        console.log('✅ AiCareXpert: Lead forms loaded:', this.leadForms.length);
      } else {
        console.warn('⚠️ AiCareXpert: Failed to load lead forms');
      }
    } catch (error) {
      console.error('❌ AiCareXpert: Error loading lead forms:', error);
    }
  },
  
  updateLeadButtons: function() {
    // Don't show buttons if lead forms are disabled
    if (!this.config.config.enableLeadForms || !this.leadForms || this.leadForms.length === 0) {
      console.log('🚫 AiCareXpert: Lead forms disabled or no forms available');
      return;
    }
    
    console.log('📋 AiCareXpert: Updating lead buttons, forms available:', this.leadForms.length);
    
    const messagesContainer = document.getElementById(this.config.widgetId + '-messages');
    if (!messagesContainer) return;
    
    // Remove existing lead buttons
    const existingButtons = messagesContainer.querySelector('.lead-buttons-container');
    if (existingButtons) {
      existingButtons.remove();
    }
    
    // Create lead buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'lead-buttons-container';
    buttonsContainer.style.cssText = `
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    
    // Add buttons for each selected and active lead form
    this.leadForms.forEach(form => {
      console.log('➕ AiCareXpert: Adding button for form:', form.name);
      const button = document.createElement('button');
      button.textContent = form.button_text;
      button.onclick = () => this.showLeadForm(form);
      button.style.cssText = `
        background: ${this.config.config.secondaryColor || '#059669'};
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
      `;
      button.onmouseover = function() {
        this.style.background = '#047857';
      };
      button.onmouseout = function() {
        this.style.background = window.AiCareXpert.config.config.secondaryColor || '#059669';
      };
      
      buttonsContainer.appendChild(button);
    });
    
    // Add to messages container
    messagesContainer.appendChild(buttonsContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    console.log('✅ AiCareXpert: Lead buttons added to chat');
  },
  
  showLeadForm: function(form) {
    console.log('📝 AiCareXpert: Showing lead form:', form.name);
    this.showingForm = form;
    
    const messagesContainer = document.getElementById(this.config.widgetId + '-messages');
    if (!messagesContainer) return;
    
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.className = 'lead-form-container';
    formContainer.style.cssText = `
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin: 12px 0;
    `;
    
    // Form title
    const title = document.createElement('h4');
    title.textContent = form.name;
    title.style.cssText = `
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    `;
    formContainer.appendChild(title);
    
    // Create form
    const formElement = document.createElement('form');
    formElement.id = this.config.widgetId + '-lead-form';
    formElement.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;
    
    // Add form fields
    form.form_fields.forEach((field, index) => {
      const fieldContainer = document.createElement('div');
      
      // Field label
      const label = document.createElement('label');
      label.textContent = field.label + (field.required ? ' *' : '');
      label.style.cssText = `
        font-size: 12px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 4px;
        display: block;
      `;
      fieldContainer.appendChild(label);
      
      // Field input
      let input;
      if (field.type === 'select') {
        input = document.createElement('select');
        input.innerHTML = '<option value="">Select an option</option>';
        (field.options || []).forEach(option => {
          const optionEl = document.createElement('option');
          optionEl.value = option;
          optionEl.textContent = option;
          input.appendChild(optionEl);
        });
      } else if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 3;
      } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
      }
      
      input.name = field.label;
      input.placeholder = field.placeholder || '';
      input.required = field.required || false;
      input.style.cssText = `
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 13px;
        box-sizing: border-box;
      `;
      
      fieldContainer.appendChild(input);
      formElement.appendChild(fieldContainer);
    });
    
    // Form buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
    `;
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.style.cssText = `
      background: ${this.config.config.primaryColor || '#2563EB'};
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      flex: 1;
    `;
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => this.hideLeadForm();
    cancelButton.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      flex: 1;
    `;
    
    buttonContainer.appendChild(submitButton);
    buttonContainer.appendChild(cancelButton);
    formElement.appendChild(buttonContainer);
    
    // Form submit handler
    formElement.onsubmit = (e) => {
      e.preventDefault();
      this.submitLeadForm(formElement, form);
    };
    
    formContainer.appendChild(formElement);
    messagesContainer.appendChild(formContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Focus first input
    const firstInput = formElement.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
  },
  
  hideLeadForm: function() {
    const formContainer = document.querySelector('.lead-form-container');
    if (formContainer) {
      formContainer.remove();
    }
    this.showingForm = null;
  },
  
  submitLeadForm: async function(formElement, form) {
    console.log('📤 AiCareXpert: Submitting lead form...');
    
    // Collect form data
    const formData = new FormData(formElement);
    const submittedData = {};
    
    for (const [key, value] of formData.entries()) {
      submittedData[key] = value;
    }
    
    console.log('📋 AiCareXpert: Form data:', submittedData);
    
    // Disable submit button
    const submitButton = formElement.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl.replace('/widget-chat-v2', '')}/capture-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
          'apikey': this.config.supabaseAnonKey
        },
        body: JSON.stringify({
          formId: form.id,
          sessionId: this.sessionId,
          tenantId: this.config.tenantId,
          submittedData: submittedData
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ AiCareXpert: Lead submitted successfully');
        
        // Show success message
        this.hideLeadForm();
        this.addMessage(result.message || 'Thank you! Your information has been submitted successfully.', 'assistant');
        
        // Hide lead buttons since lead was captured
        const buttonsContainer = document.querySelector('.lead-buttons-container');
        if (buttonsContainer) {
          buttonsContainer.style.display = 'none';
        }
      } else {
        const error = await response.json();
        console.error('❌ AiCareXpert: Lead submission failed:', error);
        this.addMessage('Sorry, there was an error submitting your information. Please try again.', 'assistant');
      }
    } catch (error) {
      console.error('❌ AiCareXpert: Network error during lead submission:', error);
      this.addMessage('Sorry, there was a network error. Please try again.', 'assistant');
    } finally {
      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      }
    }
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
          'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
          'apikey': this.config.supabaseAnonKey
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
          
          // Load lead forms after session is established
          if (this.leadForms.length === 0) {
            this.loadLeadForms();
          }
          
          // Load lead forms after session is established
          if (this.leadForms.length === 0) {
            this.loadLeadForms();
          }
        }
        if (data.userId) {
          this.userId = data.userId;
          console.log('🔄 AiCareXpert: User ID updated:', this.userId);
        }
        
        // Add assistant response
        this.addMessage(data.response, 'assistant');
        
        // Show lead buttons after assistant response (if enabled and forms available)
        if (this.config.config.enableLeadForms && this.leadForms.length > 0) {
          setTimeout(() => {
            this.updateLeadButtons();
          }, 1000);
        }
        
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

console.log('✅ AiCareXpert: Object created with properties:', Object.keys(window.AiCareXpert));
console.log('✅ AiCareXpert: Script execution completed successfully!');