import { SlashCommandBuilder } from "discord.js";

export const update = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Updates the project completion status")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("enter the project number")
        .setRequired(true)
    ),
  async execute(interaction, isUpdated, projectNumber) {
    if(isUpdated) {
      await interaction.reply(`Project Number ${ projectNumber }'s Status Updated Successfully! 🔄`);
    } else {
      await interaction.reply("Updation Error 🚫");
    }
  },
};
