'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, X } from 'lucide-react'
import Image from 'next/image'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  const toggleChat = () => setIsOpen(!isOpen)

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 rounded-full"
          onClick={toggleChat}
        >
          <Image src="/logo.png" alt="Chatbot" width={40} height={40} />
        </Button>
      )}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-[400px] h-3/4 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>raydar-v1.0</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X size={24} />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            {messages.map(m => (
              <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                  {m.content}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about lost items..."
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                <Send size={24} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}