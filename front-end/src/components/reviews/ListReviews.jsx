import React from "react";
import StarRatings from "react-star-ratings";

const defaultAvatar =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGARx09qceP-KQTPCEfL6ob0s1-M4M9wh5MAJvMyegqA&s";

const ListReviews = ({ reviews = [] }) => {
  const totalReviews = reviews?.length || 0;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0) /
        totalReviews
      : 0;

  const ratingStats = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter(
      (review) => Number(review?.rating) === star
    ).length;

    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

    return {
      star,
      count,
      percent,
    };
  });

  return (
    <div className="reviews-wrapper">
      <h3 className="reviews-title">
        Customer Reviews ({totalReviews})
      </h3>

      <div className="review-summary-card">
        <div className="review-score-box">
          <div className="review-score">
            ⭐ {averageRating.toFixed(2)}
            <span>/5</span>
          </div>

          <p>{totalReviews} đánh giá</p>
        </div>

        <div className="review-bars">
          {ratingStats.map((item) => (
            <div className="review-bar-row" key={item.star}>
              <span>{item.star} ⭐</span>

              <div className="review-bar-bg">
                <div
                  className="review-bar-fill"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>

              <strong>{item.percent.toFixed(0)}%</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-list">
        {reviews?.map((review) => (
          <div key={review?._id} className="review-card">
            <div className="review-header">
              <div className="review-user-info">
                <img
                  src={review?.user?.avatar || defaultAvatar}
                  alt={review?.user?.name || "User"}
                  className="review-avatar"
                />

                <div>
                  <h5>{review?.user?.name || "Anonymous User"}</h5>
                  <p>Verified Reader</p>
                </div>
              </div>

              <StarRatings
                rating={Number(review?.rating || 0)}
                starRatedColor="#ffb829"
                starEmptyColor="#d8dee9"
                numberOfStars={5}
                name={`rating-${review?._id}`}
                starDimension="22px"
                starSpacing="1px"
              />
            </div>

            <p className="review-comment">{review?.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListReviews;