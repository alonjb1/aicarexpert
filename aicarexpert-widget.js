(function() {
  'use strict';
  
  console.log('AiCareXpert widget loading...');
  
  window.AiCareXpert = {
    init: function(options) {
      console.log('Initializing widget with options:', options);
      
      const config = options.config;
      const tenantId = options.tenantId;
      const assistantId = options.assistantId;
      const apiUrl = options.apiUrl;
      
      // Validate required options
      if (!tenantId || !assistantId || !apiUrl) {
        console.error('Missing required options:', { tenantId, assistantId, apiUrl });
        return;
      }
      
      // Prevent multiple widgets
      if (document.getElementById('aicarexpert-widget')) {
        console.log('Widget already exists, skipping...');
        return;
      }
      
      console.log('Creating widget...');
      
      // Create widget container
      const widget = document.createElement('div');
      widget.id = 'aicarexpert-widget';
      widget.style.cssText = `
        position: fixed;
        ${config.position.includes('bottom') ? 'bottom' : 'top'}: 20px;
        ${config.position.includes('right') ? 'right' : 'left'}: 20px;
        z-index: 10000;
        font-family: ${config.fontFamily || 'Arial'}, sans-serif;
      `;
      
      // Get widget dimensions
      const getWidgetSize = () => {
        switch (config.size) {
          case 'small': return { width: '300px', height: '400px' };
          case 'large': return { width: '400px', height: '600px' };
          default: return { width: '350px', height: '500px' };
        }
      };
      
      const widgetSize = getWidgetSize();
      
      // Widget HTML structure
      widget.innerHTML = `
        <div id="chat-button" style="
          width: 60px;
          height: 60px;
          background: ${config.primaryColor || '#2563EB'};
          border-radius: ${config.borderRadius === '20px' ? '50%' : (config.borderRadius || '8px')};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          margin-bottom: 10px;
          transition: all 0.3s ease;
          border: none;
        ">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <div id="chat-window" style="
          width: ${widgetSize.width};
          height: ${widgetSize.height};
          background: white;
          border-radius: ${config.borderRadius || '8px'};
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        ">
          <div style="
            background: ${config.primaryColor || '#2563EB'};
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${config.chatTitle || 'AI Assistant'}</h3>
              <p style="margin: 0; font-size: 12px; opacity: 0.9;">Online now</p>
            </div>
            <button id="close-chat" style="
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              font-size: 20px;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">×</button>
          </div>
          <div id="messages" style="
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            min-height: 0;
          ">
            ${config.showWelcome ? `
              <div style="
                background: #f3f4f6;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 16px;
                max-width: 80%;
                font-size: 14px;
                line-height: 1.4;
              ">${config.welcomeMessage || 'Hello! How can I help you today?'}</div>
            ` : ''}
          </div>
          <div style="
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 8px;
          ">
            <input id="message-input" type="text" placeholder="${config.placeholder || 'Type your message...'}" style="
              flex: 1;
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 14px;
              outline: none;
              font-family: inherit;
            ">
            <button id="send-button" style="
              background: ${config.secondaryColor || '#059669'};
              color: white;
              border: none;
              padding: 10px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              min-width: 60px;
            ">Send</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(widget);
      console.log('Widget HTML added to page');
      
      // Widget functionality
      const chatButton = document.getElementById('chat-button');
      const chatWindow = document.getElementById('chat-window');
      const closeButton = document.getElementById('close-chat');
      const messageInput = document.getElementById('message-input');
      const sendButton = document.getElementById('send-button');
      const messagesContainer = document.getElementById('messages');
      
      let isOpen = config.autoOpen || false;
      let sessionId = localStorage.getItem('aicarexpert-session-id-' + tenantId);
      let userId = localStorage.getItem('aicarexpert-user-id-' + tenantId);
      
      console.log('Session info:', { sessionId, userId });
      
      if (isOpen) {
        chatWindow.style.display = 'flex';
      }
      
      chatButton.addEventListener('click', () => {
        console.log('Chat button clicked');
        isOpen = !isOpen;
        chatWindow.style.display = isOpen ? 'flex' : 'none';
      });
      
      closeButton.addEventListener('click', () => {
        console.log('Close button clicked');
        isOpen = false;
        chatWindow.style.display = 'none';
      });
      
      function addMessage(content, isUser = false) {
        console.log('Adding message:', { content: content.substring(0, 50), isUser });
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
          background: ${isUser ? (config.primaryColor || '#2563EB') : '#f3f4f6'};
          color: ${isUser ? 'white' : '#374151'};
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          max-width: 80%;
          align-self: ${isUser ? 'flex-end' : 'flex-start'};
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        `;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      
      function showTypingIndicator() {
        if (!config.enableTyping) return null;
        
        console.log('Showing typing indicator');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.style.cssText = `
          background: #f3f4f6;
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          max-width: 80%;
          font-size: 14px;
          color: #6b7280;
          align-self: flex-start;
        `;
        typingDiv.textContent = 'AI is typing...';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
      }
      
      function removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
          console.log('Removing typing indicator');
          indicator.parentNode.removeChild(indicator);
        }
      }
      
      function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) {
          console.log('Empty message, not sending');
          return;
        }
        
        console.log('Sending message:', message);
        
        // Disable input while processing
        messageInput.disabled = true;
        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';
        
        // Add user message
        addMessage(message, true);
        messageInput.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Prepare request data
        const requestData = {
          message: message,
          tenantId: tenantId,
          assistantId: assistantId,
          sessionId: sessionId,
          userId: userId
        };
        
        console.log('Calling API:', apiUrl, requestData);
        
        // Call API
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        })
        .then(response => {
          console.log('API response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('API response data:', data);
          removeTypingIndicator(typingIndicator);
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          // Add AI response
          addMessage(data.response);
          
          // Store session info
          if (data.sessionId) {
            sessionId = data.sessionId;
            localStorage.setItem('aicarexpert-session-id-' + tenantId, sessionId);
            console.log('Stored session ID:', sessionId);
          }
          if (data.userId) {
            userId = data.userId;
            localStorage.setItem('aicarexpert-user-id-' + tenantId, userId);
            console.log('Stored user ID:', userId);
          }
        })
        .catch(error => {
          console.error('Chat error:', error);
          removeTypingIndicator(typingIndicator);
          
          // Show error message
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            background: #fee2e2;
            color: #dc2626;
            padding: 10px 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            max-width: 80%;
            font-size: 14px;
            align-self: flex-start;
          `;
          errorDiv.textContent = 'Sorry, I encountered an error. Please try again.';
          messagesContainer.appendChild(errorDiv);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .finally(() => {
          // Re-enable input
          messageInput.disabled = false;
          sendButton.disabled = false;
          sendButton.textContent = 'Send';
          messageInput.focus();
        });
      }
      
      sendButton.addEventListener('click', sendMessage);
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      
      console.log('Widget initialization complete');
    }
  };
  
  console.log('AiCareXpert widget script loaded');
})();
