import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [credentials, setCredentials] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [results, setResults] = useState<Array<{ username: string; password: string; status: 'valid' | 'invalid' }>>([]);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);
  
  const [bruteUsername, setBruteUsername] = useState('');
  const [passwordList, setPasswordList] = useState('');
  const [isBruting, setIsBruting] = useState(false);
  const [bruteProgress, setBruteProgress] = useState(0);
  const [bruteResults, setBruteResults] = useState<Array<{ password: string; success: boolean }>>([]);
  const [foundPassword, setFoundPassword] = useState<string | null>(null);

  const handleBrute = () => {
    setIsBruting(true);
    setBruteProgress(0);
    setBruteResults([]);
    setFoundPassword(null);

    const passwords = passwordList.split('\n').filter(p => p.trim());
    let processed = 0;
    let found = false;

    passwords.forEach((password, index) => {
      setTimeout(() => {
        if (found) return;
        
        const success = Math.random() > 0.85;
        
        setBruteResults(prev => [...prev, { password, success }]);
        processed++;
        setBruteProgress((processed / passwords.length) * 100);

        if (success && !found) {
          found = true;
          setFoundPassword(password);
          setTimeout(() => setIsBruting(false), 500);
        } else if (processed === passwords.length) {
          setTimeout(() => setIsBruting(false), 500);
        }
      }, index * 600);
    });
  };

  const handleCheck = () => {
    setIsChecking(true);
    setProgress(0);
    setResults([]);

    const lines = credentials.split('\n').filter(line => line.trim());
    let processed = 0;

    lines.forEach((line, index) => {
      setTimeout(() => {
        const [username, password] = line.split(':');
        const status = Math.random() > 0.5 ? 'valid' : 'invalid';
        
        setResults(prev => [...prev, { 
          username: username || `user${index}`, 
          password: password || 'unknown',
          status 
        }]);
        processed++;
        setProgress((processed / lines.length) * 100);

        if (processed === lines.length) {
          setTimeout(() => setIsChecking(false), 500);
        }
      }, index * 800);
    });
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
                <div className="w-10 h-10 bg-primary/20 border-2 border-primary rounded flex items-center justify-center">
                  <Icon name="Shield" className="text-primary" size={24} />
                </div>
                <h1 className="text-2xl font-orbitron font-bold text-primary tracking-wider">
                  ROBLOX CHECKER
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-primary/60 font-mono">v2.1.0</span>
              </div>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-primary/20 bg-background/30 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <TabsList className="bg-transparent border-0 h-12">
                <TabsTrigger 
                  value="home" 
                  className="font-orbitron data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                >
                  <Icon name="Home" size={16} className="mr-2" />
                  ГЛАВНАЯ
                </TabsTrigger>
                <TabsTrigger 
                  value="checker"
                  className="font-orbitron data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                >
                  <Icon name="Terminal" size={16} className="mr-2" />
                  ЧЕКЕР
                </TabsTrigger>
                <TabsTrigger 
                  value="brute"
                  className="font-orbitron data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                >
                  <Icon name="Key" size={16} className="mr-2" />
                  БРУТФОРС
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <TabsContent value="home" className="mt-0">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-6 py-20">
                  <div className="inline-block">
                    <div className="relative">
                      <div className="absolute inset-0 blur-xl bg-primary/30 animate-glow-pulse" />
                      <Icon name="Lock" size={80} className="text-primary relative animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-5xl font-orbitron font-black text-primary tracking-tight">
                    СИСТЕМА ПРОВЕРКИ
                  </h2>
                  <p className="text-xl text-primary/70 max-w-2xl mx-auto">
                    Профессиональный инструмент для верификации учетных записей Roblox
                  </p>
                  <div className="flex justify-center gap-4 pt-4">
                    <Button 
                      onClick={() => setActiveTab('checker')}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-orbitron text-lg px-8 py-6 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all"
                    >
                      <Icon name="Terminal" size={20} className="mr-2" />
                      ЗАПУСТИТЬ ЧЕКЕР
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: 'Zap', title: 'БЫСТРАЯ ПРОВЕРКА', desc: 'Мгновенная валидация данных' },
                    { icon: 'Shield', title: 'БЕЗОПАСНОСТЬ', desc: 'Защищенное соединение' },
                    { icon: 'Activity', title: 'ТОЧНОСТЬ', desc: 'Проверенные алгоритмы' }
                  ].map((feature, i) => (
                    <Card key={i} className="bg-card/50 border-primary/30 p-6 hover:border-primary/60 transition-all hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] group">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 bg-primary/20 border border-primary rounded flex items-center justify-center group-hover:animate-glow-pulse">
                          <Icon name={feature.icon as any} className="text-primary" size={24} />
                        </div>
                        <h3 className="font-orbitron font-bold text-primary">{feature.title}</h3>
                        <p className="text-sm text-primary/60">{feature.desc}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="checker" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <Card className="bg-card/50 border-primary/30 p-8 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-primary/20">
                      <Icon name="Terminal" className="text-primary" size={28} />
                      <h2 className="text-2xl font-orbitron font-bold text-primary">CHECKER TOOL</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-orbitron text-primary mb-2">
                          INPUT DATA (username:password)
                        </label>
                        <div className="relative">
                          <textarea
                            value={credentials}
                            onChange={(e) => setCredentials(e.target.value)}
                            placeholder="user1:pass123&#10;user2:pass456&#10;user3:pass789"
                            className="w-full h-40 bg-input border border-primary/30 rounded px-4 py-3 text-primary font-mono text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all resize-none pr-12"
                            disabled={isChecking}
                            style={{
                              WebkitTextSecurity: showPassword ? 'none' : 'disc',
                              textSecurity: showPassword ? 'none' : 'disc'
                            }}
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-primary/60 hover:text-primary transition-colors"
                            type="button"
                          >
                            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
                          </button>
                        </div>
                      </div>

                      {isChecking && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-orbitron text-primary/70">
                            <span>STATUS</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2 bg-muted" />
                        </div>
                      )}

                      <Button
                        onClick={handleCheck}
                        disabled={!credentials.trim() || isChecking}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-orbitron text-lg py-6 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isChecking ? (
                          <>
                            <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                            CHECKING...
                          </>
                        ) : (
                          <>
                            <Icon name="Play" size={20} className="mr-2" />
                            RUN CHECK
                          </>
                        )}
                      </Button>
                    </div>

                    {results.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-primary/20">
                        <h3 className="font-orbitron font-bold text-primary">RESULTS</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {results.map((result, i) => (
                            <div
                              key={i}
                              className={`rounded border transition-all ${
                                result.status === 'valid'
                                  ? 'bg-primary/10 border-primary/40'
                                  : 'bg-destructive/10 border-destructive/40'
                              }`}
                            >
                              <div 
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-background/20"
                                onClick={() => setExpandedResult(expandedResult === i ? null : i)}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon
                                    name={expandedResult === i ? 'ChevronDown' : 'ChevronRight'}
                                    size={16}
                                    className="text-primary/60"
                                  />
                                  <span className="font-mono text-sm">{result.username}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon
                                    name={result.status === 'valid' ? 'CheckCircle2' : 'XCircle'}
                                    size={18}
                                    className={result.status === 'valid' ? 'text-primary' : 'text-destructive'}
                                  />
                                  <span className={`font-orbitron text-xs font-bold ${
                                    result.status === 'valid' ? 'text-primary' : 'text-destructive'
                                  }`}>
                                    {result.status === 'valid' ? 'VALID' : 'INVALID'}
                                  </span>
                                </div>
                              </div>
                              
                              {expandedResult === i && (
                                <div className="px-3 pb-3 pt-1 border-t border-primary/20 space-y-2 animate-accordion-down">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-primary/60 font-orbitron text-xs">USERNAME:</span>
                                      <p className="font-mono text-primary mt-1">{result.username}</p>
                                    </div>
                                    <div>
                                      <span className="text-primary/60 font-orbitron text-xs">PASSWORD:</span>
                                      <p className="font-mono text-primary mt-1">{result.password}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 border-primary/30 text-primary hover:bg-primary/10 font-orbitron text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(`${result.username}:${result.password}`);
                                      }}
                                    >
                                      <Icon name="Copy" size={14} className="mr-1" />
                                      COPY
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 border-primary/30 text-primary hover:bg-primary/10 font-orbitron text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://www.roblox.com/users/profile?username=${result.username}`, '_blank');
                                      }}
                                    >
                                      <Icon name="ExternalLink" size={14} className="mr-1" />
                                      PROFILE
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="brute" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <Card className="bg-card/50 border-primary/30 p-8 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-primary/20">
                      <Icon name="Key" className="text-primary" size={28} />
                      <h2 className="text-2xl font-orbitron font-bold text-primary">PASSWORD BRUTEFORCE</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-orbitron text-primary mb-2">
                          TARGET USERNAME
                        </label>
                        <input
                          type="text"
                          value={bruteUsername}
                          onChange={(e) => setBruteUsername(e.target.value)}
                          placeholder="username123"
                          className="w-full bg-input border border-primary/30 rounded px-4 py-3 text-primary font-mono text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all"
                          disabled={isBruting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-orbitron text-primary mb-2">
                          PASSWORD WORDLIST
                        </label>
                        <textarea
                          value={passwordList}
                          onChange={(e) => setPasswordList(e.target.value)}
                          placeholder="password123&#10;qwerty123&#10;roblox2024&#10;admin123"
                          className="w-full h-40 bg-input border border-primary/30 rounded px-4 py-3 text-primary font-mono text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all resize-none"
                          disabled={isBruting}
                        />
                      </div>

                      {isBruting && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-orbitron text-primary/70">
                            <span>ATTEMPTING...</span>
                            <span>{Math.round(bruteProgress)}%</span>
                          </div>
                          <Progress value={bruteProgress} className="h-2 bg-muted" />
                        </div>
                      )}

                      {foundPassword && (
                        <div className="p-4 bg-primary/20 border-2 border-primary rounded animate-glow-pulse">
                          <div className="flex items-center gap-3">
                            <Icon name="CheckCircle2" className="text-primary" size={24} />
                            <div className="flex-1">
                              <p className="font-orbitron font-bold text-primary text-sm">PASSWORD FOUND!</p>
                              <p className="font-mono text-primary mt-1">{foundPassword}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary/10 font-orbitron"
                              onClick={() => navigator.clipboard.writeText(foundPassword)}
                            >
                              <Icon name="Copy" size={14} className="mr-1" />
                              COPY
                            </Button>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleBrute}
                        disabled={!bruteUsername.trim() || !passwordList.trim() || isBruting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-orbitron text-lg py-6 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBruting ? (
                          <>
                            <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                            BRUTE FORCING...
                          </>
                        ) : (
                          <>
                            <Icon name="Zap" size={20} className="mr-2" />
                            START ATTACK
                          </>
                        )}
                      </Button>
                    </div>

                    {bruteResults.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-primary/20">
                        <h3 className="font-orbitron font-bold text-primary">ATTEMPT LOG</h3>
                        <div className="space-y-1 max-h-64 overflow-y-auto">
                          {bruteResults.map((result, i) => (
                            <div
                              key={i}
                              className={`flex items-center justify-between p-2 rounded text-sm ${
                                result.success
                                  ? 'bg-primary/20 border border-primary/40'
                                  : 'bg-muted/20 border border-primary/10'
                              }`}
                            >
                              <span className="font-mono text-xs text-primary/80">{result.password}</span>
                              <div className="flex items-center gap-2">
                                <Icon
                                  name={result.success ? 'CheckCircle2' : 'XCircle'}
                                  size={14}
                                  className={result.success ? 'text-primary' : 'text-primary/30'}
                                />
                                <span className={`font-orbitron text-xs ${
                                  result.success ? 'text-primary font-bold' : 'text-primary/40'
                                }`}>
                                  {result.success ? 'SUCCESS' : 'FAILED'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}