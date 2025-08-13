import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  Plus, 
  Search, 
  FileText, 
  MessageSquare, 
  Settings,
  Tag,
  Send,
  User,
  Bot,
  Save,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

// Demo data
const demoNotes = [
  {
    id: '1',
    title: 'Getting Started with AI Notes',
    content: '# Getting Started with AI Notes\n\nWelcome to your intelligent note-taking companion! Here are some key features:\n\n## Smart Editor\n- Rich markdown support\n- Real-time synchronization\n- Intuitive formatting\n\n## AI-Powered Search\n- Semantic search through your notes\n- Context-aware results\n- Citation tracking\n\n## Chat with Your Notes\nAsk questions about your content and get intelligent answers with source citations.',
    tags: ['tutorial', 'getting-started'],
    updatedAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: '# Project Ideas\n\n## Web Applications\n- Personal finance tracker\n- Recipe organizer\n- Task management system\n\n## Mobile Apps\n- Fitness tracker\n- Language learning app\n- Photo organizer\n\n## AI Projects\n- Chatbot for customer service\n- Content recommendation system\n- Automated report generation',
    tags: ['projects', 'ideas', 'development'],
    updatedAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: '3',
    title: 'Meeting Notes - Q4 Planning',
    content: '# Q4 Planning Meeting\n\n**Date:** Today\n**Attendees:** Team leads, Product managers\n\n## Key Decisions\n- Focus on user experience improvements\n- Implement AI features by December\n- Increase marketing budget by 20%\n\n## Action Items\n- [ ] Create detailed project timeline\n- [ ] Assign team responsibilities\n- [ ] Schedule follow-up meetings\n\n## Next Steps\nSchedule individual team meetings to discuss implementation details.',
    tags: ['meetings', 'planning', 'q4'],
    updatedAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
  },
];

const demoChatMessages = [
  {
    id: '1',
    role: 'user' as const,
    content: 'What project ideas do I have for AI?',
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: '2',
    role: 'assistant' as const,
    content: 'Based on your notes, you have several AI project ideas:\n\n**AI Projects from your "Project Ideas" note:**\n- Chatbot for customer service\n- Content recommendation system\n- Automated report generation\n\nYou also mentioned implementing "AI features by December" in your Q4 planning meeting notes.\n\n**Sources:**\n- Project Ideas > AI Projects\n- Meeting Notes - Q4 Planning > Key Decisions',
    timestamp: Date.now() - 1000 * 60 * 4,
    citations: [
      { title: 'Project Ideas', heading: 'AI Projects' },
      { title: 'Meeting Notes - Q4 Planning', heading: 'Key Decisions' },
    ],
  },
];

export default function NotesDemo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedNoteId, setSelectedNoteId] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(searchParams.get('chat') === 'true');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(demoChatMessages);

  const selectedNote = demoNotes.find(note => note.id === selectedNoteId);
  const filteredNotes = demoNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: chatInput,
      timestamp: Date.now(),
    };
    
    setMessages([...messages, newMessage]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'This is a demo response. In the full version, I would analyze your notes using AI and provide contextual answers with citations from your actual notes.',
        timestamp: Date.now(),
        citations: [{ title: 'Demo Note', heading: 'Demo Section' }],
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeftOpen className="w-4 h-4" />
              </Button>
            )}
            <h1 className="font-semibold">AI Notes Demo</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Demo Mode
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          {sidebarOpen && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
                <div className="w-full border-r bg-background flex flex-col h-full">
                  {/* Sidebar Header */}
                  <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold">AI Notes</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(false)}
                        className="h-8 w-8 p-0"
                      >
                        <PanelLeftClose className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="pl-10"
                      />
                    </div>
                    
                    <Button className="w-full" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Note
                    </Button>
                  </div>

                  {/* Notes List */}
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => setSelectedNoteId(note.id)}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors mb-1",
                            selectedNoteId === note.id && "bg-accent"
                          )}
                        >
                          <div className="font-medium text-sm truncate mb-1">
                            {note.title}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {note.content.replace(/[#*\n]/g, ' ').substring(0, 80)}...
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Editor */}
          <ResizablePanel defaultSize={chatOpen ? 50 : 80} minSize={30}>
            <div className="h-full flex flex-col">
              {selectedNote ? (
                <>
                  {/* Editor Header */}
                  <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur p-4">
                    <div className="flex items-center justify-between mb-4">
                      <Input
                        value={selectedNote.title}
                        className="text-lg font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
                        readOnly
                      />
                      <Button size="sm" disabled>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedNote.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 overflow-auto">
                    <div className="p-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {selectedNote.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No note selected</h3>
                    <p>Select a note from the sidebar to start editing.</p>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          {/* Chat Panel */}
          {chatOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                <Card className="h-full flex flex-col rounded-none border-0 border-l">
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Ask My Notes</CardTitle>
                        <CardDescription>
                          AI-powered search through your notes
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setChatOpen(false)}
                      >
                        ×
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Chat Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={cn(
                          "flex gap-3",
                          message.role === 'user' ? "justify-end" : ""
                        )}>
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                          )}
                          
                          <div className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            message.role === 'user' 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          )}>
                            <div className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </div>
                            
                            {message.citations && (
                              <div className="mt-2 pt-2 border-t border-border/50">
                                <div className="text-xs font-medium text-muted-foreground mb-1">
                                  Sources:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {message.citations.map((citation, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {citation.title}
                                      {citation.heading && ` > ${citation.heading}`}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask a question about your notes..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button size="sm" onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
