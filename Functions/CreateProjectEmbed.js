import { EmbedBuilder } from "discord.js";

const createProjectEmbed = (project) => {
  const embed = new EmbedBuilder()
    .setColor(project.isCompleted ? 'Green' : 'Yellow')
    .setTitle(project.name)
    .setDescription(`Project Number: ${project.indexNo}`)
    .addFields(
        { name: 'Status', value: project.isCompleted ? 'Completed' : 'Uncompleted' }
    );

  return embed;
};

export { createProjectEmbed };