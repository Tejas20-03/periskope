import ChatDashboard from "@/components/Dashboard/ChatDashboard";

export default function Home() {

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="w-full h-full">
        <ChatDashboard />
      </div>
    </div>
  );
}
