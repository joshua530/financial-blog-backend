/** provides information to be sent to the about and home pages*/
const home = (req, res) => {};

const about = (req, res) => {
  const aboutPage = {
    welcomeText: 'Welcome to our site where people share financial ideas',
    aboutText:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus delectus, provident ab quos unde magnam eos beatae est possimus blanditiis reiciendis et consectetur sit ex quidem veniam. Sapiente, repudiandae temporibus!',
    missionText:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam natus quo sit cum, aliquam cumque dolorum quis, molestiae, voluptatibus consequuntur quas soluta. Porro, voluptate accusamus at maiores odio eum eaque?',
    welcomeImage: '<image url>'
  };
  res.status(200).json(aboutPage);
};

module.exports = { home, about };
