<!DOCTYPE html>
<html>
<head>
    <title>Widget V2 Test - Fresh File</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .log { background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 5px; font-family: monospace; font-size: 12px; }
        .error { background: #ffebee; color: #c62828; }
        .success { background: #e8f5e8; color: #2e7d32; }
        button { padding: 10px 20px; margin: 5px; background: #2563EB; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>🚀 Widget V2 Test - Fresh File</h1>
    
    <button onclick="checkWidget()">Check Widget Status</button>
    <button onclick="testSendMessage()">Test Send Message</button>
    <button onclick="testGetConfig()">Test Get Config</button>
    
    <div id="logs"></div>

    <script>
        function addLog(message, type = 'info') {
            const logs = document.getElementById('logs');
            const div = document.createElement('div');
            div.className = `log ${type}`;
            div.textContent = new Date().toLocaleTimeString() + ': ' + message;
            logs.appendChild(div);
            console.log(message);
        }

        function checkWidget() {
            addLog('=== Checking Widget V2 ===');
            
            if (window.AiCareXpert) {
                addLog('✅ AiCareXpert object exists', 'success');
                addLog('Properties: ' + Object.keys(window.AiCareXpert).join(', '));
                addLog('Version: ' + (window.AiCareXpert.version || 'unknown'));
                
                if (window.AiCareXpert.sendTestMessage) {
                    addLog('✅ sendTestMessage exists', 'success');
                } else {
                    addLog('❌ sendTestMessage missing', 'error');
                }
                
                if (window.AiCareXpert.getConfig) {
                    addLog('✅ getConfig exists', 'success');
                } else {
                    addLog('❌ getConfig missing', 'error');
                }
            } else {
                addLog('❌ AiCareXpert object not found', 'error');
            }
        }

        function testSendMessage() {
            if (window.AiCareXpert && window.AiCareXpert.sendTestMessage) {
                try {
                    const result = window.AiCareXpert.sendTestMessage('Hello from V2 test!');
                    addLog('✅ sendTestMessage result: ' + result, 'success');
                } catch (e) {
                    addLog('❌ sendTestMessage error: ' + e.message, 'error');
                }
            } else {
                addLog('❌ sendTestMessage not available', 'error');
            }
        }

        function testGetConfig() {
            if (window.AiCareXpert && window.AiCareXpert.getConfig) {
                try {
                    const config = window.AiCareXpert.getConfig();
                    addLog('✅ getConfig result: ' + JSON.stringify(config), 'success');
                } catch (e) {
                    addLog('❌ getConfig error: ' + e.message, 'error');
                }
            } else {
                addLog('❌ getConfig not available', 'error');
            }
        }

        // Load V2 widget script
        addLog('Loading Widget V2 script...');
        
        const script = document.createElement('script');
        script.onload = function() {
            addLog('✅ Widget V2 script loaded');
            
            setTimeout(() => {
                checkWidget();
                
                // Initialize if available
                if (window.AiCareXpert && window.AiCareXpert.init) {
                    addLog('Initializing Widget V2...');
                    try {
                        window.AiCareXpert.init({
                            tenantId: '5852cfb7-8d4f-4e74-be43-a0a8633c55ef',
                            assistantId: '9e39b6b2-6d9b-4c3e-99f8-f11c6966c8d2',
                            widgetId: 'aicarexpert-widget-v2',
                            config: {
                                primaryColor: '#2563EB',
                                chatTitle: 'Test Assistant V2',
                                welcomeMessage: 'Hello from Widget V2!',
                                placeholder: 'Test message...'
                            }
                        });
                        addLog('✅ Widget V2 initialized');
                        
                        setTimeout(() => {
                            checkWidget();
                        }, 1000);
                        
                    } catch (error) {
                        addLog('❌ Widget V2 init error: ' + error.message, 'error');
                    }
                }
            }, 500);
        };
        
        script.onerror = function() {
            addLog('❌ Failed to load Widget V2 script', 'error');
        };
        
        // Load the NEW file
        script.src = 'https://cdn.jsdelivr.net/gh/alonjb1/aicarexpert@main/aicarexpert-widget-v2.js?v=' + Date.now();
        document.head.appendChild(script);
        
        addLog('Loading from: ' + script.src);
    </script>
</body>
</html>