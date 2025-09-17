// src/components/StudentQr.jsx
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { getClassforStudents } from "../api/classApi";
import { getQRSession } from "../api/attendanceSessionApi";

export default function StudentQr({ classId, studentId }) {
  const [classInfo, setClassInfo] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const { data } = await getClassforStudents(classId);
        setClassInfo(data);

        if (studentId) {
          try {
            const res = await getQRSession(classId, studentId);
            setQrData(JSON.stringify(res.data));
          } catch {
            setQrData(null);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load class info");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh QR every 5s in case teacher starts session after student opens page
    interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [classId, studentId]);

  if (loading) return <p className="text-gray-500 text-sm">Loading class info...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl text-center max-w-xs mx-auto mt-2">
      <h2 className="text-lg font-semibold mb-2">{classInfo.name}</h2>
      <p className="text-gray-500 mb-4">{classInfo.subject}</p>
      {qrData ? (
        <QRCode value={qrData} size={180} />
      ) : (
        <p className="text-gray-400 mt-2 text-sm">No active attendance session</p>
      )}
    </div>
  );
}
