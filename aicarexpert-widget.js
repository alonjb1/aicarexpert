// AiCareXpert Widget - Debug Version with Execution Tracing
console.log('🚀 STEP 1: Script file started executing...');

try {
  console.log('🚀 STEP 2: About to create AiCareXpert object...');
  
  // Check if object already exists
  if (window.AiCareXpert) {
    console.log('⚠️ WARNING: AiCareXpert already exists with properties:', Object.keys(window.AiCareXpert));
  }
  
  console.log('🚀 STEP 3: Creating new AiCareXpert object...');
  
  window.AiCareXpert = {
    // Test function for debugging
    sendTestMessage: function(message) {
      console.log('🧪 AiCareXpert Test Message:', message);
      alert('AiCareXpert Test: ' + message);
      return 'Test function executed successfully';
    },
    
    // Get current configuration
    getConfig: function() {
      console.log('📋 AiCareXpert: Getting config');
      return this.config || { debug: 'Config function working' };
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
      
      console.log('🔧 Config stored:', this.config);
      
      // Create widget UI
      this.createWidget();
      
      console.log('✅ AiCareXpert: Widget initialized successfully');
      return 'Widget initialized';
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
          <button style="
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
            color: white;
            font-size: 24px;
          " onclick="window.AiCareXpert.toggleWidget()">
            💬
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
              text-align: center;
            ">
              <h3 style="margin: 0;">${this.config.config.chatTitle || 'AI Assistant'}</h3>
            </div>
            
            <div style="
              flex: 1;
              padding: 16px;
              overflow-y: auto;
            ">
              <div style="
                background: #f1f5f9;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 10px;
              ">
                ${this.config.config.welcomeMessage || 'Hello! How can I help you today?'}
              </div>
            </div>
            
            <div style="
              padding: 16px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              gap: 8px;
            ">
              <input 
                type="text" 
                placeholder="${this.config.config.placeholder || 'Type your message...'}"
                style="
                  flex: 1;
                  padding: 8px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                "
              />
              <button style="
                padding: 8px 16px;
                background: ${this.config.config.secondaryColor || '#059669'};
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
      console.log('✅ AiCareXpert: Widget UI created');
      return 'Widget UI created';
    },
    
    // Toggle widget visibility
    toggleWidget: function() {
      console.log('🔄 Toggling widget');
      const window = document.getElementById(this.config.widgetId + '-window');
      if (window) {
        const isVisible = window.style.display === 'flex';
        window.style.display = isVisible ? 'none' : 'flex';
        console.log('Widget toggled to:', isVisible ? 'hidden' : 'visible');
      }
      return 'Widget toggled';
    },
    
    // Debug info
    debug: {
      version: '1.0.0-debug',
      loaded: new Date().toISOString(),
      test: 'Debug object working'
    }
  };
  
  console.log('🚀 STEP 4: AiCareXpert object created successfully');
  console.log('🚀 STEP 5: Object properties:', Object.keys(window.AiCareXpert));
  console.log('🚀 STEP 6: sendTestMessage type:', typeof window.AiCareXpert.sendTestMessage);
  console.log('🚀 STEP 7: getConfig type:', typeof window.AiCareXpert.getConfig);
  
  // Test the functions immediately
  console.log('🧪 STEP 8: Testing sendTestMessage...');
  if (window.AiCareXpert.sendTestMessage) {
    console.log('✅ sendTestMessage exists and is callable');
  } else {
    console.log('❌ sendTestMessage missing after creation');
  }
  
  console.log('🧪 STEP 9: Testing getConfig...');
  if (window.AiCareXpert.getConfig) {
    console.log('✅ getConfig exists and is callable');
  } else {
    console.log('❌ getConfig missing after creation');
  }
  
  console.log('✅ STEP 10: Script execution completed successfully!');
  
} catch (error) {
  console.error('❌ ERROR during script execution:', error);
  console.error('❌ Error stack:', error.stack);
}

console.log('🎯 FINAL: Script file finished executing');