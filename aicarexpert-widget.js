/**
 * AiCareXpert Widget - Healthcare AI Chatbot
 * Version 3.1 - Fixed loading issues
 */

(function() {
  'use strict';
  
  console.log('AiCareXpert: Starting widget load...');

  // Ensure we don't overwrite existing instance
  if (window.AiCareXpert && window.AiCareXpert._loaded) {
    console.log('AiCareXpert: Already loaded, skipping...');
    return;
  }

  // Create the global object and assign functions IMMEDIATELY
  window.AiCareXpert = {
    _loaded: true,
    _version: '3.1',
    
    // Test function - available immediately
    sendTestMessage: function(message) {
      console.log('AiCareXpert: sendTestMessage called with:', message);
      try {
        alert('Test function works! Message: ' + (message || 'No message'));
        return true;
      } catch (e) {
        console.error('AiCareXpert: Error in sendTestMessage:', e);
        return false;
      }
    },

    // Config getter - available immediately  
    getConfig: function() {
      console.log('AiCareXpert: getConfig called');
      try {
        return window.AiCareXpert.config || { 
          status: 'not initialized',
          version: window.AiCareXpert._version 
        };
      } catch (e) {
        console.error('AiCareXpert: Error in getConfig:', e);
        return { status: 'error', error: e.message };
      }
    },

    // Initialize function
    init: function(config) {
      console.log('AiCareXpert: init called with config:', config);
      
      try {
        // Store config
        window.AiCareXpert.config = config || {};
        
        // Wait for DOM if needed
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            createWidget(window.AiCareXpert.config);
          });
        } else {
          createWidget(window.AiCareXpert.config);
        }
        
        console.log('AiCareXpert: Widget initialized');
        return true;
      } catch (e) {
        console.error('AiCareXpert: Error in init:', e);
        return false;
      }
    },

    // Status check function
    getStatus: function() {
      return {
        loaded: true,
        version: window.AiCareXpert._version,
        functions: Object.keys(window.AiCareXpert).filter(key => !key.startsWith('_')),
        config: window.AiCareXpert.config || null
      };
    }
  };

  // Widget creation function
  function createWidget(config) {
    console.log('AiCareXpert: Creating widget...');
    
    try {
      // Remove existing widget if present
      const existing = document.getElementById('aicarexpert-widget');
      if (existing) {
        existing.remove();
      }
      
      // Simple widget creation
      const widget = document.createElement('div');
      widget.id = 'aicarexpert-widget';
      widget.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
      `;
      
      widget.innerHTML = `
        <button id="aicarexpert-button" style="
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
        " title="Open AiCareXpert Chat">
          💬
        </button>
      `;
      
      // Add click handler
      const button = widget.querySelector('#aicarexpert-button');
      button.addEventListener('click', function() {
        console.log('AiCareXpert: Widget button clicked');
        alert('Widget button clicked! Config: ' + JSON.stringify(config, null, 2));
      });
      
      // Add hover effects
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.background = '#1d4ed8';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = '#2563EB';
      });
      
      document.body.appendChild(widget);
      console.log('AiCareXpert: Widget created successfully');
      
      // Dispatch ready event
      window.dispatchEvent(new CustomEvent('AiCareXpertReady', { 
        detail: { config: config } 
      }));
      
    } catch (e) {
      console.error('AiCareXpert: Error creating widget:', e);
    }
  }

  console.log('AiCareXpert: Functions assigned:', Object.keys(window.AiCareXpert));
  console.log('AiCareXpert: Widget script loaded completely');

  // Dispatch load event
  window.dispatchEvent(new CustomEvent('AiCareXpertLoaded'));

})();