import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./ModalUpdateAdatar.scss";
import axiosInstance from "../../../service/AxiosInstance";
import { RYI_URL } from "../../../URL_BE/urlbackend";

export default function ModalUpdateAvatar({
  onClose,
  selectedImage,
  onSetProfile,
}) {
  // const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  //   const handleFileChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setSelectedFile(reader.result);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleUpdate = () => {
  //     if (!selectedFile) {
  //       setError("Please select a file to upload");
  //       return;
  //     }

  //     const requestData = {
  //       avatar: selectedFile,
  //     };

  //     axiosInstance
  //       .put(`${RYI_URL}/Account/update-avatar`, requestData)
  //       .then((response) => {
  //         console.log(response);
  //         setUploadSuccess(true);
  //         onClose(); // Close the modal after successful update
  //       })
  //       .catch((error) => {
  //         console.error("There was an error updating the avatar!", error);
  //         setError("Failed to update avatar. Please try again.");
  //       });
  //   };

  const handleSave = async () => {
    const fileInput = document.getElementById("image-upload");
    if (fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append("request", fileInput.files[0]);

      try {
        const response = await axiosInstance.put(
          `${RYI_URL}/Account/update-avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Image uploaded successfully", response.data);
        // update profile picture in the UI
        onSetProfile((prev) => ({ ...prev, profilePic: response.data.data }));

        onClose();
      } catch (error) {
        console.error("Error uploading image", error);
        // Handle error
        setError("Failed to update avatar. Please try again.");
      }
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <Form>
                    <Form.Group>
                        <Form.Label>Select Avatar</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                    {error && <p className="text-danger">{error}</p>}
                    {uploadSuccess && <p className="text-success">Avatar updated successfully!</p>}
                </Form> */}
        <img src={selectedImage} className="rounded-image" alt="Selected" />
        {error && <p className="text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Update Avatar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
