const { default: makeWASocket } = require('@whiskeysockets/baileys');
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const Pino = require('pino');

async function startFahriClient() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeWASocket({
    logger: Pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['FahriOfficiaL', 'Chrome', '1.0.0'],
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    console.log(`[RECV] ${from}: ${text}`);
  });
}

module.exports = startFahriClient;
