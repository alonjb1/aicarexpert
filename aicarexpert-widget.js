/**
 * AiCareXpert Widget - Simplest Possible Version
 */

console.log('AiCareXpert: Widget loading...');

// Create the object and assign functions immediately
window.AiCareXpert = {
  sendTestMessage: function(message) {
    console.log('sendTestMessage called with:', message);
    alert('Test message: ' + (message || 'Hello!'));
  },
  
  getConfig: function() {
    console.log('getConfig called');
    return this.config || { status: 'not initialized' };
  },
  
  init: function(config) {
    console.log('init called with:', config);
    this.config = config;
    this.createWidget(config);
  },
  
  createWidget: function(config) {
    console.log('Creating widget...');
    
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
      " onclick="alert('Widget clicked!')">
        💬
      </button>
    `;
    
    document.body.appendChild(widget);
    console.log('Widget created successfully');
  }
};

console.log('AiCareXpert: Object created with functions:', Object.keys(window.AiCareXpert));
console.log('AiCareXpert: Widget ready!');