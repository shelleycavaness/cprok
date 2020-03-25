const App = async ({ root, component, location }) => {
  //Node - <div id="#app"></div>
  const appEl = root;

  //header function component
  const Header = (props) => `<header>${props ? props.title : 'Default app name'}</header>`
  // ---> header function is the same as  
  // function header(props) {
  //   return `<header>${props ? props.title : 'Default app name'}</header>`
  // }

  //Declaring our Header component using our header function component
  const HeaderComponent = Header({ title: 'Arbre de compétence' });

  //Declaring our Tree Component using our Tree function component
  // const SkillComponent = async(props) => await Skill(props);

  //We're calling our function component, so it can appear within the DOM
  appEl.innerHTML = HeaderComponent;

  console.log('app location :', location);

  //Our selfmade router
  switch (component) {
    case 'home':
      return await TreeComponent({ location: location, root })
    case 'skill':
      return await SkillComponent({ location: location, root });
    default:
      return await TreeComponent({ location: location, root })
  }
}

//This is where we're going to get modules & skills and render them within the DOM
const TreeComponent = async (props) => {

  let treeEl = document.createElement('div');
  treeEl.className = `tree`

  //Getting all modules
  const modules = await getModules();
  //Then we're adding them to the DOM
  renderModules(modules, treeEl);

  //finally rendering the Tree within the dom
  return props.root.appendChild(treeEl);
}

const SkillComponent = async (props) => {

  const { location, root } = props;

  const skillId = location.searchParams.get('id');

  //Creating our node element
  let skillEl = document.createElement('div');
  skillEl.id = skillId;
  skillEl.className = `skill`;

  let skill = await getSkillById(skillId);

  skillEl.innerHTML = (
    `
    <h1>${skill.name}</h1>
    <p>${skill.description}</p>
    `)

  return root.appendChild(skillEl);
}

const renderModules = async (modules, root) => {

  //We're creating our module template
  // <section>
  //   <h1>module name</h1>
  //   <ul>
  //     <li>module skill name</li>
  //     <li>module skill name</li>
  //     <li>module skill name</li>
  //     <li>...</li>
  //   </ul>
  // </section>

  const moduleTemplate = async (module) => {

    //First, get all skills by module
    let moduleSkills = await getSkillsByModuleId(module.id);

    //Then, we create our template once we have all module skills
    let moduleTemplate = document.createElement('section');

    moduleTemplate.innerHTML = (
      `
        <h1>${module.name}</h1>
        <ul>
          ${
      moduleSkills.map(skill => {
        return (`<li class="skill"><a href="/skills/?id=${skill.id}">${skill.name}</a></li>`)
      }).join('')
      }
        </ul>
      `
    )

    return moduleTemplate;
  }


  //We could use a loop function here, but we're only having 3 modules for our tree.
  //Otherwise we could have use an async mapping function --> https://codepen.io/Imundy/pen/xLBbog
  let module1template = await moduleTemplate(modules[0]);
  let module2template = await moduleTemplate(modules[1]);
  let module3template = await moduleTemplate(modules[2]);


  //Finally, we're displaying each module template within the root element which is TreeEl here, so it can appear within the DOM
  root.appendChild(module1template);
  root.appendChild(module2template);
  root.appendChild(module3template);
}


// ----------------------------------------------------------------------
// -------------------------- UTILS -------------------------------------
// -------------------------GET DATA ------------------------------------
// ----------------------------------------------------------------------

const getModules = async (props) => {

  let modules = await getData(`http://localhost:3000/api/modules/`);

  return modules.data
}

const getSkills = async (props) => {

  let skills = await getData(`http://localhost:3000/api/skills/`);

  return skills.data
}

const getSkillById = async (id) => {

  let skill = await getData(`http://localhost:3000/api/skills/${id}`);

  return skill.data
}

const getSkillsByModuleId = async (moduleId) => {

  let skills = await getData(`http://localhost:3000/api/skills/?module=${moduleId}`);

  return skills.data
}

//A reusable fetching function
const getData = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    header: {
      'Content-Type': 'Application/json'
    }
  });

  //We're now reading the response body with the method json()
  return await response.json();
}

export default App;