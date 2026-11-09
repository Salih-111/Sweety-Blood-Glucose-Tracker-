// import ThemeToggle from "./components/ThemeToggle";
// function App() {
//   return (
//     <main
//       className="flex min-h-screen items-center justify-center px-4 transition-colors duration-300"
//       style={{
//         backgroundColor: "var(--app-bg)",
//         color: "var(--text-primary)",
//       }}
//     >
//       <div
//         className="rounded-2xl p-10 text-center shadow-sm transition-colors"
//         style={{ backgroundColor: "var(--surface)" }}
//       >
//         <div className="mb-4 text-4xl">💧</div>

//         <h1 className="text-3xl font-bold text-brand-700">
//           GlucoTrack
//         </h1>

//         <p style={{ color: "var(--text-secondary)" }}>
//           Blood Glucose Tracker
//         </p>

//         <div className="mt-6">
//           <ThemeToggle />
//         </div>
//       </div>
//     </main>
//   );
// }

// export default App;

import AuthCheckingScreen from "./components/AuthCheckingScreen";

function App() {
  return <AuthCheckingScreen />;
}

export default App;