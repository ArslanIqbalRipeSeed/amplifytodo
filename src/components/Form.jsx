import React from "react";

const Form = (props) => {
  const { formInput,imageRef, handleChange, handleImage, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="Add Task"></label>
      <input type="file" ref={imageRef}  onChange={handleImage} />
      <input type="text" value={formInput} onChange={handleChange} />
      <button type="submit">Add</button>
    </form>
  );
};

export default Form;
