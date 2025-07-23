console.log('ULTRA SIMPLE WIDGET LOADING...');

// Step 1: Create empty object
window.AiCareXpert = {};

// Step 2: Add one function at a time
window.AiCareXpert.sendTestMessage = function(msg) {
  alert('TEST: ' + msg);
};

window.AiCareXpert.getConfig = function() {
  return { test: 'working' };
};

window.AiCareXpert.init = function(config) {
  alert('INIT CALLED');
};

// Step 3: Log what we have
console.log('WIDGET OBJECT KEYS:', Object.keys(window.AiCareXpert));
console.log('sendTestMessage TYPE:', typeof window.AiCareXpert.sendTestMessage);
console.log('getConfig TYPE:', typeof window.AiCareXpert.getConfig);

console.log('ULTRA SIMPLE WIDGET READY!');