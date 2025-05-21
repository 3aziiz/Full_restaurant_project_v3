import React from "react";
import {
  Typography,
  Button,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

// Icons from Heroicons
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  TrophyIcon,
  HeartIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

function About() {
  const [activeTab, setActiveTab] = React.useState("mission");

  const values = [
    {
      title: "Customer-Centric",
      description: "We put diners and restaurants at the center of everything we build.",
      icon: <HeartIcon className="h-6 w-6" />,
    },
    {
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible in restaurant tech.",
      icon: <LightBulbIcon className="h-6 w-6" />,
    },
    {
      title: "Quality",
      description: "We maintain the highest standards in our platform and service.",
      icon: <CheckCircleIcon className="h-6 w-6" />,
    },
    {
      title: "Collaboration",
      description: "We work closely with restaurants to create solutions that truly serve them.",
      icon: <UserGroupIcon className="h-6 w-6" />,
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "The Idea",
      description: "Scan&Dine was conceived during a business trip when our founder experienced firsthand the pain points of dining in a foreign country.",
    },
    {
      year: "2021",
      title: "Development Begins",
      description: "We assembled a team of technology and hospitality experts to create the first version of our platform.",
    },
    {
      year: "2022",
      title: "Initial Launch",
      description: "Scan&Dine launched with 5 partner restaurants in San Francisco, bringing QR ordering to their tables.",
    },
    {
      year: "2023",
      title: "Rapid Expansion",
      description: "We expanded to 10 cities and introduced multilingual support, personalized recommendations, and dietary preference filtering.",
    },
    {
      year: "2024",
      title: "Going Global",
      description: "Scan&Dine reached 15 cities worldwide with 500+ restaurant partners and introduced advanced restaurant analytics.",
    },
    {
      year: "2025",
      title: "The Future",
      description: "We're working on AI-powered menu recommendations, virtual restaurant tours, and more innovations to enhance the dining experience.",
    },
  ];

  const team = [
    {
      name: "John Smith",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    {
      name: "Sarah Johnson",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    {
      name: "Michael Chen",
      role: "Head of Partnerships",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1148&q=80",
    },
    {
      name: "Lisa Wong",
      role: "Customer Experience",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#ff6347] to-red-600 overflow-hidden rounded-lg mx-4 my-4">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-6 lg:mb-0 text-white">
              <Typography variant="h2" className="text-2xl md:text-3xl font-bold mb-3">
                We're Revolutionizing Restaurant Dining
              </Typography>
              <Typography variant="lead" className="text-lg opacity-90 mb-4">
                Making dining more efficient, personalized, and enjoyable through technology.
              </Typography>
              <div className="flex flex-wrap gap-3">
                {/* <Link to="/contact">
                  <Button size="md" className="bg-white text-[#ff6347] hover:shadow-lg hover:shadow-white/20">
                    Contact Us
                  </Button>
                </Link> */}
                {/* <Link to="/restaurants">
                  <Button size="md" variant="outlined" color="white" className="hover:bg-white/10">
                    Find Restaurants
                  </Button>
                </Link> */}
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img 
                src={assets.app || "https://placehold.co/600x400?text=Scan&Dine+App"} 
                alt="Scan&Dine App" 
                className="rounded-lg shadow-xl max-w-xs md:max-w-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Information Tabs */}
      <div className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} className="mb-16">
          <TabsHeader className="bg-gray-100 rounded-full p-1 shadow-lg" indicatorProps={{
            className: "bg-[#ff6347] rounded-full shadow-md shadow-[#ff6347]/20"
          }}>
            <Tab value="mission" onClick={() => setActiveTab("mission")} className={activeTab === "mission" ? "text-white font-medium" : ""}>
              Our Mission
            </Tab>
            <Tab value="story" onClick={() => setActiveTab("story")} className={activeTab === "story" ? "text-white font-medium" : ""}>
              Our Story
            </Tab>
            <Tab value="values" onClick={() => setActiveTab("values")} className={activeTab === "values" ? "text-white font-medium" : ""}>
              Our Values
            </Tab>
          </TabsHeader>
          <TabsBody animate={{
            initial: { opacity: 0, y: 20 },
            mount: { opacity: 1, y: 0 },
            unmount: { opacity: 0, y: 20 },
          }}>
            <TabPanel value="mission" className="py-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <Typography variant="h3" className="text-3xl font-bold mb-6 text-gray-800">
                    Our Mission
                  </Typography>
                  <Typography className="text-gray-700 mb-4">
                    Scan&Dine exists to transform the traditional dining experience through innovative technology. We're building a world where you can walk into any restaurant, scan a QR code, and access a personalized digital dining experience.
                  </Typography>
                  <Typography className="text-gray-700 mb-4">
                    We aim to remove friction points like language barriers, waiting for service, and confusion about menu items, while helping restaurants operate more efficiently and provide better service.
                  </Typography>
                  <Typography className="text-gray-700">
                    Our platform connects diners directly with restaurants through real-time ordering, instant translations, dietary filtering, and seamless payment processing - creating a win-win for both sides of the restaurant equation.
                  </Typography>
                </div>
                <div className="md:w-1/2 flex items-center justify-center">
                  <div className="bg-gradient-to-br from-orange-50 to-red-100 p-8 rounded-2xl shadow-lg">
                    <RocketLaunchIcon className="h-20 w-20 text-[#ff6347] mb-6 mx-auto" />
                    <Typography variant="h4" className="text-center text-gray-800 font-semibold mb-4">
                      By the numbers
                    </Typography>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <Typography variant="h3" className="text-3xl font-bold text-[#ff6347]">
                          500+
                        </Typography>
                        <Typography className="text-gray-600">
                          Partner Restaurants
                        </Typography>
                      </div>
                      <div className="text-center">
                        <Typography variant="h3" className="text-3xl font-bold text-[#ff6347]">
                          15
                        </Typography>
                        <Typography className="text-gray-600">
                          Cities Worldwide
                        </Typography>
                      </div>
                      <div className="text-center">
                        <Typography variant="h3" className="text-3xl font-bold text-[#ff6347]">
                          100K+
                        </Typography>
                        <Typography className="text-gray-600">
                          Monthly Users
                        </Typography>
                      </div>
                      <div className="text-center">
                        <Typography variant="h3" className="text-3xl font-bold text-[#ff6347]">
                          4.8
                        </Typography>
                        <Typography className="text-gray-600">
                          App Store Rating
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            <TabPanel value="story" className="py-6">
              <Typography variant="h3" className="text-3xl font-bold mb-8 text-gray-800">
                Our Journey
              </Typography>
              
              <Timeline>
                {milestones.map((milestone, index) => (
                  <TimelineItem key={index}>
                    {index !== milestones.length - 1 && <TimelineConnector />}
                    <TimelineHeader>
                      <TimelineIcon className="bg-[#ff6347] shadow-md shadow-[#ff6347]/30">
                        {index === milestones.length - 1 ? 
                          <RocketLaunchIcon className="h-4 w-4" /> : 
                          <TrophyIcon className="h-4 w-4" />
                        }
                      </TimelineIcon>
                      <Typography variant="h5" className="text-xl font-semibold text-gray-800 ml-2">
                        {milestone.title} <span className="text-[#ff6347]">({milestone.year})</span>
                      </Typography>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <Typography className="text-gray-700">
                        {milestone.description}
                      </Typography>
                    </TimelineBody>
                  </TimelineItem>
                ))}
              </Timeline>
            </TabPanel>
            
            <TabPanel value="values" className="py-6">
              <Typography variant="h3" className="text-3xl font-bold mb-8 text-gray-800 text-center">
                The Values That Drive Us
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="flex bg-white rounded-xl p-6 shadow-md">
                    <div className="mr-4">
                      <div className="bg-red-50 rounded-full p-3 text-[#ff6347] shadow-md shadow-red-100">
                        {value.icon}
                      </div>
                    </div>
                    <div>
                      <Typography variant="h5" className="text-xl font-semibold text-gray-800 mb-2">
                        {value.title}
                      </Typography>
                      <Typography className="text-gray-600">
                        {value.description}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>

    </div>
  );
}

export default About;