import { promises as fs } from 'fs';

let projects = []; 

fs.readFile('projectData.json', 'utf8')
  .then(data => {
    projects = JSON.parse(data); 
  })
  .catch(err => {
    console.error("Error reading projects file:", err);
  });

export { projects };