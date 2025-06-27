export interface MikroTikDevice {
  id: string;
  name: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  useHttps: boolean;
  status: 'online' | 'offline' | 'warning';
  lastSeen: Date;
  version: string;
  board: string;
  uptime: string;
}

export interface NetworkInterface {
  id: string;
  name: string;
  type: 'ethernet' | 'wireless' | 'vpn' | 'bridge';
  status: 'up' | 'down';
  rxBytes: number;
  txBytes: number;
  rxRate: number;
  txRate: number;
  lastUpdate: Date;
}

export interface VPNConnection {
  id: string;
  name: string;
  type: 'pptp' | 'l2tp' | 'sstp' | 'ovpn';
  status: 'connected' | 'disconnected' | 'connecting';
  user: string;
  uptime: string;
  rxBytes: number;
  txBytes: number;
}

export interface WirelessInterface {
  id: string;
  name: string;
  ssid: string;
  frequency: string;
  signal: number;
  clients: number;
  rxBytes: number;
  txBytes: number;
  status: 'up' | 'down';
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface BackupFile {
  id: string;
  deviceId: string;
  deviceName: string;
  filename: string;
  size: number;
  created: Date;
  type: 'configuration' | 'full';
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  lastLogin: Date;
  active: boolean;
}

export interface EmailConfig {
  enabled: boolean;
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  toEmails: string[];
  useSSL: boolean;
}

export interface PPPoEProfile {
  id: string;
  name: string;
  localAddress: string;
  remoteAddress: string;
  rateLimitRx: string; // e.g., "1M/2M"
  rateLimitTx: string;
  sessionTimeout: number; // in seconds
  idleTimeout: number; // in seconds
  onlyOne: boolean;
  changePasswordTo: string;
  useCompression: boolean;
  useEncryption: boolean;
  bridgeEnabled: boolean;
  bridgePath: string;
}

export interface PPPoEUser {
  id: string;
  name: string;
  password: string;
  profile: string;
  service: string;
  callerIdPattern: string;
  disabled: boolean;
  comment: string;
  lastLoggedIn?: Date;
  uptime?: string;
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  isActive: boolean;
  ipAddress?: string;
}
