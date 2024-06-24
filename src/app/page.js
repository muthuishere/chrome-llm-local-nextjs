'use client'


import Head from 'next/head';
import { useEffect, useState } from 'react';

let session = null;
async function getSession(){
  try {
    if(null == session)
     session =  await window.ai.createTextSession()
    

    return session
  }catch(e){
    console.log(e)
    //window.alert('Error creating session, AI not enabled.')
    throw new Error('Error creating session, AI not enabled.')
  }
}



export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Assume getSession is defined somewhere in your codebase
  getSession().catch(e => setError(e.message));

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage = { id: messages.length + 1, text: input, sender: 'You' };
    setMessages([...messages, newMessage]);
    
    try {
      const session = await getSession();
      const aiResponse = await session.prompt(input);
      const response = { id: messages.length + 2, text: aiResponse, sender: 'Local Chrome AI' };
      setMessages(currentMessages => [...currentMessages, response]);
    } catch (e) {
      setError(e.message);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Google Chrome Local LLM in Browser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-600 text-white p-4 text-lg">
        Google Chrome Local LLM in Browser
      </header>

      <main className="flex-grow container mx-auto p-4">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-2xl font-semibold">Chat with AI</h2>
              <div className="my-4">
                {messages.map(message => (
                  <div key={message.id} className={`p-2 ${message.sender === 'AI' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    <p>{message.sender}: {message.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your question here..."
                  className="flex-grow p-2 border-2 border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
