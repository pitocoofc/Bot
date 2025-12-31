import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import fs from "fs";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

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

  // !ping
  if (msg.content === "!ping") {
    msg.reply("Pong 🟢");
    return;
  }

  // !help
  if (msg.content === "!help") {
    const commands = loadCommands();

    const embed = new EmbedBuilder()
      .setTitle("📘 Comandos disponíveis")
      .setColor(0x4b458c)
      .setFooter({ text: "CORE Bot" });

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
  }
});

// ===== Login =====
client.login(process.env.DISCORD_TOKEN);
