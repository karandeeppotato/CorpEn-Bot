import { SlashCommandBuilder } from "discord.js";

export const show = {
  data: new SlashCommandBuilder()
    .setName("show")
    .setDescription("Show command lets you interact with the project list")
    .addStringOption((option) =>
      option
        .setName("filter")
        .setDescription(
          "Filter for projects (all, [number], completed, uncompleted)."
        )
        .setRequired(true)
    ),
  async execute(interaction, contentToShow) {
    await interaction.reply({ embeds: contentToShow });
  },
};
