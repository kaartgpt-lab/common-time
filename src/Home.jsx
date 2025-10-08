import { useEffect, useRef, useState } from "react";

export default function Home() {
  return (
    <div style={styles.page}>
      {/* Fonts + Responsive CSS Vars */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');

        :root{
          --brand-size: 24px;
          --header-padding: 8px 12px;
          --social-size: 38px;
        }
        @media (min-width: 480px){
          :root{
            --brand-size: 28px;
            --header-padding: 10px 16px;
            --social-size: 40px;
          }
        }
        @media (min-width: 768px){
          :root{
            --brand-size: 32px;
            --header-padding: 12px 20px;
            --social-size: 42px;
          }
        }
        @media (min-width: 1024px){
          :root{
            --brand-size: 36px;
            --header-padding: 14px 24px;
            --social-size: 44px;
          }
        }

        ${baseCSS}
      `}</style>

      {/* Hero */}
      <section style={styles.hero}>
        <img
          src="/commontimehero.png"
          alt="Common Time"
          style={styles.heroImg}
        />
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <p>designed for the everyday rituals</p>
        </div>
      </section>

      {/* Accordions */}
      <main style={styles.main}>
        <div style={styles.accordionWrap}>
          <Accordion>
            <Accordion.Item title="Location">
              <p>Lodhi Colony, New Delhi, India</p>
            </Accordion.Item>
          </Accordion>
        </div>
      </main>

      <div style={styles.textline} align="center">
        <p>a concept by bhatia hospitality group</p>
      </div>
    </div>
  );
}

/* ---------- Partner Logos (Clearbit, taller & no boxes) ---------- */
function PartnerLogos() {
  const brands = [
    "spotify.com",
    "airbnb.com",
    "netflix.com",
    "nike.com",
    "paypal.com",
    "uber.com",
    "github.com",
    "slack.com",
  ];

  return (
    <section style={styles.partners} aria-label="Partner logos">
      <div style={styles.partnersInner}>
        <p style={styles.partnersHeading}>In good company</p>
        <div style={styles.partnerRow}>
          {brands.map((domain, i) => (
            <div key={i} style={styles.logoWrap}>
              <img
                src={`https://logo.clearbit.com/${domain}`}
                alt={domain.split(".")[0]}
                style={styles.logoImg}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Accordion (plus/minus indicator) ---------- */
function Accordion({ children }) {
  return <div style={styles.accordion}>{children}</div>;
}
Accordion.Item = function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const innerRef = useRef(null);
  const id = useRef(`panel-${Math.random().toString(36).slice(2, 8)}`).current;

  useEffect(() => {
    if (!innerRef.current) return;
    setHeight(open ? innerRef.current.scrollHeight : 0);
  }, [open, children]);

  const indicator = open ? "–" : "+"; // plus when closed, minus when open

  return (
    <div style={styles.item}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        style={styles.itemBtn}
      >
        <span>{title}</span>
        <span style={styles.indicator}>{indicator}</span>
      </button>
      <div
        id={id}
        style={{
          ...styles.panel,
          maxHeight: height,
        }}
      >
        <div ref={innerRef} style={styles.panelInner}>
          {children}
        </div>
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */
const styles = {
  page: {
    fontFamily: '"Poppins", sans-serif',
    color: "#0f172a",
    background: "#ffffff",
    lineHeight: 1.6,
  },

  hero: {
    position: "relative",
    height: "90vh",
    minHeight: 380,
    width: "100vw",
    overflow: "hidden",
  },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 90%, rgba(0,0,0,0))",
  },
  heroContent: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    padding: "90px",
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },

  main: { width: "100vw", padding: "24px 16px" },
  accordionWrap: { maxWidth: 1200, margin: "0 auto" },

  accordion: {
    marginTop: 8,
    marginBottom: 28,
    borderRadius: 16,
    border: "1px solid #fff",
    background: "#fff",
  },
  item: { borderTop: "1px solid #e5e7eb" },
  itemBtn: {
    width: "100%",
    textAlign: "left",
    background: "white",
    border: "none",
    padding: "18px 20px",
    fontSize: 18,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#0f172a",
    outline: "none",
    fontFamily: '"Manrope", sans-serif',
  },
  indicator: {
    display: "inline-block",
    width: 24,
    textAlign: "center",
    fontSize: 22,
    lineHeight: 1,
  },
  panel: { transition: "max-height 240ms ease", overflow: "hidden" },
  panelInner: {
    padding: "0 20px 18px",
    color: "#000000",
    fontFamily: '"Poppins", sans-serif',
  },

  partners: {
    width: "100vw",
    background: "#fff",
  },
  partnersInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "22px 16px",
  },
  partnersHeading: {
    margin: "0 0 12px",
    fontSize: 13,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#64748b",
    fontFamily: '"Poppins", sans-serif',
  },
  partnerRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
  },
  logoWrap: {
    height: 96,
    display: "grid",
    placeItems: "center",
  },
  logoImg: {
    maxHeight: "80%",
    width: "auto",
    objectFit: "contain",
  },

  textline: {
    padding: "24px 0",
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
};

/* Base CSS */
const baseCSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
  img { max-width: 100%; display: block; }
  button { cursor: pointer; font: inherit; }
  a { text-decoration: none; }
  ul { padding-left: 1rem; }

  button:focus { outline: none; }
  button:focus-visible { outline: none; }
`;
