import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js";
import { jsPDF } from "jspdf";
import { supabase } from "../supabase-client";
import { encryptText } from "../Crypto";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const TtdElektronikSent = ({ user_id = "yoga" }) => {
  const canvasRef = useRef(null);
  const sigRef = useRef(null);

  const [pdfFile, setPdfFile] = useState(null);
  const [signature, setSignature] = useState(null);

  const [sigPos, setSigPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // --------------------------
  // RENDER PDF
  // --------------------------
  const renderPDF = async (file) => {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport,
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
  // DRAG SIGNATURE
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

  const endDrag = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", endDrag);
    };
  });

  const getCanvasScale = () => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      scaleX: canvas.width / rect.width,
      scaleY: canvas.height / rect.height,
    };
  };

  // --------------------------
  // EXPORT + UPLOAD TO SUPABASE
  // --------------------------
  const saveStampedPdf = async () => {
    if (!user_id) {
      alert("user_id tidak ada! Kirim via props atau localStorage.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const sigImg = sigRef.current;

    const { scaleX, scaleY } = getCanvasScale();

    // Tempel tanda tangan ke canvas
    ctx.drawImage(
      sigImg,
      sigPos.x * scaleX,
      sigPos.y * scaleY,
      150 * scaleX,
      80 * scaleY
    );

    const imgData = canvas.toDataURL("image/png");

    // Buat PDF
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    // Convert ke Blob
    const pdfBlob = pdf.output("blob");

    const fileName = `signed_${Date.now()}.pdf`;

    // --------------------------
    // 1. UPLOAD ke Supabase Bucket
    // --------------------------
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("ttd_document")
      .upload(fileName, pdfBlob, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      alert("Upload gagal: " + uploadError.message);
      return;
    }

    // Ambil URL public
    const { data: urlData } = supabase.storage
      .from("ttd_document")
      .getPublicUrl(fileName);

    const file_url = urlData.publicUrl;

    // --------------------------
    // 2. INSERT metadata ke tabel
    // --------------------------
    const { error: insertError } = await supabase
      .from("documents")
      .insert({
        user_id: user_id,
        file_name: encryptText(fileName),
        file_url: file_url,
      });

    if (insertError) {
      console.error(insertError);
      alert("Insert ke tabel gagal: " + insertError.message);
      return;
    }

    alert("PDF berhasil disimpan & di-upload!");
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
        <canvas ref={canvasRef}></canvas>

        {signature && (
          <img
            ref={sigRef}
            src={signature}
            onMouseDown={startDrag}
            alt="Signature"
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
        Save & Upload
      </button>
    </div>
  );
};

export default TtdElektronikSent;