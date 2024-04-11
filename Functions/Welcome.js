import { EmbedBuilder } from "discord.js";
import "dotenv/config";

const welcomeChannelId = process.env.CHANNEL_ID;

const welcome = async (newMember) => {
  const channel = newMember.guild.channels.cache.get(welcomeChannelId);
  if (!channel) return;

  try {
    // const message = `Welcome to the server, ${newMember}!`;
    const embed = new EmbedBuilder()
      .setTitle("Welcome Aboard!")
      .setDescription(
        `Corp. En. Wishes you a hearty welcome <@${newMember.id}> \nHope you do well ! \n\nP.S.: Failure in submission in atleast 2 projects and violation of underlying rules will lead to kick or ban. :japanese_goblin:`
      )
      .addFields({
        name: "Rules",
        value:
          "1) Be Punctual\n2) Be Professional\n3) NSFW Content not allowed\n4) Be Respectful\n5) Use appropriate Channel",
      });

    // await channel.send(message);
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error sending welcome message:", error);
  }
};

export { welcome };
