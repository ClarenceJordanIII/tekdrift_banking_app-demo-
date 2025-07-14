"use client";

import DemoNotification from "@/components/DemoNotification";
import { useEffect, useState } from "react";

const ClientDemoWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // Only show demo notification if user hasn't seen it and is on home page
    const hasSeenDemo = localStorage.getItem('hasSeenDemoNotification');
    if (!hasSeenDemo) {
      setShowDemo(true);
    }
  }, []);

  return (
    <>
      {showDemo && <DemoNotification onClose={() => setShowDemo(false)} autoShow={false} />}
      {children}
    </>
  );
};

export default ClientDemoWrapper;
