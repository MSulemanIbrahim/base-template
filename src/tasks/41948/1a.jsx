import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ColorPicker } from 'react-colorful';

const shapes = ['circle', 'square', 'rectangle'];

function Badge({ text, shape, bgColor, textColor, fontSize, fontStyle, border, borderColor, borderWidth }) {
  const style = {
    backgroundColor: bgColor,
    color: textColor,
    fontSize: `${fontSize}px`,
    fontStyle: fontStyle === 'italic' ? 'italic' : 'normal',
    border: border ? `${borderWidth}px solid ${borderColor}` : 'none',
  };

  const shapeStyle = {
    'circle': 'rounded-full',
    'square': 'rounded-none',
    'rectangle': 'rounded-lg',
  }[shape];

  return (
    <div className={`p-4 w-48 h-48 flex items-center justify-center ${shapeStyle}`} style={style}>
      <span>{text}</span>
    </div>
  );
}

function BadgeGenerator() {
  const [text, setText] = useState("Your Badge");
  const [shape, setShape] = useState('circle');
  const [bgColor, setBgColor] = useState('#0070f3');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(16);
  const [fontStyle, setFontStyle] = useState('normal');
  const [border, setBorder] = useState(false);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(2);
  const badgeRef = useRef(null);

  const downloadBadge = () => {
    const badgeElement = badgeRef.current;
    // Here you would implement the logic to convert the badge to an image and download it
    // This is a placeholder for brevity
    alert('Downloading badge functionality would be implemented here.');
  };

  const resetBadge = () => {
    setText("Your Badge");
    setShape('circle');
    setBgColor('#0070f3');
    setTextColor('#ffffff');
    setFontSize(16);
    setFontStyle('normal');
    setBorder(false);
    setBorderColor('#000000');
    setBorderWidth(2);
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-4">
      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <CardTitle>Badge Customizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input value={text} onChange={e => setText(e.target.value)} placeholder="Badge Text" />
            <Select value={shape} onValueChange={setShape}>
              {shapes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </Select>
            <ColorPicker color={bgColor} onChange={setBgColor} />
            <ColorPicker color={textColor} onChange={setTextColor} />
            <div>
              <Label>Font Size</Label>
              <Slider defaultValue={[fontSize]} onValueChange={([value]) => setFontSize(value)} max={40} />
            </div>
            <Select value={fontStyle} onValueChange={setFontStyle}>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="italic">Italic</SelectItem>
            </Select>
            <Checkbox checked={border} onCheckedChange={setBorder}>Border</Checkbox>
            {border && (
              <>
                <ColorPicker color={borderColor} onChange={setBorderColor} />
                <div>
                  <Label>Border Width</Label>
                  <Slider defaultValue={[borderWidth]} onValueChange={([value]) => setBorderWidth(value)} max={10} />
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={downloadBadge}>Download</Button>
          <Button onClick={resetBadge} variant="secondary">Reset</Button>
        </CardFooter>
      </Card>

      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <div ref={badgeRef}>
            <Badge {...{ text, shape, bgColor, textColor, fontSize, fontStyle, border, borderColor, borderWidth }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <BadgeGenerator />
    </div>
  );
}