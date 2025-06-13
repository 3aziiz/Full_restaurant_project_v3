import React, { useEffect, useState, useRef } from "react";
import { 
  useGetProfileQuery, 
  useUpdateAvatarMutation, 
  useUpdateNameMutation,
  useUpdateBirthdayMutation,
  useUpdatePhoneNumberMutation
} from "../../slices/apiSlice";
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
  PhoneIcon,
  CakeIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ChangePassword from "../ForgetPassword/ChangePassword"; // Import your ChangePassword component

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: userData, isLoading, refetch, error } = useGetProfileQuery();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [updateName, { isLoading: isUpdatingName }] = useUpdateNameMutation();
  const [updateBirthday, { isLoading: isUpdatingBirthday }] = useUpdateBirthdayMutation();
  const [updatePhoneNumber, { isLoading: isUpdatingPhone }] = useUpdatePhoneNumberMutation();
  const fileInputRef = useRef(null);
  
  // State for avatar
  const [avatar, setAvatar] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  
  // State for individual field editing
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    name: "",
    phoneNumber: "",
    birthday: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Initialize states from userData when it's available
  useEffect(() => {
    if (userData) {
      setAvatar(userData.avatar);
      setFieldValues({
        name: userData.name || "",
        phoneNumber: userData.phoneNumber || "",
        birthday: userData.birthday ? userData.birthday.split('T')[0] : ""
      });
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setEditingField(null);
    setFieldErrors({});
  };
console.log(userData)
  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handleStartEditField = (field) => {
    setEditingField(field);
    setFieldValues(prev => ({
      ...prev,
      [field]: field === 'name' ? userData.name || "" : 
               field === 'phoneNumber' ? userData.phoneNumber || "" :
               field === 'birthday' ? (userData.birthday ? userData.birthday.split('T')[0] : "") : ""
    }));
    setFieldErrors({});
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setFieldErrors({});
  };

  const handleFieldChange = (field, value) => {
    setFieldValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return "Name cannot be empty";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        break;
      case 'phoneNumber':
        if (value && !/^\+?[\d\s\-\(\)]{7,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return "Please enter a valid phone number (7-15 digits)";
        }
        break;
      case 'birthday':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          if (birthDate > today) return "Birthday cannot be in the future";
          
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age > 120) return "Please enter a valid birthday";
        }
        break;
      default:
        break;
    }
    return "";
  };

  const handleSaveField = async (field) => {
    const error = validateField(field, fieldValues[field]);
    if (error) {
      setFieldErrors({ [field]: error });
      return;
    }

    try {
      switch (field) {
        case 'name':
          await updateName({
            name: fieldValues.name.trim()
          }).unwrap();
          toast.success("Name updated successfully");
          break;
        case 'phoneNumber':
          await updatePhoneNumber({
            phoneNumber: fieldValues.phoneNumber.trim()
          }).unwrap();
          toast.success("Phone number updated successfully");
          break;
        case 'birthday':
          await updateBirthday({
            birthday: fieldValues.birthday
          }).unwrap();
          toast.success("Birthday updated successfully");
          break;
        default:
          break;
      }
      
      setEditingField(null);
      refetch();
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      const errorMessage = error?.data?.message || `Failed to update ${field}. Please try again.`;
      setFieldErrors({ [field]: errorMessage });
      toast.error(errorMessage);
    }
  };

  const getFieldLoadingState = (field) => {
    switch (field) {
      case 'name':
        return isUpdatingName;
      case 'phoneNumber':
        return isUpdatingPhone;
      case 'birthday':
        return isUpdatingBirthday;
      default:
        return false;
    }
  };

  const handleAvatarButtonClick = () => {
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
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
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
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }
              
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
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }
    
    try {
      setUploadError(null);
      
      const compressed = await compressImage(file, 400, 400, 0.7);
      setPreviewUrl(compressed.dataUrl);
      
      const response = await updateAvatar({
        userId: userData._id,
        avatar: compressed.dataUrl
      }).unwrap();
      
      setAvatar(response.avatar || compressed.dataUrl);
      refetch();
      toast.success("Avatar updated successfully");
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
                Welcome to QuickTable
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
                isEditMode={false} // Email is always read-only
              />
              
              <EditableProfileItem
                icon={<PencilIcon className="h-6 w-6" />}
                label="Name"
                value={userData.name}
                fieldKey="name"
                isEditMode={isEditMode}
                isEditing={editingField === 'name'}
                editValue={fieldValues.name}
                error={fieldErrors.name}
                onStartEdit={handleStartEditField}
                onCancel={handleCancelEdit}
                onSave={handleSaveField}
                onChange={handleFieldChange}
                isLoading={getFieldLoadingState('name')}
                type="text"
              />
              
              <EditableProfileItem
                icon={<PhoneIcon className="h-6 w-6" />}
                label="Phone"
                value={userData.phoneNumber || "Not provided"}
                fieldKey="phoneNumber"
                isEditMode={isEditMode}
                isEditing={editingField === 'phoneNumber'}
                editValue={fieldValues.phoneNumber}
                error={fieldErrors.phoneNumber}
                onStartEdit={handleStartEditField}
                onCancel={handleCancelEdit}
                onSave={handleSaveField}
                onChange={handleFieldChange}
                isLoading={getFieldLoadingState('phoneNumber')}
                type="tel"
                placeholder="+1234567890"
              />
              
              <EditableProfileItem
                icon={<CakeIcon className="h-6 w-6" />}
                label="Birthday"
                value={userData.birthday ? formatDate(userData.birthday) : "Not provided"}
                fieldKey="birthday"
                isEditMode={isEditMode}
                isEditing={editingField === 'birthday'}
                editValue={fieldValues.birthday}
                error={fieldErrors.birthday}
                onStartEdit={handleStartEditField}
                onCancel={handleCancelEdit}
                onSave={handleSaveField}
                onChange={handleFieldChange}
                isLoading={getFieldLoadingState('birthday')}
                type="date"
              />
              
              <ProfileItem
                icon={<CalendarIcon className="h-6 w-6" />}
                label="Member Since"
                value={formatDate(userData.createdAt)}
                isEditMode={false}
              />
              
              <ProfileItem
                icon={<ClockIcon className="h-6 w-6" />}
                label="Last Updated"
                value={formatDate(userData.updatedAt)}
                isEditMode={false}
              />
            </div>
          </CardBody>

          <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
            <Button
              size="lg"
              color={isEditMode ? "red" : "blue-gray"}
              className="flex items-center gap-3 px-6 py-3 transition-all duration-300"
              onClick={handleToggleEditMode}
            >
              {isEditMode ? (
                <>
                  <XMarkIcon strokeWidth={2} className="h-5 w-5" /> Cancel Edit
                </>
              ) : (
                <>
                  <PencilIcon strokeWidth={2} className="h-5 w-5" /> Edit Profile
                </>
              )}
            </Button>
            <Button
              size="lg"
              color="orange"
              className="flex items-center gap-3 px-6 py-3 bg-orange-600 hover:bg-orange-700 transition-all duration-300"
              onClick={handleOpenPasswordDialog}
            >
              <KeyIcon strokeWidth={2} className="h-5 w-5" /> Change Password
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} handler={handleClosePasswordDialog} size="lg">
        <DialogHeader className="flex justify-between items-center">
          <Typography variant="h5">Change Password</Typography>
          <XMarkIcon 
            className="h-5 w-5 cursor-pointer" 
            onClick={handleClosePasswordDialog}
          />
        </DialogHeader>
        <DialogBody divider className="p-0">
          <ChangePassword onClose={handleClosePasswordDialog} />
        </DialogBody>
      </Dialog>
    </>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div className="mr-4 text-blue-gray-500">{icon}</div>
    <div className="flex-1">
      <Typography variant="h6" color="blue-gray" className="mb-1">
        {label}
      </Typography>
      <Typography variant="small" className="text-slate-700 font-medium">
        {value}
      </Typography>
    </div>
  </div>
);

