import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

function Note({ note, onDelete, onTagClick }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{note.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {note.tags.map(tag => (
            <span 
              key={tag} 
              onClick={() => onTagClick(tag)} 
              className="cursor-pointer bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onDelete(note.id)} variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteText, setNoteText] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (noteText.trim()) {
      const newNote = {
        id: Date.now(),
        text: noteText,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      setNotes([...notes, newNote]);
      setNoteText('');
      setTags('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note => 
    note.text?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
    note.tags.some(tag => tag?.toLowerCase().includes(searchTerm?.toLowerCase()))
  );

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <div className="mb-6">
        <Input 
          placeholder="Search notes or tags..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="mb-2"
        />
        <Input 
          placeholder="Type your note here..." 
          value={noteText} 
          onChange={(e) => setNoteText(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && addNote()}
        />
        <Label className="block mb-2">
          Tags (comma separated)
          <Input 
            placeholder="e.g., work, personal" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
          />
        </Label>
        <Button onClick={addNote} className="w-full sm:w-auto">Add Note</Button>
      </div>

      <ScrollArea className="h-[400px] mb-4">
        {filteredNotes.map(note => (
          <Note key={note.id} note={note} onDelete={deleteNote} onTagClick={handleTagClick} />
        ))}
      </ScrollArea>

      {notes.length > 0 && (
        <Button onClick={() => setNotes([])} variant="outline" className="w-full sm:w-auto">
          Clear All Notes
        </Button>
      )}
    </div>
  );
}