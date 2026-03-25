// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom"; // <--- Ye zaroori hai
// import OriginalDashboardUI from "./OriginalDashboardUI";
// import NoResumeDashboard from "./NoResumeDashboard";

// const Dashboard = () => {
//   const location = useLocation(); // URL change track karne ke liye
//   const [entryType, setEntryType] = useState<string | null>(null);

//   // Har baar jab user is page par aaye (ya URL badle), entryType check karo
//   useEffect(() => {
//     const type = localStorage.getItem("userEntryType");
//     console.log("Dashboard Switch Check:", type); // Console mein check karein
//     setEntryType(type);
//   }, [location.pathname]); // Path badalte hi trigger hoga

//   // Logic Switch
//   if (entryType === "no-resume") {
//     return <NoResumeDashboard />;
//   }

//   return <OriginalDashboardUI />;
// };

// export default Dashboard;
import { useEffect, useState } from "react";
import OriginalDashboardUI from "./OriginalDashboardUI";
import NoResumeDashboard from "./NoResumeDashboard";

const Dashboard = () => {
  // 1. Direct fetch from localStorage (No waiting for state)
  const entryType = localStorage.getItem("userEntryType");
  
  console.log("CHECKING DASHBOARD TYPE:", entryType);

  // 2. AGAR NO-RESUME HAI, TOH BILKUL YEHI ROK DO
  if (entryType === "no-resume") {
    console.log("LOADING: NoResumeDashboard UI");
    return <NoResumeDashboard />;
  }

  // 3. Default (Only for resume users)
  console.log("LOADING: OriginalDashboardUI");
  return <OriginalDashboardUI />;
};

export default Dashboard;