const EditableProfileItem = ({ 
  icon, 
  label, 
  value, 
  fieldKey, 
  isEditMode, 
  isEditing, 
  editValue, 
  error, 
  onStartEdit, 
  onCancel, 
  onSave, 
  onChange, 
  isLoading,
  type = "text",
  placeholder 
}) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div className="mr-4 text-blue-gray-500">{icon}</div>
    <div className="flex-1">
      <Typography variant="h6" color="blue-gray" className="mb-1">
        {label}
      </Typography>
      
      {isEditing ? (
        <div className="space-y-2">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            error={!!error}
            placeholder={placeholder}
            size="sm"
          />
          {error && (
            <Typography color="red" className="text-xs">
              {error}
            </Typography>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              color="green"
              onClick={() => onSave(fieldKey)}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              {isLoading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckIcon className="h-3 w-3" /> Save
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outlined"
              color="red"
              onClick={onCancel}
              className="flex items-center gap-1"
            >
              <XMarkIcon className="h-3 w-3" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Typography variant="small" className="text-slate-700 font-medium">
            {value}
          </Typography>
          {isEditMode && (
            <Button
              size="sm"
              variant="outlined"
              color="blue"
              onClick={() => onStartEdit(fieldKey)}
              className="ml-2"
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  </div>
);

export default Profile;