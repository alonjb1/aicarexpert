/**
 * AiCareXpert Widget - Healthcare AI Chatbot
 * Version 3.2 - Ultra-robust with extensive debugging
 */

// STEP 1: Immediate availability check
console.log('=== AiCareXpert Widget Loading Started ===');
console.log('Current window.AiCareXpert:', typeof window.AiCareXpert);

try {
  // STEP 2: Create object IMMEDIATELY with minimal dependencies
  console.log('Creating AiCareXpert object...');
  
  window.AiCareXpert = {};
  
  console.log('Base object created, adding functions...');
  
  // STEP 3: Add functions one by one with error handling
  window.AiCareXpert.sendTestMessage = function(message) {
    console.log('AiCareXpert: sendTestMessage called with:', message);
    try {
      const msg = 'Test function works! Message: ' + (message || 'No message');
      alert(msg);
      return true;
    } catch (e) {
      console.error('Error in sendTestMessage:', e);
      return false;
    }
  };
  
  console.log('sendTestMessage added');
  
  window.AiCareXpert.getConfig = function() {
    console.log('AiCareXpert: getConfig called');
    try {
      return window.AiCareXpert.config || { 
        status: 'not initialized',
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      console.error('Error in getConfig:', e);
      return { status: 'error', error: e.message };
    }
  };
  
  console.log('getConfig added');
  
  window.AiCareXpert.init = function(config) {
    console.log('AiCareXpert: init called with config:', config);
    
    try {
      window.AiCareXpert.config = config || {};
      window.AiCareXpert.config.initialized = true;
      window.AiCareXpert.config.initTime = new Date().toISOString();
      
      // Create widget with delay to ensure DOM is ready
      setTimeout(function() {
        try {
          createWidget(window.AiCareXpert.config);
        } catch (widgetError) {
          console.error('Widget creation error:', widgetError);
        }
      }, 100);
      
      console.log('AiCareXpert: Widget initialization started');
      return true;
    } catch (e) {
      console.error('AiCareXpert: Error in init:', e);
      return false;
    }
  };
  
  console.log('init added');
  
  // Debug function
  window.AiCareXpert.debug = function() {
    return {
      version: '3.2',
      loaded: true,
      functions: Object.keys(window.AiCareXpert),
      config: window.AiCareXpert.config,
      timestamp: new Date().toISOString()
    };
  };
  
  console.log('debug added');
  
  // STEP 4: Verify all functions are there
  const functions = Object.keys(window.AiCareXpert);
  console.log('All functions added:', functions);
  
  // STEP 5: Test each function exists
  console.log('Function availability check:');
  console.log('- sendTestMessage:', typeof window.AiCareXpert.sendTestMessage);
  console.log('- getConfig:', typeof window.AiCareXpert.getConfig);
  console.log('- init:', typeof window.AiCareXpert.init);
  console.log('- debug:', typeof window.AiCareXpert.debug);
  
} catch (mainError) {
  console.error('CRITICAL ERROR creating AiCareXpert object:', mainError);
  console.error('Stack trace:', mainError.stack);
  
  // Fallback - create minimal object
  try {
    window.AiCareXpert = {
      error: true,
      message: mainError.message,
      sendTestMessage: function() { alert('Error mode - main script failed'); },
      getConfig: function() { return { error: true, message: mainError.message }; }
    };
    console.log('Fallback object created');
  } catch (fallbackError) {
    console.error('Even fallback failed:', fallbackError);
  }
}

// Widget creation function - defined outside try-catch to ensure availability
function createWidget(config) {
  console.log('AiCareXpert: Creating widget with config:', config);
  
  try {
    // Remove existing widget
    const existing = document.getElementById('aicarexpert-widget');
    if (existing) {
      existing.remove();
      console.log('Removed existing widget');
    }
    
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
        transition: all 0.3s ease;
      " title="AiCareXpert Chat">
        💬
      </button>
    `;
    
    const button = widget.querySelector('button');
    button.addEventListener('click', function() {
      alert('Widget clicked! Config: ' + JSON.stringify(config, null, 2));
    });
    
    document.body.appendChild(widget);
    console.log('Widget created and added to DOM');
    
    return true;
  } catch (e) {
    console.error('Error in createWidget:', e);
    return false;
  }
}

// Final verification
console.log('=== Final Status Check ===');
console.log('window.AiCareXpert exists:', typeof window.AiCareXpert !== 'undefined');
console.log('Available functions:', window.AiCareXpert ? Object.keys(window.AiCareXpert) : 'none');

// Dispatch ready event
try {
  setTimeout(function() {
    if (typeof window.CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent('AiCareXpertLoaded', { 
        detail: { 
          status: 'loaded',
          functions: window.AiCareXpert ? Object.keys(window.AiCareXpert) : []
        }
      }));
    }
  }, 50);
} catch (e) {
  console.log('Could not dispatch event:', e);
}

console.log('=== AiCareXpert Widget Loading Complete ===');