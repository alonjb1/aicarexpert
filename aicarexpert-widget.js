console.log('=== UNIQUE WIDGET v1.0 STARTING ===');

// Use completely unique namespace to avoid conflicts
(function() {
  'use strict';
  
  console.log('Creating unique widget object...');
  
  // Check if something already exists
  if (window.AiCareXpert) {
    console.log('WARNING: AiCareXpert already exists with properties:', Object.keys(window.AiCareXpert));
    console.log('Existing object:', window.AiCareXpert);
  }
  
  // Create with unique namespace first
  window.AiCareXpertUnique = {
    sendTestMessage: function(message) {
      console.log('UNIQUE sendTestMessage called with:', message);
      alert('UNIQUE TEST MESSAGE: ' + message);
    },
    
    getConfig: function() {
      console.log('UNIQUE getConfig called');
      return { unique: true, test: 'working' };
    },
    
    init: function(config) {
      console.log('UNIQUE init called with:', config);
      alert('UNIQUE INIT CALLED');
    }
  };
  
  // Also assign to regular namespace
  window.AiCareXpert = {
    sendTestMessage: function(message) {
      console.log('REGULAR sendTestMessage called with:', message);
      alert('REGULAR TEST MESSAGE: ' + message);
    },
    
    getConfig: function() {
      console.log('REGULAR getConfig called');
      return { regular: true, test: 'working' };
    },
    
    init: function(config) {
      console.log('REGULAR init called with:', config);
      alert('REGULAR INIT CALLED');
    }
  };
  
  console.log('=== ASSIGNMENT COMPLETE ===');
  console.log('AiCareXpert properties:', Object.keys(window.AiCareXpert));
  console.log('AiCareXpertUnique properties:', Object.keys(window.AiCareXpertUnique));
  
})();

console.log('=== UNIQUE WIDGET LOADED ===');