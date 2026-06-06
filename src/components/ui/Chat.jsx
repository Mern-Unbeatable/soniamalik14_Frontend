import React from 'react';

const defaultMessages = [
  { id: 1, from: 'them', text: 'Hi! How can I help you today?', time: '10:12 AM' },
  { id: 2, from: 'me', text: 'I wanted to check recent sales trends for June.', time: '10:13 AM' },
  { id: 3, from: 'them', text: 'Sure â€” I can pull that report for you.', time: '10:14 AM' },
];

const Chat = ({ messages = defaultMessages }) => {
  return (
    <div className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Chat</h3>

      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            {m.from === 'them' ? (
              <div className="max-w-[85%] sm:max-w-[70%]">
                <div className="bg-white border border-gray-100 rounded-lg p-3" style={{ color: '#0F766E' }}>
                  <div className="text-base" style={{ color: '#0F766E' }}>{m.text}</div>
                </div>
                <div className="text-xs text-gray-400 mt-1">{m.time}</div>
              </div>
            ) : (
              <div className="max-w-[85%] sm:max-w-[70%] text-right">
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: 'linear-gradient(90deg, #179B91 0%, rgba(23,155,145,0) 100%)',
                    color: '#ffffff',
                  }}
                >
                  <div className="text-base font-medium" style={{ color: '#ffffff' }}>{m.text}</div>
                </div>
                <div className="text-xs text-gray-400 mt-1">{m.time}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
