// A simple React note-taking application that allows users to add, delete, search, and filter notes by tags.
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// NoteInput Component: Handles user input for creating new notes.
function NoteInput({ addNote }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  // Handles form submission to add a new note.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      // Splits tags into an array and trims whitespace.
      addNote(content, tags.split(",").map((tag) => tag.trim()));
      setContent("");
      setTags("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        placeholder="Type your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full"
      />
      <Input
        placeholder="Add tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full"
      />
      <Button type="submit" className="w-full">
        Add Note
      </Button>
    </form>
  );
}

// NoteCard Component: Displays individual notes with tags and a delete button.
function NoteCard({ note, onDelete, onTagClick }) {
  return (
    <Card className="mb-4 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <p className="mb-2">{note.content}</p>
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={() => onDelete(note.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [notes, setNotes] = useState([]); // State to store all notes.
  const [searchTerm, setSearchTerm] = useState(""); // State for search term.
  const [activeTag, setActiveTag] = useState(null); // State for active tag filtering.

  // Load initial notes (if any) from an external source or server.
  useEffect(() => {
    // Simulate fetching initial notes from an API or server.
    const fetchNotes = async () => {
      const initialNotes = await fetch("/api/notes").then((res) => res.json());
      setNotes(initialNotes);
    };
    fetchNotes();
  }, []);

  const addNote = (content, tags) => {
    const newNote = {
      id: Date.now(), // Unique ID based on the current timestamp.
      content,
      tags,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const clearAllNotes = () => {
    setNotes([]);
  };

  // Filter notes based on the search term and active tag.
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesTag = activeTag ? note.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Quick Note Taker</h1>
      <NoteInput addNote={addNote} />
      <div className="my-4">
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      {activeTag && (
        <div className="mb-4 flex items-center">
          <span className="mr-2">Filtering by tag:</span>
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setActiveTag(null)}
          >
            {activeTag} ✕
          </Badge>
        </div>
      )}
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onTagClick={setActiveTag}
          />
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-center text-gray-500">No notes found.</p>
        )}
      </ScrollArea>
      {notes.length > 0 && (
        <Button
          variant="destructive"
          onClick={clearAllNotes}
          className="mt-4 w-full"
        >
          Clear All Notes
        </Button>
      )}
    </div>
  );
}
