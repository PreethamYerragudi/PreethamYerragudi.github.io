import { motion } from "framer-motion";
import { useEffect, useState} from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

import "./PortfolioFrontPage.css";
import "./WorkExperience.css";
import { Mail, Phone, MapPin } from "lucide-react";


const techLogos = [
    {src:"HTML.png", alt:"HTML"},
    {src:"CSS.png", alt:"CSS"},
    {src:"JS.png", alt:"JavaScript"},
    {src:"typescript.svg", alt:"TypeScript"},
    {src:"Java.png", alt:"Java"},
    {src:"python.png", alt:"Python"},
    {src:"react.png", alt:"React"},
    {src:"django.svg", alt:"Django"}
  ];
//   type BallProps = {
//     textureUrl: string;
//     position: [number, number, number];
//   };

//   function Ball({ textureUrl, position }: BallProps) {
//     const meshRef = useRef<THREE.Mesh>(null);
//     const texture = new THREE.TextureLoader().load(textureUrl);
//     const decal_scale = 3.5;
//     const ball_scale = 3
//     return (
//       <>
//         <mesh ref={meshRef} position={position}>
//           <sphereGeometry args={[ball_scale, ball_scale*2.5, ball_scale*2.5]} />
//           <meshStandardMaterial color={"#cccccc"} />
  
//           {/* Front and back decals */}
//           <Decal position={[0, 0, ball_scale]} rotation={[0, 0, 0]} scale={[decal_scale, decal_scale, decal_scale]} map={texture} />
//           <Decal position={[0, 0, -ball_scale]} rotation={[0, -Math.PI, 0]} scale={[decal_scale, decal_scale, decal_scale]} map={texture} />
//         </mesh>
  
//         {/* Orbit Controls for each ball */}
//         <OrbitControls
//           enablePan={false}
//           enableZoom={false}
//           minPolarAngle={Math.PI / 2}
//           maxPolarAngle={Math.PI / 2}
//           minAzimuthAngle={-Math.PI}
//           maxAzimuthAngle={Math.PI}
//           target={position} // Center rotation at the sphere's position
//         />
//       </>
//     );
//   }
  
const workExperience = [
  {
    title: "Software Engineer Intern",
    company: "IntelliSavvy",
    date: "January 2025 - Present",
    logo: "src/assets/IntelliSavvyLogo.jpeg",
  },
  {
    title: "Undergraduate Student Researcher ",
    company: "Video and Image Processing Laboratory (VIPER), Purdue University",
    date: "August 2024 - December 2024",
    logo: "src/assets/purdue_vip_logo.jpeg",
  },
  {
    title: "Research Assistant",
    company: "Computer Vision Lab, Indiana University Bloomington ",
    date: "2022 - 2024",
    logo: "src/assets/IU_logo.jpeg",
  },
  {
    title: "Lead Software Engineer",
    company: "FIRST Robotics Competition Team 4926",
    date: "Summer 2025",
    logo: "src/assets/columbus_robotics_logo.jpeg",
  },
];

const softwareProjects = [
    {
      title: "PokeRL",
      description: [
        "Developed a competitive Pokemon AI agent achieving a <strong>60% win rate</strong> by leveraging advanced reinforcement learning techniques, including <strong>Deep Q-Networks (DQN)</strong> and <strong>Policy Gradient</strong> methods.",
        "Leveraged the <strong>Poke-env API</strong> and <strong>Node.js</strong> to configure a <strong>Pokemon Showdown</strong> server for automated data collection and game simulations, accelerating model training and evaluation."
      ],
      image: "src/assets/showdown_icon.png",
    },
    {
      title: "General Mart",
      description: [
        "Developed a dynamic marketplace website by utilizing <strong>Django</strong> and <strong>SQLite</strong> resulting in real-time item updates, seamless user authentication, and robust database implementation",
        "Designed an intuitive frontend using <strong>HTML</strong>, <strong>CSS</strong>, and <strong>JavaScript</strong>, incorporating the <strong>Bootstrap</strong> framework to enhance website functionality, aesthetics, and dynamic interactivity"
      ],
      image: "src/assets/general_mart_logo.png",
    },
    {
      title: "Magma Rush",
      description: [
        "Devised a complete <strong>IOS mobile game</strong> using <strong>Unity</strong> and <strong>Swift</strong>, ensuring seamless cross-device integration and performance optimization leading to <strong>100+</strong> downloads from <strong>4 different countries</strong>",
        "Programmed complex mechanics such as <strong>AI-driven</strong> NPC behavior using <strong>C#</strong> to create an engaging game play"
      ],
      image: "src/assets/MagmaRushLogo.png",
    },
    {
      title: "Book or Trash",
      description: ["A description of project four. Check this out, it's awesome!"],
      image: "src/assets/book_or_trash_logo.png",
    },
  ];

