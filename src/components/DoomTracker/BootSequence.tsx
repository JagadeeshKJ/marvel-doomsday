import { useEffect, useState } from 'react';
import './BootSequence.css';

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState('SYS_INIT');
  const [logs, setLogs] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);
  const [power, setPower] = useState(0);
  
  useEffect(() => {
    // Classic JARVIS startup sequence
    const sequence = [
      { time: 100, text: 'J.A.R.V.I.S.', log: 'sys.boot(0x8F9B) ... OK' },
      { time: 400, text: 'J.A.R.V.I.S.', log: 'load_module(stark_core) ... OK' },
      { time: 700, text: 'IMPORTING', log: 'ui_matrix.align(3D) ... OK' },
      { time: 1000, text: 'PREFERENCES', log: 'net.ping(stark_net) ... CONNECTED' },
      { time: 1400, text: 'SYSTEM', log: 'auth.verify(TONY_STARK) ... VERIFIED' },
      { time: 1800, text: 'ONLINE', log: 'arc_reactor.output() ... CHECKING' },
      { time: 2400, text: 'ONLINE', log: 'sys.status = OPTIMAL' },
      { time: 2800, text: 'STANDBY', log: 'ui.render(DOOM_TRACKER) ... READY' }
    ];

    const timeouts = sequence.map((step) => 
      setTimeout(() => {
        setPhase(step.text);
        setLogs(prev => {
          const next = [...prev, step.log];
          return next.slice(Math.max(next.length - 8, 0)); // Keep last 8 logs
        });
      }, step.time)
    );

    const memInterval = setInterval(() => {
      setMemory(m => Math.min(m + Math.floor(Math.random() * 15), 100));
      setPower(p => Math.min(p + Math.floor(Math.random() * 60), 400));
    }, 100);

    // Call onComplete after the CSS fadeout animation finishes (3.5s delay + 0.8s duration = 4.3s)
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 4300);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(completeTimeout);
      clearInterval(memInterval);
    };
  }, [onComplete]);

  return (
    <div className="dt-boot-container">
      {/* Bright initial flash like in the movies */}
      <div className="dt-hud-flash" />
      
      <div className="dt-hud-bg-grid" />
      <div className="dt-hud-target-reticle" />

      <div className="dt-hud-side-panel dt-hud-left-panel">
        <div className="dt-hud-panel-title">SYSTEM DIAGNOSTICS</div>
        <div className="dt-hud-logs">
          {logs.map((log, i) => (
            <div key={i} className="dt-hud-log-line">{`> ${log}`}</div>
          ))}
        </div>
      </div>

      <div className="dt-hud-side-panel dt-hud-right-panel">
        <div className="dt-hud-panel-title">CORE METRICS</div>
        <div className="dt-hud-system-status">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#00e5ff', width: '100%', marginBottom: '4px' }}>
            <span>MEMORY ALLOCATION</span>
            <span>{memory}%</span>
          </div>
          <div className="dt-hud-bar-container">
            <div className="dt-hud-bar-fill" style={{ width: `${memory}%`, transition: 'width 0.1s linear' }} />
          </div>
        </div>
        <div className="dt-hud-system-status" style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ff3d00', width: '100%', marginBottom: '4px' }}>
            <span>ARC REACTOR OUTPUT</span>
            <span>{power}%</span>
          </div>
          <div className="dt-hud-bar-container" style={{ borderColor: 'rgba(255, 61, 0, 0.3)' }}>
            <div className="dt-hud-bar-fill" style={{ width: `${Math.min(power / 4, 100)}%`, background: '#ff3d00', boxShadow: '0 0 15px #ff3d00', transition: 'width 0.1s linear' }} />
          </div>
        </div>
      </div>

      <div className="dt-hud-wrapper">
        <div className="dt-hud-ring dt-hud-ring-1" />
        <div className="dt-hud-ring dt-hud-ring-2" />
        <div className="dt-hud-ring dt-hud-ring-3" />
        <div className="dt-hud-ring dt-hud-ring-4" />
        <div className="dt-hud-ring dt-hud-ring-5" />
        <div className="dt-hud-ring dt-hud-ring-6" />

        <div className="dt-hud-center">
          <span className="dt-hud-text">{phase}</span>
        </div>
      </div>
    </div>
  );
}
