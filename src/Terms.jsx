import React from "react";

function TermsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <main
        style={{
          flex: 1,
          maxWidth: "800px",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Terms and Conditions
        </h1>

        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "#555",
          }}
        >
          {/* points */}
        </p>
      </main>
    </div>
  );
}

export default TermsPage;
