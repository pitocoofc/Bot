import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import fs from "fs";
import fetch from "node-fetch";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== Carregar comandos do arquivo =====
function loadCommands() {
  try {
    const data = fs.readFileSync("./commands.json", "utf-8");
    return JSON.parse(data);
  } catch {
    console.log("⚠️ Não foi possível ler commands.json");
    return [];
  }
}

// ===== Bot online =====
client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// ===== Mensagens =====
client.on("messageCreate", async (msg) => {
  if (msg.author.bot || !msg.guild) return;

  // ======================
  // !ping
  // ======================
  if (msg.content === "!ping") {
    msg.reply("Pong 🟢");
    return;
  }

  // ======================
  // !help
  // ======================
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
    return;
  }

  // ======================
  // !verify (Bloxlink)
  // ======================
  if (msg.content.startsWith("!verify")) {
    const user = msg.mentions.users.first() || msg.author;
    const serverID = msg.guild.id;
    const userID = user.id;

    try {
      const res = await fetch(
        `https://api.blox.link/v4/public/guilds/${serverID}/discord-to-roblox/${userID}`
      );

      if (!res.ok) {
        msg.reply("❌ Usuário não verificado no Bloxlink.");
        return;
      }

      const data = await res.json();

      const embed = new EmbedBuilder()
        .setTitle("✅ Verificação Bloxlink")
        .setColor(0x00ff99)
        .addFields(
          { name: "Discord", value: `<@${userID}>`, inline: true },
          { name: "Roblox", value: data.robloxUsername || "Desconhecido", inline: true }
        )
        .setFooter({ text: "Bloxlink Public API" });

      msg.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      msg.reply("⚠️ Erro ao consultar a API do Bloxlink.");
    }
  }
});

// ===== Login =====
client.login(process.env.DISCORD_TOKEN);
