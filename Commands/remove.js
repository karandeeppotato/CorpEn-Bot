import { SlashCommandBuilder } from "discord.js";

export const remove = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes project from the list")
        .addIntegerOption((option) =>
            option
                .setName("number")
                .setDescription("enter the project number")
                .setRequired(true)
        ),
    async execute(interaction, isRemoved) {
        console.log("isRemoved", isRemoved);
        if(isRemoved){
            await interaction.reply("Project Removed Successfully! 🗑️");
        }else{
            await interaction.reply("Project not found! 🚫");
        }
    }
}