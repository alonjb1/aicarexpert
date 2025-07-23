/**
 * AiCareXpert Widget - Healthcare AI Chatbot
 * Version 3.0 - Complete rewrite with direct assignment
 */

console.log('AiCareXpert: Starting widget load...');

// Create the global object and assign functions IMMEDIATELY
window.AiCareXpert = {
  // Test function - available immediately
  sendTestMessage: function(message) {
    console.log('AiCareXpert: sendTestMessage called with:', message);
    alert('Test function works! Message: ' + (message || 'No message'));
    return true;
  },

  // Config getter - available immediately  
  getConfig: function() {
    console.log('AiCareXpert: getConfig called');
    return window.AiCareXpert.config || { status: 'not initialized' };
  },

  // Initialize function
  init: function(config) {
    console.log('AiCareXpert: init called with config:', config);
    
    // Store config
    window.AiCareXpert.config = config;
    
    // Create the widget
    createWidget(config);
    
    console.log('AiCareXpert: Widget initialized');
    return true;
  }
};

console.log('AiCareXpert: Functions assigned:', Object.keys(window.AiCareXpert));

// Widget creation function
function createWidget(config) {
  console.log('AiCareXpert: Creating widget...');
  
  // Simple widget creation
  const widget = document.createElement('div');
  widget.id = 'aicarexpert-widget';
  widget.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
  `;
  
  widget.innerHTML = `
    <button style="
      width: 60px;
      height: 60px;
      background: #2563EB;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      color: white;
      font-size: 24px;
    " onclick="alert('Widget button clicked!')">
      💬
    </button>
  `;
  
  document.body.appendChild(widget);
  console.log('AiCareXpert: Widget created');
}

console.log('AiCareXpert: Widget script loaded completely');