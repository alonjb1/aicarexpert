(function() {
    'use strict';
    
    window.AiCareXpert = {
      init: function(options) {
        const config = options.config;
        const tenantId = options.tenantId;
        const assistantId = options.assistantId;
        const apiUrl = options.apiUrl;
        
        // Create widget container
        const widget = document.createElement('div');
        widget.id = 'aicarexpert-widget';
        widget.style.cssText = `
          position: fixed;
          ${config.position.includes('bottom') ? 'bottom' : 'top'}: 20px;
          ${config.position.includes('right') ? 'right' : 'left'}: 20px;
          z-index: 10000;
          font-family: ${config.fontFamily}, sans-serif;
        `;
        
        // Widget HTML structure
        widget.innerHTML = `
          <div id="chat-button" style="
            width: 60px;
            height: 60px;
            background: ${config.primaryColor};
            border-radius: ${config.borderRadius === '20px' ? '50%' : config.borderRadius};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            margin-bottom: 10px;
            transition: all 0.3s ease;
          ">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <div id="chat-window" style="
            width: ${config.size === 'small' ? '300px' : config.size === 'large' ? '400px' : '350px'};
            height: ${config.size === 'small' ? '400px' : config.size === 'large' ? '600px' : '500px'};
            background: white;
            border-radius: ${config.borderRadius};
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            display: none;
            flex-direction: column;
            overflow: hidden;
          ">
            <div style="
              background: ${config.primaryColor};
              color: white;
              padding: 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${config.chatTitle}</h3>
                <p style="margin: 0; font-size: 12px; opacity: 0.9;">Online now</p>
              </div>
              <button id="close-chat" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 18px;
              ">×</button>
            </div>
            <div id="messages" style="
              flex: 1;
              padding: 16px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
            ">
              ${config.showWelcome ? `
                <div style="
                  background: #f3f4f6;
                  padding: 12px;
                  border-radius: 8px;
                  margin-bottom: 16px;
                  max-width: 80%;
                  font-size: 14px;
                ">${config.welcomeMessage}</div>
              ` : ''}
            </div>
            <div style="
              padding: 16px;
              border-top: 1px solid #e5e7eb;
              display: flex;
              gap: 8px;
            ">
              <input id="message-input" type="text" placeholder="${config.placeholder}" style="
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
                outline: none;
              ">
              <button id="send-button" style="
                background: ${config.secondaryColor};
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
              ">Send</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(widget);
        
        // Widget functionality
        const chatButton = document.getElementById('chat-button');
        const chatWindow = document.getElementById('chat-window');
        const closeButton = document.getElementById('close-chat');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const messagesContainer = document.getElementById('messages');
        
        let isOpen = config.autoOpen;
        if (isOpen) {
          chatWindow.style.display = 'flex';
        }
        
        chatButton.addEventListener('click', () => {
          isOpen = !isOpen;
          chatWindow.style.display = isOpen ? 'flex' : 'none';
        });
        
        closeButton.addEventListener('click', () => {
          isOpen = false;
          chatWindow.style.display = 'none';
        });
        
        function sendMessage() {
          const message = messageInput.value.trim();
          if (!message) return;
          
          // Add user message
          const userMsg = document.createElement('div');
          userMsg.style.cssText = `
            background: ${config.primaryColor};
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            max-width: 80%;
            align-self: flex-end;
            font-size: 14px;
          `;
          userMsg.textContent = message;
          messagesContainer.appendChild(userMsg);
          
          messageInput.value = '';
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
          
          // Show typing indicator
          if (config.enableTyping) {
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.style.cssText = `
              background: #f3f4f6;
              padding: 8px 12px;
              border-radius: 8px;
              margin-bottom: 8px;
              max-width: 80%;
              font-size: 14px;
              color: #6b7280;
            `;
            typingDiv.textContent = 'AI is typing...';
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
          
          // Call your API
          fetch(`${apiUrl}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: message,
              tenantId: tenantId,
              assistantId: assistantId,
              sessionId: localStorage.getItem('aicarexpert-session-id'),
              userId: localStorage.getItem('aicarexpert-user-id')
            })
          })
          .then(response => response.json())
          .then(data => {
            // Remove typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
              typingIndicator.remove();
            }
            
            // Add AI response
            const aiMsg = document.createElement('div');
            aiMsg.style.cssText = `
              background: #f3f4f6;
              padding: 8px 12px;
              border-radius: 8px;
              margin-bottom: 8px;
              max-width: 80%;
              font-size: 14px;
            `;
            aiMsg.textContent = data.response;
            messagesContainer.appendChild(aiMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Store session info
            if (data.sessionId) {
              localStorage.setItem('aicarexpert-session-id', data.sessionId);
            }
            if (data.userId) {
              localStorage.setItem('aicarexpert-user-id', data.userId);
            }
          })
          .catch(error => {
            console.error('Chat error:', error);
            // Remove typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
              typingIndicator.remove();
            }
            
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
              background: #fee2e2;
              color: #dc2626;
              padding: 8px 12px;
              border-radius: 8px;
              margin-bottom: 8px;
              max-width: 80%;
              font-size: 14px;
            `;
            errorMsg.textContent = 'Sorry, I encountered an error. Please try again.';
            messagesContainer.appendChild(errorMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          });
        }
        
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
      }
    };
  })();
  