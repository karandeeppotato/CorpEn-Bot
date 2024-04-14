import { SlashCommandBuilder } from 'discord.js';

export const help = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show bot commands to noobies'),
    async execute(interaction, helpEmbed) {
        await interaction.reply({ embeds: [helpEmbed]});
    },
};