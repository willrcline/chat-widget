import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChatWidget from './components/ChatWidget';

const theme = createTheme();

const WebchatWidget = {
  init: (container = null) => {
    const targetElement = container 
      ? (typeof container === 'string' ? document.querySelector(container) : container)
      : document.body;
    
    if (!targetElement) {
      console.error('WebchatWidget: Target container not found');
      return;
    }

    // Create a div to mount the widget
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'webchat-widget-container';
    targetElement.appendChild(widgetContainer);

    // Mount the React component using createElement
    const root = createRoot(widgetContainer);
    root.render(
      React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(CssBaseline),
        React.createElement(ChatWidget)
      )
    );

    return {
      destroy: () => {
        root.unmount();
        if (widgetContainer.parentNode) {
          widgetContainer.parentNode.removeChild(widgetContainer);
        }
      }
    };
  }
};

// Expose globally
window.WebchatWidget = WebchatWidget;

export default WebchatWidget;
