import { SlashCommandBuilder } from 'discord.js';

export const add = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add new project to the list')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('Name of the project')
                .setRequired(true)
        ),
    async execute(interaction, successEmbed) {
        await interaction.reply({ embeds: [successEmbed] });
    },
};