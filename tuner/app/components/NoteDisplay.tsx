"use client";

export default function NoteDisplay({
  frequency,
  note,
  cents,
}: {
  frequency: number;
  note: string;
  cents: number;
}) {
  return (
    <div style={{ margin: "1rem 0" }}>
      <h2 style={{ fontSize: "3rem" }}>{note}</h2>
      <p>{frequency.toFixed(2)} Hz</p>
      <p>
        {cents === 0
          ? "Perfectly in tune"
          : cents > 0
          ? `+${cents} cents (sharp)`
          : `${cents} cents (flat)`}
      </p>
    </div>
  );
}
