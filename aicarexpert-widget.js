console.log('=== PROTECTED WIDGET v1.0 ===');

// Step 1: Check what exists
console.log('BEFORE: window.AiCareXpert =', window.AiCareXpert);

// Step 2: Create protected object that can't be overwritten
(function() {
  'use strict';
  
  // Create the object
  const widgetObject = {
    sendTestMessage: function(message) {
      console.log('sendTestMessage called with:', message);
      alert('TEST MESSAGE WORKS: ' + message);
    },
    
    getConfig: function() {
      console.log('getConfig called');
      return { test: 'working', protected: true };
    },
    
    init: function(config) {
      console.log('init called with config:', config);
      alert('INIT WORKS');
    }
  };
  
  // Step 3: Use Object.defineProperty to make it non-configurable
  Object.defineProperty(window, 'AiCareXpert', {
    value: widgetObject,
    writable: false,
    configurable: false,
    enumerable: true
  });
  
  console.log('PROTECTED OBJECT ASSIGNED');
  console.log('Functions available:', Object.keys(window.AiCareXpert));
  console.log('sendTestMessage type:', typeof window.AiCareXpert.sendTestMessage);
  
})();

// Step 4: Verify immediately
console.log('IMMEDIATE CHECK:');
console.log('- Object exists:', !!window.AiCareXpert);
console.log('- sendTestMessage exists:', !!window.AiCareXpert.sendTestMessage);
console.log('- getConfig exists:', !!window.AiCareXpert.getConfig);

// Step 5: Monitor for overwrites
let checkCount = 0;
const monitor = setInterval(() => {
  checkCount++;
  console.log(`MONITOR ${checkCount}:`);
  console.log('- sendTestMessage exists:', !!window.AiCareXpert.sendTestMessage);
  console.log('- getConfig exists:', !!window.AiCareXpert.getConfig);
  
  if (checkCount >= 5) {
    clearInterval(monitor);
    console.log('=== MONITORING COMPLETE ===');
  }
}, 1000);

console.log('=== PROTECTED WIDGET LOADED ===');