import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Code, CodeBlock } from "@/components/ui/code";

const borderStyles = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
];

function ButtonPreview({ styles }) {
  return (
    <div className="flex justify-center p-4">
      <Button style={styles}>Preview</Button>
    </div>
  );
}

function CodeDisplay({ buttonStyle }) {
  const codeString = `<button style="${Object.entries(buttonStyle).map(([k, v]) => `${k}:${v}`).join(';')}">Preview</button>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <CodeBlock>
          <Code>{codeString}</Code>
        </CodeBlock>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCopy}>Copy to Clipboard</Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [buttonStyle, setButtonStyle] = useState({
    borderWidth: '1px',
    borderColor: '#000',
    borderStyle: 'solid',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: '16px',
    fontWeight: '400',
    padding: '10px 20px',
    margin: '10px',
  });

  const updateStyle = (key, value) => {
    setButtonStyle(prev => ({ ...prev, [key]: value }));
  };

  const resetStyles = () => {
    setButtonStyle({
      borderWidth: '1px',
      borderColor: '#000',
      borderStyle: 'solid',
      borderRadius: '4px',
      backgroundColor: '#fff',
      color: '#000',
      fontSize: '16px',
      fontWeight: '400',
      padding: '10px 20px',
      margin: '10px',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-slate-100 p-4 gap-4">
      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <CardTitle>Button Designer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Border Width</Label>
            <Slider 
              defaultValue={[1]} 
              max={10} 
              onValueChange={value => updateStyle('borderWidth', `${value}px`)}
            />
          </div>
          <div>
            <Label>Border Style</Label>
            <Select onValueChange={value => updateStyle('borderStyle', value)}>
              {borderStyles.map(style => <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>)}
            </Select>
          </div>
          <div>
            <Label>Border Color</Label>
            <Input type="color" onChange={(e) => updateStyle('borderColor', e.target.value)} />
          </div>
          <div>
            <Label>Border Radius</Label>
            <Slider 
              defaultValue={[4]} 
              max={50} 
              onValueChange={value => updateStyle('borderRadius', `${value}px`)}
            />
          </div>
          <div>
            <Label>Background Color</Label>
            <Input type="color" onChange={(e) => updateStyle('backgroundColor', e.target.value)} />
          </div>
          <div>
            <Label>Text Color</Label>
            <Input type="color" onChange={(e) => updateStyle('color', e.target.value)} />
          </div>
          <div>
            <Label>Font Size</Label>
            <Slider 
              defaultValue={[16]} 
              max={32} 
              onValueChange={value => updateStyle('fontSize', `${value}px`)}
            />
          </div>
          <div>
            <Label>Font Weight</Label>
            <Select onValueChange={value => updateStyle('fontWeight', value)}>
              <SelectItem value="400">Normal</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
            </Select>
          </div>
          <div>
            <Label>Padding</Label>
            <Input type="text" placeholder="e.g., 10px 20px" onChange={(e) => updateStyle('padding', e.target.value)} />
          </div>
          <div>
            <Label>Margin</Label>
            <Input type="text" placeholder="e.g., 10px" onChange={(e) => updateStyle('margin', e.target.value)} />
          </div>
          <Button onClick={resetStyles}>Reset</Button>
        </CardContent>
      </Card>

      <div className="w-full sm:w-1/2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ButtonPreview styles={buttonStyle} />
          </CardContent>
        </Card>
        <CodeDisplay buttonStyle={buttonStyle} />
      </div>
    </div>
  );
}