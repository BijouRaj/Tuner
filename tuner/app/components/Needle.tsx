"use client";

export default function Needle({ cents }: { cents: number }) {
  // Clamp between -50 and +50 cents
  const clamped = Math.max(-50, Math.min(50, cents));

  return (
    <div style={{ margin: "1.5rem 0" }}>
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "100px",
          margin: "0 auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#f9f9f9",
        }}
      >
        {/* Center marker */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "2px",
            height: "100%",
            background: "black",
          }}
        />
        {/* Needle */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: "2px",
            height: "100%",
            background: "red",
            transform: `translateX(${clamped * 3}px)`, // 3px per cent
            transition: "transform 0.1s linear",
          }}
        />
      </div>
      <p>{clamped} cents</p>
    </div>
  );
}
