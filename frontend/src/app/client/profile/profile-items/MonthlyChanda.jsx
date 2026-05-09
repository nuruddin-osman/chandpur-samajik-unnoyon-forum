"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const BN_MONTHS = {
  "01": "জানুয়ারি",
  "02": "ফেব্রুয়ারি",
  "03": "মার্চ",
  "04": "এপ্রিল",
  "05": "মে",
  "06": "জুন",
  "07": "জুলাই",
  "08": "আগস্ট",
  "09": "সেপ্টেম্বর",
  10: "অক্টোবর",
  11: "নভেম্বর",
  12: "ডিসেম্বর",
};

const formatMonth = (m) => {
  const [y, mo] = m.split("-");
  return `${BN_MONTHS[mo]} ${y}`;
};

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return `${dt.getDate()} ${BN_MONTHS[String(dt.getMonth() + 1).padStart(2, "0")]} ${dt.getFullYear()}`;
};

const MonthlyChanda = () => {
  const { token, user } = useSelector((state) => state.auth);

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ totalPaid: 0, totalDue: 0 });
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // year list from records
  const years = [...new Set(records.map((r) => r.month.split("-")[0]))]
    .sort()
    .reverse();

  useEffect(() => {
    const fetchChanda = async () => {
      if (!token || !user?._id) return;
      setLoading(true);
      try {
        const params = {};
        if (filterYear) params.year = filterYear;
        if (filterMonth) params.month = filterMonth;
        if (filterStatus) params.status = filterStatus;
        console.log(params);

        const res = await axios.get(
          `http://localhost:5000/api/cron/chanda/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params,
          },
        );
        setRecords(res.data.records || []);
        setSummary({
          totalPaid: res.data.totalPaid || 0,
          totalDue: res.data.totalDue || 0,
        });
      } catch (err) {
        console.error("Chanda fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChanda();
  }, [token, user, filterYear, filterMonth, filterStatus]);

  if (user?.memberType !== "paid") {
    return (
      <div className="text-center py-16 text-text opacity-60 text-sm">
        শুধু পেইড সদস্যের চাঁদার তথ্য দেখা যাবে।
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-section-bg-gray rounded-xl p-4">
          <p className="text-xs text-text opacity-60 mb-1">মোট চাঁদা</p>
          <p className="text-xl font-semibold text-heading">
            ৳{summary.totalPaid + summary.totalDue}
          </p>
        </div>
        <div className="bg-section-bg-gray rounded-xl p-4">
          <p className="text-xs text-text opacity-60 mb-1">পরিশোধিত</p>
          <p className="text-xl font-semibold text-button-bg">
            ৳{summary.totalPaid}
          </p>
        </div>
        <div className="bg-section-bg-gray rounded-xl p-4">
          <p className="text-xs text-text opacity-60 mb-1">বকেয়া</p>
          <p className="text-xl font-semibold text-red-500">
            ৳{summary.totalDue}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="flex-1 min-w-28 h-10 rounded-xl border border-border-prim/30 px-3 text-sm text-text outline-none focus:ring-2 focus:ring-button-bg/20 bg-white"
        >
          <option value="">বছর</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="flex-1 min-w-28 h-10 rounded-xl border border-border-prim/30 px-3 text-sm text-text outline-none focus:ring-2 focus:ring-button-bg/20 bg-white"
        >
          <option value="">মাস</option>
          {Object.entries(BN_MONTHS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex-1 min-w-28 h-10 rounded-xl border border-border-prim/30 px-3 text-sm text-text outline-none focus:ring-2 focus:ring-button-bg/20 bg-white"
        >
          <option value="">সব</option>
          <option value="paid">পরিশোধিত</option>
          <option value="due">বকেয়া</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-border-prim/20 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-section-bg-gray">
              <th className="text-left px-4 py-3 text-xs font-medium text-text opacity-60 border-b border-border-prim/20">
                মাস
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text opacity-60 border-b border-border-prim/20">
                পরিমাণ
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text opacity-60 border-b border-border-prim/20">
                অবস্থা
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text opacity-60 border-b border-border-prim/20">
                পরিশোধের তারিখ
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex justify-center">
                    <ClipLoader color="#01b245" size={28} />
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-text opacity-50 text-sm"
                >
                  কোনো রেকর্ড পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr
                  key={r._id}
                  className="hover:bg-section-bg-gray/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-heading border-b border-border-prim/10">
                    {formatMonth(r.month)}
                  </td>
                  <td className="px-4 py-3 font-medium text-heading border-b border-border-prim/10">
                    ৳{r.amount}
                  </td>
                  <td className="px-4 py-3 border-b border-border-prim/10">
                    {r.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-button-bg">
                        ✓ পরিশোধিত
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500">
                        ⏱ বকেয়া
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text opacity-60 border-b border-border-prim/10">
                    {formatDate(r.paidAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyChanda;
