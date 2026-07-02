import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import {
  useCanUserReviewQuery,
  useSubmitReviewMutation,
} from "../../redux/api/productApi.js";
import toast from "react-hot-toast";

const NewReview = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitReview, { isLoading, error, isSuccess }] =
    useSubmitReviewMutation();

  const { data } = useCanUserReviewQuery(productId);
  const canReview = data?.canReview;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Review posted successfully");
      setRating(0);
      setComment("");
    }
  }, [error, isSuccess]);

  const submitHandler = () => {
    if (!rating || !comment.trim()) {
      toast.error("Please add rating and comment");
      return;
    }

    const reviewData = {
      rating,
      comment,
      productId,
    };

    submitReview(reviewData);
  };

  return (
    <div className="new-review-wrapper">
      {canReview && (
        <button
          id="review_btn"
          type="button"
          className="review-submit-btn"
          data-bs-toggle="modal"
          data-bs-target="#ratingModal"
        >
          Write a Review
        </button>
      )}

      <div
        className="modal fade"
        id="ratingModal"
        tabIndex="-1"
        aria-labelledby="ratingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content review-modal">
            <div className="modal-header">
              <h5 className="modal-title" id="ratingModalLabel">
                Write Your Review
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="text-center mb-4">
                <StarRatings
                  rating={rating}
                  starRatedColor="#ffb829"
                  starHoverColor="#ffb829"
                  numberOfStars={5}
                  name="rating"
                  changeRating={(value) => setRating(value)}
                  starDimension="34px"
                  starSpacing="4px"
                />
              </div>

              <textarea
                name="review"
                id="review"
                className="form-control review-textarea"
                placeholder="Share your thoughts about this book..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>

              <button
                id="new_review_btn"
                className="btn w-100 my-4 px-4"
                data-bs-dismiss={rating && comment.trim() ? "modal" : ""}
                aria-label="Close"
                onClick={submitHandler}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReview;