import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Eraser, RotateCcw, Paintbrush, Wand2, Star } from "lucide-react";
import { APP_IMAGES } from "../assets/images";
import { playPopSound, playSparkleSound, playFanfareSound, speakText } from "../utils/audio";

interface MagicDoodleTabProps {
  onAddStars: (stars: number) => void;
}

const COLORS = [
  "#38BDF8", // Sky Blue
  "#34D399", // Mint Green
  "#FBBF24", // Sunshine Yellow
  "#C084FC", // Lavender
  "#F472B6", // Baby Pink
  "#FB923C", // Soft Orange
  "#1E293B", // Dark Slate
];

export const MagicDoodleTab: React.FC<MagicDoodleTabProps> = ({ onAddStars }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#38BDF8");
  const [brushSize, setBrushSize] = useState<number>(12);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [doodleResult, setDoodleResult] = useState<{
    guess: string;
    praise: string;
    funFact: string;
  } | null>(null);

  // Setup Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isEraser ? "#FFFFFF" : selectedColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleClear = () => {
    playPopSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDoodleResult(null);
  };

  const handleAnalyzeDoodle = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playPopSound();
    speakText("Tippy is looking at your magical drawing with AI vision!");
    setIsAnalyzing(true);
    setDoodleResult(null);

    try {
      const imageBase64 = canvas.toDataURL("image/png");
      const res = await fetch("/api/ai/analyze-doodle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await res.json();
      setIsAnalyzing(false);
      setDoodleResult(data);

      playFanfareSound();
      playSparkleSound();
      speakText(`Tippy sees ${data.guess}! ${data.praise}`);
      onAddStars(2);
    } catch (err) {
      setIsAnalyzing(false);
      setDoodleResult({
        guess: "A Sunshine Creation!",
        praise: "You are a brilliant little artist!",
        funFact: "Drawing helps your brain grow strong!",
      });
      playFanfareSound();
      onAddStars(2);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-gradient-to-b from-amber-100 via-sky-100 to-purple-100 p-4 flex flex-col items-center justify-between font-sans select-none pb-24">
      {/* Top Controls Bar */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-md border-2 border-amber-200 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 p-0.5 border border-amber-300">
            <img src={APP_IMAGES.tippyOwl} alt="Tippy" className="w-full h-full object-cover rounded-lg" />
          </div>
          <span className="font-extrabold text-amber-900 text-sm">Magic AI Canvas</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playPopSound();
              setIsEraser(!isEraser);
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 border ${
              isEraser ? "bg-amber-400 text-amber-950 border-amber-500" : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span>Eraser</span>
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-bold flex items-center gap-1"
            title="Clear canvas"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Color Swatches & Brush Sizes */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-sky-100 flex items-center justify-between mb-3 gap-1">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {COLORS.map((col) => (
            <button
              key={col}
              onClick={() => {
                playPopSound();
                setSelectedColor(col);
                setIsEraser(false);
              }}
              style={{ backgroundColor: col }}
              className={`w-7 h-7 rounded-full transition-transform border-2 ${
                selectedColor === col && !isEraser
                  ? "scale-125 border-slate-800 shadow-md"
                  : "border-white"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {[8, 14, 22].map((sz) => (
            <button
              key={sz}
              onClick={() => {
                playPopSound();
                setBrushSize(sz);
              }}
              className={`p-1.5 rounded-lg border font-black text-[10px] ${
                brushSize === sz ? "bg-sky-500 text-white border-sky-600" : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {sz === 8 ? "Small" : sz === 14 ? "Medium" : "Large"}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Drawing Stage */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border-4 border-amber-300 overflow-hidden relative touch-none">
        <canvas
          ref={canvasRef}
          width={380}
          height={320}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-[320px] cursor-crosshair block"
        />
      </div>

      {/* Action AI Vision Button */}
      <div className="w-full max-w-md mt-4">
        {isAnalyzing ? (
          <div className="w-full py-4 rounded-3xl bg-purple-200 text-purple-900 font-extrabold text-base flex items-center justify-center gap-2">
            <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Tippy is examining your artwork with AI magic...</span>
          </div>
        ) : (
          <button
            onClick={handleAnalyzeDoodle}
            className="w-full py-4 rounded-3xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white font-black text-lg shadow-xl border-2 border-purple-300 flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
          >
            <Wand2 className="w-6 h-6 animate-bounce" />
            <span>Ask Tippy's AI Vision! ✨</span>
          </button>
        )}
      </div>

      {/* AI Result Card */}
      {doodleResult && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md mt-4 bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-300 text-center flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-1 text-2xl font-black text-purple-800">
            <span>✨ Tippy Sees: "{doodleResult.guess}"</span>
          </div>
          <p className="text-sm font-bold text-slate-800">{doodleResult.praise}</p>
          <p className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            💡 Fun Fact: {doodleResult.funFact}
          </p>
        </motion.div>
      )}
    </div>
  );
};
