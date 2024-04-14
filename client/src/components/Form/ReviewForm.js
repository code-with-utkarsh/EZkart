import React from "react";

const ReviewForm = ({ handleCreate, handleUpdate ,isUpdate, value, setValue }) => {
  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    setValue({ ...value, rating: newValue });
  };

  return (
    <div className="">
      <form onSubmit={isUpdate ? handleUpdate : handleCreate}>
        <fieldset className="starability-basic pb-0 mb-0" required>
          <input
            type="radio"
            id="no-rate"
            className="input-no-rate"
            name="rating"
            value="0"
            checked={value.rating === 0}
            onChange={handleChange}
            aria-label="No rating."
            required
          />
          <input
            type="radio"
            id="first-rate1"
            name="rating"
            value="1"
            checked={value.rating === 1}
            onChange={handleChange}
            required
          />
          <label htmlFor="first-rate1" title="Terrible">
            1 star
          </label>
          <input
            type="radio"
            id="first-rate2"
            name="rating"
            value="2"
            checked={value.rating === 2}
            onChange={handleChange}
            required
          />
          <label htmlFor="first-rate2" title="Not good">
            2 stars
          </label>
          <input
            type="radio"
            id="first-rate3"
            name="rating"
            value="3"
            checked={value.rating === 3}
            onChange={handleChange}
            required
          />
          <label htmlFor="first-rate3" title="Average">
            3 stars
          </label>
          <input
            type="radio"
            id="first-rate4"
            name="rating"
            value="4"
            checked={value.rating === 4}
            onChange={handleChange}
            required
          />
          <label htmlFor="first-rate4" title="Very good">
            4 stars
          </label>
          <input
            type="radio"
            id="first-rate5"
            name="rating"
            value="5"
            checked={value.rating === 5}
            onChange={handleChange}
            required
          />
          <label htmlFor="first-rate5" title="Amazing">
            5 stars
          </label>
        </fieldset>

        <div className="form-group mb-2">
          <textarea
            className="form-control"
            id="messageInput"
            rows="4"
            cols="55"
            value={value?.body}
            onChange={(e) => setValue({ ...value, body: e.target.value })}
            placeholder="Write your review here..."
            required
          />
        </div>
        <div className="form-group d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-success">
            {isUpdate ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
