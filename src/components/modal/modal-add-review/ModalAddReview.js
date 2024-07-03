import React, { useState } from "react";
import "./ModalAddReview.scss";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import axiosInstance from "../../../service/AxiosInstance";
import { RYI_URL } from "../../../URL_BE/urlbackend";
import StarRatingComponent from "react-star-rating-component";

export default function ModalAddReview({ mentorId, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState([]);

  const data = {
    rating: rating,
    comment: comment,
    menteeApplicationId: mentorId,
  };

  const handleSaveFeedback = () => {
    axiosInstance
      .post(`${RYI_URL}/Feedback/send-feedback`, data)
      .then((res) => {
        console.log("Sent successfully", res);
        console.log("ID", data);
        onClose();
      })
      .catch((err) => {
        console.log("Save feedback error: ", err);
        setErrors(err.response.data.errors);
      });
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Review Mentor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label className="label-rating">Rating:</label>
          <StarRatingComponent
            name="rate1"
            starCount={5}
            value={rating}
            onStarClick={(nextValue) => {
              setRating(nextValue);
            }}
          />
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Comment:
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </InputGroup>

        {errors.Rating && (
          <small className="error-message">{errors.Rating[0]}</small>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveFeedback}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
