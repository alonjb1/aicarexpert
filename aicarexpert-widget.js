/**
 * AiCareXpert Widget - Healthcare AI Chatbot
 * Version 3.0 - Complete rewrite with direct assignment
 */

console.log('AiCareXpert: Starting widget load...');

// Create empty object first
window.AiCareXpert = {};

// Assign each function individually with logging
console.log('AiCareXpert: Assigning sendTestMessage...');
window.AiCareXpert.sendTestMessage = function(message) {
  console.log('AiCareXpert: sendTestMessage called with:', message);
  alert('Test function works! Message: ' + (message || 'No message'));
  return true;
};
console.log('AiCareXpert: sendTestMessage assigned:', typeof window.AiCareXpert.sendTestMessage);

console.log('AiCareXpert: Assigning getConfig...');
window.AiCareXpert.getConfig = function() {
  console.log('AiCareXpert: getConfig called');
  return window.AiCareXpert.config || { status: 'not initialized' };
};
console.log('AiCareXpert: getConfig assigned:', typeof window.AiCareXpert.getConfig);

console.log('AiCareXpert: Assigning init...');
window.AiCareXpert.init = function(config) {
  console.log('AiCareXpert: init called with config:', config);
  
  // Store config
  window.AiCareXpert.config = config;
  
  // Create the widget
  createWidget(config);
  
  console.log('AiCareXpert: Widget initialized');
  return true;
};
console.log('AiCareXpert: init assigned:', typeof window.AiCareXpert.init);

// Final check
console.log('AiCareXpert: All functions assigned. Object keys:', Object.keys(window.AiCareXpert));
console.log('AiCareXpert: sendTestMessage type:', typeof window.AiCareXpert.sendTestMessage);
console.log('AiCareXpert: getConfig type:', typeof window.AiCareXpert.getConfig);
console.log('AiCareXpert: init type:', typeof window.AiCareXpert.init);

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