const PortfolioFrontPage = () => {
    const [isArrowVisible, setIsArrowVisible] = useState(0);
    const handleScroll = () => {
        setIsArrowVisible(window.scrollY);
    };
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    
  return (
    <div>
      {/* Main Section */}
      <div className="portfolio-container">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="main-heading">
            Hey, I'm <span className="name">Preetham</span>
          </h1>
          <p className="sub-heading">SOFTWARE ENGINEER</p>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="social-icons"
        >
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="icon">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/PreethamYerragudi" target="_blank" rel="noopener noreferrer" className="icon">
            <FaLinkedin />
          </a>
          <a href="mailto:preetham.yerragudi@gmail.com" className="icon">
            <FaEnvelope />
          </a>
        </motion.div>

        {/* Call-to-Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="button-container"
        >
                      <button
    className="cta-button"
    onClick={() => {
      const workExperienceSection = document.getElementById("work-experience");
      if (workExperienceSection) {
        workExperienceSection.scrollIntoView({ behavior: "smooth" }); // Smooth scroll
      }
    }}
  >View My Work</button>
        </motion.div>

        {/* Bouncing Arrow */}
        {isArrowVisible < 500 && (
          <motion.div
            initial={{ opacity: 1 / (isArrowVisible / 50), y: 50 }}
            animate={{
              opacity: 1 / (isArrowVisible / 50),
              y: [0, -20, 0],
            }}
            transition={{
              y: { duration: 1.5, repeat: Infinity, repeatType: "loop" },
            }}
            className="bouncing-arrow"
          >
            <div className="arrow"></div>
          </motion.div>
        )}
      </div>

      {/* About Me Section */}
      <div className="overview-container">
        <motion.div 
          className="text-content" 
          initial={{ opacity: 0, x: -50 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }}
        >
          <h1 className="main-heading2">About <span className="name">Me</span></h1>
          <p className="description">
            I'm a Computer Science student at Purdue University with a passion for using technology to make a real-world impact.
            I love exploring different areas of software development, from building intuitive user interfaces to designing powerful 
            back-end systems and even diving into AI and machine learning. Outside of tech, I enjoy athletics and books—particularly 
            cricket, tennis, and the Harry Potter series!
          </p>
        </motion.div>

        <motion.div 
          className="image-container" 
          initial={{ opacity: 0, x: 50 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }}
        >
          <img src="src/assets/me.jpeg" alt="Profile" className="profile-image" />
        </motion.div>
      </div>
     {/* Work Experience Section */}
     <motion.div 
     id="work-experience"
     className="work-experience-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Work <span className="name">Experience</span>
        </motion.h2>

        <div className="timeline">
          {workExperience.map((job, index) => (
            <motion.div
              key={index}
              className="experience-card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Growing Dot */}
              <motion.div
                key={index}
                className="timeline-dot"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              />

              <img src={job.logo} alt={job.company} className="company-logo" />
              <div className="job-details">
                <h3 className="job-title">{job.title}</h3>
                <p className="company-name">{job.company}</p>
                <p className="job-description">{job.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
{/* Software Projects Section */}
<motion.div
        className="software-projects-container"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="main-heading2">
          Software <span className="name">Projects</span>
        </h1>
        
        <div className="projects-gallery">
          {softwareProjects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <ul className="project-description">
                    {project.description.map((point, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: point }} />
                    ))}
                </ul>
                <a href="https://github.com/yourusername" target="_blank" className="github-button">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub Logo" />
</a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
     
    
  <motion.div
    className="flex"
    animate={{ x: ["0%", "-50%"] }} // Scroll only half the width for seamless looping
    transition={{
      ease: "linear",
      duration: 20, // Adjust duration for slower/faster scrolling
      repeat: Infinity, // Infinite loop
    }}
  >
    {[...techLogos, ...techLogos].map((logo, index) => (
      <motion.div
        key={index}
        className="scrolling-logo-container"
        whileHover={{ scale: 1.1, transition: { duration: 0.2 } }} // Hover effect
      >
        <img
          src={"src/assets/" + logo.src}
          alt={logo.alt}
          className="scrolling-logo"
        />
      </motion.div>
    ))}
  </motion.div>



      <div className="contact-container">
  <motion.h2
    className="section-title"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    Contact <span className="name">Me</span>
  </motion.h2>

  <div className="contact-content">
    <div className="contact-info">
      <div className="contact-card">
        <Mail className="contact-icon" />
        <h3 className="contact-title">Email</h3>
        <p className="contact-detail">preetham.yerragudi@gmail.com</p>
      </div>
      <div className="contact-card">
        <Phone className="contact-icon" />
        <h3 className="contact-title">Phone</h3>
        <p className="contact-detail">+1 (123) 456-7890</p>
      </div>
      <div className="contact-card">
        <MapPin className="contact-icon" />
        <h3 className="contact-title">Location</h3>
        <p className="contact-detail">West Lafayette, IN, USA</p>
      </div>
    </div>

    <div className="contact-form">
      <form>
        <input type="text" placeholder="Your Name" className="form-input" />
        <input type="email" placeholder="Your Email" className="form-input" />
        <textarea placeholder="Your Message" className="form-textarea"></textarea>
        <button type="submit" className="form-button">Send Message</button>
      </form>
    </div>
  </div>
</div>
    </div>
  );
};

export default PortfolioFrontPage;
