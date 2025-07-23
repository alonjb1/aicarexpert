// AiCareXpert Widget v2 - Fresh File to Bypass Cache
console.log('🚀 WIDGET V2: Script execution started!');
console.log('🚀 WIDGET V2: Creating AiCareXpert object...');

window.AiCareXpert = {
  version: '2.0.0',
  
  sendTestMessage: function(message) {
    console.log('🧪 WIDGET V2: Test message:', message);
    alert('WIDGET V2 Test: ' + message);
    return 'Test successful';
  },
  
  getConfig: function() {
    console.log('📋 WIDGET V2: Getting config');
    return this.config || { version: '2.0.0', status: 'working' };
  },
  
  init: function(options) {
    console.log('🔧 WIDGET V2: Initializing with options:', options);
    
    this.config = options;
    this.createWidget();
    
    console.log('✅ WIDGET V2: Initialization complete');
    return 'Widget v2 initialized';
  },
  
  createWidget: function() {
    console.log('🎨 WIDGET V2: Creating widget UI');
    
    const existing = document.getElementById(this.config.widgetId);
    if (existing) existing.remove();
    
    const widget = document.createElement('div');
    widget.id = this.config.widgetId;
    widget.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: Arial, sans-serif;
      ">
        <button onclick="window.AiCareXpert.toggleWidget()" style="
          width: 60px;
          height: 60px;
          background: ${this.config.config?.primaryColor || '#2563EB'};
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          color: white;
          font-size: 24px;
        ">💬</button>
        
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
        ">
          <div style="
            background: ${this.config.config?.primaryColor || '#2563EB'};
            color: white;
            padding: 16px;
            text-align: center;
          ">
            <h3 style="margin: 0;">${this.config.config?.chatTitle || 'AI Assistant'}</h3>
          </div>
          
          <div style="flex: 1; padding: 16px;">
            <div style="
              background: #f1f5f9;
              padding: 10px;
              border-radius: 8px;
            ">
              ${this.config.config?.welcomeMessage || 'Hello! How can I help you?'}
            </div>
          </div>
          
          <div style="
            padding: 16px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 8px;
          ">
            <input type="text" placeholder="${this.config.config?.placeholder || 'Type message...'}" style="
              flex: 1;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
            "/>
            <button style="
              padding: 8px 16px;
              background: ${this.config.config?.secondaryColor || '#059669'};
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">Send</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    console.log('✅ WIDGET V2: UI created successfully');
  },
  
  toggleWidget: function() {
    console.log('🔄 WIDGET V2: Toggling widget');
    const window = document.getElementById(this.config.widgetId + '-window');
    if (window) {
      const isVisible = window.style.display === 'flex';
      window.style.display = isVisible ? 'none' : 'flex';
    }
  }
};

console.log('✅ WIDGET V2: Object created with properties:', Object.keys(window.AiCareXpert));
console.log('✅ WIDGET V2: Script execution completed!');