"use client";

import { useEffect, useRef } from "react";

export default function Waveform({ analyser }: { analyser: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dataArray = new Uint8Array(analyser.fftSize);

    function draw() {
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / dataArray.length;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      requestAnimationFrame(draw);
    }
    draw();
  }, [analyser]);

  return <canvas ref={canvasRef} width={500} height={150} />;
}
