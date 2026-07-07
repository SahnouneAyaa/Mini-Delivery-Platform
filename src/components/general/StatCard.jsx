"use client";
import { useRouter } from "next/navigation";

const StatCard = ({ title, stat, detail, icon: Icon, color, gradientTo, shadowColor, href }) => {
  const router = useRouter();

  const statStr = String(stat);
  const isLong = statStr.length > 10;
  const isMid = statStr.length > 5 && statStr.length <= 10;

  const statFontSize = isLong ? "20px" : isMid ? "28px" : "42px";
  const statLineHeight = isLong ? "1.3" : "1";

  return (
    <div
      onClick={() => href && router.push(href)}
      className="relative flex flex-col justify-between rounded-[18px] p-5 min-h-[160px] overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 cursor-pointer"
      style={{
        flex: "1 1 200px",
        background: `linear-gradient(135deg, #ffffff 0%, ${gradientTo} 100%)`,
        boxShadow: `0 4px 16px ${shadowColor}29`,
        border: "0.5px solid rgba(0,0,0,0.07)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 40px ${shadowColor}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 16px ${shadowColor}29`;
      }}
    >
      <div
        className="absolute top-4 end-4 w-[52px] h-[52px] rounded-[14px] flex items-center justify-center"
        style={{ backgroundColor: `${color}1F` }}
      >
        <Icon size={28} style={{ color }} strokeWidth={1.8} />
      </div>

      <div>
        <p className="text-md font-semibold leading-[1.4] mb-2 max-w-[65%]" style={{ color }}>
          {title}
        </p>
        <h2
          className="font-bold m-0 max-w-[80%] break-words"
          style={{ color, fontSize: statFontSize, lineHeight: statLineHeight }}
        >
          {stat}
        </h2>
      </div>

      <div
        className="text-sm flex items-center gap-1.5 pt-2.5 border-t"
        style={{ color, borderColor: `${color}33` }}
      >
        <span>{detail}</span>
        <span className="ms-auto opacity-70">→</span>
      </div>
    </div>
  );
};

export default StatCard;