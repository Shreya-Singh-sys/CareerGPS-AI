import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DashboardPreview from "@/components/DashboardPreview";
import ImpactSection from "@/components/ImpactSection";
import FooterSection from "@/components/FooterSection";
import { useEffect, useState } from 'react';



const Index = () => {
  const [connectionStatus, setConnectionStatus] = useState("Checking...");

  useEffect(() => {
    fetch('http://localhost:5000/api/test-connection')
      .then(res => res.json())
      .then(data => {
        setConnectionStatus(data.message);
      })
      .catch(err => {
        setConnectionStatus("Failed to connect to Backend ❌");
      });
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <div style={{ 
        padding: '10px', 
        textAlign: 'center', 
        background: connectionStatus.includes('❌') ? '#fee2e2' : '#dcfce7',
        color: connectionStatus.includes('❌') ? '#991b1b' : '#166534',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        Backend Status: {connectionStatus}
      </div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardPreview />
      <ImpactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
