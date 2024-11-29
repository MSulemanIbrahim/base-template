import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pen');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.7;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;
  }, [color, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setHistoryIndex(prev => prev + 1);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), { tool, color, size: brushSize }]);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    if (tool === 'fill') {
      contextRef.current.fillStyle = color;
      contextRef.current.fill();
    }
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const saveCanvas = () => {
    const dataURL = canvasRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = dataURL;
    link.click();
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      redrawCanvas();
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      redrawCanvas();
    }
  };

  const redrawCanvas = () => {
    clearCanvas();
    const ctx = contextRef.current;
    history.slice(0, historyIndex + 1).forEach(state => {
      ctx.strokeStyle = state.color;
      ctx.lineWidth = state.size;
      // Here you would need to implement drawing based on tool history, 
      // this is a simplification for pen tool only
      ctx.beginPath();
      ctx.moveTo(0, 0); // Dummy move, real implementation would store points
      ctx.lineTo(1, 1); // Dummy line, real implementation would use stored points
      ctx.stroke();
    });
  };

  const drawShape = (shape) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    } else if (shape === 'rectangle') {
      ctx.rect(centerX - 50, centerY - 50, 100, 100);
    } else if (shape === 'line') {
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        className="border border-gray-300 rounded shadow-lg bg-white"
      />
      {showGrid && (
        <div className="absolute grid grid-cols-10 gap-1 w-full h-full pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-gray-200"></div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap justify-center space-x-2 space-y-2">
        <Button onClick={() => setTool('pen')}>Pen</Button>
        <Button onClick={() => setTool('eraser')}>Eraser</Button>
        <Button onClick={() => setTool('fill')}>Fill</Button>
        <Button onClick={() => drawShape('circle')}>Circle</Button>
        <Button onClick={() => drawShape('rectangle')}>Rectangle</Button>
        <Button onClick={() => drawShape('line')}>Line</Button>
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <Button onClick={clearCanvas}>Clear</Button>
        <Button onClick={saveCanvas}>Save</Button>
        <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <Slider value={[brushSize]} onValueChange={([value]) => setBrushSize(value)} max={30} className="w-[200px]"/>
        <div className="flex items-center">
          <Switch checked={showGrid} onCheckedChange={setShowGrid} />
          <span className="ml-2">Grid</span>
        </div>
      </div>
    </div>
  );
}

export default App;