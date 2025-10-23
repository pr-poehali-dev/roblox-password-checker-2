import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Index() {
  const [targetUsername, setTargetUsername] = useState('');
  const [attackMode, setAttackMode] = useState<'dictionary' | 'bruteforce' | 'smart'>('smart');
  const [isRunning, setIsRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [currentPassword, setCurrentPassword] = useState('');
  const [foundPassword, setFoundPassword] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentAttempts, setRecentAttempts] = useState<Array<{ password: string; timestamp: number }>>([]);
  const [hackingStage, setHackingStage] = useState<string>('');
  const [accountData, setAccountData] = useState<any>(null);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef(0);

  const commonPasswords = [
    'password123', 'qwerty123', 'roblox2024', 'admin123', 'letmein',
    'welcome123', 'monkey123', 'dragon123', 'master123', 'shadow123',
    'football123', 'baseball123', 'superman123', 'batman123', 'trustno1',
    'abc123', '123456', 'password', '12345678', 'qwerty'
  ];

  const generatePassword = (mode: string, attempt: number): string => {
    if (mode === 'dictionary') {
      return commonPasswords[attempt % commonPasswords.length] + Math.floor(Math.random() * 1000);
    } else if (mode === 'bruteforce') {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const length = 6 + (attempt % 4);
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    } else {
      const patterns = [
        `${targetUsername}${Math.floor(Math.random() * 10000)}`,
        `roblox${Math.floor(Math.random() * 10000)}`,
        `${targetUsername}123`,
        `${targetUsername}_${Math.floor(Math.random() * 1000)}`,
        commonPasswords[attempt % commonPasswords.length]
      ];
      return patterns[attempt % patterns.length];
    }
  };

  const attemptPassword = () => {
    if (!isRunning) return;

    const password = generatePassword(attackMode, attempts);
    setCurrentPassword(password);
    setAttempts(prev => prev + 1);
    attemptCountRef.current += 1;
    
    setRecentAttempts(prev => {
      const newAttempts = [{ password, timestamp: Date.now() }, ...prev.slice(0, 19)];
      return newAttempts;
    });

    const success = Math.random() > 0.998;
    
    if (success) {
      setFoundPassword(password);
      initiateHack(password);
    }
  };

  const startAttack = () => {
    setIsRunning(true);
    setAttempts(0);
    attemptCountRef.current = 0;
    setFoundPassword(null);
    setStartTime(Date.now());
    setRecentAttempts([]);
    
    intervalRef.current = setInterval(attemptPassword, 150);
    
    speedIntervalRef.current = setInterval(() => {
      setSpeed(attemptCountRef.current);
      attemptCountRef.current = 0;
    }, 1000);
  };

  const stopAttack = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (speedIntervalRef.current) clearInterval(speedIntervalRef.current);
    setHackingStage('');
  };

  const initiateHack = async (password: string) => {
    const stages = [
      'Connecting to Roblox servers...',
      'Bypassing security protocols...',
      'Authenticating credentials...',
      'Accessing account database...',
      'Retrieving account information...',
      'Extracting user data...',
      'Hack completed successfully!'
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setHackingStage(stages[i]);
    }

    const mockAccountData = {
      userId: Math.floor(Math.random() * 9000000) + 1000000,
      displayName: targetUsername,
      created: new Date(Date.now() - Math.floor(Math.random() * 365 * 5) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      robux: Math.floor(Math.random() * 10000),
      premium: Math.random() > 0.5,
      followers: Math.floor(Math.random() * 5000),
      following: Math.floor(Math.random() * 1000),
      friends: Math.floor(Math.random() * 200),
      badges: Math.floor(Math.random() * 50),
      gamesPlayed: Math.floor(Math.random() * 100)
    };

    setAccountData(mockAccountData);
    setShowAccountInfo(true);
    
    setTimeout(() => {
      stopAttack();
    }, 1000);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (speedIntervalRef.current) clearInterval(speedIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary animate-matrix-rain font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {Math.random().toString(36).substring(7)}
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <header className="border-b border-primary/30 backdrop-blur-sm bg-background/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 border-2 border-primary rounded flex items-center justify-center animate-glow-pulse">
                  <Icon name="Zap" className="text-primary" size={24} />
                </div>
                <h1 className="text-2xl font-orbitron font-bold text-primary tracking-wider">
                  AUTO BRUTEFORCE SYSTEM
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-primary/60 font-orbitron">STATUS</div>
                  <div className={`text-sm font-bold font-orbitron ${isRunning ? 'text-primary animate-pulse' : 'text-primary/40'}`}>
                    {isRunning ? 'ACTIVE' : 'IDLE'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-card/50 border-primary/30 p-4 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                <div className="flex items-center gap-3">
                  <Icon name="Hash" className="text-primary" size={20} />
                  <div>
                    <div className="text-xs text-primary/60 font-orbitron">ATTEMPTS</div>
                    <div className="text-2xl font-bold text-primary font-mono">{attempts.toLocaleString()}</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-primary/30 p-4 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                <div className="flex items-center gap-3">
                  <Icon name="Gauge" className="text-primary" size={20} />
                  <div>
                    <div className="text-xs text-primary/60 font-orbitron">SPEED</div>
                    <div className="text-2xl font-bold text-primary font-mono">{speed}/s</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-primary/30 p-4 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                <div className="flex items-center gap-3">
                  <Icon name="Clock" className="text-primary" size={20} />
                  <div>
                    <div className="text-xs text-primary/60 font-orbitron">ELAPSED</div>
                    <div className="text-2xl font-bold text-primary font-mono">{formatTime(elapsedTime)}</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-primary/30 p-4 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                <div className="flex items-center gap-3">
                  <Icon name="Target" className="text-primary" size={20} />
                  <div>
                    <div className="text-xs text-primary/60 font-orbitron">MODE</div>
                    <div className="text-lg font-bold text-primary font-orbitron uppercase">{attackMode}</div>
                  </div>
                </div>
              </Card>
            </div>

            {hackingStage && (
              <Card className="bg-primary/20 border-2 border-primary p-6 shadow-[0_0_30px_rgba(0,255,65,0.4)] animate-glow-pulse">
                <div className="flex items-center gap-4">
                  <Icon name="Loader2" className="text-primary animate-spin" size={32} />
                  <div className="flex-1">
                    <h3 className="font-orbitron font-bold text-primary text-xl mb-1">HACKING IN PROGRESS...</h3>
                    <p className="text-sm text-primary/80 font-mono animate-pulse">{hackingStage}</p>
                  </div>
                </div>
              </Card>
            )}

            {showAccountInfo && accountData && (
              <Card className="bg-primary/20 border-2 border-primary p-6 shadow-[0_0_30px_rgba(0,255,65,0.4)]">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-primary/30">
                    <div className="w-12 h-12 bg-primary/30 border-2 border-primary rounded-full flex items-center justify-center">
                      <Icon name="CheckCircle2" className="text-primary" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-orbitron font-bold text-primary text-xl mb-1">ACCOUNT COMPROMISED!</h3>
                      <p className="text-sm text-primary/80 font-orbitron">Full access granted to {targetUsername}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10 font-orbitron"
                      onClick={() => navigator.clipboard.writeText(`${targetUsername}:${foundPassword}`)}
                    >
                      <Icon name="Copy" size={16} className="mr-2" />
                      COPY CREDENTIALS
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Key" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">PASSWORD</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{foundPassword}</p>
                    </div>

                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Hash" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">USER ID</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{accountData.userId}</p>
                    </div>

                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Calendar" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">CREATED</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{accountData.created}</p>
                    </div>

                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="DollarSign" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">ROBUX</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{accountData.robux.toLocaleString()}</p>
                    </div>

                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Crown" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">PREMIUM</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{accountData.premium ? 'YES' : 'NO'}</p>
                    </div>

                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Users" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">FRIENDS</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{accountData.friends}</p>
                    </div>

                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="UserPlus" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">FOLLOWERS</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{accountData.followers.toLocaleString()}</p>
                    </div>

                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Trophy" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">BADGES</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{accountData.badges}</p>
                    </div>

                    <div className="bg-background/30 border border-primary/20 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Gamepad2" className="text-primary" size={16} />
                        <span className="text-xs text-primary/60 font-orbitron">GAMES PLAYED</span>
                      </div>
                      <p className="font-mono text-primary font-bold">{accountData.gamesPlayed}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-orbitron"
                      onClick={() => window.open(`https://www.roblox.com/users/${accountData.userId}/profile`, '_blank')}
                    >
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      OPEN PROFILE
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary/10 font-orbitron"
                      onClick={() => {
                        setShowAccountInfo(false);
                        setFoundPassword(null);
                        setAccountData(null);
                      }}
                    >
                      <Icon name="RotateCcw" size={16} className="mr-2" />
                      NEW TARGET
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-primary/30 p-6 shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-primary/20">
                    <Icon name="Settings" className="text-primary" size={24} />
                    <h2 className="text-xl font-orbitron font-bold text-primary">CONFIGURATION</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-orbitron text-primary mb-2">
                      TARGET USERNAME
                    </label>
                    <input
                      type="text"
                      value={targetUsername}
                      onChange={(e) => setTargetUsername(e.target.value)}
                      placeholder="Enter Roblox username..."
                      className="w-full bg-input border border-primary/30 rounded px-4 py-3 text-primary font-mono text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all"
                      disabled={isRunning}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-orbitron text-primary mb-2">
                      ATTACK MODE
                    </label>
                    <Select value={attackMode} onValueChange={(v: any) => setAttackMode(v)} disabled={isRunning}>
                      <SelectTrigger className="w-full bg-input border-primary/30 text-primary font-orbitron">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-primary/30">
                        <SelectItem value="smart" className="font-orbitron text-primary">Smart Attack</SelectItem>
                        <SelectItem value="dictionary" className="font-orbitron text-primary">Dictionary</SelectItem>
                        <SelectItem value="bruteforce" className="font-orbitron text-primary">Bruteforce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    {!isRunning ? (
                      <Button
                        onClick={startAttack}
                        disabled={!targetUsername.trim()}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-orbitron text-lg py-6 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all disabled:opacity-50"
                      >
                        <Icon name="Play" size={20} className="mr-2" />
                        START ATTACK
                      </Button>
                    ) : (
                      <Button
                        onClick={stopAttack}
                        className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-orbitron text-lg py-6 shadow-[0_0_20px_rgba(255,0,85,0.3)] hover:shadow-[0_0_30px_rgba(255,0,85,0.5)] transition-all"
                      >
                        <Icon name="Square" size={20} className="mr-2" />
                        STOP ATTACK
                      </Button>
                    )}
                  </div>

                  {isRunning && (
                    <div className="bg-background/50 border border-primary/20 rounded p-4">
                      <div className="text-xs text-primary/60 font-orbitron mb-2">CURRENT ATTEMPT</div>
                      <div className="font-mono text-primary text-lg break-all animate-pulse">
                        {currentPassword}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="bg-card/50 border-primary/30 p-6 shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-primary/20">
                    <Icon name="List" className="text-primary" size={24} />
                    <h2 className="text-xl font-orbitron font-bold text-primary">ATTEMPT LOG</h2>
                  </div>

                  <div className="space-y-1 h-[400px] overflow-y-auto">
                    {recentAttempts.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-primary/40 font-orbitron text-sm">
                        No attempts yet...
                      </div>
                    ) : (
                      recentAttempts.map((attempt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-background/30 border border-primary/10 rounded text-xs hover:border-primary/30 transition-colors"
                        >
                          <span className="font-mono text-primary/80">{attempt.password}</span>
                          <span className="text-primary/40 font-orbitron">#{attempts - i}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}