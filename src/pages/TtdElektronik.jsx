import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js";
import { jsPDF } from "jspdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const TtdElektronik = () => {
  const canvasRef = useRef(null);
  const sigRef = useRef(null);

  const [pdfFile, setPdfFile] = useState(null);
  const [signature, setSignature] = useState(null);

  const [sigPos, setSigPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // --------------------------
  // PDF RENDERER
  // --------------------------
  const renderPDF = async (file) => {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set REAL pixel dimensions – no CSS scaling
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    renderPDF(file);
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setSignature(url);
  };

  // --------------------------
  // DRAGGING SIGNATURE
  // --------------------------
  const startDrag = (e) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - sigPos.x,
      y: e.clientY - sigPos.y,
    };
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    setSigPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);

    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", endDrag);
    };
  });

  // --------------------------
  // CANVAS SCALE FIX
  // --------------------------
  const getCanvasScale = () => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      scaleX: canvas.width / rect.width,
      scaleY: canvas.height / rect.height,
    };
  };

  // --------------------------
  // EXPORT PDF
  // --------------------------
  const saveStampedPdf = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const sigImg = sigRef.current;

    // Convert CSS position → real canvas pixels
    const { scaleX, scaleY } = getCanvasScale();

    ctx.drawImage(
      sigImg,
      sigPos.x * scaleX,
      sigPos.y * scaleY,
      150 * scaleX,
      80 * scaleY
    );

    const imgData = canvas.toDataURL("image/png");

    // PDF matches EXACT canvas size
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("signed.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="text-2xl font-bold mb-4">Tanda Tangan Elektronik</h2>

      <div className="mb-3">
        <p>Upload PDF:</p>
        <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      </div>

      <div className="mb-3">
        <p>Upload Signature (PNG Transparan):</p>
        <input type="file" accept="image/*" onChange={handleSignatureUpload} />
      </div>

      <div
        style={{
          position: "relative",
          border: "1px solid #ccc",
          display: "inline-block",
        }}
      >
        {/* NEVER set CSS width/height — use PDF.js native size */}
        <canvas ref={canvasRef}></canvas>

        {signature && (
          <img
            ref={sigRef}
            src={signature}
            alt="Signature"
            onMouseDown={startDrag}
            style={{
              position: "absolute",
              top: sigPos.y,
              left: sigPos.x,
              width: "150px",
              height: "80px",
              cursor: "grab",
              userSelect: "none",
            }}
          />
        )}
      </div>

      <br />
      <button
        onClick={saveStampedPdf}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save as PDF
      </button>
    </div>
  );
};

export default TtdElektronik;