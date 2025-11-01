export default function HeroFallback() {
  return (
    <section
      style={{
        width: '100vw',
        height: '300vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '50%',
          transform: 'translateY(-50%)',
          textAlign: 'center',
          color: '#00ffff',
          padding: '2rem'
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #00ffff, #0088ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Welcome to My Portfolio
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#888',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          Advanced 3D particle effects are available on desktop devices.
          Please visit on a larger screen for the full experience.
        </p>
      </div>
    </section>
  );
}
