import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

function App() {
  const { updateServiceWorker } = useRegisterSW();
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handler = () => setShowUpdate(true);
    window.addEventListener("pwa-update-available", handler);
    return () => window.removeEventListener("pwa-update-available", handler);
  }, []);

  const sayHello = () => {
    alert("Hello from PWA V2");
  };

  return (
    <>
      <h1>Hello this is pwa version 1</h1>
      <button onClick={() => sayHello()}>Click me for gretting</button>
      {showUpdate && (
        <div className="fixed w-[300px] h-[100px] flex items-start flex-col justify-between bottom-4 right-4 bg-black text-white p-4 rounded">
          <p>New version available</p>
          <button
            className="mt-2 bg-white text-black px-3 py-1 rounded cursor-pointer"
            onClick={() => updateServiceWorker(true)}
          >
            Update Now
          </button>
        </div>
      )}
    </>
  );
}

export default App;
