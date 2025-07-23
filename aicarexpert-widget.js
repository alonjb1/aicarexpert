// MINIMAL TEST - Just alert to prove code runs
alert('WIDGET CODE IS RUNNING!');
console.log('WIDGET CODE IS RUNNING!');

window.AiCareXpert = {
  test: 'working',
  sendTestMessage: function(msg) {
    alert('TEST: ' + msg);
  }
};

console.log('WIDGET ASSIGNED:', window.AiCareXpert);