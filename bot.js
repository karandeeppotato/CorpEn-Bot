import {
  Client,
  GatewayIntentBits,
  InteractionType,
  EmbedBuilder,
  ChannelType,
} from "discord.js";
import fs from "fs/promises";
import { createProjectEmbed } from "./Functions/CreateProjectEmbed.js";
import { welcome } from "./Functions/Welcome.js";
import { add } from "./Commands/add.js";
import { update } from "./Commands/update.js";
import { show } from "./Commands/show.js";
import { remove } from "./Commands/remove.js";
import "dotenv/config";

const commandList = [add, update, show, remove];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildMemberAdd", welcome);

let projects = [];

async function getUpdatedProjects() {
  try {
    const data = await fs.readFile("projectData.json", "utf8");
    projects = JSON.parse(data);
  } catch (error) {
    console.error("Error reading projects file:", error);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const command = interaction.commandName;

    if (command === "add") {
      const projectName = interaction.options.getString("name");
      const guild = interaction.guild;
      const newCategory = await guild.channels.create({
        name: projectName,
        type: ChannelType.GuildCategory,
      });

      guild.channels.create({
        name: "discussion",
        type: ChannelType.GuildText,
        parent: newCategory,
      });

      guild.channels.create({
        name: "design-submission",
        type: ChannelType.GuildText,
        parent: newCategory,
      });

      projects.push({
        indexNo: projects.length + 1,
        name: projectName,
        isCompleted: false,
      });

      const successEmbed = new EmbedBuilder()
        .setColor("Purple")
        .setTitle("Project Added Successfully!")
        .setDescription(
          `The project **${projectName}** has been successfully added.`
        );

      try {
        await fs.writeFile(
          "projectData.json",
          JSON.stringify(projects, null, 2)
        );
      } catch (err) {
        console.error("Error writing projects file:", err);
      }
      await commandList[0].execute(interaction, successEmbed);
    }

    let isUpdated = true;
    if (command === "update") {
      const projectNumber = interaction.options.getInteger("number");

      try {
        if (projectNumber < 1 || projectNumber > projects.length) {
          isUpdated = false;
        }
        const projectToUpdate = projects[projectNumber - 1];
        projectToUpdate.isCompleted = !projectToUpdate.isCompleted;
        await fs.writeFile('projectData.json', JSON.stringify(projects, null, 2));
      } catch(error) {
        console.error('Error reading projects file:', error);
        isUpdated = false;
      }

      await commandList[1].execute(interaction, isUpdated, projectNumber);
    }

    if (command === "show") {
      await getUpdatedProjects();
      const filter = interaction.options.getString("filter").toLowerCase();
      let contentToShow;

      if (filter === "all") {
        const allProjectEmbeds = projects.map((project) =>
          createProjectEmbed(project)
        );
        contentToShow = allProjectEmbeds;
      } else if (!isNaN(filter)) {
        const indexNumber = parseInt(filter);
        if (indexNumber > projects.length) {
          const errorMessageEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Project doesn't exist 🚫")
            .setDescription(
              "The project number you have entered does not exist."
            );
          contentToShow = [errorMessageEmbed];
        } else {
          const selectedProject = projects[indexNumber - 1];
          contentToShow = [createProjectEmbed(selectedProject)];
        }
      } else if (filter === "completed") {
        const completedProjectEmbeds = projects
          .filter((project) => project.isCompleted)
          .map((project) => createProjectEmbed(project));
        contentToShow = completedProjectEmbeds;
      } else if (filter === "uncompleted") {
        const completedProjectEmbeds = projects
          .filter((project) => !project.isCompleted)
          .map((project) => createProjectEmbed(project));
        contentToShow = completedProjectEmbeds;
      } else {
        const errorMessageEmbed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Invalid Command")
          .setDescription("Please use one of the following commands: ")
          .addFields(
            { name: "/show all", value: "Show all projects" },
            { name: "/show [number]", value: "Show a specific project" },
            { name: "/show completed", value: "Show all completed projects" },
            {
              name: "/show uncompleted",
              value: "Show all uncompleted projects",
            }
          );

        contentToShow = [errorMessageEmbed];
      }
      await commandList[2].execute(interaction, contentToShow);
    }

    let isRemoved = true;
    if (command === "remove") {
      const projectNumberToRemove = interaction.options.getInteger("number");
      console.log("project number to remove", projectNumberToRemove);

      fs.readFile("projectData.json", "utf8")
        .then((data) => {
          const projects = JSON.parse(data);
          const projectIndex = projects.findIndex(
            (project) => project.indexNo === projectNumberToRemove
          );
          console.log("project index", projectIndex);

          if (projectIndex !== -1) {
            projects.splice(projectIndex, 1);
            if (projectIndex < projects.length) {
              for (let i = projectIndex; i < projects.length; i++) {
                projects[i].indexNo = i + 1;
              }
            }

            fs.writeFile("projectData.json", JSON.stringify(projects, null, 2))
              .then(() => {
                console.log("Projects data updated successfully");
              })
              .catch((error) => {
                console.log("Error writing projects data:", error);
                isRemoved = false;
              });
          } else {
            isRemoved = false;
          }
        })
        .catch((error) => {
          console.log("Error reading projects data:", error);
          isRemoved = false;
        }).then(() => {
          commandList[3].execute(interaction, isRemoved);
        });
    }
  }
});

client.once("ready", async () => {
  const guildId = process.env.GUILD_ID;

  for (const command of commandList) {
    if (guildId) {
      await client.guilds.cache.get(guildId).commands.create(command.data);
    } else {
      await client.application.commands.create(command.data);
    }
  }
});

client.login(process.env.TOKEN);
