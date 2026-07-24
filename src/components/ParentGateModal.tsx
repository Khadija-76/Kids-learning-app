import React, { useState, useEffect } from "react";
import { ShieldCheck, X, Check, Lock } from "lucide-react";
import { playPopSound, playSparkleSound } from "../utils/audio";

interface ParentGateModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({ onClose, onSuccess }) => {
  const [num1, setNum1] = useState<number>(4);
  const [num2, setNum2] = useState<number>(3);
  const [answerInput, setAnswerInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 5) + 3);
    setNum2(Math.floor(Math.random() * 4) + 2);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPopSound();
    const expected = num1 + num2;
    if (parseInt(answerInput.trim(), 10) === expected) {
      playSparkleSound();
      onSuccess();
    } else {
      setErrorMsg("Incorrect answer. Please try again to access Parent Controls.");
      setAnswerInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border-4 border-emerald-300 flex flex-col gap-4 text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Parents Security Area</span>
          </div>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-600">
          Please solve this simple math question to confirm you are an adult:
        </p>

        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-2xl font-black text-emerald-900">
          {num1} + {num2} = ?
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="Type answer here"
            autoFocus
            className="w-full text-center py-3 px-4 rounded-xl border-2 border-slate-300 text-lg font-black focus:border-emerald-500 outline-none"
          />

          {errorMsg && (
            <p className="text-xs font-bold text-rose-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            Enter Parent Area 🛡️
          </button>
        </form>
      </div>
    </div>
  );
};
