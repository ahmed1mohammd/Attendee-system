
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student } from '../types';

interface QRDisplayProps {
  student: Student;
  groupName: string;
  onClose?: () => void;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ student, groupName, onClose }) => {
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 600; // High resolution
      canvas.height = 600;
      if (ctx) {
        // White background for the PNG
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw SVG to Canvas
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        
        const qrImg = new Image();
        qrImg.onload = () => {
          ctx.drawImage(qrImg, 50, 50, 500, 500);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `QR_${student.name}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
          URL.revokeObjectURL(url);
        };
        qrImg.src = url;
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareOnWhatsApp = () => {
    const message = `مرحبًا،
ده كود الحضور الخاص بالطالب ${student.name} في مجموعة ${groupName}.
برجاء الاحتفاظ به لاستخدامه في تسجيل الحضور.`;
    
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${student.phone}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-zinc-900 animate-scaleIn shadow-2xl max-w-sm mx-auto relative">
      {/* Back Button for Mobile/General */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-black dark:text-white italic uppercase tracking-tighter">Student QR Pass</h3>
        <p className="text-brand font-bold text-[10px] uppercase tracking-[0.3em]">Ros Center Identity</p>
      </div>

      <div className="relative p-6 bg-white rounded-[32px] shadow-2xl border-2 border-brand/10">
        <QRCodeSVG 
          value={JSON.stringify({ 
            id: student.id, 
            name: student.name, 
            groupId: student.groupId, 
            qr: student.qrCode 
          })}
          size={220}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: "https://ro-s.net/img/logo.png",
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
          ref={qrRef}
        />
        <div className="absolute inset-0 border-[12px] border-white pointer-events-none rounded-[32px]"></div>
      </div>

      <div className="text-center space-y-1">
        <h4 className="text-xl font-black text-black dark:text-white truncate max-w-[250px]">{student.name}</h4>
        <div className="flex items-center justify-center gap-2">
           <span className="bg-brand/10 text-brand px-3 py-1 rounded-lg text-[9px] font-black uppercase">{groupName}</span>
           <span className="text-zinc-500 font-mono text-[10px] font-bold">{student.qrCode}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full">
        <button 
          onClick={shareOnWhatsApp}
          className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 px-6 rounded-2xl font-black text-sm hover:brightness-110 transition-all shadow-xl shadow-green-500/10"
        >
          <i className="fa-brands fa-whatsapp text-xl"></i>
          إرسال كود الحضور
        </button>
        <button 
          onClick={downloadQR}
          className="flex items-center justify-center gap-3 bg-black dark:bg-zinc-900 text-white dark:text-brand border border-white/5 py-4 px-6 rounded-2xl font-black text-sm hover:bg-brand hover:text-black transition-all"
        >
          <i className="fa-solid fa-download"></i>
          تحميل الصورة
        </button>
        {onClose && (
          <button 
            onClick={onClose}
            className="flex items-center justify-center gap-3 bg-gray-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-4 px-6 rounded-2xl font-black text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            رجوع للقائمة
          </button>
        )}
      </div>
    </div>
  );
};

export default QRDisplay;
