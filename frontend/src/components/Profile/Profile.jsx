import React, { useEffect, useState, useRef } from "react";
import { useGetProfileQuery, useUpdateAvatarMutation, useUpdateNameMutation } from "../../slices/apiSlice";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import {
  PencilIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  IdentificationIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: userData, isLoading, refetch, error } = useGetProfileQuery();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [updateName, { isLoading: isUpdatingProfile }] = useUpdateNameMutation();
  const fileInputRef = useRef(null);
  
  // State for avatar
  const [avatar, setAvatar] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // State for name editing
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");

  // Initialize states from userData when it's available
  useEffect(() => {
    if (userData) {
      setAvatar(userData.avatar);
      setNewName(userData.name);
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const handleOpenNameDialog = () => {
    setNewName(userData.name);
    setNameError("");
    setOpenNameDialog(true);
  };
  
  const handleCloseNameDialog = () => {
    setOpenNameDialog(false);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleUpdateName = async () => {
    // Validate name
    if (!newName.trim()) {
      setNameError("Name cannot be empty");
      return;
    }
    
    if (newName.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    
    try {
      await updateName({
        userId: userData._id,
        name: newName.trim()
      }).unwrap();
      
      // Close dialog and refetch user data
      setOpenNameDialog(false);
      refetch();
      toast.success("name updated successfully"); 
    } catch (error) {
      console.error("Error updating name:", error);
      setNameError("Failed to update name. Please try again.");
    }
  };

  const handleAvatarButtonClick = () => {
    // This triggers the hidden file input
    fileInputRef.current.click();
  };

  // Function to compress image
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions to maintain aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to Blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }
              
              // Create a new file from the blob
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              
              resolve({
                file: compressedFile,
                dataUrl: canvas.toDataURL(file.type, quality),
                width,
                height
              });
            },
            file.type,
            quality
          );
        };
        img.onerror = (error) => {
          reject(error);
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      setUploadError("No file selected");
      return;
    }
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }
    
    try {
      // Clear previous errors
      setUploadError(null);
      
      // Compress the image
      const compressed = await compressImage(file, 400, 400, 0.7);
      
      // Update preview with compressed image
      setPreviewUrl(compressed.dataUrl);
      
      // Update the avatar using the mutation
      const response = await updateAvatar({
        userId: userData._id,
        avatar: compressed.dataUrl  // Send base64 string directly if your API supports it
      }).unwrap();
      
      // On successful update
      setAvatar(response.avatar || compressed.dataUrl);
      
      // Refetch to get updated user data
      refetch();
      toast.success("updated with success");
    } catch (error) {
      console.error("Error updating avatar:", error);
      setUploadError("Failed to update avatar. Image may be too large.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="red">
          Error: {error.message}
        </Typography>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Link to="/">
        <Button
          size="medium"
          variant="outlined"
          color="black"
          className="mx-auto rounded-full"
        >
          Go back
        </Button>
      </Link>
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
        <Card className="w-full max-w-[64rem] mx-auto shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <CardHeader
            floated={false}
            className="h-60 bg-slate-300 relative overflow-hidden"
            style={{
              backgroundImage: `url(${assets.Black_banner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <Typography
                variant="h2"
                className="text-center text-white font-bold tracking-wider animate-pulse"
              >
                Welcome to Scan&Dine
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="text-center relative px-6 py-12">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <Avatar
                  size="xxl"
                  alt="Profile"
                  className="border-4 border-white shadow-lg h-40 w-40 object-cover"
                  src={previewUrl || avatar || userData?.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80"}
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer"
                  onClick={handleAvatarButtonClick}
                >
                  <PhotoIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
              />
              
              {uploadError && (
                <Typography color="red" className="mt-2 text-sm">
                  {uploadError}
                </Typography>
              )}
              
              {isUpdatingAvatar && (
                <Typography color="blue" className="mt-2 text-sm">
                  Updating avatar...
                </Typography>
              )}
            </div>
            
            <div className="mt-20">
              <Typography variant="h3" color="blue-gray" className="mb-2">
                {userData.name}
              </Typography>
              <Typography
                color="blue-gray"
                className="font-medium text-lg bg-blue-gray-50 inline-block px-4 py-1 rounded-full"
              >
                {userData.role === "admin"
                  ? "Administrator"
                  : userData.role === "manager"
                  ? "Manager"
                  : "User"}
              </Typography>
            </div>
          </CardBody>

          <CardBody className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileItem
                icon={<EnvelopeIcon className="h-6 w-6" />}
                label="Email"
                value={userData.email}
              />
              <ProfileItem
                icon={<CalendarIcon className="h-6 w-6" />}
                label="Member Since"
                value={formatDate(userData.createdAt)}
              />
              <ProfileItem
                icon={<ClockIcon className="h-6 w-6" />}
                label="Last Updated"
                value={formatDate(userData.updatedAt)}
              />
              <ProfileItem
                icon={<IdentificationIcon className="h-6 w-6" />}
                label="User ID"
                value={userData._id}
              />
            </div>
          </CardBody>

          <CardFooter className="flex justify-center pt-2 pb-6">
            <Button
              size="lg"
              color="blue-gray"
              className="flex items-center gap-3 px-6 py-3 bg-blue-gray-800 hover:bg-blue-gray-900 transition-all duration-300"
              onClick={handleOpenNameDialog}
            >
              <PencilIcon strokeWidth={2} className="h-5 w-5" /> Edit Name
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Name Edit Dialog */}
      <Dialog open={openNameDialog} handler={handleCloseNameDialog}>
        <DialogHeader className="flex justify-between items-center">
          <Typography variant="h5">Edit Your Name</Typography>
          <XMarkIcon 
            className="h-5 w-5 cursor-pointer" 
            onClick={handleCloseNameDialog}
          />
        </DialogHeader>
        <DialogBody divider>
          <div className="mb-4">
            <Input
              label="Name"
              value={newName}
              onChange={handleNameChange}
              error={!!nameError}
            />
            {nameError && (
              <Typography color="red" className="mt-2 text-xs">
                {nameError}
              </Typography>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button 
            variant="outlined" 
            color="red" 
            onClick={handleCloseNameDialog} 
            className="flex items-center gap-2"
          >
            <XMarkIcon className="h-4 w-4" /> Cancel
          </Button>
          <Button 
            color="green" 
            onClick={handleUpdateName} 
            className="flex items-center gap-2"
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <span>Updating...</span>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" /> Save
              </>
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div className="mr-4 text-blue-gray-500">{icon}</div>
    <div>
      <Typography variant="h6" color="blue-gray" className="mb-1">
        {label}
      </Typography>
      <Typography variant="small" className="text-slate-700 font-medium">
        {value}
      </Typography>
    </div>
  </div>
);

export default Profile;