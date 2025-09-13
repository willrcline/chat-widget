import ChatWidget from './components/ChatWidget';
import {Conversation} from './components/Test'
import './App.css';

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <h1>Webchat Widget Demo</h1>
      <p>
        This is a demo page. The chat widget is available in the bottom right
        corner.
      </p>
      <p>Try clicking the chat button to start a conversation!</p>

      <Conversation />
      <ChatWidget />
    </div>
  );
}

export default App;
