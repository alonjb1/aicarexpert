console.log('=== WIDGET DEBUG START ===');

// Step 1: Check if object already exists
if (window.AiCareXpert) {
  console.log('WARNING: AiCareXpert already exists:', Object.keys(window.AiCareXpert));
} else {
  console.log('AiCareXpert does not exist yet - good');
}

// Step 2: Create object with functions
window.AiCareXpert = {
  sendTestMessage: function(msg) {
    alert('TEST MESSAGE: ' + msg);
  },
  
  getConfig: function() {
    return { test: 'working', timestamp: Date.now() };
  },
  
  init: function(config) {
    alert('INIT CALLED WITH CONFIG');
  }
};

console.log('IMMEDIATELY AFTER ASSIGNMENT:');
console.log('- Object exists:', !!window.AiCareXpert);
console.log('- Keys:', Object.keys(window.AiCareXpert));
console.log('- sendTestMessage type:', typeof window.AiCareXpert.sendTestMessage);

// Step 3: Set up monitoring to catch overwrites
let checkCount = 0;
const monitor = setInterval(() => {
  checkCount++;
  console.log(`CHECK ${checkCount}: Keys = ${Object.keys(window.AiCareXpert).join(',')}`);
  
  if (checkCount >= 10) {
    clearInterval(monitor);
    console.log('=== MONITORING STOPPED ===');
  }
}, 500);

console.log('=== WIDGET DEBUG END ===');