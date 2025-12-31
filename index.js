import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import fs from "fs";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== CONFIG DO BOT =====
const BOT_INFO = {
  name: "CORE Bot",
  version: "0.1.0",
  creator: "ghost!",
  language: "Node.js",
  description: "Bot focado em comandos simples e controle total."
};

// ===== 8BALL RESPOSTAS =====
const EIGHTBALL_ANSWERS = [
  "Sim, definitivamente.",
  "É certo que sim.",
  "Sem dúvidas.",
  "Provavelmente.",
  "As chances são boas.",
  "Talvez.",
  "Não tenho certeza.",
  "Pergunte novamente mais tarde.",
  "Melhor não contar com isso.",
  "As chances são baixas.",
  "Não.",
  "Definitivamente não."
];

// ===== Função para carregar comandos =====
function loadCommands() {
  try {
    const data = fs.readFileSync("./commands.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log("⚠️ Erro ao ler commands.json");
    return [];
  }
}

// ===== Bot online =====
client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// ===== Mensagens =====
client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  const content = msg.content;

  // !ping
  if (content === "!ping") {
    msg.reply("Pong 🟢");
    return;
  }

  // !help
  if (content === "!help") {
    const commands = loadCommands();

    const embed = new EmbedBuilder()
      .setTitle("📘 Comandos disponíveis")
      .setColor(0x4b458c)
      .setFooter({ text: BOT_INFO.name });

    if (commands.length === 0) {
      embed.setDescription("Nenhum comando registrado.");
    } else {
      for (const cmd of commands) {
        embed.addFields({
          name: cmd.usage,
          value: cmd.description,
          inline: false
        });
      }
    }

    msg.reply({ embeds: [embed] });
    return;
  }

  // !about
  if (content === "!about") {
    const uptimeMs = client.uptime || 0;
    const uptimeSec = Math.floor(uptimeMs / 1000);
    const uptimeMin = Math.floor(uptimeSec / 60);
    const uptimeHr = Math.floor(uptimeMin / 60);

    const embed = new EmbedBuilder()
      .setTitle("🤖 Sobre o Bot")
      .setColor(0x2b2d31)
      .setDescription(BOT_INFO.description)
      .addFields(
        { name: "📦 Nome", value: BOT_INFO.name, inline: true },
        { name: "🔖 Versão", value: BOT_INFO.version, inline: true },
        { name: "🧠 Criador", value: BOT_INFO.creator, inline: true },
        { name: "💻 Linguagem", value: BOT_INFO.language, inline: true },
        {
          name: "⏱️ Uptime",
          value: `${uptimeHr}h ${uptimeMin % 60}m ${uptimeSec % 60}s`,
          inline: false
        }
      )
      .setFooter({ text: "Comandos-first • sem painel (por enquanto)" });

    msg.reply({ embeds: [embed] });
    return;
  }

  // 🎱 !8ball
  if (content.startsWith("!8ball")) {
    const question = content.replace("!8ball", "").trim();

    if (!question) {
      msg.reply("🎱 Faça uma pergunta depois do comando.");
      return;
    }

    const answer =
      EIGHTBALL_ANSWERS[Math.floor(Math.random() * EIGHTBALL_ANSWERS.length)];

    const embed = new EmbedBuilder()
      .setTitle("🎱 Magic 8Ball")
      .setColor(0x000000)
      .addFields(
        { name: "❓ Pergunta", value: question },
        { name: "🔮 Resposta", value: answer }
      )
      .setFooter({ text: "O destino respondeu..." });

    msg.reply({ embeds: [embed] });
    return;
  }
});

// ===== Login =====
client.login(process.env.DISCORD_TOKEN);
