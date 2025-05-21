import React, { useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  Select,
  Option,
  Alert,
} from "@material-tailwind/react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  const [formStatus, setFormStatus] = useState({
    status: null, // null, "success", or "error"
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        status: "error",
        message: "Please fill out all required fields.",
      });
      return;
    }

    // Here you would normally send the form data to your backend
    // For demo purposes, we'll just simulate a successful submission
    
    // Simulate an API call
    setTimeout(() => {
      setFormStatus({
        status: "success",
        message: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      });
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      // Reset status after a delay
      setTimeout(() => {
        setFormStatus({ status: null, message: "" });
      }, 5000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: "Visit Us",
      content: "123 Innovation Drive, San Francisco, CA 94103, USA",
    },
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
    },
    {
      icon: <EnvelopeIcon className="h-6 w-6" />,
      title: "Email Us",
      content: "contact@scandine.com",
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Office Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM PST",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#ff6347] to-red-600 py-16 md:py-24 rounded-lg mx-4">
        <div className="container mx-auto px-4 text-center text-white">
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold mb-4">
            Get In Touch
          </Typography>
          <Typography variant="lead" className="max-w-2xl mx-auto opacity-90">
            Have questions about our service or interested in partnering with us? We're here to help!
          </Typography>
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <div className="lg:w-2/3">
            <Card className="p-4 md:p-8 shadow-lg">
              <CardBody>
                <Typography variant="h3" className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                  Send Us a Message
                </Typography>
                
                {formStatus.status && (
                  <Alert
                    variant="filled"
                    color={formStatus.status === "success" ? "green" : "red"}
                    icon={formStatus.status === "success" ? <CheckCircleIcon className="h-6 w-6" /> : <ExclamationCircleIcon className="h-6 w-6" />}
                    className="mb-6"
                    animate={{
                      mount: { y: 0 },
                      unmount: { y: -100 },
                    }}
                  >
                    {formStatus.message}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <Input
                        type="text"
                        name="name"
                        label="Full Name"
                        color="red"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="focus:border-[#ff6347]"
                      />
                    </div>
                    
                    {/* Email */}
                    <div>
                      <Input
                        type="email"
                        name="email"
                        label="Email Address"
                        color="red"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="focus:border-[#ff6347]"
                      />
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <Input
                        type="tel"
                        name="phone"
                        label="Phone Number"
                        color="red"
                        value={formData.phone}
                        onChange={handleChange}
                        className="focus:border-[#ff6347]"
                      />
                    </div>
                    
                    {/* Subject */}
                    <div>
                      <Select
                        label="Subject"
                        color="red"
                        value={formData.subject}
                        onChange={handleSubjectChange}
                        className="focus:border-[#ff6347]"
                      >
                        <Option value="general">General Inquiry</Option>
                        <Option value="support">Technical Support</Option>
                        <Option value="partnership">Restaurant Partnership</Option>
                        <Option value="feedback">Feedback & Suggestions</Option>
                        <Option value="press">Press & Media</Option>
                        <Option value="careers">Careers</Option>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="mt-6">
                    <Textarea
                      name="message"
                      label="Your Message"
                      color="red"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="mt-8">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-[#ff6347] hover:bg-red-600"
                      size="lg"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
          
          {/* Contact Info */}
          <div className="lg:w-1/3">
            <Typography variant="h3" className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              Contact Information
            </Typography>
            
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 mt-1">
                    <div className="bg-red-50 rounded-full p-3 text-[#ff6347]">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <Typography variant="h6" className="font-semibold text-gray-800 mb-1">
                      {item.title}
                    </Typography>
                    <Typography className="text-gray-600">
                      {item.content}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Social Media */}
            <div className="mt-12">
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                Follow Us
              </Typography>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-100 hover:bg-[#ff6347] hover:text-white text-gray-600 p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-100 hover:bg-[#ff6347] hover:text-white text-gray-600 p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-100 hover:bg-[#ff6347] hover:text-white text-gray-600 p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-100 hover:bg-[#ff6347] hover:text-white text-gray-600 p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;